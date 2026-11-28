// Lucian UX/UI Prompt #379 · MIT License (c) 2026 Seokwoooo · https://lucianlabs.dev/uxui-prompt/#379
/**
 * CHUỖI NGÀY HỌC — port từ Lucian #379 "Growing streak flame".
 *
 * Vì sao dùng: chuỗi ngày là động lực duy nhất khiến người học quay lại mỗi ngày,
 * nhưng trước đây app không có chỗ nào hiển thị nó. #379 là phần tử duy nhất
 * trong thư viện vẽ được "chuỗi ngày" bằng hình chứ không bằng con số khô.
 *
 * Giữ nguyên từ bản gốc:
 * - ngọn lửa ba lớp (ngoài / giữa / lõi), mỗi lớp tự đung đưa theo nhịp riêng:
 *   `sin(t*1.7 + ph) * .6 + sin(t*2.9 + ph*2) * .4`, biên độ `h * .13 * sw * f^1.5`;
 * - đường bao dựng bằng Catmull–Rom chia 6, đúng như bản gốc;
 * - tia lửa: 7 hạt, bay lên `BASE - 70 - q*80`, bán kính teo dần `r * (1-q)`;
 * - bảy ô ngày trong tuần, ô đã học có dấu ✓ vẽ bằng `::after` với `u379-pop .45s
 *   cubic-bezier(.3,1.8,.5,1)`, ô hôm nay có viền `box-shadow: 0 0 0 2px`;
 * - lửa to dần theo số ngày: `scale(0.8 + done*0.05)`, quầng sáng
 *   `opacity(0.4 + done*0.09)`, `scale(0.8 + done*0.06)`;
 * - con số cuộn bằng `translateY(-streak * 44px)`.
 *
 * Đã đổi:
 * - Nền: bản gốc là gradient nâu tối cố định `#3B1F0E → #170B05`. Giữ nguyên nó
 *   thì ở light mode sẽ có một khối nâu đen giữa trang sáng — đúng lỗi "dark mode
 *   vỡ" mà dự án từng mắc. Nay nền dùng `--ux-surface-2 → --ux-surface`, chữ dùng
 *   `--ux-ink`, nên thẻ theo đúng theme. Màu ngọn lửa giữ nguyên vì đó là hình
 *   minh hoạ, đọc được trên cả hai nền.
 * - Dữ liệu: bản gốc tự bịa `streak = 11, done = 3` và có nút "Done today" để
 *   tự tăng. Ở đây nhận `streak` thật (tính từ `lastSeenAt`) và `week` (bảy ngày
 *   gần nhất đã học hay chưa) qua props. Bỏ nút "Done today": người học đã đánh
 *   dấu bằng nút "Đã thuộc" ở màn ôn, thêm nút thứ hai sẽ thành hai nguồn sự thật.
 * - Chiều rộng: `width: 340px` + `max-width: 100%` để không tràn ở 375px. Mọi
 *   phần tử bên trong đều canh giữa hoặc dùng `left/right`, nên co lại vẫn đúng.
 *
 * Về vòng lặp `requestAnimationFrame`: bản gốc dừng khi `root.isConnected` sai
 * nhưng không huỷ khung hình đang chờ. Ở đây huỷ tường minh trong cleanup, nếu
 * không thì StrictMode (mount hai lần) sẽ chạy hai vòng vẽ chồng nhau.
 */
import { useEffect, useRef } from 'react'

interface Props {
  /** Số ngày học liên tục, tính đến hôm nay. */
  streak: number
  /** Bảy ngày gần nhất (cũ → mới); `true` = ngày đó có học. */
  week: boolean[]
  /** Nhãn thứ của bảy ngày đó — tính từ ngày thật, không viết cứng. */
  weekLabels: string[]
}

/** Các lớp của ngọn lửa: rộng, cao, pha dao động, hệ số đung đưa. */
const LAYERS = [
  { cls: 'u379-fo', grad: 'o', w: 40, h: 126, ph: 0, sw: 1 },
  { cls: 'u379-fm', grad: 'm', w: 28, h: 88, ph: 1.7, sw: 0.8 },
  { cls: 'u379-fc', grad: 'c', w: 15, h: 48, ph: 3.1, sw: 0.55 },
] as const

/** Sáu điểm điều khiển nửa phải của ngọn lửa: [tỉ lệ cao, tỉ lệ rộng]. */
const PROFILE: ReadonlyArray<readonly [number, number]> = [
  [0.05, 0.6],
  [0.19, 0.96],
  [0.37, 1],
  [0.55, 0.8],
  [0.71, 0.52],
  [0.85, 0.26],
]

const CENTER_X = 60
const BASE_Y = 138
const SPARK_COUNT = 7

