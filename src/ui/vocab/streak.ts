/**
 * TÍNH CHUỖI NGÀY HỌC TỪ TIẾN ĐỘ.
 *
 * `WordProgress` chỉ lưu `lastSeenAt` cho từng từ, không lưu "đã học ngày nào".
 * Nên chuỗi ngày suy ra từ tập các mốc `lastSeenAt`: một ngày được coi là có học
 * nếu tồn tại ít nhất một từ có `lastSeenAt` rơi vào ngày đó (giờ địa phương).
 *
 * Đây là suy luận, không phải sự thật được lưu trực tiếp — nên nếu người học ôn
 * lại một từ cũ trong ngày hôm nay, `lastSeenAt` của từ đó được ghi đè và ngày cũ
 * biến mất khỏi chuỗi. Vì vậy chuỗi tính ra là SÀN, không phải con số chính xác
 * tuyệt đối. Ghi rõ ở đây để người sau không tưởng nhầm là dữ liệu chuẩn.
 */
import type { VocabProgress } from '../../types-vocab'

const MS_PER_DAY = 24 * 60 * 60 * 1000

/** Khoá ngày theo giờ địa phương, dạng `YYYY-MM-DD`. */
function dayKey(timestamp: number): string {
  const date = new Date(timestamp)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

/** Đầu ngày (00:00 giờ địa phương) của một mốc thời gian. */
function startOfDay(timestamp: number): number {
  const date = new Date(timestamp)
  date.setHours(0, 0, 0, 0)
  return date.getTime()
}

export interface StreakInfo {
  /** Số ngày học liên tiếp, tính lùi từ hôm nay (hoặc từ hôm qua nếu hôm nay chưa học). */
  streak: number
  /** Bảy ngày gần nhất, cũ → mới; `true` = ngày đó có học. Phần tử cuối là hôm nay. */
  week: boolean[]
  /** Nhãn thứ cho bảy ngày đó, khớp đúng thứ thật của từng ngày. */
  weekLabels: string[]
}

/** Nhãn thứ theo giờ địa phương, viết tắt kiểu Việt Nam: T2 … CN. */
const WEEKDAY_LABELS = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'] as const

export function computeStreak(progress: VocabProgress, now: number): StreakInfo {
  const activeDays = new Set<string>()
  for (const entry of Object.values(progress)) {
    if (entry.lastSeenAt > 0) activeDays.add(dayKey(entry.lastSeenAt))
  }

  const today = startOfDay(now)
  const studiedToday = activeDays.has(dayKey(today))

  // Đếm lùi. Nếu hôm nay chưa học nhưng hôm qua có, chuỗi vẫn còn sống — nó chỉ
  // đứt khi bỏ trọn một ngày. Bắt đầu từ hôm qua trong trường hợp đó.
  let streak = 0
  let cursor = studiedToday ? today : today - MS_PER_DAY
  while (activeDays.has(dayKey(cursor))) {
    streak += 1
    cursor -= MS_PER_DAY
  }

  /*
    Nhãn thứ phải tính từ NGÀY THẬT, không được viết cứng "T2…CN".

    Bản đầu tôi gán cứng bảy nhãn theo thứ tự, ngụ ý rằng ô đầu tiên là thứ Hai.
    Nhưng `week` là "sáu ngày trước → hôm nay", nên ô đầu tiên có thể là bất kỳ
    thứ nào. Hôm nay là Chủ nhật thì ô đầu là thứ Hai — trùng hợp đúng. Hôm nay
    là thứ Tư thì ô đầu là thứ Năm, và cả hàng nhãn sẽ lệch.
  */
  const week: boolean[] = []
  const weekLabels: string[] = []
  for (let offset = 6; offset >= 0; offset -= 1) {
    const day = today - offset * MS_PER_DAY
    week.push(activeDays.has(dayKey(day)))
    weekLabels.push(WEEKDAY_LABELS[new Date(day).getDay()] ?? '')
  }

  return { streak, week, weekLabels }
}
