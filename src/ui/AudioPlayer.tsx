import type { AudioHandle } from '../hooks/useStimulusAudio'

/**
 * THANH PHÁT ÂM THANH — theo bố cục của đề thi thật.
 *
 * Có: nút phát/dừng, thời gian hiện tại / tổng thời lượng, thanh tiến trình bấm
 * tua được, và nút phát lại từ đầu.
 *
 * Vì sao cần thanh tiến trình chứ không chỉ một nút "Nghe": khi làm bài, người
 * học cần biết mình đang ở đâu trong đoạn và còn bao lâu — đúng như đề thật, nơi
 * audio chạy một lần và không có nút tua. Ở chế độ luyện tập thì cho tua để nghe
 * lại chỗ khó.
 */
interface AudioPlayerProps {
  audio: AudioHandle
  /** Câu đang làm — dùng làm key để thanh tiến trình reset khi đổi câu. */
  stimulusId: string
  /** Cho phép chỉnh tốc độ phát âm thanh hay không (mặc định true, tắt ở thi thử). */
  allowSpeedControl?: boolean
}

/** Định dạng `m:ss` cho thời gian âm thanh. */
function formatAudioTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00'
  const total = Math.floor(seconds)
  const minutes = Math.floor(total / 60)
  const rest = total % 60
  return `${minutes}:${String(rest).padStart(2, '0')}`
}

export function AudioPlayer({ audio, stimulusId, allowSpeedControl = true }: AudioPlayerProps) {
  const { playing, loading, duration, currentTime, usingFallback, playbackRate, setPlaybackRate } = audio
  const percent = duration > 0 ? Math.min(100, (currentTime / duration) * 100) : 0

  const handleCycleSpeed = () => {
    const SPEEDS = [1.0, 1.2, 1.5, 0.8]
    const currentIdx = SPEEDS.indexOf(playbackRate)
    const nextIdx = currentIdx >= 0 ? (currentIdx + 1) % SPEEDS.length : 0
    setPlaybackRate(SPEEDS[nextIdx]!)
  }

  return (
    <div className="audio-player" key={stimulusId}>
      <button
        type="button"
        className="audio-player__btn"
        onClick={() => (playing ? audio.stop() : audio.play())}
        disabled={!audio.supported}
        aria-label={playing ? 'Dừng phát' : 'Phát âm thanh'}
        data-testid="audio-toggle"
        title={
          !audio.supported
            ? 'Âm thanh đang tắt trong Cài đặt'
            : usingFallback
              ? 'Chưa có file âm thanh — đang dùng giọng của trình duyệt'
              : undefined
        }
      >
        {loading ? (
          <span className="audio-player__spinner" aria-hidden="true" />
        ) : playing ? (
          <span aria-hidden="true">❚❚</span>
        ) : (
          <span aria-hidden="true">▶</span>
        )}
      </button>

      <span className="audio-player__time" data-testid="audio-current">
        {formatAudioTime(currentTime)}
      </span>

      <div className="audio-player__track">
        <div className="audio-player__bar" style={{ width: `${percent}%` }} />
        <input
          className="audio-player__range"
          type="range"
          min={0}
          max={Math.max(1, Math.floor(duration))}
          step={1}
          value={Math.min(Math.floor(currentTime), Math.max(1, Math.floor(duration)))}
          onChange={(event) => audio.seek(Number(event.target.value))}
          disabled={duration <= 0}
          aria-label="Tua âm thanh"
          data-testid="audio-seek"
        />
      </div>

      <span className="audio-player__time" data-testid="audio-duration">
        {duration > 0 ? formatAudioTime(duration) : '--:--'}
      </span>

      <button
        type="button"
        className="audio-player__replay"
        onClick={() => {
          audio.stop()
          audio.play()
        }}
        disabled={!audio.supported}
        aria-label="Phát lại từ đầu"
        data-testid="audio-replay"
        title="Phát lại từ đầu"
      >
        <span aria-hidden="true">↺</span>
      </button>

      {allowSpeedControl ? (
        <button
          type="button"
          className="audio-player__speed"
          onClick={handleCycleSpeed}
          disabled={!audio.supported}
          aria-label={`Tốc độ phát: ${playbackRate}x`}
          data-testid="audio-speed"
          title="Đổi tốc độ phát âm thanh (1.0x → 1.2x → 1.5x → 0.8x)"
        >
          {playbackRate}x
        </button>
      ) : null}
    </div>
  )
}
