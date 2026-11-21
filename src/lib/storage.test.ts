import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { SAMPLE_BANK } from './sample'
import { createSession } from './session'
import { DEFAULT_SETTINGS, STORAGE_KEYS } from './contract'
import type { HistoryEntry, Session, Settings } from './contract'
import {
  HISTORY_LIMIT,
  clearHistory,
  clearSession,
  loadHistory,
  loadSession,
  loadSettings,
  pushHistory,
  saveSession,
  saveSettings,
} from './storage'

const NOW = 1_700_000_000_000

/* ───────────────────────── localStorage giả cho môi trường Node ───────────────────────── */

interface FakeStore {
  data: Map<string, string>
  getItem: (key: string) => string | null
  setItem: (key: string, value: string) => void
  removeItem: (key: string) => void
  clear: () => void
  /** Bật để `setItem` ném lỗi (mô phỏng quota đầy). */
  failWrites: boolean
  /** Bật để `getItem`/`setItem` ném lỗi (mô phỏng storage bị chặn). */
  failAll: boolean
}

/**
 * Tạo `localStorage` giả đúng hình dạng Web Storage API.
 * Vitest chạy môi trường Node nên không có `localStorage` thật.
 */
function createFakeStore(): FakeStore {
  const data = new Map<string, string>()
  const store: FakeStore = {
    data,
    failWrites: false,
    failAll: false,
    getItem(key) {
      if (store.failAll) throw new Error('storage bị chặn')
      return data.has(key) ? data.get(key)! : null
    },
    setItem(key, value) {
      if (store.failAll) throw new Error('storage bị chặn')
      if (store.failWrites) throw new Error('quota exceeded')
      data.set(key, String(value))
    },
    removeItem(key) {
      if (store.failAll) throw new Error('storage bị chặn')
      data.delete(key)
    },
    clear() {
      data.clear()
    },
  }
  return store
}

let store: FakeStore

beforeEach(() => {
  store = createFakeStore()
  vi.stubGlobal('localStorage', store)
})

afterEach(() => {
  vi.unstubAllGlobals()
})

/* ──────────────────────────────────── Tiện ích ──────────────────────────────────── */

function makeSession(seed = 7): Session {
  return createSession(SAMPLE_BANK, { mode: 'practice', parts: [], seed, now: NOW })
}

function makeEntry(overrides: Partial<HistoryEntry> = {}): HistoryEntry {
  return {
    id: 'h-1',
    mode: 'practice',
    parts: [1, 2],
    finishedAt: NOW,
    correct: 5,
    total: 8,
    estimateTotal: 620,
    elapsedSeconds: 300,
    ...overrides,
  }
}

/* ──────────────────────────────────── Session ──────────────────────────────────── */

describe('saveSession / loadSession — lưu phiên đang làm dở', () => {
  it('lưu rồi đọc lại được đúng phiên', () => {
    const session = makeSession()
    saveSession(session)
    expect(loadSession()).toEqual(session)
  })

  it('ghi đúng khoá trong STORAGE_KEYS', () => {
    saveSession(makeSession())
    expect(store.data.has(STORAGE_KEYS.session)).toBe(true)
    expect(STORAGE_KEYS.session).toBe('toeic-lr/v1/session')
  })

  it('giữ nguyên đáp án null (câu đã bỏ trống) sau khi đọc lại', () => {
    const session = makeSession()
    const id = session.questionIds[0]!
    saveSession({ ...session, answers: { ...session.answers, [id]: null } })
    const loaded = loadSession()
    expect(loaded).not.toBeNull()
    expect(Object.prototype.hasOwnProperty.call(loaded!.answers, id)).toBe(true)
    expect(loaded!.answers[id]).toBeNull()
  })

  it('giữ nguyên cờ đánh dấu', () => {
    const session = makeSession()
    const saved: Session = { ...session, flagged: { [session.questionIds[0]!]: true } }
    saveSession(saved)
    expect(loadSession()!.flagged).toEqual(saved.flagged)
  })

  it('chưa lưu gì thì trả null', () => {
    expect(loadSession()).toBeNull()
  })

  it('JSON hỏng thì trả null, không throw', () => {
    store.data.set(STORAGE_KEYS.session, '{"không phải json')
    expect(() => loadSession()).not.toThrow()
    expect(loadSession()).toBeNull()
  })

  it('JSON hợp lệ nhưng không đúng hình dạng thì trả null', () => {
    store.data.set(STORAGE_KEYS.session, JSON.stringify({ id: 'x', mode: 'practice' }))
    expect(loadSession()).toBeNull()
  })

  it('thiếu trường bắt buộc (questionIds) thì trả null', () => {
    const session = makeSession() as unknown as Record<string, unknown>
    delete session.questionIds
    store.data.set(STORAGE_KEYS.session, JSON.stringify(session))
    expect(loadSession()).toBeNull()
  })

  it('answers chứa giá trị không phải letter thì trả null', () => {
    const session = makeSession()
    store.data.set(
      STORAGE_KEYS.session,
      JSON.stringify({ ...session, answers: { [session.questionIds[0]!]: 'Z' } }),
    )
    expect(loadSession()).toBeNull()
  })

  it('status lạ thì trả null', () => {
    const session = makeSession()
    store.data.set(STORAGE_KEYS.session, JSON.stringify({ ...session, status: 'pending' }))
    expect(loadSession()).toBeNull()
  })

  it('clearSession xoá dữ liệu', () => {
    saveSession(makeSession())
    expect(loadSession()).not.toBeNull()
    clearSession()
    expect(loadSession()).toBeNull()
    expect(store.data.has(STORAGE_KEYS.session)).toBe(false)
  })

  it('clearSession khi chưa có gì cũng không throw', () => {
    expect(() => clearSession()).not.toThrow()
  })
})

