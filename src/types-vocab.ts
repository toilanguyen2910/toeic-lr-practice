/**
 * HỢP ĐỒNG DỮ LIỆU TỪ VỰNG — nguồn sự thật duy nhất cho tính năng flashcard.
 *
 * Tệp này KHÔNG import React, KHÔNG chạm DOM, KHÔNG có side-effect. Mọi module
 * khác import kiểu từ đây, không tự định nghĩa lại.
 *
 * Vì sao tách khỏi `src/types.ts`: `types.ts` là hợp đồng của phần thi (câu hỏi,
 * phiên làm bài). Từ vựng là tính năng độc lập — tách ra để sửa bên này không
 * phải chạm vào bên kia, và để engine từ vựng không kéo theo toàn bộ ngân hàng
 * câu hỏi khi test.
 */

/** 12 chủ đề, mỗi chủ đề 50 từ. */
export type VocabTopic =
  | 'office'
  | 'finance'
  | 'hr'
  | 'travel'
  | 'meeting'
  | 'commerce'
  | 'shipping'
  | 'production'
  | 'marketing'
  | 'legal'
  | 'it'
  | 'daily'

export const VOCAB_TOPICS: VocabTopic[] = [
  'office',
  'finance',
  'hr',
  'travel',
  'meeting',
  'commerce',
  'shipping',
  'production',
  'marketing',
  'legal',
  'it',
  'daily',
]

export interface VocabTopicMeta {
  id: VocabTopic
  /** Nhãn hiển thị tiếng Việt. */
  label: string
  /** Emoji hoặc ký hiệu ngắn, dùng trên thẻ chủ đề. */
  icon: string
  /** Mô tả một dòng. */
  note: string
}

export const VOCAB_TOPIC_META: Record<VocabTopic, VocabTopicMeta> = {
  office: {
    id: 'office',
    label: 'Văn phòng & thiết bị',
    icon: '🏢',
    note: 'Giấy tờ, máy móc, đồ dùng hằng ngày',
  },
  finance: {
    id: 'finance',
    label: 'Tài chính & kế toán',
    icon: '💰',
    note: 'Hoá đơn, ngân sách, báo cáo',
  },
  hr: {
    id: 'hr',
    label: 'Nhân sự & tuyển dụng',
    icon: '👥',
    note: 'Ứng viên, hợp đồng lao động, lương',
  },
  travel: {
    id: 'travel',
    label: 'Du lịch công tác',
    icon: '✈️',
    note: 'Vé máy bay, khách sạn, lịch trình',
  },
  meeting: {
    id: 'meeting',
    label: 'Họp & thuyết trình',
    icon: '📊',
    note: 'Biên bản, thuyết trình, bỏ phiếu',
  },
  commerce: {
    id: 'commerce',
    label: 'Mua bán & đàm phán',
    icon: '🤝',
    note: 'Báo giá, chiết khấu, bảo hành',
  },
  shipping: {
    id: 'shipping',
    label: 'Vận chuyển & kho',
    icon: '📦',
    note: 'Lô hàng, kiểm kê, giao nhận',
  },
  production: {
    id: 'production',
    label: 'Sản xuất & chất lượng',
    icon: '🏭',
    note: 'Lắp ráp, lỗi sản phẩm, kiểm định',
  },
  marketing: {
    id: 'marketing',
    label: 'Marketing & bán hàng',
    icon: '📣',
    note: 'Chiến dịch, khách tiềm năng, quảng cáo',
  },
  legal: {
    id: 'legal',
    label: 'Pháp lý & hợp đồng',
    icon: '⚖️',
    note: 'Điều khoản, chấm dứt, trách nhiệm',
  },
  it: {
    id: 'it',
    label: 'Công nghệ thông tin',
    icon: '💻',
    note: 'Cơ sở dữ liệu, sao lưu, cài đặt',
  },
  daily: {
    id: 'daily',
    label: 'Đời sống & dịch vụ',
    icon: '☕',
    note: 'Đặt chỗ, hoàn tiền, phàn nàn',
  },
}

export type PartOfSpeech = 'n' | 'v' | 'adj' | 'adv' | 'phr'

