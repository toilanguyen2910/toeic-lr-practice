import { describe, expect, it } from 'vitest'
import {
  buildQuizChoices,
  filterWords,
  pickDueWords,
  recordAnswer,
  summarizeProgress,
} from './vocab'
import type { VocabBank, VocabProgress, VocabWord } from '../types-vocab'
import { BOX_INTERVAL_DAYS } from '../types-vocab'

const NOW = 1_700_000_000_000
const DAY = 24 * 60 * 60 * 1000

/** Ngân hàng giả nhỏ, đủ để kiểm công thức mà không phụ thuộc dữ liệu thật. */
function makeWord(n: number, overrides: Partial<VocabWord> = {}): VocabWord {
  return {
    id: `v-${String(n).padStart(4, '0')}`,
    word: `word${n}`,
    phonetic: '/wɜːd/',
    partOfSpeech: 'n',
    meaningVi: `nghĩa ${n}`,
    definitionEn: `definition ${n}`,
    exampleEn: `This is word${n}.`,
    exampleVi: `Đây là từ ${n}.`,
    topic: 'office',
    difficulty: 1,
    ...overrides,
  }
}

function makeBank(count: number): VocabBank {
  return { version: 1, words: Array.from({ length: count }, (_, i) => makeWord(i + 1)) }
}

/** Nguồn ngẫu nhiên tất định để test lặp lại được. */
function seededRandom(seed: number): () => number {
  let state = seed >>> 0
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0
    return state / 0x100000000
  }
}

describe('summarizeProgress', () => {
  it('ngân hàng rỗng → mọi số bằng 0', () => {
    const summary = summarizeProgress({ version: 1, words: [] }, {}, NOW)
    expect(summary).toEqual({
      totalWords: 0,
      started: 0,
      mastered: 0,
      dueToday: 0,
      untouched: 0,
    })
  })

  it('chưa học từ nào → tất cả đều là từ mới và đều đến hạn', () => {
    const bank = makeBank(10)
    const summary = summarizeProgress(bank, {}, NOW)
    expect(summary.totalWords).toBe(10)
    expect(summary.untouched).toBe(10)
    expect(summary.dueToday).toBe(10)
    expect(summary.started).toBe(0)
    expect(summary.mastered).toBe(0)
  })

  it('đếm đúng số đã thuộc (hộp 5)', () => {
    const bank = makeBank(3)
    const progress: VocabProgress = {
      'v-0001': { box: 5, nextReviewAt: NOW + DAY, correct: 5, wrong: 0, lastSeenAt: NOW },
      'v-0002': { box: 3, nextReviewAt: NOW + DAY, correct: 2, wrong: 1, lastSeenAt: NOW },
      'v-0003': { box: 5, nextReviewAt: NOW + DAY, correct: 4, wrong: 0, lastSeenAt: NOW },
    }
    const summary = summarizeProgress(bank, progress, NOW)
    expect(summary.started).toBe(3)
    expect(summary.mastered).toBe(2)
    expect(summary.untouched).toBe(0)
    expect(summary.dueToday).toBe(0) // cả ba đều chưa đến hạn
  })

  it('từ đã thuộc nhưng đến hạn vẫn tính vào dueToday', () => {
    const bank = makeBank(1)
    const progress: VocabProgress = {
      'v-0001': { box: 5, nextReviewAt: NOW - 1, correct: 5, wrong: 0, lastSeenAt: NOW - DAY },
    }
    expect(summarizeProgress(bank, progress, NOW).dueToday).toBe(1)
  })
})

