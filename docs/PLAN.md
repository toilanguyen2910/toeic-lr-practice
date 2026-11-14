# KẾ HOẠCH — Website luyện TOEIC Listening & Reading cá nhân

> Tài liệu này là kế hoạch thi công do Lead (sếp dự án) lập, dựa trên khảo sát thực tế
> thư mục làm việc và định dạng đề TOEIC L-R hiện hành. Mọi con số về "đã xong" trong
> tài liệu khác phải đối chiếu với `docs/QA-REPORT.md`, không đối chiếu với tài liệu này.

---

## 1. Mục tiêu

Một **web app chạy hoàn toàn trong trình duyệt** (không backend, không tài khoản, không
phí) để một người tự luyện TOEIC Listening & Reading mỗi ngày.

Tiêu chí thành công — đo được, không cảm tính:

| # | Tiêu chí | Cách đo |
|---|---|---|
| 1 | Luyện được từng part riêng lẻ | Chọn 1–7 part, chọn số câu, làm bài |
| 2 | Thi thử có tính giờ như đề thật | Đồng hồ đếm ngược, hết giờ tự nộp |
| 3 | Chấm điểm + quy đổi thang 10–990 | Điểm hiển thị, tách nghe/đọc |
| 4 | Giải thích bằng tiếng Việt cho từng câu | Mỗi câu có explanation + translation |
| 5 | Không mất dữ liệu khi tải lại | localStorage, nút "Tiếp tục bài đang làm" |
| 6 | Chạy được trên điện thoại | Không tràn ngang ở 390px |
| 7 | Chất lượng được chứng minh bằng test thật | Test trên Chrome thật qua CDP, có ảnh chụp |

**Ngoài phạm vi (cố ý cắt):** tài khoản/đăng nhập, đồng bộ đa thiết bị, audio thu âm
thật, chấm bài nói/viết, thanh toán, phân tích học tập nâng cao.

---

## 2. Hiện trạng thư mục (khảo sát thật, không suy diễn)

`C:\Users\Admin\Downloads\Dự án` **đã là một dự án Vite có sẵn**, không phải thư mục trống:

- React 19.3.1, TypeScript ~7.0.2, Vite ^8.3.6, Vitest ^5.1.0, oxlint ^1.90.0
- `node_modules` đã cài sẵn (~99.5 MB, 1447 file) → **không cần `npm install` lại**
- Có sẵn bộ khung test Chrome qua CDP: `scripts/smoke.mjs`, `scripts/screenshot.mjs`
- **Không có `.git`** → hiện tại không có lịch sử phiên bản

Nội dung cũ trong thư mục là một app **"Quản lý chi tiêu"** không liên quan. Quyết định:
**lưu trữ, không xoá** — chuyển vào `docs/legacy-expense-app/` để giữ tham chiếu.
Lý do: mã nguồn đó là tài sản của Giám đốc, việc ghi đè là không thể hoàn tác.

**Nợ kỹ thuật phát hiện được (sẽ xử lý ở bước 8):**
- README cũ nói "TypeScript strict" nhưng `tsconfig.app.json` **không bật `strict`**.
- Asset rác từ template: `src/assets/hero.png`, `react.svg`, `vite.svg`, `public/icons.svg`.
- `dist/` cũ nằm lẫn trong thư mục nguồn.

---

## 3. Định dạng đề TOEIC L-R mà app mô phỏng

| Phần | Nội dung | Số câu | Thời gian |
|---|---|---|---|
| Listening | Part 1 Tranh ảnh | 6 | 45 phút (cả phần) |
| | Part 2 Hỏi–đáp | 25 | |
| | Part 3 Hội thoại | 39 | |
| | Part 4 Bài nói | 30 | |
| Reading | Part 5 Điền từ | 30 | 75 phút (cả phần) |
| | Part 6 Điền đoạn | 16 | |
| | Part 7 Đọc hiểu | 54 | |
| **Tổng** | | **200** | **120 phút** |

