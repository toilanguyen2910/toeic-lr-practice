import { useEffect, useRef } from 'react'
import { buildMockSet, findMockSet, MOCK_DURATION_SECONDS, MOCK_SET_COUNT } from '../lib'
import { ROUTES, TID } from '../testids'
import { SessionPage } from './SessionPage'
import { useSession } from './sessionContext'
import type { BankIndex } from '../hooks/useBankIndex'

/**
 * `#/mock/<số>` — vào thi thử đề số đó.
 *
 * Quy tắc:
 * - Đang có phiên dở ĐÚNG đề đó → tiếp tục, không tạo lại (mất bài đang làm).
 * - Đang có phiên dở đề khác → vẫn dựng đề mới. Bấm "Vào thi đề 5" nghĩa là muốn
 *   làm đề 5 ngay, không bị chặn bởi một phiên bỏ dở.
 *
 * Đồng hồ của đề thi thử đếm ngược 120 phút (45 nghe + 75 đọc) và hết giờ tự nộp.
 * Màn hình làm bài hiện `h:mm:ss` khi vượt 1 giờ — `formatClock` đã hỗ trợ.
 */
export function MockSetRoute({ id, index }: { id: number; index: BankIndex }) {
  const { session, adopt, bank } = useSession()
  const createdFor = useRef<number | null>(null)

  const alreadyOnThisSet =
    session != null &&
    session.status === 'active' &&
    session.mode === 'mock' &&
    session.id.startsWith(`mock${id}-`)

  useEffect(() => {
    if (alreadyOnThisSet) return
    if (createdFor.current === id) return
    createdFor.current = id

    const def = findMockSet(id)
    if (!def) return

    const built = buildMockSet(bank, def)
    adopt({
      ...built,
      durationSeconds: MOCK_DURATION_SECONDS,
    })
  }, [adopt, alreadyOnThisSet, bank, id])

  if (!findMockSet(id)) {
    return (
      <div className="stack">
        <div className="empty-state">
          <h3>Không có đề thi thử số {id}</h3>
          <p>Hiện có {MOCK_SET_COUNT} đề thi thử, đánh số từ 1 đến {MOCK_SET_COUNT}.</p>
          <div className="btn-row">
            <a className="btn btn--primary" href={ROUTES.mock}>
              Xem danh sách đề thi thử
            </a>
          </div>
        </div>
      </div>
    )
  }

  if (!alreadyOnThisSet) {
    return (
      <div className="stack">
        <h1 data-testid={TID.session}>Đang chuẩn bị đề thi thử {id}…</h1>
        <p className="page-head__lead">Nếu màn hình không tự chuyển, hãy mở lại danh sách đề.</p>
      </div>
    )
  }

  return <SessionPage key={session.id} session={session} index={index} />
}
