/**
 * MÀN DANH SÁCH TỪ — `#/vocab/browse`.
 *
 * Bảng toàn bộ từ kèm ba bộ lọc (chủ đề / mức độ / trạng thái) và ô tìm kiếm.
 *
 * Vì sao lọc bằng `filterWords` của engine chứ không `Array.filter` tại đây: ô tìm
 * kiếm phải khớp cả nghĩa tiếng Việt và định nghĩa tiếng Anh, và trạng thái phải
 * hiểu hộp Leitner. Viết lại logic đó trong component là tạo nguồn sự thật thứ hai.
 *
 * Phần "không tìm thấy" dùng Lucian #092: nó tự đếm xem bỏ bộ lọc nào thì ra bao
 * nhiêu từ, thay vì để người học tự đoán.
 */
import { useMemo, useState } from 'react'
import { TID, vocabQuery } from '../../testids'
import { VOCAB_TOPIC_META, VOCAB_TOPICS } from '../../types-vocab'
import type { LeitnerBox, VocabTopic } from '../../types-vocab'
import { filterWords } from '../../lib/vocab'
import { VOCAB_BANK } from './vocabBank'
import { useVocabProgress } from './useVocabProgress'
import { LucianNoResults } from './lucian/LucianNoResults'

type StatusFilter = 'all' | 'new' | 'learning' | 'mastered'

const MASTERED_BOX: LeitnerBox = 5

const STATUS_LABEL: Record<StatusFilter, string> = {
  all: 'Tất cả',
  new: 'Chưa học',
  learning: 'Đang học',
  mastered: 'Đã thuộc',
}

const DIFFICULTY_LABEL: Record<1 | 2 | 3, string> = {
  1: 'Cơ bản',
  2: 'Trung bình',
  3: 'Khó',
}

/** Chủ đề hợp lệ từ hash, hoặc `null`. */
function readTopic(): VocabTopic | null {
  const raw = vocabQuery(window.location.hash).get('topic')
  if (!raw) return null
  return raw in VOCAB_TOPIC_META ? (raw as VocabTopic) : null
}

