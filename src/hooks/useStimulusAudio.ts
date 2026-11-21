import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * PHÁT ÂM THANH CHO PART 1–4.
 *
 * Hai nguồn, ưu tiên file MP3:
 * 1. File MP3 sinh sẵn trong `public/audio/<stimulusId>.mp3` (xem
 *    `scripts/generate-audio.py`). Đây là nguồn chính — giọng đọc tự nhiên, giống
 *    nhau trên mọi máy, hội thoại có hai giọng khác nhau.
 * 2. Nếu chưa có file (dữ liệu mới thêm mà chưa sinh âm thanh), rơi về Speech
 *    Synthesis của trình duyệt để không có đoạn nào bị câm hoàn toàn.
 *
 * Vì sao cần `useImperativeHandle`: nút "Nghe lời thoại" ở màn hình làm bài cần
 * gọi `play()/stop()` từ ngoài, nhưng đối tượng `HTMLAudioElement` phải nằm trong
 * hook để dọn dẹp đúng khi đổi câu.
 */

export interface AudioHandle {
  /** Có phát được không (bật cài đặt và trình duyệt hỗ trợ). */
  supported: boolean
  /** Đang phát. */
  playing: boolean
  /** Đang tải file. */
  loading: boolean
  /** Không tìm thấy file MP3 — đang dùng giọng trình duyệt thay thế. */
  usingFallback: boolean
  play: () => void
  stop: () => void
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

  const audioRef = useRef<HTMLAudioElement | null>(null)
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null)

  /** Dừng mọi thứ đang phát và dọn tài nguyên. */
  const stop = useCallback(() => {
    const audio = audioRef.current
    if (audio) {
      try {
        audio.pause()
        audio.currentTime = 0
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
  }, [])

  /** Dừng khi đổi câu hoặc rời màn hình — không để âm thanh chạy sang trang khác. */
  useEffect(() => {
    return () => {
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
  }, [])

  // Ghi nhớ id hiện tại để biết khi nào nên ngừng phát.
  const currentIdRef = useRef<string | undefined>(stimulusId)

  /**
   * Đổi câu thì dừng âm thanh của câu trước.
   *
   * Dùng `useEffect` (không phải ghi ref trong render) vì React Compiler cấm
   * mutation trong lúc render. Ở đây effect KHÔNG gọi setState — nó chỉ dừng đối
   * tượng audio và đặt lại cờ qua ref, nên không gây vòng render thêm.
   */
  useEffect(() => {
    if (currentIdRef.current === stimulusId) return
    currentIdRef.current = stimulusId
    const previous = audioRef.current
    if (!previous) return
    try {
      previous.pause()
      previous.currentTime = 0
    } catch {
      /* bỏ qua */
    }
    audioRef.current = null
    setPlaying(false)
  }, [stimulusId])

  /** Phát bằng giọng trình duyệt khi không có file MP3. */
  const playFallback = useCallback(() => {
    if (!scriptText?.trim() || !('speechSynthesis' in window)) {
      setLoading(false)
      return
    }
    setUsingFallback(true)
    const utterance = new SpeechSynthesisUtterance(scriptText)
    utterance.lang = 'en-US'
    utterance.rate = 0.92
    utterance.onend = () => setPlaying(false)
    utterance.onerror = () => setPlaying(false)
    utteranceRef.current = utterance
    setPlaying(true)
    setLoading(false)
    window.speechSynthesis.speak(utterance)
  }, [scriptText])

  const play = useCallback(() => {
    if (!enabled) return
    stop()

    if (!stimulusId) {
      playFallback()
      return
    }

    setLoading(true)
    const audio = new Audio(audioSrcFor(stimulusId))
    audio.preload = 'auto'

    audio.oncanplaythrough = () => {
      setLoading(false)
      setUsingFallback(false)
      setPlaying(true)
      void audio.play().catch(() => {
        // Trình duyệt chặn tự phát, hoặc file hỏng → dùng giọng trình duyệt.
        setPlaying(false)
        playFallback()
      })
    }
    audio.onended = () => setPlaying(false)
    audio.onerror = () => {
      // Không có file (dữ liệu mới, chưa sinh âm thanh) → giọng trình duyệt.
      setLoading(false)
      playFallback()
    }

    audioRef.current = audio
    audio.load()
  }, [enabled, playFallback, stimulusId, stop])

  const handle: AudioHandle = {
    supported: supported && enabled,
    playing,
    loading,
    usingFallback,
    play,
    stop,
  }

  return handle
}
