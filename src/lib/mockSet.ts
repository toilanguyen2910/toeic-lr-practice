/**
 * 10 ĐỀ THI THỬ — mỗi đề đúng 200 câu, đúng cơ cấu đề TOEIC L-R thật.
 *
 * Khác với "20 đề luyện" (`examSet.ts`):
 * - 20 đề luyện chia ba cỡ (52 / 101 / 200 câu) để làm hằng ngày.
 * - 10 đề thi thử LUÔN đủ 200 câu, đúng tỉ lệ từng part như đề thật, có giới hạn
 *   120 phút. Đây là bài "kiểm tra thử như đi thi", không phải bài luyện.
 *
 * Cơ cấu cố định theo đề thật:
 *   P1: 6 · P2: 25 · P3: 39 · P4: 30 · P5: 30 · P6: 16 · P7: 54 = 200 câu
 *
 * Mười đề dùng chung 425 câu trong ngân hàng, mỗi đề một `seed` khác nhau nên
 * chọn ra bộ câu khác nhau. Việc dùng lại câu là tất yếu về số học (10 × 200 =
 * 2000 lượt câu, ngân hàng chỉ có 425) và cũng là chủ ý: làm đi làm lại sẽ gặp
 * lại câu từng sai.
 */
import type { QuestionBank } from '../types'
import { buildExamSet } from './examSet'
import type { ExamSetDef, ExamSetMix } from './examSet'
import type { Session } from './contract'

export const MOCK_SET_COUNT = 10

/** Đề thi thử dùng đúng cơ cấu chính thức, luôn 200 câu. */
const MOCK_MIX: ExamSetMix = 'official'

export interface MockSetDef {
  /** Số hiệu đề thi thử, 1..10. */
  id: number
  /** Nhãn hiển thị, ví dụ "Đề thi thử 03". */
  label: string
  /** Tên gợi nhớ. */
  name: string
  /** Seed cố định — không đổi sau khi phát hành, nếu không lịch sử cũ vô nghĩa. */
  seed: number
}

/**
 * 10 đề thi thử.
 *
 * Seed bắt đầu từ 2001 để không trùng với dải 1001–1020 của bộ 20 đề luyện:
 * nếu trùng, một đề thi thử và một đề luyện sẽ chọn ra cùng bộ câu.
 */
export const MOCK_SETS: MockSetDef[] = [
  { id: 1, label: 'Đề thi thử 01', name: 'Bản chuẩn A', seed: 2001 },
  { id: 2, label: 'Đề thi thử 02', name: 'Bản chuẩn B', seed: 2002 },
  { id: 3, label: 'Đề thi thử 03', name: 'Bản chuẩn C', seed: 2003 },
  { id: 4, label: 'Đề thi thử 04', name: 'Bản chuẩn D', seed: 2004 },
  { id: 5, label: 'Đề thi thử 05', name: 'Bản chuẩn E', seed: 2005 },
  { id: 6, label: 'Đề thi thử 06', name: 'Bản chuẩn F', seed: 2006 },
  { id: 7, label: 'Đề thi thử 07', name: 'Bản chuẩn G', seed: 2007 },
  { id: 8, label: 'Đề thi thử 08', name: 'Bản chuẩn H', seed: 2008 },
  { id: 9, label: 'Đề thi thử 09', name: 'Bản chuẩn I', seed: 2009 },
  { id: 10, label: 'Đề thi thử 10', name: 'Bản chuẩn J', seed: 2010 },
]

/** Thời gian làm bài của một đề thi thử: 45 phút nghe + 75 phút đọc = 120 phút. */
export const MOCK_DURATION_SECONDS = 120 * 60

/** Chuyển định nghĩa đề thi thử sang dạng mà `buildExamSet` hiểu được. */
function asExamSetDef(def: MockSetDef): ExamSetDef {
  return {
    id: def.id,
    label: def.label,
    name: def.name,
    mix: MOCK_MIX,
    seed: def.seed,
    targetCount: 200,
  }
}

/** Tìm đề thi thử theo số hiệu; `undefined` nếu ngoài 1..10. */
export function findMockSet(id: number): MockSetDef | undefined {
  return MOCK_SETS.find((set) => set.id === id)
}

/**
 * Dựng phiên thi thử cho một đề.
 *
 * `id` của phiên có tiền tố `mock<N>-` (khác `exam<N>-` của bộ 20 đề luyện) để
 * lịch sử và màn hình chọn đề đọc ra đúng loại.
 */
export function buildMockSet(bank: QuestionBank, def: MockSetDef, now?: number): Session {
  const built = buildExamSet(bank, asExamSetDef(def), now)
  return {
    ...built,
    id: built.id.replace(/^exam\d+-/u, `mock${def.id}-`),
  }
}

/** Số câu thật của một đề thi thử trên ngân hàng hiện tại. */
export function mockSetSize(bank: QuestionBank, def: MockSetDef): number {
  return buildExamSet(bank, { ...asExamSetDef(def), seed: def.seed }, 0).questionIds.length
}
