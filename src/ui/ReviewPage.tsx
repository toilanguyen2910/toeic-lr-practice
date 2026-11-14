import { useMemo, useState } from 'react'
import type { Question } from '../types'
import { PART_META } from '../types'
import { ROUTES, TID } from '../testids'
import { useSession } from './sessionContext'
import { getPreferredReviewFilter } from './reviewFilter'
import type { ReviewFilter } from './reviewFilter'
import type { BankIndex } from '../hooks/useBankIndex'

interface ReviewRow {
  questionId: string
  position: number
  question: Question | undefined
  chosen: string | null
  isCorrect: boolean
}

/** Màn hình xem lại bài làm, có bộ lọc "chỉ câu sai". */
export function ReviewPage({ index }: { index: BankIndex }) {
  const { session } = useSession()
  const [filter, setFilter] = useState<ReviewFilter>(getPreferredReviewFilter)

  const rows = useMemo<ReviewRow[]>(() => {
    if (!session) return []
    return session.questionIds.map((questionId, position) => {
      const question = index.questionById.get(questionId)
      const chosen = session.answers[questionId] ?? null
      return {
        questionId,
        position,
        question,
        chosen,
        isCorrect: question != null && chosen === question.answer,
      }
    })
  }, [session, index])

  const wrongRows = rows.filter((row) => !row.isCorrect)
  const visible = filter === 'wrong' ? wrongRows : rows

  if (!session || rows.length === 0) {
    return (
      <div data-testid={TID.review} className="stack">
        <h1>Chưa có bài nào để xem lại</h1>
        <div className="empty-state">
          <div className="empty-state__icon" aria-hidden="true">
            ↺
          </div>
          <h3>Không có dữ liệu xem lại</h3>
          <p>Hoàn thành một phiên làm bài rồi mở lại màn hình này để xem đáp án và giải thích.</p>
          <div className="btn-row">
            <a className="btn btn--primary" href={ROUTES.partSelect}>
              Luyện theo part
            </a>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div data-testid={TID.review} className="stack">
      <div className="page-head">
        <span className="section-label">Xem lại</span>
        <h1>Đáp án và giải thích từng câu</h1>
        <p className="page-head__lead">
          {rows.length} câu · {rows.length - wrongRows.length} đúng · {wrongRows.length} sai hoặc bỏ trống.
        </p>
      </div>

      <div className="filter-bar" role="group" aria-label="Bộ lọc câu hỏi">
        <button
          type="button"
          className="filter-chip"
          data-testid={TID.reviewFilterAll}
          data-checked={filter === 'all' ? 'true' : 'false'}
          aria-pressed={filter === 'all'}
          onClick={() => setFilter('all')}
        >
          Tất cả ({rows.length})
        </button>
        <button
          type="button"
          className="filter-chip"
          data-testid={TID.reviewFilterWrong}
          data-checked={filter === 'wrong' ? 'true' : 'false'}
          aria-pressed={filter === 'wrong'}
          onClick={() => setFilter('wrong')}
        >
          Chỉ câu sai ({wrongRows.length})
        </button>
      </div>

      {visible.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state__icon" aria-hidden="true">
            ✓
          </div>
          <h3>Không có câu sai</h3>
          <p>Bạn đã trả lời đúng toàn bộ các câu trong phiên này. Chuyển sang “Tất cả” để xem lại từng câu.</p>
        </div>
      ) : null}

      <div className="review-list">
        {visible.map((row) => {
          const { question } = row
          if (!question) {
            return (
              <article className="card review-item" data-testid={TID.reviewItem} key={row.questionId}>
                <p className="card__hint">Không tìm thấy nội dung cho câu id “{row.questionId}”.</p>
              </article>
            )
          }

          const meta = PART_META[question.part]
          const chosenText = question.choices.find((choice) => choice.letter === row.chosen)?.text
          const correctText = question.choices.find((choice) => choice.letter === question.answer)?.text
          const statusClass = row.isCorrect ? 'review-item--ok' : 'review-item--bad'

          return (
            <article
              className={`card review-item ${statusClass}`}
              data-testid={TID.reviewItem}
              key={row.questionId}
            >
              <header className="review-item__head">
                <span className="badge">
                  Câu {row.position + 1} · {meta.label}
                </span>
                <span className={`badge ${row.isCorrect ? 'badge--ok' : 'badge--bad'}`}>
                  <span aria-hidden="true">{row.isCorrect ? '✓' : '✗'}</span>
                  {row.isCorrect ? 'Đúng' : row.chosen ? 'Sai' : 'Bỏ trống'}
                </span>
                {session.flagged[question.id] ? <span className="badge badge--flag">★ Đã đánh dấu</span> : null}
              </header>

              <p className="review-item__prompt">
                {question.prompt
                  ? question.prompt
                  : question.part === 1
                    ? 'Chọn câu mô tả đúng nhất với bức ảnh.'
                    : 'Chọn câu trả lời phù hợp nhất.'}
              </p>

              <dl className="review-item__answers">
                <div className="review-item__answer">
                  <dt>Bạn chọn</dt>
                  <dd className={row.isCorrect ? 'is-ok' : 'is-bad'}>
                    {row.chosen ? (
                      <>
                        <strong>{row.chosen}.</strong> {chosenText}
                      </>
                    ) : (
                      '— Không chọn đáp án'
                    )}
                  </dd>
                </div>
                <div className="review-item__answer">
                  <dt>Đáp án đúng</dt>
                  <dd className="is-ok">
                    <strong>{question.answer}.</strong> {correctText}
                  </dd>
                </div>
              </dl>

              <div className="review-item__explain">
                <p className="review-item__label">Giải thích</p>
                <p>{question.explanation}</p>
                {question.translation ? (
                  <>
                    <p className="review-item__label">Bản dịch</p>
                    <p className="review-item__translation">{question.translation}</p>
                  </>
                ) : null}
              </div>
            </article>
          )
        })}
      </div>

      <div className="btn-row">
        <a className="btn btn--primary" href={ROUTES.result}>
          Về trang kết quả
        </a>
        <a className="btn" href={ROUTES.home}>
          Trang chủ
        </a>
      </div>
    </div>
  )
}