Thang điểm: mỗi phần 5–495, tổng 10–990. App quy đổi **theo tỉ lệ đúng/sai của phần
đó**, và **luôn ghi rõ đây là ước lượng** — không giả vờ là điểm thật của ETS.

---

## 4. Kiến trúc

```
┌─────────────────────────────────────────────────────────┐
│  UI (React 19)  src/ui/, src/App.tsx, src/styles/       │
│  Router hash tự viết · 7 màn hình · không thư viện ngoài│
└───────────────────────┬─────────────────────────────────┘
                        │ chỉ gọi hàm trong contract
┌───────────────────────▼─────────────────────────────────┐
│  ENGINE  src/lib/  — hàm THUẦN, không React, không DOM   │
│  session · scoring · storage · time                      │
└───────────────────────┬─────────────────────────────────┘
                        │ đọc
┌───────────────────────▼─────────────────────────────────┐
│  DATA  src/data/part1..part7.ts  → src/data/index.ts     │
│  Hợp đồng kiểu dữ liệu: src/types.ts                     │
└─────────────────────────────────────────────────────────┘
```

**Vì sao tách lớp như vậy:**

1. **Engine là hàm thuần** → Vitest chạy được trong Node, không cần dựng trình duyệt,
   test nhanh và không lẫn lỗi giao diện vào lỗi logic.
2. **UI không tự tính điểm** → điểm chỉ có một nguồn sự thật. Nếu tính ở hai nơi, sớm
   muộn hai nơi sẽ lệch nhau.
3. **Hợp đồng đặt trước, code đặt sau** → 4 người làm song song mà không phải chờ nhau.
   `src/types.ts` + `src/lib/contract.ts` + `src/testids.ts` là ba bản hợp đồng.

### Ranh giới ghi (ai được sửa cái gì)

| Thư mục | Chủ sở hữu | Ghi chú |
|---|---|---|
| `src/types.ts`, `src/lib/contract.ts`, `src/testids.ts`, `scripts/cdp.mjs`, `scripts/verify-core.mjs` | **Lead** | Hợp đồng, chỉ Lead sửa |
| `src/data/` | **content** | Ngân hàng câu hỏi + test nội dung |
| `src/lib/` | **engine** | Logic + unit test |
| `src/ui/`, `src/App.tsx`, `src/hooks/`, `src/styles/`, `public/images/` | **ui** | Giao diện |
| `scripts/verify-ui.mjs`, `scripts/screenshots.mjs`, `docs/QA-REPORT.md` | **qa** | Kiểm thử độc lập |

Ranh giới này là **quy ước**, không phải khoá kỹ thuật — nên Lead phải tự rà lại toàn
bộ diff trước khi nhận.

---

## 5. Hợp đồng dữ liệu (đã chốt, không đổi giữa đường)

### 5.1 Câu hỏi — `Question`

```ts
{
  id: 'p5-0001',            // p{part}-{4 số}, duy nhất
  part: 5, section: 'reading', difficulty: 3,
  tags: ['preposition'],
  stimulusId?: 'g-p5-0001', // chỉ khi dùng ngữ liệu chung
  prompt: 'Ms. Lee will ______ the meeting.',
  choices: [{ letter: 'A', text: 'attends' }, …],  // Part 2 chỉ 3 lựa chọn
  answer: 'B',
  explanation: '…tiếng Việt, nêu cả vì sao 3 đáp án kia sai…',
  translation: '…tiếng Việt…',
}
```

`Stimulus` giữ ngữ liệu dùng chung: `audioScript` (Part 1–4) và/hoặc `passages`
(Part 6–7), khoá bằng `stimulusId`.

### 5.2 Phiên làm bài — `Session`

Bất biến (immutable): mỗi thao tác trả về object mới. Nhờ vậy React chỉ cần so sánh
tham chiếu, và undo/redo sau này không phải viết lại.

