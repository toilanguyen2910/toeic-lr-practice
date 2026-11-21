import { useMemo } from 'react'
import { loadHistory, SCORING_VERSION } from '../lib'
import type { HistoryEntry } from '../lib/contract'
import { PART_META } from '../types'
import type { Part } from '../types'
import { ROUTES, TID } from '../testids'
import { useSession } from './sessionContext'

function formatDate(timestamp: number): string {
  try {
    return new Intl.DateTimeFormat('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(timestamp))
  } catch {
    return '—'
  }
}

function describeParts(parts: Part[]): string {
  if (parts.length === 0) return 'Toàn bộ ngân hàng'
  return parts.map((part) => PART_META[part].label).join(', ')
}

/** Trang chủ: hai lối vào chính, thẻ thống kê, nút tiếp tục phiên dở. */
export function HomePage() {
  const { session, reset } = useSession()

  // Đọc lịch sử mỗi lần mở trang chủ: nộp bài xong quay về đây phải thấy số mới.
  const history = useMemo<HistoryEntry[]>(() => loadHistory(), [])

  /**
   * Chỉ tính "điểm cao nhất" trên các bản ghi dùng công thức chấm điểm HIỆN TẠI.
   *
   * Bản ghi cũ (thiếu `scoringVersion`, tức phiên bản 1) được tính theo công thức
   * cũ — công thức đó cho 495 điểm khi làm 6 câu Part 1 đúng hết. Trộn chúng vào
   * sẽ khiến "điểm cao nhất" luôn hiện con số sai và không bao giờ bị vượt.
   */
  const currentHistory = useMemo(
    () => history.filter((entry) => entry.scoringVersion === SCORING_VERSION),
    [history],
  )

  const bestScore = currentHistory.reduce((best, entry) => Math.max(best, entry.estimateTotal), 0)
  const resumable = session && session.status === 'active' ? session : null
  const lastFinished = history[0]

  return (
    <div data-testid={TID.home} className="stack stack--loose">
      <section data-testid={TID.homeHero} className="card home-hero">
        <span className="section-label">TOEIC Listening &amp; Reading</span>
        <h1>Luyện nghe &amp; đọc mỗi ngày, một phiên ngắn mỗi lần.</h1>
        <p className="home-hero__lead">
          Làm bài theo từng part và đọc giải thích ngay khi chọn đáp án, hoặc thi thử có đồng hồ đếm
          ngược để biết mình đang ở đâu. Mọi câu đều có giải thích và bản dịch tiếng Việt.
        </p>

        <div className="btn-row btn-row--stretch home-hero__actions">
          <a className="btn btn--primary btn--lg" href={ROUTES.partSelect} data-testid={TID.homeStartPractice}>
            Luyện theo part
          </a>
          <a className="btn btn--lg" href={ROUTES.mock} data-testid={TID.homeStartMock}>
            Thi thử
          </a>
        </div>

        {resumable ? (
          <div className="home-resume">
            <div className="home-resume__text">
              <strong>Bạn có một phiên đang làm dở</strong>
              <span>
                {resumable.mode === 'mock' ? 'Thi thử' : 'Luyện tập'} ·{' '}
                {describeParts(resumable.parts)} · {resumable.questionIds.length} câu
              </span>
            </div>
            <div className="btn-row">
              <a
                className="btn btn--primary"
                href={resumable.mode === 'mock' ? ROUTES.mock : ROUTES.practice}
                data-testid={TID.homeResume}
              >
                Tiếp tục bài đang làm
              </a>
              <button type="button" className="btn btn--ghost btn--sm" onClick={reset}>
                Bỏ phiên này
              </button>
            </div>
          </div>
        ) : null}
      </section>

      <section className="stats-grid" aria-label="Thống kê luyện tập">
        <div className="card stat-card">
          <span className="stat-card__label">Số phiên đã làm</span>
          <strong className="stat-card__value" data-testid={TID.statTotalSessions}>
            {history.length}
          </strong>
          <span className="stat-card__foot">
            {lastFinished ? `Gần nhất: ${formatDate(lastFinished.finishedAt)}` : 'Chưa có phiên nào'}
          </span>
        </div>

        <div className="card stat-card">
          <span className="stat-card__label">Điểm cao nhất (ước lượng)</span>
          <strong className="stat-card__value" data-testid={TID.statBestScore}>
            {currentHistory.length === 0 ? '—' : bestScore}
          </strong>
          <span className="stat-card__foot">
            {history.length === 0
              ? 'Hoàn thành một phiên để có điểm'
              : currentHistory.length === 0
                ? 'Các phiên cũ dùng cách tính khác — làm một phiên mới để có điểm'
                : 'Thang 0–990, tính từ bộ câu rút gọn'}
          </span>
        </div>
      </section>

      {history.length > 0 ? (
        <section className="card card--flat">
          <div className="row row--between">
            <h2>Các phiên gần đây</h2>
            <a className="btn btn--ghost btn--sm" href={ROUTES.history}>
              Xem toàn bộ lịch sử
            </a>
          </div>
          <ul className="home-recent">
            {history.slice(0, 3).map((entry) => (
              <li key={entry.id} className="home-recent__item">
                <span className={`badge ${entry.mode === 'mock' ? 'badge--info' : ''}`}>
                  {entry.mode === 'mock' ? 'Thi thử' : 'Luyện tập'}
                </span>
                <span className="home-recent__parts">{describeParts(entry.parts)}</span>
                <span className="home-recent__score">{entry.estimateTotal} điểm</span>
                <span className="home-recent__meta">
                  {entry.correct}/{entry.total} đúng
                </span>
                <span className="home-recent__meta">{formatDate(entry.finishedAt)}</span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  )
}
