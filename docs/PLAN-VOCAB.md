# KẾ HOẠCH — Nâng cấp giao diện + Tính năng ôn từ vựng Flashcard

> Lập ngày 28/11/2026. Trạng thái hiện tại của dự án: **đã có 425 câu hỏi, 15 đề thi thử,
> 20 đề luyện, 115 file audio, dark mode, biểu đồ tiến độ**. Bản này mô tả phần **còn thiếu**.

---

## 1. Hiện trạng (đo thật, không suy diễn)

| Hạng mục | Số liệu thật |
|---|---|
| Ngân hàng câu hỏi | 425 câu (P1: 20, P2: 60, P3: 60, P4: 45, P5: 120, P6: 40, P7: 80) |
| Đề thi | 15 đề thi thử (200 câu, 120 phút) + 20 đề luyện (52/101/200 câu) |
| Âm thanh | 115/115 stimulus có MP3 (giọng ElevenLabs + Google dự phòng) |
| Giao diện | 22 component, 12 file CSS, `data-theme` + dark mode đã có |
| Theme | `useTheme` — light / dark / auto, lưu `localStorage` |
| Thư viện ngoài | chỉ `react`, `react-dom`, `chart.js` |
| Test | 265 unit · 60 E2E · 28 UI · 16 production |
| Route | 9 route hash tự viết (`#/`, `#/practice`, `#/mock`, `#/de`, `#/result`, `#/review`, `#/history`, `#/settings`) |

**Kết luận:** nền tảng đã vững. Không cần viết lại gì. Chỉ **thêm** hai thứ: (a) các
thành phần Lucian vào chỗ đang dùng CSS tự viết, (b) module từ vựng hoàn toàn mới.

---

## 2. Skill `lucian-uxui` — nó cho gì, dùng thế nào

### Nó là gì

Thư viện **480 phần tử UI tương tác**, mỗi phần tử là **một snippet tự chứa**:
`<style>` scoped `.uNNN` + `<div class="ux uNNN">` + `<script>`. Không phụ thuộc thư viện.
Có sẵn light/dark, bàn phím, touch, `prefers-reduced-motion`.

### Cách truy cập

```bash
node .agents/skills/lucian-uxui/scripts/lucian-uxui.mjs list
node .agents/skills/lucian-uxui/scripts/lucian-uxui.mjs search <từ khoá>
node .agents/skills/lucian-uxui/scripts/lucian-uxui.mjs get <id>
node .agents/skills/lucian-uxui/scripts/lucian-uxui.mjs tokens
```

### Đã kiểm chứng trên máy này

```
✓ CLI chạy được (Node 22)
✓ 480 phần tử, 27 nhóm
✓ search "flashcard card flip reveal" → 10 kết quả, có #052 Flip-around membership card
✓ search "quiz study progress ring streak" → #379 Growing streak flame, #099 Activity rings
✓ search "empty state" → #440 First-run empty state, #092 Empty search
```

### Vì sao dự án này hợp với Lucian

| Yêu cầu của Lucian | Dự án đã có |
|---|---|
| Framework xác định | React 19 + TypeScript ✓ |
| Cách style | CSS toàn cục + CSS variables ✓ |
| Cách theme | `data-theme` trên `<html>` ✓ (Lucian cũng dùng `--ux-*` tokens) |
| Ngôn ngữ copy | tiếng Việt ✓ |

**Cần làm thêm:** Lucian dùng token riêng `--ux-*`. Phải **ánh xạ** `--ux-*` → biến hiện
có (`--surface`, `--ink`, `--primary`…) để phần tử Lucian theo đúng dark mode của dự án,
không có hai bảng màu song song.

---

## 3. Chọn phần tử Lucian nào (đã search, chưa `get`)

> Nguyên tắc của skill: **ưu tiên phần tử Lucian khi có cái hợp**, chỉ tự viết khi không
> có. Nhưng cũng có giới hạn: **không thay cái đang chạy tốt bằng cái hoa mỹ hơn mà
> không thêm giá trị**. Bảng dưới ghi rõ cái nào thay, cái nào giữ.

### Nên dùng — có giá trị thật

| Việc | Ứng viên Lucian | Lý do |
|---|---|---|
| Flashcard lật 2 mặt | **#052 Flip-around membership card** | Đúng hình dạng "lật thẻ"; tái dùng chuyển động 3D, thay nội dung |
| Trạng thái rỗng khi chưa có từ | **#440 First-run empty state** | Hiện app đang dùng `.empty-state` tự viết, khô |
| Chuỗi ngày học (streak) | **#379 Growing streak flame** | Tính năng mới, cần hình ảnh cho vui |
| Thanh tiến độ ôn tập | **#099 Activity rings** hoặc **#014 To-do checklist** | Hiện chỉ có thanh ngang; vòng tròn đọc nhanh hơn |
| Toast khi lưu từ | thuộc `alerts-feedback` | Hiện chưa có toast nào |

