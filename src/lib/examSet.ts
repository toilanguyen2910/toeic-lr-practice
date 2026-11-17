/**
 * 20 ĐỀ THI THỬ — "bộ đề tự giao nhau".
 *
 * Ý tưởng: không phải 20 bộ câu hỏi rời rạc, mà là 20 cách CHỌN KHÁC NHAU từ cùng
 * một ngân hàng câu hỏi. Vì ngân hàng nhỏ hơn tổng nhu cầu của 20 đề, các đề tất yếu
 * dùng chung câu — đó chính là "giao nhau".
 *
 * Ví dụ với 425 câu và 6 đề đầy đủ 200 câu: mỗi câu trung bình nằm trong ~2,8 đề.
 * Người luyện không thể học thuộc "đề số 7" rồi coi như đã biết hết, nhưng vẫn có
 * cảm giác mỗi lần làm là một đề khác.
 *
 * Ba điều quan trọng:
 * 1. TẤT ĐỊNH — đề số N luôn cho đúng bộ câu đó, ở đúng thứ tự đó, trên mọi máy.
 *    Nhờ vậy bản ghi lịch sử "đã làm đề 7" là đáng tin, và so sánh điểm giữa các
 *    lần làm lại cùng một đề là so sánh công bằng.
 * 2. MỖI ĐỀ PHỦ ĐỦ 7 PART theo tỉ lệ đề thật (nếu ngân hàng đủ câu).
 * 3. KHÔNG ĐỀ NÀO TRÙNG ĐỀ NÀO — xác nhận bằng test.
 */
import type { Part, QuestionBank } from '../types'
import { ALL_PARTS, PART_META } from '../types'
import { createSession } from './session'
import type { Session, SessionOptions } from './contract'

/** Số đề có sẵn. */
export const EXAM_SET_COUNT = 20

/**
 * Cấu hình một đề.
 *
 * `mix` là cách chọn câu cho từng part:
 * - `'official'` — lấy đúng số câu như đề thi thật (Part 1: 6, Part 2: 25, …)
 * - `'half'` — khoảng một nửa (làm nhanh, khoảng 100 câu)
 * - `'quick'` — khoảng một phần tư (làm trong vài phút)
 */
export type ExamSetMix = 'official' | 'half' | 'quick'

export interface ExamSetDef {
  /** Số hiệu đề, từ 1 đến 20. */
  id: number
  /** Nhãn hiển thị, ví dụ "Đề 07". */
  label: string
  /** Tên gợi nhớ, để người học phân biệt bằng mắt. */
  name: string
  mix: ExamSetMix
  /**
   * Số nguyên cố định đưa vào `createSession`. Không đổi sau khi phát hành — đổi
   * là mọi lịch sử cũ của đề đó thành vô nghĩa.
   */
  seed: number
  /** Số câu mục tiêu (chỉ để hiển thị; số thật phụ thuộc ngân hàng). */
  targetCount: number
}

/**
 * 20 đề.
 *
 * Phân tầng có chủ đích: 5 đề ngắn (làm lúc rảnh), 5 đề vừa, 10 đề đủ dài.
 *
 * `targetCount` phải là SỐ THẬT mà công thức sinh ra, không phải con số mong muốn.
 * Đây từng là lỗi: bản đầu ghi 13 câu cho đề "nhanh" trong khi `countPerPartFor`
 * thực tế cho 52 câu (vì mỗi part luôn được ít nhất 1 câu, và tỉ lệ part phải giữ
 * đúng như đề thật). Con số trên thẻ đề nay khớp với số câu thật của phiên.
 */
export const EXAM_SETS: ExamSetDef[] = [
  { id: 1, label: 'Đề 01', name: 'Ngắn — Nghe', mix: 'quick', seed: 1001, targetCount: 52 },
  { id: 2, label: 'Đề 02', name: 'Ngắn — Đọc', mix: 'quick', seed: 1002, targetCount: 52 },
  { id: 3, label: 'Đề 03', name: 'Ngắn — Trộn A', mix: 'quick', seed: 1003, targetCount: 52 },
  { id: 4, label: 'Đề 04', name: 'Ngắn — Trộn B', mix: 'quick', seed: 1004, targetCount: 52 },
  { id: 5, label: 'Đề 05', name: 'Ngắn — Trộn C', mix: 'quick', seed: 1005, targetCount: 52 },

  { id: 6, label: 'Đề 06', name: 'Vừa sức — Nghe', mix: 'half', seed: 1006, targetCount: 101 },
  { id: 7, label: 'Đề 07', name: 'Vừa sức — Đọc', mix: 'half', seed: 1007, targetCount: 101 },
  { id: 8, label: 'Đề 08', name: 'Vừa sức — Trộn A', mix: 'half', seed: 1008, targetCount: 101 },
  { id: 9, label: 'Đề 09', name: 'Vừa sức — Trộn B', mix: 'half', seed: 1009, targetCount: 101 },
  { id: 10, label: 'Đề 10', name: 'Vừa sức — Trộn C', mix: 'half', seed: 1010, targetCount: 101 },

  { id: 11, label: 'Đề 11', name: 'Sát đề thật — A', mix: 'official', seed: 1011, targetCount: 200 },
  { id: 12, label: 'Đề 12', name: 'Sát đề thật — B', mix: 'official', seed: 1012, targetCount: 200 },
  { id: 13, label: 'Đề 13', name: 'Sát đề thật — C', mix: 'official', seed: 1013, targetCount: 200 },
  { id: 14, label: 'Đề 14', name: 'Sát đề thật — D', mix: 'official', seed: 1014, targetCount: 200 },
  { id: 15, label: 'Đề 15', name: 'Sát đề thật — E', mix: 'official', seed: 1015, targetCount: 200 },
  { id: 16, label: 'Đề 16', name: 'Sát đề thật — F', mix: 'official', seed: 1016, targetCount: 200 },
  { id: 17, label: 'Đề 17', name: 'Sát đề thật — G', mix: 'official', seed: 1017, targetCount: 200 },
  { id: 18, label: 'Đề 18', name: 'Sát đề thật — H', mix: 'official', seed: 1018, targetCount: 200 },
  { id: 19, label: 'Đề 19', name: 'Sát đề thật — I', mix: 'official', seed: 1019, targetCount: 200 },
  { id: 20, label: 'Đề 20', name: 'Sát đề thật — J', mix: 'official', seed: 1020, targetCount: 200 },
]

