import { describe, expect, it } from 'vitest'
import { FULL_BANK } from '../data'
import { buildExamSet, findExamSet } from './examSet'
import { buildMockSet, MOCK_DURATION_SECONDS, MOCK_SETS } from './mockSet'
import { createSession } from './session'
import { scoreSession } from './scoring'
import type { Session } from './contract'
import type { Letter } from '../types'
import { parseExamSetRoute, parseMockSetRoute } from '../testids'

/**
 * TEST CHỐNG TÁI SINH — mỗi test ở đây khoá lại MỘT lỗi thật đã từng xảy ra và
 * lọt qua toàn bộ bộ test cũ.
 *
 * Vì sao cần file riêng: các test cũ kiểm CẤU TRÚC (đủ trường, đúng kiểu, phân
 * bố toàn part). Chúng không kiểm TƯƠNG QUAN giữa nội dung câu hỏi với đáp án —
 * mà đó chính là nơi sáu lỗi nghiêm trọng nhất đã nằm.
 */

const NOW = 1_700_000_000_000

describe('Part 6 — đáp án không được trùng số thứ tự chỗ trống', () => {
  it('tỉ lệ trùng phải dưới 25% (mức đoán mù)', () => {
    // LỖI TỪNG CÓ: 33/40 câu = 82,5% đáp án đúng đúng thứ tự A,B,C,D theo số
    // chỗ trống (1)→A, (2)→B… Người làm đọc số thứ tự là biết đáp án, không cần
    // đọc tiếng Anh. Test cũ chỉ kiểm phân bố toàn part nên PASS.
    const letterIndex: Record<string, number> = { A: 1, B: 2, C: 3, D: 4 }
    const part6 = FULL_BANK.questions.filter((q) => q.part === 6)

    let matched = 0
    let counted = 0
    for (const question of part6) {
      const blank = /\((\d)\)/u.exec(question.prompt)
      if (!blank) continue
      counted += 1
      if (letterIndex[question.answer] === Number(blank[1])) matched += 1
    }

    const ratio = counted === 0 ? 0 : matched / counted
    expect(
      ratio,
      `Part 6: ${matched}/${counted} câu có đáp án trùng số thứ tự chỗ trống (${(ratio * 100).toFixed(1)}%)`,
    ).toBeLessThan(0.25)
  })

  it('mỗi đoạn Part 6 phải có KIỂU đáp án riêng, không đoạn nào giống đoạn nào', () => {
    // LỖI TỪNG CÓ: sau khi sửa lần đầu, cả 10 đoạn đều ra B,C,D,A — chỉ cần nhớ
    // một kiểu là làm được mọi đoạn.
    const byStimulus = new Map<string, string[]>()
    for (const q of FULL_BANK.questions) {
      if (q.part !== 6 || !q.stimulusId) continue
      const list = byStimulus.get(q.stimulusId) ?? []
      list.push(q.answer)
      byStimulus.set(q.stimulusId, list)
    }

    const patterns = [...byStimulus.values()].map((answers) => answers.join(''))
    const unique = new Set(patterns)
    expect(unique.size, `Các kiểu: ${patterns.join(' ')}`).toBe(patterns.length)
    // Và không đoạn nào được là A,B,C,D.
    expect(patterns).not.toContain('ABCD')
  })

  it('phân bố đáp án Part 6 phải tương đối đều', () => {
    const part6 = FULL_BANK.questions.filter((q) => q.part === 6)
    const counts: Record<string, number> = { A: 0, B: 0, C: 0, D: 0 }
    for (const q of part6) counts[q.answer] = (counts[q.answer] ?? 0) + 1

    const values = Object.values(counts)
    const spread = Math.max(...values) - Math.min(...values)
    expect(spread, `Phân bố: ${JSON.stringify(counts)}`).toBeLessThanOrEqual(4)
  })
})

describe('Điểm số — công thức không được chia cho số câu trong phiên', () => {
  it('làm 20 câu Part 1 đúng hết KHÔNG được ra 495 điểm', () => {
    // LỖI TỪNG CÓ: chia cho số câu CỦA PHIÊN, nên 6/6 câu Part 1 → 495 điểm.
    // Công thức đúng chia cho 100 (số câu chính thức của kỹ năng trong đề thật).
    const def = MOCK_SETS[0]!
    const base = buildMockSet(FULL_BANK, def, NOW)

    // Chỉ giữ 20 câu Part 1 đầu tiên.
    const part1Ids = base.questionIds.filter((id) => id.startsWith('p1-')).slice(0, 20)
    const answers: Record<string, Letter | null> = {}
    for (const id of part1Ids) {
      const q = FULL_BANK.questions.find((x) => x.id === id)
      answers[id] = q?.answer ?? null
    }

    const session: Session = {
      ...base,
      questionIds: part1Ids,
      answers,
      status: 'submitted',
    }

    const result = scoreSession(FULL_BANK, session)
    // 20 câu đúng / 100 × 495 = 99. Không thể là 495.
    expect(result.estimate.listening).toBeLessThan(150)
    expect(result.estimate.total).toBeLessThan(150)
  })

  it('đề đủ 200 câu đúng hết mới cho 990', () => {
    const base = buildMockSet(FULL_BANK, MOCK_SETS[0]!, NOW)
    const answers: Record<string, Letter | null> = {}
    for (const id of base.questionIds) {
      const q = FULL_BANK.questions.find((x) => x.id === id)
      answers[id] = q?.answer ?? null
    }
    const result = scoreSession(FULL_BANK, { ...base, answers, status: 'submitted' })
    expect(result.estimate.total).toBe(990)
  })
})

