import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { formatClock } from '../lib'
import type { Session } from '../lib/contract'
import type { Letter, Question, Stimulus } from '../types'
import { PART_META } from '../types'
import { ROUTES, TID } from '../testids'
import { navigate } from '../hooks/useHashRoute'
import { suggestedDurationSeconds } from '../hooks/sessionDuration'
import { useStimulusAudio } from '../hooks/useStimulusAudio'
import { useAppSettings } from './settingsContext'
import { useSession } from './sessionContext'
import type { BankIndex } from '../hooks/useBankIndex'
import { partSectionLabel } from './partHelpers'

const LETTERS: Letter[] = ['A', 'B', 'C', 'D']

interface SessionPageProps {
  session: Session
  index: BankIndex
}

/** Khoá số câu → chữ cái, dùng cho cả bàn phím lẫn hiển thị. */
function letterAt(position: number): Letter | null {
  return LETTERS[position] ?? null
}

/** Phần ngữ liệu: ảnh (Part 1), lời thoại (Part 1–4), đoạn văn (Part 6–7). */
function StimulusBlock({
  stimulus,
  part,
  audioEnabled,
}: {
  stimulus: Stimulus
  part: Question['part']
  audioEnabled: boolean
}) {
  // Part 3/4/6/7 có ngữ liệu dài: mặc định mở, nhưng bấm được để thu gọn.
  const [open, setOpen] = useState(true)
  // Nguồn âm thanh ưu tiên file MP3 sinh sẵn; thiếu file thì rơi về giọng trình duyệt.
  const audio = useStimulusAudio(stimulus.id, stimulus.audioScript, audioEnabled)
  const meta = PART_META[part]

  const hasPassages = Boolean(stimulus.passages && stimulus.passages.length > 0)
  const hasAudioScript = Boolean(stimulus.audioScript)
  const hasImage = Boolean(stimulus.imageUrl)

  if (!hasPassages && !hasAudioScript && !hasImage) return null

  return (
    <section className="stimulus" data-testid={TID.stimulus} aria-label={`Ngữ liệu ${meta.label}`}>
      <div className="stimulus__head">
        <h2 className="stimulus__title">
          {hasPassages ? 'Đoạn văn' : hasImage ? 'Hình ảnh' : 'Lời thoại'} · {meta.label}
        </h2>
        <div className="stimulus__tools">
          {hasAudioScript ? (
            <button
              type="button"
              className="btn btn--sm btn--ghost"
              onClick={() => (audio.playing ? audio.stop() : audio.play())}
              disabled={!audio.supported || audio.loading}
              title={
                audio.supported
                  ? audio.usingFallback
                    ? 'Chưa có file âm thanh cho đoạn này — đang dùng giọng của trình duyệt'
                    : 'Phát audio'
                  : 'Âm thanh đang tắt trong Cài đặt'
              }
              data-testid={TID.audioToggle}
            >
              {audio.loading
                ? '… Đang tải'
                : audio.playing
                  ? '■ Dừng'
                  : '▶ Nghe'}
            </button>
          ) : null}
          <button
            type="button"
            className="btn btn--sm btn--ghost"
            onClick={() => setOpen((prev) => !prev)}
            aria-expanded={open}
          >
            {open ? 'Thu gọn' : 'Mở rộng'}
          </button>
        </div>
      </div>

      {open ? (
        <div className="stimulus__body">
          {hasImage ? (
            <figure className="stimulus__figure">
              <img
                className="stimulus__image"
                // `imageUrl` trong ngân hàng là đường dẫn tuyệt đối từ gốc
                // (`/images/part1-01.svg`). Khi app được deploy dưới một thư mục
                // con — ví dụ GitHub Pages phục vụ ở `/<ten-repo>/` — đường dẫn
                // đó sẽ trỏ ra ngoài và ảnh 404. Ghép thêm `BASE_URL` để đúng ở
                // cả hai trường hợp.
                src={`${import.meta.env.BASE_URL.replace(/\/$/, '')}${stimulus.imageUrl}`}
                alt={`Hình minh hoạ cho ${meta.label}`}
                loading="lazy"
              />
            </figure>
          ) : null}

          {hasPassages
            ? stimulus.passages?.map((passage, passageIndex) => (
                <article
                  className="passage"
                  data-testid={TID.passage}
                  key={`${stimulus.id}-passage-${passageIndex}`}
                >
                  {passage.label ? <span className="passage__label">{passage.label}</span> : null}
                  <p className="passage__text">{passage.text}</p>
                </article>
              ))
            : null}

          {hasAudioScript && !hasImage ? (
            <p className="stimulus__script">{stimulus.audioScript}</p>
          ) : null}
        </div>
      ) : null}
    </section>
  )
}