export function LucianStreakFlame({ streak, week, weekLabels }: Props) {
  const rootRef = useRef<HTMLDivElement>(null)
  const flameRef = useRef<HTMLDivElement>(null)
  const glowRef = useRef<HTMLDivElement>(null)
  const rollerRef = useRef<HTMLSpanElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)

  const done = Math.min(7, week.filter(Boolean).length)

  /** Đưa lửa, quầng sáng và con số về đúng trạng thái hiện tại. */
  useEffect(() => {
    const flame = flameRef.current
    const glow = glowRef.current
    const roller = rollerRef.current
    if (!flame || !glow || !roller) return
    const scale = 0.8 + done * 0.05
    flame.style.transform = `scale(${scale.toFixed(2)})`
    glow.style.opacity = (0.4 + done * 0.09).toFixed(2)
    glow.style.transform = `scale(${(0.8 + done * 0.06).toFixed(2)})`
    roller.style.transform = `translateY(${-Math.max(0, streak) * 44}px)`
  }, [done, streak])

  /** Vòng vẽ ngọn lửa. Chạy một lần cho mỗi lần mount. */
  useEffect(() => {
    const root = rootRef.current
    const svg = svgRef.current
    if (!root || !svg) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    // Gradient id phải duy nhất trên trang: hai thẻ cùng id sẽ tranh nhau.
    const uid = `u379-${Math.random().toString(36).slice(2, 8)}`
    const defs = svg.querySelector('defs')
    if (!defs) return
    defs.innerHTML = [
      `<linearGradient id="${uid}o" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#FF7A1A"/><stop offset=".55" stop-color="#F5462A"/><stop offset="1" stop-color="#D9262B"/></linearGradient>`,
      `<linearGradient id="${uid}m" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#FFC24A"/><stop offset="1" stop-color="#FF8A1F"/></linearGradient>`,
      `<linearGradient id="${uid}c" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#FFFBEA"/><stop offset="1" stop-color="#FFE27A"/></linearGradient>`,
    ].join('')

    const layers = LAYERS.map((layer) => {
      const el = svg.querySelector<SVGPathElement>(`.${layer.cls}`)
      if (el) el.setAttribute('fill', `url(#${uid}${layer.grad})`)
      return { ...layer, el }
    })

    /** Nhiễu đung đưa của một lớp tại độ cao `f` (0 = đáy, 1 = đỉnh). */
    const sway = (layer: (typeof LAYERS)[number], t: number, f: number): number =>
      (Math.sin(t * 1.7 + layer.ph) * 0.6 + Math.sin(t * 2.9 + layer.ph * 2) * 0.4) *
      layer.h *
      0.13 *
      layer.sw *
      Math.pow(f, 1.5)

    /** Dựng đường bao kín cho một lớp lửa. */
    const outline = (layer: (typeof LAYERS)[number], el: SVGPathElement, t: number) => {
      const w = layer.w
      const h = layer.h
      const right: Array<[number, number]> = []
      const left: Array<[number, number]> = []

      for (const [f, xRatio] of PROFILE) {
        const y = BASE_Y - f * h
        const x = xRatio * w
        const s = sway(layer, t, f)
        right.push([
          CENTER_X + x + s + Math.sin(t * 6.1 + f * 7 + layer.ph) * w * 0.07 * f,
          y,
        ])
        left.unshift([
          CENTER_X - x + s - Math.sin(t * 5.3 + f * 6 + layer.ph + 2) * w * 0.07 * f,
          y,
        ])
      }

      const tipX = CENTER_X + sway(layer, t, 1) + Math.sin(t * 4.3 + layer.ph) * w * 0.12
      const tipY = BASE_Y - h * (1 + Math.sin(t * 5.2 + layer.ph) * 0.035)
      const tip: [number, number] = [tipX, tipY]

      const points: Array<[number, number]> = [[CENTER_X, BASE_Y], ...right, tip, tip, ...left]
      const n = points.length
      const first = points[0]
      if (!first) return
      let d = `M${first[0].toFixed(1)} ${first[1].toFixed(1)}`

      for (let i = 0; i < n; i += 1) {
        const a = points[(i - 1 + n) % n]
        const b = points[i]
        const c = points[(i + 1) % n]
        const e = points[(i + 2) % n]
        if (!a || !b || !c || !e) continue
        const c1x = b[0] + (c[0] - a[0]) / 6
        const c1y = b[1] + (c[1] - a[1]) / 6
        const c2x = c[0] - (e[0] - b[0]) / 6
        const c2y = c[1] - (e[1] - b[1]) / 6
        d += ` C${c1x.toFixed(1)} ${c1y.toFixed(1)} ${c2x.toFixed(1)} ${c2y.toFixed(1)} ${c[0].toFixed(1)} ${c[1].toFixed(1)}`
      }

      el.setAttribute('d', `${d}Z`)
    }

    const sparkGroup = svg.querySelector('.u379-sp')
    const sparks: Array<{ el: SVGCircleElement; t0: number; life: number; x: number; dx: number; r: number }> = []
    if (sparkGroup) {
      for (let i = 0; i < SPARK_COUNT; i += 1) {
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
        circle.setAttribute('r', '0')
        sparkGroup.appendChild(circle)
        sparks.push({ el: circle, t0: -1, life: 1, x: 0, dx: 0, r: 1 })
      }
    }

    const drawSparks = (now: number) => {
      sparks.forEach((spark, index) => {
        const active = index < 2 + Math.round(done * 0.7)
        if (spark.t0 < 0 || now - spark.t0 > spark.life) {
          if (!active) {
            spark.el.setAttribute('r', '0')
            spark.t0 = -1
            return
          }
          spark.t0 = now + Math.random() * 600
          spark.life = 900 + Math.random() * 700
          spark.x = CENTER_X + (Math.random() - 0.5) * 30
          spark.dx = (Math.random() - 0.5) * 30
          spark.r = 1 + Math.random() * 1.6
        }
        const q = (now - spark.t0) / spark.life
        if (q < 0) {
          spark.el.setAttribute('r', '0')
          return
        }
        spark.el.setAttribute('cx', (spark.x + spark.dx * q + Math.sin(q * 9 + index) * 3).toFixed(1))
        spark.el.setAttribute('cy', (BASE_Y - 70 - q * 80).toFixed(1))
        spark.el.setAttribute('r', (spark.r * (1 - q)).toFixed(2))
        spark.el.setAttribute('opacity', (1 - q).toFixed(2))
      })
    }

    let raf = 0
    let visible = true
    let observer: IntersectionObserver | null = null

    const frame = (now: number) => {
      if (visible) {
        const t = now / 1000
        for (const layer of layers) if (layer.el) outline(layer, layer.el, t)
        drawSparks(now)
      }
      raf = requestAnimationFrame(frame)
    }

    if (reduced) {
      for (const layer of layers) if (layer.el) outline(layer, layer.el, 0)
      drawSparks(0)
    } else {
      if ('IntersectionObserver' in window) {
        observer = new IntersectionObserver((entries) => {
          visible = entries[0]?.isIntersecting ?? true
        })
        observer.observe(root)
      }
      raf = requestAnimationFrame(frame)
    }

    return () => {
      cancelAnimationFrame(raf)
      observer?.disconnect()
      if (sparkGroup) sparkGroup.replaceChildren()
    }
  }, [done])

  return (
    <div className="ux u379 lx-streak" ref={rootRef} data-testid="vocab-streak">
      <div className="u379-glow" ref={glowRef} aria-hidden="true" />
      <div className="u379-fl" ref={flameRef} aria-hidden="true">
        <svg viewBox="0 0 120 144" ref={svgRef}>
          <defs />
          <g className="u379-sp" />
          <path className="u379-fo" />
          <path className="u379-fm" />
          <path className="u379-fc" />
        </svg>
      </div>

      <div className="u379-ct" aria-live="polite">
        {/*
          Con số cuộn là MỘT dải 61 chữ số xếp dọc, chỉ một chữ số nhìn thấy được
          nhờ `overflow: hidden`. Nếu để nguyên, trình đọc màn hình sẽ đọc hết
          "0123456789…60" — đúng như bộ kiểm bắt được. Nên: ẩn dải cuộn khỏi
          accessibility tree, và bù bằng một câu mô tả đầy đủ.
        */}
        <span className="u379-nw" aria-hidden="true">
          <span className="u379-ns" ref={rollerRef}>
            {Array.from({ length: 61 }, (_, i) => (
              <i key={i}>{i}</i>
            ))}
          </span>
        </span>
        <b aria-hidden="true">ngày liên tục</b>
        <span className="visually-hidden">{`Chuỗi học: ${streak} ngày liên tục`}</span>
      </div>

      <div className="u379-wk" role="img" aria-label={`Bảy ngày gần nhất: ${done} ngày có học`}>
        {week.map((on, index) => {
          // Nhãn lấy từ ngày thật của ô đó. Nhãn trùng nhau là bình thường (T7
          // chỉ xuất hiện một lần trong bảy ngày, nhưng `key` phải là vị trí).
          const label = weekLabels[index] ?? ''
          const isToday = index === week.length - 1
          return (
            <div key={`${label}-${index}`}>
              <div className="u379-dy">{label}</div>
              <div className={`u379-dt${on ? ' is-on' : ''}${isToday ? ' is-today' : ''}`} />
            </div>
          )
        })}
      </div>
    </div>
  )
}


