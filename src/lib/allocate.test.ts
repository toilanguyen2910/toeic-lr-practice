import { describe, expect, it } from 'vitest'
import { allocateByOfficialRatio, officialTotalOf } from './allocate'
import { FULL_BANK } from '../data'
import type { Part } from '../types'

/** Số câu thật có trong ngân hàng, dùng cho hầu hết test. */
const AVAILABLE = (() => {
  const map = new Map<Part, number>()
  for (const question of FULL_BANK.questions) {
    map.set(question.part, (map.get(question.part) ?? 0) + 1)
  }
  return map
})()

/** Ngân hàng giả có rất nhiều câu, để kiểm công thức mà không bị kẹp. */
const BIG = new Map<Part, number>([
  [1, 500],
  [2, 500],
  [3, 500],
  [4, 500],
  [5, 500],
  [6, 500],
  [7, 500],
])

const sum = (alloc: { count: number }[]) => alloc.reduce((s, a) => s + a.count, 0)

describe('allocateByOfficialRatio — đúng tổng', () => {
  it('part 1,2,5,6 với tổng 77 cho đúng 6/25/30/16 (chính là tỉ lệ đề thật)', () => {
    const alloc = allocateByOfficialRatio([1, 2, 5, 6], 77, BIG)
    expect(alloc).toEqual([
      { part: 1, count: 6 },
      { part: 2, count: 25 },
      { part: 5, count: 30 },
      { part: 6, count: 16 },
    ])
    expect(sum(alloc)).toBe(77)
  })

  it('tổng LUÔN bằng đúng số yêu cầu, không lệch một câu', () => {
    for (const total of [1, 2, 5, 10, 37, 40, 50, 77, 100, 123, 199, 200]) {
      const alloc = allocateByOfficialRatio([1, 2, 5, 6], total, BIG)
      expect(sum(alloc), `tổng ${total}`).toBe(total)
    }
  })

  it('mọi tổ hợp part đều giữ đúng tổng', () => {
    const combos: Part[][] = [
      [1],
      [5],
      [1, 2],
      [1, 2, 3, 4],
      [5, 6, 7],
      [1, 2, 3, 4, 5, 6, 7],
      [2, 5],
      [4, 7, 1],
    ]
    for (const parts of combos) {
      for (const total of [1, 7, 33, 77, 150]) {
        const alloc = allocateByOfficialRatio(parts, total, BIG)
        expect(sum(alloc), `${parts.join('+')} tổng ${total}`).toBe(total)
        // Mọi part được yêu cầu đều có mặt trong kết quả, đúng thứ tự.
        expect(alloc.map((a) => a.part)).toEqual(parts)
      }
    }
  })

  it('giữ đúng thứ tự part người dùng chọn', () => {
    const alloc = allocateByOfficialRatio([6, 1, 5, 2], 50, BIG)
    expect(alloc.map((a) => a.part)).toEqual([6, 1, 5, 2])
  })
})

describe('allocateByOfficialRatio — tỉ lệ', () => {
  it('part có nhiều câu chính thức hơn thì được chia nhiều hơn', () => {
    const alloc = allocateByOfficialRatio([1, 2], 100, BIG)
    const p1 = alloc.find((a) => a.part === 1)?.count ?? 0
    const p2 = alloc.find((a) => a.part === 2)?.count ?? 0
    // Part 2 có 25 câu chính thức, Part 1 có 6 → Part 2 phải nhiều hơn rõ rệt.
    expect(p2).toBeGreaterThan(p1 * 3)
  })

  it('chia đều khi mọi part có cùng trọng số (Part 3 và 4 khác nhau nên dùng 1 và 2 đã kiểm)', () => {
    const alloc = allocateByOfficialRatio([1], 10, BIG)
    expect(alloc).toEqual([{ part: 1, count: 10 }])
  })

  it('không part nào nhận 0 câu khi tổng đủ lớn', () => {
    const alloc = allocateByOfficialRatio([1, 2, 3, 4, 5, 6, 7], 77, BIG)
    for (const item of alloc) {
      expect(item.count).toBeGreaterThan(0)
    }
  })
})

describe('allocateByOfficialRatio — kẹp theo ngân hàng thật', () => {
  it('không đòi quá số câu thật có', () => {
    // Part 1 chỉ có 20 câu trong ngân hàng thật.
    const alloc = allocateByOfficialRatio([1], 500, AVAILABLE)
    expect(alloc).toEqual([{ part: 1, count: 20 }])
  })

  it('khi bị kẹp, tổng bằng tổng khả dụng chứ không vượt', () => {
    const alloc = allocateByOfficialRatio([1], 500, AVAILABLE)
    expect(sum(alloc)).toBe(20)
  })

  it('phần thiếu do kẹp được bù sang part còn chỗ', () => {
    // Part 1 chỉ có 20, Part 5 có 120. Đòi 100 câu từ cả hai.
    const alloc = allocateByOfficialRatio([1, 5], 100, AVAILABLE)
    const p1 = alloc.find((a) => a.part === 1)?.count ?? 0
    const p5 = alloc.find((a) => a.part === 5)?.count ?? 0
    expect(p1).toBeLessThanOrEqual(20)
    expect(sum(alloc)).toBe(100)
    expect(p5).toBeGreaterThan(0)
  })

  it('tổng yêu cầu lớn hơn toàn bộ ngân hàng thì lấy hết, không lỗi', () => {
    const alloc = allocateByOfficialRatio([1, 2], 9999, AVAILABLE)
    expect(sum(alloc)).toBe(20 + 60)
  })
})

describe('allocateByOfficialRatio — biên', () => {
  it('không có part nào → mảng rỗng', () => {
    expect(allocateByOfficialRatio([], 50, BIG)).toEqual([])
  })

  it('tổng 0 → mọi part nhận 0', () => {
    const alloc = allocateByOfficialRatio([1, 2], 0, BIG)
    expect(sum(alloc)).toBe(0)
    expect(alloc).toHaveLength(2)
  })

  it('tổng âm hoặc NaN → coi như 0, không sinh số âm', () => {
    for (const bad of [-10, Number.NaN, Number.NEGATIVE_INFINITY]) {
      const alloc = allocateByOfficialRatio([1, 2], bad, BIG)
      expect(sum(alloc)).toBe(0)
      for (const item of alloc) expect(item.count).toBeGreaterThanOrEqual(0)
    }
  })

  it('tổng lẻ 1 câu vẫn chia được, không âm', () => {
    const alloc = allocateByOfficialRatio([1, 2, 5, 6], 1, BIG)
    expect(sum(alloc)).toBe(1)
    expect(alloc.every((a) => a.count >= 0)).toBe(true)
  })
})

describe('officialTotalOf', () => {
  it('part 1,2,5,6 đúng bằng 77', () => {
    expect(officialTotalOf([1, 2, 5, 6])).toBe(77)
  })

  it('cả 7 part đúng bằng 200', () => {
    expect(officialTotalOf([1, 2, 3, 4, 5, 6, 7])).toBe(200)
  })

  it('chỉ part 5 đúng bằng 30', () => {
    expect(officialTotalOf([5])).toBe(30)
  })
})
