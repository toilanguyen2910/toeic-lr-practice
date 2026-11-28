/**
 * ENGINE TỪ VỰNG — chọn từ, ghi nhận kết quả, tổng hợp tiến độ.
 *
 * Hàm thuần (trừ nhóm storage): chỉ đọc tham số, trả giá trị mới, không sửa đầu
 * vào, không chạm DOM. Nhờ vậy Vitest chạy được trong Node mà không cần trình
 * duyệt, và UI chỉ là lớp mỏng hiển thị.
 */
import type {
  LeitnerBox,
  VocabBank,
  VocabProgress,
  VocabSettings,
  VocabSummary,
  VocabTopic,
  VocabWord,
  WordProgress,
} from '../types-vocab'
import { BOX_INTERVAL_DAYS, DEFAULT_VOCAB_SETTINGS, VOCAB_STORAGE_KEYS } from '../types-vocab'

const MS_PER_DAY = 24 * 60 * 60 * 1000
const MAX_BOX: LeitnerBox = 5
const MIN_BOX: LeitnerBox = 1

/** Tiến độ mặc định cho một từ chưa học lần nào. */
function freshProgress(now: number): WordProgress {
  return { box: MIN_BOX, nextReviewAt: now, correct: 0, wrong: 0, lastSeenAt: 0 }
}

/** Kẹp hộp trong 1..5. */
function clampBox(value: number): LeitnerBox {
  if (!Number.isFinite(value)) return MIN_BOX
  const box = Math.round(value)
  if (box <= 1) return 1
  if (box >= 5) return 5
  return box as LeitnerBox
}

/**
 * Tổng hợp tiến độ cho màn hình chủ đề và trang chủ.
 *
 * `dueToday` đếm cả từ CHƯA HỌC LẦN NÀO — vì đó là từ cần học hôm nay. Tách
 * riêng `untouched` để UI hiện được "N từ mới".
 */
export function summarizeProgress(
  bank: VocabBank,
  progress: VocabProgress,
  now: number,
): VocabSummary {
  let started = 0
  let mastered = 0
  let dueToday = 0
  let untouched = 0

  for (const word of bank.words) {
    const entry = progress[word.id]
    if (!entry) {
      untouched += 1
      dueToday += 1
      continue
    }
    started += 1
    if (entry.box >= MAX_BOX) mastered += 1
    if (entry.nextReviewAt <= now) dueToday += 1
  }

  return { totalWords: bank.words.length, started, mastered, dueToday, untouched }
}

/**
 * Chọn từ cho một lượt ôn.
 *
 * Thứ tự ưu tiên:
 * 1. Từ đã đến hạn ôn (`nextReviewAt <= now`), hộp THẤP trước — hộp thấp nghĩa
 *    là hay quên, cần gặp lại sớm nhất.
 * 2. Từ chưa học lần nào.
 * 3. Từ đã thuộc nhưng chưa đến hạn (chỉ lấy khi vẫn còn chỗ).
 *
 * Trong mỗi nhóm, giữ thứ tự xuất hiện trong ngân hàng để kết quả tất định —
 * cùng đầu vào cho cùng đầu ra, test lặp lại được.
 */
export function pickDueWords(
  bank: VocabBank,
  progress: VocabProgress,
  now: number,
  limit: number,
): VocabWord[] {
  const cap = Number.isFinite(limit) ? Math.max(0, Math.floor(limit)) : 0
  if (cap === 0) return []

  const due: Array<{ word: VocabWord; box: LeitnerBox; order: number }> = []
  const fresh: Array<{ word: VocabWord; order: number }> = []
  const later: Array<{ word: VocabWord; order: number }> = []

  bank.words.forEach((word, order) => {
    const entry = progress[word.id]
    if (!entry) {
      fresh.push({ word, order })
      return
    }
    if (entry.nextReviewAt <= now) {
      due.push({ word, box: entry.box, order })
      return
    }
    later.push({ word, order })
  })

  due.sort((a, b) => (a.box === b.box ? a.order - b.order : a.box - b.box))
  fresh.sort((a, b) => a.order - b.order)
  later.sort((a, b) => a.order - b.order)

  const picked: VocabWord[] = []
  for (const item of due) {
    if (picked.length >= cap) break
    picked.push(item.word)
  }
  for (const item of fresh) {
    if (picked.length >= cap) break
    picked.push(item.word)
  }
  for (const item of later) {
    if (picked.length >= cap) break
    picked.push(item.word)
  }
  return picked
}

