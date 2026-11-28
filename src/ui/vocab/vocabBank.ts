/**
 * NGUỒN DỮ LIỆU TỪ VỰNG CHO TẦNG GIAO DIỆN — CHỈ MỘT CHỖ ĐỂ ĐỔI.
 *
 * ---------------------------------------------------------------------------
 * ĐÃ NỐI VÀO NGÂN HÀNG THẬT: 600 từ, 12 chủ đề × 50, `version: 1`.
 *
 * Giai đoạn trước, khi `src/data/vocab/` còn đang biên soạn, tệp này giữ một ngân
 * hàng mẫu 48 từ. Nay ngân hàng thật đã có, nên phần mẫu đã được XOÁ HOÀN TOÀN —
 * không còn đường nào để 48 từ giả lọt vào sản phẩm.
 *
 * Vì sao giao diện vẫn đi qua tệp này thay vì import thẳng `../../data/vocab`:
 * nếu sau này ngân hàng đổi chỗ hoặc chia lô, chỉ một tệp này phải sửa. Đó cũng là
 * lý do tệp này không chứa logic gì — chỉ là một cửa.
 *
 * `VOCAB_IS_FIXTURE` giữ lại cho tương lai: nếu ai đó cần chạy giao diện với một
 * ngân hàng thử nghiệm nhỏ, đặt `version: 0` và các màn hình tự hiện dải nhắc.
 * ---------------------------------------------------------------------------
 */
import type { VocabBank } from '../../types-vocab'
import { VOCAB_BANK as BANK } from '../../data/vocab'

export const VOCAB_BANK: VocabBank = BANK

/** `true` khi ngân hàng vẫn là dữ liệu mẫu — giao diện hiện dải nhắc. */
export const VOCAB_IS_FIXTURE = VOCAB_BANK.version === 0
