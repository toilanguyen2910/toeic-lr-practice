// Lucian UX/UI Prompt #052 · MIT License (c) 2026 Seokwoooo · https://lucianlabs.dev/uxui-prompt/#052
/**
 * THẺ LẬT FLASHCARD — port từ Lucian #052 "Flip-around membership card".
 *
 * Giữ nguyên từ bản gốc:
 * - chuyển động 3D: `transform: rotateX(var(--tilt)) rotateY(var(--ry))` với
 *   `transition: transform .75s var(--ux-spring)`;
 * - kéo ngang để xoay theo tay (hệ số 0.9, cộng quán tính `vx * 8`), thả ra thì
 *   bám về mặt gần nhất (`Math.round(a / 180) * 180`);
 * - vệt loang hologram `--sh` chạy theo góc: `50 + sin(a) * 60`;
 * - nghiêng 8deg khi rê chuột vào, trả về 0 khi ra;
 * - bấm hoặc nhấn Space/Enter để lật.
 *
 * Đã đổi cho dự án:
 * - Kích thước: bản gốc 320×202 cố định, không đủ chỗ cho nghĩa + định nghĩa +
 *   ví dụ. Nay rộng tối đa 460px và cao theo nội dung, có `max-width:100%` để
 *   không tràn ở 375px. Đây là thay đổi DUY NHẤT về hình dạng.
 * - Màu: mặt trước dùng `--ux-grad`, mặt sau dùng `--ux-surface*` — nhờ vậy thẻ
 *   đổi màu theo `data-theme` của app, không dùng bảng màu riêng của Lucian.
 * - Nội dung: từ tiếng Anh + phiên âm (mặt trước), nghĩa + định nghĩa + ví dụ
 *   (mặt sau) thay cho thẻ thành viên.
 * - Bỏ nút "Lock card": dự án không có khái niệm khoá thẻ.
 *
 * Về khả năng truy cập: bản gốc đặt `aria-hidden` lên CẢ HAI mặt rồi mô tả thẻ
 * bằng `aria-label`, nghĩa là trình đọc màn hình không đọc được nội dung thẻ.
 * Với flashcard thì nội dung chính là thứ cần đọc, nên ở đây chỉ mặt đang khuất
 * mới `aria-hidden`; tên của nút lấy từ chính mặt đang hiện.
 */
import { useCallback, useEffect, useRef } from 'react'
import type { VocabWord } from '../../../types-vocab'

const POS_LABEL: Record<VocabWord['partOfSpeech'], string> = {
  n: 'danh từ',
  v: 'động từ',
  adj: 'tính từ',
  adv: 'trạng từ',
  phr: 'cụm từ',
}

interface Props {
  word: VocabWord
  /** Mặt sau đang hiện hay không — do trang ôn giữ, để bàn phím điều khiển được. */
  flipped: boolean
  onFlip: () => void
}

