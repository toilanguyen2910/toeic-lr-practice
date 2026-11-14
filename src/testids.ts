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
  result: '#/result',
  review: '#/review',
  history: '#/history',
  settings: '#/settings',
} as const

export const TID = {
  // Khung chung
  app: 'app',
  nav: 'nav',
  navHome: 'nav-home',
  navPractice: 'nav-practice',
  navMock: 'nav-mock',
  navHistory: 'nav-history',
  navSettings: 'nav-settings',

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
