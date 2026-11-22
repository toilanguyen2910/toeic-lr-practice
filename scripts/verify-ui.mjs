/**
 * KIỂM THỬ GIAO DIỆN THẬT TRÊN CHROME — do QA viết độc lập với verify-core.
 *
 *   npm run verify:ui      (node scripts/verify-ui.mjs)
 *
 * Bộ này tập trung vào những thứ `verify-core.mjs` KHÔNG phủ:
 *   A. Responsive 390x844 — không tràn ngang ở 5 route.
 *   B. Bàn phím — phím "1" chọn đáp án A, ArrowRight sang câu kế.
 *   C. Trạng thái rỗng — lịch sử trống, trang chủ không hiện "tiếp tục".
 *   D. Ràng buộc dữ liệu — setting-reveal bật/tắt đổi hành vi luyện tập.
 *   E. Điều hướng — 5 nút nav đổi đúng route.
 *   F. Không có lỗi console / ngoại lệ / promise bị từ chối ở mọi route.
 *   G. Nộp bài khi còn câu trống — số blank phải > 0 và khớp thực tế.
 *
 * Mọi khẳng định đều đọc từ DOM thật, localStorage thật và sự kiện bàn phím
 * thật (CDP Input domain) của Chrome — không mock, không đọc từ mã nguồn.
 */
import { withBrowser, createReporter } from './cdp.mjs'

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
const sel = (tid) => `[data-testid="${tid}"]`
const num = (value) => Number(String(value ?? '').replace(/[^\d]/g, '')) || 0

/** Cài bộ bắt lỗi vào MỌI document mới, để không lọt lỗi nào giữa các lần điều hướng. */
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
})()`

/** Đọc trạng thái một công tắc bất kể UI cài bằng input, data-checked hay aria-*. */
const TOGGLE_STATE = (selector) => `(() => {
  const el = document.querySelector(${JSON.stringify(selector)});
  if (!el) return { found: false, state: null, kind: null };
  const kind = el.tagName.toLowerCase() + (el.type ? ':' + el.type : '');
  const norm = (v) => {
    if (v === null || v === undefined) return null;
    const s = String(v).toLowerCase();
    if (s === 'true' || s === 'on' || s === 'checked' || s === '1') return 'on';
    if (s === 'false' || s === 'off' || s === 'unchecked' || s === '0') return 'off';
    return null;
  };
  if (el instanceof HTMLInputElement && (el.type === 'checkbox' || el.type === 'radio')) {
    return { found: true, kind, state: el.checked ? 'on' : 'off' };
  }
  for (const attr of ['data-checked', 'aria-checked', 'aria-pressed', 'data-state']) {
    const raw = el.getAttribute(attr);
    if (raw !== null) {
      const state = norm(raw);
      if (state) return { found: true, kind, state };
    }
  }
  return { found: true, kind, state: null };
})()`

/** Phím thật gửi qua CDP Input domain — giống người dùng bấm. */
const KEYS = {
  1: { key: '1', code: 'Digit1', vk: 49, text: '1' },
  a: { key: 'a', code: 'KeyA', vk: 65, text: 'a' },
  b: { key: 'b', code: 'KeyB', vk: 66, text: 'b' },
  ArrowRight: { key: 'ArrowRight', code: 'ArrowRight', vk: 39, text: null },
  ArrowLeft: { key: 'ArrowLeft', code: 'ArrowLeft', vk: 37, text: null },
  Escape: { key: 'Escape', code: 'Escape', vk: 27, text: null },
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
  await sleep(180)
}

async function readCounter(page) {
  const text = await page.text(sel('question-counter'))
  const match = /(\d+)\s*\/\s*(\d+)/u.exec(text)
  if (!match) return { current: 0, total: 0, raw: text }
  return { current: Number(match[1]), total: Number(match[2]), raw: text }
}

async function readToggle(page, selector) {
  return page.eval(TOGGLE_STATE(selector))
}

/** Bật/tắt công tắc cho tới khi đúng trạng thái mong muốn; trả về trạng thái cuối. */
async function ensureToggle(page, selector, want) {
  for (let attempt = 0; attempt < 4; attempt += 1) {
    const info = await readToggle(page, selector)
    if (!info?.found) return 'không-thấy'
    if (info.state === null) return 'không-đọc-được'
    if (info.state === want) return info.state
    await page.click(selector)
    await sleep(200)
  }
  const info = await readToggle(page, selector)
  return info?.state ?? 'không-đọc-được'
}

/** Đặt số câu mỗi part nếu điều khiển cho phép; không thành công cũng không chặn test. */
async function setPracticeCount(page, want) {
  const info = await page.eval(`(() => {
    const el = document.querySelector(${JSON.stringify(sel('practice-count'))});
    if (!el) return { present: false };
    if (el instanceof HTMLSelectElement) {
      return { present: true, kind: 'select', options: Array.from(el.options).map((o) => o.value) };
    }
    return { present: true, kind: el.tagName.toLowerCase(), value: el.value };
  })()`)
  if (!info?.present) return 'không-thấy-ô-số-câu'
  if (info.kind === 'select') {
    const sizes = info.options.map((v) => Number(v)).filter((n) => Number.isFinite(n)).sort((x, y) => x - y)
    const pick = sizes.find((n) => n >= want) ?? sizes[sizes.length - 1]
    if (!Number.isFinite(pick)) return 'select-không-có-giá-trị-số'
    await page.type(sel('practice-count'), String(pick))
    return `select=${pick}`
  }
  await page.type(sel('practice-count'), String(want))
  return `${info.kind}=${want}`
}

async function startPractice(page, url, count) {
  await page.goto(`${url}#/practice`)
  await page.waitFor(sel('part-select'), 20000)
  const note = await setPracticeCount(page, count)
  await page.click(sel('start-practice'))
  await page.waitFor(sel('session'), 20000)
  return note
}

