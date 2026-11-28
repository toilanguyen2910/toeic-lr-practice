// Lucian UX/UI Prompt #092 · MIT License (c) 2026 Seokwoooo · https://lucianlabs.dev/uxui-prompt/#092
/**
 * TRẠNG THÁI KHÔNG TÌM THẤY — port phần "không có kết quả" của Lucian #092
 * "Empty search that loosens filters".
 *
 * Vì sao dùng: ở màn danh sách 600 từ, người học sẽ lọc quá tay rồi ra rỗng. Một
 * dòng "Không tìm thấy" là ngõ cụt — họ phải tự đoán nên bỏ bộ lọc nào. #092 làm
 * đúng việc cần: TỰ ĐẾM xem bỏ bộ lọc nào thì ra bao nhiêu từ, rồi mời bấm đúng
 * bộ lọc đó.
 *
 * Giữ nguyên từ bản gốc:
 * - ống kính quét qua kệ trống: `u092-scan 3.6s ease-in-out infinite` với bốn mốc
 *   dịch chuyển và xoay;
 * - kệ sách nét đứt `stroke-dasharray: 2 9`;
 * - mỗi gợi ý là một nút bấm được, có `animation: u092-up .45s` với
 *   `animation-delay: calc(var(--i) * 80ms + .1s)` — nảy lên lần lượt;
 * - nút gợi ý có thẻ `<s>` gạch ngang tên bộ lọc, số kết quả in đậm bằng màu nhấn.
 *
 * Đã đổi: logic đếm dùng `filterWords` của dự án thật (không dùng dữ liệu giày
 * giả), nhãn tiếng Việt, không có phần "sửa lỗi chính tả" vì dự án không có từ
 * điển để đoán.
 */

interface Suggestion {
  /** Tên bộ lọc sẽ bỏ, ví dụ "Chủ đề: Tài chính". */
  label: string
  /** Số từ sẽ hiện ra nếu bỏ bộ lọc này. */
  count: number
  /** Bỏ bộ lọc này. */
  onRemove: () => void
}

interface Props {
  /** Từ khoá đang gõ, nếu có. */
  query: string
  /** Các bộ lọc đang bật, kèm số từ nếu bỏ chúng. */
  suggestions: Suggestion[]
  /** Bấm để xoá hết bộ lọc. */
  onReset: () => void
}

export function LucianNoResults({ query, suggestions, onReset }: Props) {
  const top = suggestions.slice(0, 2)

  return (
    <div className="ux u092 lx-noresults" data-testid="vocab-no-results">
      <div className="u092-area lx-noresults__area">
        <div className="u092-art" aria-hidden="true">
          <svg viewBox="0 0 150 92">
            <path className="u092-shelf" d="M8 30h134M8 56h134M8 82h134" />
            <g className="u092-lens">
              <circle cx="34" cy="38" r="20" />
              <path className="gl" d="M24 30a12 12 0 0 1 8-5" />
              <path d="M48 52l14 14" />
            </g>
          </svg>
        </div>

        <p className="u092-nt lx-noresults__title" role="status">
          {query ? `Không có từ nào khớp “${query}”` : 'Không có từ nào khớp bộ lọc này'}
        </p>
        <p className="u092-ns lx-noresults__note">
          {top.length > 0 ? 'Bỏ bớt một bộ lọc là thấy từ ngay' : 'Thử từ khoá khác, hoặc xoá bộ lọc'}
        </p>

        <div className="u092-sgs lx-noresults__list">
          {top.map((suggestion, index) => (
            <button
              key={suggestion.label}
              type="button"
              className="u092-sg"
              style={{ ['--i' as string]: index }}
              aria-label={`Bỏ bộ lọc ${suggestion.label}, được ${suggestion.count} từ`}
              onClick={suggestion.onRemove}
            >
              <s>{suggestion.label}</s>
              <span>
                <b>{suggestion.count} từ</b>
              </span>
              <svg viewBox="0 0 15 15" aria-hidden="true">
                <path d="M3 7.5h9M8.5 4l3.5 3.5L8.5 11" />
              </svg>
            </button>
          ))}

          <button type="button" className="lx-noresults__reset" onClick={onReset}>
            Xoá tất cả bộ lọc
          </button>
        </div>
      </div>
    </div>
  )
}
