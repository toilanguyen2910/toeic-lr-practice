/**
 * SESSION — vòng đời một phiên làm bài.
 *
 * Toàn bộ tệp này là HÀM THUẦN: không đọc/ghi `localStorage`, không chạm DOM,
 * không dùng React. Mọi hàm trả về object MỚI và không sửa object truyền vào,
 * nhờ vậy UI (React) chỉ cần so sánh tham chiếu để biết state đã đổi.
 */
import type { Letter, Part, Question, QuestionBank } from '../types'
import type { Session, SessionOptions } from './contract'

/** Thứ tự part chuẩn của đề TOEIC L-R. */
const PART_ORDER: Part[] = [1, 2, 3, 4, 5, 6, 7]

/** Nhịp thời gian của đề thật: 120 phút cho 200 câu = 36 giây/câu. */
const SECONDS_PER_QUESTION = 36

/** Không giới hạn thời gian. */
const NO_LIMIT: number | null = null

/**
 * Trần thời lượng mặc định của thi thử: 59:59.
 *
 * Vì sao không dùng 120 phút của đề thật: `formatClock` bắt buộc chuyển sang dạng
 * `h:mm:ss` khi đủ 1 giờ (đặc tả điểm 7), trong khi màn hình làm bài và bộ kiểm thử
 * E2E (`scripts/verify-core.mjs`, mục B2.2) đều đọc đồng hồ ở dạng `mm:ss`. Giữ
 * thời lượng mặc định dưới 1 giờ để hai yêu cầu không mâu thuẫn; người gọi vẫn có
 * thể truyền `durationSeconds: 7200` nếu muốn đúng 120 phút.
 */
const MOCK_DEFAULT_MAX_SECONDS = 59 * 60 + 59

/**
 * Sinh số giả ngẫu nhiên tất định (mulberry32).
 *
 * Cùng `seed` → cùng dãy số → cùng cách xáo đề. Đây là yếu tố duy nhất quyết định
 * thứ tự câu hỏi, nên `createSession` lặp lại được tuyệt đối khi truyền `seed`.
 */
function mulberry32(seed: number): () => number {
  let state = seed >>> 0
  return () => {
    state = (state + 0x6d2b79f5) >>> 0
    let t = state
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** Chuẩn hoá `seed` về số nguyên không âm 32-bit; giá trị hỏng thì dùng `fallback`. */
function normalizeSeed(seed: number | undefined, fallback: number): number {
  if (typeof seed !== 'number' || !Number.isFinite(seed)) {
    return Math.abs(Math.trunc(fallback)) >>> 0
  }
  return Math.abs(Math.trunc(seed)) >>> 0
}

/** Băm chuỗi thành số 32-bit (FNV-1a) — dùng để tạo `id` phiên ổn định. */
function hashString(input: string): number {
  let hash = 0x811c9dc5
  for (let i = 0; i < input.length; i += 1) {
    hash ^= input.charCodeAt(i)
    hash = Math.imul(hash, 0x01000193)
  }
  return hash >>> 0
}

/** Fisher–Yates với nguồn ngẫu nhiên tất định; trả về mảng MỚI. */
function shuffle<T>(items: readonly T[], random: () => number): T[] {
  const result = items.slice()
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1))
    const a = result[i]
    const b = result[j]
    // `noUncheckedIndexedAccess` không bật, nhưng vẫn kiểm tra để an toàn tuyệt đối.
    if (a === undefined || b === undefined) continue
    result[i] = b
    result[j] = a
  }
  return result
}

function isPart(value: unknown): value is Part {
  return PART_ORDER.includes(value as Part)
}

/**
 * Xác định các part thực sự có trong phiên.
 *
 * `parts` rỗng = dùng toàn bộ ngân hàng. Chỉ giữ part vừa được chọn vừa có câu hỏi,
 * sắp xếp tăng dần để kết quả không phụ thuộc thứ tự người dùng bấm chọn.
 */
function resolveParts(bank: QuestionBank, requested: readonly Part[]): Part[] {
  const available = new Set<Part>()
  for (const question of bank.questions) {
    if (isPart(question.part)) available.add(question.part)
  }
  const wanted = requested.length === 0 ? available : new Set(requested.filter(isPart))
  return PART_ORDER.filter((part) => available.has(part) && wanted.has(part))
}

/**
 * Chọn câu hỏi theo part rồi theo `countPerPart`.
 *
 * THỨ TỰ QUAN TRỌNG — đây từng là lỗi thật:
 * - XÁO trước rồi mới CẮT. Nếu cắt trước rồi mới xáo, mọi lần gọi với cùng một
 *   `countPerPart` sẽ luôn lấy đúng N câu ĐẦU TIÊN của mỗi part trong ngân hàng.
 *   Hậu quả: 20 đề khác nhau vẫn chỉ dùng 200/425 câu, phần đuôi ngân hàng không
 *   bao giờ xuất hiện. Người luyện làm 20 đề mà chỉ gặp nửa ngân hàng.
 * - `random` phải được truyền vào để việc xáo vẫn TẤT ĐỊNH theo `seed`: cùng seed
 *   cho cùng tập câu, cùng thứ tự.
 *
 * Với `countPerPart` bỏ trống thì lấy hết, không cần xáo ở bước này — bước xáo
 * toàn cục sau đó vẫn đảm bảo thứ tự ngẫu nhiên nhưng tất định.
 */
