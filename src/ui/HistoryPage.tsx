import { ROUTES, TID } from '../testids'
import { clearHistory, loadHistory, SCORING_VERSION } from '../lib'
import { useState } from 'react'
import { describeParts } from './partHelpers'

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

function formatDuration(seconds: number): string {
  const safe = Math.max(0, Math.round(seconds))
  const minutes = Math.floor(safe / 60)
  const rest = safe % 60
  return `${minutes}:${String(rest).padStart(2, '0')}`
}

/** Màn hình lịch sử luyện tập. */
export function HistoryPage() {
  const [history, setHistory] = useState(loadHistory)

  const handleClear = () => {
    clearHistory()
    setHistory([])
  }

  return (
    <div data-testid={TID.history} className="stack">
      <div className="page-head">
        <span className="section-label">Lịch sử</span>
        <h1>Các phiên đã hoàn thành</h1>
        <p className="page-head__lead">
          Điểm số ở đây là ước lượng từ bộ câu rút gọn, dùng để theo dõi tiến bộ chứ không phải điểm
          thi thật.
        </p>
      </div>

      {history.length === 0 ? (
        <div data-testid={TID.historyEmpty} className="empty-state">
          <div className="empty-state__icon" aria-hidden="true">
            ▤
          </div>
          <h3>Chưa có phiên nào</h3>
          <p>Hoàn thành một bài luyện tập hoặc thi thử, kết quả sẽ được lưu tự động tại đây.</p>
          <div className="btn-row">
            <a className="btn btn--primary" href={ROUTES.partSelect}>
              Bắt đầu luyện tập
            </a>
            <a className="btn" href={ROUTES.mock}>
              Thi thử
            </a>
          </div>
        </div>
      ) : (
        <>
          <div className="history-table" role="table" aria-label="Lịch sử luyện tập">
            <div className="history-table__head" role="row">
              <span role="columnheader">Thời điểm</span>
              <span role="columnheader">Chế độ</span>
              <span role="columnheader">Part</span>
              <span role="columnheader">Đúng</span>
              <span role="columnheader">Điểm</span>
              <span role="columnheader">Thời gian</span>
            </div>

            {history.map((entry) => (
              <div className="history-row" data-testid={TID.historyRow} role="row" key={entry.id}>
                <span className="history-row__date" role="cell">
                  {formatDate(entry.finishedAt)}
                </span>
                <span role="cell">
                  <span className={`badge ${entry.mode === 'mock' ? 'badge--info' : ''}`}>
                    {entry.mode === 'mock' ? 'Thi thử' : 'Luyện tập'}
                  </span>
                </span>
                <span className="history-row__parts" role="cell">
                  {describeParts(entry.parts)}
                </span>
                <span className="history-row__num" role="cell">
                  {entry.correct}/{entry.total}
                </span>
                <span className="history-row__score" role="cell">
                  {/*
                    Bản ghi cũ (phiên bản công thức khác hiện tại) vẫn hiện điểm
                    nhưng kèm dấu "cũ" và chú thích, không thì người dùng thấy con
                    số 495 vô lý mà không hiểu vì sao.
                  */}
                  {entry.scoringVersion === SCORING_VERSION ? (
                    entry.estimateTotal
                  ) : (
                    <span
                      className="history-row__legacy"
                      title="Điểm tính theo công thức cũ, không so sánh được với các phiên mới"
                    >
                      {entry.estimateTotal}
                      <span className="history-row__legacy-tag">cũ</span>
                    </span>
                  )}
                </span>
                <span className="history-row__num" role="cell">
                  {formatDuration(entry.elapsedSeconds)}
                </span>
              </div>
            ))}
          </div>

          <div className="btn-row">
            <button type="button" className="btn btn--danger" onClick={handleClear}>
              Xoá toàn bộ lịch sử
            </button>
            <span className="spacer" />
            <a className="btn btn--primary" href={ROUTES.partSelect}>
              Luyện tiếp
            </a>
          </div>
        </>
      )}
    </div>
  )
}
