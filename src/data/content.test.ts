import { describe, expect, it } from 'vitest'
import type { Letter, Part, Question } from '../types'
import { PART_META } from '../types'
import { PART1_QUESTIONS, PART1_STIMULI } from './part1'
import { PART2_QUESTIONS, PART2_STIMULI } from './part2'
import { PART3_QUESTIONS, PART3_STIMULI } from './part3'
import { PART4_QUESTIONS, PART4_STIMULI } from './part4'
import { PART5_QUESTIONS } from './part5'
import { PART6_QUESTIONS, PART6_STIMULI } from './part6'
import { PART7_QUESTIONS, PART7_STIMULI } from './part7'
import { FULL_BANK } from './index'

/**
 * KIỂM TRA NỘI DUNG — bộ test này không kiểm tra giao diện, chỉ kiểm tra dữ liệu.
 *
 * Mỗi `describe` là một ràng buộc trong mô tả công việc của team content. Mục đích là
 * bắt được lỗi dữ liệu (thiếu giải thích, sai số lựa chọn, id trùng, trỏ stimulus hỏng)
 * trước khi UI/engine tiêu thụ ngân hàng câu hỏi.
 */

const PER_PART: Record<Part, Question[]> = {
  1: PART1_QUESTIONS,
  2: PART2_QUESTIONS,
  3: PART3_QUESTIONS,
  4: PART4_QUESTIONS,
  5: PART5_QUESTIONS,
  6: PART6_QUESTIONS,
  7: PART7_QUESTIONS,
}

const ALL_STIMULI = [
  ...PART1_STIMULI,
  ...PART2_STIMULI,
  ...PART3_STIMULI,
  ...PART4_STIMULI,
  ...PART6_STIMULI,
  ...PART7_STIMULI,
]

const ALL_QUESTIONS: Question[] = [
  ...PART1_QUESTIONS,
  ...PART2_QUESTIONS,
  ...PART3_QUESTIONS,
  ...PART4_QUESTIONS,
  ...PART5_QUESTIONS,
  ...PART6_QUESTIONS,
  ...PART7_QUESTIONS,
]

/** Số câu mục tiêu của từng part theo chỉ tiêu 85 câu. */
const TARGET_COUNTS: Record<Part, number> = {
  1: 8,
  2: 12,
  3: 12,
  4: 9,
  5: 20,
  6: 8,
  7: 16,
}

describe('số lượng câu và stimulus', () => {
  it('có đủ 85 câu và đúng chỉ tiêu từng part', () => {
    expect(ALL_QUESTIONS).toHaveLength(85)
    for (const part of [1, 2, 3, 4, 5, 6, 7] as Part[]) {
      expect(PER_PART[part], `Part ${part}`).toHaveLength(TARGET_COUNTS[part])
    }
  })

  it('mỗi câu khai báo đúng part và section theo PART_META', () => {
    for (const q of ALL_QUESTIONS) {
      expect(q.part, q.id).toBeGreaterThanOrEqual(1)
      expect(q.part, q.id).toBeLessThanOrEqual(7)
      expect(q.section, q.id).toBe(PART_META[q.part].section)
    }
  })

  it('ngân hàng ghép trong index.ts chứa đúng toàn bộ câu và stimulus', () => {
    expect(FULL_BANK.questions).toHaveLength(85)
    expect(FULL_BANK.stimuli).toHaveLength(ALL_STIMULI.length)
    expect(new Set(FULL_BANK.questions.map((q) => q.id)).size).toBe(85)
  })
})

