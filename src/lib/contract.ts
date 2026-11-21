/**
 * HỢP ĐỒNG API — tệp này chỉ chứa KIỂU và TÀI LIỆU, không chứa mã chạy.
 *
 * `engine` phải export đúng các hàm dưới đây từ `src/lib/index.ts`.
 * `ui` chỉ được gọi những hàm này để lấy logic nghiệp vụ; UI không tự tính điểm.
 */
import type { Letter, Part, QuestionBank } from '../types'

export type SessionMode = 'practice' | 'mock'

export type SessionStatus = 'active' | 'submitted'

export interface Session {
  id: string
  mode: SessionMode
  /** Các part có trong bài. Rỗng nghĩa là dùng toàn bộ ngân hàng. */
  parts: Part[]
  createdAt: number
  /** Tổng thời gian làm bài (giây). `null` = không giới hạn. */
  durationSeconds: number | null
  questionIds: string[]
  /** `null` = chưa trả lời (phân biệt với "bỏ trống ở câu đã xem"). */
  answers: Record<string, Letter | null>
  /** Đánh dấu để xem lại. */
  flagged: Record<string, true>
  /** Luyện tập: hiện giải thích ngay sau khi chọn đáp án. */
  revealMode: boolean
  status: SessionStatus
  submittedAt?: number
  /** Thời gian đã dùng (giây), cập nhật bởi UI mỗi giây. */
  elapsedSeconds: number
}

export interface SessionOptions {
  mode: SessionMode
  parts: Part[]
  /** Số câu mỗi part; bỏ trống = lấy toàn bộ câu của các part đó. */
  countPerPart?: number
  /**
   * Số câu riêng cho từng part — ưu tiên cao hơn `countPerPart`.
   *
   * Dùng khi người dùng nhập TỔNG số câu rồi muốn chia theo tỉ lệ đề thật
   * (xem `allocateByOfficialRatio`). Part không có trong đối tượng này thì lấy
   * `countPerPart`, và nếu cũng không có thì lấy hết câu của part đó.
   */
  countByPart?: Partial<Record<Part, number>>
  /** Số nguyên cố định giúp xáo đề lặp lại được (phục vụ test). */
  seed?: number
  durationSeconds?: number | null
  revealMode?: boolean
  now?: number
}

export interface PartBreakdown {
  part: Part
  total: number
  correct: number
  wrong: number
  blank: number
  accuracy: number
}

export interface ScoreEstimate {
  /** Điểm ước lượng mỗi phần trên thang 5–495. */
  listening: number
  reading: number
  /** Tổng trên thang 10–990 = listening + reading. */
  total: number
  /** `true` khi ước lượng dựa trên bộ câu rút gọn, không phải đề 200 câu. */
  approximate: boolean
  /** Ghi chú hiển thị cho người học về độ tin cậy của ước lượng. */
  note: string
}

export interface SessionResult {
  correct: number
  wrong: number
  blank: number
  total: number
  accuracy: number
  byPart: PartBreakdown[]
  byTag: Array<{ tag: string; total: number; correct: number; accuracy: number }>
  estimate: ScoreEstimate
}

/** Một bản ghi lịch sử luyện tập, đủ nhẹ để lưu vào localStorage. */
export interface HistoryEntry {
  id: string
  mode: SessionMode
  parts: Part[]
  finishedAt: number
  correct: number
  total: number
  estimateTotal: number
  elapsedSeconds: number
  /**
   * Số hiệu đề (1..20) nếu phiên này làm từ bộ đề, `undefined` nếu làm tự do.
   * Nhờ trường này màn hình chọn đề hiển thị được "đã làm mấy lần, cao nhất bao nhiêu".
   */
  examSetId?: number
  /**
   * Phiên bản công thức chấm điểm dùng để tính `estimateTotal`.
   *
   * Vì sao cần: công thức đã đổi một lần (xem `scoring.ts`). Bản ghi cũ tính
   * theo công thức cũ nên điểm không so sánh được với bản ghi mới — ví dụ làm 6
   * câu Part 1 đúng hết ra 495 điểm, trong khi cùng bài đó theo công thức mới chỉ
   * khoảng 30. Không có trường này thì lịch sử trộn hai thang điểm khác nhau và
   * "điểm cao nhất" sẽ luôn là bản ghi cũ sai.
   *
   * Bản ghi thiếu trường này là bản ghi cũ (trước khi có trường) và bị coi là
   * không đáng tin để so sánh.
   */
  scoringVersion?: number
}

/** Phiên bản công thức chấm điểm hiện tại. Tăng số này mỗi khi đổi công thức. */
export const SCORING_VERSION = 2

export interface Settings {
  /** Hiện giải thích ngay khi chọn đáp án ở chế độ luyện tập. */
  revealMode: boolean
  /** Bật âm thanh đọc đề (nếu trình duyệt hỗ trợ). */
  audioEnabled: boolean
  /** Số câu mặc định cho mỗi part ở chế độ luyện tập. */
  practiceCountPerPart: number
}

/**
 * Các hàm `engine` PHẢI export từ `src/lib/index.ts`.
 *
 * Ghi chú thiết kế: mọi hàm là hàm thuần (trừ các hàm storage), KHÔNG chạm DOM,
 * KHÔNG import React. Nhờ vậy chúng kiểm thử được bằng Vitest ở môi trường Node.
 */
export interface EngineApi {
  /** Tạo phiên mới; xáo câu hỏi theo `seed` nếu có. */
  createSession: (bank: QuestionBank, options: SessionOptions) => Session
  /** Ghi nhận đáp án, trả về phiên mới (không sửa phiên cũ). */
  answerQuestion: (session: Session, questionId: string, letter: Letter | null) => Session
  /** Bật/tắt cờ đánh dấu để xem lại. */
  toggleFlag: (session: Session, questionId: string) => Session
  /** Cập nhật thời gian đã dùng. */
  tickSession: (session: Session, elapsedSeconds: number) => Session
  /** Kết thúc phiên; `now` để test ổn định. */
  submitSession: (session: Session, now?: number) => Session
  /** Chấm điểm. Yêu cầu phiên đã submit hoặc chế độ luyện tập. */
  scoreSession: (bank: QuestionBank, session: Session) => SessionResult

  /** Đọc/ghi trạng thái phiên đang làm dở (dùng cho nút "Tiếp tục"). */
  saveSession: (session: Session) => void
  loadSession: () => Session | null
  clearSession: () => void

  loadHistory: () => HistoryEntry[]
  pushHistory: (entry: HistoryEntry) => HistoryEntry[]
  clearHistory: () => void

  loadSettings: () => Settings
  saveSettings: (settings: Settings) => Settings

  /** `mm:ss` hoặc `h:mm:ss` khi ≥ 1 giờ. */
  formatClock: (seconds: number) => string
  /** Ước lượng điểm từ kết quả chấm; tách riêng để kiểm thử độc lập. */
  estimateScore: (bank: QuestionBank, session: Session, result: SessionResult) => ScoreEstimate
}

export const DEFAULT_SETTINGS: Settings = {
  revealMode: true,
  audioEnabled: true,
  practiceCountPerPart: 10,
}

/** Khoá localStorage. Tất cả dữ liệu của app nằm dưới các khoá này. */
export const STORAGE_KEYS = {
  settings: 'toeic-lr/v1/settings',
  session: 'toeic-lr/v1/session',
  history: 'toeic-lr/v1/history',
} as const