Điểm dễ sai đã được đóng đinh bằng test: **`answers[id] === null` nghĩa là "bỏ trống",
khác với "không có key"**. Truyền `null` vào `answerQuestion` phải **giữ key** với giá
trị `null`, không được xoá key — nếu xoá, số câu bỏ trống sẽ đếm sai.

### 5.3 Hợp đồng testid — `src/testids.ts`

Toàn bộ `data-testid` nằm trong một file. Vì sao: nếu UI tự đặt tên và test tự đặt tên,
hai bên sẽ lệch nhau ngay từ lần đổi giao diện đầu tiên. Một nguồn duy nhất thì không.

---

## 6. Phân công

| Vai | Người | Phạm vi | Sản phẩm bàn giao |
|---|---|---|---|
| Lead (sếp) | `lead` | Hợp đồng, tích hợp, kiểm tra chéo | `types.ts`, `contract.ts`, `testids.ts`, `scripts/cdp.mjs`, `verify-core.mjs`, `PLAN.md` |
| Nội dung | `content` | `src/data/` | 85 câu chia 7 part + `content.test.ts` |
| Logic | `engine` | `src/lib/` | session/scoring/storage/time + 4 file test |
| Giao diện | `ui` | `src/ui/`, `App.tsx`, `styles/` | 7 màn hình, router, CSS, SVG |
| Kiểm thử | `qa` | `scripts/verify-ui.mjs`, `docs/` | Test UI thật + 10 ảnh chụp + `QA-REPORT.md` |

**Nguyên tắc vận hành:** người viết không tự tuyên bố mình xong. `qa` kiểm tra độc lập
và là người duy nhất được nói "chạy được". Lead rà lại lần cuối.

---

## 7. Lộ trình

| Bước | Nội dung | Trạng thái |
|---|---|---|
| 0 | Khảo sát thư mục, xác nhận công cụ (Node 22, Chrome, mạng) | ✅ xong |
| 1 | Lưu trữ app "Quản lý chi tiêu" cũ vào `docs/legacy-expense-app/` | ✅ xong |
| 2 | Chốt 3 hợp đồng: kiểu dữ liệu, API engine, testid | ✅ xong |
| 3 | Dựng bộ khung test Chrome qua CDP + kịch bản E2E | ✅ xong |
| 4 | Viết ngân hàng 85 câu (`content`) | ✅ xong |
| 5 | Cài engine + unit test (`engine`) | ✅ xong |
| 6 | Dựng giao diện 7 màn hình (`ui`) | ✅ xong |
| 7 | QA độc lập: test thật trên Chrome + ảnh chụp (`qa`) | ✅ xong |
| 8 | Tích hợp, rà diff, bật `strict`, dọn asset rác, viết README | ✅ xong |
| 9 | Chạy `verify:core` + `verify:ui` + toàn bộ test, đọc kết quả thật | ✅ xong |

### Kết quả cuối (số thật, đo ngày 14/11/2026)

| Hạng mục | Kết quả |
|---|---|
| `tsc -b` (strict + noUncheckedIndexedAccess) | 0 lỗi |
| `oxlint` | 0 warning, 0 error |
| `vitest run` | 195 test / 7 file — pass hết |
| `vite build` | thành công, 369 kB (111 kB gzip) |
| `verify:core` (E2E trên Chrome thật) | 50 passed, 0 failed |
| `verify:ui` (QA viết độc lập) | 28 passed, 0 failed |
| Ảnh chụp | 10/10 PNG thật |

### Sai sót đã phát hiện và sửa trong quá trình tích hợp

Đây là phần đáng đọc nhất của kế hoạch — những lỗi mà **chỉ kiểm tra chéo mới bắt được**:

1. **Đáp án dồn về A/B/C** — 84/85 câu có đáp án là A, B hoặc C; chỉ 1 câu D. Người
   luyện chỉ cần luôn chọn B là được ~38%. Đã tái cân bằng thành A=23, B=22, C=22, D=18
   và thêm test chặn vĩnh viễn.
