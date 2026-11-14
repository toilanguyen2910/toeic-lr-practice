/**
 * BARREL — cửa ngõ duy nhất mà UI được dùng để lấy logic nghiệp vụ.
 *
 * `engineApi` là hiện thực của `EngineApi` trong `contract.ts`. Kiểu được khai báo
 * tường minh để `tsc` báo lỗi ngay nếu chữ ký lệch hợp đồng.
 *
 * Quy tắc của tệp này:
 * - Không import React, không chạm DOM.
 * - Chỉ re-export kiểu (dùng `export type`) và hàm đã cài trong `src/lib/`.
 *
 * Ngoài 16 hàm của `EngineApi`, barrel còn export thêm ba nhóm tiện ích:
 * - `HISTORY_LIMIT` — trần số bản ghi lịch sử (UI cần để hiển thị/giải thích).
 * - `parseSession` / `parseHistoryEntry` / `parseSettings` — kiểm tra hình dạng
 *   dữ liệu thô đọc từ `localStorage`. UI dùng khi cần xác thực dữ liệu trước khi
 *   hiển thị, hoặc khi nhận dữ liệu từ nguồn ngoài `load*`.
 */
import type { EngineApi } from './contract'
import {
  answerQuestion,
  createSession,
  submitSession,
  tickSession,
  toggleFlag,
} from './session'
import { estimateScore, scoreSession } from './scoring'
import {
  clearHistory,
  clearSession,
  loadHistory,
  loadSession,
  loadSettings,
  pushHistory,
  saveSession,
  saveSettings,
} from './storage'
import { formatClock } from './time'

export type {
  EngineApi,
  HistoryEntry,
  PartBreakdown,
  ScoreEstimate,
  Session,
  SessionMode,
  SessionOptions,
  SessionResult,
  SessionStatus,
  Settings,
} from './contract'

export { DEFAULT_SETTINGS, STORAGE_KEYS } from './contract'

export type {
  Choice,
  Difficulty,
  Letter,
  Part,
  Passage,
  Question,
  QuestionBank,
  Section,
  Stimulus,
} from '../types'

export { createSession, answerQuestion, toggleFlag, tickSession, submitSession } from './session'
export { scoreSession, estimateScore } from './scoring'
export {
  clearHistory,
  clearSession,
  HISTORY_LIMIT,
  loadHistory,
  loadSession,
  loadSettings,
  parseHistoryEntry,
  parseSession,
  parseSettings,
  pushHistory,
  saveSession,
  saveSettings,
} from './storage'
export { formatClock } from './time'

/**
 * Hiện thực đầy đủ của `EngineApi`.
 *
 * UI có thể import từng hàm (tree-shaking tốt hơn) hoặc dùng `engineApi` như một
 * thực thể duy nhất để tiêm (inject) trong test.
 */
export const engineApi: EngineApi = {
  createSession,
  answerQuestion,
  toggleFlag,
  tickSession,
  submitSession,
  scoreSession,

  saveSession,
  loadSession,
  clearSession,

  loadHistory,
  pushHistory,
  clearHistory,

  loadSettings,
  saveSettings,

  formatClock,
  estimateScore,
}