/** Hệ số số câu theo từng kiểu đề. */
const MIX_FACTOR: Record<ExamSetMix, number> = {
  official: 1,
  half: 0.5,
  quick: 0.25,
}

/**
 * Số câu mỗi part cho một đề, dựa trên số câu chính thức của part đó nhân hệ số,
 * rồi kẹp theo số câu thực có trong ngân hàng.
 *
 * Kẹp là bắt buộc: nếu ngân hàng chỉ có 8 câu Part 1 mà đòi 6 câu thì ổn, nhưng
 * nếu ngân hàng chỉ có 3 câu thì phải lấy 3 chứ không được bịa thêm.
 */
export function countPerPartFor(mix: ExamSetMix, bank: QuestionBank): Partial<Record<Part, number>> {
  const available = new Map<Part, number>()
  for (const question of bank.questions) {
    available.set(question.part, (available.get(question.part) ?? 0) + 1)
  }

  const result: Partial<Record<Part, number>> = {}
  for (const part of ALL_PARTS) {
    const have = available.get(part) ?? 0
    if (have === 0) continue
    const wanted = Math.max(1, Math.round(PART_META[part].officialCount * MIX_FACTOR[mix]))
    result[part] = Math.min(wanted, have)
  }
  return result
}

/**
 * Số câu thật của một đề trên ngân hàng cụ thể.
 * Vì `createSession` chỉ nhận MỘT `countPerPart` cho mọi part, mà các part có số
 * câu chính thức khác nhau, ta phải tự dựng danh sách câu rồi tạo phiên từ đó.
 */
export function buildExamSet(bank: QuestionBank, set: ExamSetDef, now?: number): Session {
  const counts = countPerPartFor(set.mix, bank)

  // Chọn câu theo từng part bằng đúng cơ chế xáo tất định của engine: tạo một phiên
  // tạm cho riêng part đó với seed dẫn xuất, rồi lấy đúng số câu mong muốn.
  const pickedIds: string[] = []
  for (const part of ALL_PARTS) {
    const want = counts[part]
    if (!want) continue
    const options: SessionOptions = {
      mode: 'mock',
      parts: [part],
      countPerPart: want,
      // Seed dẫn xuất để mỗi part xáo độc lập nhưng vẫn tất định theo đề.
      seed: set.seed * 31 + part,
      now,
      revealMode: false,
    }
    pickedIds.push(...createSession(bank, options).questionIds)
  }

  // Ghép lại thành một phiên duy nhất, giữ nguyên thứ tự part 1 → 7 như đề thật.
  const finalOptions: SessionOptions = {
    mode: 'mock',
    parts: [],
    seed: set.seed,
    now,
    revealMode: false,
    durationSeconds: null,
  }
  const shell = createSession(bank, finalOptions)

  const ordered = pickedIds
  const byId = new Map(bank.questions.map((q) => [q.id, q]))
  const partOrder = (id: string) => byId.get(id)?.part ?? 99

  const sorted = [...ordered].sort((a, b) => {
    const pa = partOrder(a)
    const pb = partOrder(b)
    if (pa !== pb) return pa - pb
    return ordered.indexOf(a) - ordered.indexOf(b)
  })

  return {
    ...shell,
    // Tiền tố `exam<N>-` để mọi nơi (SessionProvider, lịch sử) nhận ra phiên này
    // thuộc đề nào mà không phải thêm trường vào hợp đồng `Session`.
    id: `exam${set.id}-${shell.id}`,
    parts: [...new Set(sorted.map(partOrder))] as Part[],
    questionIds: sorted,
    answers: Object.fromEntries(sorted.map((id) => [id, null])),
    flagged: {},
  }
}

/** Tổng số câu một đề sẽ có, không cần dựng phiên. */
export function examSetSize(bank: QuestionBank, set: ExamSetDef): number {
  const counts = countPerPartFor(set.mix, bank)
  let total = 0
  for (const value of Object.values(counts)) total += value ?? 0
  return total
}

/** Tìm đề theo số hiệu. Trả `undefined` nếu ngoài khoảng 1..20. */
export function findExamSet(id: number): ExamSetDef | undefined {
  return EXAM_SETS.find((set) => set.id === id)
}