export function VocabBrowsePage() {
  const { progress } = useVocabProgress()

  const [topic, setTopic] = useState<VocabTopic | null>(readTopic)
  const [difficulty, setDifficulty] = useState<1 | 2 | 3 | null>(null)
  const [status, setStatus] = useState<StatusFilter>('all')
  const [query, setQuery] = useState('')

  const rows = useMemo(
    () => filterWords(VOCAB_BANK, progress, { topic, difficulty, status, query }),
    [progress, topic, difficulty, status, query],
  )

  /**
   * Gợi ý cho màn "không tìm thấy": với mỗi bộ lọc đang bật, đếm số từ nếu bỏ nó.
   * Đây là phép đếm thật qua `filterWords`, không phải ước lượng.
   */
  const suggestions = useMemo(() => {
    const list: Array<{ label: string; count: number; onRemove: () => void }> = []

    if (topic) {
      const count = filterWords(VOCAB_BANK, progress, {
        topic: null,
        difficulty,
        status,
        query,
      }).length
      list.push({
        label: VOCAB_TOPIC_META[topic].label,
        count,
        onRemove: () => setTopic(null),
      })
    }

    if (difficulty) {
      const count = filterWords(VOCAB_BANK, progress, {
        topic,
        difficulty: null,
        status,
        query,
      }).length
      list.push({
        label: DIFFICULTY_LABEL[difficulty],
        count,
        onRemove: () => setDifficulty(null),
      })
    }

    if (status !== 'all') {
      const count = filterWords(VOCAB_BANK, progress, {
        topic,
        difficulty,
        status: 'all',
        query,
      }).length
      list.push({
        label: STATUS_LABEL[status],
        count,
        onRemove: () => setStatus('all'),
      })
    }

    if (query.trim()) {
      const count = filterWords(VOCAB_BANK, progress, {
        topic,
        difficulty,
        status,
        query: '',
      }).length
      list.push({
        label: `Từ khoá “${query.trim()}”`,
        count,
        onRemove: () => setQuery(''),
      })
    }

    return list.sort((a, b) => b.count - a.count)
  }, [progress, topic, difficulty, status, query])

  const resetFilters = () => {
    setTopic(null)
    setDifficulty(null)
    setStatus('all')
    setQuery('')
  }

  return (
    <div data-testid={TID.vocabBrowse} className="stack stack--loose">
      <div className="page-head">
        <span className="section-label">Từ vựng</span>
        <h1>Toàn bộ từ vựng</h1>
        <p className="page-head__lead">
          Lọc theo chủ đề, mức độ hoặc trạng thái học. Ô tìm kiếm khớp cả từ tiếng Anh, nghĩa
          tiếng Việt và định nghĩa tiếng Anh.
        </p>
      </div>

      <section className="vocab-filters card card--flat" aria-label="Bộ lọc từ vựng">
        <label className="field vocab-filters__search">
          <span className="field__label">Tìm kiếm</span>
          <input
            className="input"
            type="search"
            value={query}
            placeholder="invoice, hoá đơn, document…"
            data-testid={TID.vocabSearch}
            onChange={(event) => setQuery(event.target.value)}
          />
        </label>

        <label className="field">
          <span className="field__label">Chủ đề</span>
          <select
            className="input"
            data-testid={TID.vocabFilterTopic}
            value={topic ?? ''}
            onChange={(event) => setTopic((event.target.value || null) as VocabTopic | null)}
          >
            <option value="">Tất cả chủ đề</option>
            {VOCAB_TOPICS.map((item) => (
              <option key={item} value={item}>
                {VOCAB_TOPIC_META[item].label}
              </option>
            ))}
          </select>
        </label>

        <label className="field">
          <span className="field__label">Mức độ</span>
          <select
            className="input"
            data-testid={TID.vocabFilterDifficulty}
            value={difficulty ?? ''}
            onChange={(event) =>
              setDifficulty((event.target.value ? Number(event.target.value) : null) as 1 | 2 | 3 | null)
            }
          >
            <option value="">Mọi mức độ</option>
            <option value="1">{DIFFICULTY_LABEL[1]}</option>
            <option value="2">{DIFFICULTY_LABEL[2]}</option>
            <option value="3">{DIFFICULTY_LABEL[3]}</option>
          </select>
        </label>

        <label className="field">
          <span className="field__label">Trạng thái</span>
          <select
            className="input"
            data-testid={TID.vocabFilterStatus}
            value={status}
            onChange={(event) => setStatus(event.target.value as StatusFilter)}
          >
            {(['all', 'new', 'learning', 'mastered'] as const).map((item) => (
              <option key={item} value={item}>
                {STATUS_LABEL[item]}
              </option>
            ))}
          </select>
        </label>
      </section>

      <p className="vocab-count" data-testid={TID.vocabCount} role="status">
        {rows.length} từ
        {rows.length !== VOCAB_BANK.words.length ? ` / ${VOCAB_BANK.words.length}` : ''}
        {query.trim() ? ` khớp “${query.trim()}”` : ''}
      </p>

      {rows.length === 0 ? (
        <LucianNoResults query={query} suggestions={suggestions} onReset={resetFilters} />
      ) : (
        <div className="vocab-table" role="table" aria-label="Danh sách từ vựng">
          <div className="vocab-table__head" role="row">
            <span role="columnheader">Từ</span>
            <span role="columnheader">Nghĩa</span>
            <span role="columnheader">Chủ đề</span>
            <span role="columnheader">Mức độ</span>
            <span role="columnheader">Trạng thái</span>
          </div>

          {rows.map((word) => {
            const entry = progress[word.id]
            const isMastered = entry !== undefined && entry.box >= MASTERED_BOX
            const statusLabel = !entry ? 'Chưa học' : isMastered ? 'Đã thuộc' : 'Đang học'
            return (
              <div className="vocab-row" data-testid={TID.vocabRow} role="row" key={word.id}>
                <span className="vocab-row__word" role="cell">
                  <strong>{word.word}</strong>
                  <span className="vocab-row__phonetic">{word.phonetic}</span>
                </span>
                <span className="vocab-row__meaning" role="cell">
                  {word.meaningVi}
                </span>
                <span role="cell">
                  <span className="badge">{VOCAB_TOPIC_META[word.topic].label}</span>
                </span>
                <span role="cell">{DIFFICULTY_LABEL[word.difficulty]}</span>
                <span role="cell">
                  <span
                    className={`badge ${isMastered ? 'badge--ok' : entry ? 'badge--info' : ''}`}
                  >
                    {statusLabel}
                  </span>
                </span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
