import { useMemo } from 'react'
import { EXAM_SETS, examSetSize, loadHistory, SCORING_VERSION } from '../lib'
import type { HistoryEntry } from '../lib/contract'
import { ROUTES, TID, examSetRoute } from '../testids'
import { useSession } from './sessionContext'

/**
 * MÀN HÌNH CHỌN ĐỀ — 20 đề "tự giao nhau".
 *
 * Cùng một ngân hàng câu hỏi, 20 cách chọn khác nhau. Mỗi thẻ cho biết đề dài bao
 * nhiêu câu và người dùng đã làm đề đó mấy lần / điểm cao nhất bao nhiêu.
 */

const MIX_LABEL: Record<string, string> = {
  quick: 'Ngắn',
  half: 'Vừa',
  official: 'Dài',
}

interface SetStat {
  attempts: number
  best: number | null
}

/** Thống kê theo từng đề, đọc từ lịch sử. Khớp theo `setId` lưu trong bản ghi. */
function collectStats(history: HistoryEntry[]): Map<number, SetStat> {
  const map = new Map<number, SetStat>()
  for (const entry of history) {
    const id = entry.examSetId
    if (!id) continue
    // Bỏ qua bản ghi tính theo công thức cũ: điểm của nó không so sánh được với
    // điểm hiện tại, nên không được tham gia "cao nhất".
    if (entry.scoringVersion !== SCORING_VERSION) continue
    const current = map.get(id) ?? { attempts: 0, best: null }
    map.set(id, {
      attempts: current.attempts + 1,
      best: current.best == null ? entry.estimateTotal : Math.max(current.best, entry.estimateTotal),
    })
  }
  return map
}

export function ExamSetsPage() {
  const { bank } = useSession()
  const history = useMemo<HistoryEntry[]>(() => loadHistory(), [])
  const stats = useMemo(() => collectStats(history), [history])

  const sizes = useMemo(
    () => new Map(EXAM_SETS.map((set) => [set.id, examSetSize(bank, set)])),
    [bank],
  )

  return (
    <div data-testid={TID.examSets} className="stack stack--loose">
      <header className="page-head">
        <span className="section-label">Bộ đề</span>
        <h1>20 đề luyện — dùng chung một ngân hàng câu</h1>
        <p className="page-head__lead">
          Mỗi đề là một cách chọn câu khác nhau từ cùng ngân hàng, nên các đề có phần trùng
          nhau. Càng làm nhiều đề, bạn càng gặp lại câu từng sai — đó là chủ ý.
        </p>
      </header>

      <div className="exam-grid">
        {EXAM_SETS.map((set) => {
          const stat = stats.get(set.id)
          const size = sizes.get(set.id) ?? 0
          return (
            <article key={set.id} className="card exam-card" data-testid={TID.examSetCard(set.id)}>
              <div className="exam-card__top">
                <span className="exam-card__label">{set.label}</span>
                <span className={`tag tag--${set.mix}`}>{MIX_LABEL[set.mix]}</span>
              </div>
              <h2 className="exam-card__name">{set.name}</h2>
              <p className="exam-card__meta">
                <span>{size} câu</span>
                {stat ? (
                  <span data-testid={TID.examSetProgress(set.id)}>
                    {' · '}đã làm {stat.attempts} lần
                    {stat.best != null ? ` · cao nhất ${stat.best}` : ''}
                  </span>
                ) : (
                  <span data-testid={TID.examSetProgress(set.id)}>
                    {' · '}chưa làm
                  </span>
                )}
              </p>
              <a className="btn btn--primary btn--sm" href={examSetRoute(set.id)}>
                Làm đề này
              </a>
            </article>
          )
        })}
      </div>

      <div className="btn-row">
        <a className="btn btn--ghost" href={ROUTES.home}>
          Về trang chủ
        </a>
      </div>
    </div>
  )
}

