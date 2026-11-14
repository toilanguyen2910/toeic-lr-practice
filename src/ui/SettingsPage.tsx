import { useState } from 'react'
import { clearHistory, loadSettings } from '../lib'
import { ROUTES, TID } from '../testids'
import { useAppSettings } from './settingsContext'

const COUNT_MIN = 1
const COUNT_MAX = 30

/** Màn hình cài đặt. */
export function SettingsPage() {
  const { settings, update } = useAppSettings()
  const [countText, setCountText] = useState(String(settings.practiceCountPerPart))
  const [cleared, setCleared] = useState(false)

  const commitCount = () => {
    const parsed = Number.parseInt(countText, 10)
    const next = Number.isFinite(parsed)
      ? Math.min(COUNT_MAX, Math.max(COUNT_MIN, parsed))
      : loadSettings().practiceCountPerPart
    setCountText(String(next))
    update({ practiceCountPerPart: next })
  }

  const handleClearHistory = () => {
    clearHistory()
    setCleared(true)
  }

  return (
    <div data-testid={TID.settings} className="stack">
      <div className="page-head">
        <span className="section-label">Cài đặt</span>
        <h1>Tuỳ chỉnh cách luyện tập</h1>
        <p className="page-head__lead">
          Thay đổi ở đây được lưu ngay trên máy bạn. Ứng dụng không gửi dữ liệu đi đâu cả.
        </p>
      </div>

      <section className="card">
        <h2>Chế độ luyện tập</h2>

        <div className="switch-row">
          <div className="switch-row__text">
            <strong id="reveal-label">Hiện giải thích ngay khi chọn đáp án</strong>
            <span>
              Bật: mỗi lần chọn đáp án bạn thấy ngay đúng/sai kèm giải thích và bản dịch. Tắt: làm
              như thi thật rồi xem lại sau.
            </span>
          </div>
          <button
            type="button"
            className="switch"
            role="switch"
            aria-checked={settings.revealMode}
            aria-labelledby="reveal-label"
            data-testid={TID.settingReveal}
            data-checked={settings.revealMode ? 'true' : 'false'}
            onClick={() => update({ revealMode: !settings.revealMode })}
          >
            <span className="switch__knob" aria-hidden="true" />
          </button>
        </div>

        <div className="switch-row">
          <div className="switch-row__text">
            <strong id="audio-label">Đọc lời thoại bằng giọng của trình duyệt</strong>
            <span>
              Bật: hiện nút nghe để đọc phần lời thoại tiếng Anh. Tắt: ẩn nút nghe hoàn toàn.
            </span>
          </div>
          <button
            type="button"
            className="switch"
            role="switch"
            aria-checked={settings.audioEnabled}
            aria-labelledby="audio-label"
            data-testid={TID.settingAudio}
            data-checked={settings.audioEnabled ? 'true' : 'false'}
            onClick={() => update({ audioEnabled: !settings.audioEnabled })}
          >
            <span className="switch__knob" aria-hidden="true" />
          </button>
        </div>

        <div className="switch-row">
          <div className="switch-row__text">
            <strong id="count-label">Số câu mặc định cho mỗi part</strong>
            <span>
              Điền sẵn giá trị này ở màn hình chọn part. Từ {COUNT_MIN} đến {COUNT_MAX} câu.
            </span>
          </div>
          <input
            id="practice-count-setting"
            className="input input--compact"
            type="number"
            inputMode="numeric"
            min={COUNT_MIN}
            max={COUNT_MAX}
            step={1}
            value={countText}
            aria-labelledby="count-label"
            data-testid={TID.settingCount}
            onChange={(event) => setCountText(event.target.value)}
            onBlur={commitCount}
          />
        </div>
      </section>

      <section className="card">
        <h2>Dữ liệu trên máy</h2>
        <p className="card__hint">
          Lịch sử luyện tập và phiên đang làm dở được lưu trong trình duyệt này. Xoá lịch sử sẽ không
          xoá phiên đang làm dở.
        </p>

        <div className="btn-row settings__actions">
          <button
            type="button"
            className="btn btn--danger"
            data-testid={TID.clearHistory}
            onClick={handleClearHistory}
          >
            Xoá lịch sử luyện tập
          </button>
          {cleared ? (
            <span className="badge badge--ok" role="status">
              ✓ Đã xoá lịch sử
            </span>
          ) : null}
        </div>
      </section>

      <div className="btn-row">
        <a className="btn btn--primary" href={ROUTES.partSelect}>
          Bắt đầu luyện tập
        </a>
        <a className="btn" href={ROUTES.home}>
          Về trang chủ
        </a>
      </div>
    </div>
  )
}
