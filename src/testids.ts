/**
 * HỢP ĐỒNG GIAO DIỆN — tập trung toàn bộ `data-testid` và route hash.
 *
 * Vì sao có tệp này: bộ kiểm thử thật trên Chrome (`scripts/verify-core.mjs`) và
 * `qa` cần địa chỉ ổn định. Nếu mỗi bên tự đặt tên thì test sẽ vỡ liên tục.
 *
 * Quy tắc: UI BẮT BUỘC gắn đúng các `data-testid` dưới đây. Thêm testid mới thì
 * thêm vào tệp này trước.
 */

export const ROUTES = {
  home: '#/',
  partSelect: '#/practice',
  practice: '#/practice/session',
  mock: '#/mock',
  examSets: '#/de',
  result: '#/result',
  review: '#/review',
  history: '#/history',
  settings: '#/settings',
} as const

/** Route kèm tham số đề: `#/de/7` là đề số 7. */
export function examSetRoute(id: number): string {
  return `${ROUTES.examSets}/${id}`
}

/** Đọc số hiệu đề từ hash; trả `null` nếu hash không phải dạng `#/de/<số>`. */
export function parseExamSetRoute(hash: string): number | null {
  const match = /^#\/de\/(\d{1,2})$/.exec(hash)
  if (!match) return null
  const id = Number(match[1])
  return Number.isInteger(id) && id >= 1 && id <= 20 ? id : null
}

/** Route thi thử: `#/mock` là danh sách đề, `#/mock/3` là đề thi thử số 3. */
export function mockSetRoute(id: number): string {
  return `${ROUTES.mock}/${id}`
}

/** Đọc số hiệu đề thi thử từ hash; `null` nếu hash không phải `#/mock/<số>`. */
export function parseMockSetRoute(hash: string): number | null {
  const match = /^#\/mock\/(\d{1,2})$/.exec(hash)
  if (!match) return null
  const id = Number(match[1])
  return Number.isInteger(id) && id >= 1 && id <= 10 ? id : null
}

export const TID = {
  // Khung chung
  app: 'app',
  nav: 'nav',
  navHome: 'nav-home',
  navPractice: 'nav-practice',
  navMock: 'nav-mock',
  navHistory: 'nav-history',
  navSettings: 'nav-settings',
  navExamSets: 'nav-exam-sets',

  // 20 đề thi thử
  examSets: 'exam-sets',
  examSetCard: (id: number) => `exam-set-${id}`,
  examSetStart: 'exam-set-start',
  examSetProgress: (id: number) => `exam-set-progress-${id}`,
  homeStartExamSets: 'home-start-exam-sets',

  // 10 đề thi thử (đủ 200 câu, 120 phút)
  mockSets: 'mock-sets',
  mockSetCard: (id: number) => `mock-set-${id}`,
  mockSetProgress: (id: number) => `mock-set-progress-${id}`,
  mockSetStart: 'mock-set-start',

  // Trang chủ
  home: 'home',
  homeHero: 'home-hero',
  homeStartMock: 'home-start-mock',
  homeStartPractice: 'home-start-practice',
  homeResume: 'home-resume',
  statTotalSessions: 'stat-total-sessions',
  statBestScore: 'stat-best-score',

  // Chọn part
  partSelect: 'part-select',
  partToggle: (part: number) => `part-toggle-${part}`,
  startPractice: 'start-practice',
  practiceCount: 'practice-count',
  practiceTotal: 'practice-total',
  practiceSummary: 'practice-summary',
  practiceTotalCount: 'practice-total-count',
  countModeTotal: 'count-mode-total',
  countModePerPart: 'count-mode-per-part',
  useOfficialTotal: 'use-official-total',

  // Làm bài
  session: 'session',
  question: 'question',
  questionCounter: 'question-counter',
  prompt: 'prompt',
  stimulus: 'stimulus',
  passage: 'passage',
  timer: 'timer',
  progress: 'progress',
  choice: (letter: string) => `choice-${letter}`,
  flagToggle: 'flag-toggle',
  nextQuestion: 'next-question',
  prevQuestion: 'prev-question',
  submitSession: 'submit-session',
  feedback: 'feedback',
  feedbackCorrect: 'feedback-correct',
  feedbackExplanation: 'feedback-explanation',
  audioToggle: 'audio-toggle',

  // Kết quả
  result: 'result',
  scoreTotal: 'score-total',
  scoreListening: 'score-listening',
  scoreReading: 'score-reading',
  resultCorrect: 'result-correct',
  resultWrong: 'result-wrong',
  resultBlank: 'result-blank',
  resultAccuracy: 'result-accuracy',
  reviewButton: 'review-button',
  retryButton: 'retry-button',
  reviewMistakes: 'review-mistakes',

  // Xem lại
  review: 'review',
  reviewItem: 'review-item',
  reviewFilterWrong: 'review-filter-wrong',
  reviewFilterAll: 'review-filter-all',

  // Lịch sử
  history: 'history',
  historyRow: 'history-row',
  historyEmpty: 'history-empty',

  // Cài đặt
  settings: 'settings',
  settingReveal: 'setting-reveal',
  settingAudio: 'setting-audio',
  settingCount: 'setting-count',
  clearHistory: 'clear-history',
} as const