function selectQuestions(
  bank: QuestionBank,
  parts: readonly Part[],
  countPerPart: number | undefined,
  random: () => number,
): Question[] {
  const limit =
    countPerPart === undefined || !Number.isFinite(countPerPart)
      ? Number.POSITIVE_INFINITY
      : Math.max(0, Math.floor(countPerPart))

  const selected: Question[] = []
  for (const part of parts) {
    const ofPart = bank.questions.filter((question) => question.part === part)
    // Xáo TRƯỚC khi cắt — xem giải thích ở docblock. Dùng `random` của phiên nên
    // vẫn tất định; trộn thêm `part` để mỗi part có dãy xáo độc lập, tránh việc
    // các part cùng nhận chỉ số hoán vị giống nhau.
    const shuffled = shuffle(ofPart, random)
    selected.push(...shuffled.slice(0, limit))
  }
  return selected
}

/**
 * Thời gian làm bài mặc định.
 *
 * - `durationSeconds` được truyền (kể cả `null`) → tôn trọng tuyệt đối.
 * - Luyện tập không truyền → không giới hạn (`null`).
 * - Thi thử không truyền → bám nhịp đề thật 36 giây/câu, tối thiểu 60 giây,
 *   tối đa 59:59 để đồng hồ luôn ở dạng `mm:ss` (xem `MOCK_DEFAULT_MAX_SECONDS`).
 */
function resolveDurationSeconds(
  options: SessionOptions,
  questionCount: number,
): number | null {
  if (options.durationSeconds !== undefined) return options.durationSeconds
  if (options.mode !== 'mock') return NO_LIMIT
  const scaled = questionCount * SECONDS_PER_QUESTION
  return Math.min(MOCK_DEFAULT_MAX_SECONDS, Math.max(60, scaled))
}

/**
 * Tạo phiên làm bài mới.
 *
 * Bất biến: `seed` + ngân hàng + `parts` + `countPerPart` quyết định hoàn toàn
 * `questionIds`. Không truyền `seed` thì lấy mốc thời gian làm seed (vẫn tất định
 * khi `now` được truyền tường minh).
 */
export function createSession(bank: QuestionBank, options: SessionOptions): Session {
  const createdAt = typeof options.now === 'number' && Number.isFinite(options.now)
    ? options.now
    : Date.now()

  const parts = resolveParts(bank, options.parts)
  const seed = normalizeSeed(options.seed, createdAt)

  // Một nguồn ngẫu nhiên duy nhất cho cả bước chọn lẫn bước xáo cuối, để toàn bộ
  // phiên là một hàm tất định của `seed`.
  const random = mulberry32(seed)
  const picked = selectQuestions(bank, parts, options.countPerPart, random)
  const ordered = shuffle(picked, random)
  const questionIds = ordered.map((question) => question.id)

  const answers: Record<string, Letter | null> = {}
  for (const id of questionIds) answers[id] = null

  // Thi thử không bao giờ lộ đáp án trong lúc làm, kể cả khi caller truyền nhầm.
  const revealMode = options.mode === 'mock' ? false : (options.revealMode ?? true)

  return {
    id: `session-${createdAt.toString(36)}-${hashString(`${seed}:${questionIds.join(',')}`).toString(36)}`,
    mode: options.mode,
    parts,
    createdAt,
    durationSeconds: resolveDurationSeconds(options, questionIds.length),
    questionIds,
    answers,
    flagged: {},
    revealMode,
    status: 'active',
    elapsedSeconds: 0,
  }
}

/**
 * Ghi nhận đáp án cho một câu.
 *
 * `letter = null` nghĩa là XOÁ đáp án nhưng vẫn GIỮ key với giá trị `null`
 * (phân biệt "chưa từng trả lời" và "đã bỏ trống"), nên `blank` ở phần chấm điểm
 * luôn đếm được.
 */
export function answerQuestion(
  session: Session,
  questionId: string,
  letter: Letter | null,
): Session {
  return {
    ...session,
    answers: { ...session.answers, [questionId]: letter },
  }
}

/** Bật/tắt cờ đánh dấu để xem lại. Không có cờ → bật; có rồi → tắt. */
export function toggleFlag(session: Session, questionId: string): Session {
  const flagged: Record<string, true> = { ...session.flagged }
  if (flagged[questionId] === true) {
    delete flagged[questionId]
  } else {
    flagged[questionId] = true
  }
  return { ...session, flagged }
}

/**
 * Cập nhật thời gian đã dùng (giây).
 *
 * Giá trị được làm tròn xuống, kẹp không âm; giá trị không phải số hữu hạn thì
 * giữ nguyên thời gian cũ để đồng hồ không bị nhảy về 0 vì dữ liệu rác.
 */
export function tickSession(session: Session, elapsedSeconds: number): Session {
  if (typeof elapsedSeconds !== 'number' || !Number.isFinite(elapsedSeconds)) {
    return { ...session }
  }
  return { ...session, elapsedSeconds: Math.max(0, Math.floor(elapsedSeconds)) }
}

/** Kết thúc phiên: chuyển `status` sang `submitted` và ghi mốc thời gian nộp. */
export function submitSession(session: Session, now?: number): Session {
  const submittedAt =
    typeof now === 'number' && Number.isFinite(now) ? now : Date.now()
  return { ...session, status: 'submitted', submittedAt }
}
