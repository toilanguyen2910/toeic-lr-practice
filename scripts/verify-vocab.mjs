/**
 * KIỂM THỬ THẬT LUỒNG TỪ VỰNG TRÊN CHROME — QA độc lập.
 *
 *   node scripts/verify-vocab.mjs
 *   npm run verify:vocab
 *
 * Bộ này KHÔNG kiểm "mã có chạy không" — tsc/oxlint/vitest đã lo. Nó kiểm đúng
 * thứ mà bốn bộ kia xanh mà người dùng vẫn thấy sai:
 *
 *   0. Dữ liệu 600 từ đọc thẳng từ `src/data/vocab/*.ts`, đối chiếu từng trường.
 *   A. 12 thẻ chủ đề, nhãn tiếng Việt, 0/50 từ mỗi thẻ.
 *   B. Bấm chủ đề → màn ôn; thẻ hiện từ; lật ra nghĩa/định nghĩa/ví dụ ĐÚNG
 *      với ngân hàng (so từng chuỗi, không chỉ "có chữ").
 *   C. "Đã thuộc" → tiến độ tăng; tải lại trang tiến độ còn.
 *   D. Làm đủ 20 thẻ → màn tổng kết đúng số đã thuộc / chưa thuộc.
 *   E. Danh sách 600 dòng; lọc chủ đề 50; tìm có dấu / không dấu / chuỗi rác.
 *   F. Trắc nghiệm: 4 lựa chọn, phản hồi đúng/sai, câu tiếp.
 *   G. Dark mode: nền thật của thẻ, không mảng trắng chói.
 *   H. 375px light VÀ 375px + dark cùng lúc: không tràn ngang, thẻ vẫn tối.
 *   I. Bàn phím: Space lật, phím 2 đánh dấu, Tab đi qua được.
 *   J. Không console.error / ngoại lệ / promise bị từ chối.
 *   K. Từng thẻ trong một phiên 20 thẻ: chữ có bị cắt/tràn khung không, và nội
 *      dung từng thẻ có khớp ngân hàng không (đọc như người học thật).
 *   L. Bấm "Đã thuộc" dồn 30 lần + 20 thẻ nhịp 250ms: có lag, có mất thẻ không.
 *   M. Xoá localStorage / JSON hỏng / đã thuộc hết 600 → không sập, có ô rỗng.
 *   N. Hai tab: tab kia ghi tiến độ thì tab này có cập nhật; ghi đè có mất dữ liệu.
 *   O. `sessionSize` trong localStorage có được tôn trọng; có phát âm không.
 *   P. Tích hợp: trang chủ có lối vào, màn cài đặt có mục từ vựng.
 *   Q. Phiên vừa dọn sạch chủ đề: màn tổng kết có bị ô rỗng thay thế không.
 *   R. Đổi `?topic=` trên cùng route: tiêu đề có cập nhật không.
 *
 * Mọi khẳng định đọc từ DOM thật, localStorage thật, sự kiện bàn phím thật của
 * Chrome. Ảnh chụp lưu ở `docs/screenshots/vocab/`.
 *
 * GHI CHÚ VỀ CÁCH ĐIỀU HƯỚNG: `hardGoto` đi qua `about:blank` trước mỗi lần vào
 * route. Không có bước đó, `Page.navigate` chỉ đổi phần `#…` và React KHÔNG
 * remount component — bộ kiểm sẽ đo state cũ của màn trước và báo sai. Lỗi này
 * đã thực sự xảy ra ở lần chạy đầu và làm 6 phép kiểm cho kết quả rác.
 */
import { readFileSync, readdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { withBrowser, createReporter } from './cdp.mjs'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const DATA_DIR = join(ROOT, 'src', 'data', 'vocab')
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
const sel = (tid) => `[data-testid="${tid}"]`
const num = (value) => Number(String(value ?? '').replace(/[^\d]/g, '')) || 0

const PROGRESS_KEY = 'toeic-lr/v1/vocab-progress'
const SETTINGS_KEY = 'toeic-lr/v1/vocab-settings'

/* ── ĐỌC NGÂN HÀNG THẬT ĐỂ ĐỐI CHIẾU ──────────────────────────────────────── */

function readBank() {
  const files = readdirSync(DATA_DIR).filter(
    (f) => f.endsWith('.ts') && f !== 'index.ts' && !f.includes('test'),
  )
  const words = []
  for (const file of files) {
    const src = readFileSync(join(DATA_DIR, file), 'utf8')
    const re = /\{ id: '(v-\d+)', word: '([^']*)', phonetic: '([^']*)', partOfSpeech: '([^']*)',\s*meaningVi: '([^']*)',\s*definitionEn: '([^']*)',\s*exampleEn: '([^']*)',\s*exampleVi: '([^']*)',\s*topic: '([^']*)', difficulty: (\d)/g
    let match
    while ((match = re.exec(src))) {
      words.push({
        id: match[1],
        word: match[2],
        phonetic: match[3],
        pos: match[4],
        meaningVi: match[5],
        definitionEn: match[6],
        exampleEn: match[7],
        exampleVi: match[8],
        topic: match[9],
        difficulty: Number(match[10]),
        file,
      })
    }
  }
  const byId = new Map(words.map((w) => [w.id, w]))
  const byWord = new Map(words.map((w) => [w.word.toLowerCase(), w]))
  const topics = [...new Set(words.map((w) => w.topic))]
  return { words, byId, byWord, topics }
}

const BANK = readBank()

const TOPIC_LABELS = {
  office: 'Văn phòng & thiết bị',
  finance: 'Tài chính & kế toán',
  hr: 'Nhân sự & tuyển dụng',
  travel: 'Du lịch công tác',
  meeting: 'Họp & thuyết trình',
  commerce: 'Mua bán & đàm phán',
  shipping: 'Vận chuyển & kho',
  production: 'Sản xuất & chất lượng',
  marketing: 'Marketing & bán hàng',
  legal: 'Pháp lý & hợp đồng',
  it: 'Công nghệ thông tin',
  daily: 'Đời sống & dịch vụ',
}

/* ── BẮT LỖI TRANG ─────────────────────────────────────────────────────────── */

const ERROR_HOOK = `(() => {
  if (window.__qaErrors) return;
  window.__qaErrors = [];
  const push = (kind, text) => {
    try { window.__qaErrors.push(kind + ': ' + String(text).slice(0, 300)); } catch (_) {}
  };
  window.addEventListener('error', (e) => {
    const msg = (e && (e.message || (e.error && e.error.message))) || 'lỗi không rõ';
    push('error', msg);
  });
  window.addEventListener('unhandledrejection', (e) => {
    const r = e && e.reason;
    push('rejection', (r && (r.message || r)) || 'không rõ');
  });
  const origError = console.error.bind(console);
  console.error = (...args) => {
    push('console.error', args.map((a) => (a && a.message) || String(a)).join(' '));
    origError(...args);
  };
  window.__qaLongTasks = [];
  try {
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) window.__qaLongTasks.push(Math.round(entry.duration));
    }).observe({ entryTypes: ['longtask'] });
  } catch (_) {}
})()`

const KEYS = {
  Space: { key: ' ', code: 'Space', vk: 32, text: ' ' },
  Tab: { key: 'Tab', code: 'Tab', vk: 9, text: null },
  Digit1: { key: '1', code: 'Digit1', vk: 49, text: '1' },
  Digit2: { key: '2', code: 'Digit2', vk: 50, text: '2' },
  Enter: { key: 'Enter', code: 'Enter', vk: 13, text: '\r' },
}

async function pressKey(page, name) {
  const spec = KEYS[name]
  const shared = {
    key: spec.key,
    code: spec.code,
    windowsVirtualKeyCode: spec.vk,
    nativeVirtualKeyCode: spec.vk,
  }
  if (spec.text) {
    await page.send('Input.dispatchKeyEvent', {
      type: 'keyDown',
      ...shared,
      text: spec.text,
      unmodifiedText: spec.text,
    })
  } else {
    await page.send('Input.dispatchKeyEvent', { type: 'rawKeyDown', ...shared })
  }
  await page.send('Input.dispatchKeyEvent', { type: 'keyUp', ...shared })
  await sleep(160)
}

/** Điều hướng CỨNG: qua about:blank để React chắc chắn mount lại từ đầu. */
async function hardGoto(page, url, hash) {
  await page.goto('about:blank')
  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      await page.goto(`${url}${hash}`)
      return
    } catch (err) {
      if (attempt === 2) throw err
      await sleep(700)
    }
  }
}

async function readProgress(page) {
  const raw = await page.localStorage(PROGRESS_KEY)
  if (!raw) return {}
  try {
    return JSON.parse(raw)
  } catch {
    return { __unparsable: String(raw).slice(0, 120) }
  }
}

async function enterStudy(page, url, query = '') {
  await hardGoto(page, url, `#/vocab/study${query}`)
  await page.waitFor(sel('vocab-study'), 20000)
  await sleep(400)
  const counter = await page.text(sel('vocab-study-counter'))
  const match = /(\d+)\s*\/\s*(\d+)/u.exec(counter)
  return { total: match ? Number(match[2]) : 0, raw: counter }
}

/**
 * Đo phần CHỮ có lọt trong khung mặt thẻ không.
 *
 * Không dùng `scrollHeight > clientHeight` trên chính mặt thẻ: mặt trước có
 * pseudo-element `::after` (vòng tròn trang trí, `bottom: -140px`). Nó bị
 * `overflow: hidden` cắt nhưng vẫn làm `scrollHeight` phình 440px trong khung
 * 300px — đo kiểu đó báo "tràn" cho cả 20 thẻ trong khi ảnh chụp cho thấy chữ
 * nằm gọn. Đó là báo động giả của que đo. Ở đây cộng chiều cao THẬT của các con
 * rồi so với chiều cao trong (đã trừ padding).
 */
const TEXT_FIT_PROBE = (faceSelector) => `(() => {
  const face = document.querySelector(${JSON.stringify(faceSelector)});
  if (!face) return { found: false };
  const faceRect = face.getBoundingClientRect();
  const cs = getComputedStyle(face);
  const inner = faceRect.height - (parseFloat(cs.paddingTop) || 0) - (parseFloat(cs.paddingBottom) || 0);
  let content = 0;
  const rows = [];
  for (const el of face.children) {
    const r = el.getBoundingClientRect();
    if (r.height === 0 && r.width === 0) continue;
    const es = getComputedStyle(el);
    /*
      Chỉ tính con NẰM TRONG LUỒNG. Con position:absolute (nhãn từ loại, vệt
      hologram) không chiếm chỗ và không thể đẩy chữ ra ngoài khung — tính nó vào
      là tự tạo báo động giả thêm 24px.
    */
    if (es.position === 'absolute' || es.position === 'fixed') continue;
    content += r.height + (parseFloat(es.marginTop) || 0) + (parseFloat(es.marginBottom) || 0);
    rows.push(String(el.className).split(' ')[0] + ':' + Math.round(r.height));
  }
  return {
    found: true,
    faceHeight: Math.round(faceRect.height),
    inner: Math.round(inner),
    content: Math.round(content),
    overflowPx: Math.round(content - inner),
    overflows: content - inner > 1,
    children: rows,
    scrollHeight: face.scrollHeight,
    clientHeight: face.clientHeight,
    rectWidth: Math.round(faceRect.width * 10) / 10,
    scrolls: face.scrollHeight > face.clientHeight + 1,
  };
})()`

