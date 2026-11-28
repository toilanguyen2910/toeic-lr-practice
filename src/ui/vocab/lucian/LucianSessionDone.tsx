// Lucian UX/UI Prompt #093 · MIT License (c) 2026 Seokwoooo · https://lucianlabs.dev/uxui-prompt/#093
/**
 * MÀN HOÀN THÀNH PHIÊN — port từ Lucian #093 "Celebration when every task is done".
 *
 * Vì sao dùng: hết một lượt ôn mà chỉ hiện "Đã xong 20/20" thì người học không có
 * lý do bấm lượt tiếp. #093 có đúng thứ cần: tấm thẻ kết quả trượt lên, huy hiệu
 * bật vào, và confetti — phần thưởng cho việc ngồi học.
 *
 * Giữ nguyên từ bản gốc:
 * - tấm kết quả trượt lên `transform: translateY(105%) → none` bằng
 *   `.7s var(--ux-spring)`, chỉ chạy khi có class `done`;
 * - huy hiệu: `scale(.3) rotate(-25deg)` → `none` với `.7s var(--ux-spring) .2s`;
 * - sóng lan trên huy hiệu `u093-wave 1.1s .45s`;
 * - confetti 90 hạt: vận tốc `380..800`, góc `-π/2 ± .95`, trọng lực `900*dt`,
 *   ma sát `.985`, xoay theo `cos(t*9 + w)`, sống `1.6..2.5s`;
 * - con số chuỗi ngày cuộn lên bằng `translateY(calc(var(--v) * -20px))`.
 *
 * Đã đổi:
 * - Nội dung: nhận số liệu THẬT của phiên qua props (`known`, `unknown`, `total`)
 *   thay vì bốn việc mẫu. Bỏ danh sách checkbox — phiên đã xong, không còn gì để tích.
 * - Bỏ nút "Try again": đã có nút "Lượt mới" của trang, và bản gốc dùng nó để dựng
 *   lại danh sách mẫu — ở đây việc đó do React lo.
 * - Kích thước: `height: 450px` cố định → `min-height` + `max-width:100%` để không
 *   tràn ở 375px và không cắt chữ khi câu tiếng Việt dài hơn tiếng Anh.
 * - Canvas confetti: bản gốc vẽ theo `root.offsetWidth/Height` đo lúc bấm. Ở đây
 *   đo lại mỗi lần chạy và huỷ `requestAnimationFrame` khi unmount, nếu không thì
 *   StrictMode sẽ để lại một vòng vẽ mồ côi.
 */
import { useEffect, useRef } from 'react'

const COLORS = ['#22C3A6', '#10B981', '#FFB547', '#FF6B8B', '#7B61FF', '#3D8BFF']

interface Props {
  /** Số từ đánh dấu "đã thuộc" trong phiên. */
  known: number
  /** Số từ đánh dấu "chưa thuộc". */
  unknown: number
  /** Tổng số thẻ của phiên. */
  total: number
  /** Số ngày học liên tục hiện tại. */
  streak: number
  /** Bấm để sang lượt ôn mới. */
  onRestart: () => void
  /** Nhãn nút. */
  restartLabel: string
}

export function LucianSessionDone({
  known,
  unknown,
  total,
  streak,
  onRestart,
  restartLabel,
}: Props) {
  const rootRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const root = rootRef.current
    const canvas = canvasRef.current
    if (!root || !canvas) return

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const dpr = Math.min(2, window.devicePixelRatio || 1)
    const width = root.offsetWidth
    const height = root.offsetHeight
    canvas.width = width * dpr
    canvas.height = height * dpr
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const particles = Array.from({ length: 90 }, (_, i) => {
      const angle = -Math.PI / 2 + (Math.random() - 0.5) * 1.9
      const speed = 380 + Math.random() * 420
      return {
        x: width / 2 + (Math.random() - 0.5) * 40,
        y: 180,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        rot: Math.random() * 6,
        vrot: (Math.random() - 0.5) * 14,
        w: 5 + Math.random() * 5,
        h: 8 + Math.random() * 6,
        color: COLORS[i % COLORS.length] ?? '#FFB547',
        t: 0,
        life: 1.6 + Math.random() * 0.9,
      }
    })

    let raf = 0
    let last = performance.now()

    const frame = (now: number) => {
      const dt = Math.min(0.033, (now - last) / 1000)
      last = now
      let alive = 0
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, width, height)

      for (const p of particles) {
        p.t += dt
        if (p.t > p.life || p.y > height + 20) continue
        alive += 1
        p.vy += 900 * dt
        p.vx *= 0.985
        p.vy *= 0.985
        p.x += p.vx * dt
        p.y += p.vy * dt
        p.rot += p.vrot * dt
        ctx.save()
        ctx.translate(p.x, p.y)
        ctx.rotate(p.rot)
        ctx.globalAlpha = Math.min(1, (p.life - p.t) / 0.4)
        ctx.scale(1, Math.cos(p.t * 9 + p.w))
        ctx.fillStyle = p.color
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h)
        ctx.restore()
      }

      if (alive > 0) raf = requestAnimationFrame(frame)
      else ctx.clearRect(0, 0, width, height)
    }

    raf = requestAnimationFrame(frame)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <div className="ux u093 lx-done" ref={rootRef} data-testid="vocab-study-done">
      <div className="u093-h lx-done__head">
        <div>
          <small>Phiên ôn đã xong</small>
          <b>Kết quả</b>
        </div>
        <span className="u093-c" aria-hidden="true">
          <b>{total}</b> thẻ
        </span>
      </div>

      <div className="u093-win lx-done__win">
        <span className="u093-bdg" aria-hidden="true">
          <svg viewBox="0 0 42 42">
            <path d="M10 22l7.5 7.5L32 14" />
          </svg>
        </span>

        <p className="u093-wt lx-done__title">Hoàn thành lượt ôn</p>
        <p className="u093-ws">
          Đã thuộc <strong>{known}</strong> từ · chưa thuộc <strong>{unknown}</strong> từ
        </p>

        {streak > 0 ? (
          <span className="u093-st lx-done__streak">
            <svg viewBox="0 0 18 18" aria-hidden="true">
              <path
                d="M9 1.5c.6 3-2.8 4.4-2.8 7.6a2.8 2.8 0 0 0 5.6 0c0-1-.4-1.8-.9-2.5 2.2.9 3.6 3 3.6 5.2a5.5 5.5 0 0 1-11 0C3.5 7.6 8.3 6 9 1.5z"
                fill="#FF8A3D"
              />
            </svg>
            <span>{streak} ngày liên tục</span>
          </span>
        ) : null}

        <button type="button" className="u093-again lx-done__again" onClick={onRestart}>
          {restartLabel}
        </button>
      </div>

      <canvas className="u093-cf" ref={canvasRef} aria-hidden="true" />
    </div>
  )
}