export function LucianFlipCard({ word, flipped, onFlip }: Props) {
  const rootRef = useRef<HTMLDivElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)

  /** Trạng thái kéo, giữ trong ref để không gây render mỗi lần di chuột. */
  const drag = useRef({ down: false, moved: false, sx: 0, start: 0, lastX: 0, vx: 0 })

  /** Ghi góc xoay thẳng vào biến CSS; React chỉ ghi khi `flipped` đổi. */
  const apply = useCallback((deg: number) => {
    const root = rootRef.current
    if (!root) return
    root.style.setProperty('--ry', `${deg}deg`)
    root.style.setProperty('--sh', `${(50 + Math.sin((deg * Math.PI) / 180) * 60).toFixed(1)}%`)
  }, [])

  // React sở hữu góc xoay ở trạng thái nghỉ. Khi đang kéo thì effect này không
  // chạy (flipped không đổi), nên không giành quyền với thao tác tay.
  useEffect(() => {
    apply(flipped ? 180 : 0)
  }, [flipped, apply])

  useEffect(() => {
    const card = cardRef.current
    const root = rootRef.current
    if (!card || !root) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
    const d = drag.current

    const onPointerDown = (event: PointerEvent) => {
      if (event.button !== 0) return
      d.down = true
      d.moved = false
      d.sx = event.clientX
      d.lastX = event.clientX
      // Bắt đầu kéo từ đúng góc đang hiện, không phải từ 0.
      d.start = flipped ? 180 : 0
      d.vx = 0
      card.setPointerCapture(event.pointerId)
    }

    const onPointerMove = (event: PointerEvent) => {
      if (!d.down) return
      const dx = event.clientX - d.sx
      if (!d.moved && Math.abs(dx) > 6) {
        d.moved = true
        card.classList.add('drag')
      }
      if (!d.moved) return
      d.vx = event.clientX - d.lastX
      d.lastX = event.clientX
      apply(d.start + dx * 0.9)
    }

    const finishDrag = (event: PointerEvent) => {
      if (!d.down) return
      d.down = false
      card.classList.remove('drag')
      if (!d.moved) return
      /*
       * Quyết định lật theo QUÃNG KÉO, không theo góc đã cộng quán tính.
       *
       * Bản gốc cộng `vx * 8` rồi làm tròn về bội số của 180°. Quán tính đủ mạnh
       * đẩy góc vượt 270° → `Math.round` nhảy tới 360° (chẵn) → KHÔNG lật. Đo
       * thật: kéo 120px, 136px, 210px đều bị "nuốt" — vuốt mạnh hơn lại không ăn,
       * trong khi vuốt nhẹ hơn thì ăn. Rất khó hiểu khi dùng.
       *
       * Ngưỡng: 1/6 chiều rộng thẻ, kẹp trong 56..96px.
       *
       * Vì sao 1/6 chứ không 1/4: thẻ rộng 460px trên desktop, 1/4 thành 115px —
       * quá xa so với phản xạ vuốt tự nhiên (đo được: người dùng quen vuốt
       * 80–110px). Thẻ hẹp trên điện thoại (~300px) thì 1/6 = 50px, hơi thấp nên
       * kẹp sàn 56px để không lật vì rung tay.
       *
       * Vuốt nhanh (`flick`) vẫn dễ lật hơn ở nửa ngưỡng, nên cảm giác nhạy.
       */
      const travelled = Math.abs(event.clientX - d.sx)
      const width = card.offsetWidth || 320
      const threshold = Math.min(96, Math.max(56, width / 6))
      const flick = Math.abs(d.vx) > 18
      const wantsFlip = travelled >= threshold || (travelled >= threshold * 0.5 && flick)

      if (wantsFlip) onFlip()
      else apply(flipped ? 180 : 0)
    }

    const onPointerEnter = (event: PointerEvent) => {
      if (event.pointerType === 'mouse' && !reduced.matches) root.style.setProperty('--tilt', '8deg')
    }
    const onPointerLeave = () => root.style.setProperty('--tilt', '0deg')

    // Bản gốc lật ở sự kiện `click`; nếu vừa kéo xong thì bỏ qua cú click đó để
    // không lật thêm lần nữa.
    const onClick = (event: MouseEvent) => {
      if (d.moved) {
        event.preventDefault()
        d.moved = false
        return
      }
      onFlip()
    }

    card.addEventListener('pointerdown', onPointerDown)
    card.addEventListener('pointermove', onPointerMove)
    card.addEventListener('pointerup', finishDrag)
    card.addEventListener('pointercancel', finishDrag)
    card.addEventListener('pointerenter', onPointerEnter)
    card.addEventListener('pointerleave', onPointerLeave)
    card.addEventListener('click', onClick)

    return () => {
      card.removeEventListener('pointerdown', onPointerDown)
      card.removeEventListener('pointermove', onPointerMove)
      card.removeEventListener('pointerup', finishDrag)
      card.removeEventListener('pointercancel', finishDrag)
      card.removeEventListener('pointerenter', onPointerEnter)
      card.removeEventListener('pointerleave', onPointerLeave)
      card.removeEventListener('click', onClick)
      // Trả biến CSS về mặc định để lần gắn lại (StrictMode) bắt đầu sạch.
      root.style.removeProperty('--tilt')
      card.classList.remove('drag')
    }
  }, [apply, flipped, onFlip])

  const hintId = `flip-hint-${word.id}`

  return (
    <div
      className="ux u052 lx-flip"
      ref={rootRef}
      data-testid="vocab-flashcard"
      data-flipped={flipped ? 'true' : 'false'}
    >
      {/*
        Dùng <div role="button">, KHÔNG dùng <button>.

        Bên trong thẻ có nút phát âm 🔊. Một <button> lồng trong <button> là HTML
        không hợp lệ — trình duyệt vẫn vẽ nhưng console báo lỗi
        "In HTML, %s cannot be a descendant of <%s>" và trình đọc màn hình đọc sai.

        Giữ nguyên hành vi bàn phím bằng `tabIndex` + `onKeyDown` (Space/Enter để
        lật); nút phát âm bên trong vẫn là <button> thật và tự dừng ở nó.
      */}
      <div
        role="button"
        tabIndex={0}
        className="u052-card lx-flip__card"
        ref={cardRef}
        aria-describedby={hintId}
        data-testid="vocab-card-face"
      >
        <span className="u052-f u052-front lx-flip__face" aria-hidden={flipped}>
          <span className="u052-tier lx-flip__pos">{POS_LABEL[word.partOfSpeech]}</span>
          <span className="lx-flip__word" data-testid="vocab-card-front">
            {word.word}
          </span>
          <span className="lx-flip__phonetic">
            {word.phonetic}
            {/*
              Nút phát âm — dùng `SpeechSynthesis` sẵn có của trình duyệt.

              Vì sao không dùng file MP3: dự án đã hết credits ElevenLabs, và 600
              từ riêng lẻ thì giọng máy đọc chấp nhận được (khác với đọc cả đoạn
              hội thoại). Không cần mạng, không gửi dữ liệu đi đâu.

              Đặt `stopPropagation` để bấm nút không lật thẻ — nút nằm trong thẻ.
            */}
            <button
              type="button"
              className="lx-flip__speak"
              data-testid="vocab-speak"
              aria-label={`Phát âm từ ${word.word}`}
              onClick={(event) => {
                event.stopPropagation()
                if (typeof window === 'undefined' || !('speechSynthesis' in window)) return
                window.speechSynthesis.cancel()
                const utterance = new SpeechSynthesisUtterance(word.word)
                utterance.lang = 'en-US'
                utterance.rate = 0.9
                window.speechSynthesis.speak(utterance)
              }}
            >
              <span aria-hidden="true">🔊</span>
            </button>
          </span>
          <span className="lx-flip__tap">Bấm hoặc nhấn Space để xem nghĩa</span>
        </span>

        <span className="u052-f u052-back lx-flip__face" aria-hidden={!flipped}>
          <span className="lx-flip__word lx-flip__word--back" data-testid="vocab-card-back">
            {word.word}
          </span>
          <span className="lx-flip__meaning">{word.meaningVi}</span>
          <span className="lx-flip__def">{word.definitionEn}</span>
          <span className="lx-flip__example">
            <em>{word.exampleEn}</em>
            <span>{word.exampleVi}</span>
          </span>
        </span>
      </div>
      <p className="visually-hidden" id={hintId}>
        Dùng Space để lật thẻ, phím 1 để đánh dấu chưa thuộc, phím 2 để đánh dấu đã thuộc.
      </p>
    </div>
  )
}


