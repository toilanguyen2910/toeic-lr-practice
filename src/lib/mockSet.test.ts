import { describe, expect, it } from 'vitest'
import { FULL_BANK } from '../data'
import {
  MOCK_SETS,
  MOCK_SET_COUNT,
  MOCK_DURATION_SECONDS,
  buildMockSet,
  findMockSet,
  mockSetSize,
} from './mockSet'
import { PART_META } from '../types'

const NOW = 1_700_000_000_000

describe('10 đề thi thử — cấu hình', () => {
  it('có đúng 10 đề', () => {
    expect(MOCK_SETS).toHaveLength(MOCK_SET_COUNT)
    expect(MOCK_SET_COUNT).toBe(10)
  })

  it('id chạy liên tục 1..10, không trùng', () => {
    expect(MOCK_SETS.map((s) => s.id)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
  })

  it('mỗi đề có seed riêng, không trùng đề nào khác', () => {
    const seeds = MOCK_SETS.map((s) => s.seed)
    expect(new Set(seeds).size).toBe(seeds.length)
  })

  it('seed không trùng dải của bộ 20 đề luyện (1001–1020)', () => {
    for (const set of MOCK_SETS) {
      expect(set.seed).toBeGreaterThan(2000)
    }
  })

  it('findMockSet trả đúng đề và undefined khi ngoài khoảng', () => {
    expect(findMockSet(3)?.seed).toBe(2003)
    expect(findMockSet(0)).toBeUndefined()
    expect(findMockSet(11)).toBeUndefined()
  })

  it('thời lượng đúng 120 phút (45 nghe + 75 đọc)', () => {
    expect(MOCK_DURATION_SECONDS).toBe(7200)
  })
})

describe('10 đề thi thử — mỗi đề đúng 200 câu', () => {
  it('MỌI đề có đúng 200 câu', () => {
    for (const set of MOCK_SETS) {
      const size = mockSetSize(FULL_BANK, set)
      expect(size, `${set.label} có ${size} câu`).toBe(200)
    }
  })

  it('mọi đề có cơ cấu đúng như đề thật: 6/25/39/30/30/16/54', () => {
    const expected: Record<number, number> = {
      1: 6,
      2: 25,
      3: 39,
      4: 30,
      5: 30,
      6: 16,
      7: 54,
    }
    const byId = new Map(FULL_BANK.questions.map((q) => [q.id, q]))

    for (const set of MOCK_SETS) {
      const session = buildMockSet(FULL_BANK, set, NOW)
      const counts: Record<number, number> = {}
      for (const id of session.questionIds) {
        const part = byId.get(id)?.part
        if (part) counts[part] = (counts[part] ?? 0) + 1
      }
      for (const [part, want] of Object.entries(expected)) {
        expect(counts[Number(part)], `${set.label} Part ${part}`).toBe(want)
      }
    }
  })

  it('cơ cấu khớp PART_META.officialCount của đề thật', () => {
    const session = buildMockSet(FULL_BANK, MOCK_SETS[0]!, NOW)
    const byId = new Map(FULL_BANK.questions.map((q) => [q.id, q]))
    const counts = new Map<number, number>()
    for (const id of session.questionIds) {
      const part = byId.get(id)?.part
      if (part) counts.set(part, (counts.get(part) ?? 0) + 1)
    }
    let total = 0
    for (const [part, count] of counts) {
      const official = PART_META[part as 1].officialCount
      expect(count, `Part ${part}`).toBe(official)
      total += count
    }
    expect(total).toBe(200)
  })

  it('câu được xếp theo thứ tự part 1 → 7', () => {
    const byId = new Map(FULL_BANK.questions.map((q) => [q.id, q]))
    const session = buildMockSet(FULL_BANK, MOCK_SETS[0]!, NOW)
    const parts = session.questionIds.map((id) => byId.get(id)?.part ?? 0)
    for (let i = 1; i < parts.length; i += 1) {
      expect(parts[i] ?? 0).toBeGreaterThanOrEqual(parts[i - 1] ?? 0)
    }
  })

  it('không câu nào lặp trong cùng một đề', () => {
    for (const set of MOCK_SETS) {
      const session = buildMockSet(FULL_BANK, set, NOW)
      expect(new Set(session.questionIds).size).toBe(session.questionIds.length)
    }
  })
})

describe('10 đề thi thử — tất định và khác nhau', () => {
  it('cùng đề dựng hai lần cho cùng bộ câu, cùng thứ tự', () => {
    for (const set of MOCK_SETS) {
      const a = buildMockSet(FULL_BANK, set, NOW)
      const b = buildMockSet(FULL_BANK, set, NOW + 999_999)
      expect(a.questionIds).toEqual(b.questionIds)
    }
  })

  it('mười đề cho mười bộ câu KHÁC nhau', () => {
    const signatures = MOCK_SETS.map((set) =>
      buildMockSet(FULL_BANK, set, NOW).questionIds.join(','),
    )
    expect(new Set(signatures).size).toBe(10)
  })

  it('id phiên có tiền tố mock<N>- để phân biệt với đề luyện', () => {
    const session = buildMockSet(FULL_BANK, MOCK_SETS[4]!, NOW)
    expect(session.id.startsWith('mock5-')).toBe(true)
  })

  it('phiên là thi thử đang làm và không lộ đáp án', () => {
    const session = buildMockSet(FULL_BANK, MOCK_SETS[0]!, NOW)
    expect(session.mode).toBe('mock')
    expect(session.status).toBe('active')
    expect(session.revealMode).toBe(false)
  })

  it('mọi câu đều khởi tạo đáp án null', () => {
    const session = buildMockSet(FULL_BANK, MOCK_SETS[0]!, NOW)
    for (const id of session.questionIds) {
      expect(session.answers[id]).toBeNull()
    }
    expect(Object.keys(session.answers)).toHaveLength(200)
  })
})
