/**
 * SCORING — chấm điểm phiên làm bài và ước lượng điểm TOEIC L-R.
 *
 * Hàm thuần: chỉ đọc `bank` + `session`, không sửa gì, không chạm DOM.
 */
import type { Letter, Part, Question, QuestionBank, Section } from '../types'
import {
  SCALE_MAX,
  SCALE_PER_SECTION_MAX,
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

/**
 * Số câu chính thức của mỗi section trong đề thật: nghe 100 (Part 1–4),
 * đọc 100 (Part 5–7).
 *
 * Vì sao cần hằng số này: công thức cũ chỉ chia `đúng / tổng của section TRONG
 * PHIÊN`, nên làm 6/6 câu Part 1 cho ra 495 điểm — tức điểm tuyệt đối. Điều đó
 * vô lý: 6 câu không đại diện cho 100 câu nghe của đề thật, và người làm đúng
 * 6 câu dễ không thể coi là đạt điểm tối đa.
 *
 * Cách tính đúng: coi các câu KHÔNG có trong phiên như câu chưa làm (0 điểm).
 * Nhờ vậy làm ít câu thì điểm thấp một cách hợp lý, và chỉ khi làm đủ 100 câu
 * nghe với tỉ lệ đúng cao mới tiến gần 495.
 */
const OFFICIAL_SECTION_COUNT: Record<Section, number> = {
  listening: 100,
  reading: 100,
}

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

/**
 * Điểm một section khi quy đổi về đề thật.
 *
 * `correct` là số câu đúng trong phiên; `official` là số câu chính thức của
 * section đó trong đề thật (100 cho mỗi kỹ năng). Câu không có trong phiên được
 * coi là chưa làm.
 *
 * Ví dụ: làm 6 câu Part 1, đúng 6 → 6/100 × 495 = 30 điểm nghe (không phải 495).
 * Làm đủ 100 câu nghe, đúng 80 → 80/100 × 495 = 396 điểm.
 *
 * Kẹp tối thiểu bằng 0 (không phải 5) vì 0 câu đúng trong phiên ngắn không nên
 * bị đẩy lên 5 điểm — 5 điểm là mức sàn của một bài THI THẬT có làm bài.
 */
function officialSectionScore(correct: number, official: number): number {
  if (!(official > 0)) return 0
  const raw = Math.round((correct / official) * SCALE_PER_SECTION_MAX)
  return clamp(raw, 0, SCALE_PER_SECTION_MAX)
}

/**
 * Ước lượng điểm TOEIC L-R từ kết quả chấm.
 *
 * Công thức (đúng đặc tả, KHÔNG hard-code):
 *   điểm phần = round((số câu đúng / 100) × 495), kẹp 0..495
 *   section không có câu nào → 0
 *   total = listening + reading, kẹp 0..990
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

  /**
   * Điểm từng section.
   *
   * Dùng `OFFICIAL_SECTION_COUNT` (100 câu mỗi kỹ năng) làm mẫu số, KHÔNG dùng
   * `totals` (số câu có trong phiên). Lý do: làm 6 câu Part 1 mà chia cho 6 sẽ
   * ra điểm tuyệt đối 495 — vô lý, vì 6 câu không đại diện cho 100 câu nghe.
   * Coi các câu không có trong phiên là chưa làm thì điểm mới phản ánh đúng.
   *
   * `totals` vẫn được tính ở trên để biết section nào CÓ MẶT trong phiên; section
   * không có câu nào thì điểm bằng 0 chứ không phải "đúng 0/0".
   */
  const listening = totals.listening > 0
    ? officialSectionScore(corrects.listening, OFFICIAL_SECTION_COUNT.listening)
    : 0
  const reading = totals.reading > 0
    ? officialSectionScore(corrects.reading, OFFICIAL_SECTION_COUNT.reading)
    : 0
  const total = clamp(listening + reading, 0, SCALE_MAX)

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

