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
  vocab: '#/vocab',
  vocabStudy: '#/vocab/study',
  vocabBrowse: '#/vocab/browse',
  vocabQuiz: '#/vocab/quiz',
} as const

/** Bốn màn con của khu từ vựng. */
export type VocabRouteName = 'topics' | 'study' | 'browse' | 'quiz'

/**
 * Nhận diện route từ vựng từ hash.
 *
 * Vì sao tách khỏi `switch` trong `App.tsx`: khu từ vựng có tham số truy vấn
 * (`#/vocab/study?topic=finance`). Nếu để `switch` so khớp chuỗi tuyệt đối thì
 * hash có `?…` sẽ rơi vào 404. Hàm này bỏ phần truy vấn rồi so khớp đường dẫn.
 */
export function parseVocabRoute(hash: string): VocabRouteName | null {
  const path = hash.split('?')[0] ?? ''
  switch (path) {
    case ROUTES.vocab:
      return 'topics'
    case ROUTES.vocabStudy:
      return 'study'
    case ROUTES.vocabBrowse:
      return 'browse'
    case ROUTES.vocabQuiz:
      return 'quiz'
    default:
      return null
  }
}

/** Đọc tham số truy vấn trên hash: `#/vocab/study?topic=finance` → `topic=finance`. */
export function vocabQuery(hash: string): URLSearchParams {
  const at = hash.indexOf('?')
  return new URLSearchParams(at >= 0 ? hash.slice(at + 1) : '')
}

/** Route ôn tập, kèm chủ đề nếu có. */
export function vocabStudyRoute(topic?: string | null): string {
  return topic ? `${ROUTES.vocabStudy}?topic=${encodeURIComponent(topic)}` : ROUTES.vocabStudy
}

/** Route trắc nghiệm, kèm chủ đề nếu có. */
export function vocabQuizRoute(topic?: string | null): string {
  return topic ? `${ROUTES.vocabQuiz}?topic=${encodeURIComponent(topic)}` : ROUTES.vocabQuiz
}

/** Route danh sách từ, kèm chủ đề nếu có. */
export function vocabBrowseRoute(topic?: string | null): string {
  return topic ? `${ROUTES.vocabBrowse}?topic=${encodeURIComponent(topic)}` : ROUTES.vocabBrowse
}

/** Route kèm tham số đề: `#/de/7` là đề số 7. */
export function examSetRoute(id: number): string {
  return `${ROUTES.examSets}/${id}`
}

/** Đọc số hiệu đề từ hash; trả `null` nếu hash không phải dạng `#/de/<số>`. */
export function parseExamSetRoute(hash: string): number | null {
  const match = /^#\/de\/(\d{1,2})$/.exec(hash)
  if (!match) return null
  const id = Number(match[1])
  return Number.isInteger(id) && id >= 1 ? id : null
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
  return Number.isInteger(id) && id >= 1 ? id : null
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
  transcript: 'transcript',
  passage: 'passage',
  timer: 'timer',
  progress: 'progress',
  choice: (letter: string) => `choice-${letter}`,
  flagToggle: 'flag-toggle',
  nextQuestion: 'next-question',
  prevQuestion: 'prev-question',
  submitSession: 'submit-session',
  submitConfirmModal: 'submit-confirm-modal',
  submitConfirmBtn: 'submit-confirm-btn',
  submitJumpUnanswered: 'submit-jump-unanswered',
  mobilePaletteToggle: 'mobile-palette-toggle',
  mobilePaletteDrawer: 'mobile-palette-drawer',
  feedback: 'feedback',
  feedbackCorrect: 'feedback-correct',
  feedbackExplanation: 'feedback-explanation',
  audioToggle: 'audio-toggle',
  audioSeek: 'audio-seek',
  audioCurrent: 'audio-current',
  audioDuration: 'audio-duration',
  audioReplay: 'audio-replay',
  toggleChoiceText: 'toggle-choice-text',

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
  settingVocabSize: 'setting-vocab-size',
  settingVocabSpeech: 'setting-vocab-speech',
  clearHistory: 'clear-history',

  // ── Từ vựng ──────────────────────────────────────────────────────────────
  navVocab: 'nav-vocab',

  // Màn chọn chủ đề
  vocabTopics: 'vocab-topics',
  vocabTopicCard: (topic: string) => `vocab-topic-${topic}`,
  vocabTopicProgress: (topic: string) => `vocab-topic-progress-${topic}`,
  vocabSummary: 'vocab-summary',
  vocabSummaryMastered: 'vocab-summary-mastered',
  vocabSummaryDue: 'vocab-summary-due',
  vocabStreak: 'vocab-streak',
  vocabStartStudy: 'vocab-start-study',
  vocabStartQuiz: 'vocab-start-quiz',
  vocabBrowseLink: 'vocab-browse-link',

  // Màn ôn flashcard
  vocabStudy: 'vocab-study',
  vocabFlashcard: 'vocab-flashcard',
  vocabCardFront: 'vocab-card-front',
  vocabCardBack: 'vocab-card-back',
  vocabFlipButton: 'vocab-flip-button',
  vocabKnow: 'vocab-know',
  vocabDontKnow: 'vocab-dont-know',
  vocabStudyProgress: 'vocab-study-progress',
  vocabStudyCounter: 'vocab-study-counter',
  vocabStudyEmpty: 'vocab-study-empty',
  vocabStudyDone: 'vocab-study-done',

  // Màn danh sách
  vocabBrowse: 'vocab-browse',
  vocabSearch: 'vocab-search',
  vocabFilterTopic: 'vocab-filter-topic',
  vocabFilterDifficulty: 'vocab-filter-difficulty',
  vocabFilterStatus: 'vocab-filter-status',
  vocabCount: 'vocab-count',
  vocabRow: 'vocab-row',
  vocabNoResults: 'vocab-no-results',

  // Màn trắc nghiệm
  vocabQuiz: 'vocab-quiz',
  vocabQuizPrompt: 'vocab-quiz-prompt',
  vocabQuizChoice: (index: number) => `vocab-quiz-choice-${index}`,
  vocabQuizFeedback: 'vocab-quiz-feedback',
  vocabQuizNext: 'vocab-quiz-next',
  vocabQuizProgress: 'vocab-quiz-progress',
  vocabQuizDone: 'vocab-quiz-done',
} as const


