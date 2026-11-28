// Lucian UX/UI Prompt #440 · MIT License (c) 2026 Seokwoooo · https://lucianlabs.dev/uxui-prompt/#440
/**
 * TRẠNG THÁI RỖNG — port từ Lucian #440 "First-run empty state".
 *
 * Vì sao dùng: khi chưa có từ nào trong chủ đề, `.empty-state` tự viết chỉ có
 * một ô vuông và một dòng chữ. #440 cho đúng thứ còn thiếu — một hình minh hoạ
 * nhẹ nhàng và MỘT lời mời hành động rõ ràng.
 *
 * Giữ nguyên từ bản gốc:
 * - thư mục bồng bềnh `animation: u440-float 3.2s ease-in-out infinite` (nhấc
 *   lên -6px), bóng đổ co lại theo nhịp `u440-sh` cùng chu kỳ;
 * - ba ngôi sao nhấp nháy lệch pha -0.8s và -1.6s;
 * - khi bấm nút: tài liệu rơi xuống theo `u440-drop .8s`, thư mục nảy theo
 *   `u440-bump .9s … .38s`, tia sáng bắn ra `u440-pop .7s … .42s`;
 * - tiêu đề cũ mờ đi và tiêu đề mới hiện lên bằng `transition-delay: .45s`.
 *
 * Đã đổi: kích thước cố định 340×300 → bỏ, để thẻ co theo cột (vẫn giữ
 * `max-width:100%` cho 375px). Nội dung thay bằng tiếng Việt. Nút gọi hành động
 * của dự án (`onAction`) thay vì "Create first project".
 *
 * Lưu ý: bản gốc đổi tiêu đề sang "xong rồi" sau khi bấm. Ở đây nút dẫn sang
 * màn ôn tập nên không có trạng thái "đã tạo" — hiệu ứng rơi vẫn chạy để có phản
 * hồi, nhưng tiêu đề giữ nguyên.
 */

interface Props {
  /** Tiêu đề chính. */
  title: string
  /** Một dòng giải thích. */
  note: string
  /** Nhãn nút. */
  actionLabel: string
  /** Bấm nút. */
  onAction: () => void
  /** `data-testid` cho vùng rỗng, để QA bám vào. */
  testId?: string
}

export function LucianEmptyState({ title, note, actionLabel, onAction, testId }: Props) {
  return (
    <div className="ux u440 lx-empty" data-testid={testId}>
      <div className="u440-ill" aria-hidden="true">
        <svg className="u440-il" viewBox="0 0 160 120">
          <ellipse className="sh" cx="80" cy="116" rx="50" ry="5" />
          <path className="sp" d="M138 22l1.8 4.4 4.4 1.8-4.4 1.8-1.8 4.4-1.8-4.4-4.4-1.8 4.4-1.8z" />
          <path className="sp" d="M20 40l1.4 3.4 3.4 1.4-3.4 1.4-1.4 3.4-1.4-3.4-3.4-1.4 3.4-1.4z" />
          <path className="sp" d="M128 70l1 2.5 2.5 1-2.5 1-1 2.5-1-2.5-2.5-1 2.5-1z" />
          <g className="fol">
            <path
              className="bk"
              d="M28 34a8 8 0 0 1 8-8h22a6 6 0 0 1 4.6 2.2l4.6 5.8H124a8 8 0 0 1 8 8v58a8 8 0 0 1-8 8H36a8 8 0 0 1-8-8z"
            />
            <g className="doc">
              <rect className="p" x="50" y="24" width="60" height="58" rx="6" />
              <rect className="hd" x="57" y="31" width="20" height="5" rx="2.5" />
              <rect className="ln" x="57" y="42" width="44" height="3.5" rx="1.75" />
              <rect className="ln" x="57" y="50" width="36" height="3.5" rx="1.75" />
            </g>
            <path
              className="fr"
              d="M22 56a8 8 0 0 1 8-8h100a8 8 0 0 1 8 8.6l-4.4 44a8 8 0 0 1-8 7.4H34.4a8 8 0 0 1-8-7.4z"
            />
            <path
              className="fh"
              d="M30 48h100a8 8 0 0 1 8 8.6l-.3 3H22.1l-.1-3.6A8 8 0 0 1 30 48z"
            />
          </g>
        </svg>
        <span className="u440-burst">
          <i style={{ ['--a' as string]: '-60deg', ['--c' as string]: 'var(--ux-warn)' }} />
          <i style={{ ['--a' as string]: '-25deg', ['--c' as string]: 'var(--ux-mint)' }} />
          <i style={{ ['--a' as string]: '10deg', ['--c' as string]: 'var(--ux-accent-2)' }} />
          <i style={{ ['--a' as string]: '45deg', ['--c' as string]: 'var(--ux-warn)' }} />
          <i style={{ ['--a' as string]: '-95deg', ['--c' as string]: 'var(--ux-accent)' }} />
          <i style={{ ['--a' as string]: '80deg', ['--c' as string]: 'var(--ux-mint)' }} />
        </span>
      </div>

      <div className="u440-h">
        <b>{title}</b>
      </div>
      <p className="lx-empty__note">{note}</p>

      <button type="button" className="u440-go lx-empty__go" onClick={onAction}>
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 5v14M5 12h14" />
        </svg>
        <span>{actionLabel}</span>
      </button>
    </div>
  )
}
