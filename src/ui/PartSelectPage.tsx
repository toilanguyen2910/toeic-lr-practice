import { useMemo, useState } from 'react'
import { ROUTES, TID } from '../testids'
import { ALL_PARTS, PART_META, listParts } from './partHelpers'
import type { Part } from '../types'
import { navigate } from '../hooks/useHashRoute'
import { suggestedDurationSeconds } from '../hooks/sessionDuration'
import { useAppSettings } from './settingsContext'
import { useSession } from './sessionContext'
import { allocateByOfficialRatio, officialTotalOf } from '../lib'

const COUNT_MIN = 1
const COUNT_MAX = 200

/**
 * Hai cách chọn số câu:
 * - `perPart` — "mỗi part lấy N câu" (cách cũ, phù hợp khi muốn chia đều).
 * - `total`   — "tổng cộng N câu" (cách mới, app tự chia theo tỉ lệ đề thật).
 *
 * Vì sao cần cách thứ hai: người dùng chọn Part 1, 2, 5, 6 và muốn làm đúng 77
 * câu — đó là tổng số câu chính thức của bốn part đó (6+25+30+16). Với cách cũ
 * họ phải tự tính ra 6/25/30/16, và không có cách nào nhập "77" trực tiếp.
 */
type CountMode = 'perPart' | 'total'

function clampCount(raw: number, fallback: number, max = COUNT_MAX): number {
  if (!Number.isFinite(raw)) return fallback
  return Math.min(max, Math.max(COUNT_MIN, Math.trunc(raw)))
}