describe('quy ước id', () => {
  it('mọi id câu hỏi theo đúng dạng p{part}-{4 số}', () => {
    for (const q of ALL_QUESTIONS) {
      const expected = new RegExp(`^p${q.part}-\\d{4}$`)
      expect(q.id, `${q.id} phải khớp ${expected}`).toMatch(expected)
    }
  })

  it('id câu hỏi là duy nhất trên toàn ngân hàng', () => {
    const ids = ALL_QUESTIONS.map((q) => q.id)
    const duplicates = ids.filter((id, i) => ids.indexOf(id) !== i)
    expect(duplicates, `id trùng: ${duplicates.join(', ')}`).toEqual([])
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('mọi stimulus id bắt đầu bằng "g-" và là duy nhất', () => {
    for (const s of ALL_STIMULI) {
      expect(s.id, s.id).toMatch(/^g-p[1-7]-\d{4}$/)
    }
    const ids = ALL_STIMULI.map((s) => s.id)
    expect(new Set(ids).size).toBe(ids.length)
  })
})

describe('liên kết câu hỏi ↔ stimulus', () => {
  it('mọi stimulusId được khai báo đều tồn tại trong ngân hàng', () => {
    const stimulusIds = new Set(ALL_STIMULI.map((s) => s.id))
    for (const q of ALL_QUESTIONS) {
      if (q.stimulusId === undefined) continue
      expect(stimulusIds.has(q.stimulusId), `${q.id} trỏ tới ${q.stimulusId} không tồn tại`).toBe(true)
    }
  })

  it('không có stimulus mồ côi (khai báo mà không câu nào dùng)', () => {
    const used = new Set(ALL_QUESTIONS.map((q) => q.stimulusId).filter((id) => id !== undefined))
    const orphans = ALL_STIMULI.filter((s) => !used.has(s.id)).map((s) => s.id)
    expect(orphans, `stimulus không được dùng: ${orphans.join(', ')}`).toEqual([])
  })

  it('câu có stimulusId dùng stimulus đúng part của nó', () => {
    const byId = new Map(ALL_STIMULI.map((s) => [s.id, s]))
    for (const q of ALL_QUESTIONS) {
      if (q.stimulusId === undefined) continue
      const stimulus = byId.get(q.stimulusId)
      expect(stimulus, q.id).toBeDefined()
      expect(stimulus?.part, `${q.id} dùng stimulus của part khác`).toBe(q.part)
    }
  })

  it('Part 1/2/3/4 có audioScript; Part 6/7 có passages', () => {
    for (const s of ALL_STIMULI) {
      if (s.part <= 4) {
        expect(s.audioScript, `${s.id} thiếu audioScript`).toBeTruthy()
        expect((s.audioScript ?? '').trim().length, `${s.id}`).toBeGreaterThan(20)
      } else {
        expect(s.passages, `${s.id} thiếu passages`).toBeDefined()
        expect(s.passages?.length, `${s.id}`).toBeGreaterThanOrEqual(1)
      }
    }
  })

  it('Part 1 có imageUrl đúng dạng /images/part1-XX.svg', () => {
    expect(PART1_STIMULI).toHaveLength(8)
    for (const s of PART1_STIMULI) {
      expect(s.imageUrl, s.id).toMatch(/^\/images\/part1-\d{2}\.svg$/)
    }
    const urls = PART1_STIMULI.map((s) => s.imageUrl)
    expect(new Set(urls).size, 'ảnh Part 1 bị dùng lại').toBe(8)
  })

  it('mỗi nhóm Part 3/4 có đúng 3 câu; Part 6/7 giữ đúng cấu trúc nhóm', () => {
    const countBy = (questions: Question[]) => {
      const map = new Map<string, number>()
      for (const q of questions) {
        if (q.stimulusId === undefined) continue
        map.set(q.stimulusId, (map.get(q.stimulusId) ?? 0) + 1)
      }
      return map
    }

    for (const [id, n] of countBy(PART3_QUESTIONS)) expect(n, `Part 3 ${id}`).toBe(3)
    for (const [id, n] of countBy(PART4_QUESTIONS)) expect(n, `Part 4 ${id}`).toBe(3)
    for (const [id, n] of countBy(PART6_QUESTIONS)) expect(n, `Part 6 ${id}`).toBe(4)
    expect(countBy(PART3_QUESTIONS).size).toBe(4)
    expect(countBy(PART4_QUESTIONS).size).toBe(3)
    expect(countBy(PART6_QUESTIONS).size).toBe(2)
  })
})

describe('cấu trúc lựa chọn', () => {
  it('Part 2 chỉ có đúng 3 lựa chọn A/B/C', () => {
    for (const q of PART2_QUESTIONS) {
      expect(q.choices, q.id).toHaveLength(3)
      expect(q.choices.map((c) => c.letter), q.id).toEqual(['A', 'B', 'C'])
    }
  })

  it('các part còn lại có đúng 4 lựa chọn A/B/C/D', () => {
    for (const part of [1, 3, 4, 5, 6, 7] as Part[]) {
      for (const q of PER_PART[part]) {
        expect(q.choices, q.id).toHaveLength(4)
        expect(q.choices.map((c) => c.letter), q.id).toEqual(['A', 'B', 'C', 'D'])
      }
    }
  })

  it('không có hai lựa chọn trùng hệt nội dung trong cùng một câu', () => {
    for (const q of ALL_QUESTIONS) {
      const texts = q.choices.map((c) => c.text.trim().toLowerCase())
      const dupes = texts.filter((t, i) => texts.indexOf(t) !== i)
      expect(dupes, `${q.id} có lựa chọn trùng: ${dupes.join(' | ')}`).toEqual([])
    }
  })

  it('mọi lựa chọn có nội dung không rỗng', () => {
    for (const q of ALL_QUESTIONS) {
      for (const c of q.choices) {
        expect(c.text.trim().length, `${q.id} lựa chọn ${c.letter}`).toBeGreaterThan(0)
      }
    }
  })

  it('answer nằm trong danh sách letter của chính câu đó', () => {
    for (const q of ALL_QUESTIONS) {
      const letters = q.choices.map((c) => c.letter) as Letter[]
      expect(letters, `${q.id} answer=${q.answer}`).toContain(q.answer)
    }
  })
})

describe('đề bài và ngữ liệu', () => {
  it('Part 1 và Part 2 có prompt rỗng', () => {
    for (const part of [1, 2] as Part[]) {
      for (const q of PER_PART[part]) expect(q.prompt, q.id).toBe('')
    }
  })

  it('Part 3/4/6/7 có prompt là câu hỏi riêng, không rỗng và kết thúc bằng dấu hỏi', () => {
    const bad: string[] = []
    for (const part of [3, 4, 6, 7] as Part[]) {
      for (const q of PER_PART[part]) {
        if (q.prompt.trim().length <= 5) bad.push(`${q.id}: prompt rỗng`)
        if (!q.prompt.trim().endsWith('?')) bad.push(`${q.id}: prompt không phải câu hỏi`)
      }
    }
    expect(bad, bad.join('\n')).toEqual([])
  })

  it('Part 3/4/6/7: mọi câu đều có stimulusId và prompt khác nhau trong cùng nhóm', () => {
    for (const part of [3, 4, 6, 7] as Part[]) {
      const group = new Map<string, string[]>()
      for (const q of PER_PART[part]) {
        expect(q.stimulusId, `${q.id} thiếu stimulusId`).toBeDefined()
        const key = q.stimulusId ?? ''
        group.set(key, [...(group.get(key) ?? []), q.prompt])
      }
      for (const [key, prompts] of group) {
        expect(new Set(prompts).size, `nhóm ${key} có prompt lặp`).toBe(prompts.length)
      }
    }
  })

  it('Part 5 là câu điền từ: mỗi prompt có đúng một chỗ trống ______', () => {
    for (const q of PART5_QUESTIONS) {
      const blanks = q.prompt.match(/______/g) ?? []
      expect(blanks.length, `${q.id} phải có đúng 1 chỗ trống`).toBe(1)
      expect(q.stimulusId, `${q.id} không được có stimulus`).toBeUndefined()
    }
  })

  it('mỗi đoạn Part 6 có đúng 4 chỗ trống ______ trong văn bản', () => {
    for (const s of PART6_STIMULI) {
      const text = (s.passages ?? []).map((p) => p.text).join('\n')
      expect((text.match(/______/g) ?? []).length, `${s.id} phải có 4 chỗ trống`).toBe(4)
    }
  })

  it('Part 7 có ít nhất một nhóm hai đoạn văn (double passage)', () => {
    const multi = PART7_STIMULI.filter((s) => (s.passages ?? []).length >= 2)
    expect(multi.length, 'phải có ít nhất 1 nhóm 2 đoạn').toBeGreaterThanOrEqual(1)
    for (const s of PART7_STIMULI) {
      expect((s.passages ?? []).length, s.id).toBeGreaterThanOrEqual(1)
    }
  })
})

describe('giải thích và bản dịch', () => {
  it('mọi câu có explanation không rỗng và đủ dài để có nội dung thật', () => {
    for (const q of ALL_QUESTIONS) {
      expect(typeof q.explanation, q.id).toBe('string')
      expect(q.explanation.trim().length, `${q.id} explanation quá ngắn`).toBeGreaterThan(60)
    }
  })

  it('mọi câu có translation không rỗng', () => {
    for (const q of ALL_QUESTIONS) {
      expect(typeof q.translation, q.id).toBe('string')
      expect((q.translation ?? '').trim().length, `${q.id} translation rỗng`).toBeGreaterThan(5)
    }
  })

  it('explanation và translation viết bằng tiếng Việt (có dấu)', () => {
    const vietnamese = /[àáảãạăâđêôơưÀÁẢÃẠĂÂĐÊÔƠƯèéẻẽẹìíỉĩịòóỏõọùúủũụỳýỷỹỵ]/u
    for (const q of ALL_QUESTIONS) {
      expect(vietnamese.test(q.explanation), `${q.id} explanation không có dấu tiếng Việt`).toBe(true)
      expect(vietnamese.test(q.translation ?? ''), `${q.id} translation không có dấu tiếng Việt`).toBe(true)
    }
  })

  it('explanation nhắc tới cả ba đáp án sai còn lại', () => {
    const missing: string[] = []
    for (const q of ALL_QUESTIONS) {
      const distractors = q.choices.map((c) => c.letter).filter((l) => l !== q.answer)
      for (const letter of distractors) {
        // Nêu tên chữ cái phương án nhiễu trong phần giải thích.
        const named = new RegExp(`(^|[^A-Z])${letter}([^A-Za-z]|$)`, 'u').test(q.explanation)
        if (!named) missing.push(`${q.id}: không nêu lý do ${letter} sai`)
      }
    }
    expect(missing, missing.join('\n')).toEqual([])
  })

  it('đáp án đúng không bao giờ bị giải thích là "sai" (bắt lỗi lệch chữ cái sau khi đảo vị trí)', () => {
    const problems: string[] = []
    for (const q of ALL_QUESTIONS) {
      // Xét từng mệnh đề ngăn bằng dấu chấm để không lẫn sang phương án khác.
      const clauses = q.explanation.split(/\.\s+|\n/)
      for (const clause of clauses) {
        const re = /(?<![A-Za-zÀ-ỹ0-9])([ABCD])(?![A-Za-zÀ-ỹ0-9])/g
        let m: RegExpExecArray | null
        while ((m = re.exec(clause)) !== null) {
          if (m[1] !== q.answer) continue
          if (/\bsai\b/.test(clause) && !/\bđúng\b/.test(clause)) {
            problems.push(`${q.id}: đáp án ${q.answer} nằm trong mệnh đề chỉ nói "sai": "${clause.trim().slice(0, 60)}"`)
          }
        }
      }
    }
    expect(problems, problems.join('\n')).toEqual([])
  })
})

describe('difficulty và tags', () => {
  it('difficulty luôn nằm trong khoảng 1–5', () => {
    for (const q of ALL_QUESTIONS) {
      expect([1, 2, 3, 4, 5], q.id).toContain(q.difficulty)
    }
  })

  it('difficulty được phân bố: dùng ít nhất 4 mức khác nhau, không dồn vào một mức', () => {
    const counts = new Map<number, number>()
    for (const q of ALL_QUESTIONS) counts.set(q.difficulty, (counts.get(q.difficulty) ?? 0) + 1)
    const levelsUsed = counts.size
    expect(levelsUsed, 'phải dùng ít nhất 4 mức difficulty').toBeGreaterThanOrEqual(4)

    const maxShare = Math.max(...counts.values()) / ALL_QUESTIONS.length
    expect(maxShare, 'một mức difficulty chiếm quá nửa ngân hàng').toBeLessThan(0.5)
  })

  it('mỗi part có độ khó trung bình hợp lý, không phải hằng số', () => {
    for (const part of [1, 2, 3, 4, 5, 6, 7] as Part[]) {
      const questions = PER_PART[part]
      const levels = new Set(questions.map((q) => q.difficulty))
      expect(levels.size, `Part ${part} chỉ có một mức difficulty`).toBeGreaterThanOrEqual(2)
    }
  })

  it('tags không rỗng, mỗi câu 1–3 nhãn, nhãn dạng kebab-case', () => {
    for (const q of ALL_QUESTIONS) {
      expect(q.tags.length, `${q.id} phải có 1–3 tag`).toBeGreaterThanOrEqual(1)
      expect(q.tags.length, `${q.id} có quá 3 tag`).toBeLessThanOrEqual(3)
      for (const tag of q.tags) {
        expect(tag, `${q.id} tag không hợp lệ: "${tag}"`).toMatch(/^[a-z][a-z0-9]*(-[a-z0-9]+)*$/)
      }
      expect(new Set(q.tags).size, `${q.id} có tag lặp`).toBe(q.tags.length)
    }
  })
})

describe('đa dạng nội dung', () => {
  it('không có hai câu nào trùng hệt đề bài trong cùng part', () => {
    for (const part of [1, 2, 3, 4, 5, 6, 7] as Part[]) {
      const prompts = PER_PART[part].map((q) => `${q.prompt}|${q.stimulusId ?? ''}`)
      expect(new Set(prompts).size, `Part ${part} có đề bài lặp`).toBe(prompts.length)
    }
  })

  it('toàn bộ audioScript của Part 2 là câu hỏi khác nhau', () => {
    const scripts = PART2_STIMULI.map((s) => s.audioScript ?? '')
    expect(new Set(scripts).size).toBe(PART2_STIMULI.length)
    for (const script of scripts) expect(script.trim().endsWith('?')).toBe(true)
  })

  it('Part 1 mỗi stimulus có 4 phương án in trong audioScript đúng thứ tự A–D', () => {
    for (const s of PART1_STIMULI) {
      const script = s.audioScript ?? ''
      for (const letter of ['A', 'B', 'C', 'D']) {
        expect(script, `${s.id} thiếu (${letter})`).toContain(`(${letter})`)
      }
      const order = ['(A)', '(B)', '(C)', '(D)'].map((mark) => script.indexOf(mark))
      expect(order, `${s.id} sai thứ tự phương án`).toEqual([...order].sort((a, b) => a - b))
    }
  })

  it('Part 1: audioScript phải đọc đúng 4 phương án trong choices, cùng thứ tự A–D', () => {
    const problems: string[] = []
    const byStimulus = new Map(PART1_QUESTIONS.map((q) => [q.stimulusId ?? '', q]))
    for (const s of PART1_STIMULI) {
      const q = byStimulus.get(s.id)
      if (!q) {
        problems.push(`${s.id}: không có câu hỏi tương ứng`)
        continue
      }
      const script = s.audioScript ?? ''
      for (const c of q.choices) {
        // Bản đọc phải chứa nguyên văn nội dung phương án (bỏ dấu chấm cuối nếu có).
        const needle = c.text.trim().replace(/\.$/, '')
        if (!script.includes(needle)) {
          problems.push(`${s.id} (${c.letter}): audioScript không đọc "${needle}"`)
        }
      }
    }
    expect(problems, problems.join('\n')).toEqual([])
  })

  it('Part 1: audioScript không có dấu chấm đôi ở cuối phương án', () => {
    const problems: string[] = []
    for (const s of PART1_STIMULI) {
      const script = s.audioScript ?? ''
      // Sau mỗi "(X) ..." phải là đúng MỘT dấu chấm rồi khoảng trắng (hoặc hết chuỗi).
      const parts = script.split(/\(([A-D])\)/)
      // parts = ['', 'A', ' text ', 'B', ' text ', ...]
      for (let i = 1; i < parts.length; i += 2) {
        const letter = parts[i]
        const body = (parts[i + 1] ?? '').trim()
        if (/\.\./.test(body)) problems.push(`${s.id} (${letter}): "${body}" có dấu chấm đôi`)
        if (!body.endsWith('.')) problems.push(`${s.id} (${letter}): "${body}" thiếu dấu chấm cuối`)
      }
    }
    expect(problems, problems.join('\n')).toEqual([])
  })
})

describe('đáp án đúng không trùng lặp vị trí bất thường', () => {
  it('mỗi part dùng ít nhất hai vị trí đáp án đúng khác nhau', () => {
    for (const part of [1, 2, 3, 4, 5, 6, 7] as Part[]) {
      const answers = new Set(PER_PART[part].map((q) => q.answer))
      expect(answers.size, `Part ${part} dồn hết đáp án vào một chỗ`).toBeGreaterThanOrEqual(2)
    }
  })

  it('mỗi part phân bố đáp án đúng tương đối đều (không chữ cái nào chiếm quá nửa part)', () => {
    const problems: string[] = []
    for (const part of [1, 2, 3, 4, 5, 6, 7] as Part[]) {
      const questions = PER_PART[part]
      const counts = new Map<string, number>()
      for (const q of questions) counts.set(q.answer, (counts.get(q.answer) ?? 0) + 1)
      for (const [letter, n] of counts) {
        if (n / questions.length > 0.5) {
          problems.push(`Part ${part}: ${letter} chiếm ${n}/${questions.length}`)
        }
      }
      // Part 2 chỉ có A/B/C nên không yêu cầu D.
      const usable = part === 2 ? ['A', 'B', 'C'] : ['A', 'B', 'C', 'D']
      for (const letter of usable) {
        if ((counts.get(letter) ?? 0) === 0) problems.push(`Part ${part}: không có đáp án ${letter}`)
      }
    }
    expect(problems, problems.join('\n')).toEqual([])
  })

  it('toàn ngân hàng: mỗi chữ cái A–D chiếm 18–32% số câu', () => {
    const counts = new Map<string, number>()
    for (const q of ALL_QUESTIONS) counts.set(q.answer, (counts.get(q.answer) ?? 0) + 1)
    const problems: string[] = []
    for (const letter of ['A', 'B', 'C', 'D']) {
      const n = counts.get(letter) ?? 0
      const pct = (n / ALL_QUESTIONS.length) * 100
      if (pct < 18 || pct > 32) problems.push(`${letter}: ${n} câu (${pct.toFixed(1)}%) ngoài khoảng 18–32%`)
    }
    expect(problems, problems.join('\n')).toEqual([])
  })
})

describe('độ dài phương án không để lộ đáp án', () => {
  it('đáp án đúng không dài bất thường so với trung bình các phương án nhiễu', () => {
    const problems: string[] = []
    for (const q of ALL_QUESTIONS) {
      const correct = q.choices.find((c) => c.letter === q.answer)
      if (!correct) continue
      const others = q.choices.filter((c) => c.letter !== q.answer)
      const avgOthers = others.reduce((sum, c) => sum + c.text.length, 0) / others.length
      // Đáp án đúng dài gấp đôi trung bình nhiễu (và hơn 15 ký tự) thì dễ đoán mà không cần đọc.
      if (correct.text.length > avgOthers * 2 && correct.text.length - avgOthers > 15) {
        problems.push(
          `${q.id}: đúng ${correct.text.length} ký tự vs trung bình nhiễu ${avgOthers.toFixed(0)}`,
        )
      }
    }
    expect(problems, problems.join('\n')).toEqual([])
  })
})
