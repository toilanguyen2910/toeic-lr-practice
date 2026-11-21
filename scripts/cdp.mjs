/**
 * BỘ KHUNG KIỂM THỬ THẬT TRÊN CHROME (CDP) — không dùng Playwright/Puppeteer.
 *
 * Cách hoạt động:
 *   1. Khởi động Vite dev server (`npx vite --port <port>`), chờ server sẵn sàng.
 *   2. Khởi động Chrome headless kèm `--remote-debugging-port`.
 *   3. Nói chuyện trực tiếp với Chrome qua Chrome DevTools Protocol (WebSocket có
 *      sẵn trong Node 22 nên không cần thêm phụ thuộc nào).
 *   4. Chạy kịch bản kiểm thử, chụp ảnh màn hình, dọn dẹp tiến trình.
 *
 * Đây là "test trên web thực tế": DOM thật, React thật, localStorage thật.
 */
import { spawn } from 'node:child_process'
import { existsSync, mkdirSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')

const CHROME_CANDIDATES = [
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
]

export function findChrome() {
  for (const p of CHROME_CANDIDATES) if (existsSync(p)) return p
  throw new Error('Không tìm thấy Chrome/Edge trên máy. Đặt biến CHROME_PATH để chỉ định.')
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

async function waitForHttp(url, timeoutMs, label) {
  const deadline = Date.now() + timeoutMs
  let lastErr = null
  while (Date.now() < deadline) {
    try {
      const res = await fetch(url)
      if (res.ok) return true
      lastErr = new Error(`HTTP ${res.status}`)
    } catch (err) {
      lastErr = err
    }
    await sleep(150)
  }
  throw new Error(`${label} không sẵn sàng sau ${timeoutMs}ms: ${lastErr?.message ?? 'unknown'}`)
}

/** Client CDP tối giản: gửi lệnh, chờ phản hồi, nhận sự kiện. */
class Cdp {
  #ws
  #nextId = 1
  #pending = new Map()
  #listeners = new Map()

  static async connect(wsUrl) {
    const client = new Cdp()
    await client.#open(wsUrl)
    return client
  }

  #open(wsUrl) {
    return new Promise((resolve, reject) => {
      const ws = new WebSocket(wsUrl)
      this.#ws = ws
      ws.addEventListener('open', () => resolve())
      ws.addEventListener('error', (e) => reject(new Error(`WebSocket lỗi: ${e.message ?? 'unknown'}`)))
      ws.addEventListener('message', (event) => {
        let msg
        try {
          msg = JSON.parse(event.data)
        } catch {
          return
        }
        if (msg.id && this.#pending.has(msg.id)) {
          const { resolve: res, reject: rej, method } = this.#pending.get(msg.id)
          this.#pending.delete(msg.id)
          if (msg.error) rej(new Error(`${method}: ${msg.error.message} (code ${msg.error.code})`))
          else res(msg.result)
          return
        }
        if (msg.method) {
          for (const fn of this.#listeners.get(msg.method) ?? []) fn(msg.params, msg.sessionId)
        }
      })
    })
  }

  on(method, fn) {
    if (!this.#listeners.has(method)) this.#listeners.set(method, [])
    this.#listeners.get(method).push(fn)
    return () => {
      const arr = this.#listeners.get(method) ?? []
      const i = arr.indexOf(fn)
      if (i >= 0) arr.splice(i, 1)
    }
  }

  send(method, params = {}, sessionId, timeoutMs = 20000) {
    const id = this.#nextId++
    const payload = { id, method, params }
    if (sessionId) payload.sessionId = sessionId
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        this.#pending.delete(id)
        reject(new Error(`${method} quá hạn ${timeoutMs}ms`))
      }, timeoutMs)
      this.#pending.set(id, {
        method,
        resolve: (v) => {
          clearTimeout(timer)
          resolve(v)
        },
        reject: (e) => {
          clearTimeout(timer)
          reject(e)
        },
      })
      this.#ws.send(JSON.stringify(payload))
    })
  }

  close() {
    try {
      this.#ws?.close()
    } catch {
      /* bỏ qua */
    }
  }
}

/**
 * Mở một phiên kiểm thử trọn gói.
 *
 * `options.mode`:
 * - `'dev'` (mặc định) — chạy Vite dev server, phục vụ mã nguồn chưa đóng gói.
 * - `'preview'` — chạy `vite preview`, phục vụ thư mục `dist/` đã build. Dùng để
 *   kiểm đúng thứ sẽ đưa lên Vercel: bundle đã minify, asset đã copy, đường dẫn
 *   tương đối thật.
 *
 * @param {(ctx: {page: PageApi, url: string, screenshot: Function}) => Promise<void>} run
 */
