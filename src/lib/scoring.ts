/**
 * SCORING — chấm điểm phiên làm bài và ước lượng điểm TOEIC L-R.
 *
 * Hàm thuần: chỉ đọc `bank` + `session`, không sửa gì, không chạm DOM.
 */
import type { Letter, Part, Question, QuestionBank, Section } from '../types'
import {
  SCALE_MAX,
  SCALE_MIN,
  SCALE_PER_SECTION_MAX,
  SCALE_PER_SECTION_MIN,
  sectionOfPart,
} from '../types'
import type {
  PartBreakdown,
  ScoreEstimate,
  Session,
  SessionResult,
} from './contract'

/** Số câu của đề TOEIC L-R đầy đủ — mốc để biết điểm có phải ước lượng không. */
const FULL_EXAM_QUESTION_COUNT = 200

/** Làm tròn 1 chữ số thập phân, tránh `-0` và `NaN`. */
function round1(value: number): number {
  if (!Number.isFinite(value)) return 0
  const rounded = Math.round(value * 10) / 10
  return Object.is(rounded, -0) ? 0 : rounded
}

/** Phần trăm đúng trên tổng; tổng ≤ 0 thì trả 0 (không chia cho 0). */
function percent(correct: number, total: number): number {
  if (!(total > 0)) return 0
  return round1((correct / total) * 100)
}

function clamp(value: number, min: number, max: number): number {
  if (!Number.isFinite(value)) return min
  return Math.min(max, Math.max(min, value))
}

/** Đáp án người học đã chọn; `null` hoặc thiếu key đều nghĩa là "bỏ trống". */
function pickedLetter(session: Session, questionId: string): Letter | null {
  return session.answers[questionId] ?? null
}

/** Chỉ mục id → câu hỏi, dựng một lần cho mỗi lần chấm. */
function indexBank(bank: QuestionBank): Map<string, Question> {
  const byId = new Map<string, Question>()
  for (const question of bank.questions) byId.set(question.id, question)
  return byId
}

interface Tally {
  total: number
  correct: number
  blank: number
}

function emptyTally(): Tally {
  return { total: 0, correct: 0, blank: 0 }
}

/**
 * Chấm một phiên làm bài.
 *
 * Quy ước:
 * - `blank` = câu có `answers[id] == null` (thiếu key hoặc giá trị `null`).
 * - `byPart` chỉ chứa part thật sự có trong phiên, sắp xếp tăng dần.
 * - `byTag` đếm theo từng tag, sắp xếp theo alphabet để UI hiển thị ổn định.
 * - `accuracy` là phần trăm làm tròn 1 chữ số thập phân.
 *
 * Hàm không ném lỗi và cũng không kiểm tra `status`: phiên đang làm dở vẫn chấm
 * được (chế độ luyện tập cần điều đó). Câu có id không nằm trong ngân hàng bị bỏ
 * qua vì không thể xác định đúng/sai.
 */
