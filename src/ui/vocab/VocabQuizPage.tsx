/**
 * MÀN TRẮC NGHIỆM — `#/vocab/quiz` (kèm `?topic=…`).
 *
 * Bốn lựa chọn, một đúng. Lựa chọn sinh bằng `buildQuizChoices` của engine, nên
 * nhiễu luôn cùng chủ đề trước và không có hai đáp án trùng nghĩa.
 *
 * Vì sao chốt danh sách câu lúc mount: giống màn ôn — nếu tính lại theo `progress`
 * thì mỗi lần trả lời xong, danh sách co lại và người học bị nhảy câu.
 *
 * Vì sao đáp án đúng/sai hiện ngay: đây là màn KIỂM TRA, không phải màn thi. Người
 * học cần biết đúng sai để nhớ; màn làm bài thi thật vẫn giữ nguyên hành vi cũ.
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { VocabWord } from '../../types-vocab'
import { VOCAB_TOPIC_META } from '../../types-vocab'
import { buildQuizChoices, loadVocabSettings, pickDueWords } from '../../lib/vocab'
import { ROUTES, TID, vocabQuery } from '../../testids'
import { VOCAB_BANK } from './vocabBank'
import { useVocabProgress } from './useVocabProgress'
import { LucianProgressRing } from './lucian/LucianProgressRing'
import { LucianEmptyState } from './lucian/LucianEmptyState'
import { LucianSessionDone } from './lucian/LucianSessionDone'

interface QuizItem {
  word: VocabWord
  choices: Array<{ wordId: string; text: string; correct: boolean }>
}

/** Chủ đề hợp lệ từ hash, hoặc `null`. */
function readTopic(): string | null {
  const raw = vocabQuery(window.location.hash).get('topic')
  if (!raw) return null
  return raw in VOCAB_TOPIC_META ? raw : null
}

