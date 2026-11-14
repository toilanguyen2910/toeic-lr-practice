/**
 * Pure domain logic for the expense tracker.
 * No React, no DOM, no storage — everything here is a plain function so it can
 * be unit-tested and reasoned about in isolation.
 */

export type Category = 'food' | 'transport' | 'housing' | 'fun' | 'other'

export const CATEGORIES: readonly Category[] = [
  'food',
  'transport',
  'housing',
  'fun',
  'other',
] as const

export const CATEGORY_LABELS: Record<Category, string> = {
  food: 'Ăn uống',
  transport: 'Di chuyển',
  housing: 'Nhà ở',
  fun: 'Giải trí',
  other: 'Khác',
}

export interface Expense {
  readonly id: string
  /** Amount in minor units (VND đồng, so minor unit === đồng). */
  readonly amount: number
  readonly category: Category
  readonly note: string
  /** ISO date string `YYYY-MM-DD`. */
  readonly date: string
}

export interface CategoryTotal {
  readonly category: Category
  readonly total: number
  readonly count: number
  readonly share: number
}

export class ValidationError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ValidationError'
  }
}

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/

/** True when `value` is a real calendar date in `YYYY-MM-DD` form. */
export function isValidISODate(value: string): boolean {
  if (!DATE_RE.test(value)) return false
  const [y, m, d] = value.split('-').map(Number)
  if (m < 1 || m > 12 || d < 1 || d > 31) return false
  const dt = new Date(Date.UTC(y, m - 1, d))
  // Rejects impossible dates such as 2026-02-31.
  return (
    dt.getUTCFullYear() === y &&
    dt.getUTCMonth() === m - 1 &&
    dt.getUTCDate() === d
  )
}

export function isCategory(value: unknown): value is Category {
  return typeof value === 'string' && (CATEGORIES as readonly string[]).includes(value)
}

/**
 * Validates raw user input and returns a normalised expense.
 * Throws `ValidationError` with a human-readable Vietnamese message.
 */
export function createExpense(input: {
  amount: unknown
  category: unknown
  note?: unknown
  date: unknown
  id?: string
}): Expense {
  const amount = typeof input.amount === 'number' ? input.amount : Number(input.amount)

  if (!Number.isFinite(amount)) {
    throw new ValidationError('Số tiền phải là một con số.')
  }
  if (!Number.isInteger(amount)) {
    throw new ValidationError('Số tiền phải là số nguyên (đồng).')
  }
  if (amount <= 0) {
    throw new ValidationError('Số tiền phải lớn hơn 0.')
  }
  if (amount > 1_000_000_000_000) {
    throw new ValidationError('Số tiền vượt quá giới hạn cho phép.')
  }
  if (!isCategory(input.category)) {
    throw new ValidationError('Danh mục không hợp lệ.')
  }
  if (typeof input.date !== 'string' || !isValidISODate(input.date)) {
    throw new ValidationError('Ngày phải theo định dạng YYYY-MM-DD và là ngày có thật.')
  }

  const note = typeof input.note === 'string' ? input.note.trim() : ''
  if (note.length > 200) {
    throw new ValidationError('Ghi chú tối đa 200 ký tự.')
  }

  const id = typeof input.id === 'string' && input.id ? input.id : newId()

  return { id, amount, category: input.category, note, date: input.date }
}

let idCounter = 0
/** Sortable-ish unique id that does not depend on crypto availability. */
export function newId(): string {
  idCounter += 1
  return `${Date.now().toString(36)}-${idCounter.toString(36)}`
}

export function total(expenses: readonly Expense[]): number {
  return expenses.reduce((sum, e) => sum + e.amount, 0)
}

/**
 * Groups expenses by category, sorted by descending total.
 * `share` is the fraction of the grand total, in `[0, 1]`; 0 when empty.
 */
export function totalsByCategory(expenses: readonly Expense[]): CategoryTotal[] {
  const grand = total(expenses)
  const buckets = new Map<Category, { total: number; count: number }>()

  for (const e of expenses) {
    const bucket = buckets.get(e.category) ?? { total: 0, count: 0 }
    bucket.total += e.amount
    bucket.count += 1
    buckets.set(e.category, bucket)
  }

  return [...buckets.entries()]
    .map(([category, { total: sum, count }]) => ({
      category,
      total: sum,
      count,
      share: grand === 0 ? 0 : sum / grand,
    }))
    .sort((a, b) => b.total - a.total || a.category.localeCompare(b.category))
}

/** Returns the expenses inside the inclusive `[from, to]` ISO-date window. */
export function inRange(
  expenses: readonly Expense[],
  from: string,
  to: string,
): Expense[] {
  return expenses.filter((e) => e.date >= from && e.date <= to)
}

/** `YYYY-MM` of an ISO date. */
export function monthOf(isoDate: string): string {
  return isoDate.slice(0, 7)
}

/**
 * The current month expressed as `[from, to]` inclusive ISO dates.
 * Uses UTC so results are stable across timezones in tests.
 */
export function monthRange(month: string): { from: string; to: string } {
  if (!/^\d{4}-\d{2}$/.test(month)) {
    throw new ValidationError('Tháng phải theo định dạng YYYY-MM.')
  }
  const [y, m] = month.split('-').map(Number)
  if (m < 1 || m > 12) {
    throw new ValidationError('Tháng phải nằm trong khoảng 01-12.')
  }
  const lastDay = new Date(Date.UTC(y, m, 0)).getUTCDate()
  return {
    from: `${month}-01`,
    to: `${month}-${String(lastDay).padStart(2, '0')}`,
  }
}

/** Formats an integer amount as Vietnamese đồng, e.g. `1.234.567 ₫`. */
export function formatVND(amount: number): string {
  const sign = amount < 0 ? '-' : ''
  const digits = Math.abs(Math.trunc(amount)).toString()
  const grouped = digits.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
  return `${sign}${grouped} ₫`
}

/** Removes one expense by id; returns a new array. */
export function removeExpense(expenses: readonly Expense[], id: string): Expense[] {
  return expenses.filter((e) => e.id !== id)
}

/** Newest first; ties broken by id so the order is deterministic. */
export function sortByDateDesc(expenses: readonly Expense[]): Expense[] {
  return [...expenses].sort(
    (a, b) => b.date.localeCompare(a.date) || b.id.localeCompare(a.id),
  )
}