describe('pickDueWords', () => {
  it('limit 0 → mảng rỗng', () => {
    expect(pickDueWords(makeBank(5), {}, NOW, 0)).toEqual([])
  })

  it('limit âm hoặc NaN → mảng rỗng, không throw', () => {
    const bank = makeBank(5)
    expect(pickDueWords(bank, {}, NOW, -3)).toEqual([])
    expect(pickDueWords(bank, {}, NOW, Number.NaN)).toEqual([])
  })

  it('không trả nhiều hơn limit', () => {
    expect(pickDueWords(makeBank(100), {}, NOW, 7)).toHaveLength(7)
  })

  it('không trả nhiều hơn số từ có trong ngân hàng', () => {
    expect(pickDueWords(makeBank(3), {}, NOW, 50)).toHaveLength(3)
  })

  it('từ chưa học được lấy trước từ đã thuộc', () => {
    const bank = makeBank(3)
    const progress: VocabProgress = {
      'v-0001': { box: 5, nextReviewAt: NOW + DAY, correct: 5, wrong: 0, lastSeenAt: NOW },
      'v-0002': { box: 5, nextReviewAt: NOW + DAY, correct: 5, wrong: 0, lastSeenAt: NOW },
    }
    const picked = pickDueWords(bank, progress, NOW, 1)
    expect(picked[0]?.id).toBe('v-0003')
  })

  it('từ đến hạn được lấy trước từ chưa học', () => {
    const bank = makeBank(2)
    // v-0001 chưa học; v-0002 đến hạn ôn
    const progress: VocabProgress = {
      'v-0002': { box: 2, nextReviewAt: NOW - DAY, correct: 1, wrong: 0, lastSeenAt: NOW - 2 * DAY },
    }
    const picked = pickDueWords(bank, progress, NOW, 1)
    expect(picked[0]?.id).toBe('v-0002')
  })

  it('hộp thấp được ôn trước hộp cao', () => {
    const bank = makeBank(3)
    const progress: VocabProgress = {
      'v-0001': { box: 4, nextReviewAt: NOW - DAY, correct: 3, wrong: 1, lastSeenAt: NOW - 8 * DAY },
      'v-0002': { box: 1, nextReviewAt: NOW - DAY, correct: 0, wrong: 3, lastSeenAt: NOW - 2 * DAY },
      'v-0003': { box: 2, nextReviewAt: NOW - DAY, correct: 1, wrong: 1, lastSeenAt: NOW - 4 * DAY },
    }
    const picked = pickDueWords(bank, progress, NOW, 3)
    expect(picked.map((w) => w.id)).toEqual(['v-0002', 'v-0003', 'v-0001'])
  })

  it('tất định: cùng đầu vào cho cùng kết quả', () => {
    const bank = makeBank(50)
    const progress: VocabProgress = {
      'v-0010': { box: 2, nextReviewAt: NOW - DAY, correct: 1, wrong: 0, lastSeenAt: NOW },
    }
    const a = pickDueWords(bank, progress, NOW, 20).map((w) => w.id)
    const b = pickDueWords(bank, progress, NOW, 20).map((w) => w.id)
    expect(a).toEqual(b)
  })

  it('không sửa tiến độ truyền vào', () => {
    const bank = makeBank(5)
    const progress: VocabProgress = {}
    const before = JSON.stringify(progress)
    pickDueWords(bank, progress, NOW, 5)
    expect(JSON.stringify(progress)).toBe(before)
  })
})