/** Màn hình chọn part cho chế độ luyện tập. */
export function PartSelectPage() {
  const { availableParts, start, bank } = useSession()
  const { settings, update } = useAppSettings()

  // Mặc định chọn cả 7 part (đúng như hợp đồng kiểm thử: A1.3 mong đợi 7 nút bật).
  const [selected, setSelected] = useState<Set<Part>>(() => new Set(ALL_PARTS))
  const [mode, setMode] = useState<CountMode>('total')
  const [perPartRaw, setPerPartRaw] = useState(() => String(settings.practiceCountPerPart))
  const [totalRaw, setTotalRaw] = useState('77')

  // Part không có câu nào trong ngân hàng thì không thể chọn.
  const selectableList = listParts().filter((part) => availableParts.includes(part))

  /** Số câu thật có trong ngân hàng, theo từng part. */
  const availableCount = useMemo(() => {
    const map = new Map<Part, number>()
    for (const question of bank.questions) {
      map.set(question.part, (map.get(question.part) ?? 0) + 1)
    }
    return map
  }, [bank])

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
  const perPartValue = clampCount(Number.parseInt(perPartRaw, 10), settings.practiceCountPerPart, 30)
  const totalValue = clampCount(Number.parseInt(totalRaw, 10), 77)

  /** Tổng khả dụng của các part đã chọn — không thể hứa nhiều hơn số này. */
  let capacity = 0
  for (const part of chosen) capacity += availableCount.get(part) ?? 0

  /** Tổng số câu chính thức của các part đã chọn (ví dụ 1+2+5+6 = 77). */
  const officialTotal = officialTotalOf(chosen)

  /**
   * Phân bổ câu cho từng part theo cách đang chọn.
   * `total` mode dùng `allocateByOfficialRatio` — chia theo đúng tỉ lệ đề thật.
   */
  /**
   * Phân bổ câu cho từng part theo cách đang chọn.
   *
   * KHÔNG bọc `useMemo`: `chosen` là mảng dựng mới mỗi lần render, nên memo sẽ
   * tính lại y như vậy mà còn thêm một lớp so sánh vô ích. Phép chia chỉ chạy
   * trên tối đa 7 part nên chi phí không đáng kể.
   */
  const allocation =
    chosen.length === 0
      ? []
      : mode === 'total'
        ? allocateByOfficialRatio(chosen, totalValue, availableCount)
        : chosen.map((part) => ({
            part,
            count: Math.min(perPartValue, availableCount.get(part) ?? 0),
          }))

  const plannedOf = (part: Part) => allocation.find((item) => item.part === part)?.count ?? 0
  const totalQuestions = allocation.reduce((sum, item) => sum + item.count, 0)
  const shortOfTarget = mode === 'total' && totalQuestions < totalValue
  const anyClamped = allocation.some((item) => item.count < (mode === 'total' ? totalValue : perPartValue))

  const toggle = (part: Part) => {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(part)) next.delete(part)
      else next.add(part)
      return next
    })
  }

  const handleStart = () => {
    if (chosen.length === 0 || totalQuestions === 0) return
    // Truyền phân bổ đã tính sẵn xuống engine — nhờ vậy số câu trên màn hình xác
    // nhận ĐÚNG BẰNG số câu trong phiên thật, không lệch do làm tròn ở hai nơi.
    const countByPart: Partial<Record<Part, number>> = {}
    for (const item of allocation) countByPart[item.part] = item.count

    start({
      mode: 'practice',
      parts: chosen,
      countByPart,
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
          Bật những part bạn muốn làm, rồi chọn tổng số câu. App tự chia câu cho từng part
          theo đúng tỉ lệ đề thi thật.
        </p>
      </div>

      <section className="part-grid" aria-label="Danh sách part">
        {selectableList.map((part) => {
          const meta = PART_META[part]
          const isOn = effective.has(part)
          const have = availableCount.get(part) ?? 0
          const willDo = plannedOf(part)
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
                {meta.section === 'listening' ? 'Nghe' : 'Đọc'} · đề thật {meta.officialCount} câu ·
                có {have} câu
              </span>
              {isOn ? (
                <span className="part-card__planned">
                  Sẽ làm <strong>{willDo}</strong> câu
                </span>
              ) : null}
            </button>
          )
        })}
      </section>

      <section className="card practice-setup">
        <div className="practice-setup__count">
          <fieldset className="count-mode">
            <legend className="field__label">Cách chọn số câu</legend>
            <label className="count-mode__option">
              <input
                type="radio"
                name="count-mode"
                value="total"
                checked={mode === 'total'}
                onChange={() => setMode('total')}
                data-testid={TID.countModeTotal}
              />
              <span>
                <strong>Tổng số câu</strong> — app tự chia theo tỉ lệ đề thật
              </span>
            </label>
            <label className="count-mode__option">
              <input
                type="radio"
                name="count-mode"
                value="perPart"
                checked={mode === 'perPart'}
                onChange={() => setMode('perPart')}
                data-testid={TID.countModePerPart}
              />
              <span>
                <strong>Mỗi part N câu</strong> — chia đều
              </span>
            </label>
          </fieldset>

          {mode === 'total' ? (
            <label className="field">
              <span className="field__label">Tổng số câu của cả bài</span>
              <input
                className="input"
                type="number"
                inputMode="numeric"
                min={COUNT_MIN}
                max={COUNT_MAX}
                step={1}
                value={totalRaw}
                data-testid={TID.practiceTotal}
                onChange={(event) => setTotalRaw(event.target.value)}
                onBlur={() => setTotalRaw(String(totalValue))}
              />
              <span className="field__hint">
                {officialTotal > 0 ? (
                  <>
                    Đề thật của {chosen.length} part đã chọn có <strong>{officialTotal} câu</strong>.{' '}
                    <button
                      type="button"
                      className="link-button"
                      onClick={() => setTotalRaw(String(officialTotal))}
                      data-testid={TID.useOfficialTotal}
                    >
                      Dùng đúng {officialTotal} câu
                    </button>
                  </>
                ) : (
                  'Hãy chọn ít nhất một part.'
                )}
              </span>
            </label>
          ) : (
            <label className="field">
              <span className="field__label">Số câu lấy từ MỖI part</span>
              <input
                className="input"
                type="number"
                inputMode="numeric"
                min={COUNT_MIN}
                max={30}
                step={1}
                value={perPartRaw}
                data-testid={TID.practiceCount}
                onChange={(event) => setPerPartRaw(event.target.value)}
                onBlur={() => setPerPartRaw(String(perPartValue))}
              />
              <span className="field__hint">Từ {COUNT_MIN} đến 30 câu cho mỗi part đã chọn.</span>
            </label>
          )}
        </div>

        <div className="practice-setup__summary">
          <p className="practice-setup__line" data-testid={TID.practiceSummary}>
            {allocation.length > 0 ? (
              <>
                {allocation
                  .filter((item) => item.count > 0)
                  .map((item) => `P${item.part}: ${item.count}`)
                  .join(' · ')}
                {' = '}
                <strong data-testid={TID.practiceTotalCount}>{totalQuestions}</strong> câu
              </>
            ) : (
              'Chưa chọn part nào'
            )}
          </p>
          {shortOfTarget ? (
            <p className="field__hint field__hint--warn">
              Ngân hàng chỉ có {capacity} câu cho các part đã chọn, nên bài sẽ có {totalQuestions}{' '}
              câu thay vì {totalValue}.
            </p>
          ) : null}
          {mode === 'perPart' && anyClamped ? (
            <p className="field__hint">
              Một số part không đủ {perPartValue} câu nên lấy tối đa số đang có.
            </p>
          ) : null}
          <p className="field__hint">
            Thời gian gợi ý: {Math.round(suggestedDurationSeconds(chosen) / 60)} phút. Luyện tập
            không giới hạn thời gian — đồng hồ chỉ đếm để bạn biết mình làm nhanh hay chậm.
          </p>

          <div
            className="switch-row"
            style={{
              marginTop: '12px',
              paddingTop: '12px',
              borderTop: '1px solid var(--line)',
            }}
          >
            <div className="switch-row__text">
              <strong>Hiện giải thích ngay khi chọn đáp án</strong>
              <span>
                Mặc định tắt: làm xong nộp bài mới xem đáp án. Bật nếu muốn xem giải thích ngay khi chọn.
              </span>
            </div>
            <button
              type="button"
              className="switch"
              role="switch"
              aria-checked={settings.revealMode}
              data-checked={settings.revealMode ? 'true' : 'false'}
              onClick={() => update({ revealMode: !settings.revealMode })}
            >
              <span className="switch__knob" aria-hidden="true" />
            </button>
          </div>
        </div>

        <div className="btn-row">
          <button
            type="button"
            className="btn btn--primary btn--lg"
            data-testid={TID.startPractice}
            onClick={handleStart}
            disabled={chosen.length === 0 || totalQuestions === 0}
          >
            Bắt đầu luyện tập ({totalQuestions} câu)
          </button>
          {chosen.length === 0 ? (
            <p className="field__hint">Hãy chọn ít nhất một part để bắt đầu.</p>
          ) : null}
        </div>
      </section>
    </div>
  )
}
