import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * PHÁT ÂM THANH CHO PART 1–4.
 *
 * Ba lỗi đã sửa sau khi người dùng thử (xem comment tại từng chỗ):
 * 1. Bấm "Dừng" nhưng âm thanh vẫn phát lại — vì callback `oncanplaythrough` của
 *    lần phát trước vẫn còn sống và tự gọi `play()` sau khi đã dừng.
 * 2. Nút không trở về "Nghe" sau khi dừng — vì `stop()` chỉ set state, không huỷ
 *    các callback đang chờ.
 * 3. Không có thanh tiến trình — đề thật cho tua và biết còn bao lâu.
 *
 * Cách sửa gốc: giữ một "thế hệ" (generation) tăng mỗi lần play/stop. Mọi callback
 * bất đồng bộ kiểm tra thế hệ của mình còn khớp không; nếu không thì bỏ qua. Nhờ
 * vậy không cần dọn từng listener và không có callback mồ côi.
 */

export interface AudioHandle {
  supported: boolean
  playing: boolean
  loading: boolean
  usingFallback: boolean
  /** Vị trí phát hiện tại (giây). */
  currentTime: number
  /** Tổng thời lượng (giây), 0 khi chưa biết. */
  duration: number
  /** Tốc độ phát hiện tại (mặc định 1.0). */
  playbackRate: number
  /** Thay đổi tốc độ phát. */
  setPlaybackRate: (rate: number) => void
  play: () => void
  stop: () => void
  /** Tua tới vị trí (giây). */
  seek: (seconds: number) => void
}

/** Đường dẫn file MP3, ghép `BASE_URL` để đúng khi deploy dưới thư mục con. */
export function audioSrcFor(stimulusId: string): string {
  return `${import.meta.env.BASE_URL.replace(/\/$/, '')}/audio/${stimulusId}.mp3`
}

