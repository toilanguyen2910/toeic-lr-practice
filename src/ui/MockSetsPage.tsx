import { useMemo } from 'react'
import { MOCK_SETS, MOCK_DURATION_SECONDS, loadHistory } from '../lib'
import type { HistoryEntry } from '../lib/contract'
import { ROUTES, TID, mockSetRoute } from '../testids'
import { useSession } from './sessionContext'

/**
 * MÀN HÌNH CHỌN ĐỀ THI THỬ — 10 đề, mỗi đề đúng 200 câu như đề thật.
 *
 * Khác màn "20 đề" (dùng để luyện hằng ngày, chia ba cỡ): ở đây mọi đề đều đủ
 * 200 câu và có giới hạn 120 phút, để biết mình đang ở đâu nếu đi thi thật.
 */

interface SetStat {
  attempts: number
  best: number | null
}

/** Thống kê theo từng đề thi thử, khớp theo tiền tố `mock<N>-` trong id bản ghi. */
function collectStats(history: HistoryEntry[]): Map<number, SetStat> {
  const map = new Map<number, SetStat>()
  for (const entry of history) {
    const match = /^mock(\d{1,2})-/u.exec(entry.id)
    if (!match) continue
    const id = Number(match[1])
    if (!Number.isInteger(id) || id < 1 || id > 10) continue
    const current = map.get(id) ?? { attempts: 0, best: null }
    map.set(id, {
      attempts: current.attempts + 1,
      best: current.best == null ? entry.estimateTotal : Math.max(current.best, entry.estimateTotal),
    })
  }
  return map
}

export function MockSetsPage() {
  const { session } = useSession()
  const history = useMemo<HistoryEntry[]>(() => loadHistory(), [])
  const stats = useMemo(() => collectStats(history), [history])

  // Phiên đang làm dở (nếu là thi thử) — để hiện nút "Tiếp tục".
  const resumableMock = session && session.status === 'active' && session.mode === 'mock' ? session : null
  const resumableMatch = resumableMock ? /^mock(\d{1,2})-/u.exec(resumableMock.id) : null
  const resumableId = resumableMatch ? Number(resumableMatch[1]) : null

  return (
    <div data-testid={TID.mockSets} className="stack stack--loose">
      <header className="page-head">
        <span className="section-label">Thi thử</span>
        <h1>10 đề thi thử — 200 câu, 120 phút</h1>
        <p className="page-head__lead">
          Mỗi đề đủ 200 câu và chia đúng như đề thật: nghe 100 câu (Part 1–4), đọc 100 câu
          (Part 5–7). Làm liền mạch, không xem đáp án, hết giờ tự nộp.
        </p>
      </header>

      {resumableMock && resumableId != null ? (
        <div className="card mock-resume">
          <div>
            <strong>Bạn đang làm dở đề thi thử {resumableId}</strong>
            <p className="field__hint">
              Đã trả lời {Object.values(resumableMock.answers).filter((a) => a !== null).length} /{' '}
              {resumableMock.questionIds.length} câu.
            </p>
          </div>
          <a className="btn btn--primary" href={mockSetRoute(resumableId)} data-testid={TID.homeResume}>
            Tiếp tục đề {resumableId}
          </a>
        </div>
      ) : null}

      <div className="exam-grid">
        {MOCK_SETS.map((set) => {
          const stat = stats.get(set.id)
          return (
            <article key={set.id} className="card exam-card" data-testid={TID.mockSetCard(set.id)}>
              <div className="exam-card__top">
                <span className="exam-card__label">{set.label}</span>
                <span className="tag tag--official">200 câu</span>
              </div>
              <h2 className="exam-card__name">{set.name}</h2>
              <p className="exam-card__meta">
                <span>
                  {Math.round(MOCK_DURATION_SECONDS / 60)} phút · nghe 100 + đọc 100
                </span>
                {stat ? (
                  <span data-testid={TID.mockSetProgress(set.id)}>
                    {' · '}đã làm {stat.attempts} lần
                    {stat.best != null ? ` · cao nhất ${stat.best}` : ''}
                  </span>
                ) : (
                  <span data-testid={TID.mockSetProgress(set.id)}>{' · '}chưa làm</span>
                )}
              </p>
              <a
                className="btn btn--primary btn--sm"
                href={mockSetRoute(set.id)}
                data-testid={set.id === 1 ? TID.mockSetStart : undefined}
              >
                Vào thi
              </a>
            </article>
          )
        })}
      </div>

      <div className="btn-row">
        <a className="btn btn--ghost" href={ROUTES.home}>
          Về trang chủ
        </a>
        <a className="btn btn--ghost" href={ROUTES.examSets}>
          Muốn luyện ngắn hơn? Xem bộ 20 đề
        </a>
      </div>
    </div>
  )
}
