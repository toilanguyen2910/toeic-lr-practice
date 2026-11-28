/**
 * NGÂN HÀNG TỪ VỰNG TOEIC — 600 từ, 12 chủ đề × 50 từ.
 *
 * Tệp này chỉ ghép dữ liệu từ 12 tệp chủ đề thành `VocabBank` duy nhất; không có
 * logic nào khác. Mọi mã `id` chạy liên tục `v-0001` … `v-0600` và giữ đúng thứ
 * tự chủ đề trong `VOCAB_TOPICS` — nhờ vậy chỉ cần đọc mảng là biết từ nào thuộc
 * chủ đề nào, không phải tra cứu thêm.
 *
 * Dữ liệu tự biên soạn cho dự án: từ ngữ tiếng Anh thông dụng thì không ai độc
 * quyền, nhưng cách chọn từ, câu ví dụ và bản dịch ở đây đều viết mới.
 */
import type { VocabBank } from '../../types-vocab'
import { OFFICE_WORDS } from './office'
import { FINANCE_WORDS } from './finance'
import { HR_WORDS } from './hr'
import { TRAVEL_WORDS } from './travel'
import { MEETING_WORDS } from './meeting'
import { COMMERCE_WORDS } from './commerce'
import { SHIPPING_WORDS } from './shipping'
import { PRODUCTION_WORDS } from './production'
import { MARKETING_WORDS } from './marketing'
import { LEGAL_WORDS } from './legal'
import { IT_WORDS } from './it'
import { DAILY_WORDS } from './daily'

export const VOCAB_BANK: VocabBank = {
  version: 1,
  words: [
    ...OFFICE_WORDS,
    ...FINANCE_WORDS,
    ...HR_WORDS,
    ...TRAVEL_WORDS,
    ...MEETING_WORDS,
    ...COMMERCE_WORDS,
    ...SHIPPING_WORDS,
    ...PRODUCTION_WORDS,
    ...MARKETING_WORDS,
    ...LEGAL_WORDS,
    ...IT_WORDS,
    ...DAILY_WORDS,
  ],
}

// Tái xuất từng mảng để test và công cụ tra cứu theo chủ đề dùng lại được.
export {
  OFFICE_WORDS,
  FINANCE_WORDS,
  HR_WORDS,
  TRAVEL_WORDS,
  MEETING_WORDS,
  COMMERCE_WORDS,
  SHIPPING_WORDS,
  PRODUCTION_WORDS,
  MARKETING_WORDS,
  LEGAL_WORDS,
  IT_WORDS,
  DAILY_WORDS,
}
