/**
 * MÀN ÔN FLASHCARD — `#/vocab/study` (kèm `?topic=…`).
 *
 * Luồng: chọn từ đến hạn → lật thẻ → đánh dấu đã thuộc / chưa thuộc → sang thẻ sau
 * → hết phiên thì hiện màn hoàn thành.
 *
 * Ba quyết định đáng ghi lại:
 *
 * 1. Danh sách thẻ của phiên được chốt MỘT LẦN lúc mount, và chỉ thay khi bấm
 *    "Lượt ôn mới".
 *    Nếu tính lại mỗi lần `progress` đổi, thì vừa đánh dấu "đã thuộc" xong, từ đó
 *    rời khỏi danh sách "đến hạn" và mảng co lại — người học bị nhảy cóc mất từ.
 *    Chốt lại thì phiên có đúng số thẻ đã hứa.
 *
 * 2. Bàn phím: Space lật, 1 = chưa thuộc, 2 = đã thuộc.
 *    Space chỉ bị `preventDefault` khi con trỏ đang ở thẻ (hoặc không ở đâu cả).
 *    Nếu đang đứng ở nút khác thì Space phải kích hoạt nút đó — người dùng bàn
 *    phím cần điều đó, cướp đi là hỏng khả năng truy cập.
 *
 * 3. `answer` ghi qua engine rồi mới sang thẻ sau; không tự sửa state tiến độ.
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { VocabBank, VocabWord } from '../../types-vocab'
import { VOCAB_TOPIC_META } from '../../types-vocab'
import { loadVocabSettings } from '../../lib/vocab'
import { pickDueWords, summarizeProgress } from '../../lib/vocab'
import { ROUTES, TID, vocabQuery } from '../../testids'
import { VOCAB_BANK } from './vocabBank'
import { useVocabProgress } from './useVocabProgress'
import { computeStreak } from './streak'
import { LucianFlipCard } from './lucian/LucianFlipCard'
import { LucianProgressRing } from './lucian/LucianProgressRing'
import { LucianEmptyState } from './lucian/LucianEmptyState'
import { LucianSessionDone } from './lucian/LucianSessionDone'

/** Ngân hàng thu gọn theo chủ đề, để `pickDueWords` chỉ chọn trong phạm vi đó. */
function scopeBank(bank: VocabBank, topic: string | null): VocabBank {
  if (!topic) return bank
  return { version: bank.version, words: bank.words.filter((word) => word.topic === topic) }
}

/** Lấy chủ đề từ hash hiện tại; `null` nếu không có hoặc không hợp lệ. */
function readTopic(): string | null {
  const raw = vocabQuery(window.location.hash).get('topic')
  if (!raw) return null
  return raw in VOCAB_TOPIC_META ? raw : null
}

