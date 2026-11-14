import { createContext, useContext } from 'react'
import type { Settings } from '../lib/contract'

export interface SettingsContextValue {
  settings: Settings
  /** Cập nhật một phần cài đặt; phần còn lại giữ nguyên. */
  update: (patch: Partial<Settings>) => void
}

export const SettingsContext = createContext<SettingsContextValue | null>(null)

/** Truy cập cài đặt người dùng. Ném lỗi nếu dùng ngoài `SettingsProvider`. */
export function useAppSettings(): SettingsContextValue {
  const value = useContext(SettingsContext)
  if (!value) throw new Error('useAppSettings phải nằm trong <SettingsProvider>')
  return value
}