export function scoreSession(bank: QuestionBank, session: Session): SessionResult {
  const byId = indexBank(bank)

  const partTally = new Map<Part, Tally>()
  const tagTally = new Map<string, Tally>()
  const tally: Tally = emptyTally()
  let correct = 0
  let wrong = 0
  let blank = 0

  for (const questionId of session.questionIds) {
    const question = byId.get(questionId)
    if (!question) continue

    const picked = pickedLetter(session, questionId)
    const hit = picked !== null && picked === question.answer

    tally.total += 1
    if (hit) {
      correct += 1
      tally.correct += 1
    } else if (picked === null) {
      blank += 1
      tally.blank += 1
    } else {
      wrong += 1
    }

    const partEntry = partTally.get(question.part) ?? emptyTally()
    partEntry.total += 1
    if (hit) partEntry.correct += 1
    if (picked === null) partEntry.blank += 1
    partTally.set(question.part, partEntry)

    for (const tag of question.tags) {
      const tagEntry = tagTally.get(tag) ?? emptyTally()
      tagEntry.total += 1
      if (hit) tagEntry.correct += 1
      tagTally.set(tag, tagEntry)
    }
  }

  const byPart: PartBreakdown[] = [...partTally.entries()]
    .sort((a, b) => a[0] - b[0])
    .map(([part, entry]) => ({
      part,
      total: entry.total,
      correct: entry.correct,
      wrong: entry.total - entry.correct - entry.blank,
      blank: entry.blank,
      accuracy: percent(entry.correct, entry.total),
    }))

  const byTag = [...tagTally.entries()]
    .sort((a, b) => (a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0))
    .map(([tag, entry]) => ({
      tag,
      total: entry.total,
      correct: entry.correct,
      accuracy: percent(entry.correct, entry.total),
    }))

  const partial: Omit<SessionResult, 'estimate'> = {
    correct,
    wrong,
    blank,
    total: tally.total,
    accuracy: percent(correct, tally.total),
    byPart,
    byTag,
  }

  // `estimateScore` cần một `SessionResult`; điểm ước lượng không phụ thuộc chính nó
  // nên dùng tạm giá trị trung tính rồi thay bằng kết quả thật.
  const placeholder: SessionResult = {
    ...partial,
    estimate: {
      listening: 0,
      reading: 0,
      total: 0,
      approximate: false,
      note: '',
    },
  }

  return { ...partial, estimate: estimateScore(bank, session, placeholder) }
}

/** Điểm một section trên thang 5–495; section không có câu nào thì 0. */
function sectionScore(correct: number, total: number): number {
  if (!(total > 0)) return 0
  const raw = Math.round((correct / total) * SCALE_PER_SECTION_MAX)
  return clamp(raw, SCALE_PER_SECTION_MIN, SCALE_PER_SECTION_MAX)
}

/**
 * Ước lượng điểm TOEIC L-R từ kết quả chấm.
 *
 * Công thức (đúng đặc tả, KHÔNG hard-code):
 *   điểm phần = round((số câu đúng / số câu của section trong phiên) × 495), kẹp 5..495
 *   section không có câu nào → 0
 *   total = listening + reading, kẹp 10..990
 *
 * `approximate = true` khi tổng số câu < 200 (đề rút gọn), kèm `note` tiếng Việt.
 */
export function estimateScore(
  bank: QuestionBank,
  session: Session,
  result: SessionResult,
): ScoreEstimate {
  const byId = indexBank(bank)

  // Số câu mỗi section trong phiên — lấy từ chính phiên (nguồn sự thật).
  const totals: Record<Section, number> = { listening: 0, reading: 0 }
  for (const questionId of session.questionIds) {
    const question = byId.get(questionId)
    if (!question) continue
    const section = question.section ?? sectionOfPart(question.part)
    totals[section] += 1
  }

  // Số câu đúng mỗi section: cộng từ `byPart` để điểm khớp đúng màn hình kết quả.
  const corrects: Record<Section, number> = { listening: 0, reading: 0 }
  for (const entry of result.byPart) {
    const section = sectionOfPart(entry.part)
    corrects[section] += Number.isFinite(entry.correct) ? Math.max(0, entry.correct) : 0
  }

  const listening = sectionScore(corrects.listening, totals.listening)
  const reading = sectionScore(corrects.reading, totals.reading)
  const total = clamp(listening + reading, SCALE_MIN, SCALE_MAX)

  const questionCount =
    Number.isFinite(result.total) && result.total >= 0
      ? result.total
      : session.questionIds.length
  const approximate = questionCount < FULL_EXAM_QUESTION_COUNT

  const note = approximate
    ? `Điểm chỉ là ước lượng: bài làm có ${questionCount}/` +
      `${FULL_EXAM_QUESTION_COUNT} câu so với đề thi thật, nên điểm thực tế có thể ` +
      'chênh lệch. Hãy dùng điểm này để theo dõi tiến bộ, không phải để dự đoán ' +
      'điểm thi chính thức.'
    : 'Điểm ước lượng theo tỉ lệ câu đúng của đề đủ ' +
      `${FULL_EXAM_QUESTION_COUNT} câu; điểm thi chính thức vẫn có thể chênh lệch ` +
      'do cách quy đổi của từng kỳ thi.'

  return { listening, reading, total, approximate, note }
}
