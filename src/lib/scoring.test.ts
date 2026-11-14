import { describe, expect, it } from 'vitest'
import type { Letter, Question, QuestionBank } from '../types'
import { SAMPLE_BANK } from './sample'
import { createSession } from './session'
import type { ScoreEstimate, Session, SessionResult } from './contract'
import { estimateScore, scoreSession } from './scoring'

const NOW = 1_700_000_000_000

/** Tạo phiên từ ngân hàng mẫu, part và seed cố định. */
function makeSession(parts: Session['parts'], seed = 1): Session {
  return createSession(SAMPLE_BANK, {
    mode: 'practice',
    parts,
    seed,
    now: NOW,
  })
}

/** Gán đáp án cho từng câu theo bảng id → letter (không dùng Math.random). */
function withAnswers(
  session: Session,
  picks: Record<string, Letter | null>,
): Session {
  return {
    ...session,
    answers: { ...session.answers, ...picks },
  }
}

/** Trả lời đúng hết các câu của phiên. */
function answerAllCorrect(session: Session): Session {
  const answers: Record<string, Letter | null> = {}
  for (const id of session.questionIds) {
    const question = SAMPLE_BANK.questions.find((q) => q.id === id)
    answers[id] = question ? question.answer : null
  }
  return { ...session, answers }
}

/** Ngân hàng tổng hợp 200 câu: 100 listening (part 5 giả lập? không) — 100 nghe + 100 đọc. */
function syntheticFullBank(): QuestionBank {
  const base = SAMPLE_BANK.questions.find((q) => q.id === 'p5-0001')!
  const questions: Question[] = []
  for (let index = 0; index < 100; index += 1) {
    questions.push({
      ...base,
      id: `L-${String(index).padStart(4, '0')}`,
      part: 1,
      section: 'listening',
      tags: ['synthetic'],
    })
  }
  for (let index = 0; index < 100; index += 1) {
    questions.push({
      ...base,
      id: `R-${String(index).padStart(4, '0')}`,
      part: 5,
      section: 'reading',
      tags: ['synthetic'],
    })
  }
  return { version: 1, stimuli: [], questions }
}

describe('scoreSession — đếm đúng/sai/bỏ trống', () => {
  it('chưa trả lời câu nào thì tất cả là bỏ trống', () => {
    const session = makeSession([])
    const result = scoreSession(SAMPLE_BANK, session)
    expect(result.correct).toBe(0)
    expect(result.wrong).toBe(0)
    expect(result.blank).toBe(session.questionIds.length)
    expect(result.total).toBe(session.questionIds.length)
  })

  it('trả lời đúng hết', () => {
    const session = answerAllCorrect(makeSession([]))
    const result = scoreSession(SAMPLE_BANK, session)
    expect(result.correct).toBe(8)
    expect(result.wrong).toBe(0)
    expect(result.blank).toBe(0)
    expect(result.accuracy).toBe(100)
  })

  it('trả lời sai hết (chọn letter không phải đáp án)', () => {
    const session = makeSession([])
    const answers: Record<string, Letter | null> = {}
    for (const id of session.questionIds) {
      const question = SAMPLE_BANK.questions.find((q) => q.id === id)!
      answers[id] = question.answer === 'A' ? 'B' : 'A'
    }
    const result = scoreSession(SAMPLE_BANK, withAnswers(session, answers))
    expect(result.correct).toBe(0)
    expect(result.wrong).toBe(8)
    expect(result.blank).toBe(0)
    expect(result.accuracy).toBe(0)
  })

  it('đúng + sai + bỏ trống = tổng số câu', () => {
    const session = makeSession([])
    const mixed = withAnswers(session, {
      'p1-0001': 'A',
      'p2-0001': 'B',
      'p5-0001': null,
    })
    const result = scoreSession(SAMPLE_BANK, mixed)
    expect(result.correct + result.wrong + result.blank).toBe(result.total)
    expect(result.total).toBe(8)
    expect(result.correct).toBe(1)
    expect(result.wrong).toBe(1)
    expect(result.blank).toBe(6)
  })

  it('answers[id] = null được tính là bỏ trống, không phải sai', () => {
    const session = makeSession([5])
    const result = scoreSession(SAMPLE_BANK, withAnswers(session, { 'p5-0001': null }))
    expect(result.blank).toBe(2)
    expect(result.wrong).toBe(0)
  })

  it('accuracy là % làm tròn 1 chữ số thập phân', () => {
    // Phiên 6 câu (part 1, 2, 5 với countPerPart = ... ) — dùng bank 8 câu, 3 đúng / 8 = 37.5
    const session = makeSession([])
    const answers: Record<string, Letter | null> = {}
    const sessionIds = session.questionIds
    for (const id of sessionIds.slice(0, 3)) {
      answers[id] = SAMPLE_BANK.questions.find((q) => q.id === id)!.answer
    }
    for (const id of sessionIds.slice(3, 6)) {
      const question = SAMPLE_BANK.questions.find((q) => q.id === id)!
      answers[id] = question.answer === 'A' ? 'B' : 'A'
    }
    for (const id of sessionIds.slice(6)) answers[id] = null
    const result = scoreSession(SAMPLE_BANK, withAnswers(session, answers))
    expect(result.correct).toBe(3)
    expect(result.wrong).toBe(3)
    expect(result.blank).toBe(2)
    expect(result.accuracy).toBe(37.5)
  })

  it('không có câu nào thì accuracy = 0, không chia cho 0', () => {
    const session = makeSession([3, 4])
    const result = scoreSession(SAMPLE_BANK, session)
    expect(result.total).toBe(0)
    expect(result.accuracy).toBe(0)
    expect(Number.isNaN(result.accuracy)).toBe(false)
  })

  it('bỏ qua câu có id không nằm trong ngân hàng', () => {
    const session = makeSession([5])
    const ghost = { ...session, questionIds: [...session.questionIds, 'p9-9999'] }
    const result = scoreSession(SAMPLE_BANK, ghost)
    expect(result.total).toBe(2)
  })
})