describe('Đề thi thử — luôn đúng 200 câu', () => {
  it('mọi đề đều 200 câu, không đề nào lấy toàn ngân hàng', () => {
    // LỖI TỪNG CÓ: nút "Làm lại" và nút "Thi thử" cũ tạo phiên với `parts: []`,
    // nghĩa là lấy TOÀN BỘ 425 câu, thay vì 200.
    for (const def of MOCK_SETS) {
      const session = buildMockSet(FULL_BANK, def, NOW)
      expect(session.questionIds.length, `${def.label}`).toBe(200)
    }
  })

  it('thời lượng đề thi thử luôn 120 phút', () => {
    // `buildMockSet` trả `durationSeconds: null` và để màn hình tự ép 120 phút
    // (xem `MockSetRoute`). Kiểm hằng số mà màn hình dùng, để nếu ai đổi nó thì
    // test bắt được.
    expect(MOCK_DURATION_SECONDS).toBe(120 * 60)
  })
})

describe('Thi thử — không lộ lời thoại trong lúc làm', () => {
  it('mọi phiên thi thử đều có revealMode = false', () => {
    // LỖI TỪNG CÓ: giao diện in nguyên transcript Part 2/3/4 ra màn hình, biến
    // bài thi NGHE thành bài ĐỌC. Test cũ chỉ kiểm `feedback` (giải thích) chứ
    // không kiểm transcript.
    //
    // Ở tầng dữ liệu, điều bảo đảm duy nhất là `revealMode = false`: giao diện
    // dựa vào cờ này (cùng với "đã trả lời") để quyết định có in lời thoại hay
    // không. Kiểm ở đây là kiểm cái gốc.
    for (const def of MOCK_SETS) {
      const session = buildMockSet(FULL_BANK, def, NOW)
      expect(session.revealMode, `${def.label}`).toBe(false)
    }
  })
})

describe('Luyện tập — làm lại giữ đúng phân bổ từng part', () => {
  it('phiên tạo từ countByPart giữ đúng số câu mỗi part', () => {
    // LỖI TỪNG CÓ: "Làm lại" lấy số lớn nhất trong các part rồi áp cho mọi part,
    // nên 77 câu (6/25/30/16) thành 30/30/30/30 = 120 câu.
    const session = createSession(FULL_BANK, {
      mode: 'practice',
      parts: [1, 2, 5, 6],
      countByPart: { 1: 6, 2: 25, 5: 30, 6: 16 },
      seed: 42,
      now: NOW,
    })

    const byPart = new Map<string, number>()
    for (const id of session.questionIds) {
      const q = FULL_BANK.questions.find((x) => x.id === id)
      if (!q) continue
      byPart.set(String(q.part), (byPart.get(String(q.part)) ?? 0) + 1)
    }

    expect(session.questionIds.length).toBe(77)
    expect(byPart.get('1')).toBe(6)
    expect(byPart.get('2')).toBe(25)
    expect(byPart.get('5')).toBe(30)
    expect(byPart.get('6')).toBe(16)
  })

  it('20 đề luyện — dựng lại đề giữ đúng id và số câu của đề đó', () => {
    const set = findExamSet(3)!
    const built = buildExamSet(FULL_BANK, set, NOW)
    expect(built.id).toMatch(/^exam3-/)
    expect(built.questionIds.length).toBe(52)
  })
})

describe('Route parsing — route đề nhận số hiệu nguyên hợp lệ', () => {
  it('parseExamSetRoute nhận mọi số hiệu nguyên dương', () => {
    expect(parseExamSetRoute('#/de/1')).toBe(1)
    expect(parseExamSetRoute('#/de/20')).toBe(20)
    expect(parseExamSetRoute('#/de/99')).toBe(99)
    expect(parseExamSetRoute('#/de/abc')).toBeNull()
  })

  it('parseMockSetRoute nhận mọi số hiệu nguyên dương', () => {
    expect(parseMockSetRoute('#/mock/1')).toBe(1)
    expect(parseMockSetRoute('#/mock/15')).toBe(15)
    expect(parseMockSetRoute('#/mock/99')).toBe(99)
    expect(parseMockSetRoute('#/mock/abc')).toBeNull()
  })
})


