import { PART_META } from '../types'
import type { Part } from '../types'

/**
 * Tiện ích hiển thị part dùng chung cho nhiều màn hình.
 *
 * `PART_META` và `ALL_PARTS` là nguồn sự thật duy nhất trong `src/types.ts`;
 * tệp này chỉ RE-EXPORT để các màn hình không phải import từ hai nơi.
 */
export { ALL_PARTS, PART_META } from '../types'

/** Bảy part theo đúng thứ tự thi thật, dưới dạng mảng mới mỗi lần gọi. */
export function listParts(): Part[] {
  return [1, 2, 3, 4, 5, 6, 7]
}

/** Nhãn gọn của một nhóm part, dùng ở thẻ thống kê và lịch sử. */
export function describeParts(parts: Part[]): string {
  if (parts.length === 0) return 'Toàn bộ ngân hàng'
  return parts.map((part) => PART_META[part].label).join(', ')
}

/** "Nghe" / "Đọc" — chữ thay cho màu để không phụ thuộc thị giác màu. */
export function partSectionLabel(part: Part): string {
  return PART_META[part].section === 'listening' ? 'Nghe' : 'Đọc'
}
