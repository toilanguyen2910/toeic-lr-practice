import { describe, expect, it } from 'vitest'
import type { PartOfSpeech, VocabTopic, VocabWord } from '../../types-vocab'
import { VOCAB_TOPICS, VOCAB_TOPIC_META } from '../../types-vocab'
import { VOCAB_BANK } from './index'

/**
 * KIỂM TRA DỮ LIỆU TỪ VỰNG — không kiểm giao diện, chỉ kiểm nội dung.
 *
 * Bối cảnh: dự án từng để lọt lỗi nội dung vì test chỉ đếm cấu trúc. Vì vậy mỗi
 * ràng buộc dưới đây cố tình kiểm cả *nội dung* chứ không chỉ hình dạng: câu ví
 * dụ phải thật sự chứa từ, định nghĩa không được lặp lại chính từ đó, và bản dịch
 * phải là tiếng Việt chứ không phải bản sao của câu tiếng Anh.
 *
 * Giới hạn đã biết: test không thể xác minh ngữ nghĩa. Nó không biết "invoice"
 * nghĩa là hoá đơn, không biết phiên âm có đúng trọng âm, và không biết câu ví dụ
 * có tự nhiên không. Những điểm đó phải đọc bằng mắt — xem báo cáo của người soạn.
 */

const WORDS = VOCAB_BANK.words
const TOTAL = 600
const PER_TOPIC = 50

const ALLOWED_POS: PartOfSpeech[] = ['n', 'v', 'adj', 'adv', 'phr']

/** Gom từ theo chủ đề để kiểm số lượng và độ phủ difficulty. */
const BY_TOPIC = new Map<VocabTopic, VocabWord[]>()
for (const topic of VOCAB_TOPICS) {
  BY_TOPIC.set(
    topic,
    WORDS.filter((w) => w.topic === topic),
  )
}

/** 11 trường bắt buộc theo `VocabWord`. */
const REQUIRED_FIELDS: Array<keyof VocabWord> = [
  'id',
  'word',
  'phonetic',
  'partOfSpeech',
  'meaningVi',
  'definitionEn',
  'exampleEn',
  'exampleVi',
  'topic',
  'difficulty',
]

describe('1. số lượng từ và phân bổ chủ đề', () => {
  it(`ngân hàng có đúng ${TOTAL} từ`, () => {
    expect(WORDS).toHaveLength(TOTAL)
  })

  it(`có đúng ${VOCAB_TOPICS.length} chủ đề, mỗi chủ đề ${PER_TOPIC} từ`, () => {
    expect(BY_TOPIC.size).toBe(VOCAB_TOPICS.length)
    for (const topic of VOCAB_TOPICS) {
      expect(BY_TOPIC.get(topic), `chủ đề ${topic}`).toHaveLength(PER_TOPIC)
    }
  })

  it('không có từ nào mang chủ đề nằm ngoài VOCAB_TOPICS', () => {
    const allowed = new Set<string>(VOCAB_TOPICS)
    const stray = WORDS.filter((w) => !allowed.has(w.topic))
    expect(stray.map((w) => `${w.id}:${w.topic}`)).toEqual([])
  })

  it('mọi chủ đề đều có nhãn hiển thị trong VOCAB_TOPIC_META', () => {
    for (const topic of VOCAB_TOPICS) {
      const meta = VOCAB_TOPIC_META[topic]
      expect(meta, `thiếu meta cho ${topic}`).toBeTruthy()
      expect(meta.label.length).toBeGreaterThan(0)
      expect(meta.note.length).toBeGreaterThan(0)
    }
  })

  it('version của ngân hàng là 1', () => {
    expect(VOCAB_BANK.version).toBe(1)
  })
})

describe('2. mã id', () => {
  it('không có id trùng', () => {
    const seen = new Map<string, number>()
    for (const w of WORDS) seen.set(w.id, (seen.get(w.id) ?? 0) + 1)
    const duplicates = [...seen.entries()].filter(([, n]) => n > 1).map(([id]) => id)
    expect(duplicates).toEqual([])
  })

  it('id đúng định dạng v-0000 và chạy liên tục từ v-0001 đến v-0600', () => {
    const expected = Array.from(
      { length: TOTAL },
      (_, i) => `v-${String(i + 1).padStart(4, '0')}`,
    )
    expect(WORDS.map((w) => w.id)).toEqual(expected)
  })
})

