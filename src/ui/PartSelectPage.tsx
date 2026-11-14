import { useState } from 'react'
import { ROUTES, TID } from '../testids'
import { ALL_PARTS, PART_META, listParts } from './partHelpers'
import type { Part } from '../types'
import { navigate } from '../hooks/useHashRoute'
import { suggestedDurationSeconds } from '../hooks/sessionDuration'
import { useAppSettings } from './settingsContext'
import { useSession } from './sessionContext'

const COUNT_MIN = 1
const COUNT_MAX = 30

function clampCount(raw: number, fallback: number): number {
  if (!Number.isFinite(raw)) return fallback
  return Math.min(COUNT_MAX, Math.max(COUNT_MIN, Math.trunc(raw)))
}

/** Màn hình chọn part cho chế độ luyện tập. */
export function PartSelectPage() {
  const { availableParts, start } = useSession()
  const { settings } = useAppSettings()

  // Mặc định chọn cả 7 part (đúng như hợp đồng kiểm thử: A1.3 mong đợi 7 nút bật).
  const [selected, setSelected] = useState<Set<Part>>(() => new Set(ALL_PARTS))
  const [count, setCount] = useState(() => String(settings.practiceCountPerPart))

  // Part không có câu nào trong ngân hàng thì không thể chọn.
  const selectableList = listParts().filter((part) => availableParts.includes(part))

  /**
   * Lựa chọn thực tế = lựa chọn thô ∩ part có câu hỏi thật.
   *
   * Suy ra ngay trong lúc render thay vì đồng bộ bằng `useEffect`: khi ngân hàng
   * thiếu part nào thì part đó tự rơi khỏi danh sách chọn, mà không cần thêm một
   * vòng render và không có khoảnh khắc state lệch với dữ liệu.
   */
  const effective = new Set<Part>()
  for (const part of selected) if (availableParts.includes(part)) effective.add(part)

  const chosen = selectableList.filter((part) => effective.has(part))
  const countValue = clampCount(Number.parseInt(count, 10), settings.practiceCountPerPart)
  const totalQuestions = chosen.length * countValue

  const toggle = (part: Part) => {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(part)) next.delete(part)
      else next.add(part)
      return next
    })
  }

  const handleStart = () => {
    if (chosen.length === 0) return
    start({
      mode: 'practice',
      parts: chosen,
      countPerPart: countValue,
      // Tôn trọng cài đặt người dùng: tắt "hiện giải thích ngay" thì luyện tập
      // cư xử như thi thử (không lộ đáp án trong lúc làm).
      revealMode: settings.revealMode,
    })
    navigate(ROUTES.practice)
  }

  return (
    <div data-testid={TID.partSelect} className="stack stack--loose">
      <div className="page-head">
        <span className="section-label">Luyện tập</span>
        <h1>Chọn part bạn muốn luyện</h1>
        <p className="page-head__lead">
          Bật những part bạn muốn làm. Ở chế độ luyện tập, giải thích và bản dịch hiện ra ngay sau khi
          bạn chọn đáp án, nên bài ngắn mà hiệu quả hơn.
        </p>
      </div>

      <section className="part-grid" aria-label="Danh sách part">
        {selectableList.map((part) => {
          const meta = PART_META[part]
          const isOn = effective.has(part)
          return (
            <button
              key={part}
              type="button"
              className="part-card"
              data-testid={TID.partToggle(part)}
              data-checked={isOn ? 'true' : 'false'}
              aria-pressed={isOn}
              onClick={() => toggle(part)}
            >
              <span className="part-card__top">
                <span className="part-card__name">{meta.label}</span>
                <span className={`part-card__check ${isOn ? 'is-on' : ''}`} aria-hidden="true">
                  {isOn ? '✓' : ''}
                </span>
              </span>
              <span className="part-card__note">{meta.note}</span>
              <span className="part-card__meta">
                {meta.section === 'listening' ? 'Nghe' : 'Đọc'} · {meta.officialCount} câu trong đề thật
              </span>
            </button>
          )
        })}
      </section>

      <section className="card practice-setup">
        <div className="practice-setup__count">
          <label className="field">
            <span className="field__label">Số câu mỗi part</span>
            <input
              className="input"
              type="number"
              inputMode="numeric"
              min={COUNT_MIN}
              max={COUNT_MAX}
              step={1}
              value={count}
              data-testid={TID.practiceCount}
              onChange={(event) => setCount(event.target.value)}
              onBlur={() => setCount(String(countValue))}
            />
            <span className="field__hint">
              Từ {COUNT_MIN} đến {COUNT_MAX} câu cho mỗi part đã chọn.
            </span>
          </label>
        </div>

        <div className="practice-setup__summary">
          <p className="practice-setup__line">
            <strong>{chosen.length}</strong> part · <strong>{totalQuestions}</strong> câu
          </p>
          <p className="field__hint">
            Thời gian gợi ý: {Math.round(suggestedDurationSeconds(chosen) / 60)} phút. Luyện tập không
            giới hạn thời gian — đồng hồ chỉ đếm để bạn biết mình làm nhanh hay chậm.
          </p>
        </div>

        <div className="btn-row">
          <button
            type="button"
            className="btn btn--primary btn--lg"
            data-testid={TID.startPractice}
            onClick={handleStart}
            disabled={chosen.length === 0}
          >
            Bắt đầu luyện tập
          </button>
          {chosen.length === 0 ? (
            <p className="field__hint">Hãy chọn ít nhất một part để bắt đầu.</p>
          ) : null}
        </div>
      </section>
    </div>
  )
}
