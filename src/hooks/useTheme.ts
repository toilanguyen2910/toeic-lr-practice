import { useEffect, useState } from 'react'

export type Theme = 'light' | 'dark' | 'auto'

const THEME_KEY = 'toeic-lr/v1/theme'

/**
 * Quản lý giao diện Sáng / Tối / Tự động theo hệ thống.
 * Lưu lựa chọn vào localStorage và cập nhật thuộc tính `data-theme` trên `<html>`.
 */
export function useTheme() {
  const [theme, setThemeState] = useState<Theme>(() => {
    try {
      const stored = localStorage.getItem(THEME_KEY)
      if (stored === 'light' || stored === 'dark' || stored === 'auto') return stored
    } catch {
      /* bỏ qua */
    }
    return 'light'
  })

  useEffect(() => {
    const root = document.documentElement
    const apply = (resolved: 'light' | 'dark') => {
      root.setAttribute('data-theme', resolved)
    }

    if (theme === 'auto') {
      const media = window.matchMedia('(prefers-color-scheme: dark)')
      apply(media.matches ? 'dark' : 'light')
      const listener = (event: MediaQueryListEvent) => apply(event.matches ? 'dark' : 'light')
      media.addEventListener('change', listener)
      return () => media.removeEventListener('change', listener)
    } else {
      apply(theme)
    }
  }, [theme])

  const setTheme = (next: Theme) => {
    setThemeState(next)
    try {
      localStorage.setItem(THEME_KEY, next)
    } catch {
      /* bỏ qua */
    }
  }

  const cycleTheme = () => {
    const next: Theme = theme === 'light' ? 'dark' : theme === 'dark' ? 'auto' : 'light'
    setTheme(next)
  }

  return { theme, setTheme, cycleTheme }
}
