/**
 * TIME — định dạng đồng hồ đếm giờ cho màn hình làm bài.
 *
 * Hàm thuần, không phụ thuộc DOM/Intl/Locale: cùng đầu vào luôn cho cùng chuỗi.
 */

/** Chuỗi mặc định khi giá trị không dùng được (`null`, `NaN`, `Infinity`, số âm…). */
const ZERO_CLOCK = '00:00'

const SECONDS_PER_MINUTE = 60
const SECONDS_PER_HOUR = 60 * SECONDS_PER_MINUTE

/**
 * Quy đổi đầu vào về số giây nguyên không âm.
 * Trả `null` khi giá trị không phải số hữu hạn không âm (bao gồm `null`/`undefined`).
 */
function toWholeSeconds(seconds: number | null | undefined): number | null {
  if (typeof seconds !== 'number' || !Number.isFinite(seconds)) return null
  if (seconds < 0) return null
  return Math.floor(seconds)
}

function pad2(value: number): string {
  return value < 10 ? `0${value}` : `${value}`
}

/**
 * Định dạng số giây thành `mm:ss`, hoặc `h:mm:ss` khi đã đủ 1 giờ trở lên.
 *
 * - `0` → `00:00`, `59` → `00:59`, `61` → `01:01`
 * - `3600` → `1:00:00`, `3699` → `1:01:39`
 * - `null` / `NaN` / `Infinity` / số âm → `00:00`
 *
 * Tham số được khai báo rộng hơn `EngineApi.formatClock` (`number`) một chút để
 * UI có thể truyền thẳng giá trị `null` mà không phải tự kiểm tra trước — kiểu
 * rộng hơn vẫn gán được vào `(seconds: number) => string`.
 */
export function formatClock(seconds: number | null | undefined): string {
  const whole = toWholeSeconds(seconds)
  if (whole === null) return ZERO_CLOCK

  const hours = Math.floor(whole / SECONDS_PER_HOUR)
  const minutes = Math.floor((whole % SECONDS_PER_HOUR) / SECONDS_PER_MINUTE)
  const rest = whole % SECONDS_PER_MINUTE

  if (hours > 0) return `${hours}:${pad2(minutes)}:${pad2(rest)}`
  return `${pad2(minutes)}:${pad2(rest)}`
}