/** Khối phản hồi ở chế độ luyện tập: đúng/sai + giải thích + bản dịch. */
function FeedbackBlock({ question, chosen }: { question: Question; chosen: Letter }) {
  const isCorrect = chosen === question.answer

  return (
    <section
      className={`feedback ${isCorrect ? 'feedback--ok' : 'feedback--bad'}`}
      data-testid={TID.feedback}
      aria-live="polite"
    >
      <p className="feedback__verdict" data-testid={TID.feedbackCorrect}>
        <span className="feedback__icon" aria-hidden="true">
          {isCorrect ? '✓' : '✗'}
        </span>
        {isCorrect ? 'Đúng' : 'Sai'}
        {isCorrect ? null : (
          <span className="feedback__answer"> — đáp án đúng là {question.answer}</span>
        )}
      </p>

      <div className="feedback__explain" data-testid={TID.feedbackExplanation}>
        <p className="feedback__label">Giải thích</p>
        <p className="feedback__text">{question.explanation}</p>
        {question.translation ? (
          <>
            <p className="feedback__label">Bản dịch</p>
            <p className="feedback__text feedback__text--muted">{question.translation}</p>
          </>
        ) : null}
      </div>
    </section>
  )
}

/** Màn hình làm bài — dùng chung cho `#/practice/session` và `#/mock`. */
export function SessionPage({ session, index }: SessionPageProps) {
  const { answer, flag, finish, syncElapsed } = useSession()
  const { settings } = useAppSettings()

  const total = session.questionIds.length
  const [cursor, setCursor] = useState(0)
  const safeCursor = Math.min(Math.max(cursor, 0), Math.max(total - 1, 0))
  const questionId = session.questionIds[safeCursor]
  const question = questionId ? index.questionById.get(questionId) : undefined

  const isMock = session.mode === 'mock'
  const duration = session.durationSeconds ?? suggestedDurationSeconds(session.parts)

  // Đồng hồ: đếm lên khi luyện tập, đếm ngược khi thi thử.
  // `SessionPage` luôn được mount với `key={session.id}` nên mỗi phiên có đồng hồ
  // riêng; khởi tạo từ `elapsedSeconds` đã lưu là đủ, không cần đồng bộ lại.
  const [elapsed, setElapsed] = useState(() => Math.max(0, session.elapsedSeconds))
  const submittedRef = useRef(false)

  useEffect(() => {
    const timer = window.setInterval(() => {
      setElapsed((prev) => prev + 1)
    }, 1000)
    return () => window.clearInterval(timer)
  }, [])

  // Ghi thời gian vào phiên để "Tiếp tục" sau khi tải lại vẫn đúng.
  useEffect(() => {
    syncElapsed(elapsed)
  }, [elapsed, syncElapsed])

  const remaining = Math.max(0, duration - elapsed)
  const clockSeconds = isMock ? remaining : elapsed
  const timedOut = isMock && remaining <= 0

  const goToResult = useCallback(
    (seconds: number) => {
      if (submittedRef.current) return
      submittedRef.current = true
      finish(seconds)
      navigate(ROUTES.result)
    },
    [finish],
  )

  // Hết giờ thì tự nộp, đúng như yêu cầu của chế độ thi thử.
  useEffect(() => {
    if (!timedOut) return
    goToResult(duration)
  }, [timedOut, duration, goToResult])

  const answeredCount = useMemo(
    () => session.questionIds.filter((id) => session.answers[id] != null).length,
    [session.questionIds, session.answers],
  )

  const goTo = useCallback(
    (next: number) => {
      setCursor(Math.min(Math.max(next, 0), Math.max(total - 1, 0)))
    },
    [total],
  )

  const handleSelect = useCallback(
    (letter: Letter) => {
      if (!questionId) return
      answer(questionId, letter)
    },
    [answer, questionId],
  )

  const handleSubmit = useCallback(() => {
    goToResult(elapsed)
  }, [elapsed, goToResult])

  // Bàn phím: 1–4 chọn A–D, ← → chuyển câu.
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.defaultPrevented || event.ctrlKey || event.metaKey || event.altKey) return
      const target = event.target as HTMLElement | null
      if (target) {
        const tag = target.tagName
        if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || target.isContentEditable) return
      }

      if (event.key === 'ArrowRight') {
        event.preventDefault()
        goTo(safeCursor + 1)
        return
      }
      if (event.key === 'ArrowLeft') {
        event.preventDefault()
        goTo(safeCursor - 1)
        return
      }

      const letter = letterAt(Number.parseInt(event.key, 10) - 1)
      if (!letter) return
      if (!question?.choices.some((choice) => choice.letter === letter)) return
      event.preventDefault()
      handleSelect(letter)
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [goTo, safeCursor, handleSelect, question])

  if (!question) {
    return (
      <div className="stack">
        <h1>Phiên làm bài trống</h1>
        <p className="page-head__lead">
          Phiên này không còn câu hỏi nào. Hãy quay lại chọn part và bắt đầu một phiên mới.
        </p>
        <div className="btn-row">
          <a className="btn btn--primary" href={ROUTES.partSelect}>
            Chọn part
          </a>
        </div>
      </div>
    )
  }

  const stimulus = question.stimulusId ? index.stimulusById.get(question.stimulusId) : undefined
  const isFlagged = session.flagged[question.id] === true
  const chosen = session.answers[question.id] ?? null
  const revealFeedback = session.revealMode && chosen != null
  const progressPercent = total === 0 ? 0 : Math.round((answeredCount / total) * 100)
  const meta = PART_META[question.part]

  return (
    <div className="session" data-testid={TID.session}>
      <header className="session__bar">
        <div className="session__bar-left">
          <span className={`badge ${isMock ? 'badge--info' : ''}`}>
            {isMock ? 'Thi thử' : 'Luyện tập'}
          </span>
          <span className="session__part">
            {meta.label} · {partSectionLabel(question.part)}
          </span>
        </div>

        <div className="session__bar-right">
          <span className="session__counter" data-testid={TID.questionCounter}>
            Câu {safeCursor + 1} / {total}
          </span>
          <span
            className={`session__timer ${isMock && remaining <= 60 ? 'is-urgent' : ''}`}
            data-testid={TID.timer}
            aria-label={isMock ? 'Thời gian còn lại' : 'Thời gian đã làm'}
          >
            {formatClock(clockSeconds)}
          </span>
        </div>
      </header>

      <div className="progress-wrap">
        <div
          className="progress"
          data-testid={TID.progress}
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={total}
          aria-valuenow={answeredCount}
          aria-label={`Đã trả lời ${answeredCount} trên ${total} câu`}
        >
          <span className="progress__fill" style={{ width: `${progressPercent}%` }} />
        </div>
        <span className="progress__label">
          Đã trả lời {answeredCount}/{total}
        </span>
      </div>

      <article className="question" data-testid={TID.question}>
        {stimulus ? (
          <StimulusBlock
            stimulus={stimulus}
            part={question.part}
            audioEnabled={settings.audioEnabled}
          />
        ) : null}

        <div className="question__prompt" data-testid={TID.prompt}>
          {question.prompt
            ? question.prompt
            : question.part === 1
              ? 'Chọn câu mô tả đúng nhất với bức ảnh.'
              : 'Chọn câu trả lời phù hợp nhất.'}
        </div>

        <div className="choices" role="group" aria-label="Các lựa chọn">
          {question.choices.map((choice) => {
            const isSelected = chosen === choice.letter
            const showCorrect = revealFeedback && choice.letter === question.answer
            const showWrong = revealFeedback && isSelected && choice.letter !== question.answer
            const stateClass = showCorrect
              ? 'choice--correct'
              : showWrong
                ? 'choice--wrong'
                : isSelected
                  ? 'choice--selected'
                  : ''

            return (
              <button
                key={choice.letter}
                type="button"
                className={`choice ${stateClass}`}
                data-testid={TID.choice(choice.letter)}
                data-selected={isSelected ? 'true' : 'false'}
                aria-pressed={isSelected}
                onClick={() => handleSelect(choice.letter)}
              >
                <span className="choice__letter" aria-hidden="true">
                  {choice.letter}
                </span>
                <span className="choice__text">{choice.text}</span>
                {showCorrect ? (
                  <span className="choice__mark" aria-label="đáp án đúng">
                    ✓
                  </span>
                ) : null}
                {showWrong ? (
                  <span className="choice__mark" aria-label="bạn chọn sai">
                    ✗
                  </span>
                ) : null}
              </button>
            )
          })}
        </div>

        {revealFeedback ? <FeedbackBlock question={question} chosen={chosen} /> : null}
      </article>

      <nav className="session__nav" aria-label="Điều khiển bài làm">
        <button
          type="button"
          className="btn"
          data-testid={TID.prevQuestion}
          onClick={() => goTo(safeCursor - 1)}
          disabled={safeCursor === 0}
        >
          ← Câu trước
        </button>

        <button
          type="button"
          className={`btn ${isFlagged ? 'btn--flag' : ''}`}
          data-testid={TID.flagToggle}
          aria-pressed={isFlagged}
          onClick={() => flag(question.id)}
        >
          {isFlagged ? '★ Đã đánh dấu' : '☆ Đánh dấu xem lại'}
        </button>

        <button
          type="button"
          className="btn"
          data-testid={TID.nextQuestion}
          onClick={() => goTo(safeCursor + 1)}
          disabled={safeCursor >= total - 1}
        >
          Câu sau →
        </button>

        <span className="spacer" />

        <button
          type="button"
          className="btn btn--primary"
          data-testid={TID.submitSession}
          onClick={handleSubmit}
        >
          Nộp bài
        </button>
      </nav>

      <details className="palette">
        <summary className="palette__summary">Bảng câu hỏi ({answeredCount}/{total} đã trả lời)</summary>
        <div className="palette__grid">
          {session.questionIds.map((id, position) => {
            const isCurrent = position === safeCursor
            const isAnswered = session.answers[id] != null
            const flagged = session.flagged[id] === true
            const classes = [
              'palette__cell',
              isCurrent ? 'is-current' : '',
              isAnswered ? 'is-answered' : '',
              flagged ? 'is-flagged' : '',
            ]
              .filter(Boolean)
              .join(' ')

            return (
              <button
                key={id}
                type="button"
                className={classes}
                aria-label={`Câu ${position + 1}${isAnswered ? ', đã trả lời' : ', chưa trả lời'}${
                  flagged ? ', đã đánh dấu' : ''
                }`}
                aria-current={isCurrent ? 'true' : undefined}
                onClick={() => goTo(position)}
              >
                {position + 1}
                {flagged ? <span aria-hidden="true">★</span> : null}
              </button>
            )
          })}
        </div>
      </details>
    </div>
  )
}