export async function withBrowser(run, options = {}) {
  const port = options.port ?? 5199
  const cdpPort = options.cdpPort ?? 9411
  const mode = options.mode ?? 'dev'
  const profileDir = join(ROOT, 'node_modules', '.tmp', `cdp-profile-${process.pid}`)
  const chrome = options.chromePath ?? process.env.CHROME_PATH ?? findChrome()

  mkdirSync(profileDir, { recursive: true })

  const viteArgs =
    mode === 'preview'
      ? [
          join(ROOT, 'node_modules', 'vite', 'bin', 'vite.js'),
          'preview',
          '--port',
          String(port),
          '--strictPort',
          '--host',
          '127.0.0.1',
        ]
      : [
          join(ROOT, 'node_modules', 'vite', 'bin', 'vite.js'),
          '--port',
          String(port),
          '--strictPort',
          '--host',
          '127.0.0.1',
        ]

  const vite = spawn(process.execPath, viteArgs, {
    cwd: ROOT,
    stdio: 'ignore',
    windowsHide: true,
  })

  let browser = null
  const cleanup = []
  try {
    await waitForHttp(`http://127.0.0.1:${port}/`, 60000, 'Vite dev server')

    browser = spawn(
      chrome,
      [
        '--headless=new',
        `--remote-debugging-port=${cdpPort}`,
        `--user-data-dir=${profileDir}`,
        '--no-first-run',
        '--no-default-browser-check',
        '--disable-extensions',
        '--disable-background-networking',
        '--disable-sync',
        '--hide-scrollbars',
        '--window-size=1440,960',
        'about:blank',
      ],
      { stdio: 'ignore', windowsHide: true },
    )
    cleanup.push(() => browser?.kill())

    const version = await (async () => {
      const deadline = Date.now() + 30000
      while (Date.now() < deadline) {
        try {
          const res = await fetch(`http://127.0.0.1:${cdpPort}/json/version`)
          if (res.ok) return res.json()
        } catch {
          /* chờ tiếp */
        }
        await sleep(200)
      }
      throw new Error('Chrome không mở cổng debug')
    })()

    const cdp = await Cdp.connect(version.webSocketDebuggerUrl)
    cleanup.push(() => cdp.close())

    const { targetId } = await cdp.send('Target.createTarget', { url: 'about:blank' })
    const { sessionId } = await cdp.send('Target.attachToTarget', { targetId, flatten: true })
    const page = new PageApi(cdp, sessionId, options)
    cleanup.push(async () => {
      try {
        await cdp.send('Target.closeTarget', { targetId })
      } catch {
        /* bỏ qua */
      }
    })

    await page.send('Page.enable')
    await page.send('Runtime.enable')
    await page.send('Log.enable')

    const screenshot = async (name, subdir = '') => {
      const shot = await page.send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false })
      const dir = subdir
        ? join(ROOT, 'docs', 'screenshots', subdir)
        : join(ROOT, 'docs', 'screenshots')
      mkdirSync(dir, { recursive: true })
      const file = join(dir, `${name}.png`)
      writeFileSync(file, Buffer.from(shot.data, 'base64'))
      return file
    }

    const outcome = await run({
      page,
      url: `http://127.0.0.1:${port}/`,
      screenshot,
      browserVersion: version.Browser,
    })
    return outcome
  } finally {
    for (const fn of cleanup.reverse()) {
      try {
        await fn()
      } catch {
        /* bỏ qua */
      }
    }
    try {
      vite.kill()
    } catch {
      /* bỏ qua */
    }
    // Chờ tiến trình con thoát hẳn rồi mới trả quyền điều khiển.
    await sleep(400)
    if (process.platform === 'win32') {
      try {
        spawn('taskkill', ['/pid', String(vite.pid), '/T', '/F'], { stdio: 'ignore', windowsHide: true })
      } catch {
        /* bỏ qua */
      }
    }
  }
}

/** Lớp thao tác trang: điều hướng, chờ, click, gõ, đọc DOM, chụp ảnh. */
export class PageApi {
  #cdp
  #sessionId
  #consoleErrors = []

