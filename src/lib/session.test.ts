import { describe, expect, it } from 'vitest'
import { SAMPLE_BANK } from './sample'
import {
  answerQuestion,
  createSession,
  submitSession,
  tickSession,
  toggleFlag,
} from './session'
import type { Session, SessionOptions } from './contract'
import { formatClock } from './time'

/** Mốc thời gian cố định để test không phụ thuộc đồng hồ máy. */
const NOW = 1_700_000_000_000

function options(overrides: Partial<SessionOptions> = {}): SessionOptions {
  return { mode: 'practice', parts: [], now: NOW, seed: 42, ...overrides }
}

function idsOf(bank = SAMPLE_BANK, opts: Partial<SessionOptions> = {}): string[] {
  return createSession(bank, options(opts)).questionIds
}

describe('createSession — chọn câu theo part', () => {
  it('parts rỗng nghĩa là dùng toàn bộ ngân hàng', () => {
    const session = createSession(SAMPLE_BANK, options({ parts: [] }))
    expect(session.questionIds).toHaveLength(SAMPLE_BANK.questions.length)
  })

  it('chỉ lấy câu thuộc các part được chọn', () => {
    const session = createSession(SAMPLE_BANK, options({ parts: [5] }))
    const parts = new Set(
      session.questionIds.map((id) => SAMPLE_BANK.questions.find((q) => q.id === id)?.part),
    )
    expect([...parts]).toEqual([5])
    expect(session.questionIds.sort()).toEqual(['p5-0001', 'p5-0002'])
  })

  it('nhiều part thì gộp đủ câu của tất cả part đó', () => {
    const session = createSession(SAMPLE_BANK, options({ parts: [1, 2] }))
    expect(session.questionIds.sort()).toEqual([
      'p1-0001',
      'p1-0002',
      'p2-0001',
      'p2-0002',
    ])
  })

  it('part không có câu nào trong ngân hàng bị bỏ qua (không tạo câu ma)', () => {
    const session = createSession(SAMPLE_BANK, options({ parts: [3, 4] }))
    expect(session.questionIds).toEqual([])
    expect(session.parts).toEqual([])
  })

  it('parts của phiên được sắp xếp tăng dần, không phụ thuộc thứ tự truyền vào', () => {
    const a = createSession(SAMPLE_BANK, options({ parts: [7, 1, 5] }))
    const b = createSession(SAMPLE_BANK, options({ parts: [1, 5, 7] }))
    expect(a.parts).toEqual([1, 5, 7])
    expect(b.parts).toEqual(a.parts)
  })

  it('countPerPart giới hạn số câu MỖI part', () => {
    const session = createSession(SAMPLE_BANK, options({ parts: [1, 2], countPerPart: 1 }))
    expect(session.questionIds).toHaveLength(2)
    const parts = session.questionIds.map(
      (id) => SAMPLE_BANK.questions.find((q) => q.id === id)?.part,
    )
    expect(parts.sort()).toEqual([1, 2])
  })

  it('bỏ trống countPerPart thì lấy hết câu của part', () => {
    const session = createSession(SAMPLE_BANK, options({ parts: [1] }))
    expect(session.questionIds).toHaveLength(2)
  })

  it('countPerPart lớn hơn số câu hiện có thì lấy hết, không lỗi', () => {
    const session = createSession(SAMPLE_BANK, options({ parts: [1], countPerPart: 999 }))
    expect(session.questionIds).toHaveLength(2)
  })

  it('mỗi part có tối đa 4 lựa chọn (Part 2 chỉ 3)', () => {
    const session = createSession(SAMPLE_BANK, options({ parts: [] }))
    for (const id of session.questionIds) {
      const question = SAMPLE_BANK.questions.find((q) => q.id === id)
      expect(question).toBeDefined()
      expect(question!.choices.length).toBeGreaterThanOrEqual(3)
      expect(question!.choices.length).toBeLessThanOrEqual(4)
    }
  })
})