export interface VocabWord {
  /** Mã duy nhất, quy ước `v-0001`. */
  id: string
  /** Từ hoặc cụm từ tiếng Anh. */
  word: string
  /** Phiên âm IPA, ví dụ `/ˈɪnvɔɪs/`. */
  phonetic: string
  partOfSpeech: PartOfSpeech
  /** Nghĩa tiếng Việt, ngắn gọn. */
  meaningVi: string
  /** Định nghĩa tiếng Anh đơn giản — để học bằng tiếng Anh. */
  definitionEn: string
  /** Câu ví dụ tiếng Anh có dùng từ này. */
  exampleEn: string
  /** Bản dịch câu ví dụ. */
  exampleVi: string
  topic: VocabTopic
  /** 1 = cơ bản, 2 = trung bình, 3 = khó. */
  difficulty: 1 | 2 | 3
}

/** Toàn bộ ngân hàng từ, ghép từ 12 tệp chủ đề. */
export interface VocabBank {
  version: number
  words: VocabWord[]
}

/* ── TIẾN ĐỘ HỌC ───────────────────────────────────────────────────────────── */

/**
 * Hộp Leitner: 1 → 5.
 *
 * Cách hoạt động: trả lời đúng thì lên hộp, sai thì về hộp 1. Mỗi hộp có khoảng
 * cách ôn riêng. Hộp 5 coi là đã thuộc.
 */
export type LeitnerBox = 1 | 2 | 3 | 4 | 5

/** Số ngày chờ trước lần ôn kế tiếp, theo hộp. */
export const BOX_INTERVAL_DAYS: Record<LeitnerBox, number> = {
  1: 1,
  2: 3,
  3: 7,
  4: 21,
  5: 60,
}

/**
 * Bốn mức tự đánh giá sau khi lật thẻ — theo thang của Anki.
 *
 * Vì sao bốn mức chứ không phải hai: "đã thuộc / chưa thuộc" gộp mất hai trạng
 * thái rất khác nhau — "hơi hơi nhớ" và "quá dễ". Gộp chúng lại thì những từ
 * mình đã chắc chắn vẫn bị hẹn ôn lại sớm, làm phiên học dài vô ích; còn từ mới
 * nhớ mang máng lại được đẩy xa quá nhanh.
 *
 * `again` coi như trả lời sai. `hard` lên hộp nhưng chậm hơn. `good` là bình
 * thường. `easy` lên thẳng hộp 5.
 */
export type VocabGrade = 'again' | 'hard' | 'good' | 'easy'

export const VOCAB_GRADES: VocabGrade[] = ['again', 'hard', 'good', 'easy']

export interface VocabGradeMeta {
  id: VocabGrade
  label: string
  /** Phím tắt, dùng cho bàn phím. */
  key: string
  /** Mô tả một dòng cho trình đọc màn hình. */
  hint: string
  /** Tông màu, dùng cho CSS (`--tone`). */
  tone: 'bad' | 'warn' | 'ok' | 'accent'
}

export const VOCAB_GRADE_META: Record<VocabGrade, VocabGradeMeta> = {
  again: {
    id: 'again',
    label: 'Chưa thuộc',
    key: '1',
    hint: 'Quên hoàn toàn, hẹn ôn lại ngày mai',
    tone: 'bad',
  },
  hard: {
    id: 'hard',
    label: 'Hơi hơi',
    key: '2',
    hint: 'Nhớ mang máng, cần gặp lại sớm',
    tone: 'warn',
  },
  good: {
    id: 'good',
    label: 'Cũng thuộc',
    key: '3',
    hint: 'Nhớ được, ôn theo nhịp bình thường',
    tone: 'ok',
  },
  easy: {
    id: 'easy',
    label: 'Dễ',
    key: '4',
    hint: 'Quá dễ, hẹn ôn lại rất lâu',
    tone: 'accent',
  },
}

export interface WordProgress {
  /** Hộp hiện tại. */
  box: LeitnerBox
  /** Mốc thời gian (ms) được phép ôn lại. */
  nextReviewAt: number
  /** Số lần trả lời đúng. */
  correct: number
  /** Số lần trả lời sai. */
  wrong: number
  /** Lần cuối được ôn (ms). */
  lastSeenAt: number
}

/** Tiến độ của cả ngân hàng, khoá theo `VocabWord.id`. */
export type VocabProgress = Record<string, WordProgress>

/* ── KẾT QUẢ ───────────────────────────────────────────────────────────────── */