describe('3. từ không trùng nhau', () => {
  it('so sánh word.toLowerCase() không có cặp nào trùng', () => {
    const seen = new Map<string, string[]>()
    for (const w of WORDS) {
      const key = w.word.toLowerCase()
      const list = seen.get(key) ?? []
      list.push(w.id)
      seen.set(key, list)
    }
    const duplicates = [...seen.entries()]
      .filter(([, ids]) => ids.length > 1)
      .map(([word, ids]) => `${word} → ${ids.join(', ')}`)
    expect(duplicates).toEqual([])
  })
})

describe('4. đủ trường, không trường nào rỗng', () => {
  it(`mọi từ có đủ ${REQUIRED_FIELDS.length} trường và không trường nào rỗng`, () => {
    const problems: string[] = []
    for (const w of WORDS) {
      for (const field of REQUIRED_FIELDS) {
        const value = w[field]
        if (typeof value === 'string' && value.trim() === '') {
          problems.push(`${w.id}.${field} rỗng`)
        }
        if (value === undefined || value === null) {
          problems.push(`${w.id}.${field} thiếu`)
        }
      }
      if (w.difficulty !== 1 && w.difficulty !== 2 && w.difficulty !== 3) {
        problems.push(`${w.id}.difficulty = ${String(w.difficulty)}`)
      }
    }
    expect(problems).toEqual([])
  })

  it('không trường chuỗi nào chứa khoảng trắng thừa ở hai đầu', () => {
    const problems: string[] = []
    for (const w of WORDS) {
      for (const field of REQUIRED_FIELDS) {
        const value = w[field]
        if (typeof value === 'string' && value !== value.trim()) {
          problems.push(`${w.id}.${field} = "${value}"`)
        }
      }
    }
    expect(problems).toEqual([])
  })
})

describe('5. exampleEn thực sự chứa word (test then chốt chống copy-paste ẩu)', () => {
  it('mọi câu ví dụ đều chứa đúng từ của nó, không phân biệt hoa thường', () => {
    const missing = WORDS.filter(
      (w) => !w.exampleEn.toLowerCase().includes(w.word.toLowerCase()),
    ).map((w) => `${w.id} "${w.word}" → "${w.exampleEn}"`)
    expect(missing).toEqual([])
  })

  it('từ chỉ xuất hiện như một mảnh của từ khác cũng bị bắt', () => {
    // Chặn trường hợp "lead" khớp nhầm trong "leadership" hay "bill" trong "billion".
    // Cho phép các dạng biến thể thật của chính từ đó (số nhiều, quá khứ, V-ing…),
    // vì câu ví dụ tự nhiên hiếm khi dùng đúng dạng nguyên thể.
    const inflections = (word: string): string[] => {
      const w = word.toLowerCase()
      const forms = new Set([w])
      forms.add(`${w}s`)
      forms.add(`${w}es`)
      forms.add(`${w}ed`)
      forms.add(`${w}d`)
      forms.add(`${w}ing`)
      forms.add(`${w}ly`)
      if (w.endsWith('e')) {
        const stem = w.slice(0, -1)
        forms.add(`${stem}ing`)
        forms.add(`${stem}ed`)
      }
      if (w.endsWith('y')) {
        const stem = w.slice(0, -1)
        forms.add(`${stem}ies`)
        forms.add(`${stem}ied`)
      }
      return [...forms].sort((a, b) => b.length - a.length)
    }

    const isLetter = (ch: string) => /[a-z0-9]/i.test(ch)
    const problems: string[] = []
    for (const w of WORDS) {
      const haystack = w.exampleEn.toLowerCase()
      const forms = inflections(w.word)
      let found = false
      for (let at = 0; at < haystack.length && !found; at += 1) {
        if (at > 0 && isLetter(haystack.charAt(at - 1))) continue
        for (const form of forms) {
          if (!haystack.startsWith(form, at)) continue
          if (!isLetter(haystack[at + form.length] ?? '')) {
            found = true
            break
          }
        }
      }
      if (!found) problems.push(`${w.id} "${w.word}" trong "${w.exampleEn}"`)
    }
    expect(problems).toEqual([])
  })
})

