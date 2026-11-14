import { useEffect, useState } from 'react'

/**
 * ĐIỀU HƯỚNG BẰNG HASH — không dùng thư viện router.
 *
 * `ROUTES` trong `src/testids.ts` là hợp đồng với bộ kiểm thử thật, nên route
 * luôn được trả về dưới dạng chuỗi có dấu `#` để so sánh trực tiếp với `ROUTES`.
 */

/** Đọc hash hiện tại; hash rỗng hoặc không hợp lệ quy về trang chủ `#/`. */
export function readHashRoute(): string {
  const raw = window.location.hash
  if (!raw || raw === '#') return '#/'

  const path = raw.startsWith('#') ? raw.slice(1) : raw
  if (!path.startsWith('/')) return '#/'

  // Bỏ dấu `/` thừa ở cuối để `#/history/` vẫn là trang lịch sử.
  const trimmed = path.length > 1 && path.endsWith('/') ? path.slice(0, -1) : path
  return `#${trimmed}`
}

/** Theo dõi `window.location.hash` và cập nhật lại mỗi khi có `hashchange`. */
export function useHashRoute(): string {
  const [route, setRoute] = useState<string>(readHashRoute)

  useEffect(() => {
    const handleChange = () => setRoute(readHashRoute())
    window.addEventListener('hashchange', handleChange)
    return () => window.removeEventListener('hashchange', handleChange)
  }, [])

  return route
}

/** Điều hướng bằng hash. Nhận thẳng giá trị trong `ROUTES`, ví dụ `#/result`. */
export function navigate(hash: string): void {
  if (window.location.hash === hash) return
  window.location.hash = hash
}