export function VocabStudyPage() {
  /*
   * Đọc chủ đề từ hash mỗi khi hash đổi, không chỉ lúc mount.
   *
   * `useState(readTopic)` chỉ chạy một lần: nếu người dùng gõ hash tay hoặc bấm
   * Back từ `#/vocab/study?topic=office` về `#/vocab/study`, state vẫn giữ
   * `office` cũ nên màn hình hiện sai phạm vi. Đây là lỗi thật đã gặp khi kiểm.
   */
  const [topic, setTopic] = useState<string | null>(readTopic)
  useEffect(() => {
    const sync = () => setTopic(readTopic())
    window.addEventListener('hashchange', sync)
    return () => window.removeEventListener('hashchange', sync)
  }, [])
  const { progress, answer, now } = useVocabProgress()

  /*
   * Số từ mỗi lượt ôn — đọc từ CÀI ĐẶT của người dùng, không dùng hằng số.
   *
   * Bản trước hard-code `DEFAULT_VOCAB_SETTINGS.sessionSize`, nên đặt 5 từ trong
   * cài đặt (hoặc trong localStorage) vẫn ra phiên 20 thẻ. `loadVocabSettings`
   * và `saveVocabSettings` khi đó là mã chết — có hàm mà không ai gọi.
   *
   * Dùng `useState` initializer để chỉ đọc một lần lúc mở phiên: đổi cài đặt giữa
   * phiên không được làm phiên đang làm dở đổi số thẻ.
   */
  const [sessionSize] = useState(() => loadVocabSettings().sessionSize)

  const [words, setWords] = useState<VocabWord[]>(() =>
    pickDueWords(scopeBank(VOCAB_BANK, topic), progress, now, sessionSize),
  )
  const [index, setIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [stats, setStats] = useState({ known: 0, unknown: 0 })

  /**
   * Chặn ghi hai lần cho cùng một từ trong cùng một nhịp (bấm đúp, hoặc giữ phím).
   * Không có cờ này thì một cú bấm đúp sẽ ghi hai câu trả lời và đẩy người học
   * vượt mất một thẻ.
   */
  const lockRef = useRef(false)
  const releaseTimer = useRef<number | undefined>(undefined)

  useEffect(
    () => () => {
      if (releaseTimer.current !== undefined) window.clearTimeout(releaseTimer.current)
    },
    [],
  )

  const current = words[index]
  const total = words.length
  const finished = total > 0 && index >= total

  const flip = useCallback(() => setFlipped((previous) => !previous), [])

  const record = useCallback(
    (known: boolean) => {
      if (!current || lockRef.current || finished) return
      lockRef.current = true
      answer(current.id, known)
      setStats((previous) => ({
        known: previous.known + (known ? 1 : 0),
        unknown: previous.unknown + (known ? 0 : 1),
      }))
      setFlipped(false)
      setIndex((previous) => previous + 1)
      // Nhả khoá ở nhịp sau: đủ để nuốt cú bấm đúp, không đủ để nuốt thao tác thật.
      releaseTimer.current = window.setTimeout(() => {
        lockRef.current = false
      }, 220)
    },
    [answer, current, finished],
  )

  const restart = useCallback(() => {
    setWords(
      pickDueWords(scopeBank(VOCAB_BANK, topic), progress, now, sessionSize),
    )
    setIndex(0)
    setFlipped(false)
    setStats({ known: 0, unknown: 0 })
    lockRef.current = false
  }, [now, progress, topic, sessionSize])

  // Bàn phím. Không cướp Space của nút khác, không cướp phím của ô nhập.
  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      const tag = (event.target as HTMLElement | null)?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return
      if (event.metaKey || event.ctrlKey || event.altKey) return
      if (finished) return

      if (event.key === ' ' || event.code === 'Space') {
        const active = document.activeElement
        const onCard = active?.getAttribute('data-testid') === 'vocab-card-face'
        const nothingFocused = !active || active === document.body
        if (!onCard && !nothingFocused) return
        event.preventDefault()
        flip()
        return
      }

      if (event.key === '1') {
        event.preventDefault()
        record(false)
      } else if (event.key === '2') {
        event.preventDefault()
        record(true)
      }
    }

    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [flip, finished, record])

  const streak = useMemo(() => computeStreak(progress, now), [progress, now])
  const summary = useMemo(() => summarizeProgress(VOCAB_BANK, progress, now), [progress, now])
  /**
   * Tổng hợp tiến độ trong PHẠM VI đang ôn (một chủ đề, hoặc toàn ngân hàng).
   *
   * Cần riêng biến này vì `summary` luôn tính trên toàn ngân hàng — dùng nó để
   * hiện "còn bao nhiêu từ cần ôn" trong một chủ đề là sai số.
   */
  const summaryScoped = useMemo(
    () => summarizeProgress(scopeBank(VOCAB_BANK, topic), progress, now),
    [progress, now, topic],
  )
  const topicLabel = topic ? (VOCAB_TOPIC_META[topic as keyof typeof VOCAB_TOPIC_META]?.label ?? null) : null

  /**
   * Số từ CÒN ĐẾN HẠN trong phạm vi đang ôn.
   *
   * Vì sao không dựa vào `words.length === 0` để hiện trạng thái rỗng: engine
   * `pickDueWords` được thiết kế để LUÔN trả đủ chỗ — sau khi hết từ đến hạn và
   * từ mới, nó bù bằng từ chưa đến hạn ("later"). Đó là hành vi đúng cho một lượt
   * ôn, nhưng nghĩa là phiên không bao giờ rỗng, và trạng thái rỗng (#440) sẽ
   * không bao giờ hiện. Bộ kiểm Chrome thật đã bắt được đúng lỗi này: đánh dấu
   * cả 50 từ chủ đề "daily" là đã thuộc mà màn hình vẫn mở phiên ôn.
   *
   * Nên trạng thái rỗng xét theo "còn từ nào đến hạn không", không xét theo độ
   * dài mảng đã chọn.
   */
  const dueInScope = useMemo(() => {
    const scoped = scopeBank(VOCAB_BANK, topic)
    return summarizeProgress(scoped, progress, now).dueToday
  }, [progress, now, topic])

  /*
   * Trạng thái rỗng: KHÔNG còn từ nào đến hạn trong phạm vi đang chọn.
   *
   * Hai điều kiện phải cùng đúng:
   *   1. `dueInScope === 0` — không còn từ đến hạn trong chủ đề này.
   *   2. `!openedSession` — người dùng CHƯA mở phiên nào.
   *
   * Vì sao cần điều kiện 2: `dueInScope` được tính lại sau MỖI câu trả lời. Khi
   * phiên được bù bằng từ chưa đến hạn (engine cố ý bù cho đủ chỗ), vừa trả lời
   * hết phần "đến hạn" thì `dueInScope` về 0 giữa phiên — khối này thắng và thay
   * màn hình, làm MẤT nửa phiên còn lại và mất luôn màn tổng kết.
   *
   * Đã đo được: chủ đề office còn 10 từ đến hạn + 40 hẹn xa → phiên 20 thẻ, dừng
   * ở thẻ 10/20, 10 thẻ sau biến mất. Đưa `finished` lên trước cũng chưa đủ vì
   * lúc mới mở phiên `finished` còn false.
   */
  const openedSession = index > 0 || stats.known > 0 || stats.unknown > 0
  if (dueInScope === 0 && !openedSession) {
    return (
      <div data-testid={TID.vocabStudy} className="stack stack--loose">
        <div className="page-head">
          <span className="section-label">{topicLabel ?? 'Từ vựng'}</span>
          <h1>Chưa có từ nào cần ôn</h1>
          <p className="page-head__lead">
            {topicLabel
              ? `Chủ đề “${topicLabel}” không còn từ nào đến hạn hôm nay.`
              : 'Tất cả từ đều đã được hẹn ôn vào ngày khác.'}
          </p>
        </div>
        <LucianEmptyState
          testId={TID.vocabStudyEmpty}
          title="Không còn từ nào đến hạn"
          note="Bạn đã ôn hết phần đến hạn hôm nay. Xem danh sách để chọn từ cụ thể, hoặc quay lại vào ngày mai."
          actionLabel="Xem toàn bộ từ"
          onAction={() => {
            window.location.hash = ROUTES.vocabBrowse
          }}
        />
      </div>
    )
  }

  return (
    <div data-testid={TID.vocabStudy} className="stack stack--loose">
      <div className="page-head">
        <span className="section-label">{topicLabel ?? 'Từ vựng'}</span>
        <h1>{topicLabel ? `Ôn chủ đề: ${topicLabel}` : 'Ôn từ đến hạn'}</h1>
        <p className="page-head__lead">
          Nhấn <kbd>Space</kbd> để lật thẻ, <kbd>1</kbd> nếu chưa thuộc, <kbd>2</kbd> nếu đã
          thuộc. Từ đã thuộc được hẹn ôn lại sau 60 ngày.
        </p>
      </div>

      {finished ? (
        <LucianSessionDone
          known={stats.known}
          unknown={stats.unknown}
          total={total}
          streak={streak.streak}
          onRestart={restart}
          restartLabel="Lượt ôn mới"
        />
      ) : (
        <section className="vocab-study" aria-label="Thẻ ôn tập">
          <div className="vocab-study__bar">
            <LucianProgressRing
              current={index}
              total={total}
              label={`Đã trả lời ${index} trên ${total} thẻ`}
            />
            <div className="vocab-study__meta">
              <span className="vocab-study__counter" data-testid={TID.vocabStudyCounter}>
                Thẻ {Math.min(index + 1, total)} / {total}
              </span>
              <span className="vocab-study__tally">
                Đã thuộc <strong>{stats.known}</strong> · Chưa thuộc <strong>{stats.unknown}</strong>
              </span>
              <span className="vocab-study__due">
                {/*
                  Phải là số từ đến hạn TRONG PHẠM VI ĐANG ÔN, không phải toàn
                  ngân hàng. Bản trước dùng `summary.dueToday` tính trên
                  VOCAB_BANK nên khi đang ôn chủ đề Văn phòng (50 từ) vẫn hiện
                  "Còn 600 từ cần ôn" — người học tưởng phiên này có 600 thẻ.
                */}
                {topicLabel
                  ? `Còn ${summaryScoped.dueToday} từ cần ôn trong chủ đề này`
                  : `Còn ${summary.dueToday} từ cần ôn trong toàn bộ ngân hàng`}
              </span>
              <div
                className="vocab-study__bar-track"
                data-testid={TID.vocabStudyProgress}
                role="img"
                aria-label={`Tiến độ phiên: ${index} trên ${total}`}
              >
                <span
                  className="vocab-study__bar-fill"
                  style={{ width: `${(index / total) * 100}%` }}
                />
              </div>
            </div>
          </div>

          {current ? (
            <LucianFlipCard word={current} flipped={flipped} onFlip={flip} />
          ) : null}

          <div className="vocab-study__actions">
            <button type="button" className="btn" data-testid={TID.vocabFlipButton} onClick={flip}>
              {flipped ? 'Xem lại từ' : 'Xem nghĩa'}
            </button>
            <button
              type="button"
              className="btn btn--danger"
              data-testid={TID.vocabDontKnow}
              onClick={() => record(false)}
            >
              Chưa thuộc <kbd>1</kbd>
            </button>
            <button
              type="button"
              className="btn btn--primary"
              data-testid={TID.vocabKnow}
              onClick={() => record(true)}
            >
              Đã thuộc <kbd>2</kbd>
            </button>
          </div>
        </section>
      )}
    </div>
  )
}




