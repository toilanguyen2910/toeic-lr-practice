/**
 * STORAGE — lớp bền vững duy nhất của app, bọc quanh `localStorage`.
 *
 * Nguyên tắc số 1: KHÔNG BAO GIỜ NÉM LỖI.
 * `localStorage` có thể bị chặn (chế độ riêng tư, iframe sandbox, quota đầy) hoặc
 * chứa JSON hỏng do phiên bản cũ. Mọi trường hợp đó đều trả về giá trị mặc định
 * để UI vẫn chạy được thay vì trắng trang.
 *
 * Nguyên tắc số 2: dữ liệu đọc lên phải được KIỂM TRA HÌNH DẠNG. Không tin
 * `JSON.parse` — một object thiếu `answers` sẽ làm hỏng cả màn hình làm bài.
 */
import type { Letter, Part } from '../types'
import type { HistoryEntry, Session, Settings } from './contract'
import { DEFAULT_SETTINGS, STORAGE_KEYS } from './contract'

/** Số bản ghi lịch sử tối đa được giữ lại. */
export const HISTORY_LIMIT = 100

const PART_VALUES: readonly number[] = [1, 2, 3, 4, 5, 6, 7]
const LETTER_VALUES: readonly string[] = ['A', 'B', 'C', 'D']
const MODE_VALUES: readonly string[] = ['practice', 'mock']
const STATUS_VALUES: readonly string[] = ['active', 'submitted']

/**
 * Lấy `localStorage` nếu dùng được.
 *
 * Truy cập được bọc trong try/catch vì chỉ CẦN CHẠM vào `localStorage` là trình
 * duyệt cũng có thể ném `SecurityError` khi cookie bị chặn.
 */
function getStorage(): Storage | null {
  try {
    const store = (globalThis as { localStorage?: Storage | null }).localStorage
    return store ?? null
  } catch {
    return null
  }
}

/** Đọc chuỗi thô; `null` khi không có khoá, không có storage, hoặc bị chặn. */
function readRaw(key: string): string | null {
  const store = getStorage()
  if (!store) return null
  try {
    return store.getItem(key)
  } catch {
    return null
  }
}

/** Ghi chuỗi; trả về `true` nếu ghi thành công. Nuốt mọi lỗi (quota, bị chặn…). */
function writeRaw(key: string, value: string): boolean {
  const store = getStorage()
  if (!store) return false
  try {
    store.setItem(key, value)
    return true
  } catch {
    return false
  }
}

/** Xoá một khoá; nuốt mọi lỗi. */
function removeRaw(key: string): void {
  const store = getStorage()
  if (!store) return
  try {
    store.removeItem(key)
  } catch {
    /* localStorage bị chặn — coi như đã xoá. */
  }
}

/** `JSON.parse` an toàn: trả `undefined` thay vì ném khi chuỗi hỏng. */
function parseJsonSafe(raw: string | null): unknown {
  if (raw === null) return undefined
  try {
    const parsed: unknown = JSON.parse(raw)
    return parsed ?? undefined
  } catch {
    return undefined
  }
}

/** `JSON.stringify` an toàn cho dữ liệu thuần (không vòng lặp, không BigInt). */
function stringifySafe(value: unknown): string | null {
  try {
    return JSON.stringify(value)
  } catch {
    return null
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value)
}

function isPart(value: unknown): value is Part {
  return isFiniteNumber(value) && PART_VALUES.includes(value)
}

function isLetter(value: unknown): value is Letter {
  return typeof value === 'string' && LETTER_VALUES.includes(value)
}

/** Mảng part hợp lệ: mọi phần tử phải là part, sắp xếp tăng dần, bỏ trùng. */
function parseParts(value: unknown): Part[] | null {
  if (!Array.isArray(value)) return null
  const parts: Part[] = []
  for (const item of value) {
    if (!isPart(item)) return null
    if (!parts.includes(item)) parts.push(item)
  }
  return parts.sort((a, b) => a - b)
}