export function useStimulusAudio(
  stimulusId: string | undefined,
  scriptText: string | undefined,
  enabled: boolean,
): AudioHandle {
  const supported = typeof window !== 'undefined'
  const [playing, setPlaying] = useState(false)
  const [loading, setLoading] = useState(false)
  const [usingFallback, setUsingFallback] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [playbackRate, setPlaybackRateState] = useState(1.0)
  const playbackRateRef = useRef(1.0)

  const audioRef = useRef<HTMLAudioElement | null>(null)
  /** Tăng mỗi lần play/stop; callback cũ thấy số khác thì tự bỏ. */
  const generationRef = useRef(0)
  const rafRef = useRef<number | null>(null)
  const currentIdRef = useRef<string | undefined>(stimulusId)

  /** Huỷ vòng cập nhật tiến trình. */
  const stopTicker = useCallback(() => {
    if (rafRef.current != null) {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = null
    }
  }, [])

  /** Dừng phát, huỷ mọi callback đang chờ, đưa state về ban đầu. */
  const stop = useCallback(() => {
    // Tăng thế hệ: mọi callback của lần phát trước sẽ thấy sai và bỏ qua.
    generationRef.current += 1

    stopTicker()
    const audio = audioRef.current
    if (audio) {
      try {
        audio.pause()
      } catch {
        /* bỏ qua */
      }
    }
    try {
      window.speechSynthesis?.cancel()
    } catch {
      /* bỏ qua */
    }
    setPlaying(false)
    setLoading(false)
    setCurrentTime(0)
  }, [stopTicker])

  /** Cập nhật thanh tiến trình mỗi khung hình khi đang phát. */
  const startTicker = useCallback(
    (audio: HTMLAudioElement) => {
      stopTicker()
      const tick = () => {
        if (audioRef.current !== audio) return
        setCurrentTime(audio.currentTime)
        if (audio.duration && Number.isFinite(audio.duration)) setDuration(audio.duration)
        rafRef.current = requestAnimationFrame(tick)
      }
      rafRef.current = requestAnimationFrame(tick)
    },
    [stopTicker],
  )

  // Rời màn hình: dừng và dọn.
  useEffect(() => {
    return () => {
      generationRef.current += 1
      stopTicker()
      const audio = audioRef.current
      if (audio) {
        try {
          audio.pause()
        } catch {
          /* bỏ qua */
        }
        audioRef.current = null
      }
      try {
        window.speechSynthesis?.cancel()
      } catch {
        /* bỏ qua */
      }
    }
  }, [stopTicker])

  // Đổi câu: dừng âm thanh của câu trước.
  useEffect(() => {
    if (currentIdRef.current === stimulusId) return
    currentIdRef.current = stimulusId
    generationRef.current += 1
    stopTicker()
    const audio = audioRef.current
    if (audio) {
      try {
        audio.pause()
        audio.currentTime = 0
      } catch {
        /* bỏ qua */
      }
      audioRef.current = null
    }
    setPlaying(false)
    setCurrentTime(0)
    setDuration(0)
  }, [stimulusId, stopTicker])

  /**
   * Tải trước metadata khi vào câu.
   *
   * Vì sao cần: thanh phát hiện `--:--` cho tới khi người dùng bấm phát, vì file
   * chỉ được tải lúc đó. Nhưng người học cần biết đoạn dài bao lâu NGAY khi nhìn
   * thấy câu hỏi, để quyết định nghe hay bỏ qua. Tải trước metadata chỉ lấy vài
   * KB header, không tải toàn bộ file, nên không tốn băng thông đáng kể.
   */
  useEffect(() => {
    if (!stimulusId || !enabled) return
    const preload = new Audio(audioSrcFor(stimulusId))
    preload.preload = 'metadata'
    let cancelled = false
    preload.onloadedmetadata = () => {
      if (cancelled) return
      if (preload.duration && Number.isFinite(preload.duration)) setDuration(preload.duration)
    }
    preload.onerror = () => {
      // Không có file — để `play()` xử lý việc rơi về giọng trình duyệt.
    }
    preload.load()
    return () => {
      cancelled = true
      preload.onloadedmetadata = null
      preload.onerror = null
    }
  }, [enabled, stimulusId])

  /** Phát bằng giọng trình duyệt khi không có file MP3. */
  const playFallback = useCallback(
    (generation: number) => {
      if (!scriptText?.trim() || !('speechSynthesis' in window)) {
        setLoading(false)
        return
      }
      setUsingFallback(true)
      const utterance = new SpeechSynthesisUtterance(scriptText)
      utterance.lang = 'en-US'
      utterance.rate = 0.92
      utterance.onend = () => {
        if (generationRef.current !== generation) return
        setPlaying(false)
      }
      utterance.onerror = () => {
        if (generationRef.current !== generation) return
        setPlaying(false)
      }
      setPlaying(true)
      setLoading(false)
      window.speechSynthesis.speak(utterance)
    },
    [scriptText],
  )

  const play = useCallback(() => {
    if (!enabled) return

    // Dừng mọi thứ đang chạy trước, rồi lấy thế hệ mới.
    generationRef.current += 1
    const generation = generationRef.current
    stopTicker()

    const previous = audioRef.current
    if (previous) {
      try {
        previous.pause()
      } catch {
        /* bỏ qua */
      }
    }
    try {
      window.speechSynthesis?.cancel()
    } catch {
      /* bỏ qua */
    }

    setCurrentTime(0)
    setDuration(0)

    if (!stimulusId) {
      playFallback(generation)
      return
    }

    setLoading(true)
    const audio = new Audio(audioSrcFor(stimulusId))
    audio.preload = 'auto'
    audioRef.current = audio

    /**
     * LỖI CŨ: các callback này không kiểm tra thế hệ, nên nếu người dùng bấm
     * "Dừng" trong lúc file còn đang tải, `oncanplaythrough` vẫn fire sau đó và
     * tự gọi `play()` — âm thanh phát lại dù đã dừng. Nay mỗi callback kiểm tra
     * `generationRef.current === generation` trước khi làm bất cứ điều gì.
     *
     * LỖI THỨ HAI (phát hiện khi kiểm): chỉ dựa vào `oncanplaythrough` thì đôi khi
     * sự kiện đó không bao giờ fire (trình duyệt đã có đủ buffer nhưng không phát
     * lại sự kiện). Hậu quả: thời lượng hiện `--:--` và nút kẹt ở trạng thái
     * "đang phát" dù audio không chạy. Nay dùng `loadedmetadata` (bắn sớm và luôn
     * bắn) để lấy thời lượng, và `canplay` để bắt đầu phát.
     */
    const stillCurrent = () => generationRef.current === generation

    const beginPlayback = () => {
      if (!stillCurrent()) return
      setLoading(false)
      setUsingFallback(false)
      if (audio.duration && Number.isFinite(audio.duration)) setDuration(audio.duration)
      try {
        audio.playbackRate = playbackRateRef.current
      } catch {
        /* bỏ qua */
      }
      void audio
        .play()
        .then(() => {
          if (!stillCurrent()) {
            // Bấm dừng ngay sau khi play() resolve — phải dừng lại lần nữa.
            audio.pause()
            return
          }
          setPlaying(true)
          startTicker(audio)
        })
        .catch(() => {
          if (!stillCurrent()) return
          setPlaying(false)
          playFallback(generation)
        })
    }

    // `loadedmetadata` bắn ngay khi biết thời lượng — dùng để hiện tổng thời gian
    // và bật thanh tua, không chờ tải xong.
    audio.onloadedmetadata = () => {
      if (!stillCurrent()) return
      if (audio.duration && Number.isFinite(audio.duration)) setDuration(audio.duration)
    }

    // `canplay` và `canplaythrough` đều có thể không bắn tuỳ trình duyệt; chọn cái
    // nào tới trước thì bắt đầu phát, và chỉ phát một lần.
    let started = false
    const tryStart = () => {
      if (started || !stillCurrent()) return
      started = true
      beginPlayback()
    }
    audio.oncanplay = tryStart
    audio.oncanplaythrough = tryStart

    audio.onended = () => {
      if (!stillCurrent()) return
      setPlaying(false)
      setCurrentTime(0)
      stopTicker()
    }

    audio.onerror = () => {
      if (!stillCurrent()) return
      setLoading(false)
      playFallback(generation)
    }

    audio.load()
  }, [enabled, playFallback, startTicker, stimulusId, stopTicker])

  const seek = useCallback((seconds: number) => {
    const audio = audioRef.current
    if (!audio || !Number.isFinite(seconds)) return
    try {
      audio.currentTime = Math.max(0, Math.min(seconds, audio.duration || seconds))
      setCurrentTime(audio.currentTime)
    } catch {
      /* bỏ qua */
    }
  }, [])

  const setPlaybackRate = useCallback((rate: number) => {
    playbackRateRef.current = rate
    setPlaybackRateState(rate)
    if (audioRef.current) {
      try {
        audioRef.current.playbackRate = rate
      } catch {
        /* bỏ qua */
      }
    }
  }, [])

  return {
    supported: supported && enabled,
    playing,
    loading,
    usingFallback,
    currentTime,
    duration,
    playbackRate,
    setPlaybackRate,
    play,
    stop,
    seek,
  }
}
