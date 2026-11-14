import { PART_META } from '../types'
import type { Part } from '../types'

/** Trần thời gian giữ chuỗi đồng hồ luôn ở dạng `mm:ss` (dưới 1 giờ). */
const MAX_SECONDS = 59 * 60 + 59

/**
 * Thời gian gợi ý cho một phiên thi thử, tính từ `PART_META.suggestSeconds`
 * của các part có trong bài.
 *
 * Vì sao không dùng 45 + 75 phút của đề thật: đề thật có 200 câu, còn ngân hàng
 * hiện tại ít hơn nhiều, nên lấy nguyên 120 phút sẽ vừa vô nghĩa vừa khiến đồng
 * hồ vượt mốc 1 giờ (định dạng `h:mm:ss`). Tổng `suggestSeconds` của cả 7 part
 * là 3 420 giây nên luôn nằm trong `mm:ss`.
 */
export function suggestedDurationSeconds(parts: Part[]): number {
  const list = parts.length > 0 ? parts : (Object.keys(PART_META).map(Number) as Part[])
  const total = list.reduce((sum, part) => sum + PART_META[part].suggestSeconds, 0)
  return Math.max(60, Math.min(MAX_SECONDS, total))
}
