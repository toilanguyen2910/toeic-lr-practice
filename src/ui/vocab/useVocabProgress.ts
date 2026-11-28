/**
 * TIẾN ĐỘ TỪ VỰNG DÙNG CHUNG CHO BỐN MÀN HÌNH.
 *
 * Vì sao cần hook riêng: cả bốn màn đều đọc/ghi cùng một `VocabProgress`. Nếu mỗi
 * màn tự `useState(loadProgress)` thì chuyển màn xong quay lại sẽ thấy số cũ, vì
 * React đã giữ state của lần mount trước. Hook này gom về một chỗ và đọc lại từ
 * localStorage sau mỗi lần ghi.
 *
 * Nguyên tắc: `localStorage` là nguồn sự thật (đúng ý đồ `lib/vocab.ts`), còn state
 * chỉ là bản sao để render. Ghi thì ghi qua engine (`recordAnswer`), không tự sửa
 * object tiến độ ở đây.
 *
 * Vì sao `now` là state chứ không gọi `Date.now()` thẳng: gọi hàm không thuần
 * trong thân render khiến React Compiler bỏ tối ưu và có thể cho kết quả khác
 * nhau giữa hai lần render cùng state. Mốc thời gian được chốt một lần lúc mount
 * (và cập nhật mỗi khi ghi câu trả lời), nên mọi phép so sánh trong cùng một lượt
 * nhìn thấy cùng một con số.
 */
import { useCallback, useEffect, useState } from 'react'
import type { VocabGrade, VocabProgress } from '../../types-vocab'
import { loadProgress, recordAnswer, saveProgress } from '../../lib/vocab'
import { VOCAB_STORAGE_KEYS } from '../../types-vocab'

/**
 * Đọc một mốc thời gian. Tách riêng để chỗ gọi không phải gọi `Date.now()` trong
 * thân component — `useState` chỉ chạy initializer một lần nên đây là chỗ duy nhất
 * lấy giờ lúc mount.
 */
function readNow(): number {
  return Date.now()
}

export function useVocabProgress() {
  // Đọc một lần lúc mount; SSR không có window nên chỉ đọc trong initializer.
  const [progress, setProgress] = useState<VocabProgress>(() => loadProgress())
  const [now, setNow] = useState<number>(readNow)

  /**
   * Nghe thay đổi từ TAB KHÁC và nạp lại từ localStorage.
   *
   * Vì sao cần: mỗi tab giữ một bản sao tiến độ trong state. Tab A mở trước, tab B
   * mở sau ghi thêm một từ; rồi ở tab A người dùng bấm "Đã thuộc" — tab A ghi đè
   * TOÀN BỘ bản đồ bằng bản sao cũ của nó, xoá mất từ mà tab B vừa lưu. Người
   * dùng không thấy báo lỗi nào, chỉ thấy tiến độ tự dưng mất.
   *
   * `storage` chỉ bắn ở các tab KHÁC (không bắn ở tab vừa ghi), nên nghe nó là
   * đúng nhu cầu: đồng bộ mà không tạo vòng lặp ghi.
   */
  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key !== null && event.key !== VOCAB_STORAGE_KEYS.progress) return
      setProgress(loadProgress())
      setNow(readNow())
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const answer = useCallback((wordId: string, grade: VocabGrade) => {
    const stamp = readNow()
    setProgress((previous) => {
      /*
       * Gộp với bản trong localStorage để không xoá dữ liệu tab khác vừa ghi,
       * nhưng KHÔNG áp câu trả lời lên bản đã gộp.
       *
       * Vì sao phải tách: nếu gọi `recordAnswer(merged, ...)` thì khi localStorage
       * đã có sẵn bản ghi của CHÍNH từ này (do lần bấm trước, hoặc do `previous`
       * vừa được ghi), `recordAnswer` cộng thêm một hộp nữa — bấm MỘT lần mà hộp
       * nhảy từ 1 lên 3, `correct` lên 2. Đã đo được đúng hiện tượng đó.
       *
       * Đúng đắn: áp câu trả lời lên `previous` (bản sao state của tab này — đã
       * phản ánh mọi lần bấm trong tab), rồi chỉ THÊM những khoá mà tab khác có
       * mà tab này chưa có.
       */
      const fromThisTab = recordAnswer(previous, wordId, grade, stamp)

      const stored = loadProgress()
      const merged: VocabProgress = { ...fromThisTab }
      for (const [id, entry] of Object.entries(stored)) {
        if (merged[id]) continue // tab này đã có, giữ bản của tab này
        merged[id] = entry // tab khác có mà tab này chưa có → thêm vào
      }

      saveProgress(merged)
      return merged
    })
    // Mốc mới để "cần ôn hôm nay" và chuỗi ngày tính theo đúng thời điểm vừa trả lời.
    setNow(stamp)
  }, [])

  const reload = useCallback(() => {
    setProgress(loadProgress())
    setNow(readNow())
  }, [])

  const reset = useCallback(() => {
    setProgress({})
    saveProgress({})
  }, [])

  return { progress, answer, reload, reset, now }
}