  constructor(cdp, sessionId, _options = {}) {
    this.#cdp = cdp
    this.#sessionId = sessionId
    cdp.on('Runtime.consoleAPICalled', (params) => {
      if (params.type === 'error') {
        this.#consoleErrors.push(
          params.args.map((a) => a.value ?? a.description ?? a.type).join(' '),
        )
      }
    })
    cdp.on('Runtime.exceptionThrown', (params) => {
      this.#consoleErrors.push(
        params.exceptionDetails?.exception?.description ??
          params.exceptionDetails?.text ??
          'exception không rõ',
      )
    })
  }

  get consoleErrors() {
    return [...this.#consoleErrors]
  }

  send(method, params, timeoutMs) {
    return this.#cdp.send(method, params, this.#sessionId, timeoutMs)
  }

  async goto(url) {
    await this.send('Page.navigate', { url })
    await this.waitForFunction('document.readyState === "complete"', 'trang tải xong', 20000)
  }

  /** Chạy biểu thức trong trang và trả về giá trị JSON. */
  async eval(expression, timeoutMs = 15000) {
    const res = await this.send(
      'Runtime.evaluate',
      { expression, returnByValue: true, awaitPromise: true, userGesture: true },
      timeoutMs,
    )
    if (res.exceptionDetails) {
      throw new Error(
        `Lỗi khi chạy trong trang: ${
          res.exceptionDetails.exception?.description ?? res.exceptionDetails.text
        }`,
      )
    }
    return res.result.value
  }

  async waitForFunction(expression, label, timeoutMs = 10000) {
    const deadline = Date.now() + timeoutMs
    let lastErr = null
    while (Date.now() < deadline) {
      try {
        if (await this.eval(`Boolean(${expression})`, 5000)) return true
      } catch (err) {
        lastErr = err
      }
      await sleep(80)
    }
    throw new Error(`Hết thời gian chờ ${label} (${timeoutMs}ms)${lastErr ? `: ${lastErr.message}` : ''}`)
  }

  waitFor(selector, timeoutMs = 10000) {
    return this.waitForFunction(
      `document.querySelector(${JSON.stringify(selector)})`,
      `phần tử ${selector}`,
      timeoutMs,
    )
  }

  waitForText(selector, expected, timeoutMs = 10000) {
    return this.waitForFunction(
      `(document.querySelector(${JSON.stringify(selector)})?.textContent ?? '').includes(${JSON.stringify(expected)})`,
      `"${expected}" trong ${selector}`,
      timeoutMs,
    )
  }

  text(selector) {
    return this.eval(
      `(document.querySelector(${JSON.stringify(selector)})?.textContent ?? '').trim()`,
    )
  }

  count(selector) {
    return this.eval(`document.querySelectorAll(${JSON.stringify(selector)}).length`)
  }

  attr(selector, name) {
    return this.eval(
      `document.querySelector(${JSON.stringify(selector)})?.getAttribute(${JSON.stringify(name)}) ?? null`,
    )
  }

  /** Click bằng sự kiện chuột thật để React nhận đúng. */
  async click(selector, timeoutMs = 10000) {
    await this.waitFor(selector, timeoutMs)
    await this.eval(`(() => {
      const el = document.querySelector(${JSON.stringify(selector)});
      const r = el.getBoundingClientRect();
      el.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, clientX: r.x + r.width / 2, clientY: r.y + r.height / 2 }));
      el.dispatchEvent(new MouseEvent('mouseup', { bubbles: true, clientX: r.x + r.width / 2, clientY: r.y + r.height / 2 }));
      el.click();
      return true;
    })()`)
    await sleep(60)
  }

  /** Gõ vào ô input theo cách React hiểu được. */
  async type(selector, value, timeoutMs = 10000) {
    await this.waitFor(selector, timeoutMs)
    await this.eval(`(() => {
      const el = document.querySelector(${JSON.stringify(selector)});
      const proto = el instanceof HTMLTextAreaElement ? HTMLTextAreaElement.prototype
        : el instanceof HTMLSelectElement ? HTMLSelectElement.prototype : HTMLInputElement.prototype;
      const setter = Object.getOwnPropertyDescriptor(proto, 'value').set;
      setter.call(el, ${JSON.stringify(String(value))});
      el.dispatchEvent(new Event('input', { bubbles: true }));
      el.dispatchEvent(new Event('change', { bubbles: true }));
      return true;
    })()`)
    await sleep(60)
  }

  localStorage(key) {
    return this.eval(`window.localStorage.getItem(${JSON.stringify(key)})`)
  }

  setLocalStorage(key, value) {
    return this.eval(
      `(window.localStorage.setItem(${JSON.stringify(key)}, ${JSON.stringify(value)}), true)`,
    )
  }

  clearLocalStorage() {
    return this.eval('(window.localStorage.clear(), true)')
  }

  reload() {
    return this.send('Page.reload', { ignoreCache: true })
  }

  setViewport(width, height) {
    return this.send('Emulation.setDeviceMetricsOverride', {
      width,
      height,
      deviceScaleFactor: 1,
      mobile: false,
    })
  }
}

/**
 * Bộ đếm kết quả kiểm thử nhỏ gọn, in ra dòng `ok`/`FAIL` rõ ràng.
 */
export function createReporter(title) {
  let passed = 0
  const failures = []
  const logs = []

  return {
    title,
    get passed() {
      return passed
    },
    get failures() {
      return failures
    },
    get logs() {
      return logs
    },
    check(name, condition, detail) {
      if (condition) {
        passed += 1
        logs.push(`ok   ${name}`)
      } else {
        const message = detail ? `${name} — ${detail}` : name
        failures.push(message)
        logs.push(`FAIL ${name}${detail ? ` — ${detail}` : ''}`)
      }
    },
    equals(name, actual, expected) {
      const ok = JSON.stringify(actual) === JSON.stringify(expected)
      this.check(name, ok, ok ? undefined : `nhận ${JSON.stringify(actual)}, mong đợi ${JSON.stringify(expected)}`)
    },
    async step(name, fn) {
      try {
        await fn()
      } catch (err) {
        failures.push(`${name} lỗi: ${err.message}`)
        logs.push(`FAIL ${name} lỗi: ${err.message}`)
      }
    },
    summary() {
      return {
        title,
        passed,
        failed: failures.length,
        failures,
        logs,
      }
    },
  }
}
