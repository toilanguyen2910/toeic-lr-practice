import { ROUTES, TID } from '../testids'
import { SessionPage } from './SessionPage'
import { useSession } from './sessionContext'
import type { BankIndex } from '../hooks/useBankIndex'

/**
 * `#/practice/session` chỉ có nghĩa khi đã có phiên luyện tập đang làm.
 * Không tự tạo phiên ở đây vì cần cấu hình part và số câu từ người dùng.
 *
 * `key={session.id}` buộc màn hình làm bài khởi tạo lại khi sang phiên khác —
 * nếu không, vị trí câu và đồng hồ sẽ giữ lại của phiên trước.
 *
 * Ghi chú: route thi thử (`#/mock/<số>`) nay do `MockSetRoute` đảm nhận, vì thi
 * thử có 10 đề cố định 200 câu thay vì một phiên tuỳ ý như trước.
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
