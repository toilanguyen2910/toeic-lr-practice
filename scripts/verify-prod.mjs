/**
 * KIỂM THỬ BẢN PRODUCTION — chạy trên `dist/` đã build, không phải dev server.
 *
 * Vì sao cần riêng: dev server của Vite phục vụ module ES chưa đóng gói, còn bản
 * production là một bundle duy nhất đã minify. Có những lỗi chỉ xuất hiện ở bản
 * production — ví dụ import bị tree-shake nhầm, đường dẫn asset sai, hoặc
 * `import.meta.env` khác nhau. Kiểm mỗi dev server là chưa đủ trước khi đưa lên
 * Vercel.
 *
 * Cách chạy:  npm run verify:prod
 * (script tự build rồi phục vụ `dist/` bằng chính Vite preview)
 */
import { withBrowser, createReporter } from './cdp.mjs'

const sel = (tid) => `[data-testid="${tid}"]`

export async function runVerifyProd() {
  const report = createReporter('Xác minh bản production')

  await withBrowser(
    async ({ page, url, screenshot, browserVersion }) => {
      report.logs.push(`Trình duyệt: ${browserVersion}`)
      report.logs.push(`Địa chỉ: ${url}`)

      await report.step('P0 trang tải được từ bản build', async () => {
        // `withBrowser` mở Chrome ở about:blank; phải điều hướng trước khi đọc
        // bất cứ thứ gì. (Bản đầu của test này quên bước goto nên đọc title rỗng.)
        await page.goto(url)
        const title = await page.eval('document.title')
        report.check('P0.1 trang tải được từ bản build', title.includes('TOEIC'), `nhận "${title}"`)
        const hasRoot = await page.eval('Boolean(document.querySelector("#root"))')
        report.check('P0.2 có #root trong HTML', hasRoot)
      })

      await report.step('P1 bundle đã nạp, không lỗi console', async () => {
        await page.waitFor(sel('app'), 20000)
        // Trên production, mọi thứ nằm trong một file JS; nếu file đó 404 hoặc
        // ném lỗi thì React không render được và đây là chỗ bắt được.
        const errors = page.consoleErrors
        report.check('P1.1 không có lỗi console', errors.length === 0, errors.join(' | ').slice(0, 400))
      })

      await report.step('P2 trang chủ render đúng', async () => {
        await page.goto(`${url}#/`)
        await page.waitFor(sel('home'), 20000)
        const h1 = await page.text('h1')
        report.check('P2.1 có tiêu đề trang chủ', h1.length > 10, `nhận "${h1}"`)
        const nav = await page.count('[data-testid^="nav-"]')
        report.check('P2.2 đủ 7 mục điều hướng', nav === 7, `nhận ${nav}`)
      })

      await report.step('P3 ảnh Part 1 tải được từ /images/', async () => {
        await page.goto(`${url}#/practice`)
        await page.waitFor(sel('part-select'), 20000)
        // Kiểm tra ảnh thật đã được copy vào dist/images và phục vụ được.
        const imgOk = await page.eval(`(async () => {
          const files = ['/images/part1-01.svg', '/images/part1-09.svg', '/images/part1-20.svg', '/images/placeholder-part1.svg'];
          const results = [];
          for (const f of files) {
            try {
              const r = await fetch(f);
              results.push({ f, status: r.status, ok: r.ok });
            } catch (e) {
              results.push({ f, status: 0, ok: false, err: String(e) });
            }
          }
          return results;
        })()`)
        for (const item of imgOk) {
          report.check(`P3 ảnh ${item.f}`, item.ok, `HTTP ${item.status}`)
        }
      })

      await report.step('P4 màn 20 đề có CSS và dữ liệu', async () => {
        await page.setViewport(1440, 960)
        await page.goto(`${url}#/de`)
        await page.waitFor(sel('exam-sets'), 20000)
        // Tiền tố `exam-set-` khớp cả `exam-set-start` lẫn `exam-set-progress-N`,
        // nên phải lọc theo đúng dạng số hiệu `exam-set-<số>` mới đếm đúng thẻ.
        const numbered = await page.eval(
          `[...document.querySelectorAll('[data-testid]')]
             .filter((el) => /^exam-set-\\d+$/.test(el.getAttribute('data-testid')))
             .length`,
        )
        report.check('P4.1 có 20 thẻ đề', numbered === 20, `nhận ${numbered}`)
        // CSS phải được nạp: nếu thiếu, lưới sẽ chỉ có 1 cột.
        const cols = await page.eval(
          `getComputedStyle(document.querySelector('.exam-grid')).gridTemplateColumns.split(' ').length`,
        )
        report.check('P4.2 lưới đề 3 cột (CSS đã nạp)', cols === 3, `nhận ${cols} cột`)
        const text = await page.text('[data-testid="exam-set-11"]')
        report.check('P4.3 đề dài ghi 200 câu', text.includes('200'), text.slice(0, 80))
      })

      await report.step('P5 làm một đề thật trên bản build', async () => {
        await page.click('[data-testid="exam-set-1"] a')
        await page.waitFor(sel('session'), 20000)
        const counter = await page.text(sel('question-counter'))
        report.check('P5.1 vào được phiên của đề 1', /^Câu\s*1\s*\//u.test(counter), counter)
        await page.click(sel('choice-A'))
        const selected = await page.attr(sel('choice-A'), 'data-selected')
        report.check('P5.2 chọn được đáp án', selected === 'true', `nhận "${selected}"`)
        await screenshot('prod-session', 'live')
      })

      await report.step('P6 dữ liệu lưu được (localStorage)', async () => {
        const raw = await page.localStorage('toeic-lr/v1/session')
        report.check('P6.1 phiên được lưu', Boolean(raw), 'không thấy khoá phiên')
        if (raw) {
          const parsed = JSON.parse(raw)
          report.check('P6.2 phiên có id dạng exam1-…', String(parsed.id).startsWith('exam1-'), parsed.id)
        }
      })
    },
    { port: 4173, cdpPort: 9413, mode: 'preview' },
  )

  return report.summary()
}

const isMain = process.argv[1] && process.argv[1].endsWith('verify-prod.mjs')
if (isMain) {
  runVerifyProd()
    .then((s) => {
      for (const line of s.logs.filter((l) => l.startsWith('FAIL'))) console.log(line)
      console.log(`\n${s.title}: ${s.passed} passed, ${s.failed} failed`)
      process.exit(s.failed === 0 ? 0 : 1)
    })
    .catch((err) => {
      console.error('LỖI CHẠY KIỂM THỬ:', err)
      process.exit(1)
    })
}
