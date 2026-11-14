import { useEffect, useRef } from 'react'
import { ROUTES, TID } from '../testids'
import { suggestedDurationSeconds } from '../hooks/sessionDuration'
import { SessionPage } from './SessionPage'
import { useSession } from './sessionContext'
import type { BankIndex } from '../hooks/useBankIndex'

/**
 * `#/mock` là cả điểm vào lẫn màn hình làm bài thi thử.
 *
 * Mở route này khi chưa có phiên thi thử đang làm (hoặc phiên cũ đã nộp, hoặc
 * phiên đang là luyện tập) thì tạo một phiên thi thử mới. Đây cũng là đích của
 * nút "Thi thử" ở trang chủ, nên không thể yêu cầu thêm bước trung gian.
 *
 * `key={session.id}` buộc màn hình làm bài khởi tạo lại khi sang phiên khác —
 * nếu không, vị trí câu và đồng hồ sẽ giữ lại của phiên trước.
 */
export function MockRoute({ index }: { index: BankIndex }) {
  const { session, start } = useSession()
  const createdRef = useRef(false)

  const isActiveMock = session != null && session.mode === 'mock' && session.status === 'active'

  useEffect(() => {
    if (isActiveMock || createdRef.current) return
    createdRef.current = true
    start({
      mode: 'mock',
      parts: [],
      durationSeconds: suggestedDurationSeconds([]),
      revealMode: false,
    })
  }, [isActiveMock, start])

  if (!isActiveMock) {
    return (
      <div className="stack">
        <h1>Đang chuẩn bị đề thi thử…</h1>
        <p className="page-head__lead">Nếu màn hình không tự chuyển, hãy mở lại mục Thi thử.</p>
      </div>
    )
  }

  return <SessionPage key={session.id} session={session} index={index} />
}

/**
 * `#/practice/session` chỉ có nghĩa khi đã có phiên luyện tập đang làm.
 * Không tự tạo phiên ở đây vì cần cấu hình part và số câu từ người dùng.
 */
export function PracticeSessionRoute({ index }: { index: BankIndex }) {
  const { session } = useSession()

  if (!session || session.status !== 'active') {
    return (
      <div className="stack">
        <div className="empty-state">
          <div className="empty-state__icon" aria-hidden="true">
            ▷
          </div>
          <h3>Chưa có bài luyện tập nào đang làm</h3>
          <p>Chọn part và số câu trước, sau đó bấm bắt đầu. Phiên đang làm dở cũng hiện lại được ở đây.</p>
          <div className="btn-row">
            <a className="btn btn--primary" href={ROUTES.partSelect} data-testid={TID.startPractice}>
              Chọn part để bắt đầu
            </a>
          </div>
        </div>
      </div>
    )
  }

  return <SessionPage key={session.id} session={session} index={index} />
}
