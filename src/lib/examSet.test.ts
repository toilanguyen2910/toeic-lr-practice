import { describe, expect, it } from 'vitest'
import { FULL_BANK } from '../data'
import {
  EXAM_SETS,
  EXAM_SET_COUNT,
  buildExamSet,
  countPerPartFor,
  examSetSize,
  findExamSet,
} from './examSet'
import type { Part } from '../types'

const NOW = 1_700_000_000_000

describe('20 đề — cấu hình tĩnh', () => {
  it('có đúng 20 đề', () => {
    expect(EXAM_SETS).toHaveLength(EXAM_SET_COUNT)
    expect(EXAM_SET_COUNT).toBe(20)
  })

  it('id chạy liên tục 1..20, không trùng', () => {
    expect(EXAM_SETS.map((s) => s.id)).toEqual(
      Array.from({ length: 20 }, (_, i) => i + 1),
    )
  })

  it('mọi đề có seed riêng, không trùng nhau', () => {
    const seeds = EXAM_SETS.map((s) => s.seed)
    expect(new Set(seeds).size).toBe(seeds.length)
  })

  it('targetCount khai báo PHẢI khớp số câu thật của đề', () => {
    // Đây là lỗi thật đã xảy ra: thẻ đề ghi "13 câu" nhưng phiên thật có 52 câu.
    // Người dùng đọc "13 câu" rồi bấm vào, thấy 52 câu — mất tin tưởng ngay.
    for (const set of EXAM_SETS) {
      const actual = examSetSize(FULL_BANK, set)
      expect(actual, `${set.label} khai báo ${set.targetCount} nhưng thật là ${actual}`).toBe(
        set.targetCount,
      )
    }
  })

  it('mọi đề có nhãn và tên riêng', () => {
    expect(new Set(EXAM_SETS.map((s) => s.label)).size).toBe(EXAM_SETS.length)
    expect(new Set(EXAM_SETS.map((s) => s.name)).size).toBe(EXAM_SETS.length)
  })

  it('findExamSet trả đúng đề và undefined khi ngoài khoảng', () => {
    expect(findExamSet(7)?.seed).toBe(1007)
    expect(findExamSet(20)?.seed).toBe(1020)
    expect(findExamSet(0)).toBeUndefined()
    expect(findExamSet(21)).toBeUndefined()
  })
})

describe('20 đề — dựng phiên', () => {
  it('mỗi đề dựng được, có câu, không trùng id', () => {
    for (const set of EXAM_SETS) {
      const session = buildExamSet(FULL_BANK, set, NOW)
      expect(session.questionIds.length).toBeGreaterThan(0)
      expect(new Set(session.questionIds).size).toBe(session.questionIds.length)
    }
  })

  it('TẤT ĐỊNH: cùng đề dựng hai lần cho cùng câu, cùng thứ tự', () => {
    for (const set of EXAM_SETS) {
      const a = buildExamSet(FULL_BANK, set, NOW)
      const b = buildExamSet(FULL_BANK, set, NOW + 999_999)
      expect(a.questionIds).toEqual(b.questionIds)
    }
  })

  it('hai đề khác nhau cho bộ câu khác nhau (không đề nào trùng đề nào)', () => {
    const signatures = EXAM_SETS.map((set) =>
      buildExamSet(FULL_BANK, set, NOW).questionIds.join(','),
    )
    expect(new Set(signatures).size).toBe(EXAM_SETS.length)
  })

  it('câu được xếp theo thứ tự part tăng dần (Part 1 trước, Part 7 sau)', () => {
    const byId = new Map(FULL_BANK.questions.map((q) => [q.id, q]))
    const session = buildExamSet(FULL_BANK, EXAM_SETS[10]!, NOW)
    const parts = session.questionIds.map((id) => byId.get(id)?.part ?? 0)
    for (let i = 1; i < parts.length; i += 1) {
      const previous = parts[i - 1] ?? 0
      const current = parts[i] ?? 0
      expect(current).toBeGreaterThanOrEqual(previous)
    }
  })

  it('mọi câu trong đề đều có answers khởi tạo null', () => {
    const session = buildExamSet(FULL_BANK, EXAM_SETS[0]!, NOW)
    for (const id of session.questionIds) {
      expect(session.answers[id]).toBeNull()
    }
    expect(Object.keys(session.answers)).toHaveLength(session.questionIds.length)
  })

  it('đề dựng ra là phiên thi thử đang làm, không lộ đáp án', () => {
    const session = buildExamSet(FULL_BANK, EXAM_SETS[11]!, NOW)
    expect(session.mode).toBe('mock')
    expect(session.status).toBe('active')
    expect(session.revealMode).toBe(false)
  })

  it('parts của phiên khớp đúng các part có câu', () => {
    const byId = new Map(FULL_BANK.questions.map((q) => [q.id, q]))
    const session = buildExamSet(FULL_BANK, EXAM_SETS[0]!, NOW)
    const realParts = [...new Set(session.questionIds.map((id) => byId.get(id)?.part))].sort(
      (a, b) => (a ?? 0) - (b ?? 0),
    ) as Part[]
    expect(session.parts).toEqual(realParts)
  })
})

