/**
 * CHỤP ẢNH GIAO DIỆN THẬT — chạy trên Chrome headless qua CDP.
 *
 *   npm run shots      (node scripts/screenshots.mjs)
 *
 * Đi đúng đường người dùng đi và chụp 10 màn hình vào `docs/screenshots/`.
 * Mỗi ảnh được kiểm tra ngay sau khi chụp: phải là PNG thật, > 0 byte, và
 * trang phải có nội dung nhìn thấy được (không phải khung trắng trơn).
 *
 * Ảnh lỗi không làm dừng cả bộ — script ghi nhận rồi chạy tiếp, cuối cùng
 * in bảng tổng kết và exit 1 nếu có ảnh nào không chụp được.
 */
import { mkdirSync, statSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { withBrowser } from './cdp.mjs'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const OUT_DIR = join(ROOT, 'docs', 'screenshots')
const sel = (tid) => `[data-testid="${tid}"]`
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

const shots = []

/** Chụp + xác thực: PNG thật, có byte, trang có nội dung. */
async function capture(page, screenshot, name, note) {
  const file = await screenshot(name)
  const size = statSync(file).size
  const view = await page.eval('({ w: window.innerWidth, h: window.innerHeight })')
  const png = await page.eval(`(() => {
    const el = document.querySelector('body');
    const text = (el?.innerText ?? '').trim();
    let visible = 0;
    for (const node of document.querySelectorAll('body *')) {
      const r = node.getBoundingClientRect();
      if (r.width > 4 && r.height > 4) visible += 1;
    }
    return { textLength: text.length, sample: text.slice(0, 120), visibleBoxes: visible };
  })()`)
  const record = {
    name,
    file,
    bytes: size,
    viewport: `${view.w}x${view.h}`,
    note,
    textLength: png.textLength,
    sample: png.sample.replace(/\s+/g, ' '),
    visibleBoxes: png.visibleBoxes,
    ok: size > 0 && png.textLength > 0 && png.visibleBoxes > 0,
  }
  if (size < 1024) record.ok = false
  shots.push(record)
  console.log(
    `${record.ok ? 'ok  ' : 'FAIL'} ${name}.png  ${size} byte  ${record.viewport}  chữ=${png.textLength}  hộp=${png.visibleBoxes}` +
      `  «${record.sample}»`,
  )
  return record
}

/** Đặt số câu mỗi part nếu điều khiển cho phép. */
async function setPracticeCount(page, want) {
  const info = await page.eval(`(() => {
    const el = document.querySelector(${JSON.stringify(sel('practice-count'))});
    if (!el) return { present: false };
    if (el instanceof HTMLSelectElement) return { present: true, kind: 'select', values: Array.from(el.options).map((o) => o.value) };
    return { present: true, kind: 'input', value: el.value };
  })()`)
  if (!info?.present) return 'không có ô số câu'
  if (info.kind === 'select') {
    const sizes = (info.values ?? []).map(Number).filter(Number.isFinite).sort((a, b) => a - b)
    const pick = sizes.find((n) => n >= want) ?? sizes[sizes.length - 1]
    if (!Number.isFinite(pick)) return 'select rỗng'
    await page.type(sel('practice-count'), String(pick))
    return `select=${pick}`
  }
  await page.type(sel('practice-count'), String(want))
  return `input=${want}`
}

/** Bật setting-reveal nếu công tắc đang tắt (ảnh luyện tập cần thấy phản hồi). */
async function ensureRevealOn(page) {
  const state = await page.eval(`(() => {
    const el = document.querySelector(${JSON.stringify(sel('setting-reveal'))});
    if (!el) return 'không-thấy';
    if (el instanceof HTMLInputElement && (el.type === 'checkbox' || el.type === 'radio')) return el.checked ? 'on' : 'off';
    for (const a of ['data-checked', 'aria-checked', 'aria-pressed']) {
      const v = el.getAttribute(a);
      if (v !== null) return /^(true|on|1)$/i.test(v) ? 'on' : 'off';
    }
    return 'không-đọc-được';
  })()`)
  if (state !== 'off') return state
  await page.click(sel('setting-reveal'))
  await sleep(250)
  return 'đã-bật'
}

async function skipToLast(page, limit) {
  for (let guard = 0; guard < limit + 5; guard += 1) {
    if ((await page.count(sel('submit-session'))) > 0) return true
    if ((await page.count(sel('next-question'))) === 0) return false
    await page.click(sel('next-question'))
    await sleep(140)
  }
  return (await page.count(sel('submit-session'))) > 0
}

async function shot(page, screenshot, name, note, fn) {
  try {
    await fn()
    await sleep(400)
    await capture(page, screenshot, name, note)
  } catch (err) {
    shots.push({ name, file: null, bytes: 0, note, ok: false, error: err.message })
    console.log(`FAIL ${name}.png  lỗi: ${err.message}`)
  }
}

const started = Date.now()
mkdirSync(OUT_DIR, { recursive: true })

await withBrowser(
  async ({ page, url, screenshot, browserVersion }) => {
    console.log(`Trình duyệt: ${browserVersion}`)
    console.log(`Địa chỉ: ${url}`)
    console.log(`Thư mục ảnh: ${OUT_DIR}\n`)

    await page.setViewport(1440, 960)

    // Cố định đồng hồ trong lúc chụp ảnh tài liệu.
    // Lý do: đề được xáo theo mốc thời gian tạo phiên, nên mỗi lần chạy sẽ ra một bộ
    // câu khác nhau và ảnh trong README thay đổi liên tục. Cố định thời điểm giúp
    // ảnh lặp lại được. CHỈ áp dụng cho script chụp ảnh — verify-core/verify-ui vẫn
    // chạy với đồng hồ thật để kiểm đúng hành vi thực tế.
    await page.send('Page.addScriptToEvaluateOnNewDocument', {
      source: `(() => {
        const FIXED = 1763200800000; // 2026-11-15 09:00:00 +07:00
        const RealDate = Date;
        class FrozenDate extends RealDate {
          constructor(...args) {
            if (args.length === 0) super(FIXED);
            else super(...args);
          }
          static now() { return FIXED; }
        }
        window.Date = FrozenDate;
      })();`,
    })

    await page.goto(`${url}#/`)
    await page.clearLocalStorage()

    // 01 — Trang chủ (máy tính)
    await shot(page, screenshot, '01-home', 'Trang chủ, thống kê, nút bắt đầu', async () => {
      await page.goto(`${url}#/`)
      await page.waitFor(sel('home'), 20000)
    })

    // 08 — Cài đặt (làm trước để bật reveal cho ảnh luyện tập)
    await shot(page, screenshot, '08-settings', 'Màn hình cài đặt và các công tắc', async () => {
      await page.goto(`${url}#/settings`)
      await page.waitFor(sel('settings'), 20000)
      await ensureRevealOn(page)
      await page.goto(`${url}#/settings`)
      await page.waitFor(sel('settings'), 20000)
    })

    // 02 — Chọn part
    await shot(page, screenshot, '02-practice-select', 'Chọn part và số câu rồi bắt đầu luyện', async () => {
      await page.goto(`${url}#/practice`)
      await page.waitFor(sel('part-select'), 20000)
      await setPracticeCount(page, 3)
    })

    // 03 — Đang luyện tập, đã chọn đáp án (reveal bật → thấy phản hồi + giải thích)
    let practiceTotal = 0
    await shot(page, screenshot, '03-session-practice', 'Phiên luyện tập: câu hỏi, lựa chọn, phản hồi và giải thích', async () => {
      await page.click(sel('start-practice'))
      await page.waitFor(sel('session'), 20000)
      await page.waitFor(sel('question'), 10000)
      const counter = await page.text(sel('question-counter'))
      practiceTotal = Number(/(\d+)\s*$/u.exec(counter)?.[1] ?? 0)
      await page.click(sel('choice-A'))
      await sleep(500)
    })

    // 05 — Kết quả sau khi nộp
    await shot(page, screenshot, '05-result', 'Màn hình kết quả: điểm ước lượng, đúng/sai/trống', async () => {
      const reached = await skipToLast(page, practiceTotal || 20)
      if (!reached) throw new Error('không tới được nút nộp bài ở câu cuối')
      await page.click(sel('submit-session'))
      await page.waitFor(sel('result'), 20000)
    })

    // 06 — Xem lại bài
    await shot(page, screenshot, '06-review', 'Màn hình xem lại từng câu kèm đáp án đúng', async () => {
      await page.click(sel('review-button'))
      await page.waitFor(sel('review'), 20000)
    })

    // 07 — Lịch sử (đã có bản ghi sau khi nộp)
    await shot(page, screenshot, '07-history', 'Lịch sử luyện tập có ít nhất một bản ghi', async () => {
      await page.goto(`${url}#/history`)
      await page.waitFor(sel('history'), 20000)
      await page.waitFor(sel('history-row'), 15000)
    })

    // 04 — Phiên thi thử (máy tính)
    await shot(page, screenshot, '04-session-mock', 'Phiên thi thử: đồng hồ đếm ngược, không lộ đáp án', async () => {
      await page.goto(`${url}#/`)
      await page.waitFor(sel('home'), 20000)
      await page.click(sel('home-start-mock'))
      await page.waitFor(sel('session'), 20000)
      await page.waitFor(sel('question'), 10000)
      await page.click(sel('choice-A'))
      await sleep(300)
    })

    // 09 — Trang chủ trên điện thoại
    await shot(page, screenshot, '09-home-mobile', 'Trang chủ ở khung 390x844 (điện thoại)', async () => {
      await page.setViewport(390, 844)
      await page.goto(`${url}#/`)
      await page.waitFor(sel('home'), 20000)
    })

    // 10 — Phiên làm bài trên điện thoại
    await shot(page, screenshot, '10-session-mobile', 'Phiên thi thử ở khung 390x844 (điện thoại)', async () => {
      await page.setViewport(390, 844)
      await page.goto(`${url}#/`)
      await page.waitFor(sel('home'), 20000)
      const starts = [sel('home-start-practice'), sel('home-start-mock')]
      let startedOk = false
      for (const s of starts) {
        if ((await page.count(s)) > 0) {
          await page.click(s)
          const deadline = Date.now() + 15000
          while (Date.now() < deadline) {
            if ((await page.count(sel('session'))) > 0) { startedOk = true; break }
            if ((await page.count(sel('part-select'))) > 0) {
              await page.click(sel('start-practice'))
              await sleep(600)
              continue
            }
            await sleep(200)
          }
          if (startedOk) break
        }
      }
      if (!startedOk) throw new Error('không mở được phiên làm bài trên khung điện thoại')
      await page.waitFor(sel('question'), 10000)
    })
  },
  { port: 5198, cdpPort: 9412 },
)

const failed = shots.filter((s) => !s.ok)
console.log('\n── Tổng kết ảnh chụp ──────────────────────────────────────')
for (const s of shots) {
  console.log(
    `${s.ok ? 'ok  ' : 'FAIL'} ${String(s.name).padEnd(20)} ${String(s.bytes ?? 0).padStart(8)} byte  ${s.viewport ?? '—'}  ${s.note ?? ''}`,
  )
}
console.log(`\n${shots.length - failed.length}/${shots.length} ảnh chụp thành công trong ${Date.now() - started}ms`)
if (failed.length) {
  console.log(`Ảnh lỗi: ${failed.map((f) => f.name).join(', ')}`)
  process.exit(1)
}