/**
 * Câu "lạ" = id có trong `session.questionIds` nhưng KHÔNG có trong ngân hàng
 * (dữ liệu cũ, ngân hàng đổi phiên bản, localStorage bị sửa tay…).
 *
 * Hợp đồng đã chốt: bỏ qua hoàn toàn — không đếm vào `total`, KHÔNG tính là
 * bỏ trống, không vào `byPart`, không vào `byTag`, không ảnh hưởng `accuracy`
 * hay `estimate`.
 */
describe('scoreSession — câu lạ (id không có trong ngân hàng)', () => {
  it('không đếm câu lạ vào total', () => {
    const session = makeSession([5])
    const ghost: Session = {
      ...session,
      questionIds: [...session.questionIds, 'p9-9999', 'p9-9998'],
    }
    expect(scoreSession(SAMPLE_BANK, ghost).total).toBe(2)
  })

  it('câu lạ KHÔNG bị tính là bỏ trống', () => {
    const session = makeSession([5])
    const ghost: Session = { ...session, questionIds: [...session.questionIds, 'p9-9999'] }
    const result = scoreSession(SAMPLE_BANK, ghost)
    // 2 câu đọc thật, đều chưa trả lời → blank = 2 (KHÔNG phải 3).
    expect(result.blank).toBe(2)
    expect(result.wrong).toBe(0)
    expect(result.correct).toBe(0)
  })

  it('câu lạ không làm hỏng byPart (không sinh part ma)', () => {
    const session = makeSession([5])
    const ghost: Session = { ...session, questionIds: [...session.questionIds, 'p9-9999'] }
    const result = scoreSession(SAMPLE_BANK, ghost)
    expect(result.byPart).toEqual([
      { part: 5, total: 2, correct: 0, wrong: 0, blank: 2, accuracy: 0 },
    ])
  })

  it('câu lạ không vào byTag và không làm lệch accuracy của tag', () => {
    const session = makeSession([5])
    const ghost: Session = { ...session, questionIds: [...session.questionIds, 'p9-9999'] }
    const clean = scoreSession(SAMPLE_BANK, session)
    const dirty = scoreSession(SAMPLE_BANK, ghost)
    expect(dirty.byTag).toEqual(clean.byTag)
  })

  it('câu lạ không làm lệch accuracy toàn phiên', () => {
    const session = makeSession([5])
    const answered: Session = {
      ...session,
      answers: { ...session.answers, 'p5-0001': 'B' }, // đúng (p5-0001 → B)
    }
    const ghost: Session = {
      ...answered,
      questionIds: [...answered.questionIds, 'p9-9999'],
    }
    // 1 đúng / 2 câu thật = 50% — nếu câu lạ bị đếm thì sẽ thành 33.3%.
    expect(scoreSession(SAMPLE_BANK, answered).accuracy).toBe(50)
    expect(scoreSession(SAMPLE_BANK, ghost).accuracy).toBe(50)
  })

  it('câu lạ không làm lệch estimate', () => {
    const session = makeSession([])
    const ghost: Session = { ...session, questionIds: [...session.questionIds, 'p9-9999'] }
    expect(scoreSession(SAMPLE_BANK, ghost).estimate).toEqual(
      scoreSession(SAMPLE_BANK, session).estimate,
    )
  })

  it('phiên chỉ toàn câu lạ → total 0, accuracy 0, không chia cho 0', () => {
    const session = makeSession([5])
    const ghost: Session = { ...session, questionIds: ['p9-9999', 'p9-9998'] }
    const result = scoreSession(SAMPLE_BANK, ghost)
    expect(result.total).toBe(0)
    expect(result.accuracy).toBe(0)
    expect(Number.isNaN(result.accuracy)).toBe(false)
    expect(result.byPart).toEqual([])
    expect(result.byTag).toEqual([])
    expect(result.estimate.listening).toBe(0)
    expect(result.estimate.reading).toBe(0)
    expect(result.estimate.total).toBe(10)
  })
})