/** `Record<string, Letter | null>` — giữ nguyên key `null` (câu đã bỏ trống). */
function parseAnswers(value: unknown): Record<string, Letter | null> | null {
  if (!isRecord(value)) return null
  const answers: Record<string, Letter | null> = {}
  for (const [key, raw] of Object.entries(value)) {
    if (raw === null) {
      answers[key] = null
    } else if (isLetter(raw)) {
      answers[key] = raw
    } else {
      return null
    }
  }
  return answers
}

/** `Record<string, true>` — chỉ chấp nhận giá trị `true`, bỏ qua key rác. */
function parseFlagged(value: unknown): Record<string, true> | null {
  if (!isRecord(value)) return null
  const flagged: Record<string, true> = {}
  for (const [key, raw] of Object.entries(value)) {
    if (raw === true) flagged[key] = true
  }
  return flagged
}

function parseStringArray(value: unknown): string[] | null {
  if (!Array.isArray(value)) return null
  const out: string[] = []
  for (const item of value) {
    if (typeof item !== 'string') return null
    out.push(item)
  }
  return out
}

/**
 * Kiểm tra một object bất kỳ có đúng hình dạng `Session` không.
 * Trả về `Session` đã chuẩn hoá, hoặc `null` nếu thiếu/sai trường bắt buộc.
 */
export function parseSession(value: unknown): Session | null {
  if (!isRecord(value)) return null

  const {
    id,
    mode,
    parts: rawParts,
    createdAt,
    durationSeconds,
    questionIds: rawQuestionIds,
    answers: rawAnswers,
    flagged: rawFlagged,
    revealMode,
    status,
    submittedAt,
    elapsedSeconds,
  } = value

  if (typeof id !== 'string' || id.length === 0) return null
  if (typeof mode !== 'string' || !MODE_VALUES.includes(mode)) return null
  if (typeof status !== 'string' || !STATUS_VALUES.includes(status)) return null
  if (!isFiniteNumber(createdAt)) return null
  if (!isFiniteNumber(elapsedSeconds)) return null
  if (typeof revealMode !== 'boolean') return null
  if (durationSeconds !== null && !isFiniteNumber(durationSeconds)) return null
  if (submittedAt !== undefined && !isFiniteNumber(submittedAt)) return null

  const parts = parseParts(rawParts)
  if (!parts) return null
  const questionIds = parseStringArray(rawQuestionIds)
  if (!questionIds) return null
  const answers = parseAnswers(rawAnswers)
  if (!answers) return null
  const flagged = parseFlagged(rawFlagged)
  if (!flagged) return null

  const session: Session = {
    id,
    mode: mode as Session['mode'],
    parts,
    createdAt,
    durationSeconds,
    questionIds,
    answers,
    flagged,
    revealMode,
    status: status as Session['status'],
    elapsedSeconds,
  }
  if (submittedAt !== undefined) session.submittedAt = submittedAt
  return session
}

/** Kiểm tra một object có đúng hình dạng `HistoryEntry` không. */
export function parseHistoryEntry(value: unknown): HistoryEntry | null {
  if (!isRecord(value)) return null

  const {
    id,
    mode,
    parts: rawParts,
    finishedAt,
    correct,
    total,
    estimateTotal,
    elapsedSeconds,
  } = value

  if (typeof id !== 'string' || id.length === 0) return null
  if (typeof mode !== 'string' || !MODE_VALUES.includes(mode)) return null
  if (!isFiniteNumber(finishedAt)) return null
  if (!isFiniteNumber(correct)) return null
  if (!isFiniteNumber(total)) return null
  if (!isFiniteNumber(estimateTotal)) return null
  if (!isFiniteNumber(elapsedSeconds)) return null

  const parts = parseParts(rawParts)
  if (!parts) return null

  return {
    id,
    mode: mode as HistoryEntry['mode'],
    parts,
    finishedAt,
    correct,
    total,
    estimateTotal,
    elapsedSeconds,
  }
}