describe('20 đề — kích thước', () => {
  it('examSetSize khớp với số câu thật của phiên', () => {
    for (const set of EXAM_SETS) {
      expect(examSetSize(FULL_BANK, set)).toBe(buildExamSet(FULL_BANK, set, NOW).questionIds.length)
    }
  })

  it('đề "quick" ngắn hơn đề "official"', () => {
    const quick = examSetSize(FULL_BANK, EXAM_SETS[0]!)
    const official = examSetSize(FULL_BANK, EXAM_SETS[10]!)
    expect(quick).toBeLessThan(official)
  })

  it('đề nhanh vẫn có câu ở cả nghe lẫn đọc', () => {
    const byId = new Map(FULL_BANK.questions.map((q) => [q.id, q]))
    const session = buildExamSet(FULL_BANK, EXAM_SETS[0]!, NOW)
    const sections = new Set(session.questionIds.map((id) => byId.get(id)?.section))
    expect(sections.has('listening')).toBe(true)
    expect(sections.has('reading')).toBe(true)
  })

  it('không part nào đòi nhiều câu hơn ngân hàng có', () => {
    for (const set of EXAM_SETS) {
      const counts = countPerPartFor(set.mix, FULL_BANK)
      for (const [part, want] of Object.entries(counts)) {
        const have = FULL_BANK.questions.filter((q) => q.part === Number(part)).length
        expect(want).toBeLessThanOrEqual(have)
      }
    }
  })
})

describe('20 đề — giao nhau', () => {
  it('các đề dùng chung câu (ngân hàng nhỏ hơn tổng nhu cầu)', () => {
    const used = new Map<string, number>()
    for (const set of EXAM_SETS) {
      for (const id of buildExamSet(FULL_BANK, set, NOW).questionIds) {
        used.set(id, (used.get(id) ?? 0) + 1)
      }
    }
    const shared = [...used.values()].filter((n) => n > 1)
    expect(shared.length).toBeGreaterThan(0)
  })

  it('dùng gần như toàn bộ ngân hàng (không bỏ rơi câu nào ở đuôi mảng)', () => {
    // Đây là bài kiểm tra quan trọng nhất của tệp này. Nó từng ĐỎ vì một lỗi thật
    // trong `selectQuestions`: hàm đó cắt `ofPart.slice(0, limit)` TRƯỚC khi xáo,
    // nên mọi đề luôn lấy N câu ĐẦU TIÊN của mỗi part và phần đuôi ngân hàng không
    // bao giờ xuất hiện. Với 425 câu, 20 đề chỉ chạm được 200 câu.
    //
    // Sau khi sửa (xáo trước rồi mới cắt), phải chạm được gần hết ngân hàng.
    const used = new Set<string>()
    for (const set of EXAM_SETS) {
      for (const id of buildExamSet(FULL_BANK, set, NOW).questionIds) used.add(id)
    }
    const coverage = used.size / FULL_BANK.questions.length
    expect(coverage).toBeGreaterThan(0.95)
  })

  it('mọi part đều xuất hiện trong ít nhất một đề', () => {
    const used = new Set<string>()
    for (const set of EXAM_SETS) {
      for (const id of buildExamSet(FULL_BANK, set, NOW).questionIds) used.add(id)
    }
    const partsSeen = new Set(FULL_BANK.questions.filter((q) => used.has(q.id)).map((q) => q.part))
    const partsInBank = new Set(FULL_BANK.questions.map((q) => q.part))
    expect(partsSeen).toEqual(partsInBank)
  })

  it('câu được dùng lại là tất yếu — kiểm tra điều đó một cách có ý nghĩa', () => {
    // KHÔNG khẳng định "mỗi câu chỉ dùng ít lần". Với 20 đề trong đó 10 đề dài 200
    // câu, tổng nhu cầu (~2765 lượt) lớn hơn nhiều so với 425 câu có sẵn, nên việc
    // dùng lại là số học bắt buộc, không phải lỗi. Điều cần khẳng định là: việc dùng
    // lại KHÔNG tập trung vào một nhúm nhỏ câu — tức là phân bố trải, không dồn.
    const used = new Map<string, number>()
    for (const set of EXAM_SETS) {
      for (const id of buildExamSet(FULL_BANK, set, NOW).questionIds) {
        used.set(id, (used.get(id) ?? 0) + 1)
      }
    }
    const counts = [...used.values()]
    const maxUse = Math.max(...counts)
    const totalSlots = counts.reduce((sum, n) => sum + n, 0)
    // Nếu dồn vào một nhúm, số câu được dùng sẽ ít. Kiểm tra: số câu được dùng
    // phải lớn hơn hẳn số lượt tối đa của một câu, nghĩa là không có "câu gánh đề".
    expect(used.size).toBeGreaterThan(maxUse * 10)
    // Và mỗi câu trung bình không bị lạm dụng quá mức hợp lý.
    expect(totalSlots / used.size).toBeLessThan(EXAM_SETS.length)
  })
})