2. **Part 1 lệch giữa ảnh và đáp án** — 7/8 câu mô tả một bộ tranh khác với ảnh thật
   đang có. Phát hiện bằng cách tự render 8 ảnh ra PNG rồi nhìn, **không** đọc nhãn.
3. **Hai câu Part 1 vẫn sai sau lần sửa đầu** — "loading onto" (không xác định được
   chiều trong tranh) và "waiting in line" (tranh không có hàng). Sửa thành mô tả
   trung tính, chỉ dựa trên thứ nhìn thấy được.
4. **Mâu thuẫn giữa đặc tả và test** — `formatClock` cho phép `h:mm:ss` nhưng E2E lại
   chỉ chấp nhận `mm:ss`. Lỗi nằm ở đặc tả của Lead, đã sửa test chứ không sửa code.
5. **Lỗi cú pháp do công cụ** — dùng `PowerShell .Replace()` sinh ra nháy đơn không
   escape trong chuỗi tiếng Việt, làm vỡ 2 file dữ liệu.

**Bài học:** báo cáo "đã xong, đã kiểm tra" của người viết không đủ. Cả 3 lỗi nặng nhất
đều do người **không viết ra đoạn code đó** phát hiện.

---

## 8. Rủi ro và cách xử lý

| Rủi ro | Khả năng | Tác động | Cách xử lý |
|---|---|---|---|
| 4 người sửa trùng file | Trung bình | Cao | Chia thư mục rời nhau + 3 file hợp đồng do Lead độc quyền |
| UI chờ engine, engine chờ data | Cao | Trung bình | Hợp đồng đặt trước; UI code theo `contract.ts`, data mẫu `sample.ts` có sẵn |
| Nội dung tiếng Anh sai/đáp án sai | Trung bình | Cao | `content.test.ts` kiểm tra cấu trúc; Lead rà tay mẫu ngẫu nhiên |
| Test "xanh giả" (test không thật sự kiểm gì) | Trung bình | Cao | Test phải chạy trên Chrome thật; QA đọc DOM thật; cấm dùng lại kết quả cũ |
| Điểm ước lượng bị hiểu là điểm thật | Cao | Thấp | Luôn hiện nhãn "ước lượng" + ghi chú trên màn hình kết quả |
| Không có `.git` → mất code nếu ghi đè | Trung bình | Cao | Khảo sát trước khi ghi; app cũ đã được lưu trữ chứ không xoá |

---

## 9. Định nghĩa "xong"

Một bước chỉ được coi là xong khi **tất cả** điều sau đúng, và có output thật dán kèm:

1. `npx tsc -b` không lỗi
2. `npx vite build` thành công
3. `npx oxlint` không lỗi
4. `npx vitest run` xanh toàn bộ
5. `node scripts/verify-core.mjs` xanh — test trên Chrome thật qua CDP
6. `node scripts/verify-ui.mjs` xanh — do QA viết, không dùng lại của Lead
7. `docs/screenshots/*.png` là ảnh thật, mở ra thấy giao diện
8. `docs/QA-REPORT.md` ghi kết quả thật, kể cả phần chưa kiểm được

---

## 10. Việc tiếp theo sau khi bản này xong

- [ ] Bật `"strict": true` trong `tsconfig.app.json` và sửa hết lỗi phát sinh
- [ ] Thêm âm thanh thật (thu bằng giọng đọc TTS hoặc tự thu) cho Part 1–4
- [ ] Chế độ "ôn câu sai" — lặp lại các câu đã làm sai ở các phiên trước
- [ ] Biểu đồ tiến bộ theo tuần (điểm, độ chính xác từng part)
- [ ] Mở rộng ngân hàng lên 200 câu để thi thử đủ dài
- [ ] `git init` + commit đầu tiên
