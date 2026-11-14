import { ROUTES, TID } from '../testids'
import { navigate } from '../hooks/useHashRoute'
import { useSession } from './sessionContext'
import { describeParts } from './partHelpers'
import { setPreferredReviewFilter } from './reviewFilter'

function percent(value: number): string {
  // `SessionResult.accuracy` đã là % do engine tính; UI chỉ trình bày.
  return `${value}%`
}

/** Màn hình kết quả của phiên đã nộp. */
export function ResultPage() {
  const { session, result, reset, start } = useSession()

  const retry = () => {
    if (!session) {
      navigate(ROUTES.partSelect)
      return
    }
    start({
      mode: session.mode,
      parts: session.parts,
      countPerPart: session.mode === 'practice' ? countPerPart(session.questionIds) : undefined,
      revealMode: session.revealMode,
    })
    navigate(session.mode === 'mock' ? ROUTES.mock : ROUTES.practice)
  }

  if (!session || !result) {
    return (
      <div data-testid={TID.result} className="stack">
        <div className="empty-state">
          <div className="empty-state__icon" aria-hidden="true">
            ◔
          </div>
          <h3>Chưa có bài nào để xem điểm</h3>
          <p>Hoàn thành một phiên luyện tập hoặc thi thử trước, rồi quay lại đây để xem kết quả.</p>
          <div className="btn-row">
            <a className="btn btn--primary" href={ROUTES.partSelect}>
              Luyện theo part
            </a>
            <a className="btn" href={ROUTES.mock}>
              Thi thử
            </a>
          </div>
        </div>
      </div>
    )
  }

  const { estimate } = result
  const accuracyValue = Math.round(result.accuracy)
  const total = result.total

  return (
    <div data-testid={TID.result} className="stack stack--loose">
      <div className="page-head">
        <span className="section-label">
          {session.mode === 'mock' ? 'Kết quả thi thử' : 'Kết quả luyện tập'}
        </span>
        <h1>Bài làm đã được chấm</h1>
        <p className="page-head__lead">{describeParts(session.parts)}</p>
      </div>

      <section className="score-hero">
        <div className="card score-hero__main">
          <span className="score-hero__label">Điểm ước lượng</span>
          <strong className="score-hero__total" data-testid={TID.scoreTotal}>
            {estimate.total}
          </strong>
          <span className="score-hero__scale">trên thang 10–990</span>
          {estimate.approximate ? (
            <p className="score-hero__note">
              <span className="badge">Ước lượng</span> {estimate.note}
            </p>
          ) : null}
        </div>

        <div className="score-sections">
          <div className="card score-section">
            <span className="score-section__label">Nghe</span>
            <strong className="score-section__value" data-testid={TID.scoreListening}>
              {estimate.listening}
            </strong>
            <span className="score-section__scale">5–495</span>
          </div>
          <div className="card score-section">
            <span className="score-section__label">Đọc</span>
            <strong className="score-section__value" data-testid={TID.scoreReading}>
              {estimate.reading}
            </strong>
            <span className="score-section__scale">5–495</span>
          </div>
        </div>
      </section>

      <section className="result-grid" aria-label="Chi tiết bài làm">
        <div className="card stat-card">
          <span className="stat-card__label">Đúng</span>
          <strong className="stat-card__value stat-card__value--ok" data-testid={TID.resultCorrect}>
            {result.correct}
          </strong>
          <span className="stat-card__foot">trên {total} câu</span>
        </div>
        <div className="card stat-card">
          <span className="stat-card__label">Sai</span>
          <strong className="stat-card__value stat-card__value--bad" data-testid={TID.resultWrong}>
            {result.wrong}
          </strong>
          <span className="stat-card__foot">đã chọn nhưng chưa đúng</span>
        </div>
        <div className="card stat-card">
          <span className="stat-card__label">Bỏ trống</span>
          <strong className="stat-card__value" data-testid={TID.resultBlank}>
            {result.blank}
          </strong>
          <span className="stat-card__foot">chưa chọn đáp án</span>
        </div>
        <div className="card stat-card">
          <span className="stat-card__label">Độ chính xác</span>
          <strong className="stat-card__value" data-testid={TID.resultAccuracy}>
            {percent(accuracyValue)}
          </strong>
          <span className="stat-card__foot">
            {result.correct}/{total} câu
          </span>
        </div>
      </section>

      {result.byPart.length > 0 ? (
        <section className="card">
          <h2>Kết quả theo part</h2>
          <table className="table">
            <thead>
              <tr>
                <th scope="col">Part</th>
                <th scope="col">Đúng</th>
                <th scope="col">Sai</th>
                <th scope="col">Bỏ trống</th>
                <th scope="col">Độ chính xác</th>
              </tr>
            </thead>
            <tbody>
              {result.byPart.map((row) => (
                <tr key={row.part}>
                  <th scope="row">Part {row.part}</th>
                  <td>{row.correct}</td>
                  <td>{row.wrong}</td>
                  <td>{row.blank}</td>
                  <td>{percent(Math.round(row.accuracy))}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      ) : null}

      {result.byTag.length > 0 ? (
        <section className="card card--flat">
          <h2>Điểm yếu theo nhãn kỹ năng</h2>
          <p className="card__hint">Nhãn có tỉ lệ đúng thấp nhất nên được ưu tiên ôn lại.</p>
          <ul className="tag-list">
            {result.byTag
              .slice()
              .sort((a, b) => a.accuracy - b.accuracy)
              .slice(0, 8)
              .map((tag) => (
                <li key={tag.tag} className="tag-list__row">
                  <span className="tag-list__name">{tag.tag}</span>
                  <span className="tag-list__meter" aria-hidden="true">
                    <span className="tag-list__fill" style={{ width: `${Math.round(tag.accuracy)}%` }} />
                  </span>
                  <span className="tag-list__value">
                    {tag.correct}/{tag.total} · {percent(Math.round(tag.accuracy))}
                  </span>
                </li>
              ))}
          </ul>
        </section>
      ) : null}

      <div className="btn-row btn-row--stretch">
        <button
          type="button"
          className="btn btn--primary btn--lg"
          data-testid={TID.reviewButton}
          onClick={() => {
            setPreferredReviewFilter('all')
            navigate(ROUTES.review)
          }}
        >
          Xem lại bài làm
        </button>
        <button
          type="button"
          className="btn btn--lg"
          data-testid={TID.reviewMistakes}
          onClick={() => {
            setPreferredReviewFilter('wrong')
            navigate(ROUTES.review)
          }}
        >
          Xem câu sai
        </button>
        <button type="button" className="btn btn--lg" data-testid={TID.retryButton} onClick={retry}>
          Làm lại
        </button>
        <a className="btn btn--lg" href={ROUTES.home} onClick={reset}>
          Về trang chủ
        </a>
      </div>
    </div>
  )
}

/**
 * Số câu mỗi part của phiên vừa làm — dùng để "Làm lại" với đúng cấu hình cũ.
 *
 * Id câu hỏi theo quy ước `p{part}-{4 số}` trong `src/types.ts`, nên tiền tố
 * trước dấu `-` chính là part. Ở chế độ luyện tập mọi part có cùng số câu, nên
 * lấy giá trị lớn nhất là khớp.
 */
function countPerPart(questionIds: string[]): number | undefined {
  const counts = new Map<string, number>()
  for (const id of questionIds) {
    const prefix = id.slice(0, id.indexOf('-') === -1 ? undefined : id.indexOf('-'))
    counts.set(prefix, (counts.get(prefix) ?? 0) + 1)
  }
  if (counts.size === 0) return undefined
  return Math.max(...counts.values())
}
