/** Bộ lọc của màn hình xem lại. */
export type ReviewFilter = 'all' | 'wrong'

let preferred: ReviewFilter = 'all'

/**
 * Ghi nhớ bộ lọc mà nút bấm vừa chọn TRƯỚC KHI điều hướng tới `#/review`.
 *
 * Vì sao cần: hash router không có state, mà nút "Xem câu sai" ở màn hình kết quả
 * và nút "Xem lại" lại cần mở cùng một route với hai bộ lọc khác nhau. Chỉ đọc
 * thuần (không reset khi đọc) để StrictMode gọi khởi tạo state hai lần vẫn cho
 * cùng một kết quả.
 */
export function getPreferredReviewFilter(): ReviewFilter {
  return preferred
}

/** Đặt bộ lọc mặc định cho lần mở `#/review` kế tiếp. */
export function setPreferredReviewFilter(filter: ReviewFilter): void {
  preferred = filter
}