/**
 * Vào một phiên thi thử.
 *
 * Trước đây nút "Thi thử" ở trang chủ vào thẳng phiên. Nay nó mở danh sách 10 đề
 * (mỗi đề đủ 200 câu), nên helper phải bấm thêm một bước chọn đề.
 *
 * Dùng đề 1 vì nó luôn có mặt; không phụ thuộc đề nào đã làm trước đó.
 */
async function startMock(page, url) {
  await page.goto(`${url}#/`)
  await page.waitFor(sel('home'), 20000)
  await page.click(sel('home-start-mock'))
  await page.waitFor(sel('mock-sets'), 20000)
  await page.click('[data-testid="mock-set-1"] a')
  await page.waitFor(sel('session'), 25000)
}

export async function runVerifyUi() {
  const report = createReporter('Xác minh giao diện trên Chrome (QA độc lập)')
  const notTested = []

  await withBrowser(
    async ({ page, url, browserVersion }) => {
      report.logs.push(`Trình duyệt: ${browserVersion}`)
      report.logs.push(`Địa chỉ: ${url}`)

      await page.send('Page.addScriptToEvaluateOnNewDocument', { source: ERROR_HOOK })
      await page.setViewport(1440, 960)

      // ── C. TRẠNG THÁI RỖNG ───────────────────────────────────────────────
      await report.step('C trạng thái rỗng', async () => {
        await page.goto(`${url}#/`)
        await page.clearLocalStorage()
        await page.goto(`${url}#/history`)
        await page.waitFor(sel('history'), 20000)
        await sleep(300)
        const emptyBox = await page.count(sel('history-empty'))
        const rows = await page.count(sel('history-row'))
        report.check('C1 xoá localStorage → #/history hiện history-empty', emptyBox === 1, `thấy ${emptyBox} ô rỗng`)
        report.check('C2 lịch sử trống không có dòng nào', rows === 0, `thấy ${rows} dòng`)

        await page.goto(`${url}#/`)
        await page.waitFor(sel('home'), 20000)
        await sleep(300)
        const resume = await page.count(sel('home-resume'))
        report.check('C3 trang chủ không hiện home-resume khi chưa có phiên dở', resume === 0, `thấy ${resume}`)
      })

      // ── E. ĐIỀU HƯỚNG ────────────────────────────────────────────────────
      await report.step('E điều hướng bằng thanh nav', async () => {
        await page.goto(`${url}#/history`)
        await page.waitFor(sel('nav'), 20000)
        const targets = [
          { tid: 'nav-home', expect: '#/', label: 'trang chủ' },
          { tid: 'nav-practice', expect: '#/practice', label: 'chọn part' },
          { tid: 'nav-settings', expect: '#/settings', label: 'cài đặt' },
          { tid: 'nav-history', expect: '#/history', label: 'lịch sử' },
        ]
        for (const target of targets) {
          await page.click(sel(target.tid))
          await sleep(350)
          const hash = await page.eval('location.hash')
          const ok = hash === target.expect || hash.startsWith(`${target.expect}/`)
          report.check(`E ${target.tid} → ${target.label} (${target.expect})`, ok, `nhận "${hash}"`)
        }

        await page.goto(`${url}#/`)
        await page.waitFor(sel('nav-mock'), 15000)
        await page.click(sel('nav-mock'))
        await sleep(800)
        const hashMock = await page.eval('location.hash')
        const hasSession = (await page.count(sel('session'))) > 0
        report.check(
          'E nav-mock mở được phòng thi thử',
          hashMock.startsWith('#/mock') || hasSession,
          `hash "${hashMock}", có màn hình làm bài: ${hasSession}`,
        )
      })

      // ── D. RÀNG BUỘC DỮ LIỆU: setting-reveal ─────────────────────────────
      await report.step('D setting-reveal đổi hành vi luyện tập', async () => {
        await page.goto(`${url}#/settings`)
        await page.waitFor(sel('settings'), 20000)

        const offState = await ensureToggle(page, sel('setting-reveal'), 'off')
        report.check('D1 đặt được setting-reveal = tắt', offState === 'off', `trạng thái nhận "${offState}"`)
        const storedOff = await page.localStorage('toeic-lr/v1/settings')
        report.logs.push(`    settings sau khi tắt: ${storedOff ?? 'null'}`)

        const noteOff = await startPractice(page, url, 2)
        report.logs.push(`    cấu hình luyện tập (reveal tắt): ${noteOff}`)
        await page.waitFor(sel('question'), 15000)
        await page.click(sel('choice-A'))
        await sleep(600)
        const feedbackOff = await page.count(sel('feedback'))
        report.check(
          'D2 reveal TẮT: không hiện phản hồi ngay khi chọn đáp án',
          feedbackOff === 0,
          `thấy ${feedbackOff} ô feedback trong phiên luyện tập`,
        )
        const selectedOff = await page.count('[data-testid^="choice-"][data-selected="true"]')
        report.check('D3 reveal TẮT: đáp án vẫn được ghi nhận', selectedOff === 1, `thấy ${selectedOff} lựa chọn được chọn`)

        await page.goto(`${url}#/settings`)
        await page.waitFor(sel('settings'), 20000)
        const onState = await ensureToggle(page, sel('setting-reveal'), 'on')
        report.check('D4 bật lại được setting-reveal', onState === 'on', `trạng thái nhận "${onState}"`)
        const storedOn = await page.localStorage('toeic-lr/v1/settings')
        report.logs.push(`    settings sau khi bật: ${storedOn ?? 'null'}`)

        const noteOn = await startPractice(page, url, 2)
        report.logs.push(`    cấu hình luyện tập (reveal bật): ${noteOn}`)
        await page.waitFor(sel('question'), 15000)
        await page.click(sel('choice-A'))
        await sleep(600)
        const feedbackOn = await page.count(sel('feedback'))
        report.check(
          'D5 reveal BẬT: hiện phản hồi ngay khi chọn đáp án',
          feedbackOn === 1,
          `thấy ${feedbackOn} ô feedback`,
        )

        // Trả lại trạng thái mặc định (tắt) để các bước sau không bị lộ đáp án
        await page.goto(`${url}#/settings`)
        await page.waitFor(sel('settings'), 20000)
        await ensureToggle(page, sel('setting-reveal'), 'off')
      })

      // ── B. BÀN PHÍM ──────────────────────────────────────────────────────
      await report.step('B bàn phím chọn đáp án và chuyển câu', async () => {
        const note = await startPractice(page, url, 3)
        report.logs.push(`    cấu hình luyện tập (kiểm bàn phím): ${note}`)
        await page.waitFor(sel('question'), 15000)
        await page.send('Page.bringToFront')
        await sleep(200)

        const counter0 = await readCounter(page)
        const focusBefore = await page.eval(
          'document.activeElement ? document.activeElement.tagName : "null"',
        )
        report.logs.push(`    bộ đếm trước khi bấm phím: "${counter0.raw}", focus: ${focusBefore}`)

        if (counter0.total < 2) {
          notTested.push('B2 ArrowRight: phiên chỉ có 1 câu nên không có câu kế để chuyển')
        }

        await pressKey(page, '1')
        const selectedA = await page.count('[data-testid="choice-A"][data-selected="true"]')
        if (selectedA === 0) {
          // Chẩn đoán thêm cho báo cáo: phím chữ cái có tác dụng không?
          await pressKey(page, 'b')
          const diagB = await page.count('[data-testid="choice-B"][data-selected="true"]')
          await pressKey(page, 'a')
          const diagA = await page.count('[data-testid="choice-A"][data-selected="true"]')
          report.logs.push(`    chẩn đoán: phím "b"→B=${diagB}, phím "a"→A=${diagA} (chỉ để chẩn đoán, không tính pass)`)
        }
        report.check(
          'B1 phím "1" chọn được đáp án A',
          selectedA === 1,
          `thấy ${selectedA} lựa chọn A được chọn; focus đang ở ${focusBefore}`,
        )

        await pressKey(page, 'ArrowRight')
        const counter1 = await readCounter(page)
        report.check(
          'B2 ArrowRight chuyển sang câu kế',
          counter1.current === counter0.current + 1,
          `bộ đếm "${counter0.raw}" → "${counter1.raw}"`,
        )

        if (counter1.current > 1) {
          await pressKey(page, 'ArrowLeft')
          const counter2 = await readCounter(page)
          report.logs.push(`    chẩn đoán: ArrowLeft "${counter1.raw}" → "${counter2.raw}"`)
        }
      })

      // ── G. NỘP BÀI KHI CÒN CÂU TRỐNG ─────────────────────────────────────
      await report.step('G nộp bài còn câu trống', async () => {
        await page.clearLocalStorage()
        await startMock(page, url)
        await page.waitFor(sel('question'), 15000)
        const start = await readCounter(page)
        report.check('G1 đề thi thử đủ 200 câu', start.total === 200, `tổng số câu nhận ${start.total}`)

        await page.click(sel('choice-A'))
        await sleep(250)
        const answered = await page.count('[data-testid^="choice-"][data-selected="true"]')
        report.check('G2 chọn được đáp án cho câu đầu', answered === 1, `thấy ${answered} lựa chọn được chọn`)

        // KHÔNG bấm next 200 lần: đề thi thử giờ đủ 200 câu, bấm từng câu sẽ vượt
        // thời gian test. Nút nộp bài hiện ở mọi câu (thanh điều hướng luôn có),
        // nên chỉ cần kiểm nó hiện rồi nộp luôn — vẫn kiểm được đúng điều cần kiểm:
        // số câu bỏ trống có đếm đúng hay không.
        report.check(
          'G3 thấy nút nộp bài',
          (await page.count(sel('submit-session'))) === 1,
          'không thấy nút nộp bài',
        )

        await page.click(sel('submit-session'))
        await page.waitFor(sel('result'), 25000)
        await sleep(400)
        const blank = num(await page.text(sel('result-blank')))
        const correct = num(await page.text(sel('result-correct')))
        const wrong = num(await page.text(sel('result-wrong')))
        report.logs.push(`    kết quả: đúng=${correct} sai=${wrong} trống=${blank} (tổng phiên ${start.total})`)
        report.check('G4 số câu bỏ trống > 0', blank > 0, `nhận ${blank}`)
        report.check('G5 đúng + sai + trống = tổng số câu', correct + wrong + blank === start.total, `${correct}+${wrong}+${blank} ≠ ${start.total}`)
        report.check('G6 số câu trống khớp số câu đã bỏ qua', blank === start.total - 1, `trống ${blank}, bỏ qua ${start.total - 1}`)
        if (blank !== start.total - 1) {
          notTested.push('G6 chỉ đúng khi câu đầu tiên được trả lời; nếu app tự đánh dấu khác thì xem chi tiết')
        }
      })

      // ── A. RESPONSIVE 390x844 ────────────────────────────────────────────
      await report.step('A responsive 390x844 không tràn ngang', async () => {
        await page.setViewport(390, 844)
        await sleep(300)
        for (const route of ['#/', '#/practice', '#/result', '#/history', '#/settings']) {
          await page.goto(`${url}${route}`)
          await sleep(600)
          const metrics = await page.eval(`(() => {
            let worst = null;
            for (const el of document.querySelectorAll('body *')) {
              const rect = el.getBoundingClientRect();
              if (!worst || rect.right > worst.right) {
                worst = {
                  right: Math.round(rect.right * 10) / 10,
                  tag: el.tagName.toLowerCase(),
                  testid: el.getAttribute('data-testid'),
                  cls: typeof el.className === 'string' ? el.className.slice(0, 60) : null,
                };
              }
            }
            return {
              scrollWidth: document.documentElement.scrollWidth,
              bodyScrollWidth: document.body.scrollWidth,
              clientWidth: document.documentElement.clientWidth,
              hash: location.hash,
              worst,
            };
          })()`)
          report.check(
            `A ${route} không tràn ngang (scrollWidth ≤ 390)`,
            metrics.scrollWidth <= 390,
            `scrollWidth=${metrics.scrollWidth}, body=${metrics.bodyScrollWidth}, client=${metrics.clientWidth}, hash="${metrics.hash}", phần tử xa nhất=${JSON.stringify(metrics.worst)}`,
          )
          report.logs.push(
            `    ${route} → hash "${metrics.hash}", scrollWidth ${metrics.scrollWidth}, phần tử xa nhất ${JSON.stringify(metrics.worst)}`,
          )
        }
        await page.setViewport(1440, 960)
        await sleep(200)
      })

      // ── F. LỖI CONSOLE THEO TỪNG ROUTE ───────────────────────────────────
      await report.step('F không có lỗi console ở mọi route', async () => {
        const routes = ['#/', '#/practice', '#/session-placeholder', '#/result', '#/history', '#/settings', '#/review']
        const allErrors = []
        for (const route of routes) {
          await page.goto(`${url}${route}`)
          await sleep(700)
          const errors = await page.eval('(window.__qaErrors || []).slice(0, 8)')
          if (Array.isArray(errors)) allErrors.push(...errors.map((e) => `${route} → ${e}`))
          report.logs.push(`    ${route}: ${Array.isArray(errors) && errors.length ? errors.join(' | ') : 'không có lỗi'}`)
        }
        const cdpErrors = page.consoleErrors
        report.check('F1 không có lỗi JS / promise bị từ chối trên các route', allErrors.length === 0, allErrors.slice(0, 5).join(' | '))
        report.check('F2 CDP không ghi nhận console.error hay ngoại lệ', cdpErrors.length === 0, cdpErrors.slice(0, 5).join(' | '))
      })
    },
    { port: 5198, cdpPort: 9412 },
  )

  const summary = report.summary()
  summary.notTested = notTested
  return summary
}

const isMain = process.argv[1] && process.argv[1].endsWith('verify-ui.mjs')
if (isMain) {
  runVerifyUi()
    .then((s) => {
      for (const line of s.logs) console.log(line)
      for (const note of s.notTested ?? []) console.log(`CHƯA KIỂM ĐƯỢC: ${note}`)
      if (s.failures.length) {
        console.log('\nDanh sách lỗi:')
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
