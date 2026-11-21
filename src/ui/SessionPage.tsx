import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { formatClock } from '../lib'
import type { Session } from '../lib/contract'
import type { Letter, Part, Question, Stimulus } from '../types'
import { PART_META } from '../types'
import { ROUTES, TID } from '../testids'
import { navigate } from '../hooks/useHashRoute'
import { suggestedDurationSeconds } from '../hooks/sessionDuration'
import { useStimulusAudio } from '../hooks/useStimulusAudio'
import { AudioPlayer } from './AudioPlayer'
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
  showChoiceText,
  onToggleChoiceText,
}: {
  stimulus: Stimulus
  part: Question['part']
  audioEnabled: boolean
  /** Chỉ dùng cho Part 1: đang hiện chữ đáp án hay ẩn. */
  showChoiceText: boolean
  onToggleChoiceText: () => void
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
          {hasAudioScript && part === 1 ? (
            <button
              type="button"
              className="btn btn--sm btn--ghost"
              onClick={onToggleChoiceText}
              data-testid={TID.toggleChoiceText}
              aria-pressed={showChoiceText}
            >
              {showChoiceText ? 'Ẩn chữ đáp án' : 'Hiện chữ đáp án'}
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

          {/*
            Thanh phát âm thanh đặt NGAY DƯỚI ảnh, đúng bố cục đề thi thật: nhìn
            ảnh, nghe mô tả, chọn đáp án. Trước đây nút nghe nằm trên tiêu đề ngữ
            liệu nên người dùng phải mắt lên góc mới thấy.
          */}
          {hasAudioScript ? <AudioPlayer audio={audio} stimulusId={stimulus.id} /> : null}

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
  /**
   * Part 1: có hiện chữ của bốn phương án hay không.
   *
   * Mặc định ẨN, đúng như đề thi thật — Part 1 chỉ nghe, không in chữ. Người mới
   * hoặc người không nghe được có thể bấm "Hiện chữ đáp án" để đọc.
   */
  const [showChoiceText, setShowChoiceText] = useState(false)
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
  const isPart1 = question.part === 1

  /**
   * Nhóm câu hỏi theo PART cho bảng điều hướng.
   *
   * Giữ `position` là vị trí trong `questionIds` (số thứ tự thật của câu trong
   * phiên), nên nhãn "câu 40–79" vẫn khớp số hiển thị trên ô. Chỉ nhóm lại để
   * hiển thị, không đổi dữ liệu phiên.
   */
  const paletteGroups = (() => {
    const groups: Array<{ part: Part; from: number; to: number; items: Array<{ id: string; position: number }> }> = []
    session.questionIds.forEach((id, position) => {
      const q = index.questionById.get(id)
      const part: Part = q?.part ?? 1
      const last = groups[groups.length - 1]
      if (last && last.part === part) {
        last.items.push({ id, position })
        last.to = position
      } else {
        groups.push({ part, from: position, to: position, items: [{ id, position }] })
      }
    })
    return groups
  })()

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
            showChoiceText={showChoiceText}
            onToggleChoiceText={() => setShowChoiceText((prev) => !prev)}
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

            /**
             * PART 1 ẨN CHỮ ĐÁP ÁN.
             *
             * Đề thi thật: Part 1 chỉ nghe bốn câu mô tả tranh, KHÔNG in chữ ra
             * giấy — người thi phải nghe và tự chọn. Nếu app hiện sẵn văn bản thì
             * không còn là bài luyện nghe nữa, chỉ là bài đọc hiểu.
             *
             * Nay Part 1 chỉ hiện nút A/B/C/D trống. Muốn xem chữ thì bấm "Hiện
             * chữ" (dành cho người mới, hoặc khi trình duyệt không có âm thanh).
             * Sau khi chọn đáp án, phần phản hồi vẫn hiện đầy đủ như các part khác.
             */
            const hideText = isPart1 && !showChoiceText

            return (
              <button
                key={choice.letter}
                type="button"
                className={`choice ${stateClass} ${hideText ? 'choice--audio-only' : ''}`}
                data-testid={TID.choice(choice.letter)}
                data-selected={isSelected ? 'true' : 'false'}
                aria-pressed={isSelected}
                aria-label={hideText ? `Đáp án ${choice.letter}` : undefined}
                onClick={() => handleSelect(choice.letter)}
              >
                <span className="choice__letter" aria-hidden="true">
                  {choice.letter}
                </span>
                {hideText ? null : <span className="choice__text">{choice.text}</span>}
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
        {/*
          Nhóm câu theo PART thay vì một lưới phẳng.

          Vì sao: đề 200 câu trải bảy part với số câu rất khác nhau (6, 25, 39,
          30, 30, 16, 54). Lưới phẳng 200 ô không cho biết câu 47 thuộc part nào,
          nên người làm bài không nhảy nhanh tới part mình muốn được. Nhóm theo
          part cũng khớp cách đề thật trình bày: mỗi phần có dải câu riêng.
        */}
        <div className="palette__groups">
          {paletteGroups.map((group, groupIndex) => (
            /*
             * Key phải gồm cả chỉ số nhóm, không chỉ `part`.
             *
             * Một part có thể xuất hiện ở HAI nhóm nếu đề không xếp part liền
             * mạch (ví dụ phiên luyện chọn part 1 và 5 nhưng thứ tự câu bị trộn).
             * Dùng `key={group.part}` sẽ sinh key trùng và React báo lỗi.
             */
            <section className="palette__group" key={`${group.part}-${groupIndex}`}>
              <h4 className="palette__group-title">
                <span className="palette__group-name">{PART_META[group.part].label}</span>
                <span className="palette__group-range">
                  câu {group.from + 1}–{group.to + 1}
                </span>
                <span className="palette__group-count">{group.items.length} câu</span>
              </h4>
              <div className="palette__grid">
                {group.items.map(({ id, position }) => {
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
                      aria-label={`Câu ${position + 1}, ${PART_META[group.part].label}${
                        isAnswered ? ', đã trả lời' : ', chưa trả lời'
                      }${flagged ? ', đã đánh dấu' : ''}`}
                      aria-current={isCurrent ? 'true' : undefined}
                      onClick={() => goTo(position)}
                    >
                      {position + 1}
                      {flagged ? <span aria-hidden="true">★</span> : null}
                    </button>
                  )
                })}
              </div>
            </section>
          ))}
        </div>
      </details>
    </div>
  )
}