describe('createSession — seed tất định', () => {
  it('cùng seed + cùng ngân hàng cho cùng questionIds', () => {
    expect(idsOf(SAMPLE_BANK, { seed: 7 })).toEqual(idsOf(SAMPLE_BANK, { seed: 7 }))
  })

  it('cùng seed cho cùng thứ tự, không chỉ cùng tập câu', () => {
    const first = createSession(SAMPLE_BANK, options({ seed: 123 }))
    const second = createSession(SAMPLE_BANK, options({ seed: 123 }))
    expect(second.questionIds).toEqual(first.questionIds)
  })

  it('seed khác nhau cho thứ tự khác nhau (trên ngân hàng đủ lớn)', () => {
    const bank = {
      version: 1,
      stimuli: [],
      questions: Array.from({ length: 40 }, (_, index) => ({
        ...SAMPLE_BANK.questions[3]!,
        id: `p5-${String(index + 1).padStart(4, '0')}`,
        part: 5 as const,
        section: 'reading' as const,
      })),
    }
    const orders = new Set(
      [1, 2, 3, 4, 5].map((seed) =>
        createSession(bank, options({ seed, parts: [5] })).questionIds.join(','),
      ),
    )
    expect(orders.size).toBeGreaterThan(1)
  })

  it('seed tất định bất kể thời điểm tạo (cùng seed, khác now)', () => {
    const a = createSession(SAMPLE_BANK, options({ seed: 55, now: NOW }))
    const b = createSession(SAMPLE_BANK, options({ seed: 55, now: NOW + 999_999 }))
    expect(b.questionIds).toEqual(a.questionIds)
  })

  it('không truyền seed thì vẫn tạo được phiên và có đủ câu', () => {
    const session = createSession(SAMPLE_BANK, {
      mode: 'practice',
      parts: [],
      now: NOW,
    })
    expect(session.questionIds).toHaveLength(SAMPLE_BANK.questions.length)
  })

  it('không làm mất hay nhân đôi câu khi xáo', () => {
    const session = createSession(SAMPLE_BANK, options({ seed: 999 }))
    expect([...session.questionIds].sort()).toEqual(
      SAMPLE_BANK.questions.map((q) => q.id).sort(),
    )
  })
})