describe('scoreSession — thống kê theo part và theo tag', () => {
  it('byPart chỉ chứa part có trong phiên', () => {
    const session = makeSession([1, 2])
    const result = scoreSession(SAMPLE_BANK, session)
    expect(result.byPart.map((entry) => entry.part)).toEqual([1, 2])
  })

  it('byPart sắp xếp tăng dần theo part', () => {
    const result = scoreSession(SAMPLE_BANK, makeSession([7, 1, 5]))
    expect(result.byPart.map((entry) => entry.part)).toEqual([1, 5, 7])
  })

  it('byPart đếm đúng/sai/bỏ trống và accuracy từng part', () => {
    const session = makeSession([1])
    const result = scoreSession(
      SAMPLE_BANK,
      withAnswers(session, { 'p1-0001': 'A', 'p1-0002': 'B' }),
    )
    expect(result.byPart).toEqual([
      { part: 1, total: 2, correct: 1, wrong: 1, blank: 0, accuracy: 50 },
    ])
  })

  it('byPart của part có câu bỏ trống', () => {
    const session = makeSession([5])
    const result = scoreSession(SAMPLE_BANK, withAnswers(session, { 'p5-0001': 'B' }))
    expect(result.byPart).toEqual([
      { part: 5, total: 2, correct: 1, wrong: 0, blank: 1, accuracy: 50 },
    ])
  })

  it('tổng correct của byPart bằng correct toàn phiên', () => {
    const session = answerAllCorrect(makeSession([1, 2, 5, 7]))
    const result = scoreSession(SAMPLE_BANK, session)
    const sum = result.byPart.reduce((acc, entry) => acc + entry.correct, 0)
    expect(sum).toBe(result.correct)
    const totalSum = result.byPart.reduce((acc, entry) => acc + entry.total, 0)
    expect(totalSum).toBe(result.total)
  })

  it('byTag đếm theo từng tag, kể cả tag xuất hiện ở nhiều câu', () => {
    const session = answerAllCorrect(makeSession([1, 7]))
    const result = scoreSession(SAMPLE_BANK, session)
    const byTag = new Map(result.byTag.map((entry) => [entry.tag, entry]))

    // 'photo-description' và 'present-continuous' có ở p1-0001 + p1-0002.
    expect(byTag.get('photo-description')).toEqual({
      tag: 'photo-description',
      total: 2,
      correct: 2,
      accuracy: 100,
    })
    // 'detail' có ở p7-0001 + p7-0002.
    expect(byTag.get('detail')?.total).toBe(2)
    // 'notice' chỉ có ở p7-0001.
    expect(byTag.get('notice')?.total).toBe(1)
  })

  it('byTag tính accuracy riêng cho từng tag', () => {
    const session = makeSession([7])
    // p7-0001 đáp án B, p7-0002 đáp án A; 'detail' phủ cả hai câu.
    const result = scoreSession(
      SAMPLE_BANK,
      withAnswers(session, { 'p7-0001': 'B', 'p7-0002': 'B' }),
    )
    const detail = result.byTag.find((entry) => entry.tag === 'detail')
    expect(detail).toEqual({ tag: 'detail', total: 2, correct: 1, accuracy: 50 })
  })

  it('byTag sắp xếp theo alphabet', () => {
    const result = scoreSession(SAMPLE_BANK, makeSession([]))
    const tags = result.byTag.map((entry) => entry.tag)
    expect(tags).toEqual([...tags].sort())
  })
})

