import { useMemo } from 'react'
import type { Question, QuestionBank, Stimulus } from '../types'

export interface BankIndex {
  questionById: Map<string, Question>
  stimulusById: Map<string, Stimulus>
}

/**
 * Chỉ mục tra cứu câu hỏi / ngữ liệu theo id.
 *
 * Phiên làm bài chỉ lưu `questionIds`, nên UI cần tra ngược ra câu hỏi thật.
 * Dựng một lần cho mỗi ngân hàng để không phải `.find()` trong vòng lặp.
 */
export function useBankIndex(bank: QuestionBank): BankIndex {
  return useMemo(() => {
    const questionById = new Map<string, Question>()
    for (const question of bank.questions) questionById.set(question.id, question)

    const stimulusById = new Map<string, Stimulus>()
    for (const stimulus of bank.stimuli) stimulusById.set(stimulus.id, stimulus)

    return { questionById, stimulusById }
  }, [bank])
}
