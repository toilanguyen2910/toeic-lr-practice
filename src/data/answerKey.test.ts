import { describe, expect, it } from 'vitest'
import { PART1_QUESTIONS } from './part1'
import { PART2_QUESTIONS } from './part2'
import { PART3_QUESTIONS } from './part3'
import { PART4_QUESTIONS } from './part4'
import { PART5_QUESTIONS } from './part5'
import { PART6_QUESTIONS } from './part6'
import { PART7_QUESTIONS } from './part7'

const ALL = [
  ...PART1_QUESTIONS,
  ...PART2_QUESTIONS,
  ...PART3_QUESTIONS,
  ...PART4_QUESTIONS,
  ...PART5_QUESTIONS,
  ...PART6_QUESTIONS,
  ...PART7_QUESTIONS,
]

/**
 * Bản ghi "đáp án đúng theo NỘI DUNG" trước khi tái cân bằng vị trí.
 * Sau khi xoay thứ tự phương án, nội dung đúng phải y hệt từng câu.
 * Đây là bằng chứng việc đổi vị trí KHÔNG làm sai đáp án.
 */
const CORRECT_TEXT: Record<string, string> = {
  // Part 1
  'p1-0001': 'She is typing on a keyboard.',
  'p1-0002': 'He is repairing a bicycle.',
  'p1-0003': 'They are seated around a meeting table.',
  'p1-0004': 'She is talking on the phone.',
  'p1-0005': 'He is carrying a box near a truck.',
  'p1-0006': 'She is watering the plants.',
  'p1-0007': 'He is writing on the whiteboard.',
  'p1-0008': 'They are standing at the counter.',
  // Part 2
  'p2-0001': 'In the top drawer of my desk.',
  'p2-0002': "Not yet. I'm waiting for the final headcount.",
  'p2-0003': 'Mr. Ortiz took it over last week.',
  'p2-0004': 'The delivery van broke down on the highway.',
  'p2-0005': 'Color. The client specifically asked for it.',
  'p2-0006': 'The first Monday of next month.',
  'p2-0007': "Sure. I'll email it right after this call.",
  'p2-0008': 'I sent it in on Tuesday, actually.',
  'p2-0009': 'About two hours, including the quiz.',
  'p2-0010': "I'll check the booking system right now.",
  'p2-0011': 'Ms. Chen signed off on it yesterday.',
  'p2-0012': 'Actually, they moved it up to Friday.',
  // Part 3
  'p3-0001': 'A venue for a product launch',
  'p3-0002': 'It is too expensive for their budget.',
  'p3-0003': 'Send the man a guest list',
  'p3-0004': 'At a job interview',
  'p3-0005': 'He coordinated shipments between a warehouse and retail stores.',
  'p3-0006': 'The man will take a written test.',
  'p3-0007': 'Arranging her travel to a trade fair',
  'p3-0008': 'It arrives too late for her first meeting.',
  'p3-0009': 'It was far from the venue.',
  'p3-0010': 'To report that part of his order is missing',
  'p3-0011': 'Send the remaining chairs by express courier and waive the delivery fee',
  'p3-0012': 'Email the packing slip',
  // Part 4
  'p4-0001': 'To explain a temporary change to parking arrangements',
  'p4-0002': 'In the lot on Mercer Street',
  'p4-0003': 'Tell the mailroom so couriers go to the loading dock',
  'p4-0004': 'To confirm the arrangements for a department meeting',
  'p4-0005': 'The wireless microphone is unavailable.',
  'p4-0006': 'Call back with his choice and final headcount',
  'p4-0007': 'Describing recent changes to library services',
  'p4-0008': 'It stays open until nine in the evening on weekdays.',
  'p4-0009': 'It has been moved to Sunday afternoon.',
  // Part 5
  'p5-0001': 'obtain',
  'p5-0002': 'to',
  'p5-0003': 'professionally',
  'p5-0004': 'Because of',
  'p5-0005': 'has worked',
  'p5-0006': 'extend',
  'p5-0007': 'whose',
  'p5-0008': 'be',
  'p5-0009': 'must be approved',
  'p5-0010': 'fewer',
  'p5-0011': 'did the company discover',
  'p5-0012': 'dedication',
  'p5-0013': 'on',
  'p5-0014': 'so',
  'p5-0015': 'ensuring',
  'p5-0016': 'approves',
  'p5-0017': 'consistent',
  'p5-0018': 'much',
  'p5-0019': 'regardless',
  'p5-0020': 'Satisfied',
  // Part 6
  'p6-0001': 'scheduled',
  'p6-0002': 'with',
  'p6-0003': 'which',
  'p6-0004': 'informed',
  'p6-0005': 'basis',
  'p6-0006': 'will be conducted',
  'p6-0007': 'attend',
  'p6-0008': 'We look forward to seeing you there.',
  // Part 7
  'p7-0001': 'To inform residents about upcoming water pipe repairs',
  'p7-0002': 'The laundry room in the basement',
  'p7-0003': 'Leave a spare key with the concierge desk',
  'p7-0004': 'They will be notified at least one day before it happens.',
  'p7-0005': 'To ask questions before placing a printing order',
  'p7-0006': '$1.00 each',
  'p7-0007': 'Pay Northwind $40 to clean up his existing file',
  'p7-0008': 'Delivery is free because his order totals more than $500.',
  'p7-0009': "A library's plan to extend its weekend hours",
  'p7-0010': 'A new children\u2019s wing and school partnerships',
  'p7-0011': 'By a grant from a local foundation',
  'p7-0012': 'He doubts the extra hours will attract enough visitors.',
  'p7-0013': 'Her desk was scratched and the assembly kit was missing.',
  'p7-0014': 'The customer has not responded to an alternative offer.',
  'p7-0015': 'A working desk before 12 November',
  'p7-0016': 'It cannot be shipped until 14 November at the earliest.',
}

describe('tái cân bằng vị trí KHÔNG làm đổi đáp án đúng', () => {
  it('mỗi câu vẫn có đúng nội dung đáp án như bản gốc', () => {
    const problems: string[] = []
    for (const q of ALL) {
      const expected = CORRECT_TEXT[q.id]
      expect(expected, `${q.id} chưa có trong bản ghi`).toBeDefined()
      const actual = q.choices.find((c) => c.letter === q.answer)?.text
      if (actual !== expected) {
        problems.push(`${q.id}: đáp án "${actual}" != bản gốc "${expected}"`)
      }
    }
    expect(problems, problems.join('\n')).toEqual([])
  })

  it('bản ghi phủ đủ 85 câu', () => {
    expect(Object.keys(CORRECT_TEXT)).toHaveLength(85)
    for (const q of ALL) expect(CORRECT_TEXT[q.id], `${q.id}`).toBeDefined()
  })

  it('mỗi câu vẫn đủ số phương án như cũ (không mất/nhân bản khi xoay)', () => {
    for (const q of ALL) {
      const expectedCount = q.part === 2 ? 3 : 4
      expect(q.choices, q.id).toHaveLength(expectedCount)
      expect(new Set(q.choices.map((c) => c.text)).size, `${q.id} có phương án trùng`).toBe(expectedCount)
    }
  })
})