/**
 * Chuẩn hoá cài đặt: trường nào sai kiểu thì rơi về mặc định, không vứt cả object.
 * `practiceCountPerPart` được kẹp về số nguyên dương để UI không vỡ khi chia trang.
 */
export function parseSettings(value: unknown): Settings {
  if (!isRecord(value)) return { ...DEFAULT_SETTINGS }

  const { revealMode, audioEnabled, practiceCountPerPart } = value
  const count =
    isFiniteNumber(practiceCountPerPart) && practiceCountPerPart > 0
      ? Math.max(1, Math.floor(practiceCountPerPart))
      : DEFAULT_SETTINGS.practiceCountPerPart

  return {
    revealMode:
      typeof revealMode === 'boolean' ? revealMode : DEFAULT_SETTINGS.revealMode,
    audioEnabled:
      typeof audioEnabled === 'boolean' ? audioEnabled : DEFAULT_SETTINGS.audioEnabled,
    practiceCountPerPart: count,
  }
}

/* ────────────────────────────── Phiên đang làm dở ────────────────────────────── */

/** Lưu phiên đang làm dở để nút "Tiếp tục" hoạt động sau khi tải lại trang. */
export function saveSession(session: Session): void {
  const payload = stringifySafe(session)
  if (payload === null) return
  writeRaw(STORAGE_KEYS.session, payload)
}

/**
 * Đọc phiên đang làm dở.
 * Trả `null` khi: không có dữ liệu, JSON hỏng, hoặc object sai hình dạng.
 */
export function loadSession(): Session | null {
  return parseSession(parseJsonSafe(readRaw(STORAGE_KEYS.session)))
}

/** Xoá phiên đang làm dở. */
export function clearSession(): void {
  removeRaw(STORAGE_KEYS.session)
}

/* ──────────────────────────────── Lịch sử luyện tập ─────────────────────────────── */

/** Đọc lịch sử; luôn trả mảng (rỗng nếu thiếu/hỏng) và bỏ bản ghi sai hình dạng. */
export function loadHistory(): HistoryEntry[] {
  const parsed = parseJsonSafe(readRaw(STORAGE_KEYS.history))
  if (!Array.isArray(parsed)) return []
  const entries: HistoryEntry[] = []
  for (const item of parsed) {
    const entry = parseHistoryEntry(item)
    if (entry) entries.push(entry)
  }
  return entries
}

/** Ghi đè toàn bộ lịch sử; lỗi storage thì im lặng bỏ qua. */
function writeHistory(entries: HistoryEntry[]): void {
  const payload = stringifySafe(entries)
  if (payload === null) return
  writeRaw(STORAGE_KEYS.history, payload)
}

/**
 * Thêm một bản ghi vào ĐẦU lịch sử và giữ tối đa `HISTORY_LIMIT` bản ghi.
 * Trả về danh sách sau khi thêm để UI cập nhật ngay mà không phải đọc lại.
 */
export function pushHistory(entry: HistoryEntry): HistoryEntry[] {
  const valid = parseHistoryEntry(entry)
  const next = valid ? [valid, ...loadHistory()] : loadHistory()
  const trimmed = next.slice(0, HISTORY_LIMIT)
  writeHistory(trimmed)
  return trimmed
}

/** Xoá sạch lịch sử. */
export function clearHistory(): void {
  removeRaw(STORAGE_KEYS.history)
}

/* ──────────────────────────────────── Cài đặt ──────────────────────────────────── */

/** Đọc cài đặt; thiếu hoặc hỏng thì trả về mặc định (không bao giờ trả null). */
export function loadSettings(): Settings {
  return parseSettings(parseJsonSafe(readRaw(STORAGE_KEYS.settings)))
}

/** Lưu cài đặt và trả về bản đã chuẩn hoá (đúng những gì thực sự được ghi). */
export function saveSettings(settings: Settings): Settings {
  const normalized = parseSettings(settings)
  const payload = stringifySafe(normalized)
  if (payload !== null) writeRaw(STORAGE_KEYS.settings, payload)
  return normalized
}
