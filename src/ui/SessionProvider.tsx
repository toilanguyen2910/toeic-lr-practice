import { useCallback, useMemo, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import {
  answerQuestion,
  clearSession,
  createSession,
  loadSession,
  pushHistory,
  saveSession,
  scoreSession,
  submitSession,
  tickSession,
  toggleFlag,
} from '../lib'
import type { HistoryEntry, Session, SessionOptions } from '../lib/contract'
import type { Letter, Part, QuestionBank } from '../types'
import { SessionContext } from './sessionContext'
import type { SessionContextValue } from './sessionContext'

/**
 * Chủ sở hữu duy nhất của trạng thái phiên.
 *
 * Mọi phép biến đổi phiên (tạo, trả lời, đánh dấu, tick giờ, nộp) đều gọi hàm
 * của `engine` trong `src/lib` — UI không tự tính điểm, không tự đặt trạng thái.
 * Phiên được lưu lại sau mỗi thay đổi để nút "Tiếp tục" và màn hình kết quả còn
 * dữ liệu sau khi tải lại trang.
 */
export function SessionProvider({ bank, children }: { bank: QuestionBank; children: ReactNode }) {
  // Đọc phiên đang dở (hoặc phiên vừa nộp) từ localStorage ngay lần render đầu.
  const [session, setSessionState] = useState<Session | null>(loadSession)
  const sessionRef = useRef<Session | null>(session)

  /** Ghi phiên mới vào state + ref + localStorage trong một bước. */
  const commit = useCallback((next: Session | null) => {
    sessionRef.current = next
    setSessionState(next)
    if (next) saveSession(next)
    else clearSession()
  }, [])

  const availableParts = useMemo<Part[]>(() => {
    const seen = new Set<Part>()
    for (const question of bank.questions) seen.add(question.part)
    return [...seen].sort((a, b) => a - b)
  }, [bank])

  const start = useCallback(
    (options: SessionOptions) => {
      const next = createSession(bank, options)
      commit(next)
      return next
    },
    [bank, commit],
  )

  const answer = useCallback(
    (questionId: string, letter: Letter | null) => {
      const current = sessionRef.current
      if (!current) return
      commit(answerQuestion(current, questionId, letter))
    },
    [commit],
  )

  const flag = useCallback(
    (questionId: string) => {
      const current = sessionRef.current
      if (!current) return
      commit(toggleFlag(current, questionId))
    },
    [commit],
  )

  const syncElapsed = useCallback(
    (seconds: number) => {
      const current = sessionRef.current
      if (!current || current.status !== 'active') return
      if (current.elapsedSeconds === seconds) return
      commit(tickSession(current, seconds))
    },
    [commit],
  )

  const finish = useCallback(
    (elapsedSeconds: number) => {
      const current = sessionRef.current
      // Đã nộp rồi thì thôi — tránh đẩy trùng một bản ghi lịch sử.
      if (!current || current.status === 'submitted') return current

      const submitted = submitSession(tickSession(current, Math.max(0, Math.round(elapsedSeconds))))
      commit(submitted)

      const scored = scoreSession(bank, submitted)
      // Số hiệu đề suy ra từ tiền tố id (`exam7-...`), xem docblock của `examSetId`.
      const matched = /^exam(\d{1,2})-/.exec(submitted.id)
      const finishedSetId = matched ? Number(matched[1]) : null
      const setNumber =
        finishedSetId != null && Number.isInteger(finishedSetId) && finishedSetId >= 1 && finishedSetId <= 20
          ? finishedSetId
          : null

      const entry: HistoryEntry = {
        id: submitted.id,
        mode: submitted.mode,
        parts: submitted.parts,
        finishedAt: submitted.submittedAt ?? Date.now(),
        correct: scored.correct,
        total: scored.total,
        estimateTotal: scored.estimate.total,
        elapsedSeconds: submitted.elapsedSeconds,
        ...(setNumber != null ? { examSetId: setNumber } : {}),
      }
      pushHistory(entry)

      return submitted
    },
    [bank, commit],
  )

  const reset = useCallback(() => commit(null), [commit])

  /** Nạp thẳng một phiên đã dựng sẵn (dùng cho bộ 20 đề). */
  const adopt = useCallback((next: Session) => commit(next), [commit])

  /**
   * Số hiệu đề đang làm, suy ra từ `session.id`.
   *
   * Vì sao nhét vào `session.id` thay vì thêm trường: `Session` là hợp đồng với
   * engine và đã được chốt; thêm trường sẽ phải sửa `parseSession`, `storage` và
   * toàn bộ test tương ứng chỉ để lưu một con số. Đặt tiền tố vào id là đủ và
   * không phá vỡ gì: id dạng `exam7-...` nghĩa là đề 7.
   */
  const examSetId = useMemo(() => {
    if (!session) return null
    const match = /^exam(\d{1,2})-/.exec(session.id)
    if (!match) return null
    const id = Number(match[1])
    return Number.isInteger(id) && id >= 1 && id <= 20 ? id : null
  }, [session])

  const result = useMemo(() => {
    if (!session || session.status !== 'submitted') return null
    return scoreSession(bank, session)
  }, [bank, session])

  const value = useMemo<SessionContextValue>(
    () => ({
      session,
      result,
      availableParts,
      start,
      answer,
      flag,
      syncElapsed,
      finish,
      reset,
      adopt,
      examSetId,
      bank,
    }),
    [session, result, availableParts, start, answer, flag, syncElapsed, finish, reset, adopt, examSetId, bank],
  )

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
}
