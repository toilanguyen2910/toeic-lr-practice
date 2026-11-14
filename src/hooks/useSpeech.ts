import { useCallback, useEffect, useState } from 'react'

/**
 * Đọc lời thoại bằng Speech Synthesis của trình duyệt.
 *
 * Đây là phần duy nhất của app phát ra âm thanh. Không có `speechSynthesis` (hoặc
 * người dùng tắt `audioEnabled`) thì `supported` là `false` và UI ẩn nút nghe —
 * không bao giờ gọi API khi chưa có thao tác của người dùng.
 */
export function useSpeech(enabled: boolean): {
  supported: boolean
  speaking: boolean
  speak: (text: string) => void
  stop: () => void
} {
  const supported = typeof window !== 'undefined' && 'speechSynthesis' in window
  const [speaking, setSpeaking] = useState(false)

  // Huỷ mọi lời đang đọc khi rời màn hình để không tiếp tục phát ở trang khác.
  useEffect(() => {
    return () => {
      try {
        window.speechSynthesis?.cancel()
      } catch {
        /* trình duyệt chặn — bỏ qua */
      }
    }
  }, [])

  const stop = useCallback(() => {
    try {
      window.speechSynthesis?.cancel()
    } catch {
      /* bỏ qua */
    }
    setSpeaking(false)
  }, [])

  const speak = useCallback(
    (text: string) => {
      if (!enabled || !supported || !text.trim()) return
      try {
        window.speechSynthesis.cancel()
        const utterance = new SpeechSynthesisUtterance(text)
        utterance.lang = 'en-US'
        utterance.rate = 0.92
        utterance.onend = () => setSpeaking(false)
        utterance.onerror = () => setSpeaking(false)
        setSpeaking(true)
        window.speechSynthesis.speak(utterance)
      } catch {
        setSpeaking(false)
      }
    },
    [enabled, supported],
  )

  return { supported: supported && enabled, speaking, speak, stop }
}