describe('scoreSession — bất biến và an toàn', () => {
  it('không sửa phiên truyền vào', () => {
    const session = makeSession([])
    const snapshot = JSON.parse(JSON.stringify(session))
    scoreSession(SAMPLE_BANK, session)
    expect(session).toEqual(snapshot)
  })

  it('chấm được phiên chưa nộp (phục vụ chế độ luyện tập)', () => {
    const session = makeSession([5])
    expect(session.status).toBe('active')
    expect(() => scoreSession(SAMPLE_BANK, session)).not.toThrow()
  })

  it('gọi hai lần cho kết quả giống nhau (thuần)', () => {
    const session = answerAllCorrect(makeSession([2, 5]))
    expect(scoreSession(SAMPLE_BANK, session)).toEqual(scoreSession(SAMPLE_BANK, session))
  })
})

describe('estimateScore — công thức thật, không hard-code', () => {
  it('đúng hết cả 8 câu → nghe 495, đọc 495, tổng 990', () => {
    const session = answerAllCorrect(makeSession([]))
    const result = scoreSession(SAMPLE_BANK, session)
    expect(result.estimate.listening).toBe(495)
    expect(result.estimate.reading).toBe(495)
    expect(result.estimate.total).toBe(990)
  })

  it('bỏ trống hết → mỗi phần kẹp về 5, tổng kẹp về 10', () => {
    const result = scoreSession(SAMPLE_BANK, makeSession([]))
    expect(result.estimate.listening).toBe(5)
    expect(result.estimate.reading).toBe(5)
    expect(result.estimate.total).toBe(10)
  })

  it('ví dụ số cụ thể: nghe 2/4 đúng, đọc 1/4 đúng → 248 + 124 = 372', () => {
    const session = makeSession([])
    // 4 câu nghe: p1-0001 (A), p1-0002 (A), p2-0001 (A), p2-0002 (A)
    // 4 câu đọc: p5-0001 (B), p5-0002 (A), p7-0001 (B), p7-0002 (A)
    const answered = withAnswers(session, {
      'p1-0001': 'A', // đúng
      'p1-0002': 'A', // đúng
      'p2-0001': 'B', // sai
      'p2-0002': 'C', // sai
      'p5-0001': 'B', // đúng
      'p5-0002': 'B', // sai
      'p7-0001': 'C', // sai
      'p7-0002': 'D', // sai
    })
    const result = scoreSession(SAMPLE_BANK, answered)
    expect(result.correct).toBe(3)
    // round(2/4 * 495) = round(247.5) = 248
    expect(result.estimate.listening).toBe(248)
    // round(1/4 * 495) = round(123.75) = 124
    expect(result.estimate.reading).toBe(124)
    expect(result.estimate.total).toBe(372)
  })

  it('section không có câu nào → điểm 0 (không kẹp lên 5)', () => {
    const readingOnly = makeSession([5, 7])
    const result = scoreSession(SAMPLE_BANK, answerAllCorrect(readingOnly))
    expect(result.estimate.listening).toBe(0)
    expect(result.estimate.reading).toBe(495)
    expect(result.estimate.total).toBe(495)
  })

  it('chỉ có phần nghe cũng cho 0 ở phần đọc', () => {
    const listeningOnly = makeSession([1, 2])
    const result = scoreSession(SAMPLE_BANK, answerAllCorrect(listeningOnly))
    expect(result.estimate.listening).toBe(495)
    expect(result.estimate.reading).toBe(0)
    expect(result.estimate.total).toBe(495)
  })

  it('total luôn bằng listening + reading khi không vượt biên', () => {
    for (const seed of [1, 2, 3, 4, 5]) {
      const session = makeSession([], seed)
      const result = scoreSession(SAMPLE_BANK, session)
      expect(result.estimate.total).toBe(
        result.estimate.listening + result.estimate.reading,
      )
    }
  })

  it('điểm tăng khi số câu đúng tăng (thực sự tính, không hard-code)', () => {
    const session = makeSession([])
    const allCorrect = scoreSession(SAMPLE_BANK, answerAllCorrect(session))
    const noneCorrect = scoreSession(SAMPLE_BANK, session)
    expect(allCorrect.estimate.listening).toBeGreaterThan(noneCorrect.estimate.listening)
    expect(allCorrect.estimate.total).toBeGreaterThan(noneCorrect.estimate.total)
  })

  it('mỗi phần luôn nằm trong thang 0..495, tổng trong 10..990', () => {
    for (const seed of [11, 12, 13]) {
      for (const parts of [[], [1], [5], [1, 5], [1, 2, 5, 7]] as Session['parts'][]) {
        const result = scoreSession(SAMPLE_BANK, makeSession(parts, seed))
        expect(result.estimate.listening).toBeGreaterThanOrEqual(0)
        expect(result.estimate.listening).toBeLessThanOrEqual(495)
        expect(result.estimate.reading).toBeGreaterThanOrEqual(0)
        expect(result.estimate.reading).toBeLessThanOrEqual(495)
        expect(result.estimate.total).toBeGreaterThanOrEqual(10)
        expect(result.estimate.total).toBeLessThanOrEqual(990)
      }
    }
  })

  it('approximate = true và có note tiếng Việt khi đề rút gọn (< 200 câu)', () => {
    const result = scoreSession(SAMPLE_BANK, makeSession([]))
    expect(result.estimate.approximate).toBe(true)
    expect(result.estimate.note.length).toBeGreaterThan(0)
    expect(result.estimate.note).toMatch(/ước lượng/i)
    expect(result.estimate.note).toContain('8/200')
  })

  it('approximate = false khi đủ 200 câu', () => {
    const bank = syntheticFullBank()
    const session = createSession(bank, { mode: 'mock', parts: [], seed: 5, now: NOW })
    expect(session.questionIds).toHaveLength(200)
    // 60/100 câu nghe đúng, 20/100 câu đọc đúng.
    const answers: Record<string, Letter | null> = {}
    for (const question of bank.questions) {
      const isListening = question.section === 'listening'
      const index = Number(question.id.slice(2))
      const hit = isListening ? index < 60 : index < 20
      const wrongLetter: Letter = question.answer === 'A' ? 'B' : 'A'
      answers[question.id] = hit ? question.answer : wrongLetter
    }
    const result = scoreSession(bank, { ...session, answers })
    expect(result.correct).toBe(80)
    // round(60/100 * 495) = 297 ; round(20/100 * 495) = 99
    expect(result.estimate.listening).toBe(297)
    expect(result.estimate.reading).toBe(99)
    expect(result.estimate.total).toBe(396)
    expect(result.estimate.approximate).toBe(false)
    expect(result.estimate.note.length).toBeGreaterThan(0)
  })
})