/* ──────────────────────────────────── History ──────────────────────────────────── */

describe('loadHistory / pushHistory / clearHistory', () => {
  it('chưa có gì thì trả mảng rỗng', () => {
    expect(loadHistory()).toEqual([])
  })

  it('pushHistory thêm bản ghi vào ĐẦU danh sách', () => {
    pushHistory(makeEntry({ id: 'h-1' }))
    const after = pushHistory(makeEntry({ id: 'h-2' }))
    expect(after.map((entry) => entry.id)).toEqual(['h-2', 'h-1'])
    expect(loadHistory().map((entry) => entry.id)).toEqual(['h-2', 'h-1'])
  })

  it('pushHistory trả về danh sách sau khi thêm', () => {
    const returned = pushHistory(makeEntry())
    expect(returned).toHaveLength(1)
    expect(returned[0]!.id).toBe('h-1')
  })

  it('giữ đúng dữ liệu từng bản ghi qua vòng lưu/đọc', () => {
    const entry = makeEntry({ id: 'h-abc', estimateTotal: 845 })
    pushHistory(entry)
    // Bản ghi đọc lên có thêm `scoringVersion` (mặc định 1 nếu lúc ghi không có),
    // nên so sánh từng trường thay vì so cả object.
    const loaded = loadHistory()[0]!
    expect(loaded.id).toBe(entry.id)
    expect(loaded.mode).toBe(entry.mode)
    expect(loaded.parts).toEqual(entry.parts)
    expect(loaded.correct).toBe(entry.correct)
    expect(loaded.total).toBe(entry.total)
    expect(loaded.estimateTotal).toBe(entry.estimateTotal)
    expect(loaded.elapsedSeconds).toBe(entry.elapsedSeconds)
    expect(loaded.scoringVersion).toBe(1)
  })

  it(`giữ tối đa ${HISTORY_LIMIT} bản ghi, bỏ bản ghi cũ nhất`, () => {
    for (let index = 0; index < HISTORY_LIMIT + 25; index += 1) {
      pushHistory(makeEntry({ id: `h-${index}`, finishedAt: NOW + index }))
    }
    const history = loadHistory()
    expect(history).toHaveLength(HISTORY_LIMIT)
    // Bản mới nhất ở đầu, bản cũ nhất bị đẩy ra.
    expect(history[0]!.id).toBe(`h-${HISTORY_LIMIT + 24}`)
    expect(history.some((entry) => entry.id === 'h-0')).toBe(false)
  })

  it('JSON hỏng thì trả mảng rỗng và lần push sau ghi lại sạch', () => {
    store.data.set(STORAGE_KEYS.history, 'không phải json')
    expect(() => loadHistory()).not.toThrow()
    expect(loadHistory()).toEqual([])
    expect(pushHistory(makeEntry())).toHaveLength(1)
  })

  it('dữ liệu không phải mảng thì trả mảng rỗng', () => {
    store.data.set(STORAGE_KEYS.history, JSON.stringify({ khong: 'phai mang' }))
    expect(loadHistory()).toEqual([])
  })

  it('bỏ bản ghi sai hình dạng nhưng giữ bản ghi hợp lệ', () => {
    store.data.set(
      STORAGE_KEYS.history,
      JSON.stringify([makeEntry({ id: 'good' }), { id: 'bad' }, null]),
    )
    const history = loadHistory()
    expect(history).toHaveLength(1)
    expect(history[0]!.id).toBe('good')
  })

  it('ghi đúng khoá lịch sử', () => {
    pushHistory(makeEntry())
    expect(store.data.has('toeic-lr/v1/history')).toBe(true)
  })

  it('clearHistory xoá sạch', () => {
    pushHistory(makeEntry())
    clearHistory()
    expect(loadHistory()).toEqual([])
    expect(store.data.has(STORAGE_KEYS.history)).toBe(false)
  })

  it('clearHistory khi chưa có gì không throw', () => {
    expect(() => clearHistory()).not.toThrow()
  })
})

/* ─────────────────────────────────── Settings ─────────────────────────────────── */

