/**
 * SINH 12 ẢNH PART 1 CÒN THIẾU (part1-09 … part1-20).
 *
 * Vì sao có script này trong repo: 12 câu Part 1 mới do team content viết cần ảnh
 * minh hoạ, và ảnh phải khớp CHÍNH XÁC hành động trong đáp án — nếu lệch, người
 * luyện nhìn ảnh sẽ chọn sai dù câu hỏi đúng. Giữ script trong repo để lần sau
 * thêm câu Part 1 thì chỉ cần thêm một mục vào `SCENES` rồi chạy lại.
 *
 * Cách dùng:  node scripts/generate-part1-images.mjs
 *
 * Phong cách: dùng lại đúng bảng màu / gradient của 8 ảnh do team artist vẽ
 * (nền tường xanh nhạt, sàn xám xanh, gỗ nâu, kính xanh) để cả bộ 20 ảnh đồng bộ.
 */
import { writeFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const OUT = join(dirname(fileURLToPath(import.meta.url)), '..', 'public', 'images')

// ── Bảng màu dùng chung ────────────────────────────────────────────────────────
const C = {
  wall: '#eef3f9',
  wall2: '#e2eaf4',
  floor: '#d8e1ec',
  floor2: '#c3cfdd',
  line: '#b9c6d6',
  wood: '#c99b60',
  wood2: '#a97c47',
  metal: '#b6c2d0',
  metal2: '#8d9bab',
  dark: '#33404f',
  white: '#ffffff',
  navy: '#1c4b87',
  green: '#2f7d5c',
  red: '#b8443c',
  skin: '#f2d3b6',
  skin2: '#e0b795',
  glass: '#dbeaf9',
  shadow: 'rgba(40,60,85,.13)',
}

const defs = () => `<defs>
  <linearGradient id="wall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${C.wall}"/><stop offset="1" stop-color="${C.wall2}"/></linearGradient>
  <linearGradient id="floor" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${C.floor}"/><stop offset="1" stop-color="${C.floor2}"/></linearGradient>
  <linearGradient id="wood" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${C.wood}"/><stop offset="1" stop-color="${C.wood2}"/></linearGradient>
  <linearGradient id="glass" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#eaf5fe"/><stop offset=".6" stop-color="${C.glass}"/><stop offset="1" stop-color="#f2f9ff"/></linearGradient>
  <linearGradient id="metal" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#cfd9e4"/><stop offset="1" stop-color="${C.metal2}"/></linearGradient>
</defs>`

/** Bối cảnh nền: tường + sàn + đường chân tường. */
const room = (floorY = 300) => `
<rect width="640" height="${floorY}" fill="url(#wall)"/>
<rect y="${floorY}" width="640" height="${420 - floorY}" fill="url(#floor)"/>
<rect y="${floorY - 10}" width="640" height="10" fill="#e8eff7"/>
<line x1="0" y1="${floorY}" x2="640" y2="${floorY}" stroke="${C.line}" stroke-width="2" stroke-opacity=".6"/>`

/** Cửa sổ có khung chữ thập. */
const window_ = (x, y, w, h) => `
<rect x="${x - 4}" y="${y - 4}" width="${w + 8}" height="${h + 8}" rx="4" fill="#f7fbff" stroke="${C.metal}" stroke-width="3"/>
<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="url(#glass)"/>
<line x1="${x + w / 2}" y1="${y}" x2="${x + w / 2}" y2="${y + h}" stroke="${C.metal}" stroke-width="3"/>
<line x1="${x}" y1="${y + h / 2}" x2="${x + w}" y2="${y + h / 2}" stroke="${C.metal}" stroke-width="3"/>`

/** Người: đầu, tóc, thân, hai tay, hai chân. `arm` đổi tư thế tay. */
const person = (x, groundY, opts = {}) => {
  const {
    shirt = C.navy,
    skin = C.skin,
    skin2 = C.skin2,
    hair = C.dark,
    scale = 1,
    armLeft = 'down',
    armRight = 'down',
    hairStyle = 'short',
  } = opts
  const s = scale
  const headR = 20 * s
  const headY = groundY - 168 * s
  const shoulderY = headY + headR + 12 * s
  const hipY = groundY - 74 * s
  const bodyW = 34 * s

  const arm = (side, pose) => {
    const sx = x + side * (bodyW / 2 + 4 * s)
    const sy = shoulderY + 8 * s
    const map = {
      down: [sx + side * 4 * s, sy + 62 * s],
      up: [sx + side * 10 * s, sy - 32 * s],
      forward: [sx + side * 30 * s, sy + 34 * s],
      bend: [sx + side * 24 * s, sy + 18 * s],
    }
    const [ex, ey] = map[pose] ?? map.down
    return `<path d="M${sx} ${sy} L${ex} ${ey}" stroke="${shirt}" stroke-width="${11 * s}" stroke-linecap="round" fill="none"/>
      <circle cx="${ex}" cy="${ey}" r="${6 * s}" fill="${skin}"/>`
  }

  const hairPath =
    hairStyle === 'bun'
      ? `<path d="M${x - headR} ${headY - 2} a${headR} ${headR} 0 0 1 ${headR * 2} 0 q0 ${-headR * 0.9} ${-headR} ${-headR * 0.95} q${-headR} 0.05 ${-headR} ${headR * 0.95} Z" fill="${hair}"/>
         <circle cx="${x + headR * 0.75}" cy="${headY - headR * 0.95}" r="${7 * s}" fill="${hair}"/>`
      : `<path d="M${x - headR} ${headY} a${headR} ${headR} 0 0 1 ${headR * 2} 0 q0 ${-headR * 0.85} ${-headR} ${-headR * 0.9} q${-headR} 0.05 ${-headR} ${headR * 0.9} Z" fill="${hair}"/>`

  return `<g>
    <ellipse cx="${x}" cy="${groundY + 2}" rx="${26 * s}" ry="${6 * s}" fill="${C.shadow}"/>
    <path d="M${x - 13 * s} ${hipY} L${x - 15 * s} ${groundY - 6 * s}" stroke="${C.dark}" stroke-width="${11 * s}" stroke-linecap="round"/>
    <path d="M${x + 13 * s} ${hipY} L${x + 15 * s} ${groundY - 6 * s}" stroke="${C.dark}" stroke-width="${11 * s}" stroke-linecap="round"/>
    <rect x="${x - bodyW / 2}" y="${shoulderY}" width="${bodyW}" height="${hipY - shoulderY}" rx="${10 * s}" fill="${shirt}"/>
    ${arm(-1, armLeft)}
    ${arm(1, armRight)}
    <circle cx="${x}" cy="${headY}" r="${headR}" fill="${skin}" stroke="${skin2}" stroke-width="1.5"/>
    ${hairPath}
  </g>`
}

/** Bàn gỗ có chân. */
const table = (x, y, w, h = 14) => `
<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="4" fill="url(#wood)" stroke="${C.wood2}" stroke-width="2"/>
<line x1="${x + 18}" y1="${y + h}" x2="${x + 18}" y2="${y + h + 62}" stroke="${C.metal2}" stroke-width="7" stroke-linecap="round"/>
<line x1="${x + w - 18}" y1="${y + h}" x2="${x + w - 18}" y2="${y + h + 62}" stroke="${C.metal2}" stroke-width="7" stroke-linecap="round"/>`

/** Bảng trắng treo tường. */
const board = (x, y, w, h) => `
<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="5" fill="#ffffff" stroke="${C.metal}" stroke-width="4"/>
<line x1="${x + 20}" y1="${y + 26}" x2="${x + w * 0.55}" y2="${y + 26}" stroke="#c9d6e4" stroke-width="6" stroke-linecap="round"/>
<line x1="${x + 20}" y1="${y + 50}" x2="${x + w * 0.42}" y2="${y + 50}" stroke="#dbe4ef" stroke-width="6" stroke-linecap="round"/>
<path d="M${x + 22} ${y + h - 34} l${w * 0.12} ${-18} l${w * 0.12} ${14} l${w * 0.12} ${-26} l${w * 0.12} ${22}"
  stroke="${C.green}" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`

/** Quầy tiếp đón / quầy cà phê. */
const counter = (x, y, w, h = 96) => `
<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="4" fill="url(#wood)" stroke="${C.wood2}" stroke-width="3"/>
<rect x="${x - 6}" y="${y - 8}" width="${w + 12}" height="14" rx="4" fill="${C.metal2}"/>
<rect x="${x + 10}" y="${y + 18}" width="${w * 0.3}" height="${h * 0.34}" rx="3" fill="#e8eef6" opacity=".55"/>`

// ── 12 cảnh ────────────────────────────────────────────────────────────────────
const scenes = []

// 09 — bắt tay (đáp án A: shaking hands)
scenes.push({
  n: 9,
  label: 'Hai người đàn ông mặc vest bắt tay nhau ở sảnh toà nhà văn phòng',
  body: `
${room(300)}
${window_(430, 60, 150, 110)}
<rect x="40" y="150" width="120" height="150" rx="4" fill="#e6edf6" stroke="${C.metal}" stroke-width="3"/>
${board(48, 160, 104, 60)}
${person(238, 372, { shirt: C.navy, armRight: 'forward', scale: 1.02 })}
${person(326, 372, { shirt: C.green, armLeft: 'forward', scale: 1.02, armRight: 'down' })}
<g stroke="${C.skin}" stroke-width="10" stroke-linecap="round"><line x1="276" y1="228" x2="300" y2="228"/></g>
<ellipse cx="288" cy="226" rx="12" ry="9" fill="${C.skin}" stroke="${C.skin2}" stroke-width="1.5"/>`,
})

// 10 — kéo vali (đáp án B: walking with a suitcase)
scenes.push({
  n: 10,
  label: 'Người đàn ông mặc vest kéo vali đi qua sảnh khách sạn, quầy lễ tân phía sau',
  body: `
${room(300)}
${counter(400, 120, 200, 120)}
<rect x="120" y="70" width="110" height="80" rx="4" fill="#f4f8fc" stroke="${C.metal}" stroke-width="3"/>
${person(250, 372, { shirt: C.dark, armRight: 'bend', scale: 1.02 })}
<g>
  <rect x="300" y="286" width="58" height="80" rx="6" fill="#3d4d60" stroke="#2b3948" stroke-width="3"/>
  <line x1="312" y1="286" x2="312" y2="258" stroke="${C.metal2}" stroke-width="4"/>
  <line x1="346" y1="286" x2="346" y2="262" stroke="${C.metal2}" stroke-width="4"/>
  <line x1="312" y1="258" x2="346" y2="262" stroke="${C.metal2}" stroke-width="4"/>
  <circle cx="329" cy="368" r="7" fill="${C.dark}"/>
</g>
<path d="M290 300 L306 300" stroke="${C.skin}" stroke-width="9" stroke-linecap="round"/>
<path d="M0 300 h640" stroke="${C.line}" stroke-width="2" stroke-opacity=".5"/>`,
})

// 11 — trả tiền ở quầy thu ngân (đáp án C)
scenes.push({
  n: 11,
  label: 'Người phụ nữ đứng ở quầy thu ngân siêu thị, tay đưa thẻ về phía máy thanh toán',
  body: `
${room(300)}
<g>
  <rect x="330" y="150" width="250" height="60" rx="4" fill="#e3ebf4" stroke="${C.metal}" stroke-width="3"/>
  <rect x="340" y="90" width="230" height="56" rx="4" fill="#dbe6f1" stroke="${C.metal}" stroke-width="3"/>
  <rect x="352" y="102" width="46" height="32" rx="3" fill="${C.red}" opacity=".7"/>
  <rect x="408" y="102" width="46" height="32" rx="3" fill="${C.green}" opacity=".7"/>
  <rect x="464" y="102" width="46" height="32" rx="3" fill="${C.navy}" opacity=".7"/>
    <rect x="520" y="102" width="40" height="32" rx="3" fill="${C.wood}" opacity=".8"/>
</g>
${counter(300, 210, 300, 100)}
<rect x="430" y="186" width="66" height="30" rx="4" fill="${C.dark}"/>
<rect x="438" y="192" width="50" height="16" rx="2" fill="#8fe3b8"/>
${person(180, 368, { shirt: C.red, armRight: 'forward', scale: 1.05 })}
<rect x="228" y="238" width="26" height="38" rx="3" fill="#e8c96b" stroke="#c09f3e" stroke-width="2"/>
<g stroke="${C.line}" stroke-width="2" opacity=".55"><line x1="0" y1="392" x2="640" y2="392"/><line x1="0" y1="340" x2="640" y2="340"/></g>`,
})

// 12 — công nhân đội mũ bảo hộ (đáp án D)
scenes.push({
  n: 12,
  label: 'Ba công nhân đội mũ bảo hộ lao động màu vàng đứng trên công trường xây dựng',
  body: `
${room(296)}
<g opacity=".85">
  <rect x="40" y="96" width="200" height="200" fill="#dfe8f2" stroke="${C.metal}" stroke-width="3"/>
  <line x1="40" y1="160" x2="240" y2="160" stroke="${C.metal}" stroke-width="2"/>
  <line x1="40" y1="224" x2="240" y2="224" stroke="${C.metal}" stroke-width="2"/>
  <line x1="140" y1="96" x2="140" y2="296" stroke="${C.metal}" stroke-width="2"/>
</g>
<g>
  <rect x="330" y="180" width="250" height="116" fill="#cdd8e4" stroke="${C.metal2}" stroke-width="3"/>
  <line x1="330" y1="214" x2="580" y2="214" stroke="${C.metal2}" stroke-width="2"/>
  <line x1="330" y1="248" x2="580" y2="248" stroke="${C.metal2}" stroke-width="2"/>
  <line x1="380" y1="180" x2="380" y2="296" stroke="${C.metal2}" stroke-width="2"/>
  <line x1="450" y1="180" x2="450" y2="296" stroke="${C.metal2}" stroke-width="2"/>
  <line x1="520" y1="180" x2="520" y2="296" stroke="${C.metal2}" stroke-width="2"/>
</g>
${person(190, 384, { shirt: '#e8a33d', scale: 1 })}
${person(300, 392, { shirt: '#e8a33d', scale: 1.06 })}
${person(410, 384, { shirt: '#e8a33d', scale: 1 })}
<g fill="#f2c94c" stroke="#c9a227" stroke-width="2">
  <path d="M168 232 a22 22 0 0 1 44 0 Z"/>
  <path d="M276 220 a24 24 0 0 1 48 0 Z"/>
  <path d="M388 232 a22 22 0 0 1 44 0 Z"/>
</g>
<g stroke="#c9a227" stroke-width="3"><line x1="160" y1="232" x2="220" y2="232"/><line x1="268" y1="220" x2="332" y2="220"/><line x1="380" y1="232" x2="440" y2="232"/></g>`,
})

// 13 — xếp hồ sơ vào tủ (đáp án A)
scenes.push({
  n: 13,
  label: 'Người đàn ông đứng bên tủ hồ sơ, tay đưa một tập tài liệu vào ngăn kéo đang mở',
  body: `
${room(300)}
${window_(430, 60, 160, 120)}
<g>
  <rect x="130" y="120" width="170" height="230" rx="5" fill="#c9d4e1" stroke="${C.metal2}" stroke-width="3"/>
  <rect x="144" y="136" width="142" height="46" rx="3" fill="#dde6f0" stroke="${C.metal2}" stroke-width="2"/>
  <rect x="144" y="192" width="142" height="46" rx="3" fill="#dde6f0" stroke="${C.metal2}" stroke-width="2"/>
  <rect x="144" y="248" width="142" height="46" rx="3" fill="#dde6f0" stroke="${C.metal2}" stroke-width="2"/>
  <rect x="176" y="152" width="52" height="9" rx="4" fill="${C.metal2}"/>
  <rect x="176" y="208" width="52" height="9" rx="4" fill="${C.metal2}"/>
</g>
<rect x="150" y="186" width="120" height="60" rx="3" fill="#eef3f9" stroke="${C.metal2}" stroke-width="3"/>
<g fill="#f2f6fb" stroke="${C.metal}" stroke-width="1.5">
  <rect x="158" y="194" width="104" height="12" rx="2"/>
  <rect x="158" y="212" width="104" height="12" rx="2"/>
  <rect x="158" y="230" width="86" height="10" rx="2"/>
</g>
${person(390, 376, { shirt: C.navy, armLeft: 'forward', scale: 1.06 })}
<rect x="300" y="212" width="66" height="74" rx="3" fill="#f7fbff" stroke="${C.metal}" stroke-width="2"/>`,
})

// 14 — dọn bàn ăn (đáp án C: setting a table)
scenes.push({
  n: 14,
  label: 'Người phụ nữ đặt đĩa và ly lên bàn ăn đã trải khăn trắng',
  body: `
${room(300)}
${window_(50, 60, 140, 110)}
<rect x="60" y="120" width="120" height="150" rx="4" fill="#e9eef5" stroke="${C.metal}" stroke-width="3"/>
<rect x="0" y="300" width="640" height="120" fill="url(#floor)"/>
${table(150, 258, 400, 18)}
<rect x="150" y="258" width="400" height="22" rx="3" fill="#f7fbff" stroke="#dbe4ef" stroke-width="2"/>
<g fill="#ffffff" stroke="${C.metal2}" stroke-width="2">
  <circle cx="270" cy="252" r="24"/>
  <circle cx="410" cy="252" r="24"/>
</g>
<g fill="none" stroke="${C.metal2}" stroke-width="2">
  <line x1="196" y1="236" x2="196" y2="258"/><line x1="204" y1="236" x2="204" y2="258"/>
  <line x1="336" y1="236" x2="336" y2="258"/><line x1="344" y1="236" x2="344" y2="258"/>
</g>
<g fill="${C.glass}" stroke="${C.metal2}" stroke-width="2">
  <path d="M236 224 h16 l-3 22 h-10 Z"/>
  <path d="M376 224 h16 l-3 22 h-10 Z"/>
</g>
${person(520, 384, { shirt: C.red, armLeft: 'forward', scale: 1.05 })}
<rect x="452" y="238" width="42" height="8" rx="3" fill="#ffffff" stroke="${C.metal2}" stroke-width="2"/>`,
})

// 15 — sửa máy photocopy (đáp án D)
scenes.push({
  n: 15,
  label: 'Người đàn ông quỳ bên máy photocopy, tay cầm tua vít sửa khay giấy bị mở',
  body: `
${room(300)}
${window_(440, 60, 150, 110)}
<g>
  <rect x="120" y="170" width="210" height="140" rx="6" fill="#d6e0ec" stroke="${C.metal2}" stroke-width="3"/>
  <rect x="134" y="184" width="120" height="40" rx="4" fill="#eef4fa" stroke="${C.metal2}" stroke-width="2"/>
  <rect x="134" y="236" width="182" height="26" rx="3" fill="#c6d2e0" stroke="${C.metal2}" stroke-width="2"/>
  <rect x="134" y="272" width="182" height="22" rx="3" fill="#b9c7d6" stroke="${C.metal2}" stroke-width="2"/>
  <circle cx="300" cy="204" r="8" fill="${C.green}"/>
</g>
<rect x="128" y="296" width="196" height="34" rx="3" fill="#cfdae7" stroke="${C.metal2}" stroke-width="3"/>
${person(410, 372, { shirt: C.green, armLeft: 'forward', scale: 1.05 })}
<line x1="352" y1="268" x2="316" y2="252" stroke="#8d9bab" stroke-width="6" stroke-linecap="round"/>
<rect x="308" y="244" width="10" height="14" rx="2" fill="#6b7886" transform="rotate(-20 313 251)"/>`,
})

// 16 — thuyết trình (đáp án B)
scenes.push({
  n: 16,
  label: 'Người phụ nữ đứng cạnh bảng trắng thuyết trình trước đồng nghiệp đang ngồi',
  body: `
${room(300)}
${window_(470, 50, 130, 96)}
${board(60, 70, 280, 180)}
${person(370, 372, { shirt: C.navy, armRight: 'up', scale: 1.05 })}
<line x1="404" y1="196" x2="330" y2="168" stroke="#546273" stroke-width="4" stroke-linecap="round"/>
<g>
  <rect x="150" y="300" width="86" height="14" rx="4" fill="url(#wood)"/>
  <rect x="186" y="314" width="14" height="46" fill="${C.metal2}"/>
  <circle cx="193" cy="286" r="17" fill="${C.skin}" stroke="${C.skin2}" stroke-width="1.5"/>
  <path d="M176 286 a17 17 0 0 1 34 0 q0 -15 -17 -16 q-17 1 -17 16 Z" fill="${C.dark}"/>
  <rect x="180" y="300" width="26" height="0" fill="none"/>
</g>
<g>
  <rect x="470" y="304" width="86" height="14" rx="4" fill="url(#wood)"/>
  <rect x="506" y="318" width="14" height="42" fill="${C.metal2}"/>
  <circle cx="513" cy="290" r="17" fill="${C.skin}" stroke="${C.skin2}" stroke-width="1.5"/>
  <path d="M496 290 a17 17 0 0 1 34 0 q0 -15 -17 -16 q-17 1 -17 16 Z" fill="#6b4a2f"/>
</g>`,
})

// 17 — chất thùng lên xe tải nhỏ (đáp án A: loading boxes into a van)
scenes.push({
  n: 17,
  label: 'Người đàn ông bê thùng các-tông đứng cạnh cửa sau xe tải nhỏ đang mở',
  body: `
${room(300)}
<g>
  <rect x="300" y="200" width="250" height="110" rx="8" fill="#ffffff" stroke="${C.metal2}" stroke-width="3"/>
  <rect x="300" y="200" width="250" height="110" rx="8" fill="#eef4fa" opacity=".6"/>
  <rect x="330" y="216" width="60" height="76" rx="3" fill="#e2ebf5" stroke="${C.metal}" stroke-width="2"/>
  <rect x="410" y="216" width="60" height="76" rx="3" fill="#e2ebf5" stroke="${C.metal}" stroke-width="2"/>
  <circle cx="345" cy="330" r="20" fill="${C.dark}"/>
  <circle cx="345" cy="330" r="9" fill="#8d9bab"/>
  <circle cx="520" cy="330" r="20" fill="${C.dark}"/>
  <circle cx="520" cy="330" r="9" fill="#8d9bab"/>
  <rect x="250" y="230" width="52" height="80" rx="6" fill="#2f4f7a"/>
</g>
<rect x="60" y="120" width="140" height="180" rx="4" fill="#e6edf6" stroke="${C.metal}" stroke-width="3"/>
<rect x="76" y="136" width="108" height="148" fill="#dbe5f0"/>
<line x1="76" y1="186" x2="184" y2="186" stroke="${C.metal}" stroke-width="2"/>
<line x1="76" y1="236" x2="184" y2="236" stroke="${C.metal}" stroke-width="2"/>
${person(320, 380, { shirt: C.green, armLeft: 'bend', armRight: 'bend', scale: 1.06 })}
<rect x="286" y="252" width="72" height="54" rx="3" fill="#c9a06a" stroke="#a67f4c" stroke-width="3"/>
<line x1="286" y1="271" x2="358" y2="271" stroke="#a67f4c" stroke-width="2"/>`,
})

// 18 — ngồi trên ghế băng ở công viên (đáp án C: sitting on benches)
scenes.push({
  n: 18,
  label: 'Hai người ngồi trên ghế băng công viên, có cây xanh và bồn hoa phía sau',
  body: `
<rect width="640" height="300" fill="url(#wall)"/>
<rect y="230" width="640" height="70" fill="#dde8d9"/>
<rect y="300" width="640" height="120" fill="url(#floor)"/>
<g fill="#9dc4a3" opacity=".85">
  <circle cx="90" cy="150" r="52"/><circle cx="150" cy="176" r="38"/>
  <circle cx="540" cy="146" r="56"/><circle cx="590" cy="178" r="40"/>
</g>
<g stroke="#7d9c81" stroke-width="6" stroke-linecap="round"><line x1="90" y1="192" x2="90" y2="238"/><line x1="540" y1="192" x2="540" y2="238"/></g>
<g>
  <rect x="200" y="276" width="240" height="16" rx="4" fill="url(#wood)"/>
  <rect x="200" y="252" width="240" height="12" rx="4" fill="url(#wood)"/>
  <rect x="216" y="292" width="12" height="42" fill="${C.metal2}"/>
  <rect x="412" y="292" width="12" height="42" fill="${C.metal2}"/>
  <rect x="204" y="252" width="10" height="40" fill="${C.metal2}"/>
  <rect x="426" y="252" width="10" height="40" fill="${C.metal2}"/>
</g>
${person(268, 300, { shirt: C.navy, scale: 0.92 })}
${person(372, 300, { shirt: C.red, scale: 0.92, hairStyle: 'bun' })}
<g fill="#e4b7c9"><circle cx="480" cy="284" r="8"/><circle cx="500" cy="290" r="6"/></g>`,
})

// 19 — mở khoá cửa (đáp án B: unlocking the door)
scenes.push({
  n: 19,
  label: 'Người đàn ông đứng trước cửa văn phòng, tay cầm chìa tra vào ổ khoá',
  body: `
${room(300)}
<g>
  <rect x="330" y="60" width="230" height="290" rx="4" fill="#c8d4e2" stroke="${C.metal2}" stroke-width="4"/>
  <rect x="348" y="78" width="194" height="120" rx="3" fill="url(#glass)" stroke="${C.metal}" stroke-width="3"/>
  <rect x="348" y="212" width="194" height="120" rx="3" fill="#d2dde9" stroke="${C.metal}" stroke-width="3"/>
  <circle cx="512" cy="272" r="9" fill="#f2c94c" stroke="#c9a227" stroke-width="2"/>
</g>
<rect x="518" y="266" width="16" height="12" rx="2" fill="#9aa7b5"/>
${person(220, 380, { shirt: C.navy, armRight: 'forward', scale: 1.06 })}
<line x1="258" y1="242" x2="512" y2="270" stroke="${C.skin}" stroke-width="10" stroke-linecap="round"/>
<circle cx="258" cy="242" r="8" fill="${C.skin}" stroke="${C.skin2}" stroke-width="1.5"/>
<line x1="500" y1="268" x2="524" y2="270" stroke="#f2c94c" stroke-width="4" stroke-linecap="round"/>`,
})

// 20 — ghi chép vào sổ (đáp án D: taking notes in a notebook)
scenes.push({
  n: 20,
  label: 'Người phụ nữ ngồi ở bàn họp, tay cầm bút viết vào quyển sổ đang mở',
  body: `
${room(300)}
${window_(430, 56, 160, 116)}
${board(50, 80, 220, 130)}
${table(120, 296, 400, 16)}
<g>
  <rect x="250" y="266" width="120" height="34" rx="3" fill="#ffffff" stroke="${C.metal}" stroke-width="2"/>
  <line x1="310" y1="266" x2="310" y2="300" stroke="#dde5ee" stroke-width="2"/>
  <g stroke="#c9d4e0" stroke-width="2">
    <line x1="262" y1="276" x2="298" y2="276"/><line x1="262" y1="284" x2="298" y2="284"/>
    <line x1="322" y1="276" x2="358" y2="276"/>
  </g>
</g>
${person(330, 380, { shirt: C.navy, armLeft: 'forward', armRight: 'forward', scale: 1.05, hairStyle: 'bun' })}
<line x1="368" y1="250" x2="340" y2="276" stroke="#54627a" stroke-width="5" stroke-linecap="round"/>
<rect x="128" y="270" width="34" height="26" rx="3" fill="#e8eef6" stroke="${C.metal}" stroke-width="2"/>`,
})

// ── Xuất file ──────────────────────────────────────────────────────────────────
for (const scene of scenes) {
  const name = `part1-${String(scene.n).padStart(2, '0')}.svg`
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 420" role="img" aria-label="${scene.label}">
${defs()}
<rect width="640" height="420" fill="#f4f8fd"/>
${scene.body}
</svg>
`
  writeFileSync(join(OUT, name), svg, 'utf8')
  const count = (svg.match(/<(rect|circle|ellipse|path|polyline|polygon|line|text)\b/g) ?? []).length
  console.log(`${name}  ${count} phần tử  ${Buffer.byteLength(svg)} B  — ${scene.label}`)
}
console.log(`\nĐã ghi ${scenes.length} file vào public/images/`)
