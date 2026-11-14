import { useCallback, useEffect, useState } from 'react'
import type { Expense } from '../lib/expenses'

const STORAGE_KEY = 'expense-tracker/v1'

function isExpenseArray(value: unknown): value is Expense[] {
  return (
    Array.isArray(value) &&
    value.every(
      (item) =>
        typeof item === 'object' &&
        item !== null &&
        typeof (item as Expense).id === 'string' &&
        typeof (item as Expense).amount === 'number' &&
        Number.isFinite((item as Expense).amount) &&
        typeof (item as Expense).category === 'string' &&
        typeof (item as Expense).date === 'string' &&
        typeof (item as Expense).note === 'string',
    )
  )
}

/** Reads persisted expenses, discarding anything that does not validate. */
function load(): Expense[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed: unknown = JSON.parse(raw)
    return isExpenseArray(parsed) ? parsed : []
  } catch {
    // Corrupt JSON or storage unavailable (private mode, quota, …).
    return []
  }
}

export interface ExpenseStore {
  expenses: Expense[]
  add: (expense: Expense) => void
  remove: (id: string) => void
  clear: () => void
}

/** Expense list backed by `localStorage`. */
export function useExpenses(): ExpenseStore {
  const [expenses, setExpenses] = useState<Expense[]>(load)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses))
    } catch {
      // Persisting is best-effort; the UI keeps working in memory.
    }
  }, [expenses])

  const add = useCallback((expense: Expense) => {
    setExpenses((prev) => [expense, ...prev])
  }, [])

  const remove = useCallback((id: string) => {
    setExpenses((prev) => prev.filter((e) => e.id !== id))
  }, [])

  const clear = useCallback(() => {
    setExpenses([])
  }, [])

  return { expenses, add, remove, clear }
}
