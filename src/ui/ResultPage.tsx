import { useState } from 'react'
import { ROUTES, TID, examSetRoute } from '../testids'
import { buildExamSet, buildMockSet, findExamSet, findMockSet, formatClock, MOCK_DURATION_SECONDS } from '../lib'
import type { Part } from '../types'
import { navigate } from '../hooks/useHashRoute'
import { useSession } from './sessionContext'
import { describeParts } from './partHelpers'
import { setPreferredReviewFilter } from './reviewFilter'
import { useBankIndex } from '../hooks/useBankIndex'

function percent(value: number): string {
  // `SessionResult.accuracy` đã là % do engine tính; UI chỉ trình bày.
  return `${value}%`
}

/** Màn hình kết quả của phiên đã nộp. */
export function ResultPage() {
  const { session, result, reset, start, adopt, bank } = useSession()
  const questionById = useBankIndex(bank).questionById
  const [copied, setCopied] = useState(false)

  /**
   * "Làm lại" — dựng lại ĐÚNG phiên cũ, không tạo phiên mới tuỳ ý.
   * Ba lỗi cũ (reviewer phát hiện, nay đã sửa):
   * 1. Thi thử: `start()` không truyền `seed` nên tạo phiên lấy TOÀN BỘ ngân hàng
   *    (425 câu) thay vì 200.
   * 2. Luyện tập: `countPerPart()` lấy số lớn nhất trong các part rồi áp cho MỌI
   *    part. Đặt 77 câu (6/25/30/16) thì làm lại ra 30/30/30/30 = 120 câu.
   * 3. Đồng hồ: thi thử làm lại rơi về 59:59 thay vì 120:00.
   * Cách sửa: đếm lại số câu THẬT của từng part trong phiên cũ rồi dựng lại đúng
   * phân bổ đó. Với thi thử, quay về trang chọn đề để dựng lại đúng đề 200 câu
   * qua `MockSetRoute` — nơi đã biết cách dựng theo seed của đề.
   */
  const retry = () => {
    if (!session) {
      navigate(ROUTES.partSelect)
      return
    }

    // Thi thử: về danh sách đề, người dùng chọn lại (đề đó vẫn còn, đúng 200 câu).
    const mockMatch = /^mock(\d{1,2})-/u.exec(session.id)
    if (mockMatch) {
      const id = Number(mockMatch[1])
      const def = findMockSet(id)
      if (def) {
        /*
         * Dựng phiên đề đó qua provider và ÉP thời lượng 120 phút.
         *
         * `buildMockSet` trả `durationSeconds: null` (để `createSession` tự tính),
         * nên phải ghi đè sau khi dựng. Thiếu bước này thì đồng hồ về `null` và
         * màn làm bài hiện "không giới hạn" thay vì đếm ngược.
         */
        const rebuilt = buildMockSet(bank, def)
        adopt({ ...rebuilt, durationSeconds: MOCK_DURATION_SECONDS })
        navigate(`${ROUTES.mock}/${id}`)
        return
      }
      navigate(ROUTES.mock)
      return
    }

    // 20 đề luyện: dựng lại đúng đề với seed và thời lượng tương ứng.
    const examMatch = /^exam(\d{1,2})-/u.exec(session.id)
    if (examMatch) {
      const id = Number(examMatch[1])
      const set = findExamSet(id)
      if (set) {
        const built = buildExamSet(bank, set)
        const seconds = Math.min(
          MOCK_DURATION_SECONDS,
          Math.max(60, built.questionIds.length * 36),
        )
        adopt({ ...built, durationSeconds: seconds })
        navigate(examSetRoute(id))
        return
      }
      navigate(ROUTES.examSets)
      return
    }

    // Luyện tập: đếm lại số câu thật của từng part, giữ nguyên thời lượng.
    const perPart: Partial<Record<Part, number>> = {}
    for (const qid of session.questionIds) {
      const q = questionById.get(qid)
      if (!q) continue
      perPart[q.part] = (perPart[q.part] ?? 0) + 1
    }

    start({
      mode: session.mode,
      parts: session.parts,
      countByPart: perPart,
      durationSeconds: session.durationSeconds ?? undefined,
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

  const isTimedOut =
    session.mode === 'mock' &&
    session.durationSeconds != null &&
    session.elapsedSeconds >= session.durationSeconds

  const handleCopyResult = async () => {
    const lines = [
      '🎯 KẾT QUẢ TOEIC LISTENING & READING',
      `• Điểm ước lượng: ${estimate.total}/990 (Nghe: ${estimate.listening} | Đọc: ${estimate.reading})`,
      `• Độ chính xác: ${result.correct}/${total} (${accuracyValue}%)`,
      `• Thời gian: ${formatClock(session.elapsedSeconds)}`,
      result.byPart.length > 0
        ? `• Từng Part: ${result.byPart.map((p) => `P${p.part}: ${p.correct}/${p.total} (${Math.round(p.accuracy)}%)`).join(' · ')}`
        : '',
      '👉 Luyện thi cá nhân TOEIC LR Practice',
    ]
      .filter(Boolean)
      .join('\n')

    try {
      await navigator.clipboard.writeText(lines)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      /* bỏ qua */
    }
  }

  return (
    <div data-testid={TID.result} className="stack stack--loose">
      {isTimedOut ? (
        <div className="banner banner--warn">
          ⏱️ Bài thi đã được tự động nộp do hết thời gian làm bài.
        </div>
      ) : null}

      <div className="page-head page-head--with-action">
        <div>
          <span className="section-label">
            {session.mode === 'mock' ? 'Kết quả thi thử' : 'Kết quả luyện tập'}
          </span>
          <h1>Bài làm đã được chấm</h1>
          <p className="page-head__lead">{describeParts(session.parts)}</p>
        </div>
        <div className="btn-row no-print" style={{ alignSelf: 'flex-start' }}>
          <button
            type="button"
            className="btn btn--sm btn--ghost"
            data-testid="print-result"
            onClick={() => window.print()}
            title="In hoặc lưu phiếu điểm ra file PDF"
          >
            🖨️ In / Lưu PDF
          </button>
          <button
            type="button"
            className={`btn btn--sm ${copied ? 'btn--copy is-copied' : 'btn--ghost'}`}
            data-testid="copy-result"
            onClick={handleCopyResult}
            title="Sao chép tóm tắt kết quả vào bộ nhớ tạm"
          >
            {copied ? '✓ Đã sao chép!' : '📋 Sao chép kết quả'}
          </button>
        </div>
      </div>

      <section className="score-hero">
        <div className="card score-hero__main">
          <span className="score-hero__label">Điểm ước lượng</span>
          <strong className="score-hero__total" data-testid={TID.scoreTotal}>
            {estimate.total}
          </strong>
          <span className="score-hero__scale">trên thang 0–990</span>
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
            <span className="score-section__scale">0–495</span>
          </div>
          <div className="card score-section">
            <span className="score-section__label">Đọc</span>
            <strong className="score-section__value" data-testid={TID.scoreReading}>
              {estimate.reading}
            </strong>
            <span className="score-section__scale">0–495</span>
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

      {copied ? (
        <div className="toast toast--bottom" role="status">
          ✓ Đã sao chép tóm tắt kết quả vào bộ nhớ tạm!
        </div>
      ) : null}
    </div>
  )
}