describe('createSession — khởi tạo trạng thái', () => {
  it('answers khởi tạo mọi câu = null', () => {
    const session = createSession(SAMPLE_BANK, options())
    expect(Object.keys(session.answers).sort()).toEqual([...session.questionIds].sort())
    for (const id of session.questionIds) {
      expect(session.answers[id]).toBeNull()
    }
  })

  it('flagged rỗng, elapsedSeconds = 0, status active', () => {
    const session = createSession(SAMPLE_BANK, options())
    expect(session.flagged).toEqual({})
    expect(session.elapsedSeconds).toBe(0)
    expect(session.status).toBe('active')
    expect(session.submittedAt).toBeUndefined()
  })

  it('id là chuỗi khác rỗng và ổn định với cùng seed + now', () => {
    const a = createSession(SAMPLE_BANK, options({ seed: 3 }))
    const b = createSession(SAMPLE_BANK, options({ seed: 3 }))
    expect(a.id.length).toBeGreaterThan(0)
    expect(b.id).toBe(a.id)
  })

  it('ghi đúng createdAt từ options.now', () => {
    expect(createSession(SAMPLE_BANK, options()).createdAt).toBe(NOW)
  })

  it('practice không giới hạn thời gian khi không truyền durationSeconds', () => {
    const session = createSession(SAMPLE_BANK, options({ mode: 'practice' }))
    expect(session.durationSeconds).toBeNull()
  })

  it('mock tự đặt thời lượng theo số câu, không vượt 120 phút', () => {
    const session = createSession(SAMPLE_BANK, options({ mode: 'mock' }))
    expect(session.durationSeconds).not.toBeNull()
    expect(session.durationSeconds!).toBeGreaterThan(0)
    expect(session.durationSeconds!).toBeLessThanOrEqual(7200)
  })

  it('thời lượng mặc định của mock luôn hiển thị được ở dạng mm:ss (< 1 giờ)', () => {
    // Ràng buộc với scripts/verify-core.mjs (B2.2): đồng hồ phải khớp /^\d{1,3}:\d{2}$/.
    const small = createSession(SAMPLE_BANK, options({ mode: 'mock' }))
    expect(small.durationSeconds!).toBeLessThan(3600)
    expect(formatClock(small.durationSeconds!)).toMatch(/^\d{1,3}:\d{2}$/)

    // Ngay cả đề 200 câu cũng không vượt mốc 1 giờ ở mức mặc định.
    const bigBank = {
      version: 1,
      stimuli: [],
      questions: Array.from({ length: 200 }, (_, index) => ({
        ...SAMPLE_BANK.questions[4]!,
        id: `p5-${String(index + 1).padStart(4, '0')}`,
      })),
    }
    const big = createSession(bigBank, options({ mode: 'mock' }))
    expect(big.questionIds).toHaveLength(200)
    expect(big.durationSeconds!).toBeLessThan(3600)
    expect(formatClock(big.durationSeconds!)).toMatch(/^\d{1,3}:\d{2}$/)
  })

  it('người gọi vẫn ép được 120 phút bằng durationSeconds tường minh', () => {
    const session = createSession(SAMPLE_BANK, options({ mode: 'mock', durationSeconds: 7200 }))
    expect(session.durationSeconds).toBe(7200)
  })

  it('durationSeconds truyền tường minh được tôn trọng', () => {
    expect(createSession(SAMPLE_BANK, options({ durationSeconds: 600 })).durationSeconds).toBe(600)
    expect(createSession(SAMPLE_BANK, options({ durationSeconds: null })).durationSeconds).toBeNull()
  })

  it('mock không bao giờ bật revealMode', () => {
    const session = createSession(SAMPLE_BANK, options({ mode: 'mock', revealMode: true }))
    expect(session.revealMode).toBe(false)
  })

  it('practice tôn trọng revealMode, mặc định bật', () => {
    expect(createSession(SAMPLE_BANK, options({ revealMode: false })).revealMode).toBe(false)
    expect(createSession(SAMPLE_BANK, options()).revealMode).toBe(true)
  })
})

describe('answerQuestion — ghi và xoá đáp án, bất biến', () => {
  const base: Session = createSession(SAMPLE_BANK, options({ seed: 11 }))

  it('ghi letter vào câu tương ứng', () => {
    const id = base.questionIds[0]!
    const next = answerQuestion(base, id, 'B')
    expect(next.answers[id]).toBe('B')
  })

  it('KHÔNG sửa phiên gốc', () => {
    const id = base.questionIds[0]!
    const snapshot = JSON.parse(JSON.stringify(base))
    answerQuestion(base, id, 'C')
    expect(base).toEqual(snapshot)
    expect(base.answers[id]).toBeNull()
  })

  it('trả về object mới, không phải chính phiên cũ', () => {
    const next = answerQuestion(base, base.questionIds[0]!, 'A')
    expect(next).not.toBe(base)
    expect(next.answers).not.toBe(base.answers)
  })

  it('truyền null để xoá đáp án nhưng PHẢI giữ key với giá trị null', () => {
    const id = base.questionIds[0]!
    const answered = answerQuestion(base, id, 'D')
    const cleared = answerQuestion(answered, id, null)
    expect(Object.prototype.hasOwnProperty.call(cleared.answers, id)).toBe(true)
    expect(cleared.answers[id]).toBeNull()
  })

  it('các câu khác giữ nguyên khi ghi một câu', () => {
    const [first, second] = [base.questionIds[0]!, base.questionIds[1]!]
    const answered = answerQuestion(base, first, 'A')
    expect(answered.answers[second]).toBeNull()
    expect(Object.keys(answered.answers).sort()).toEqual([...base.questionIds].sort())
  })

  it('ghi đè đáp án cũ bằng đáp án mới', () => {
    const id = base.questionIds[0]!
    const twice = answerQuestion(answerQuestion(base, id, 'A'), id, 'D')
    expect(twice.answers[id]).toBe('D')
  })
})

