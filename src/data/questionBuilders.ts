import type { Difficulty, Letter, Passage, Question, Stimulus } from '../types'

/**
 * Bộ dựng câu hỏi dùng chung cho các tệp mở rộng ngân hàng câu hỏi.
 *
 * Lý do tồn tại: các tệp `part5b.ts`, `part6b.ts`… có hàng trăm câu cùng cấu trúc.
 * Viết tay từng object `Question` sẽ dài gấp ba và dễ sai chính tả khoá. Bộ dựng này
 * chỉ gộp phần lặp lại (part/section/letter) và KHÔNG che giấu dữ liệu nào: mọi câu
 * vẫn khai báo đủ id, difficulty, tags, prompt, bốn phương án, đáp án, giải thích, bản dịch.
 *
 * `Question` là kiểu hợp đồng trong `src/types.ts`, không đổi gì ở đó.
 */

const LETTERS = ['A', 'B', 'C', 'D'] as const
type LetterIndex = 0 | 1 | 2 | 3

/** Dựng bốn lựa chọn từ bộ bốn chuỗi theo đúng thứ tự A, B, C, D. */
function toChoices(texts: [string, string, string, string]) {
  return LETTERS.map((letter, index) => ({ letter, text: texts[index as LetterIndex] }))
}

/** Hàng dữ liệu thô của một câu điền từ/reading: đúng thứ tự A, B, C, D. */
export interface ReadingRow {
  id: string
  difficulty: Difficulty
  tags: string[]
  prompt: string
  /** Bốn phương án theo đúng thứ tự A, B, C, D. */
  choices: [string, string, string, string]
  answer: Letter
  explanation: string
  translation: string
  /** Chỉ Part 3/4/6/7 mới có. */
  stimulusId?: string
}

/** Dựng `Question` cho Part 5 (không có stimulus). */
export function buildPart5(rows: ReadingRow[]): Question[] {
  return rows.map((row) => ({
    id: row.id,
    part: 5,
    section: 'reading',
    difficulty: row.difficulty,
    tags: row.tags,
    prompt: row.prompt,
    choices: toChoices(row.choices),
    answer: row.answer,
    explanation: row.explanation,
    translation: row.translation,
  }))
}

/** Dựng `Question` cho Part 6/7 (bắt buộc có `stimulusId`). */
export function buildReading(part: 6 | 7, rows: ReadingRow[]): Question[] {
  return rows.map((row) => ({
    id: row.id,
    part,
    section: 'reading',
    difficulty: row.difficulty,
    tags: row.tags,
    stimulusId: row.stimulusId,
    prompt: row.prompt,
    choices: toChoices(row.choices),
    answer: row.answer,
    explanation: row.explanation,
    translation: row.translation,
  }))
}

/** Dựng `Question` cho Part 1/3/4 (bắt buộc có `stimulusId`, `prompt` để trống với Part 1). */
export function buildListening(part: 1 | 3 | 4, rows: ReadingRow[]): Question[] {
  return rows.map((row) => ({
    id: row.id,
    part,
    section: 'listening',
    difficulty: row.difficulty,
    tags: row.tags,
    stimulusId: row.stimulusId,
    prompt: row.prompt,
    choices: toChoices(row.choices),
    answer: row.answer,
    explanation: row.explanation,
    translation: row.translation,
  }))
}

/** Khai báo một nhóm Part 3/4: stimulus + đúng ba câu hỏi. */
export interface ListeningGroup {
  id: string
  part: 3 | 4
  audioScript: string
  questions: ReadingRow[]
}

/** Khai báo một nhóm Part 6/7: stimulus + các câu hỏi. */
export interface ReadingGroup {
  id: string
  part: 6 | 7
  passages: Passage[]
  questions: ReadingRow[]
}

/** Trải stimuli của nhiều nhóm Part 3/4 thành một mảng `Stimulus`. */
export function listeningStimuli(groups: ListeningGroup[]): Stimulus[] {
  return groups.map((g) => ({ id: g.id, part: g.part, audioScript: g.audioScript }))
}

/** Trải toàn bộ câu hỏi của các nhóm Part 3/4, tự gắn `stimulusId` và `part` của nhóm. */
export function listeningQuestions(groups: ListeningGroup[]): Question[] {
  return groups.flatMap((g) => {
    const rows: ReadingRow[] = g.questions.map((q) => ({ ...q, stimulusId: g.id }))
    return buildListening(g.part, rows)
  })
}

/** Trải stimuli của nhiều nhóm Part 6/7 thành một mảng `Stimulus`. */
export function readingStimuli(groups: ReadingGroup[]): Stimulus[] {
  return groups.map((g) => ({ id: g.id, part: g.part, passages: g.passages }))
}

/** Trải toàn bộ câu hỏi của các nhóm Part 6/7, tự gắn `stimulusId` và `part` của nhóm. */
export function readingQuestions(groups: ReadingGroup[]): Question[] {
  return groups.flatMap((g) => {
    const rows: ReadingRow[] = g.questions.map((q) => ({ ...q, stimulusId: g.id }))
    return buildReading(g.part, rows)
  })
}
