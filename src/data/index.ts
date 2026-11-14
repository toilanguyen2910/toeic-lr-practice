import type { QuestionBank } from '../types'
import { PART1_QUESTIONS, PART1_STIMULI } from './part1'
import { PART2_QUESTIONS, PART2_STIMULI } from './part2'
import { PART3_QUESTIONS, PART3_STIMULI } from './part3'
import { PART4_QUESTIONS, PART4_STIMULI } from './part4'
import { PART5_QUESTIONS } from './part5'
import { PART6_QUESTIONS, PART6_STIMULI } from './part6'
import { PART7_QUESTIONS, PART7_STIMULI } from './part7'

/**
 * ĐIỂM GHÉP NGÂN HÀNG CÂU HỎI.
 *
 * Ngân hàng thật được viết tay trong 7 tệp `part1.ts` … `part7.ts`, mỗi tệp export
 * mảng `Question` của phần thi đó (kèm `Stimulus` nếu phần đó dùng ngữ liệu chung).
 * Tệp này chỉ làm một việc: gộp lại thành `QuestionBank` duy nhất.
 *
 * Tổng: 85 câu — P1: 8, P2: 12, P3: 12, P4: 9, P5: 20, P6: 8, P7: 16.
 */
export const FULL_BANK: QuestionBank = {
  version: 1,
  stimuli: [
    ...PART1_STIMULI,
    ...PART2_STIMULI,
    ...PART3_STIMULI,
    ...PART4_STIMULI,
    ...PART6_STIMULI,
    ...PART7_STIMULI,
  ],
  questions: [
    ...PART1_QUESTIONS,
    ...PART2_QUESTIONS,
    ...PART3_QUESTIONS,
    ...PART4_QUESTIONS,
    ...PART5_QUESTIONS,
    ...PART6_QUESTIONS,
    ...PART7_QUESTIONS,
  ],
}

// Tái xuất các mảng đã ghép để chỗ khác (test, công cụ) dùng lại được.
export {
  PART1_QUESTIONS,
  PART1_STIMULI,
  PART2_QUESTIONS,
  PART2_STIMULI,
  PART3_QUESTIONS,
  PART3_STIMULI,
  PART4_QUESTIONS,
  PART4_STIMULI,
  PART5_QUESTIONS,
  PART6_QUESTIONS,
  PART6_STIMULI,
  PART7_QUESTIONS,
  PART7_STIMULI,
}
