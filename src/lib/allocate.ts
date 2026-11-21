/**
 * CHIA TỔNG SỐ CÂU CHO CÁC PART ĐÃ CHỌN.
 *
 * Vấn đề người dùng nêu: chọn Part 1, 2, 5, 6 rồi muốn làm **đúng 77 câu** — vì
 * 77 là tổng số câu chính thức của bốn part đó trong đề TOEIC thật
 * (6 + 25 + 30 + 16). Cách nhập "số câu mỗi part" bắt người dùng tự tính, và
 * không bao giờ ra đúng con số họ muốn nếu các part có tỉ lệ khác nhau.
 *
 * Cách làm ở đây: chia tổng theo ĐÚNG TỈ LỆ số câu chính thức của từng part, dùng
 * phương pháp phần dư lớn nhất (largest remainder) để tổng các phần luôn bằng
 * đúng con số yêu cầu — không lệch một câu nào.
 *
 * Ví dụ: part [1,2,5,6], tổng 77, tỉ lệ chính thức 6:25:30:16 (=77)
 *        → chia đúng 6, 25, 30, 16.
 * Ví dụ: cùng part, tổng 40
 *        → 40 × 6/77 = 3,12 · 40 × 25/77 = 12,99 · 40 × 30/77 = 15,58 · 40 × 16/77 = 8,31
 *        → phần nguyên 3, 12, 15, 8 (tổng 38), còn dư 2
 *        → cộng cho hai phần dư lớn nhất: part5 (.58) và part6 (.31)
 *        → kết quả 3, 13, 16, 8 = 40 ✔
 */
import type { Part } from '../types'
import { PART_META } from '../types'

export interface PartAllocation {
  part: Part
  /** Số câu sẽ lấy từ part này. */
  count: number
}

/**
 * Chia `total` câu cho các part theo tỉ lệ số câu chính thức.
 *
 * @param parts các part người dùng đã chọn (đã lọc theo part có dữ liệu)
 * @param total tổng số câu mong muốn
 * @param available số câu thật có trong ngân hàng của từng part
 * @returns phân bổ từng part, tổng luôn bằng `min(total, tổng khả dụng)`
 */
export function allocateByOfficialRatio(
  parts: readonly Part[],
  total: number,
  available: ReadonlyMap<Part, number>,
): PartAllocation[] {
  if (parts.length === 0) return []

  const wanted = Number.isFinite(total) ? Math.max(0, Math.trunc(total)) : 0

  // Tổng khả dụng: không thể hứa nhiều hơn số câu thật đang có.
  let capacity = 0
  for (const part of parts) capacity += available.get(part) ?? 0
  const target = Math.min(wanted, capacity)
  if (target === 0) return parts.map((part) => ({ part, count: 0 }))

  // Trọng số = số câu chính thức của part trong đề TOEIC thật. Dùng trọng số này
  // thay vì số câu đang có, để bài luyện giữ đúng "hình dạng" đề thật: Part 2
  // luôn nhiều hơn Part 1, Part 5 nhiều hơn Part 6…
  const weightOf = (part: Part) => PART_META[part].officialCount
  let weightSum = 0
  for (const part of parts) weightSum += weightOf(part)
  if (weightSum === 0) weightSum = parts.length

  // Bước 1: phần nguyên của phép chia tỉ lệ.
  const base = parts.map((part) => {
    const exact = (target * weightOf(part)) / weightSum
    const floored = Math.floor(exact)
    return { part, count: floored, remainder: exact - floored }
  })

  // Bước 2: còn dư bao nhiêu câu thì cộng vào các part có phần lẻ lớn nhất.
  let assigned = base.reduce((sum, item) => sum + item.count, 0)
  const order = [...base].sort((a, b) => b.remainder - a.remainder)
  let cursor = 0
  while (assigned < target) {
    const pick = order[cursor % order.length]
    if (pick) {
      pick.count += 1
      assigned += 1
    }
    cursor += 1
    // Chặn vòng lặp vô hạn nếu mọi phần lẻ bằng 0 (không thể xảy ra khi target ≤ capacity,
    // nhưng thêm cho an toàn).
    if (cursor > parts.length * 4) break
  }

  // Bước 3: kẹp theo số câu thật, và bù phần dư sang các part còn chỗ.
  for (const item of base) {
    const have = available.get(item.part) ?? 0
    if (item.count > have) item.count = have
  }

  let actual = base.reduce((sum, item) => sum + item.count, 0)
  // Nếu bị kẹp làm thiếu so với mục tiêu, dồn phần thiếu sang part còn dư địa.
  let guard = 0
  while (actual < target && guard < parts.length * 40) {
    guard += 1
    let moved = false
    for (const item of base) {
      const have = available.get(item.part) ?? 0
      if (item.count < have && actual < target) {
        item.count += 1
        actual += 1
        moved = true
      }
    }
    if (!moved) break
  }

  // Bước 4: trả về theo đúng thứ tự part người dùng đã chọn.
  return parts.map((part) => ({
    part,
    count: base.find((item) => item.part === part)?.count ?? 0,
  }))
}

/** Tổng số câu chính thức của các part đã chọn (dùng để gợi ý "đủ đề thật"). */
export function officialTotalOf(parts: readonly Part[]): number {
  return parts.reduce((sum, part) => sum + PART_META[part].officialCount, 0)
}