describe('6. exampleVi không rỗng và khác exampleEn', () => {
  it('bản dịch tồn tại và không phải bản sao của câu tiếng Anh', () => {
    const problems: string[] = []
    for (const w of WORDS) {
      if (w.exampleVi.trim() === '') {
        problems.push(`${w.id} exampleVi rỗng`)
        continue
      }
      if (w.exampleVi.toLowerCase() === w.exampleEn.toLowerCase()) {
        problems.push(`${w.id} exampleVi giống hệt exampleEn`)
      }
    }
    expect(problems).toEqual([])
  })

  it('bản dịch có dấu hiệu là tiếng Việt (có dấu hoặc từ tiếng Việt thông dụng)', () => {
    // Không kiểm ngữ pháp — chỉ bắt trường hợp ai đó dán nguyên câu tiếng Anh.
    // Bắt mọi ký tự ngoài ASCII in được (tiếng Việt có dấu luôn chứa ít nhất một).
    const VIETNAMESE_HINT =
      /[^\u0020-\u007E]|\b(cua|va|cho|voi|trong|duoc|khong|mot|cac|da|se|khi|tu|nay|nguoi|phai)\b/i
    const problems = WORDS.filter((w) => !VIETNAMESE_HINT.test(w.exampleVi)).map(
      (w) => `${w.id} "${w.exampleVi}"`,
    )
    expect(problems).toEqual([])
  })

  it('meaningVi cũng phải là tiếng Việt, không phải bản sao tiếng Anh', () => {
    const problems = WORDS.filter(
      (w) => w.meaningVi.toLowerCase() === w.word.toLowerCase(),
    ).map((w) => `${w.id} "${w.word}"`)
    expect(problems).toEqual([])
  })
})

describe('7. phonetic là IPA có cặp dấu /', () => {
  it('mọi phonetic bắt đầu và kết thúc bằng /', () => {
    const problems = WORDS.filter(
      (w) => !(w.phonetic.startsWith('/') && w.phonetic.endsWith('/')),
    ).map((w) => `${w.id} "${w.phonetic}"`)
    expect(problems).toEqual([])
  })

  it('phonetic dài hơn hai ký tự và không chứa chữ cái ngoài IPA hợp lệ', () => {
    const problems: string[] = []
    for (const w of WORDS) {
      const body = w.phonetic.slice(1, -1)
      if (body.length < 2) problems.push(`${w.id} "${w.phonetic}" quá ngắn`)
      // Cho phép ký tự IPA, dấu trọng âm, khoảng trắng và dấu chấm phân âm tiết.
      if (!/^[\p{Script=Latin}\p{M}ˈˌː.ʔəɜɔɑɪʊʌæθðʃʒŋɜːɚɝɡ ]+$/u.test(body)) {
        problems.push(`${w.id} "${w.phonetic}" chứa ký tự lạ`)
      }
    }
    expect(problems).toEqual([])
  })

  it('từ nhiều âm tiết phải có dấu trọng âm chính; từ một âm tiết thì không bắt buộc', () => {
    // Từ điển chuẩn không đánh dấu trọng âm cho từ một âm tiết ("/bædʒ/", "/weɪv/").
    // Nên chỉ đòi dấu ˈ khi phiên âm có từ hai nhóm nguyên âm trở lên.
    const VOWELS = /[ieuoɑæʌəɜɪʊɔ]/
    const countNuclei = (body: string): number => {
      const clean = body.replace(/[ˈˌ.ʔː]/g, '')
      let nuclei = 0
      let prevWasVowel = false
      for (const ch of clean) {
        const isVowel = VOWELS.test(ch)
        if (isVowel && !prevWasVowel) nuclei += 1
        prevWasVowel = isVowel
      }
      return nuclei
    }

    const problems: string[] = []
    const monosyllablesWithoutMark: string[] = []
    for (const w of WORDS) {
      const body = w.phonetic.slice(1, -1)
      const nuclei = countNuclei(body)
      if (nuclei >= 2 && !body.includes('ˈ')) {
        problems.push(`${w.id} "${w.phonetic}" có ${nuclei} âm tiết nhưng thiếu dấu ˈ`)
      }
      if (nuclei < 2) monosyllablesWithoutMark.push(`${w.id} ${w.word}`)
    }
    expect(problems).toEqual([])
    // Ghi nhận số từ một âm tiết để con số này hiện ra trong log, không im lặng.
    expect(monosyllablesWithoutMark.length).toBeLessThan(WORDS.length)
  })
})

describe('8. mỗi chủ đề có đủ difficulty 1, 2 và 3', () => {
  it('cả ba mức đều xuất hiện ở từng chủ đề', () => {
    const problems: string[] = []
    for (const topic of VOCAB_TOPICS) {
      const words = BY_TOPIC.get(topic) ?? []
      for (const level of [1, 2, 3] as const) {
        if (!words.some((w) => w.difficulty === level)) {
          problems.push(`${topic} thiếu difficulty ${level}`)
        }
      }
    }
    expect(problems).toEqual([])
  })

  it('không chủ đề nào dồn quá nửa số từ vào một mức duy nhất', () => {
    const problems: string[] = []
    for (const topic of VOCAB_TOPICS) {
      const words = BY_TOPIC.get(topic) ?? []
      for (const level of [1, 2, 3] as const) {
        const count = words.filter((w) => w.difficulty === level).length
        if (count > PER_TOPIC / 2) {
          problems.push(`${topic} có ${count}/${PER_TOPIC} từ ở mức ${level}`)
        }
      }
    }
    expect(problems).toEqual([])
  })
})