const BG_PROBE = (selector) => `(() => {
  const el = document.querySelector(${JSON.stringify(selector)});
  if (!el) return { found: false };
  const cs = getComputedStyle(el);
  const parse = (v) => {
    const m = /rgba?\\(([^)]+)\\)/.exec(v || '');
    if (!m) return null;
    const p = m[1].split(',').map((x) => parseFloat(x));
    return { r: p[0], g: p[1], b: p[2], a: p[3] === undefined ? 1 : p[3] };
  };
  const bg = parse(cs.backgroundColor);
  const fg = parse(cs.color);
  const lum = (c) => (c ? (0.2126 * c.r + 0.7152 * c.g + 0.0722 * c.b) / 255 : null);
  return {
    found: true,
    backgroundColor: cs.backgroundColor,
    color: cs.color,
    bgLum: lum(bg),
    fgLum: lum(fg),
    theme: document.documentElement.getAttribute('data-theme'),
  };
})()`

export async function runVerifyVocab() {
  const report = createReporter('Xác minh từ vựng trên Chrome (QA độc lập)')
  const notTested = []
  const findings = []
  const noteFinding = (severity, title, detail) => {
    findings.push({ severity, title, detail })
    report.logs.push(`    [${severity}] ${title} — ${detail}`)
  }

  report.logs.push(`Ngân hàng đọc từ mã: ${BANK.words.length} từ, ${BANK.topics.length} chủ đề`)

  await withBrowser(
    async ({ page, url, screenshot, browserVersion }) => {
      report.logs.push(`Trình duyệt: ${browserVersion}`)
      await page.send('Page.addScriptToEvaluateOnNewDocument', { source: ERROR_HOOK })
      await page.setViewport(1440, 960)

      /* ── 0. DỮ LIỆU ───────────────────────────────────────────────────── */
      await report.step('0 dữ liệu ngân hàng', async () => {
        report.equals('0.1 đủ 600 từ', BANK.words.length, 600)
        report.equals('0.2 đúng 12 chủ đề', BANK.topics.length, 12)
        const perTopic = new Map()
        for (const w of BANK.words) perTopic.set(w.topic, (perTopic.get(w.topic) ?? 0) + 1)
        const wrong = [...perTopic].filter(([, c]) => c !== 50)
        report.check('0.3 mỗi chủ đề đúng 50 từ', wrong.length === 0, JSON.stringify(wrong))

        const missingExample = BANK.words.filter(
          (w) => !w.exampleEn.toLowerCase().includes(w.word.toLowerCase()),
        )
        report.check(
          '0.4 exampleEn chứa đúng từ của nó',
          missingExample.length === 0,
          missingExample.slice(0, 6).map((w) => `${w.id}:${w.word}`).join(', ') +
            (missingExample.length ? ` (${missingExample.length} từ)` : ''),
        )

        const emptyField = []
        for (const w of BANK.words) {
          for (const key of ['word', 'phonetic', 'meaningVi', 'definitionEn', 'exampleEn', 'exampleVi']) {
            if (!w[key] || !w[key].trim()) emptyField.push(`${w.id}.${key}`)
          }
        }
        report.check('0.5 không trường nào rỗng', emptyField.length === 0, emptyField.slice(0, 6).join(', '))

        const badPhonetic = BANK.words.filter((w) => !/^\/.+\/$/.test(w.phonetic))
        report.check('0.6 phiên âm đúng dạng /…/', badPhonetic.length === 0, badPhonetic.slice(0, 5).map((w) => w.id).join(','))

        report.equals('0.7 không từ nào trùng', new Set(BANK.words.map((w) => w.word.toLowerCase())).size, 600)

        const dupMeanings = new Map()
        for (const w of BANK.words) {
          const key = w.meaningVi.toLowerCase()
          dupMeanings.set(key, (dupMeanings.get(key) ?? 0) + 1)
        }
        const repeats = [...dupMeanings].filter(([, c]) => c > 1)
        if (repeats.length) {
          const detail = repeats
            .map(([meaning]) => {
              const ids = BANK.words.filter((w) => w.meaningVi.toLowerCase() === meaning)
              return `“${meaning}” (${ids.map((w) => `${w.id}:${w.word}`).join(', ')})`
            })
            .join('; ')
          noteFinding('thấp', 'Hai từ khác nhau dùng chung một nghĩa tiếng Việt', detail)
          report.logs.push(`    nghĩa trùng: ${detail}`)
        }

        // 20 từ ngẫu nhiên đọc bằng mắt — in vào log để người đọc đối chiếu.
        let seed = 20261128
        const rand = () => {
          seed = (seed * 1103515245 + 12345) % 2147483648
          return seed / 2147483648
        }
        const pool = BANK.words.slice()
        const picked = []
        for (let i = 0; i < 20 && pool.length; i += 1) {
          picked.push(pool.splice(Math.floor(rand() * pool.length), 1)[0])
        }
        report.logs.push('    20 từ ngẫu nhiên để đọc bằng mắt:')
        for (const w of picked) {
          report.logs.push(`      ${w.id} [${w.topic}] ${w.word} ${w.phonetic} = ${w.meaningVi}`)
          report.logs.push(`          ex: ${w.exampleEn}`)
          report.logs.push(`          vi: ${w.exampleVi}`)
        }
      })

      /* ── A. MÀN CHỌN CHỦ ĐỀ ───────────────────────────────────────────── */
      await hardGoto(page, url, '#/vocab')
      await page.clearLocalStorage()
      await hardGoto(page, url, '#/vocab')
      await page.waitFor(sel('vocab-topics'), 20000)
      await sleep(400)

      await report.step('A màn chọn chủ đề', async () => {
        const exact = await page.eval(`(() => {
          const all = [...document.querySelectorAll('[data-testid^="vocab-topic-"]')];
          const cards = all.filter((el) => !el.getAttribute('data-testid').startsWith('vocab-topic-progress-'));
          return { all: all.length, cards: cards.length };
        })()`)
        report.logs.push(`    khớp tiền tố "vocab-topic-": ${exact.all}, trong đó thẻ thật: ${exact.cards}`)
        report.equals('A1 đúng 12 thẻ chủ đề (không đếm nhầm nhãn tiến độ)', exact.cards, 12)

        let labelOk = 0
        let countOk = 0
        const problems = []
        for (const topic of BANK.topics) {
          const label = (await page.text(`${sel(`vocab-topic-${topic}`)} .vocab-topic__name`)).trim()
          if (label === TOPIC_LABELS[topic]) labelOk += 1
          else problems.push(`${topic}: "${label}" ≠ "${TOPIC_LABELS[topic]}"`)
          const progress = (await page.text(sel(`vocab-topic-progress-${topic}`))).trim()
          if (/0\s*\/\s*50/.test(progress)) countOk += 1
          else problems.push(`${topic}: "${progress}" không phải 0 / 50`)
        }
        report.check('A2 tên chủ đề tiếng Việt đúng', labelOk === 12, problems.slice(0, 4).join(' | '))
        report.check('A3 mỗi thẻ hiện 0 / 50 từ', countOk === 12, problems.slice(0, 4).join(' | '))

        const due = num(await page.text(sel('vocab-summary-due')))
        const mastered = num(await page.text(sel('vocab-summary-mastered')))
        report.check('A4 tổng quan 600 cần ôn / 0 đã thuộc', due === 600 && mastered === 0, `due=${due}, mastered=${mastered}`)
        report.check('A5 khối chuỗi ngày có mặt', (await page.count('.lx-streak')) === 1, 'không thấy .lx-streak')
        await screenshot('topics-light')
      })

      /* ── B. VÀO MÀN ÔN + NỘI DUNG THẺ ─────────────────────────────────── */
      await report.step('B vào màn ôn, lật thẻ, đối chiếu nội dung', async () => {
        await page.click(`${sel('vocab-topic-office')} .vocab-topic__link`)
        await page.waitFor(sel('vocab-study'), 20000)
        await sleep(500)
        const hash = await page.eval('location.hash')
        report.check('B1 bấm thẻ chủ đề vào màn ôn', hash.includes('#/vocab/study') && hash.includes('topic=office'), `hash="${hash}"`)

        const counter = await page.text(sel('vocab-study-counter'))
        const match = /(\d+)\s*\/\s*(\d+)/u.exec(counter)
        report.check('B2 phiên có đúng 20 thẻ', match !== null && Number(match[2]) === 20, `bộ đếm "${counter}"`)

        const heading = (await page.text('h1')).trim()
        report.check('B3 tiêu đề ghi đúng chủ đề', heading === `Ôn chủ đề: ${TOPIC_LABELS.office}`, `"${heading}"`)

        const front = (await page.text(sel('vocab-card-front'))).trim()
        const bankWord = BANK.byWord.get(front.toLowerCase())
        report.check('B4 mặt trước là một từ có trong ngân hàng', Boolean(bankWord), `mặt trước "${front}"`)

        const flippedBefore = await page.attr(sel('vocab-flashcard'), 'data-flipped')
        await page.click(sel('vocab-flip-button'))
        await sleep(900)
        const flippedAfter = await page.attr(sel('vocab-flashcard'), 'data-flipped')
        report.check('B5 bấm "Xem nghĩa" thì thẻ lật', flippedBefore === 'false' && flippedAfter === 'true', `${flippedBefore} → ${flippedAfter}`)

        const meaning = (await page.text('.lx-flip__meaning')).trim()
        const def = (await page.text('.lx-flip__def')).trim()
        const example = (await page.text('.lx-flip__example em')).trim()
        const exampleVi = (await page.text('.lx-flip__example span')).trim()
        report.logs.push(`    thẻ đầu "${front}":`)
        report.logs.push(`      nghĩa: ${meaning}`)
        report.logs.push(`      định nghĩa: ${def}`)
        report.logs.push(`      ví dụ: ${example}`)
        report.logs.push(`      dịch: ${exampleVi}`)
        if (bankWord) {
          report.check('B6 nghĩa khớp ngân hàng', meaning === bankWord.meaningVi, `thẻ "${meaning}" ≠ "${bankWord.meaningVi}"`)
          report.check('B7 định nghĩa khớp ngân hàng', def === bankWord.definitionEn, `thẻ "${def}"`)
          report.check('B8 câu ví dụ khớp ngân hàng', example === bankWord.exampleEn, `thẻ "${example}"`)
          report.check('B9 bản dịch ví dụ khớp ngân hàng', exampleVi === bankWord.exampleVi, `thẻ "${exampleVi}"`)
          report.check('B10 nghĩa tiếng Việt không rỗng và không phải tiếng Anh', meaning.length > 0 && /[a-zA-Zàáảãạăâđêôơư]/u.test(meaning), `"${meaning}"`)
        }
        await screenshot('study-light')
      })

      /* ── K. MỘT PHIÊN ĐẦY ĐỦ 20 THẺ: CHỮ + NỘI DUNG ──────────────────── */
      await report.step('K ôn trọn 20 thẻ: chữ có lọt khung, nội dung có khớp', async () => {
        await hardGoto(page, url, '#/vocab')
        await page.clearLocalStorage()
        const { total } = await enterStudy(page, url, '?topic=office')
        report.check('K0 phiên office đúng 20 thẻ', total === 20, `${total} thẻ`)

        const rows = []
        let mismatch = 0
        for (let i = 0; i < 20; i += 1) {
          if ((await page.count(sel('vocab-study-done'))) > 0) break
          if ((await page.count(sel('vocab-know'))) === 0) break
          const word = (await page.text(sel('vocab-card-front'))).trim()
          const phonetic = (await page.text('.lx-flip__phonetic')).trim()
          const frontFit = await page.eval(TEXT_FIT_PROBE('.u052-front.lx-flip__face'))
          await page.click(sel('vocab-flip-button'))
          await sleep(220)
          const meaning = (await page.text('.lx-flip__meaning')).trim()
          const def = (await page.text('.lx-flip__def')).trim()
          const example = (await page.text('.lx-flip__example em')).trim()
          const backFit = await page.eval(TEXT_FIT_PROBE('.u052-back.lx-flip__face'))
          const entry = BANK.byWord.get(word.toLowerCase())
          if (!entry || entry.meaningVi !== meaning || entry.definitionEn !== def || entry.exampleEn !== example) {
            mismatch += 1
            if (mismatch <= 5) {
              report.logs.push(
                `    lệch nội dung: "${word}" → thẻ(${meaning} | ${def}) vs ngân hàng(${entry ? entry.meaningVi : 'KHÔNG CÓ'})`,
              )
            }
          }
          rows.push({ word, phonetic, meaning, def, example, frontFit, backFit })
          await page.click(sel('vocab-flip-button'))
          await sleep(120)
          await page.click(sel('vocab-know'))
          await sleep(260)
        }

        const frontCut = rows.filter((r) => r.frontFit?.overflows)
        const backCut = rows.filter((r) => r.backFit?.overflows)
        const backScroll = rows.filter((r) => r.backFit?.scrolls)
        report.logs.push(`    đo ${rows.length} thẻ:`)
        report.logs.push(`      mặt trước tràn chữ: ${frontCut.length}`)
        report.logs.push(`      mặt sau tràn chữ: ${backCut.length} (phải cuộn: ${backScroll.length})`)
        if (rows[0]?.frontFit) {
          report.logs.push(`      ví dụ thẻ "${rows[0].word}": khung ${rows[0].frontFit.inner}px, chữ ${rows[0].frontFit.content}px, dư ${-rows[0].frontFit.overflowPx}px`)
          report.logs.push(`      mặt sau thẻ đó: khung ${rows[0].backFit.inner}px, chữ ${rows[0].backFit.content}px`)
        }

        report.check('K1 mặt trước không cắt chữ', frontCut.length === 0, frontCut.slice(0, 5).map((r) => `${r.word}(+${r.frontFit.overflowPx}px)`).join(', '))
        report.check('K2 mặt sau không phải cuộn mới đọc hết', backCut.length === 0, backCut.slice(0, 5).map((r) => `${r.word}(+${r.backFit.overflowPx}px)`).join(', '))
        report.check('K3 nội dung 20 thẻ khớp ngân hàng', mismatch === 0, `${mismatch}/${rows.length} thẻ lệch`)
        report.check('K4 phiên chạy hết 20 thẻ', rows.length === 20, `chỉ đi được ${rows.length} thẻ`)

        if (backCut.length) {
          noteFinding(
            'trung bình',
            'Mặt sau thẻ tràn chữ, người học phải cuộn trong thẻ',
            `${backCut.length}/${rows.length} thẻ có nội dung cao hơn khung (${backCut.slice(0, 4).map((r) => `${r.word} +${r.backFit.overflowPx}px`).join(', ')}).`,
          )
        }
        if (backScroll.length) {
          noteFinding(
            'thấp',
            'Mặt sau thẻ phải cuộn ở một số từ',
            `${backScroll.length}/${rows.length} thẻ có scrollHeight > clientHeight (thường là do chữ dài); xem ảnh chụp để biết có thật sự bị che không.`,
          )
        }

        // Đo thẻ dài nhất của cả ngân hàng — bắt trường hợp xấu nhất, không chỉ 20 thẻ may mắn.
        const longest = [...BANK.words]
          .sort(
            (a, b) =>
              b.meaningVi.length + b.definitionEn.length + b.exampleEn.length + b.exampleVi.length -
              (a.meaningVi.length + a.definitionEn.length + a.exampleEn.length + a.exampleVi.length),
          )
          .slice(0, 5)
        const worst = longest[0]
        const future = Date.now() + 60 * 24 * 60 * 60 * 1000
        const onlyLongest = {}
        for (const w of BANK.words) {
          onlyLongest[w.id] = { box: 5, nextReviewAt: future, correct: 5, wrong: 0, lastSeenAt: future }
        }
        delete onlyLongest[worst.id]
        await page.setLocalStorage(PROGRESS_KEY, JSON.stringify(onlyLongest))
        await hardGoto(page, url, `#/vocab/study?topic=${worst.topic}`)
        await sleep(700)
        const frontWorst = (await page.text(sel('vocab-card-front'))).trim()
        if (frontWorst.toLowerCase() === worst.word.toLowerCase()) {
          const fitFront = await page.eval(TEXT_FIT_PROBE('.u052-front.lx-flip__face'))
          await page.click(sel('vocab-flip-button'))
          await sleep(500)
          const fitBack = await page.eval(TEXT_FIT_PROBE('.u052-back.lx-flip__face'))
          report.logs.push(
            `    thẻ nội dung dài nhất "${worst.word}": mặt trước ${fitFront.content}/${fitFront.inner}px, mặt sau ${fitBack.content}/${fitBack.inner}px`,
          )
          report.check('K5 thẻ nội dung dài nhất không tràn mặt trước', !fitFront.overflows, `+${fitFront.overflowPx}px`)
          report.check('K6 thẻ nội dung dài nhất không tràn mặt sau', !fitBack.overflows, `+${fitBack.overflowPx}px`)
          await screenshot('study-longest-card')
          if (fitBack.overflows) {
            noteFinding(
              'trung bình',
              'Từ có nội dung dài nhất bị tràn ở mặt sau thẻ',
              `"${worst.word}" (${worst.id}): nội dung ${fitBack.content}px trong khung ${fitBack.inner}px, dư ${fitBack.overflowPx}px — phải cuộn mới đọc hết câu ví dụ.`,
            )
          }
        } else {
          report.logs.push(`    (bỏ qua K5/K6: không dựng được phiên chỉ có "${worst.word}")`)
          notTested.push(`K5/K6: không dựng được phiên chỉ chứa từ "${worst.word}"`)
        }
        await page.clearLocalStorage()
      })

      /* ── C. TIẾN ĐỘ + TẢI LẠI ─────────────────────────────────────────── */
      await report.step('C "Đã thuộc" tăng tiến độ, tải lại vẫn còn', async () => {
        await hardGoto(page, url, '#/vocab')
        await page.clearLocalStorage()
        const session = await enterStudy(page, url, '?topic=finance')
        report.check('C0 phiên finance đúng 20 thẻ', session.total === 20, session.raw)

        const answered = (await page.text(sel('vocab-card-front'))).trim()
        await page.click(sel('vocab-know'))
        await sleep(400)
        const after = await page.text(sel('vocab-study-counter'))
        report.check('C1 trả lời xong sang thẻ kế', /Thẻ\s*2\s*\/\s*20/.test(after), `"${after}"`)
        const tally = await page.text('.vocab-study__tally')
        report.check('C2 bộ đếm phiên ghi 1 đã thuộc', /Đã thuộc\s*1/.test(tally), `"${tally}"`)

        const progress1 = await readProgress(page)
        const ids = Object.keys(progress1)
        report.check('C3 localStorage có đúng 1 bản ghi', ids.length === 1, `có ${ids.length}: ${ids.join(',')}`)
        const saved = progress1[ids[0]]
        report.check(
          'C4 bản ghi đúng hình dạng (hộp 2, hẹn 3 ngày tới)',
          Boolean(saved) && saved.box === 2 && saved.nextReviewAt > Date.now() && saved.correct === 1,
          JSON.stringify(saved),
        )
        report.logs.push(`    từ vừa đánh dấu: ${answered} (${ids[0]})`)

        await page.reload()
        await sleep(1000)
        await page.waitFor(sel('vocab-study'), 20000)
        await sleep(400)
        const reloaded = await readProgress(page)
        report.check('C5 tải lại trang: tiến độ vẫn nằm trong localStorage', Object.keys(reloaded).length === 1, `có ${Object.keys(reloaded).length} bản ghi`)

        await hardGoto(page, url, '#/vocab')
        await page.waitFor(sel('vocab-topics'), 20000)
        await sleep(500)
        const dueAfterReload = num(await page.text(sel('vocab-summary-due')))
        const topicProgress = (await page.text(sel('vocab-topic-progress-finance'))).trim()
        report.check('C6 tải lại: màn chủ đề đọc lại được, cần ôn còn 599', dueAfterReload === 599, `due=${dueAfterReload}`)
        report.check('C7 thẻ finance vẫn 0/50 (hộp 2 chưa phải đã thuộc)', /0\s*\/\s*50/.test(topicProgress), `"${topicProgress}"`)

        const s2 = await enterStudy(page, url, '?topic=finance')
        const firstWordNow = (await page.text(sel('vocab-card-front'))).trim()
        report.logs.push(`    sau tải lại, thẻ đầu phiên kế: "${firstWordNow}"`)
        report.check('C8 từ vừa thuộc không quay lại phiên kế', firstWordNow.toLowerCase() !== answered.toLowerCase(), `vẫn thấy "${answered}"`)
        report.check('C9 phiên kế vẫn 20 thẻ', s2.total === 20, s2.raw)
      })

      /* ── L. BẤM DỒN / ĐO LAG ──────────────────────────────────────────── */
      await report.step('L bấm dồn và đo lag', async () => {
        await hardGoto(page, url, '#/vocab')
        await page.clearLocalStorage()
        await enterStudy(page, url)
        await page.eval('(window.__qaLongTasks = [], true)')
        const burst = await page.eval(`(() => {
          const el = document.querySelector('[data-testid="vocab-know"]');
          if (!el) return { error: 'không thấy nút' };
          const t0 = performance.now();
          for (let i = 0; i < 30; i += 1) {
            el.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
            el.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
            el.click();
          }
          return { ms: Math.round(performance.now() - t0), alive: Boolean(document.querySelector('[data-testid="vocab-know"], [data-testid="vocab-study-done"]')) };
        })()`)
        await sleep(800)
        const burstProgress = await readProgress(page)
        const burstCount = Object.keys(burstProgress).length
        const longTasks = await page.eval('(window.__qaLongTasks || [])')
        const doneVisibleBurst = (await page.count(sel('vocab-study-done'))) === 1
        report.logs.push(
          `    30 cú bấm dồn trong ${burst.ms}ms → ${burstCount} bản ghi, màn tổng kết: ${doneVisibleBurst}, long task: ${JSON.stringify(longTasks)}`,
        )
        report.check('L1 bấm dồn 30 lần không làm sập trang', burst.alive === true, JSON.stringify(burst))
        report.check('L2 không có long task > 50ms', longTasks.length === 0, JSON.stringify(longTasks))
        report.check(
          'L3 bấm trùng một nhịp chỉ ghi 1 lần (chống bấm đúp)',
          burstCount <= 2,
          `${burstCount} bản ghi sau 30 cú bấm dồn — khoá 220ms phải nuốt phần lớn`,
        )

        // Bấm theo nhịp người thật (250ms): không được mất thẻ nào.
        await hardGoto(page, url, '#/vocab')
        await page.clearLocalStorage()
        await enterStudy(page, url)
        await page.eval('(window.__qaLongTasks = [], true)')
        const t0 = Date.now()
        let answers = 0
        for (let i = 0; i < 20; i += 1) {
          if ((await page.count(sel('vocab-study-done'))) > 0) break
          if ((await page.count(sel('vocab-know'))) === 0) break
          await page.click(sel('vocab-know'))
          answers += 1
          await sleep(250)
        }
        const pacedMs = Date.now() - t0
        const pacedProgress = await readProgress(page)
        const pacedLong = await page.eval('(window.__qaLongTasks || [])')
        report.logs.push(
          `    nhịp 250ms: trả lời ${answers} thẻ hết ${pacedMs}ms (${Math.round(pacedMs / Math.max(1, answers))}ms/thẻ), ${Object.keys(pacedProgress).length} bản ghi, long task: ${JSON.stringify(pacedLong)}`,
        )
        report.check('L4 nhịp 250ms không mất thẻ (đủ 20 bản ghi)', Object.keys(pacedProgress).length === 20, `${Object.keys(pacedProgress).length}/20`)
        report.check('L5 mỗi thẻ trung bình dưới 400ms', pacedMs / Math.max(1, answers) < 400, `${Math.round(pacedMs / Math.max(1, answers))}ms/thẻ`)

        // 200 lần: kiểm rò rỉ bộ nhớ / DOM phình.
        await hardGoto(page, url, '#/vocab')
        await page.clearLocalStorage()
        await enterStudy(page, url)
        const heapBefore = await page.eval('(performance.memory ? performance.memory.usedJSHeapSize : null)')
        const nodesBefore = await page.eval('document.querySelectorAll("*").length')
        const many = await page.eval(`(() => {
          let clicks = 0;
          for (let round = 0; round < 30; round += 1) {
            const el = document.querySelector('[data-testid="vocab-know"]') || document.querySelector('.lx-done__again');
            if (!el) break;
            el.click();
            clicks += 1;
          }
          return clicks;
        })()`)
        await sleep(400)
        const nodesAfter = await page.eval('document.querySelectorAll("*").length')
        const heapAfter = await page.eval('(performance.memory ? performance.memory.usedJSHeapSize : null)')
        report.logs.push(`    bấm liên tiếp ${many} lần (qua nhiều phiên): node ${nodesBefore} → ${nodesAfter}, heap ${heapBefore} → ${heapAfter}`)
        report.check('L6 số node DOM không phình sau nhiều lượt', Math.abs(nodesAfter - nodesBefore) < nodesBefore * 0.5 + 200, `${nodesBefore} → ${nodesAfter}`)
      })

      /* ── D. MÀN TỔNG KẾT ──────────────────────────────────────────────── */
      await report.step('D màn tổng kết đúng số', async () => {
        await hardGoto(page, url, '#/vocab')
        await page.clearLocalStorage()
        await enterStudy(page, url)
        const wantKnown = 12
        for (let i = 0; i < 20; i += 1) {
          if ((await page.count(sel('vocab-know'))) === 0) break
          await page.click(sel(i < wantKnown ? 'vocab-know' : 'vocab-dont-know'))
          await sleep(280)
        }
        await sleep(600)
        report.check('D1 hiện màn tổng kết sau 20 thẻ', (await page.count(sel('vocab-study-done'))) === 1, 'không thấy màn tổng kết')
        const doneText = (await page.text(sel('vocab-study-done'))).replace(/\s+/g, ' ').trim()
        report.logs.push(`    màn tổng kết: "${doneText}"`)
        report.check('D2 tổng kết ghi đúng 12 đã thuộc', /Đã thuộc\s*12\b/.test(doneText), doneText.slice(0, 180))
        report.check('D3 tổng kết ghi đúng 8 chưa thuộc', /chưa thuộc\s*8\b/.test(doneText), doneText.slice(0, 180))
        report.check('D4 tổng kết ghi 20 thẻ', /\b20\b/.test(doneText), doneText.slice(0, 180))
        await screenshot('study-done-light')

        const saved = await readProgress(page)
        const boxes = Object.values(saved).map((e) => e.box)
        report.logs.push(`    hộp sau phiên: ${JSON.stringify(boxes)}`)
        report.check('D5 8 từ "chưa thuộc" đều về hộp 1', boxes.filter((b) => b === 1).length === 8, JSON.stringify(boxes))

        await page.click('.lx-done__again')
        await sleep(800)
        report.check('D6 bấm "Lượt ôn mới" mở phiên mới', (await page.count(sel('vocab-study-counter'))) > 0, 'không thấy bộ đếm phiên mới')
      })

      /* ── E. DANH SÁCH + TÌM KIẾM ──────────────────────────────────────── */
      await report.step('E danh sách 600 từ, lọc, tìm kiếm', async () => {
        await hardGoto(page, url, '#/vocab')
        await page.clearLocalStorage()
        await hardGoto(page, url, '#/vocab/browse')
        await page.waitFor(sel('vocab-browse'), 20000)
        await sleep(400)
        report.check('E1 hiện đủ 600 dòng', (await page.count(sel('vocab-row'))) === 600, `thấy ${await page.count(sel('vocab-row'))} dòng`)
        const countText = (await page.text(sel('vocab-count'))).trim()
        report.check('E2 dòng đếm ghi 600 từ', /^600\s*từ/.test(countText), `"${countText}"`)

        await page.type(sel('vocab-filter-topic'), 'finance')
        await sleep(450)
        report.check('E3 lọc chủ đề finance ra đúng 50', (await page.count(sel('vocab-row'))) === 50, `thấy ${await page.count(sel('vocab-row'))} dòng`)

        await page.type(sel('vocab-filter-topic'), '')
        await sleep(300)
        await page.type(sel('vocab-search'), 'invoice')
        await sleep(450)
        const invoiceRows = await page.count(sel('vocab-row'))
        const firstRow = (await page.text(sel('vocab-row'))).replace(/\s+/g, ' ').trim()
        report.check('E4 tìm "invoice" ra kết quả', invoiceRows >= 1 && /invoice/i.test(firstRow), `${invoiceRows} dòng, đầu "${firstRow.slice(0, 80)}"`)

        await page.type(sel('vocab-search'), 'hoá đơn')
        await sleep(450)
        const vnRows = await page.count(sel('vocab-row'))
        report.check('E5 tìm "hoá đơn" (đúng chính tả trong dữ liệu) ra kết quả', vnRows >= 1, `${vnRows} dòng`)

        await page.type(sel('vocab-search'), 'hóa đơn')
        await sleep(450)
        const altRows = await page.count(sel('vocab-row'))
        await page.type(sel('vocab-search'), 'hoa don')
        await sleep(450)
        const noAccentRows = await page.count(sel('vocab-row'))
        await page.type(sel('vocab-search'), 'HOA DON')
        await sleep(450)
        const upperRows = await page.count(sel('vocab-row'))
        report.logs.push(`    "hóa đơn" → ${altRows} dòng | "hoa don" → ${noAccentRows} | "HOA DON" → ${upperRows}`)

        if (altRows === 0 || noAccentRows === 0) {
          noteFinding(
            'trung bình',
            'Tìm kiếm không chuẩn hoá tiếng Việt (không dấu / chính tả mới)',
            `"hoá đơn" ra ${vnRows} dòng, nhưng "hóa đơn" ra ${altRows} và "hoa don" ra ${noAccentRows}. Chuẩn hoá NFD + bỏ dấu (và gộp oà/oá…) là thứ người Việt gõ thật hằng ngày; thiếu nó thì ô tìm kiếm báo "không có từ nào" trong khi từ có trong ngân hàng.`,
          )
        }
        report.check('E6 tìm không dấu ra kết quả', noAccentRows >= 1, `"hoa don" → ${noAccentRows} dòng`)
        report.check('E7 tìm chữ HOA ra kết quả', upperRows >= 1, `"HOA DON" → ${upperRows} dòng`)

        await page.type(sel('vocab-search'), 'xyzabc')
        await sleep(600)
        const junkRows = await page.count(sel('vocab-row'))
        const noResults = await page.count(sel('vocab-no-results'))
        const countJunk = (await page.text(sel('vocab-count'))).trim()
        report.check('E8 chuỗi rác → 0 dòng', junkRows === 0, `${junkRows} dòng`)
        report.check('E9 chuỗi rác → hiện trạng thái rỗng', noResults === 1, `thấy ${noResults} ô rỗng`)
        report.check('E10 dòng đếm ghi 0 từ', /^0\s*từ/.test(countJunk), `"${countJunk}"`)
        report.check('E11 có nút xoá bộ lọc', (await page.count('.lx-noresults__reset')) === 1, 'không thấy nút')
        const qaErrors = await page.eval('(window.__qaErrors || [])')
        report.check('E12 tìm chuỗi rác không sinh lỗi console', qaErrors.length === 0, qaErrors.slice(0, 4).join(' | '))
        await screenshot('browse-no-results')
        await page.click('.lx-noresults__reset')
        await sleep(500)
        report.check('E13 "Xoá tất cả bộ lọc" trả lại 600 dòng', (await page.count(sel('vocab-row'))) === 600, `thấy ${await page.count(sel('vocab-row'))} dòng`)
      })

      /* ── F. TRẮC NGHIỆM ───────────────────────────────────────────────── */
      await report.step('F trắc nghiệm 4 lựa chọn và phản hồi', async () => {
        await hardGoto(page, url, '#/vocab')
        await page.clearLocalStorage()
        await hardGoto(page, url, '#/vocab/quiz')
        await page.waitFor(sel('vocab-quiz'), 20000)
        await sleep(450)
        report.check('F1 có đúng 4 lựa chọn', (await page.count('[data-testid^="vocab-quiz-choice-"]')) === 4, `thấy ${await page.count('[data-testid^="vocab-quiz-choice-"]')}`)
        const prompt = (await page.text(sel('vocab-quiz-prompt'))).replace(/\s+/g, ' ').trim()
        report.logs.push(`    câu hỏi: "${prompt}"`)
        const texts = await page.eval(
          `[...document.querySelectorAll('[data-testid^="vocab-quiz-choice-"]')].map((el) => el.textContent.replace(/^\\d+/, '').trim())`,
        )
        report.logs.push(`    4 lựa chọn: ${JSON.stringify(texts)}`)
        report.check('F2 bốn lựa chọn không trùng chữ', new Set(texts).size === 4, JSON.stringify(texts))
        const meanings = new Set(BANK.words.map((w) => w.meaningVi.toLowerCase()))
        const fromBank = texts.filter((t) => meanings.has(t.toLowerCase())).length
        report.check('F3 cả 4 lựa chọn đều là nghĩa có trong ngân hàng', fromBank === 4, `${fromBank}/4 khớp: ${JSON.stringify(texts)}`)

        await page.click(sel('vocab-quiz-choice-0'))
        await sleep(500)
        report.check('F4 bấm lựa chọn thì có phản hồi', (await page.count(sel('vocab-quiz-feedback'))) === 1, `thấy ${await page.count(sel('vocab-quiz-feedback'))}`)
        const feedbackText = (await page.text(sel('vocab-quiz-feedback'))).replace(/\s+/g, ' ').trim()
        report.check('F5 phản hồi đọc được, nêu đáp án', /(Chính xác|Chưa đúng)/.test(feedbackText), feedbackText.slice(0, 140))
        report.check('F6 đánh dấu đúng đáp án đúng', (await page.count('.vocab-quiz__choice.is-right')) === 1, `thấy ${await page.count('.vocab-quiz__choice.is-right')}`)
        const ringLabel = await page.attr('.lx-ring', 'aria-label')
        report.logs.push(`    nhãn vòng tiến độ sau khi trả lời: "${ringLabel}"`)
        await screenshot('quiz-light')
        await page.click(sel('vocab-quiz-next'))
        await sleep(450)
        report.check('F7 "Câu tiếp" sang câu sau', (await page.count(sel('vocab-quiz-feedback'))) === 0, 'phản hồi vẫn còn')
      })

      /* ── I. BÀN PHÍM ──────────────────────────────────────────────────── */
      await report.step('I bàn phím', async () => {
        await hardGoto(page, url, '#/vocab')
        await page.clearLocalStorage()
        await enterStudy(page, url)
        await page.send('Page.bringToFront')
        await page.eval('(document.activeElement && document.activeElement.blur(), true)')
        await sleep(200)
        const before = await page.attr(sel('vocab-flashcard'), 'data-flipped')
        await pressKey(page, 'Space')
        const after = await page.attr(sel('vocab-flashcard'), 'data-flipped')
        report.check('I1 Space lật thẻ', before === 'false' && after === 'true', `${before} → ${after}`)
        await pressKey(page, 'Digit2')
        await sleep(350)
        report.check('I2 phím 2 đánh dấu đã thuộc và sang thẻ kế', /Thẻ\s*2\s*\//.test(await page.text(sel('vocab-study-counter'))), `"${await page.text(sel('vocab-study-counter'))}"`)

        // Space khi đang đứng ở nút khác KHÔNG được cướp: nó phải bấm nút đó.
        await page.eval(`(() => { const b = document.querySelector('[data-testid="vocab-dont-know"]'); b.focus(); return document.activeElement.getAttribute('data-testid'); })()`)
        await pressKey(page, 'Space')
        await sleep(400)
        report.check('I3 Space trên nút "Chưa thuộc" kích hoạt nút đó', /Thẻ\s*3\s*\//.test(await page.text(sel('vocab-study-counter'))), `"${await page.text(sel('vocab-study-counter'))}"`)

        await page.eval('(document.body.focus(), true)')
        const visited = []
        for (let i = 0; i < 10; i += 1) {
          await pressKey(page, 'Tab')
          visited.push(
            await page.eval(
              `(() => { const a = document.activeElement; return a ? (a.tagName.toLowerCase() + ':' + (a.getAttribute('data-testid') || a.textContent.trim().slice(0, 16))) : 'null'; })()`,
            ),
          )
        }
        report.logs.push(`    Tab: ${visited.join(' → ')}`)
        report.check('I4 Tab đi qua được ≥5 phần tử', new Set(visited).size >= 5, visited.join(' → '))
        report.check('I5 Tab có đi qua nút trong màn ôn', visited.some((v) => v.includes('vocab-')), visited.join(' → '))

        // Kéo ngang để lật — đường tương tác chính trên điện thoại, không nút nào thay được.
        await hardGoto(page, url, '#/vocab/study')
        await page.waitFor(sel('vocab-study'), 20000)
        await sleep(600)

        /** Kéo thẻ bằng PointerEvent; trả về data-flipped sau khi thả. */
        const dragCard = async (steps, stepPx) => {
          /*
           * Đọc `data-flipped` TRƯỚC và SAU trong CÙNG một lượt `page.eval`.
           *
           * Bản cũ đọc bằng hai lệnh CDP riêng cách nhau 900ms. Giữa hai lệnh đó
           * React kịp render lại, nên `before` đọc muộn có thể đã là giá trị mới
           * và phép so `before !== after` báo "không lật" dù thẻ đã lật thật.
           * Đã xác minh bằng tay: bắn 5 bước × 24px thì `data-flipped` đổi
           * false → true và thẻ mang class `drag`.
           */
          return page.eval(`(async () => {
            const root = document.querySelector('[data-testid="vocab-flashcard"]');
            const card = document.querySelector('[data-testid="vocab-card-face"]');
            if (!root || !card) return { before: null, after: null, flipped: false };
            const before = root.getAttribute('data-flipped');
            const r = card.getBoundingClientRect();
            const y = r.top + r.height / 2;
            const x0 = r.left + r.width / 2;
            const opts = (x) => ({ bubbles: true, cancelable: true, clientX: x, clientY: y, pointerId: 1, pointerType: 'touch', button: 0, isPrimary: true });
            card.dispatchEvent(new PointerEvent('pointerdown', opts(x0)));
            for (let i = 1; i <= ${steps}; i += 1) {
              card.dispatchEvent(new PointerEvent('pointermove', opts(x0 + i * ${stepPx})));
            }
            card.dispatchEvent(new PointerEvent('pointerup', opts(x0 + ${steps} * ${stepPx})));
            await new Promise((r2) => setTimeout(r2, 950));
            const after = root.getAttribute('data-flipped');
            return { before, after, flipped: before !== after };
          })()`)
        }

        const slowDrag = await dragCard(14, 10) // 140px, mỗi bước 10px
        report.logs.push(`    kéo chậm 140px (14 bước × 10px): ${slowDrag.before} → ${slowDrag.after}`)
        report.check('I6 kéo ngang chậm để lật thẻ', slowDrag.flipped, `vẫn ${slowDrag.after}`)

        // Đưa thẻ về mặt trước rồi mới thử vuốt nhanh, để phép kiểm không phụ thuộc trạng thái trước.
        await hardGoto(page, url, '#/vocab/study')
        await page.waitFor(sel('vocab-study'), 20000)
        await sleep(600)
        const fastDrag = await dragCard(3, 70) // 210px trong 3 bước → quán tính lớn
        report.logs.push(`    kéo nhanh 210px (3 bước × 70px), từ mặt trước: ${fastDrag.before} → ${fastDrag.after}`)
        report.check('I7 kéo ngang nhanh cũng lật thẻ', fastDrag.flipped, `vẫn ${fastDrag.after}`)

        if (!fastDrag.flipped) {
          report.logs.push('    (một mức tốc độ không lật — xem bảng quét bên dưới để biết quy luật)')
        }

        // Quét dải tốc độ vuốt thật để biết hỏng ở đâu, không chỉ một điểm.
        const sweep = []
        for (const [steps, stepPx] of [[10, 8], [8, 12], [6, 18], [5, 24], [4, 34], [3, 50], [3, 70], [2, 100]]) {
          await hardGoto(page, url, '#/vocab/study')
          await page.waitFor(sel('vocab-study'), 20000)
          await sleep(450)
          const result = await dragCard(steps, stepPx)
          sweep.push(`vuốt ${steps * stepPx}px/${steps} bước (vx≈${stepPx}): ${result.flipped ? 'lật' : 'KHÔNG lật'}`)
        }
        report.logs.push('    quét dải tốc độ vuốt:')
        for (const line of sweep) report.logs.push(`      ${line}`)
        const failedSwipes = sweep.filter((line) => line.includes('KHÔNG')).length
        report.check('I8 mọi tốc độ vuốt hợp lý đều lật được thẻ', failedSwipes === 0, `${failedSwipes}/${sweep.length} mức tốc độ không lật`)
        if (failedSwipes > 0) {
          noteFinding(
            'trung bình',
            `Vuốt thẻ bị "nuốt" ở ${failedSwipes}/${sweep.length} mức tốc độ`,
            `Quét vuốt từ chậm tới nhanh trên cùng một thẻ: ${sweep.join('; ')}. Công thức thả trong \`LucianFlipCard.finishDrag\` là \`start + dx*0.9 + vx*8\` rồi làm tròn về bội số 180°; quán tính vx*8 đẩy tổng vượt 540° thì kết quả rơi vào bội số 360° — mặt cũ — và cú vuốt bị bỏ. Vuốt chậm 80–108px lật đúng, vuốt nhanh 120px và 136px thì không. Người dùng không thể đoán mức nào ăn, nên trên điện thoại thẻ có lúc "đứng im".`,
          )
        }
        await page.clearLocalStorage()
      })

      /* ── G. DARK MODE ─────────────────────────────────────────────────── */
      await report.step('G dark mode', async () => {
        await hardGoto(page, url, '#/vocab')
        await page.waitFor(sel('vocab-topics'), 20000)
        await page.eval('(document.documentElement.setAttribute("data-theme", "dark"), true)')
        await sleep(500)
        const probes = {
          body: await page.eval(BG_PROBE('body')),
          topicCard: await page.eval(BG_PROBE(sel('vocab-topic-office'))),
          topicIcon: await page.eval(BG_PROBE('.vocab-topic__icon')),
          streakCard: await page.eval(BG_PROBE('.lx-streak')),
          progressBar: await page.eval(BG_PROBE('.vocab-topic__bar')),
        }
        for (const [name, info] of Object.entries(probes)) {
          report.logs.push(`    dark ${name}: nền ${info.backgroundColor} (lum ${info.bgLum === null ? '?' : info.bgLum.toFixed(2)}), chữ ${info.color}`)
        }
        const bright = Object.entries(probes).filter(([, i]) => i.found && i.bgLum !== null && i.bgLum > 0.6)
        report.check('G1 dark: không khối nào nền sáng chói', bright.length === 0, bright.map(([n, i]) => `${n}=${i.backgroundColor}`).join(', '))
        report.check('G2 data-theme thật sự là dark', (await page.eval('document.documentElement.getAttribute("data-theme")')) === 'dark', 'không đặt được')
        await screenshot('topics-dark')

        await hardGoto(page, url, '#/vocab/study')
        await page.waitFor(sel('vocab-study'), 20000)
        await page.eval('(document.documentElement.setAttribute("data-theme", "dark"), true)')
        await sleep(400)
        await page.click(sel('vocab-flip-button'))
        await sleep(900)
        const back = await page.eval(BG_PROBE('.u052-back.lx-flip__face'))
        const exampleBox = await page.eval(BG_PROBE('.lx-flip__example'))
        report.logs.push(`    dark mặt sau: nền ${back.backgroundColor} chữ ${back.color}; khối ví dụ ${exampleBox.backgroundColor}`)
        report.check('G3 dark: mặt sau thẻ không phải nền trắng', back.found && (back.bgLum ?? 1) < 0.6, `nền ${back.backgroundColor}`)
        report.check('G4 dark: khối ví dụ cũng tối', exampleBox.found && (exampleBox.bgLum ?? 1) < 0.6, `nền ${exampleBox.backgroundColor}`)
        const contrast = back.bgLum !== null && back.fgLum !== null ? Math.abs(back.fgLum - back.bgLum) : 0
        report.check('G5 dark: chênh sáng chữ/nền > 0.35', contrast > 0.35, `chênh ${contrast.toFixed(2)}`)
        await screenshot('study-dark')

        await hardGoto(page, url, '#/vocab/browse')
        await page.waitFor(sel('vocab-browse'), 20000)
        await page.eval('(document.documentElement.setAttribute("data-theme", "dark"), true)')
        await sleep(500)
        const row = await page.eval(BG_PROBE(sel('vocab-row')))
        const table = await page.eval(BG_PROBE('.vocab-table'))
        report.logs.push(`    dark bảng: thân bảng ${table.backgroundColor}, dòng ${row.backgroundColor}`)
        report.check('G6 dark: bảng từ không phải nền trắng', (row.bgLum ?? 1) < 0.6 && (table.bgLum ?? 1) < 0.6, `bảng ${table.backgroundColor}, dòng ${row.backgroundColor}`)
        await screenshot('browse-dark')
        await page.eval('(document.documentElement.setAttribute("data-theme", "light"), true)')
        await sleep(250)
      })

      /* ── H. 375PX, CẢ HAI THEME ───────────────────────────────────────── */
      await report.step('H 375px: light và dark cùng lúc', async () => {
        await page.setViewport(375, 812)
        await sleep(300)
        const routes = ['#/vocab', '#/vocab/study', '#/vocab/browse', '#/vocab/quiz']
        for (const theme of ['light', 'dark']) {
          for (const hash of routes) {
            await hardGoto(page, url, hash)
            await page.eval(`(document.documentElement.setAttribute("data-theme", "${theme}"), true)`)
            await sleep(700)
            await page.eval(`(document.documentElement.setAttribute("data-theme", "${theme}"), true)`)
            await sleep(200)
            const metrics = await page.eval(`(() => {
              let worst = null;
              for (const el of document.querySelectorAll('body *')) {
                const r = el.getBoundingClientRect();
                if (!worst || r.right > worst.right) {
                  worst = { right: Math.round(r.right * 10) / 10, tag: el.tagName.toLowerCase(), testid: el.getAttribute('data-testid'), cls: typeof el.className === 'string' ? el.className.slice(0, 50) : null };
                }
              }
              return {
                scrollWidth: document.documentElement.scrollWidth,
                bodyScrollWidth: document.body.scrollWidth,
                clientWidth: document.documentElement.clientWidth,
                worst,
                theme: document.documentElement.getAttribute('data-theme'),
              };
            })()`)
            report.check(
              `H ${theme} ${hash} không tràn ngang`,
              metrics.scrollWidth <= 376,
              `scrollWidth=${metrics.scrollWidth} body=${metrics.bodyScrollWidth} client=${metrics.clientWidth} xa nhất=${JSON.stringify(metrics.worst)}`,
            )
            if (theme === 'dark') {
              const bodyBg = await page.eval(BG_PROBE('body'))
              report.check(`H ${hash} 375px + dark: nền trang vẫn tối`, (bodyBg.bgLum ?? 1) < 0.6, `nền ${bodyBg.backgroundColor}`)
            }
            if (hash === '#/vocab/study') {
              await page.click(sel('vocab-flip-button'))
              await sleep(800)
              const backSmall = await page.eval(BG_PROBE('.u052-back.lx-flip__face'))
              const cardSmall = await page.eval(TEXT_FIT_PROBE('.u052-card.lx-flip__card'))
              const backFit = await page.eval(TEXT_FIT_PROBE('.u052-back.lx-flip__face'))
              report.logs.push(`    375px ${theme} study: thẻ ${cardSmall.rectWidth}px, chữ mặt sau ${backFit.content}/${backFit.inner}px, nền ${backSmall.backgroundColor}`)
              report.check(`H 375px + ${theme}: thẻ không rộng quá khung`, cardSmall.rectWidth <= 375, `thẻ ${cardSmall.rectWidth}px`)
              if (theme === 'dark') {
                report.check('H9 375px + dark: mặt sau thẻ vẫn tối', (backSmall.bgLum ?? 1) < 0.6, `nền ${backSmall.backgroundColor}`)
              }
              if (backFit.overflows) {
                report.logs.push(`    cảnh báo: ở 375px mặt sau thẻ tràn ${backFit.overflowPx}px ("${(await page.text('.lx-flip__meaning')).trim()}")`)
              }
              await screenshot(`study-375-${theme}`)
            }
          }
        }
        await page.eval('(document.documentElement.setAttribute("data-theme", "light"), true)')
        await page.setViewport(1440, 960)
        await sleep(250)
      })

      /* ── M. XOÁ / DỮ LIỆU HỎNG / HẾT TỪ ───────────────────────────────── */
      await report.step('M xoá localStorage, dữ liệu hỏng, hết từ', async () => {
        await hardGoto(page, url, '#/vocab')
        await page.eval('(window.__qaErrors = [], true)')
        await page.clearLocalStorage()
        for (const hash of ['#/vocab', '#/vocab/study', '#/vocab/browse', '#/vocab/quiz']) {
          await hardGoto(page, url, hash)
          await sleep(650)
          const alive = await page.eval('Boolean(document.querySelector("main")) && document.body.textContent.length > 40')
          report.check(`M ${hash} không trắng trang sau khi xoá localStorage`, alive, 'trang rỗng')
        }
        report.check('M1 xoá localStorage không sinh lỗi console', (await page.eval('(window.__qaErrors || []).length')) === 0, (await page.eval('(window.__qaErrors || [])')).slice(0, 4).join(' | '))

        await page.setLocalStorage(PROGRESS_KEY, '{not json')
        await hardGoto(page, url, '#/vocab')
        await sleep(700)
        report.check('M2 JSON rác không làm sập màn chủ đề', (await page.count(sel('vocab-topics'))) === 1, 'không render được')
        report.check('M3 JSON rác không sinh lỗi console', (await page.eval('(window.__qaErrors || []).length')) === 0, (await page.eval('(window.__qaErrors || [])')).slice(0, 4).join(' | '))
        report.check('M4 JSON rác → coi như chưa học gì (due = 600)', num(await page.text(sel('vocab-summary-due'))) === 600, `due=${num(await page.text(sel('vocab-summary-due')))}`)

        const future = Date.now() + 60 * 24 * 60 * 60 * 1000
        const allMastered = {}
        for (const word of BANK.words) {
          allMastered[word.id] = { box: 5, nextReviewAt: future, correct: 5, wrong: 0, lastSeenAt: Date.now() }
        }
        await page.setLocalStorage(PROGRESS_KEY, JSON.stringify(allMastered))
        await hardGoto(page, url, '#/vocab/study')
        await sleep(800)
        report.check('M5 đã thuộc hết 600 → màn ôn hiện trạng thái rỗng', (await page.count(sel('vocab-study-empty'))) === 1, `ô rỗng=${await page.count(sel('vocab-study-empty'))}`)
        report.check('M6 trạng thái rỗng không bày nút trả lời', (await page.count(sel('vocab-know'))) === 0, `còn ${await page.count(sel('vocab-know'))} nút`)
        const emptyHeading = (await page.text('h1')).trim()
        report.logs.push(`    tiêu đề trạng thái rỗng: "${emptyHeading}"`)
        await screenshot('study-empty-light')
        await page.eval('(document.documentElement.setAttribute("data-theme", "dark"), true)')
        await sleep(400)
        await screenshot('study-empty-dark')

        await hardGoto(page, url, '#/vocab')
        await sleep(700)
        report.check('M7 chủ đề: 600 đã thuộc, 0 cần ôn', num(await page.text(sel('vocab-summary-mastered'))) === 600 && num(await page.text(sel('vocab-summary-due'))) === 0, `mastered=${num(await page.text(sel('vocab-summary-mastered')))}, due=${num(await page.text(sel('vocab-summary-due')))}`)
        await page.clearLocalStorage()
        await page.eval('(document.documentElement.setAttribute("data-theme", "light"), true)')
      })

      /* ── N. HAI TAB ───────────────────────────────────────────────────── */
      await report.step('N hai tab', async () => {
        await hardGoto(page, url, '#/vocab')
        await page.clearLocalStorage()
        await hardGoto(page, url, '#/vocab')
        await sleep(700)
        const beforeDue = num(await page.text(sel('vocab-summary-due')))
        const beforeMastered = num(await page.text(sel('vocab-summary-mastered')))

        const externalWrite = { 'v-0001': { box: 5, nextReviewAt: Date.now() + 1000, correct: 5, wrong: 0, lastSeenAt: Date.now() } }
        await page.setLocalStorage(PROGRESS_KEY, JSON.stringify(externalWrite))
        await page.eval(`(() => {
          window.dispatchEvent(new StorageEvent('storage', {
            key: '${PROGRESS_KEY}',
            newValue: ${JSON.stringify(JSON.stringify(externalWrite))},
            oldValue: null,
            url: location.href,
            storageArea: localStorage,
          }));
          return true;
        })()`)
        await sleep(800)
        const afterDue = num(await page.text(sel('vocab-summary-due')))
        const afterMastered = num(await page.text(sel('vocab-summary-mastered')))
        report.logs.push(`    tab khác ghi 1 từ hộp 5: trước due=${beforeDue}/mastered=${beforeMastered} → sau due=${afterDue}/mastered=${afterMastered}`)
        report.check('N1 tab đang mở tự cập nhật khi tab khác ghi tiến độ', afterDue !== beforeDue || afterMastered !== beforeMastered, `due ${beforeDue}→${afterDue}, mastered ${beforeMastered}→${afterMastered}`)
        if (afterDue === beforeDue && afterMastered === beforeMastered) {
          noteFinding(
            'trung bình',
            'Không đồng bộ giữa hai tab (không nghe sự kiện storage)',
            `Tab B ghi tiến độ thì tab A vẫn hiện số cũ (due ${beforeDue} → ${afterDue}, mastered ${beforeMastered} → ${afterMastered}). Người mở hai tab phải tải lại mới thấy tiến độ mới; tệ hơn, xem N2.`,
          )
        }

        // Mất mát thật: tab mở trước giữ state cũ rồi ghi đè toàn bộ bản đồ.
        await hardGoto(page, url, '#/vocab')
        await page.clearLocalStorage()
        await hardGoto(page, url, '#/vocab/study')
        await page.waitFor(sel('vocab-study'), 20000)
        await sleep(500)
        const tab1Write = { 'v-0600': { box: 4, nextReviewAt: Date.now() + 5000, correct: 4, wrong: 0, lastSeenAt: Date.now() } }
        await page.setLocalStorage(PROGRESS_KEY, JSON.stringify(tab1Write))
        await page.click(sel('vocab-know'))
        await sleep(600)
        const merged = await readProgress(page)
        const lost = !('v-0600' in merged)
        report.logs.push(`    sau khi tab kia ghi v-0600 rồi tab này bấm "Đã thuộc": khoá còn lại = ${Object.keys(merged).join(',')}`)
        report.check('N2 ghi tiến độ không xoá mất bản ghi của tab khác', !lost, `còn: ${Object.keys(merged).join(',')}`)
        if (lost) {
          noteFinding(
            'cao',
            'Hai tab cùng mở: tab ghi sau xoá mất tiến độ của tab ghi trước',
            `Tab B ghi một từ (v-0600) vào localStorage; tab A (mở từ trước, giữ bản đồ tiến độ cũ trong state) bấm "Đã thuộc" rồi ghi lại TOÀN BỘ bản đồ — bản ghi v-0600 biến mất không cảnh báo. Mất dữ liệu thật, không phải chỉ chậm cập nhật.`,
          )
        }
      })

      /* ── O. CÀI ĐẶT / PHÁT ÂM ─────────────────────────────────────────── */
      await report.step('O cài đặt và phát âm', async () => {
        await hardGoto(page, url, '#/vocab')
        await page.clearLocalStorage()
        await page.setLocalStorage(SETTINGS_KEY, JSON.stringify({ sessionSize: 5, defaultMode: 'flashcard', speechEnabled: true }))
        const session = await enterStudy(page, url)
        report.logs.push(`    localStorage sessionSize=5 → phiên thật ${session.total} thẻ ("${session.raw}")`)
        report.check('O1 sessionSize=5 được tôn trọng', session.total === 5, `phiên ${session.total} thẻ`)
        if (session.total === 20) {
          noteFinding(
            'trung bình',
            'Cài đặt số từ mỗi lượt bị bỏ qua hoàn toàn',
            `localStorage có sessionSize=5 nhưng phiên vẫn 20 thẻ: ba màn hình đều dùng hằng DEFAULT_VOCAB_SETTINGS.sessionSize, không nơi nào gọi loadVocabSettings(). saveVocabSettings/loadVocabSettings có trong engine nhưng không có UI nào dùng — cài đặt là mã chết.`,
          )
        }

        const speech = await page.eval(
          `document.querySelectorAll('[data-testid*="speech"], [data-testid*="pronounce"], button[aria-label*="phát âm"], button[aria-label*="Phát âm"], .lx-flip__speak').length`,
        )
        report.logs.push(`    nút phát âm trong màn ôn: ${speech}`)
        report.check('O2 có nút phát âm (SpeechSynthesis)', speech > 0, 'không thấy nút nào')
        if (speech === 0) {
          noteFinding(
            'thấp',
            'Không có phát âm từ dù kế hoạch có',
            'PLAN-VOCAB mục 4.5 hứa dùng SpeechSynthesis cho từng từ và có cài đặt speechEnabled; trong mã không chỗ nào gọi tới `speechSynthesis` cho từ vựng. Người học thấy phiên âm IPA nhưng không nghe được.',
          )
        }
        await page.clearLocalStorage()
      })

      /* ── P. TÍCH HỢP ──────────────────────────────────────────────────── */
      await report.step('P tích hợp', async () => {
        await hardGoto(page, url, '#/')
        await page.waitFor(sel('home'), 20000)
        await sleep(500)
        const homeVocabLink = await page.eval('Boolean(document.querySelector(\'a[href="#/vocab"], a[href^="#/vocab"]\'))')
        const homeDueText = await page.eval(`(() => {
          const m = document.querySelector('main').textContent.match(/từ vựng[^.]{0,80}/i);
          return m ? m[0] : null;
        })()`)
        report.logs.push(`    trang chủ: liên kết từ vựng = ${homeVocabLink}, đoạn chữ = ${homeDueText}`)
        report.check('P1 trang chủ có lối vào từ vựng', homeVocabLink, 'không thấy liên kết #/vocab trên trang chủ')

        await hardGoto(page, url, '#/settings')
        await page.waitFor(sel('settings'), 20000)
        await sleep(400)
        const settingsVocab = await page.eval(`document.querySelector('main').textContent.toLowerCase().includes('từ vựng')`)
        report.logs.push(`    màn cài đặt có mục từ vựng: ${settingsVocab}`)
        report.check('P2 màn cài đặt có mục cho từ vựng', settingsVocab, 'không thấy')
        if (!settingsVocab) {
          noteFinding(
            'thấp',
            'Màn Cài đặt không có mục từ vựng',
            'Kế hoạch mục 4.4 hứa thêm số từ mỗi lượt và bật/tắt phát âm vào Cài đặt; màn Cài đặt hiện không nhắc gì tới từ vựng, nên hai cài đặt đó không có đường nào để người dùng đổi.',
          )
        }
      })

      /* ── Q. TỔNG KẾT BỊ Ô RỖNG THAY THẾ ───────────────────────────────── */
      await report.step('Q phiên dọn sạch chủ đề', async () => {
        const financeWords = BANK.words.filter((w) => w.topic === 'finance')
        const dueNow = Date.now() - 1000
        const farFuture = Date.now() + 60 * 24 * 60 * 60 * 1000
        const progress = {}
        financeWords.forEach((w, index) => {
          progress[w.id] = index < 20
            ? { box: 1, nextReviewAt: dueNow, correct: 1, wrong: 0, lastSeenAt: Date.now() }
            : { box: 5, nextReviewAt: farFuture, correct: 5, wrong: 0, lastSeenAt: Date.now() }
        })
        await hardGoto(page, url, '#/vocab')
        await page.clearLocalStorage()
        await page.setLocalStorage(PROGRESS_KEY, JSON.stringify(progress))
        const session = await enterStudy(page, url, '?topic=finance')
        report.logs.push(`    dựng cảnh: finance có 20 từ đến hạn + 30 từ hẹn xa; phiên = ${session.total} thẻ`)
        report.check('Q0 phiên chỉ lấy 20 từ đến hạn', session.total === 20, `phiên ${session.total} thẻ`)

        for (let i = 0; i < 20; i += 1) {
          if ((await page.count(sel('vocab-know'))) === 0) break
          await page.click(sel('vocab-know'))
          await sleep(270)
        }
        await sleep(700)
        const doneNow = (await page.count(sel('vocab-study-done'))) === 1
        const emptyNow = (await page.count(sel('vocab-study-empty'))) === 1
        const headingNow = (await page.text('h1')).trim()
        report.logs.push(`    sau khi trả lời thẻ cuối: màn tổng kết=${doneNow}, ô rỗng=${emptyNow}, tiêu đề="${headingNow}"`)
        report.check('Q1 trả lời xong cả phiên vẫn thấy màn tổng kết', doneNow, `tổng kết=${doneNow}, ô rỗng=${emptyNow}, tiêu đề "${headingNow}"`)
        if (!doneNow && emptyNow) {
          noteFinding(
            'trung bình',
            'Học xong cả chủ đề thì màn tổng kết bị thay bằng "Chưa có từ nào cần ôn"',
            `Người học vừa trả lời thẻ thứ 20 (thẻ cuối của phiên) thì ngay lập tức thấy ô rỗng thay cho màn hoàn thành: mất phần "Đã thuộc 20 · chưa thuộc 0", mất chuỗi ngày, mất lời chúc. Lý do trong mã: khối \`if (dueInScope === 0) return <LucianEmptyState …>\` đứng TRƯỚC nhánh \`finished\`, nên khi phiên vừa dọn sạch phần đến hạn thì trạng thái rỗng thắng.`,
          )
        }
        await screenshot('study-empty-after-session')
        await page.clearLocalStorage()
      })

      /* ── R. ĐỔI ?topic= TRÊN CÙNG ROUTE ──────────────────────────────── */
      await report.step('R đổi ?topic= trên cùng route', async () => {
        await hardGoto(page, url, '#/vocab')
        await page.clearLocalStorage()
        await hardGoto(page, url, '#/vocab/study')
        await page.waitFor(sel('vocab-study'), 20000)
        await sleep(400)
        const headingBefore = (await page.text('h1')).trim()
        await page.eval('(window.location.hash = "#/vocab/study?topic=finance", true)')
        await sleep(900)
        const headingAfter = (await page.text('h1')).trim()
        const counterAfter = await page.text(sel('vocab-study-counter'))
        report.logs.push(`    đổi hash sang ?topic=finance: tiêu đề "${headingBefore}" → "${headingAfter}", bộ đếm "${counterAfter}"`)
        report.check(
          'R1 đổi ?topic= trên cùng route thì tiêu đề đổi theo',
          headingAfter.includes(TOPIC_LABELS.finance),
          `vẫn "${headingAfter}"`,
        )
        if (!headingAfter.includes(TOPIC_LABELS.finance)) {
          noteFinding(
            'thấp',
            'Đổi `?topic=` trên cùng route không có tác dụng',
            `Từ "#/vocab/study" đổi sang "#/vocab/study?topic=finance": tiêu đề vẫn "${headingAfter}" và phiên vẫn là 20 từ toàn ngân hàng ("${counterAfter}"), vì \`const [topic] = useState(readTopic)\` chỉ đọc một lần lúc mount, không remount khi chỉ hash query đổi. Đi từ trong app (bấm thẻ chủ đề) thì đúng; chỉ sai khi người dùng dán link hoặc dùng Back/Forward giữa hai chủ đề.`,
          )
        }
      })

      /* ── S. PHIÊN BỊ CẮT NGANG KHI HẾT TỪ ĐẾN HẠN ─────────────────────── */
      await report.step('S phiên bị cắt ngang khi vừa dọn hết từ đến hạn', async () => {
        /*
          Cảnh rất thật: một chủ đề 50 từ, đã học hai phiên, còn đúng 10 từ đến
          hạn. `pickDueWords` trả 10 từ đến hạn + bù 10 từ hẹn xa = 20 thẻ để đủ
          một phiên. Nhưng khối trạng thái rỗng xét "còn từ nào đến hạn không",
          nên vừa trả lời thẻ thứ 10 thì `dueInScope` về 0 và ô rỗng THẮNG — 10
          thẻ còn lại của phiên bốc hơi, không có màn tổng kết.
        */
        const officeWords = BANK.words.filter((w) => w.topic === 'office')
        const dueNow = Date.now() - 2000
        const farFuture = Date.now() + 60 * 24 * 60 * 60 * 1000
        const progress = {}
        officeWords.forEach((w, i) => {
          progress[w.id] = i < 10
            ? { box: 1, nextReviewAt: dueNow, correct: 1, wrong: 0, lastSeenAt: Date.now() }
            : { box: 5, nextReviewAt: farFuture, correct: 5, wrong: 0, lastSeenAt: Date.now() }
        })
        await hardGoto(page, url, '#/vocab')
        await page.clearLocalStorage()
        await page.setLocalStorage(PROGRESS_KEY, JSON.stringify(progress))
        const session = await enterStudy(page, url, '?topic=office')
        report.logs.push(`    cảnh: office có 10 từ đến hạn + 40 từ hẹn xa; phiên = ${session.total} thẻ`)
        report.check('S1 phiên vẫn bù đủ 20 thẻ (10 đến hạn + 10 hẹn xa)', session.total === 20, `${session.total} thẻ`)

        let answered = 0
        for (let i = 0; i < 25; i += 1) {
          if ((await page.count(sel('vocab-know'))) === 0) break
          await page.click(sel('vocab-know'))
          answered += 1
          await sleep(270)
        }
        await sleep(600)
        const done = (await page.count(sel('vocab-study-done'))) === 1
        const empty = (await page.count(sel('vocab-study-empty'))) === 1
        const heading = (await page.text('h1')).trim()
        report.logs.push(`    trả lời ${answered} thẻ thì màn đổi: tổng kết=${done}, ô rỗng=${empty}, tiêu đề="${heading}"`)
        report.check('S2 phiên 20 thẻ chạy hết 20, không bị cắt ngang', answered === 20, `dừng ở thẻ ${answered}`)
        report.check('S3 trả lời xong vẫn thấy màn tổng kết', done, `tổng kết=${done}, ô rỗng=${empty}, tiêu đề "${heading}"`)
        if (!done && empty) {
          noteFinding(
            'cao',
            'Phiên ôn bị cắt ngang khi vừa dọn hết số từ đến hạn',
            `Chủ đề còn 10 từ đến hạn: màn ôn mở phiên 20 thẻ (10 đến hạn + 10 bù từ hẹn xa). Trả lời hết 10 thẻ đầu thì màn hình nhảy sang “Chưa có từ nào cần ôn” — 10 thẻ còn lại của phiên biến mất, không có màn tổng kết, không báo gì. Người học tưởng đã xong nhưng thực ra bỏ dở nửa phiên. Đây là cùng gốc với lỗi "học xong cả chủ đề mất màn tổng kết": khối \`if (dueInScope === 0) return <LucianEmptyState/>\` đứng trước cả nhánh \`finished\` lẫn nhánh đang học.`,
          )
        }
        await screenshot('study-truncated-session')
        await page.clearLocalStorage()
      })

      /* ── T. TẢI LẠI GIỮA PHIÊN ───────────────────────────────────────── */
      await report.step('T tải lại trang giữa phiên', async () => {
        await hardGoto(page, url, '#/vocab')
        await page.clearLocalStorage()
        await enterStudy(page, url, '?topic=travel')
        const seen = []
        for (let i = 0; i < 5; i += 1) {
          seen.push((await page.text(sel('vocab-card-front'))).trim())
          await page.click(sel('vocab-know'))
          await sleep(280)
        }
        const beforeReload = await page.text(sel('vocab-study-counter'))
        await page.reload()
        await sleep(1100)
        await page.waitFor(sel('vocab-study'), 20000)
        await sleep(400)
        const saved = await readProgress(page)
        const afterCounter = await page.text(sel('vocab-study-counter'))
        const firstAfter = (await page.text(sel('vocab-card-front'))).trim()
        report.logs.push(`    5 thẻ đã trả lời: ${seen.join(', ')}`)
        report.logs.push(`    trước tải lại "${beforeReload}" → sau tải lại "${afterCounter}", thẻ đầu "${firstAfter}"`)
        report.check('T1 tải lại giữa phiên: cả 5 câu trả lời còn trong localStorage', Object.keys(saved).length === 5, `có ${Object.keys(saved).length} bản ghi`)
        report.check('T2 tải lại: từ vừa học không bị hỏi lại', !seen.map((s) => s.toLowerCase()).includes(firstAfter.toLowerCase()), `hỏi lại "${firstAfter}"`)
        report.check('T3 tải lại: phiên mới vẫn đủ 20 thẻ', /\/\s*20/.test(afterCounter), `"${afterCounter}"`)
        report.logs.push('    (phiên đếm lại từ 1 — chấp nhận được vì tiến độ từng từ đã lưu)')
        await page.clearLocalStorage()
      })

      /* ── U. BẢNG TỪ Ở 375PX: CỘT CÓ BỊ CẮT MẤT KHÔNG ─────────────────── */
      await report.step('U bảng từ ở 375px: cột phải có đọc được không', async () => {
        await page.setViewport(375, 812)
        await sleep(250)
        await hardGoto(page, url, '#/vocab/browse')
        await page.waitFor(sel('vocab-browse'), 20000)
        await sleep(600)
        const table = await page.eval(`(() => {
          const el = document.querySelector('.vocab-table');
          if (!el) return { found: false };
          const cs = getComputedStyle(el);
          const row = el.querySelector('.vocab-row');
          const cells = row ? [...row.children] : [];
          const headers = [...el.querySelectorAll('.vocab-table__head [role="columnheader"]')];
          const lastHeader = headers[headers.length - 1];
          const lastRect = lastHeader ? lastHeader.getBoundingClientRect() : null;
          return {
            found: true,
            overflowX: cs.overflowX,
            overflowY: cs.overflowY,
            clientWidth: el.clientWidth,
            scrollWidth: el.scrollWidth,
            rowScrollWidth: row ? row.scrollWidth : null,
            cellCount: cells.length,
            lastHeaderText: lastHeader ? lastHeader.textContent.trim() : null,
            lastHeaderRight: lastRect ? Math.round(lastRect.right * 10) / 10 : null,
            lastHeaderVisible: lastRect ? lastRect.right <= el.getBoundingClientRect().right + 1 : null,
            viewport: window.innerWidth,
          };
        })()`)
        report.logs.push(`    bảng ở 375px: ${JSON.stringify(table)}`)
        report.check('U1 bảng cuộn ngang được (overflow-x auto/scroll)', table.found && table.overflowX !== 'hidden', `overflow-x=${table.overflowX}`)
        /*
         * U2 — cột cuối phải TỚI ĐƯỢC, không phải "luôn nhìn thấy".
         *
         * Bản trước kiểm `lastHeaderVisible === true` (cột cuối nằm trong khung
         * nhìn ngay khi chưa cuộn). Tiêu chí đó chỉ đúng với bảng KHÔNG cuộn, và
         * nó buộc bảng phải nhồi 5 cột vào 341px — chữ sẽ bị bóp không đọc được.
         *
         * Nay bảng có `overflow-x: auto`, nên đúng đắn là: nội dung rộng hơn
         * khung (có gì để cuộn), VÀ sau khi cuộn hết sang phải thì cột cuối nằm
         * trọn trong tầm nhìn. Đây mới là "xem được trên điện thoại".
         */
        const reachable = await page.eval(`(() => {
          const t = document.querySelector('.vocab-table');
          if (!t) return { found: false };
          const head = [...t.querySelectorAll('.vocab-table__head > *')].pop();
          if (!head) return { found: false };
          t.scrollLeft = t.scrollWidth;
          const box = t.getBoundingClientRect();
          const h = head.getBoundingClientRect();
          return {
            found: true,
            text: head.textContent.trim(),
            scrolled: t.scrollLeft,
            maxScroll: t.scrollWidth - t.clientWidth,
            fullyVisibleAfterScroll: h.left >= box.left - 1 && h.right <= box.right + 1,
          };
        })()`)
        report.logs.push(`    cuộn bảng: ${JSON.stringify(reachable)}`)
        report.check(
          'U2 cuộn hết sang phải thì cột cuối xem được',
          reachable.found && reachable.maxScroll > 0 && reachable.fullyVisibleAfterScroll === true,
          JSON.stringify(reachable),
        )
        if (table.overflowX === 'hidden' && table.scrollWidth > table.clientWidth) {
          noteFinding(
            'cao',
            'Bảng 600 từ ở 375px bị cắt mất hai cột, không cuộn được',
            `\`.vocab-table\` đặt \`overflow: hidden\` trong khi dòng có \`min-width: 620px\` — nội dung rộng ${table.scrollWidth}px nằm trong khung ${table.clientWidth}px và bị CẮT, không có thanh cuộn. Chú thích ngay trên quy tắc đó ghi "Cuộn ngang RIÊNG cho bảng", nhưng mã lại dùng \`hidden\` chứ không phải \`auto\`. Người dùng điện thoại mất hẳn cột "Mức độ" và "Trạng thái" — không có cách nào xem. Bộ kiểm cũ chỉ đo \`documentElement.scrollWidth\` nên vẫn xanh.`,
          )
        }
        await screenshot('browse-375-light')
        // Cuộn tới bảng để ảnh chụp cho thấy đúng phần bị cắt.
        await page.eval(`(() => {
          const t = document.querySelector('.vocab-table');
          if (t) t.scrollIntoView({ block: 'start' });
          return true;
        })()`)
        await sleep(400)
        await screenshot('browse-375-table-light')
        await page.eval('(document.documentElement.setAttribute("data-theme", "dark"), true)')
        await sleep(400)
        await screenshot('browse-375-table-dark')
        await page.eval('(document.documentElement.setAttribute("data-theme", "light"), true)')
        await page.setViewport(1440, 960)
        await sleep(250)
      })

      /* ── J. LỖI CONSOLE TOÀN LUỒNG ───────────────────────────────────── */
      await report.step('J lỗi console', async () => {
        const pageErrors = await page.eval('(window.__qaErrors || [])')
        const cdpErrors = page.consoleErrors
        report.logs.push(`    lỗi bắt trong trang: ${pageErrors.length}, CDP: ${cdpErrors.length}`)
        report.check('J1 không lỗi JS / promise bị từ chối', pageErrors.length === 0, pageErrors.slice(0, 6).join(' | '))
        report.check('J2 CDP không ghi console.error / ngoại lệ', cdpErrors.length === 0, cdpErrors.slice(0, 6).join(' | '))
        if (pageErrors.length || cdpErrors.length) {
          noteFinding('cao', 'Có lỗi console trong luồng', [...pageErrors, ...cdpErrors].slice(0, 6).join(' | '))
        }
      })
    },
    { port: 5197, cdpPort: 9413 },
  )

  const summary = report.summary()
  summary.notTested = notTested
  summary.findings = findings
  return summary
}

const isMain = process.argv[1] && process.argv[1].endsWith('verify-vocab.mjs')
if (isMain) {
  runVerifyVocab()
    .then((s) => {
      for (const line of s.logs) console.log(line)
      for (const note of s.notTested ?? []) console.log(`CHƯA KIỂM ĐƯỢC: ${note}`)
      if (s.findings?.length) {
        console.log('\nLỗi tìm được (theo mức độ):')
        const order = { cao: 0, 'trung bình': 1, thấp: 2 }
        for (const f of [...s.findings].sort((a, b) => (order[a.severity] ?? 9) - (order[b.severity] ?? 9))) {
          console.log(`  [${f.severity}] ${f.title}`)
          console.log(`      ${f.detail}`)
        }
      }
      if (s.failures.length) {
        console.log('\nPhép kiểm thất bại:')
        for (const failure of s.failures) console.log(`  - ${failure}`)
      }
      console.log(`\n${s.title}: ${s.passed} passed, ${s.failed} failed`)
      process.exit(s.failed === 0 ? 0 : 1)
    })
    .catch((err) => {
      console.error('LỖI CHẠY KIỂM THỬ:', err)
      process.exit(1)
    })
}
