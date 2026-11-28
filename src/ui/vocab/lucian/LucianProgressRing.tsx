// Lucian UX/UI Prompt #014 · MIT License (c) 2026 Seokwoooo · https://lucianlabs.dev/uxui-prompt/#014
/**
 * VÒNG TIẾN ĐỘ PHIÊN ÔN — port phần vòng tròn của Lucian #014 "To-do checklist".
 *
 * Vì sao lấy #014 chứ không lấy #099 (Activity rings): #099 là cả một widget
 * 340×410 gồm ba vòng, dải bảy ngày và bảng số liệu — thay vào một thanh tiến độ
 * là đổi một thứ nhỏ thành một khối lớn. #014 có đúng thứ cần: một vòng 48px,
 * một con số ở giữa, và khoảnh khắc đổi sang dấu ✓ khi xong.
 *
 * Giữ nguyên từ bản gốc:
 * - `r=20`, `stroke-width=5`, chu vi `125.7`, xoay `-90deg` để vạch bắt đầu ở đỉnh;
 * - `stroke-dashoffset: calc(125.7 * (1 - var(--p)))`;
 * - chuyển `stroke-dashoffset .7s var(--ux-spring)`, `stroke .4s var(--ux-ease)`;
 * - khi đủ 100%: số thu nhỏ `scale(.5)` + mờ dần, dấu ✓ phóng lên `scale(0 → 1)`
 *   bằng `.55s var(--ux-spring)`, viền đổi sang `--ux-mint`.
 *
 * Đã đổi: màu lấy từ `--ux-*` (bản gốc cũng vậy, nhưng nay các biến đó trỏ vào
 * token dự án), và `--p` do React đặt theo tiến độ thật của phiên.
 */

interface Props {
  /** Số đã trả lời xong. */
  current: number
  /** Tổng số thẻ của phiên. */
  total: number
  /** Nhãn đọc cho trình đọc màn hình. */
  label: string
}

export function LucianProgressRing({ current, total, label }: Props) {
  const safeTotal = total > 0 ? total : 1
  const ratio = Math.min(1, Math.max(0, current / safeTotal))
  const isAll = current >= safeTotal && total > 0

  return (
    <div
      className={`ux u014 lx-ring${isAll ? ' is-all' : ''}`}
      style={{ ['--p' as string]: ratio.toFixed(3) }}
      role="img"
      aria-label={label}
    >
      <svg viewBox="0 0 48 48" aria-hidden="true">
        <circle className="bg" cx="24" cy="24" r="20" />
        <circle className="fg" cx="24" cy="24" r="20" />
      </svg>
      <span className="u014-num lx-ring__num" aria-hidden="true">
        {current}/{total}
      </span>
      <span className="u014-done" aria-hidden="true">
        <svg viewBox="0 0 16 16">
          <path d="M3.5 8.4l3 3 6-6.4" />
        </svg>
      </span>
    </div>
  )
}