/**
 * Ghi nhận kết quả một từ.
 *
 * Trả về tiến độ MỚI. `known = true` lên một hộp; `false` về hộp 1. Không sửa
 * object truyền vào — nhờ vậy React so sánh tham chiếu là biết cần render lại.
 */
export function recordAnswer(
  progress: VocabProgress,
  wordId: string,
  known: boolean,
  now: number,
): VocabProgress {
  const previous = progress[wordId] ?? freshProgress(now)
  const nextBox: LeitnerBox = known ? clampBox(previous.box + 1) : MIN_BOX
  const intervalDays = BOX_INTERVAL_DAYS[nextBox]

  const next: WordProgress = {
    box: nextBox,
    nextReviewAt: now + intervalDays * MS_PER_DAY,
    correct: previous.correct + (known ? 1 : 0),
    wrong: previous.wrong + (known ? 0 : 1),
    lastSeenAt: now,
  }

  return { ...progress, [wordId]: next }
}

/**
 * Tạo 4 lựa chọn trắc nghiệm: 1 đúng + 3 nhiễu.
 *
 * Nhiễu lấy từ CÙNG CHỦ ĐỀ trước, vì chọn nhầm giữa các từ cùng chủ đề khó hơn
 * và có ích hơn. Nếu chủ đề đó ít từ quá thì bù từ toàn ngân hàng.
 *
 * `random` được truyền vào để test tất định.
 */
export function buildQuizChoices(
  bank: VocabBank,
  word: VocabWord,
  random: () => number,
): Array<{ wordId: string; text: string; correct: boolean }> {
  const sameTopic = bank.words.filter((w) => w.id !== word.id && w.topic === word.topic)
  const others = bank.words.filter((w) => w.id !== word.id && w.topic !== word.topic)

  /** Xáo một mảng bằng Fisher–Yates, trả mảng mới. */
  const shuffle = <T,>(items: readonly T[]): T[] => {
    const copy = items.slice()
    for (let i = copy.length - 1; i > 0; i -= 1) {
      const j = Math.floor(random() * (i + 1))
      const a = copy[i]
      const b = copy[j]
      if (a === undefined || b === undefined) continue
      copy[i] = b
      copy[j] = a
    }
    return copy
  }

  const pool = [...shuffle(sameTopic), ...shuffle(others)]
  const distractors: VocabWord[] = []
  const seenMeanings = new Set([word.meaningVi.toLowerCase()])
  for (const candidate of pool) {
    if (distractors.length >= 3) break
    // Không dùng hai nhiễu có cùng nghĩa tiếng Việt — người học sẽ thấy hai đáp
    // án đúng như nhau.
    const key = candidate.meaningVi.toLowerCase()
    if (seenMeanings.has(key)) continue
    seenMeanings.add(key)
    distractors.push(candidate)
  }

  const choices = [
    { wordId: word.id, text: word.meaningVi, correct: true },
    ...distractors.map((w) => ({ wordId: w.id, text: w.meaningVi, correct: false })),
  ]
  return shuffle(choices)
}

/**
 * Chuẩn hoá chuỗi để tìm kiếm tiếng Việt.
 *
 * Vì sao cần: người Việt gõ cùng một từ theo nhiều cách — "hoá đơn", "hóa đơn",
 * "hoa don", "HOA DON" đều là một. `toLowerCase()` không xử lý được: dấu thanh
 * trong tiếng Việt là ký tự tổ hợp (NFD) hoặc ký tự dựng sẵn (NFC), và "đ" không
 * có dạng ASCII.
 *
 * Cách làm: tách dấu (NFD) → bỏ khối Combining Diacritical Marks → đổi "đ"/"Đ"
 * thành "d" → về chữ thường. Nhờ vậy cả bốn cách gõ trên cho cùng một chuỗi.
 */
function normalizeForSearch(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/gu, '')
    .replace(/đ/gu, 'd')
    .replace(/Đ/gu, 'D')
    .toLowerCase()
}

