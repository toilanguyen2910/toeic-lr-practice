import type { ReactNode } from 'react'
import { useSettings } from '../hooks/useSettings'
import { SettingsContext } from './settingsContext'

/**
 * Một nguồn cài đặt duy nhất cho cả ứng dụng.
 *
 * Nếu mỗi màn hình tự gọi `useSettings` thì việc ghi localStorage sẽ chạy song
 * song ở nhiều nơi và lần mount sau có thể ghi đè thay đổi vừa thực hiện.
 */
export function SettingsProvider({ children }: { children: ReactNode }) {
  const { settings, updateSettings } = useSettings()

  return (
    <SettingsContext.Provider value={{ settings, update: updateSettings }}>
      {children}
    </SettingsContext.Provider>
  )
}