describe('recordAnswer', () => {
  it('đúng lần đầu → hộp 2, hẹn 3 ngày', () => {
    const next = recordAnswer({}, 'v-0001', true, NOW)
    const entry = next['v-0001']!
    expect(entry.box).toBe(2)
    expect(entry.nextReviewAt).toBe(NOW + BOX_INTERVAL_DAYS[2] * DAY)
    expect(entry.correct).toBe(1)
    expect(entry.wrong).toBe(0)
  })

  it('sai → về hộp 1, hẹn 1 ngày', () => {
    const start: VocabProgress = {
      'v-0001': { box: 4, nextReviewAt: NOW, correct: 8, wrong: 1, lastSeenAt: NOW - DAY },
    }
    const next = recordAnswer(start, 'v-0001', false, NOW)
    const entry = next['v-0001']!
    expect(entry.box).toBe(1)
    expect(entry.wrong).toBe(2)
    expect(entry.correct).toBe(8) // không mất lịch sử đúng
  })

  it('đúng liên tục thì lên hộp, tối đa hộp 5', () => {
    let progress: VocabProgress = {}
    for (let i = 0; i < 10; i += 1) {
      progress = recordAnswer(progress, 'v-0001', true, NOW + i * DAY)
    }
    expect(progress['v-0001']!.box).toBe(5)
    expect(progress['v-0001']!.correct).toBe(10)
  })

  it('không sửa tiến độ truyền vào', () => {
    const start: VocabProgress = {
      'v-0001': { box: 2, nextReviewAt: NOW, correct: 1, wrong: 0, lastSeenAt: NOW },
    }
    const before = JSON.stringify(start)
    recordAnswer(start, 'v-0001', true, NOW)
    expect(JSON.stringify(start)).toBe(before)
  })

  it('từ chưa có trong tiến độ vẫn ghi được', () => {
    const next = recordAnswer({}, 'v-9999', false, NOW)
    expect(next['v-9999']!.box).toBe(1)
    expect(next['v-9999']!.wrong).toBe(1)
  })
})

describe('buildQuizChoices', () => {
  const bank: VocabBank = {
    version: 1,
    words: [
      makeWord(1, { topic: 'office', meaningVi: 'a' }),
      makeWord(2, { topic: 'office', meaningVi: 'b' }),
      makeWord(3, { topic: 'office', meaningVi: 'c' }),
      makeWord(4, { topic: 'office', meaningVi: 'd' }),
      makeWord(5, { topic: 'finance', meaningVi: 'e' }),
    ],
  }

  it('luôn có đúng 4 lựa chọn', () => {
    const choices = buildQuizChoices(bank, bank.words[0]!, seededRandom(1))
    expect(choices).toHaveLength(4)
  })

  it('có đúng 1 đáp án đúng, và đúng là từ được hỏi', () => {
    const word = bank.words[0]!
    const choices = buildQuizChoices(bank, word, seededRandom(2))
    const correct = choices.filter((c) => c.correct)
    expect(correct).toHaveLength(1)
    expect(correct[0]!.wordId).toBe(word.id)
    expect(correct[0]!.text).toBe(word.meaningVi)
  })

  it('không có hai lựa chọn trùng nội dung', () => {
    const choices = buildQuizChoices(bank, bank.words[0]!, seededRandom(3))
    const texts = choices.map((c) => c.text)
    expect(new Set(texts).size).toBe(texts.length)
  })

  it('không lặp lại từ được hỏi trong các nhiễu', () => {
    const word = bank.words[0]!
    const choices = buildQuizChoices(bank, word, seededRandom(4))
    expect(choices.filter((c) => c.wordId === word.id)).toHaveLength(1)
  })

  it('ưu tiên nhiễu cùng chủ đề', () => {
    const choices = buildQuizChoices(bank, bank.words[0]!, seededRandom(5))
    const distractorIds = choices.filter((c) => !c.correct).map((c) => c.wordId)
    // Cùng chủ đề có 3 từ (v-0002..v-0004) nên cả 3 nhiễu đều lấy từ đó.
    expect(distractorIds.every((id) => ['v-0002', 'v-0003', 'v-0004'].includes(id))).toBe(true)
  })

  it('tất định theo nguồn ngẫu nhiên', () => {
    const a = buildQuizChoices(bank, bank.words[0]!, seededRandom(9))
    const b = buildQuizChoices(bank, bank.words[0]!, seededRandom(9))
    expect(a).toEqual(b)
  })
})

