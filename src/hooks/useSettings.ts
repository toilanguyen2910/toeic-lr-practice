import { useCallback, useEffect, useState } from 'react'
import { loadSettings, saveSettings } from '../lib'
import type { Settings } from '../lib/contract'

/**
 * Cài đặt người dùng — đọc/ghi qua `engine` để mọi thao tác localStorage nằm ở
 * một chỗ duy nhất (`src/lib/storage.ts`), UI không tự đụng vào `localStorage`.
 */
export function useSettings(): {
  settings: Settings
  updateSettings: (patch: Partial<Settings>) => void
  replaceSettings: (next: Settings) => void
} {
  const [settings, setSettings] = useState<Settings>(loadSettings)

  // Ghi lại sau mỗi thay đổi (kể cả lần đầu) để localStorage luôn khớp UI.
  useEffect(() => {
    saveSettings(settings)
  }, [settings])

  const updateSettings = useCallback((patch: Partial<Settings>) => {
    setSettings((prev) => ({ ...prev, ...patch }))
  }, [])

  const replaceSettings = useCallback((next: Settings) => {
    setSettings(next)
  }, [])

  return { settings, updateSettings, replaceSettings }
}