export interface VocabSessionStats {
  total: number
  /** Số từ người học bấm "đã thuộc". */
  known: number
  /** Số từ bấm "chưa thuộc". */
  unknown: number
  /** Số từ đã lên hộp 5 sau phiên này. */
  mastered: number
}

export interface VocabSummary {
  /** Tổng số từ trong ngân hàng. */
  totalWords: number
  /** Số từ đã có tiến độ (đã học ít nhất một lần). */
  started: number
  /** Số từ đã thuộc (hộp 5). */
  mastered: number
  /** Số từ cần ôn hôm nay. */
  dueToday: number
  /** Số từ mới chưa học lần nào. */
  untouched: number
}

/** Chế độ ôn tập. */
export type VocabStudyMode =
  /** Thẻ lật: xem từ, tự nhớ nghĩa, rồi lật xem đúng không. */
  | 'flashcard'
  /** Trắc nghiệm: chọn nghĩa đúng trong 4 lựa chọn. */
  | 'quiz'

/**
 * CÁC HÀM `lib/vocab.ts` PHẢI export.
 *
 * Mọi hàm là hàm thuần (trừ nhóm storage), không chạm DOM, không import React.
 */
export interface VocabApi {
  /** Tổng hợp tiến độ: tổng, đã học, đã thuộc, cần ôn hôm nay. */
  summarizeProgress: (bank: VocabBank, progress: VocabProgress, now: number) => VocabSummary

  /**
   * Chọn từ cho một lượt ôn.
   *
   * Quy tắc ưu tiên: (1) từ đến hạn ôn (nextReviewAt ≤ now) xếp trước, theo hộp
   * tăng dần (hộp thấp = quên nhiều = ôn trước); (2) sau đó từ mới chưa học;
   * (3) cuối cùng là từ đã thuộc. Cắt đúng `limit` từ.
   */
  pickDueWords: (
    bank: VocabBank,
    progress: VocabProgress,
    now: number,
    limit: number,
  ) => VocabWord[]

  /**
   * Ghi nhận một lượt trả lời.
   *
   * `known = true` → lên hộp (tối đa 5). `false` → về hộp 1.
   * Trả về tiến độ MỚI, không sửa tiến độ truyền vào.
   */
  /**
   * Ghi nhận một lượt trả lời với bốn mức tự đánh giá.
   *
   * Trả về tiến độ MỚI, không sửa tiến độ truyền vào.
   */
  recordAnswer: (
    progress: VocabProgress,
    wordId: string,
    grade: VocabGrade,
    now: number,
  ) => VocabProgress

  /** Tạo 4 lựa chọn cho câu trắc nghiệm: 1 đúng + 3 nhiễu cùng chủ đề. */
  buildQuizChoices: (
    bank: VocabBank,
    word: VocabWord,
    random: () => number,
  ) => Array<{ wordId: string; text: string; correct: boolean }>

  /** Lọc từ theo chủ đề / mức độ / trạng thái / từ khoá. */
  filterWords: (
    bank: VocabBank,
    progress: VocabProgress,
    filter: {
      topic?: VocabTopic | null
      difficulty?: 1 | 2 | 3 | null
      status?: 'all' | 'new' | 'learning' | 'mastered'
      query?: string
    },
  ) => VocabWord[]

  /** Đọc/ghi tiến độ qua localStorage; không bao giờ throw. */
  loadProgress: () => VocabProgress
  saveProgress: (progress: VocabProgress) => void
  clearProgress: () => void
}

/** Khoá localStorage. Tách khỏi khoá của phần thi để xoá bên này không mất bên kia. */
export const VOCAB_STORAGE_KEYS = {
  progress: 'toeic-lr/v1/vocab-progress',
  settings: 'toeic-lr/v1/vocab-settings',
} as const

export interface VocabSettings {
  /** Số từ mỗi lượt ôn. */
  sessionSize: number
  /** Chế độ mặc định khi mở màn ôn. */
  defaultMode: VocabStudyMode
  /** Bật phát âm bằng giọng trình duyệt. */
  speechEnabled: boolean
}

export const DEFAULT_VOCAB_SETTINGS: VocabSettings = {
  sessionSize: 20,
  defaultMode: 'flashcard',
  speechEnabled: true,
}
