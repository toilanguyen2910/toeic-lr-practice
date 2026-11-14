/**
 * HỢP ĐỒNG DỮ LIỆU DÙNG CHUNG — nguồn sự thật duy nhất về kiểu dữ liệu.
 *
 * Quy ước bắt buộc:
 * - Tệp này KHÔNG import React, KHÔNG chạm DOM, KHÔNG có side-effect.
 * - Mọi module khác import kiểu từ đây, không tự định nghĩa lại.
 */

export type Section = 'listening' | 'reading'

export type Part = 1 | 2 | 3 | 4 | 5 | 6 | 7

/** Part 2 chỉ có 3 lựa chọn; các part khác có 4. */
export type Letter = 'A' | 'B' | 'C' | 'D'

export type Difficulty = 1 | 2 | 3 | 4 | 5

export interface Choice {
  letter: Letter
  text: string
}

export interface Passage {
  /** Nhãn hiển thị, ví dụ "Email", "Thông báo", "Hội thoại". */
  label?: string
  text: string
}

/**
 * Ngữ liệu dùng chung cho một nhóm câu hỏi.
 * - Part 1: `audioScript` + `imageUrl`
 * - Part 2: `audioScript`
 * - Part 3, 4: `audioScript` (lời thoại)
 * - Part 6, 7: `passages`
 */
export interface Stimulus {
  id: string
  part: Part
  audioScript?: string
  passages?: Passage[]
  imageUrl?: string
}

export interface Question {
  /** Mã duy nhất, quy ước `p{part}-{số thứ tự 4 chữ số}`, ví dụ `p5-0001`. */
  id: string
  part: Part
  section: Section
  difficulty: Difficulty
  /** Nhãn kỹ năng, ví dụ `word-form`, `inference`, `preposition`. */
  tags: string[]
  /** Trỏ tới `Stimulus.id` khi câu hỏi thuộc một nhóm (Part 3, 4, 6, 7). */
  stimulusId?: string
  /** Đề bài. Với Part 1 và Part 2 để chuỗi rỗng. */
  prompt: string
  choices: Choice[]
  answer: Letter
  /** Giải thích vì sao đáp án đúng và vì sao các đáp án khác sai. */
  explanation: string
  /** Bản dịch tiếng Việt của ngữ liệu/đề bài. */
  translation?: string
}

export interface QuestionBank {
  version: number
  stimuli: Stimulus[]
  questions: Question[]
}

export interface PartMeta {
  section: Section
  /** Nhãn ngắn dùng trên tab/lọc. */
  label: string
  /** Mô tả định dạng, hiển thị ở màn hình chọn phần thi. */
  note: string
  /** Số câu hỏi trong đề TOEIC L-R đầy đủ. */
  officialCount: number
  /** Thời gian gợi ý (giây) khi luyện riêng part này. */
  suggestSeconds: number
}

export const PART_META: Record<Part, PartMeta> = {
  1: {
    section: 'listening',
    label: 'Part 1',
    note: 'Mô tả tranh — chọn câu mô tả đúng nhất bức ảnh',
    officialCount: 6,
    suggestSeconds: 90,
  },
  2: {
    section: 'listening',
    label: 'Part 2',
    note: 'Hỏi – đáp — chọn câu trả lời phù hợp (3 lựa chọn)',
    officialCount: 25,
    suggestSeconds: 150,
  },
  3: {
    section: 'listening',
    label: 'Part 3',
    note: 'Hội thoại ngắn — 3 câu hỏi cho mỗi đoạn',
    officialCount: 39,
    suggestSeconds: 300,
  },
  4: {
    section: 'listening',
    label: 'Part 4',
    note: 'Bài nói ngắn — 3 câu hỏi cho mỗi đoạn',
    officialCount: 30,
    suggestSeconds: 300,
  },
  5: {
    section: 'reading',
    label: 'Part 5',
    note: 'Điền từ vào câu — ngữ pháp và từ vựng',
    officialCount: 30,
    suggestSeconds: 600,
  },
  6: {
    section: 'reading',
    label: 'Part 6',
    note: 'Điền từ vào đoạn văn — 4 câu cho mỗi đoạn',
    officialCount: 16,
    suggestSeconds: 480,
  },
  7: {
    section: 'reading',
    label: 'Part 7',
    note: 'Đọc hiểu — đơn, thư, email, bài báo',
    officialCount: 54,
    suggestSeconds: 1500,
  },
}

export const ALL_PARTS: Part[] = [1, 2, 3, 4, 5, 6, 7]

export const LISTENING_PARTS: Part[] = [1, 2, 3, 4]

export const READING_PARTS: Part[] = [5, 6, 7]

export function sectionOfPart(part: Part): Section {
  return part <= 4 ? 'listening' : 'reading'
}

/** Tổng thời gian thi thật: Listening 45 phút, Reading 75 phút. */
export const SECTION_SECONDS: Record<Section, number> = {
  listening: 45 * 60,
  reading: 75 * 60,
}

/** Thang điểm TOEIC L-R: 10–990, mỗi phần 5–495. */
export const SCALE_MIN = 10
export const SCALE_MAX = 990
export const SCALE_PER_SECTION_MIN = 5
export const SCALE_PER_SECTION_MAX = 495