### Giữ nguyên — Lucian không giúp gì thêm

| Việc | Lý do giữ |
|---|---|
| Màn làm bài (`SessionPage`) | Đã tối ưu cho đọc và thi; đổi sang phần tử trang trí sẽ **hại** trải nghiệm thi |
| Bảng chọn câu theo part | Vừa làm xong, có nhóm part rõ ràng |
| Chuyển tab dark mode bằng vòng tròn (#219) | Đã có nút chuyển; thêm animation vòng tròn là trang trí, không thêm chức năng |
| Biểu đồ tiến độ | Đã có `chart.js`, thay bằng Lucian là đổi thư viện vô ích |

**Con số thực tế:** dùng khoảng **5–7 phần tử**, không phải 480. Dùng nhiều là lỗi —
mỗi phần tử là một snippet có script riêng, nhồi nhiều sẽ nặng và khó bảo trì.

---

## 4. Tính năng Flashcard 600 từ vựng

### 4.1 Dữ liệu — phần khó nhất, không phải code

**Không được lấy từ nguồn có bản quyền.** Các bộ "600 từ vựng TOEIC" bán trên mạng
đều có tác giả. Phải **tự biên soạn**.

Cấu trúc một từ:

```ts
export interface VocabWord {
  id: string              // 'v-0001'
  word: string            // 'invoice'
  phonetic: string        // '/ˈɪnvɔɪs/'
  partOfSpeech: 'n' | 'v' | 'adj' | 'adv' | 'prep' | 'phr'
  meaningVi: string       // 'hoá đơn'
  definitionEn: string    // 'a document listing goods or services and the money owed'
  exampleEn: string       // 'Please send the invoice by Friday.'
  exampleVi: string       // 'Vui lòng gửi hoá đơn trước thứ Sáu.'
  topic: string           // 'finance' | 'office' | 'travel' | 'hr' | …
  difficulty: 1 | 2 | 3
}
```

Chia 600 từ thành **12 chủ đề × 50 từ**:

| Chủ đề | Số từ | Ví dụ |
|---|---|---|
| Văn phòng & thiết bị | 50 | stationery, photocopier, agenda |
| Tài chính & kế toán | 50 | invoice, reimburse, budget |
| Nhân sự & tuyển dụng | 50 | applicant, probation, payroll |
| Du lịch công tác | 50 | itinerary, layover, boarding |
| Họp & thuyết trình | 50 | minutes, consensus, handout |
| Mua bán & đàm phán | 50 | quotation, discount, warranty |
| Vận chuyển & kho | 50 | shipment, inventory, dispatch |
| Sản xuất & chất lượng | 50 | assembly, defect, inspection |
| Marketing & bán hàng | 50 | campaign, brochure, prospect |
| Pháp lý & hợp đồng | 50 | clause, terminate, liable |
| Công nghệ thông tin | 50 | database, backup, install |
| Đời sống & dịch vụ | 50 | reservation, refund, complaint |

### 4.2 Màn hình

| Route | Màn hình | Nội dung |
|---|---|---|
| `#/vocab` | Chọn chủ đề | 12 thẻ chủ đề, mỗi thẻ hiện tiến độ (đã thuộc / tổng) |
| `#/vocab/study` | Ôn flashcard | Thẻ lật: mặt trước là từ, mặt sau là nghĩa + ví dụ. Nút "Chưa thuộc" / "Đã thuộc" |
| `#/vocab/browse` | Danh sách | Bảng 600 từ, lọc theo chủ đề / mức độ / trạng thái, tìm kiếm |
| `#/vocab/quiz` | Kiểm tra | Trắc nghiệm 4 lựa chọn, nghĩa → từ, hoặc từ → nghĩa |

### 4.3 Thuật toán ôn tập

Dùng **lặp lại ngắt quãng (spaced repetition)** đơn giản kiểu Leitner 5 hộp, không cần SM-2:

```
Hộp 1: ôn lại sau 1 ngày
Hộp 2: 3 ngày
Hộp 3: 7 ngày
Hộp 4: 21 ngày
Hộp 5: đã thuộc (không ôn nữa, trừ khi đánh dấu sai)
```

Trả lời đúng → lên hộp. Sai → về hộp 1. Lưu `box`, `nextReviewAt`, `correctCount`,
`wrongCount` trong `localStorage` theo khoá `toeic-lr/v1/vocab`.

**Vì sao Leitner chứ không SM-2:** SM-2 cần tham số `easeFactor` phức tạp, người dùng
không kiểm chứng được. Leitner 5 hộp đủ hiệu quả và giải thích được cho người học.

### 4.4 Tương tác với phần đang có

- **Trang chủ:** thêm thẻ "Từ cần ôn hôm nay: N từ" → bấm vào màn ôn
- **Lịch sử:** thêm loại bản ghi `vocab` bên cạnh `practice`/`mock`
- **Cài đặt:** số từ mỗi lượt ôn (mặc định 20), bật/tắt phát âm từ

### 4.5 Phát âm

**Không gọi API ngoài** (đã hết credits ElevenLabs). Dùng `SpeechSynthesis` của trình
duyệt cho từng từ — với **một từ** thì giọng máy nghe chấp nhận được, khác với đọc cả
đoạn hội thoại.

Dự phòng: sinh sẵn MP3 cho 600 từ nếu sau này có credits. Script đã có
(`scripts/generate-audio.py`), chỉ cần thêm nguồn dữ liệu từ vựng.

---

## 5. Chia việc

| Vai | Phạm vi ghi | Sản phẩm |
|---|---|---|
| **lead** | `src/types-vocab.ts`, `src/lib/vocab.ts` (hợp đồng + engine), `src/theme/lucian-tokens.css`, tích hợp cuối | Hợp đồng dữ liệu, ánh xạ token, rà diff |
| **content** | `src/data/vocab/` | 600 từ, 12 file chủ đề + test kiểm |
| **ui** | `src/ui/vocab/`, `src/ui/AppLayout.tsx`, `src/styles/` | 4 màn vocab + nhúng Lucian element |
| **qa** | `scripts/verify-vocab.mjs`, `docs/` | Test thật trên Chrome cho luồng học |

### Miền ghi rời nhau

```
src/data/vocab/**        → content
src/lib/vocab.ts         → lead (đã khoá hợp đồng trước)
src/ui/vocab/**          → ui
src/styles/vocab*.css    → ui
scripts/verify-vocab.mjs → qa
```

Không ai chạm file của người khác. `src/types-vocab.ts` và `src/lib/vocab.ts` do lead
viết **trước** để ba người kia code song song.

---

## 6. Lộ trình

| Bước | Việc | Ai | Ước lượng |
|---|---|---|---|
| 0 | Chốt hợp đồng dữ liệu `types-vocab.ts` + `lib/vocab.ts` | lead | xong trước khi chia việc |
| 1 | Ánh xạ `--ux-*` → token dự án | lead | 30 phút |
| 2 | Biên soạn 600 từ, 12 chủ đề | content | 2–3 giờ |
| 3 | 4 màn hình flashcard | ui | 2 giờ |
| 4 | Nhúng 5–7 phần tử Lucian (thẻ lật, empty state, streak, ring, toast) | ui | 1 giờ |
| 5 | Test thật trên Chrome cho luồng học | qa | 1 giờ |
| 6 | Tích hợp, rà diff, cập nhật README + PLAN | lead | 1 giờ |

**Tổng: khoảng một ngày làm việc**, chia bốn người chạy song song ở bước 2–5.

---

## 7. Rủi ro

| Rủi ro | Mức | Cách xử lý |
|---|---|---|
| 600 từ lấy từ nguồn có bản quyền | **Cao** | Chỉ tự biên soạn; ghi rõ trong README |
| Lucian token đè lên token dự án, vỡ dark mode | Cao | Ánh xạ `--ux-*` sang biến hiện có **trước** khi nhúng; kiểm cả hai theme |
| Nhúng quá nhiều phần tử Lucian → nặng, khó bảo trì | Trung bình | Giới hạn 5–7; mỗi lần thêm phải nêu lý do |
| Từ vựng sai nghĩa / sai phiên âm | Cao | Test kiểm cấu trúc + đọc mẫu 30 từ bằng mắt |
| Flashcard làm loãng trọng tâm luyện thi | Trung bình | Đặt ở route riêng, không nhét vào màn làm bài |
| Không có audio cho 600 từ | Thấp | Dùng `SpeechSynthesis`; ghi rõ trong "giới hạn đã biết" |

---

## 8. Định nghĩa "xong"

1. `npx tsc -b` sạch, `npx oxlint` 0 warning
2. `npx vitest run` xanh, có test cho engine vocab (hộp Leitner, chọn từ cần ôn)
3. `node scripts/verify-core.mjs` + `verify-ui.mjs` + `verify-vocab.mjs` xanh
4. 600 từ đủ 12 chủ đề, mỗi từ đủ 9 trường, không từ nào trùng
5. Kiểm cả light và dark mode trên Chrome thật
6. Kiểm ở 375px không tràn ngang
7. Bàn phím dùng được ở màn flashcard (Space lật thẻ, 1/2 chọn đã thuộc/chưa)
8. `README.md` và `docs/PLAN.md` cập nhật đúng số liệu