describe('estimateScore — gọi trực tiếp như một hàm độc lập', () => {
  const session = makeSession([])

  function buildResult(overrides: Partial<SessionResult> = {}): SessionResult {
    return {
      correct: 0,
      wrong: 0,
      blank: 0,
      total: 0,
      accuracy: 0,
      byPart: [],
      byTag: [],
      estimate: {
        listening: 0,
        reading: 0,
        total: 0,
        approximate: false,
        note: '',
      },
      ...overrides,
    }
  }

  it('chấm lại từ byPart cho ra đúng điểm như scoreSession', () => {
    const real = scoreSession(SAMPLE_BANK, answerAllCorrect(session))
    const again = estimateScore(SAMPLE_BANK, answerAllCorrect(session), real)
    expect(again).toEqual(real.estimate)
  })

  it('byPart rỗng nhưng phiên có câu → 0 đúng nên mỗi phần kẹp về 5, tổng 10', () => {
    const estimate: ScoreEstimate = estimateScore(SAMPLE_BANK, session, buildResult())
    expect(estimate.listening).toBe(5)
    expect(estimate.reading).toBe(5)
    expect(estimate.total).toBe(10)
  })

  it('phiên không có câu nào → mỗi phần 0 (không kẹp lên 5), tổng kẹp về 10', () => {
    const empty = makeSession([3, 4])
    expect(empty.questionIds).toHaveLength(0)
    const estimate: ScoreEstimate = estimateScore(SAMPLE_BANK, empty, buildResult())
    expect(estimate.listening).toBe(0)
    expect(estimate.reading).toBe(0)
    expect(estimate.total).toBe(10)
  })

  it('không sửa session hay result truyền vào', () => {
    const real = scoreSession(SAMPLE_BANK, session)
    const sessionSnapshot = JSON.parse(JSON.stringify(session))
    const resultSnapshot = JSON.parse(JSON.stringify(real))
    estimateScore(SAMPLE_BANK, session, real)
    expect(session).toEqual(sessionSnapshot)
    expect(real).toEqual(resultSnapshot)
  })
})