describe('toggleFlag — bật/tắt cờ đánh dấu, bất biến', () => {
  const base = createSession(SAMPLE_BANK, options({ seed: 12 }))
  const id = base.questionIds[0]!

  it('lần đầu bật cờ', () => {
    expect(toggleFlag(base, id).flagged[id]).toBe(true)
  })

  it('lần hai tắt cờ', () => {
    const on = toggleFlag(base, id)
    const off = toggleFlag(on, id)
    expect(off.flagged[id]).toBeUndefined()
    expect(Object.keys(off.flagged)).toEqual([])
  })

  it('KHÔNG sửa phiên gốc', () => {
    const snapshot = JSON.parse(JSON.stringify(base))
    toggleFlag(base, id)
    expect(base).toEqual(snapshot)
    expect(base.flagged).toEqual({})
  })

  it('trả về object mới cho flagged', () => {
    const next = toggleFlag(base, id)
    expect(next).not.toBe(base)
    expect(next.flagged).not.toBe(base.flagged)
  })

  it('đánh dấu nhiều câu độc lập', () => {
    const [first, second] = [base.questionIds[0]!, base.questionIds[1]!]
    const both = toggleFlag(toggleFlag(base, first), second)
    expect(both.flagged[first]).toBe(true)
    expect(both.flagged[second]).toBe(true)
  })
})

describe('tickSession — cập nhật thời gian đã dùng', () => {
  const base = createSession(SAMPLE_BANK, options({ seed: 13 }))

  it('ghi elapsedSeconds mới', () => {
    expect(tickSession(base, 42).elapsedSeconds).toBe(42)
  })

  it('KHÔNG sửa phiên gốc', () => {
    tickSession(base, 99)
    expect(base.elapsedSeconds).toBe(0)
  })

  it('kẹp số âm về 0', () => {
    expect(tickSession(base, -5).elapsedSeconds).toBe(0)
  })

  it('làm tròn xuống số lẻ', () => {
    expect(tickSession(base, 12.9).elapsedSeconds).toBe(12)
  })

  it('giá trị không hữu hạn thì giữ nguyên thời gian cũ', () => {
    const running = tickSession(base, 30)
    expect(tickSession(running, Number.NaN).elapsedSeconds).toBe(30)
    expect(tickSession(running, Number.POSITIVE_INFINITY).elapsedSeconds).toBe(30)
  })

  it('giữ nguyên đáp án và cờ khi tick', () => {
    const id = base.questionIds[0]!
    const state = answerQuestion(toggleFlag(base, id), id, 'B')
    const ticked = tickSession(state, 60)
    expect(ticked.answers[id]).toBe('B')
    expect(ticked.flagged[id]).toBe(true)
  })
})

describe('submitSession — kết thúc phiên', () => {
  const base = createSession(SAMPLE_BANK, options({ seed: 14 }))

  it("đặt status = 'submitted'", () => {
    expect(submitSession(base, NOW).status).toBe('submitted')
  })

  it('gán submittedAt theo now truyền vào', () => {
    expect(submitSession(base, NOW + 5000).submittedAt).toBe(NOW + 5000)
  })

  it('không truyền now thì vẫn gán submittedAt là số hữu hạn', () => {
    const submitted = submitSession(base)
    expect(typeof submitted.submittedAt).toBe('number')
    expect(Number.isFinite(submitted.submittedAt!)).toBe(true)
  })

  it('KHÔNG sửa phiên gốc', () => {
    submitSession(base, NOW)
    expect(base.status).toBe('active')
    expect(base.submittedAt).toBeUndefined()
  })

  it('giữ nguyên đáp án, cờ và thời gian đã dùng', () => {
    const id = base.questionIds[0]!
    const state = tickSession(answerQuestion(toggleFlag(base, id), id, 'C'), 123)
    const submitted = submitSession(state, NOW)
    expect(submitted.answers).toEqual(state.answers)
    expect(submitted.flagged).toEqual(state.flagged)
    expect(submitted.elapsedSeconds).toBe(123)
    expect(submitted.questionIds).toEqual(state.questionIds)
  })
})
