import { useMemo, useState } from 'react'
import './App.css'
import {
  CATEGORIES,
  CATEGORY_LABELS,
  ValidationError,
  createExpense,
  formatVND,
  monthOf,
  monthRange,
  inRange,
  sortByDateDesc,
  total,
  totalsByCategory,
  type Category,
} from './lib/expenses'
import { useExpenses } from './hooks/useExpenses'

const todayISO = (): string => new Date().toISOString().slice(0, 10)

function App() {
  const { expenses, add, remove, clear } = useExpenses()

  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState<Category>('food')
  const [note, setNote] = useState('')
  const [date, setDate] = useState(todayISO)
  const [error, setError] = useState<string | null>(null)

  const sorted = useMemo(() => sortByDateDesc(expenses), [expenses])

  // Month filter: '' means "all time".
  //
  // Default to "all time" rather than the current calendar month. Persisted
  // data outlives the month it was entered in, so a default month filter makes
  // saved entries look lost on reload. Users can still narrow to a month.
  const [month, setMonth] = useState<string>('')
  const months = useMemo(() => {
    const set = new Set(expenses.map((e) => monthOf(e.date)))
    set.add(monthOf(todayISO()))
    return [...set].sort().reverse()
  }, [expenses])

  const visible = useMemo(() => {
    if (!month) return sorted
    const { from, to } = monthRange(month)
    return inRange(sorted, from, to)
  }, [sorted, month])

  const visibleTotal = total(visible)
  const breakdown = totalsByCategory(visible)

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    try {
      const expense = createExpense({ amount, category, note, date })
      add(expense)
      // If the active month filter would hide the entry we just added, move the
      // filter to that entry's month instead of silently swallowing it.
      // '' means "all time", which already shows every entry.
      setMonth((current) =>
        current !== '' && current !== monthOf(expense.date)
          ? monthOf(expense.date)
          : current,
      )
      setAmount('')
      setNote('')
      setError(null)
    } catch (err) {
      setError(err instanceof ValidationError ? err.message : 'Đã xảy ra lỗi.')
    }
  }

  function handleClear() {
    if (expenses.length === 0) return
    if (window.confirm('Xoá toàn bộ chi tiêu? Thao tác này không hoàn tác được.')) {
      clear()
    }
  }

  return (
    <main className="app">
      <header className="app__header">
        <h1>Quản lý chi tiêu</h1>
        <p className="app__subtitle">
          Ghi lại khoản chi, xem tổng theo tháng và theo danh mục. Dữ liệu lưu trong
          trình duyệt của bạn.
        </p>
      </header>

      <section className="card" aria-labelledby="form-heading">
        <h2 id="form-heading">Thêm khoản chi</h2>
        <form className="form" onSubmit={handleSubmit} noValidate>
          <div className="field">
            <label htmlFor="amount">Số tiền (₫)</label>
            <input
              id="amount"
              name="amount"
              type="number"
              min="1"
              step="1"
              inputMode="numeric"
              placeholder="25000"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              aria-invalid={error ? true : undefined}
            />
          </div>

          <div className="field">
            <label htmlFor="category">Danh mục</label>
            <select
              id="category"
              name="category"
              value={category}
              onChange={(e) => setCategory(e.target.value as Category)}
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {CATEGORY_LABELS[c]}
                </option>
              ))}
            </select>
          </div>

          <div className="field">
            <label htmlFor="date">Ngày</label>
            <input
              id="date"
              name="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          <div className="field field--wide">
            <label htmlFor="note">Ghi chú (tuỳ chọn)</label>
            <input
              id="note"
              name="note"
              type="text"
              maxLength={200}
              placeholder="Phở sáng"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>

          <button type="submit" className="btn btn--primary">
            Thêm
          </button>
        </form>
        {error && (
          <p className="error" role="alert">
            {error}
          </p>
        )}
      </section>

      <section className="card" aria-labelledby="summary-heading">
        <div className="summary__head">
          <h2 id="summary-heading">Tổng quan</h2>
          <div className="field field--inline">
            <label htmlFor="month">Tháng</label>
            <select
              id="month"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
            >
              <option value="">Tất cả</option>
              {months.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>
        </div>

        <p className="total" data-testid="total">
          {formatVND(visibleTotal)}
          <span className="total__caption">
            {' '}
            · {visible.length} khoản chi
          </span>
        </p>

        {breakdown.length > 0 && (
          <ul className="breakdown">
            {breakdown.map((row) => (
              <li key={row.category} className="breakdown__row">
                <span className="breakdown__label">
                  {CATEGORY_LABELS[row.category]}
                  <span className="breakdown__count"> ×{row.count}</span>
                </span>
                <span className="breakdown__bar" aria-hidden="true">
                  <span
                    className={`breakdown__fill breakdown__fill--${row.category}`}
                    style={{ width: `${Math.max(row.share * 100, 2)}%` }}
                  />
                </span>
                <span className="breakdown__value">
                  {formatVND(row.total)}
                  <span className="breakdown__share">
                    {' '}
                    {(row.share * 100).toFixed(0)}%
                  </span>
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="card" aria-labelledby="list-heading">
        <div className="summary__head">
          <h2 id="list-heading">Các khoản chi</h2>
          <button
            type="button"
            className="btn btn--ghost"
            onClick={handleClear}
            disabled={expenses.length === 0}
          >
            Xoá tất cả
          </button>
        </div>

        {visible.length === 0 ? (
          <p className="empty">Chưa có khoản chi nào trong khoảng thời gian này.</p>
        ) : (
          <ul className="list">
            {visible.map((expense) => (
              <li key={expense.id} className="list__item">
                <span
                  className={`dot dot--${expense.category}`}
                  aria-hidden="true"
                />
                <span className="list__main">
                  <span className="list__note">
                    {expense.note || CATEGORY_LABELS[expense.category]}
                  </span>
                  <span className="list__meta">
                    {expense.date} · {CATEGORY_LABELS[expense.category]}
                  </span>
                </span>
                <span className="list__amount">{formatVND(expense.amount)}</span>
                <button
                  type="button"
                  className="btn btn--icon"
                  onClick={() => remove(expense.id)}
                  aria-label={`Xoá khoản chi ${formatVND(expense.amount)} ngày ${expense.date}`}
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  )
}

export default App