describe('filterWords', () => {
  const bank: VocabBank = {
    version: 1,
    words: [
      makeWord(1, { topic: 'office', difficulty: 1, meaningVi: 'hoá đơn' }),
      makeWord(2, { topic: 'finance', difficulty: 2, meaningVi: 'ngân sách' }),
      makeWord(3, { topic: 'travel', difficulty: 3, meaningVi: 'hành trình' }),
    ],
  }
  const progress: VocabProgress = {
    'v-0001': { box: 5, nextReviewAt: NOW, correct: 3, wrong: 0, lastSeenAt: NOW },
    'v-0002': { box: 2, nextReviewAt: NOW, correct: 1, wrong: 1, lastSeenAt: NOW },
  }

  it('không lọc gì → trả cả ngân hàng', () => {
    expect(filterWords(bank, progress, {})).toHaveLength(3)
  })

  it('lọc theo chủ đề', () => {
    expect(filterWords(bank, progress, { topic: 'finance' }).map((w) => w.id)).toEqual(['v-0002'])
  })

  it('lọc theo mức độ', () => {
    expect(filterWords(bank, progress, { difficulty: 3 }).map((w) => w.id)).toEqual(['v-0003'])
  })

  it('lọc "new" → chỉ từ chưa có tiến độ', () => {
    expect(filterWords(bank, progress, { status: 'new' }).map((w) => w.id)).toEqual(['v-0003'])
  })

  it('lọc "learning" → có tiến độ nhưng chưa hộp 5', () => {
    expect(filterWords(bank, progress, { status: 'learning' }).map((w) => w.id)).toEqual(['v-0002'])
  })

  it('lọc "mastered" → chỉ hộp 5', () => {
    expect(filterWords(bank, progress, { status: 'mastered' }).map((w) => w.id)).toEqual(['v-0001'])
  })

  it('tìm theo từ khoá, không phân biệt hoa thường', () => {
    expect(filterWords(bank, progress, { query: 'HOÁ' }).map((w) => w.id)).toEqual(['v-0001'])
  })

  it('tìm tiếng Việt KHÔNG DẤU vẫn ra kết quả', () => {
    // LỖI TỪNG CÓ: gõ "hoá đơn" ra 2 dòng, nhưng "hóa đơn" (dấu sắc thay dấu
    // huyền) và "hoa don" (không dấu) đều ra 0. Người Việt gõ ba cách như nhau
    // là chuyện thường, nên tìm kiếm phải chuẩn hoá dấu.
    expect(filterWords(bank, progress, { query: 'hoa don' }).map((w) => w.id)).toEqual(['v-0001'])
    expect(filterWords(bank, progress, { query: 'HOA DON' }).map((w) => w.id)).toEqual(['v-0001'])
    expect(filterWords(bank, progress, { query: 'hoá đơn' }).map((w) => w.id)).toEqual(['v-0001'])
    expect(filterWords(bank, progress, { query: 'hóa đơn' }).map((w) => w.id)).toEqual(['v-0001'])
  })

  it('tìm "ngan sach" (không dấu) ra "ngân sách"', () => {
    expect(filterWords(bank, progress, { query: 'ngan sach' }).map((w) => w.id)).toEqual(['v-0002'])
  })

  it('tìm có chữ đ vẫn khớp khi gõ d', () => {
    const bank2: VocabBank = {
      version: 1,
      words: [makeWord(1, { meaningVi: 'đường dây' })],
    }
    expect(filterWords(bank2, {}, { query: 'duong day' })).toHaveLength(1)
    expect(filterWords(bank2, {}, { query: 'đường dây' })).toHaveLength(1)
  })

  it('tìm theo nghĩa tiếng Anh', () => {
    expect(filterWords(bank, progress, { query: 'definition 3' }).map((w) => w.id)).toEqual(['v-0003'])
  })

  it('kết hợp nhiều điều kiện', () => {
    expect(filterWords(bank, progress, { topic: 'finance', status: 'learning' })).toHaveLength(1)
    expect(filterWords(bank, progress, { topic: 'finance', status: 'mastered' })).toHaveLength(0)
  })

  it('không có kết quả → mảng rỗng, không throw', () => {
    expect(filterWords(bank, progress, { query: 'không tồn tại xyz' })).toEqual([])
  })
})
