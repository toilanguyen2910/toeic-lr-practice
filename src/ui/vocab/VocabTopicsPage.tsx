/**
 * MÀN CHỌN CHỦ ĐỀ — `#/vocab`.
 *
 * Mười hai thẻ, mỗi thẻ: icon, tên chủ đề, một dòng mô tả, và tiến độ (đã thuộc /
 * tổng). Số liệu lấy từ engine thật (`filterWords` + `summarizeProgress`), không
 * đếm tay trong component — nếu không thì hai chỗ sẽ lệch nhau khi hộp Leitner đổi.
 */
import { useMemo } from 'react'
import {
  ROUTES,
  TID,
  vocabBrowseRoute,
  vocabQuizRoute,
  vocabStudyRoute,
} from '../../testids'
import { VOCAB_TOPICS, VOCAB_TOPIC_META } from '../../types-vocab'
import type { LeitnerBox, VocabTopic } from '../../types-vocab'
import { filterWords, summarizeProgress } from '../../lib/vocab'
import { VOCAB_BANK, VOCAB_IS_FIXTURE } from './vocabBank'
import { useVocabProgress } from './useVocabProgress'
import { computeStreak } from './streak'
import { LucianStreakFlame } from './lucian/LucianStreakFlame'

/** Hộp 5 là đã thuộc — cùng ngưỡng với `summarizeProgress`. */
const MASTERED_BOX: LeitnerBox = 5

export function VocabTopicsPage() {
  const { progress, now } = useVocabProgress()

  const summary = useMemo(
    () => summarizeProgress(VOCAB_BANK, progress, now),
    [progress, now],
  )

  const streak = useMemo(() => computeStreak(progress, now), [progress, now])

  /** Tiến độ từng chủ đề: tổng số từ và số đã thuộc. */
  const byTopic = useMemo(() => {
    const map = new Map<VocabTopic, { total: number; mastered: number; due: number }>()
    for (const topic of VOCAB_TOPICS) {
      const words = filterWords(VOCAB_BANK, progress, { topic })
      let mastered = 0
      let due = 0
      for (const word of words) {
        const entry = progress[word.id]
        if (entry && entry.box >= MASTERED_BOX) mastered += 1
        if (!entry || entry.nextReviewAt <= now) due += 1
      }
      map.set(topic, { total: words.length, mastered, due })
    }
    return map
  }, [progress, now])

  return (
    <div data-testid={TID.vocabTopics} className="stack stack--loose">
      <div className="page-head">
        <span className="section-label">Từ vựng</span>
        <h1>Học từ vựng theo chủ đề</h1>
        <p className="page-head__lead">
          Mỗi chủ đề gồm các từ thường gặp trong công việc. Thẻ lật để tự kiểm tra, rồi đánh
          dấu đã thuộc hay chưa — app tự hẹn ngày ôn lại theo hộp Leitner.
        </p>
      </div>

      {VOCAB_IS_FIXTURE ? (
        <p className="vocab-fixture-note" role="status">
          Đang dùng <strong>dữ liệu mẫu</strong> ({VOCAB_BANK.words.length} từ) trong lúc bộ
          600 từ đang được biên soạn. Mọi thao tác vẫn chạy thật và lưu tiến độ bình thường.
        </p>
      ) : null}

      <section className="vocab-overview" aria-label="Tổng quan tiến độ">
        <div className="vocab-overview__stats" data-testid={TID.vocabSummary}>
          <div className="vocab-stat">
            <span className="vocab-stat__num" data-testid={TID.vocabSummaryMastered}>
              {summary.mastered}
            </span>
            <span className="vocab-stat__label">từ đã thuộc</span>
          </div>
          <div className="vocab-stat">
            <span className="vocab-stat__num" data-testid={TID.vocabSummaryDue}>
              {summary.dueToday}
            </span>
            <span className="vocab-stat__label">từ cần ôn hôm nay</span>
          </div>
          <div className="vocab-stat">
            <span className="vocab-stat__num">{summary.untouched}</span>
            <span className="vocab-stat__label">từ chưa học lần nào</span>
          </div>
          <div className="btn-row">
            <a className="btn btn--primary" href={ROUTES.vocabStudy} data-testid={TID.vocabStartStudy}>
              Ôn từ đến hạn ({summary.dueToday})
            </a>
            <a className="btn" href={ROUTES.vocabQuiz} data-testid={TID.vocabStartQuiz}>
              Kiểm tra trắc nghiệm
            </a>
            <a className="btn btn--ghost" href={ROUTES.vocabBrowse} data-testid={TID.vocabBrowseLink}>
              Xem toàn bộ từ
            </a>
          </div>
        </div>

        <LucianStreakFlame
          streak={streak.streak}
          week={streak.week}
          weekLabels={streak.weekLabels}
        />
      </section>

      <section className="vocab-topic-grid" aria-label="Danh sách chủ đề">
        {VOCAB_TOPICS.map((topic) => {
          const meta = VOCAB_TOPIC_META[topic]
          const stats = byTopic.get(topic) ?? { total: 0, mastered: 0, due: 0 }
          const ratio = stats.total > 0 ? stats.mastered / stats.total : 0
          /*
            Thẻ là `<div>` chứ không phải `<a>`: bên trong còn hai liên kết phụ
            ("Xem", "Kiểm tra"). Lồng `<a>` trong `<a>` là HTML không hợp lệ và
            trình duyệt sẽ tự tách thẻ, làm hỏng bố cục.

            Thay vào đó dùng "stretched link": liên kết chính phủ toàn thẻ bằng
            `::after`, các liên kết phụ nằm trên nhờ `z-index`. Vẫn bấm được cả
            thẻ, vẫn chỉ có một điểm dừng Tab cho mỗi hành động.
          */
          return (
            <div
              key={topic}
              className="vocab-topic"
              data-testid={TID.vocabTopicCard(topic)}
            >
              <span className="vocab-topic__head">
                <span className="vocab-topic__icon" aria-hidden="true">
                  {meta.icon}
                </span>
                <a className="vocab-topic__name vocab-topic__link" href={vocabStudyRoute(topic)}>
                  {meta.label}
                </a>
              </span>
              <span className="vocab-topic__note">{meta.note}</span>
              <span
                className="vocab-topic__progress"
                data-testid={TID.vocabTopicProgress(topic)}
              >
                {stats.mastered} / {stats.total} đã thuộc
              </span>
              <span className="vocab-topic__bar" aria-hidden="true">
                <span className="vocab-topic__fill" style={{ width: `${ratio * 100}%` }} />
              </span>
              <span className="vocab-topic__actions">
                <span className="vocab-topic__due">{stats.due} từ cần ôn</span>
                <span className="vocab-topic__links">
                  <a href={vocabBrowseRoute(topic)} className="link-button">
                    Xem
                  </a>
                  {' · '}
                  <a href={vocabQuizRoute(topic)} className="link-button">
                    Kiểm tra
                  </a>
                </span>
              </span>
            </div>
          )
        })}
      </section>
    </div>
  )
}