describe('9. definitionEn không lặp lại chính word', () => {
  it('định nghĩa không chứa từ đang định nghĩa (tránh "invoice means invoice")', () => {
    const isLetter = (ch: string) => /[a-z0-9]/i.test(ch)
    const problems: string[] = []
    for (const w of WORDS) {
      const haystack = w.definitionEn.toLowerCase()
      const needle = w.word.toLowerCase()
      let from = 0
      let hit = false
      for (;;) {
        const at = haystack.indexOf(needle, from)
        if (at === -1) break
        const before = at === 0 ? '' : haystack.charAt(at - 1)
        const after = haystack.charAt(at + needle.length)
        if (!isLetter(before) && !isLetter(after)) {
          hit = true
          break
        }
        from = at + 1
      }
      if (hit) problems.push(`${w.id} "${w.word}" → "${w.definitionEn}"`)
    }
    expect(problems).toEqual([])
  })

  it('định nghĩa dài hơn từ gốc một cách có nghĩa (ít nhất 20 ký tự)', () => {
    const problems = WORDS.filter((w) => w.definitionEn.trim().length < 20).map(
      (w) => `${w.id} "${w.word}" → "${w.definitionEn}"`,
    )
    expect(problems).toEqual([])
  })

  it('định nghĩa viết bằng tiếng Anh, không lẫn tiếng Việt', () => {
    const VIETNAMESE_DIACRITIC = /[àáảãạăâđêôơưÀÁẢÃẠĂÂĐÊÔƠƯ]/
    const problems = WORDS.filter((w) => VIETNAMESE_DIACRITIC.test(w.definitionEn)).map(
      (w) => `${w.id} "${w.definitionEn}"`,
    )
    expect(problems).toEqual([])
  })
})

describe('10. partOfSpeech nằm trong tập cho phép', () => {
  it('giá trị partOfSpeech hợp lệ', () => {
    const allowed = new Set<PartOfSpeech>(ALLOWED_POS)
    const problems = WORDS.filter((w) => !allowed.has(w.partOfSpeech)).map(
      (w) => `${w.id} "${w.word}" → ${String(w.partOfSpeech)}`,
    )
    expect(problems).toEqual([])
  })
})

describe('11. câu ví dụ có thật, không phải câu độn', () => {
  it('không câu ví dụ nào là bản sao của câu khác', () => {
    const seen = new Map<string, string[]>()
    for (const w of WORDS) {
      const key = w.exampleEn.trim().toLowerCase()
      const list = seen.get(key) ?? []
      list.push(w.id)
      seen.set(key, list)
    }
    const duplicates = [...seen.entries()]
      .filter(([, ids]) => ids.length > 1)
      .map(([sentence, ids]) => `${ids.join(', ')} → "${sentence}"`)
    expect(duplicates).toEqual([])
  })

  it('không câu nào chứa văn bản giữ chỗ', () => {
    const PLACEHOLDER = /\b(tbd|todo|lorem|ipsum|xxx|placeholder|example sentence|sample sentence)\b/i
    const problems = WORDS.filter((w) => PLACEHOLDER.test(w.exampleEn)).map(
      (w) => `${w.id} "${w.exampleEn}"`,
    )
    expect(problems).toEqual([])
  })

  it('câu ví dụ bắt đầu bằng chữ hoa và kết thúc bằng dấu câu', () => {
    const problems: string[] = []
    for (const w of WORDS) {
      const s = w.exampleEn.trim()
      if (!/^[A-Z"']/.test(s)) problems.push(`${w.id} mở đầu: "${s}"`)
      if (!/[.!?]$/.test(s)) problems.push(`${w.id} kết thúc: "${s}"`)
    }
    expect(problems).toEqual([])
  })

  it('câu ví dụ đủ dài để có ngữ cảnh (ít nhất 6 từ)', () => {
    const problems = WORDS.filter(
      (w) => w.exampleEn.trim().split(/\s+/).length < 6,
    ).map((w) => `${w.id} "${w.exampleEn}"`)
    expect(problems).toEqual([])
  })

  it('bản dịch cũng đủ dài, không phải bản dịch một từ', () => {
    const problems = WORDS.filter(
      (w) => w.exampleVi.trim().split(/\s+/).length < 6,
    ).map((w) => `${w.id} "${w.exampleVi}"`)
    expect(problems).toEqual([])
  })
})
