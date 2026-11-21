/**
 * KIỂM THỬ ĐẦU-CUỐI THẬT — chạy trên Chrome headless qua CDP.
 *
 *   npm run verify:core
 *
 * Kịch bản A (luyện tập) và B (thi thử) đi qua đúng những đường mà người dùng đi:
 * chọn part → làm bài → nộp → xem điểm → xem lại → lịch sử.
 *
 * Mọi khẳng định đều đọc từ DOM thật và localStorage thật của trình duyệt.
 */
import { withBrowser, createReporter } from './cdp.mjs'

const sel = (tid) => `[data-testid="${tid}"]`

export async function runVerifyCore() {
  const report = createReporter('Xác minh E2E trên Chrome')

  await withBrowser(
    async ({ page, url, screenshot, browserVersion }) => {
      report.logs.push(`Trình duyệt: ${browserVersion}`)

      // ── A1. Chọn part ────────────────────────────────────────────────────
      await report.step('A1 mở trang chọn part', async () => {
        await page.setViewport(1440, 960)
        await page.goto(`${url}#/practice`)
        await page.waitFor(sel('part-select'), 20000)
        report.check('A1.1 trang chọn part hiển thị', (await page.count(sel('part-select'))) === 1)
        const toggles = await page.count('[data-testid^="part-toggle-"]')
        report.equals('A1.2 có đủ 7 nút chọn part', toggles, 7)
        const checked = await page.count('[data-testid^="part-toggle-"][data-checked="true"]')
        report.equals('A1.3 mặc định chọn cả 7 part', checked, 7)
      })

      await report.step('A2 cấu hình bài luyện tập', async () => {
        // Bỏ chọn part 3, 4, 6, 7 → còn 1, 2, 5
        for (const p of [3, 4, 6, 7]) await page.click(sel(`part-toggle-${p}`))
        const checked = await page.count('[data-testid^="part-toggle-"][data-checked="true"]')
        report.equals('A2.1 còn đúng 3 part được chọn', checked, 3)

        // Chuyển sang chế độ "mỗi part N câu" rồi đặt N = 2.
        // Mặc định nay là chế độ "tổng số câu", nên phải chọn rõ chế độ trước khi
        // nhập, nếu không ô nhập sẽ là ô tổng chứ không phải ô mỗi-part.
        await page.click(sel('count-mode-per-part'))
        await page.type(sel('practice-count'), '2')
        const perPartValue = await page.eval(
          `document.querySelector('${sel('practice-count')}').value`,
        )
        report.check('A2.2 ô số câu nhận giá trị 2', perPartValue === '2', `nhận "${perPartValue}"`)

        // Phần tóm tắt phải nói rõ phép nhân để người dùng không hiểu nhầm.
        const summary = await page.text(sel('practice-summary'))
        report.check('A2.3 tóm tắt ghi rõ tổng câu', /\b6\b/u.test(summary), `nhận "${summary}"`)
      })

      await report.step('A3 bắt đầu làm bài', async () => {
        await page.click(sel('start-practice'))
        await page.waitFor(sel('session'), 20000)
        report.check('A3.1 vào được màn hình làm bài', (await page.count(sel('session'))) === 1)
        const counter = await page.text(sel('question-counter'))
        report.check('A3.2 bộ đếm câu hỏi đúng định dạng', /^Câu\s*1\s*\/\s*\d+$/u.test(counter), `nhận "${counter}"`)
        const timer = await page.text(sel('timer'))
        // Đồng hồ hợp lệ ở cả hai dạng: `mm:ss` và `h:mm:ss` (đề thi thật dài 120 phút).
        report.check('A3.3 đồng hồ hiển thị đúng định dạng', /^(?:\d{1,3}:\d{2}|\d+:\d{2}:\d{2})$/.test(timer), `nhận "${timer}"`)
        const choices = await page.count('[data-testid^="choice-"]')
        report.check('A3.4 có từ 3 đến 4 lựa chọn', choices === 3 || choices === 4, `nhận ${choices}`)
      })

      let totalQuestions = 0
      await report.step('A4 đọc tổng số câu của phiên', async () => {
        const counter = await page.text(sel('question-counter'))
        totalQuestions = Number(/(\d+)\s*$/u.exec(counter)?.[1] ?? 0)
        report.check('A4.1 tổng số câu = 6 (3 part × 2 câu)', totalQuestions === 6, `nhận ${totalQuestions}`)
      })

      await report.step('A5 trả lời to hết các câu', async () => {
        for (let i = 0; i < totalQuestions; i += 1) {
          await page.waitFor(sel('question'), 10000)
          const answeredBefore = await page.count('[data-testid^="choice-"][data-selected="true"]')
          report.check(`A5.${i + 1}a câu ${i + 1} chưa có đáp án`, answeredBefore === 0)
          await page.click(sel('choice-A'))
          await page.waitForFunction(
            `document.querySelector('${sel('choice-A')}')?.getAttribute('data-selected') === 'true'`,
            `câu ${i + 1} ghi nhận đáp án A`,
            8000,
          )
          // Chế độ luyện tập: phải hiện phản hồi + giải thích ngay.
          await page.waitFor(sel('feedback'), 8000)
          const feedbackText = await page.text(sel('feedback'))
          report.check(`A5.${i + 1}b có phản hồi đúng/sai`, feedbackText.length > 0)
          const explanation = await page.count(sel('feedback-explanation'))
          report.check(`A5.${i + 1}c có ô giải thích đáp án`, explanation === 1)
          if (i < totalQuestions - 1) await page.click(sel('next-question'))
        }
        await page.waitFor(sel('submit-session'), 10000)
        report.check('A5.4 nút nộp bài xuất hiện ở câu cuối', (await page.count(sel('submit-session'))) === 1)
      })

      let practiceCorrect = 0
      await report.step('A6 nộp bài và xem kết quả', async () => {
        await page.click(sel('submit-session'))
        await page.waitFor(sel('result'), 20000)
        const total = await page.text(sel('score-total'))
        const totalNum = Number(total.replace(/[^\d]/g, ''))
        report.check('A6.1 tổng điểm nằm trên thang 10–990', totalNum >= 10 && totalNum <= 990, `nhận "${total}"`)
        const listening = Number((await page.text(sel('score-listening'))).replace(/[^\d]/g, ''))
        const reading = Number((await page.text(sel('score-reading'))).replace(/[^\d]/g, ''))
        report.check('A6.2 điểm nghe trong khoảng 5–495', listening >= 0 && listening <= 495, `nhận ${listening}`)
        report.check('A6.3 điểm đọc trong khoảng 5–495', reading >= 0 && reading <= 495, `nhận ${reading}`)
        report.check('A6.4 tổng = nghe + đọc', totalNum === listening + reading, `${totalNum} ≠ ${listening}+${reading}`)
        practiceCorrect = Number((await page.text(sel('result-correct'))).replace(/[^\d]/g, ''))
        const wrong = Number((await page.text(sel('result-wrong'))).replace(/[^\d]/g, ''))
        const blank = Number((await page.text(sel('result-blank'))).replace(/[^\d]/g, ''))
        report.check('A6.5 đúng + sai + bỏ trống = 6', practiceCorrect + wrong + blank === 6, `${practiceCorrect}+${wrong}+${blank}`)
        report.check('A6.6 số câu bỏ trống = 0', blank === 0, `nhận ${blank}`)
        const accuracy = await page.text(sel('result-accuracy'))
        report.check('A6.7 có hiển thị độ chính xác', accuracy.length > 0, `nhận "${accuracy}"`)
      })

      await report.step('A7 xem lại bài làm', async () => {
        await page.click(sel('review-button'))
        await page.waitFor(sel('review'), 20000)
        const items = await page.count(sel('review-item'))
        report.check('A7.1 có 6 mục xem lại', items >= 6, `nhận ${items}`)
        const reviewText = await page.eval(`document.querySelector('${sel('review')}').textContent`)
        report.check('A7.2 phần xem lại nêu đáp án đúng', /đáp án/i.test(reviewText))
      })

      await report.step('A8 lưu lịch sử sau khi tải lại', async () => {
        const raw = await page.localStorage('toeic-lr/v1/history')
        report.check('A8.1 localStorage có lịch sử', Boolean(raw), 'không tìm thấy khoá lịch sử')
        const parsed = raw ? JSON.parse(raw) : []
        report.check('A8.2 lịch sử có ít nhất 1 bản ghi', Array.isArray(parsed) && parsed.length >= 1, `nhận ${parsed.length}`)
        report.check('A8.3 bản ghi có điểm ước lượng', Number(parsed?.[0]?.estimateTotal) >= 10, JSON.stringify(parsed?.[0] ?? null))
        await page.goto(`${url}#/history`)
        await page.waitFor(sel('history'), 20000)
        const rows = await page.count(sel('history-row'))
        report.check('A8.4 trang lịch sử hiện bản ghi', rows >= 1, `nhận ${rows}`)
        await screenshot('history', 'e2e')
      })

      // Đặt ở CUỐI nhánh A vì bước này tạo phiên MỚI (77 câu) và làm hỏng phiên
      // 6 câu mà A5–A8 đang dựa vào. Bản đầu đặt nó trước A5 nên A5 lặp theo số
      // câu cũ trong khi phiên đã đổi, khiến 71 câu bị bỏ trống.
      await report.step('A9 chế độ tổng số câu chia đúng tỉ lệ đề thật', async () => {
        // Chọn Part 1 + 2 + 5 + 6 rồi đòi đúng 77 câu — 77 là tổng số câu chính
        // thức của bốn part đó (6+25+30+16). Đây là yêu cầu thật của người dùng.
        await page.goto(`${url}#/practice`)
        await page.waitFor(sel('part-select'), 20000)
        for (const p of [3, 4, 7]) await page.click(sel(`part-toggle-${p}`))
        await page.click(sel('count-mode-total'))
        await page.type(sel('practice-total'), '77')
        const summary = await page.text(sel('practice-summary'))
        report.check('A9.1 tóm tắt ghi 77 câu', /\b77\b/u.test(summary), `nhận "${summary}"`)

        await page.click(sel('start-practice'))
        await page.waitFor(sel('session'), 20000)
        const counter = await page.text(sel('question-counter'))
        const total = Number(/(\d+)\s*$/u.exec(counter)?.[1] ?? 0)
        report.check('A9.2 phiên thật có đúng 77 câu', total === 77, `nhận ${total}`)

        // Phân bổ phải đúng 6/25/30/16 — không chỉ tổng đúng.
        const raw = await page.localStorage('toeic-lr/v1/session')
        const parsed = raw ? JSON.parse(raw) : null
        const ids = parsed?.questionIds ?? []
        const byPart = {}
        for (const id of ids) {
          const p = id.split('-')[0]
          byPart[p] = (byPart[p] ?? 0) + 1
        }
        report.equals(
          'A9.3 phân bổ đúng 6/25/30/16',
          { p1: byPart.p1, p2: byPart.p2, p5: byPart.p5, p6: byPart.p6 },
          { p1: 6, p2: 25, p5: 30, p6: 16 },
        )
      })

      // ── B. Chế độ thi thử ────────────────────────────────────────────────
      await report.step('B1 bắt đầu thi thử từ trang chủ', async () => {
        await page.clearLocalStorage()
        await page.goto(`${url}#/`)
        await page.waitFor(sel('home'), 20000)
        // Chờ hết transition màu của thanh nav (140ms) để ảnh không chụp giữa lúc chuyển tab.
        await new Promise((r) => setTimeout(r, 300))
        await screenshot('home', 'e2e')
        await page.click(sel('home-start-mock'))
        await page.waitFor(sel('session'), 20000)
        report.check('B1.1 vào được phiên thi thử', (await page.count(sel('session'))) === 1)
      })

      let mockTotal = 0
      await report.step('B2 thi thử không lộ đáp án', async () => {
        const counter = await page.text(sel('question-counter'))
        mockTotal = Number(/(\d+)\s*$/u.exec(counter)?.[1] ?? 0)
        report.check('B2.1 phiên thi thử có câu hỏi', mockTotal > 0, `nhận ${mockTotal}`)
        const timer = await page.text(sel('timer'))
        // Chấp nhận cả `mm:ss` và `h:mm:ss` — đặc tả formatClock cho phép cả hai.
        report.check('B2.2 thi thử có đồng hồ đếm ngược', /^(?:\d{1,3}:\d{2}|\d+:\d{2}:\d{2})$/.test(timer), `nhận "${timer}"`)
      })

      await report.step('B3 làm hết và nộp bài', async () => {
        for (let i = 0; i < mockTotal; i += 1) {
          await page.waitFor(sel('question'), 10000)
          await page.click(sel('choice-A'))
          if (i === 0) {
            await new Promise((r) => setTimeout(r, 250))
            const leaked = await page.count(sel('feedback'))
            report.check('B3.1 thi thử KHÔNG hiện giải thích khi đang làm', leaked === 0, `thấy ${leaked} ô phản hồi`)
          }
          if (i < mockTotal - 1) await page.click(sel('next-question'))
        }
        await page.click(sel('submit-session'))
        await page.waitFor(sel('result'), 20000)
        const total = Number((await page.text(sel('score-total'))).replace(/[^\d]/g, ''))
        report.check('B3.2 nộp bài thi thử ra điểm', total >= 10 && total <= 990, `nhận ${total}`)
        const blank = Number((await page.text(sel('result-blank'))).replace(/[^\d]/g, ''))
        report.check('B3.3 không còn câu bỏ trống', blank === 0, `nhận ${blank}`)
        await screenshot('result', 'e2e')
      })

      await report.step('B4 dọn phiên đang làm dở', async () => {
        const raw = await page.localStorage('toeic-lr/v1/session')
        const parsed = raw ? JSON.parse(raw) : null
        report.check('B4.1 phiên đã nộp được lưu ở trạng thái submitted', parsed?.status === 'submitted', JSON.stringify(parsed?.status ?? null))
      })

      await report.step('B5 không có lỗi console', async () => {
        const errors = page.consoleErrors
        report.check('B5.1 console không có lỗi', errors.length === 0, errors.join(' | ').slice(0, 400))
      })
    },
    { port: 5199, cdpPort: 9411 },
  )

  return report.summary()
}

const isMain = process.argv[1] && process.argv[1].endsWith('verify-core.mjs')
if (isMain) {
  runVerifyCore()
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