export function VocabQuizPage() {
  const [topic] = useState<string | null>(readTopic)
  const { progress, answer, now } = useVocabProgress()

  /**
   * Bộ câu hỏi chốt lúc mount.
   *
   * `random` là `Math.random` — khác với test của engine (truyền hàm tất định).
   * Ở đây không cần tất định: mỗi lượt kiểm tra nên có thứ tự nhiễu khác nhau.
   */
  const [items] = useState<QuizItem[]>(() => {
    const scoped = topic
      ? VOCAB_BANK.words.filter((word) => word.topic === topic)
      : VOCAB_BANK.words
    const pool = pickDueWords(
      { version: VOCAB_BANK.version, words: scoped },
      progress,
      now,
      loadVocabSettings().sessionSize,
    )
    return pool.map((word) => ({
      word,
      choices: buildQuizChoices(VOCAB_BANK, word, Math.random),
    }))
  })

  const [index, setIndex] = useState(0)
  const [picked, setPicked] = useState<string | null>(null)
  const [score, setScore] = useState({ right: 0, wrong: 0 })

  const current = items[index]
  const total = items.length
  const finished = total > 0 && index >= total
  const topicLabel = topic ? (VOCAB_TOPIC_META[topic as keyof typeof VOCAB_TOPIC_META]?.label ?? null) : null

  const lockRef = useRef(false)
  const releaseTimer = useRef<number | undefined>(undefined)

  useEffect(
    () => () => {
      if (releaseTimer.current !== undefined) window.clearTimeout(releaseTimer.current)
    },
    [],
  )

  const pick = useCallback(
    (choice: { wordId: string; correct: boolean }) => {
      if (!current || picked !== null || lockRef.current) return
      lockRef.current = true
      setPicked(choice.wordId)
      /*
       * Trắc nghiệm cũng là một lần trả lời, nhưng KHÔNG có bốn mức — người học
       * chọn đáp án chứ không tự đánh giá. Ánh xạ: đúng → `good`, sai → `again`.
       * Dùng `good` chứ không `easy` vì chọn đúng một câu chưa chứng minh là quá
       * dễ; muốn đẩy nhanh thì sang màn ôn thẻ bấm mức "Dễ".
       */
      answer(current.word.id, choice.correct ? 'good' : 'again')
      setScore((previous) => ({
        right: previous.right + (choice.correct ? 1 : 0),
        wrong: previous.wrong + (choice.correct ? 0 : 1),
      }))
      releaseTimer.current = window.setTimeout(() => {
        lockRef.current = false
      }, 220)
    },
    [answer, current, picked],
  )

  const next = useCallback(() => {
    setPicked(null)
    setIndex((previous) => previous + 1)
  }, [])

  // Bàn phím: 1–4 chọn đáp án, Enter sang câu tiếp khi đã trả lời.
  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      const tag = (event.target as HTMLElement | null)?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return
      if (event.metaKey || event.ctrlKey || event.altKey) return
      if (finished) return

      if (picked === null) {
        const position = Number(event.key)
        if (Number.isInteger(position) && position >= 1 && position <= 4) {
          const choice = current?.choices[position - 1]
          if (choice) {
            event.preventDefault()
            pick(choice)
          }
        }
        return
      }

      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault()
        next()
      }
    }

    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [current, finished, next, pick, picked])

  const restart = useCallback(() => {
    window.location.hash = topic ? `${ROUTES.vocabQuiz}?topic=${encodeURIComponent(topic)}` : ROUTES.vocabQuiz
    window.location.reload()
  }, [topic])

  const summaryLine = useMemo(() => `Đúng ${score.right} · Sai ${score.wrong}`, [score])

  if (total === 0) {
    return (
      <div data-testid={TID.vocabQuiz} className="stack stack--loose">
        <div className="page-head">
          <span className="section-label">{topicLabel ?? 'Từ vựng'}</span>
          <h1>Chưa có từ nào để kiểm tra</h1>
        </div>
        <LucianEmptyState
          title="Chưa có từ nào"
          note="Cần ít nhất bốn từ trong ngân hàng để tạo câu hỏi trắc nghiệm có đủ lựa chọn."
          actionLabel="Xem toàn bộ từ"
          onAction={() => {
            window.location.hash = ROUTES.vocabBrowse
          }}
        />
      </div>
    )
  }

  return (
    <div data-testid={TID.vocabQuiz} className="stack stack--loose">
      <div className="page-head">
        <span className="section-label">{topicLabel ?? 'Từ vựng'}</span>
        <h1>{topicLabel ? `Kiểm tra: ${topicLabel}` : 'Kiểm tra từ vựng'}</h1>
        <p className="page-head__lead">
          Chọn nghĩa đúng trong bốn lựa chọn. Phím <kbd>1</kbd>–<kbd>4</kbd> để chọn,
          <kbd>Enter</kbd> để sang câu tiếp.
        </p>
      </div>

      {finished ? (
        <LucianSessionDone
          known={score.right}
          unknown={score.wrong}
          total={total}
          streak={0}
          onRestart={restart}
          restartLabel="Lượt kiểm tra mới"
        />
      ) : (
        <section className="vocab-quiz" aria-label="Câu hỏi trắc nghiệm">
          <div className="vocab-quiz__bar">
            {/*
              Vòng đếm số câu ĐÃ TRẢ LỜI, không phải số câu đã bấm "Câu tiếp".
              Vừa chọn đáp án xong thì `index` vẫn là câu hiện tại, nên nếu chỉ
              truyền `index` thì vòng sẽ đứng ở 0/20 trong khi dòng điểm đã ghi
              "Sai 1" — hai chỗ nói hai chuyện khác nhau. Ảnh chụp thật bắt được
              đúng cảnh đó.
            */}
            <LucianProgressRing
              current={index + (picked !== null ? 1 : 0)}
              total={total}
              label={`Đã trả lời ${index + (picked !== null ? 1 : 0)} trên ${total} câu`}
            />
            <div className="vocab-quiz__meta">
              <span className="vocab-quiz__counter">
                Câu {Math.min(index + 1, total)} / {total}
              </span>
              <span className="vocab-quiz__score">{summaryLine}</span>
            </div>
          </div>

          {current ? (
            <>
              <div className="vocab-quiz__prompt" data-testid={TID.vocabQuizPrompt}>
                <span className="vocab-quiz__word">{current.word.word}</span>
                <span className="vocab-quiz__phonetic">{current.word.phonetic}</span>
                <span className="vocab-quiz__ask">Nghĩa tiếng Việt của từ này là gì?</span>
              </div>

              <div className="vocab-quiz__choices" role="group" aria-label="Các lựa chọn">
                {current.choices.map((choice, position) => {
                  const isPicked = picked === choice.wordId
                  const isRight = choice.correct
                  const revealed = picked !== null
                  const state = !revealed ? '' : isRight ? ' is-right' : isPicked ? ' is-wrong' : ''
                  return (
                    <button
                      key={choice.wordId}
                      type="button"
                      className={`vocab-quiz__choice${state}`}
                      data-testid={TID.vocabQuizChoice(position)}
                      onClick={() => pick(choice)}
                      disabled={revealed}
                      aria-pressed={isPicked}
                    >
                      <span className="vocab-quiz__key" aria-hidden="true">
                        {position + 1}
                      </span>
                      <span>{choice.text}</span>
                    </button>
                  )
                })}
              </div>

              {picked !== null ? (
                <div className="vocab-quiz__feedback" data-testid={TID.vocabQuizFeedback} role="status">
                  <p>
                    {current.choices.find((choice) => choice.wordId === picked)?.correct
                      ? `Chính xác — ${current.word.meaningVi}`
                      : `Chưa đúng — đáp án là ${current.word.meaningVi}`}
                  </p>
                  <p className="vocab-quiz__example">{current.word.exampleEn}</p>
                  <button
                    type="button"
                    className="btn btn--primary"
                    data-testid={TID.vocabQuizNext}
                    onClick={next}
                  >
                    Câu tiếp <kbd>Enter</kbd>
                  </button>
                </div>
              ) : null}
            </>
          ) : null}
        </section>
      )}
    </div>
  )
}

