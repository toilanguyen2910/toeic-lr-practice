import { useEffect, useRef } from 'react'
import { buildExamSet, findExamSet, MOCK_DURATION_SECONDS } from '../lib'
import { ROUTES, TID } from '../testids'
import { SessionPage } from './SessionPage'
import { useSession } from './sessionContext'
import type { BankIndex } from '../hooks/useBankIndex'

/**
 * `#/de/<số>` — vào thẳng một đề trong bộ 20 đề.
 *
 * Quy tắc:
 * - Nếu đang có phiên dở ĐÚNG đề đó → tiếp tục phiên đó, không tạo mới.
 * - Nếu đang có phiên dở đề khác → vẫn tạo đề mới (người dùng chủ động đổi đề),
 *   phiên cũ bị thay thế. Đây là hành vi mong muốn: bấm "Làm đề 7" nghĩa là muốn
 *   làm đề 7 ngay, không phải bị chặn bởi một phiên bỏ dở.
 *
 * `key={session.id}` buộc màn hình làm bài khởi tạo lại khi sang phiên khác.
 */
export function ExamSetRoute({ id, index }: { id: number; index: BankIndex }) {
  const { session, adopt, bank } = useSession()
  const createdFor = useRef<number | null>(null)
  const alreadyOnThisSet =
    session != null &&
    session.status === 'active' &&
    session.mode === 'mock' &&
    session.id.startsWith(`exam${id}-`)

  useEffect(() => {
    if (alreadyOnThisSet) return
    if (createdFor.current === id) return
    createdFor.current = id

    const set = findExamSet(id)
    if (!set) return

    // Tạo thẳng phiên của đề rồi nạp vào provider — không đi qua `start()` để giữ
    // nguyên danh sách câu đã xếp theo part mà `buildExamSet` tính sẵn.
    //
    // Thời lượng tính từ SỐ CÂU THẬT của đề, không phải từ danh sách part. Trước
    // đây cả đề 52 câu và đề 200 câu đều hiện 57:00 vì cùng dùng `suggestSeconds`
    // của 7 part. Nay: 36 giây mỗi câu (nhịp đề thật), tối thiểu 60 giây.
    const built = buildExamSet(bank, set)
    const seconds = Math.min(
      MOCK_DURATION_SECONDS,
      Math.max(60, built.questionIds.length * 36),
    )
    adopt({ ...built, durationSeconds: seconds })
  }, [adopt, alreadyOnThisSet, bank, id])

  if (!findExamSet(id)) {
    return (
      <div className="stack">
        <div className="empty-state">
          <h3>Không có đề số {id}</h3>
          <p>Bộ đề hiện có 20 đề, đánh số từ 1 đến 20.</p>
          <div className="btn-row">
            <a className="btn btn--primary" href={ROUTES.examSets}>
              Xem danh sách đề
            </a>
          </div>
        </div>
      </div>
    )
  }

  if (!alreadyOnThisSet) {
    return (
      <div className="stack">
        <h1 data-testid={TID.session}>Đang chuẩn bị đề {id}…</h1>
        <p className="page-head__lead">Nếu màn hình không tự chuyển, hãy mở lại danh sách đề.</p>
      </div>
    )
  }

  return <SessionPage key={session.id} session={session} index={index} />
}