/** Lọc từ cho màn danh sách. */
export function filterWords(
  bank: VocabBank,
  progress: VocabProgress,
  filter: {
    topic?: VocabTopic | null
    difficulty?: 1 | 2 | 3 | null
    status?: 'all' | 'new' | 'learning' | 'mastered'
    query?: string
  },
): VocabWord[] {
  const query = normalizeForSearch((filter.query ?? '').trim())

  return bank.words.filter((word) => {
    if (filter.topic && word.topic !== filter.topic) return false
    if (filter.difficulty && word.difficulty !== filter.difficulty) return false

    if (filter.status && filter.status !== 'all') {
      const entry = progress[word.id]
      if (filter.status === 'new' && entry) return false
      if (filter.status === 'learning' && (!entry || entry.box >= MAX_BOX)) return false
      if (filter.status === 'mastered' && (!entry || entry.box < MAX_BOX)) return false
    }

    if (query) {
      const haystack = normalizeForSearch(
        `${word.word} ${word.meaningVi} ${word.definitionEn}`,
      )
      if (!haystack.includes(query)) return false
    }

    return true
  })
}

/* ── STORAGE ───────────────────────────────────────────────────────────────── */

function readRaw(key: string): string | null {
  try {
    return window.localStorage.getItem(key)
  } catch {
    return null
  }
}

function writeRaw(key: string, value: string): boolean {
  try {
    window.localStorage.setItem(key, value)
    return true
  } catch {
    return false
  }
}

/** Kiểm một bản ghi tiến độ có đúng hình dạng không. */
function parseEntry(value: unknown): WordProgress | null {
  if (typeof value !== 'object' || value === null) return null
  const v = value as Record<string, unknown>
  if (typeof v.box !== 'number') return null
  if (typeof v.nextReviewAt !== 'number') return null
  if (typeof v.correct !== 'number') return null
  if (typeof v.wrong !== 'number') return null
  if (typeof v.lastSeenAt !== 'number') return null
  return {
    box: clampBox(v.box),
    nextReviewAt: v.nextReviewAt,
    correct: v.correct,
    wrong: v.wrong,
    lastSeenAt: v.lastSeenAt,
  }
}

/** Đọc tiến độ; dữ liệu hỏng thì trả `{}` chứ không throw. */
export function loadProgress(): VocabProgress {
  const raw = readRaw(VOCAB_STORAGE_KEYS.progress)
  if (!raw) return {}
  try {
    const parsed: unknown = JSON.parse(raw)
    if (typeof parsed !== 'object' || parsed === null) return {}
    const result: VocabProgress = {}
    for (const [id, entry] of Object.entries(parsed as Record<string, unknown>)) {
      const good = parseEntry(entry)
      if (good) result[id] = good
    }
    return result
  } catch {
    return {}
  }
}

export function saveProgress(progress: VocabProgress): void {
  writeRaw(VOCAB_STORAGE_KEYS.progress, JSON.stringify(progress))
}

export function clearProgress(): void {
  try {
    window.localStorage.removeItem(VOCAB_STORAGE_KEYS.progress)
  } catch {
    /* bỏ qua */
  }
}

/** Đọc cài đặt từ vựng; trường sai kiểu thì rơi về mặc định. */
export function loadVocabSettings(): VocabSettings {
  const raw = readRaw(VOCAB_STORAGE_KEYS.settings)
  if (!raw) return { ...DEFAULT_VOCAB_SETTINGS }
  try {
    const parsed = JSON.parse(raw) as Partial<VocabSettings>
    const size =
      typeof parsed.sessionSize === 'number' && parsed.sessionSize > 0
        ? Math.min(100, Math.max(5, Math.floor(parsed.sessionSize)))
        : DEFAULT_VOCAB_SETTINGS.sessionSize
    return {
      sessionSize: size,
      defaultMode:
        parsed.defaultMode === 'quiz' || parsed.defaultMode === 'flashcard'
          ? parsed.defaultMode
          : DEFAULT_VOCAB_SETTINGS.defaultMode,
      speechEnabled:
        typeof parsed.speechEnabled === 'boolean'
          ? parsed.speechEnabled
          : DEFAULT_VOCAB_SETTINGS.speechEnabled,
    }
  } catch {
    return { ...DEFAULT_VOCAB_SETTINGS }
  }
}

export function saveVocabSettings(settings: VocabSettings): void {
  writeRaw(VOCAB_STORAGE_KEYS.settings, JSON.stringify(settings))
}
