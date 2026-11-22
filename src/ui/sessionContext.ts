import { createContext, useContext } from 'react'
import type { Session, SessionOptions, SessionResult } from '../lib/contract'
import type { Letter, Part, QuestionBank } from '../types'

/**
 * Trạng thái phiên làm bài dùng chung cho mọi màn hình.
 *
 * Vì sao cần context thay vì state cục bộ: `#/practice/session`, `#/mock`,
 * `#/result` và `#/review` là bốn route riêng nhưng cùng đọc một phiên. Router
 * tự viết không mang được state qua `hashchange`, mà mỗi route lại unmount khi
 * đổi hash.
 */
export interface SessionContextValue {
  /** Phiên hiện tại: đang làm hoặc đã nộp. `null` khi chưa có. */
  session: Session | null
  /** Kết quả chấm của phiên đã nộp (do `engine.scoreSession` tính). */
  result: SessionResult | null
  /** Danh sách part thực sự có câu hỏi trong ngân hàng. */
  availableParts: Part[]
  /** Tạo phiên mới theo `options`. */
  start: (options: SessionOptions) => Session
  /** Ghi nhận đáp án cho một câu. */
  answer: (questionId: string, letter: Letter | null) => void
  /** Bật/tắt cờ đánh dấu của một câu. */
  flag: (questionId: string) => void
  /** Cập nhật thời gian đã dùng (gọi định kỳ từ đồng hồ). */
  syncElapsed: (seconds: number) => void
  /** Kết thúc phiên, lưu lịch sử, trả về phiên đã nộp. */
  finish: (elapsedSeconds: number) => Session | null
  /**
   * Nạp một phiên đã dựng sẵn vào provider.
   *
   * Dùng cho bộ 20 đề: `buildExamSet` đã tự chọn câu và xếp theo part, nên không
   * thể đi qua `start()` (vốn gọi `createSession` và xáo lại toàn bộ).
   */
  adopt: (session: Session) => void
  /** Xoá phiên hiện tại khỏi bộ nhớ và localStorage. */
  reset: () => void
  /** Bật/tắt chế độ hiện đáp án ngay (dành cho chế độ luyện tập). */
  setRevealMode: (enabled: boolean) => void
  /** Số hiệu đề đang làm (1..20), `null` nếu làm tự do. */
  examSetId: number | null
  /** Ngân hàng câu hỏi thật đang dùng. */
  bank: QuestionBank
}

export const SessionContext = createContext<SessionContextValue | null>(null)

/** Truy cập trạng thái phiên. Ném lỗi nếu dùng ngoài `SessionProvider`. */
export function useSession(): SessionContextValue {
  const value = useContext(SessionContext)
  if (!value) throw new Error('useSession phải nằm trong <SessionProvider>')
  return value
}

/** Chỉ cần ngân hàng + số hiệu đề (màn chọn đề không cần hàm điều khiển phiên). */
export function useBankContext(): { bank: QuestionBank; examSetId: number | null } {
  const { bank, examSetId } = useSession()
  return { bank, examSetId }
}