describe('loadSettings / saveSettings', () => {
  it('chưa có gì thì trả mặc định', () => {
    expect(loadSettings()).toEqual(DEFAULT_SETTINGS)
  })

  it('lưu rồi đọc lại đúng cài đặt', () => {
    const settings: Settings = {
      revealMode: false,
      audioEnabled: false,
      practiceCountPerPart: 25,
    }
    saveSettings(settings)
    expect(loadSettings()).toEqual(settings)
  })

  it('saveSettings trả về đúng bản đã ghi', () => {
    const settings: Settings = {
      revealMode: true,
      audioEnabled: false,
      practiceCountPerPart: 5,
    }
    expect(saveSettings(settings)).toEqual(settings)
  })

  it('ghi đúng khoá cài đặt', () => {
    saveSettings(DEFAULT_SETTINGS)
    expect(store.data.has('toeic-lr/v1/settings')).toBe(true)
  })

  it('JSON hỏng thì trả mặc định, không throw', () => {
    store.data.set(STORAGE_KEYS.settings, '{hỏng')
    expect(() => loadSettings()).not.toThrow()
    expect(loadSettings()).toEqual(DEFAULT_SETTINGS)
  })

  it('trường sai kiểu rơi về mặc định, trường đúng vẫn được giữ', () => {
    store.data.set(
      STORAGE_KEYS.settings,
      JSON.stringify({ revealMode: false, audioEnabled: 'có', practiceCountPerPart: 'nhiều' }),
    )
    const settings = loadSettings()
    expect(settings.revealMode).toBe(false)
    expect(settings.audioEnabled).toBe(DEFAULT_SETTINGS.audioEnabled)
    expect(settings.practiceCountPerPart).toBe(DEFAULT_SETTINGS.practiceCountPerPart)
  })

  it('practiceCountPerPart không dương thì rơi về mặc định', () => {
    store.data.set(
      STORAGE_KEYS.settings,
      JSON.stringify({ ...DEFAULT_SETTINGS, practiceCountPerPart: 0 }),
    )
    expect(loadSettings().practiceCountPerPart).toBe(
      DEFAULT_SETTINGS.practiceCountPerPart,
    )
  })

  it('practiceCountPerPart là số lẻ thì được làm tròn xuống', () => {
    store.data.set(
      STORAGE_KEYS.settings,
      JSON.stringify({ ...DEFAULT_SETTINGS, practiceCountPerPart: 12.9 }),
    )
    expect(loadSettings().practiceCountPerPart).toBe(12)
  })
})

/* ────────────────────────── Storage hỏng / bị chặn: KHÔNG throw ────────────────────────── */

describe('storage bị chặn hoặc đầy quota — mọi hàm trả mặc định, không throw', () => {
  it('setItem ném lỗi quota: saveSession/saveSettings/pushHistory không throw', () => {
    store.failWrites = true
    expect(() => saveSession(makeSession())).not.toThrow()
    expect(() => saveSettings(DEFAULT_SETTINGS)).not.toThrow()
    expect(() => pushHistory(makeEntry())).not.toThrow()
  })

  it('setItem ném lỗi quota: saveSettings vẫn trả bản chuẩn hoá để UI dùng tiếp', () => {
    store.failWrites = true
    const settings: Settings = {
      revealMode: false,
      audioEnabled: true,
      practiceCountPerPart: 15,
    }
    expect(saveSettings(settings)).toEqual(settings)
  })

  it('mọi thao tác ném lỗi: đọc trả mặc định', () => {
    store.failAll = true
    expect(loadSession()).toBeNull()
    expect(loadHistory()).toEqual([])
    expect(loadSettings()).toEqual(DEFAULT_SETTINGS)
    expect(() => saveSession(makeSession())).not.toThrow()
    expect(() => clearSession()).not.toThrow()
    expect(() => clearHistory()).not.toThrow()
  })

  it('getter localStorage ném SecurityError: mọi hàm vẫn an toàn', () => {
    vi.unstubAllGlobals()
    Object.defineProperty(globalThis, 'localStorage', {
      configurable: true,
      get() {
        throw new Error('SecurityError: localStorage bị chặn')
      },
    })

    expect(loadSession()).toBeNull()
    expect(loadHistory()).toEqual([])
    expect(loadSettings()).toEqual(DEFAULT_SETTINGS)
    expect(() => saveSession(makeSession())).not.toThrow()
    expect(() => saveSettings(DEFAULT_SETTINGS)).not.toThrow()
    expect(() => pushHistory(makeEntry())).not.toThrow()
    expect(() => clearSession()).not.toThrow()
    expect(() => clearHistory()).not.toThrow()

    delete (globalThis as { localStorage?: unknown }).localStorage
  })

  it('không có localStorage (môi trường Node thuần): mọi hàm vẫn an toàn', () => {
    vi.unstubAllGlobals()
    delete (globalThis as { localStorage?: unknown }).localStorage

    expect(loadSession()).toBeNull()
    expect(loadHistory()).toEqual([])
    expect(loadSettings()).toEqual(DEFAULT_SETTINGS)
    expect(() => saveSession(makeSession())).not.toThrow()
    expect(() => pushHistory(makeEntry())).not.toThrow()
  })
})
