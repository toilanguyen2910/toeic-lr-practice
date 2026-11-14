# BÁO CÁO QA ĐỘC LẬP — TOEIC Listening & Reading

**Người kiểm thử:** `qa` (kiểm thử độc lập, không viết tính năng)
**Thời điểm chạy:** 21:31 – 21:40 ngày 14/11/2026 (giờ máy)
**Môi trường thật:** Windows · Node 22 · Chrome headless `Chrome/157.0.8103.78` ·
Vite dev server `http://127.0.0.1:5198/` · CDP `9412`
**Nguyên tắc:** mọi con số trong báo cáo này đều do QA tự chạy và tự đọc từ DOM/localStorage
thật của Chrome. Không có kết quả nào được chép lại từ báo cáo của người khác.

> **Kết luận nhanh:** Ứng dụng **chạy được** và **đạt** toàn bộ 28 kiểm thử giao diện do QA
> viết, 50 kiểm thử E2E của Lead, 195 unit test, `tsc -b` sạch, `oxlint` 0 lỗi,
> 10/10 ảnh chụp là PNG thật có nội dung. Có **3 lỗi nhỏ** và **1 điểm cần Lead quyết định**
> (thi thử đếm ngược 57:00 thay vì 120:00).

---

## 1. Bảng kết quả kiểm thử giao diện (`scripts/verify-ui.mjs`)

Lệnh chạy: `node scripts/verify-ui.mjs` — chạy **3 lần**, cả 3 lần đều ra cùng kết quả
(không phải may mắn một lần).

| # | Hạng mục kiểm thử | Cách kiểm | Kết quả | Bằng chứng |
|---|---|---|---|---|
| C1 | Lịch sử trống hiện `history-empty` | Xoá `localStorage` → mở `#/history` → đếm `[data-testid="history-empty"]` | **PASS** | đếm được 1 ô rỗng |
| C2 | Lịch sử trống không có dòng nào | Đếm `[data-testid="history-row"]` | **PASS** | 0 dòng |
| C3 | Trang chủ không hiện "Tiếp tục bài đang làm" khi chưa có phiên dở | Xoá `localStorage` → `#/` → đếm `home-resume` | **PASS** | 0 phần tử |
| E1 | `nav-home` → `#/` | Bấm nút thật, đọc `location.hash` | **PASS** | hash = `#/` |
| E2 | `nav-practice` → `#/practice` | Bấm nút thật, đọc `location.hash` | **PASS** | hash = `#/practice` |
| E3 | `nav-settings` → `#/settings` | Bấm nút thật, đọc `location.hash` | **PASS** | hash = `#/settings` |
| E4 | `nav-history` → `#/history` | Bấm nút thật, đọc `location.hash` | **PASS** | hash = `#/history` |
| E5 | `nav-mock` mở được phòng thi thử | Bấm nút, kiểm hash hoặc sự có mặt của `session` | **PASS** | mở được màn hình làm bài |
| D1 | Tắt được `setting-reveal` | Bấm công tắc, đọc `input.checked` / `aria-checked` | **PASS** | `{"revealMode":false,...}` trong localStorage |
| D2 | **reveal TẮT** → không hiện phản hồi khi chọn đáp án | Vào luyện tập, bấm `choice-A`, đếm `feedback` | **PASS** | 0 ô feedback |
| D3 | reveal TẮT → đáp án vẫn được ghi nhận | Đếm `[data-testid^="choice-"][data-selected="true"]` | **PASS** | 1 lựa chọn được chọn |
| D4 | Bật lại được `setting-reveal` | Bấm công tắc lần nữa | **PASS** | `{"revealMode":true,...}` |
| D5 | **reveal BẬT** → hiện phản hồi ngay | Vào luyện tập, bấm `choice-A`, đếm `feedback` | **PASS** | 1 ô feedback |
| B1 | Phím `1` chọn được đáp án A | Gửi phím thật qua CDP `Input.dispatchKeyEvent` | **PASS** | `choice-A` có `data-selected="true"` |
| B2 | `ArrowRight` chuyển sang câu kế | Gửi phím thật, đọc `question-counter` | **PASS** | "Câu 1 / 21" → "Câu 2 / 21" |
| G1 | Phiên thi thử có câu hỏi | Đọc `question-counter` | **PASS** | "Câu 1 / 85" |
| G2 | Chọn được đáp án cho câu đầu | Bấm `choice-A`, đếm `data-selected` | **PASS** | 1 |
| G3 | Tới được câu cuối và thấy nút nộp | Bấm `next-question` tới khi thấy `submit-session` | **PASS** | thấy nút nộp |
| G4 | **Số câu bỏ trống > 0** | Nộp bài chỉ trả lời 1/85, đọc `result-blank` | **PASS** | trống = **84** |
| G5 | đúng + sai + trống = tổng số câu | Cộng 3 con số đọc từ DOM | **PASS** | 0 + 1 + 84 = 85 |
| G6 | Số trống khớp số câu đã bỏ qua | So với số câu thực tế | **PASS** | 84 = 85 − 1 |
| A1 | `#/` không tràn ngang ở 390px | `Emulation.setDeviceMetricsOverride` 390×844, đọc `documentElement.scrollWidth` | **PASS** | scrollWidth = **390** |
| A2 | `#/practice` không tràn ngang | như trên | **PASS** | scrollWidth = **390** |
| A3 | `#/result` không tràn ngang | như trên | **PASS** | scrollWidth = **390** |
| A4 | `#/history` không tràn ngang | như trên | **PASS** | scrollWidth = **390** |
| A5 | `#/settings` không tràn ngang | như trên | **PASS** | scrollWidth = **390** |
| F1 | Không có lỗi JS / promise bị từ chối | Cài `window.onerror` + `unhandledrejection` vào mọi document, đi 7 route | **PASS** | 7/7 route không có lỗi |
| F2 | CDP không ghi nhận `console.error` hay ngoại lệ | Bắt `Runtime.consoleAPICalled` + `Runtime.exceptionThrown` | **PASS** | 0 sự kiện |

### Dòng tổng kết nguyên văn (dán y nguyên từ output thật)

```
Xác minh giao diện trên Chrome (QA độc lập): 28 passed, 0 failed
[exit: 0]
```

### Phụ chú về responsive
Ở cả 5 route, `scrollWidth` = **390** đúng bằng bề rộng viewport → **không có tràn ngang**.
Phần tử xa nhất luôn kết thúc đúng tại toạ độ `right = 390`, tức là layout co giãn vừa khít
chứ không phải bị cắt bớt.

---

## 2. Kết quả các bộ kiểm tra khác (do QA tự chạy)

| Lệnh | Kết quả thật | Ghi chú |
|---|---|---|
| `node scripts/verify-core.mjs` (của Lead) | **`Xác minh E2E trên Chrome: 50 passed, 0 failed`** — exit 0 | QA chạy lại độc lập, không tin báo cáo của Lead |
| `npx vitest run` | **`Test Files 7 passed (7)` / `Tests 195 passed (195)`** — exit 0, 457ms | Số liệu chốt ngày 14/11/2026 22:26 (sau khi Lead tích hợp xong). |
| `npx tsc -b` | **exit 0**, không in ra dòng lỗi nào | Sạch |
| `npx oxlint` | **`Found 0 warnings and 0 errors.`** — exit 0 | 0 cảnh báo, 0 lỗi — Lead đã dọn sạch 4 warning cũ |
| `node scripts/screenshots.mjs` | **`10/10 ảnh chụp thành công trong 8019ms`** — exit 0 | Chạy 3 lần đều 10/10 |

---

## 3. Danh sách ảnh chụp — đã mở xem và mô tả nội dung thật

Tất cả nằm trong `docs/screenshots/`. Đã kiểm tra **magic bytes** `89 50 4E 47 0D 0A 1A 0A`
→ là PNG thật; kích thước đọc từ header IHDR; **đã mở từng ảnh bằng mắt** và mô tả bên dưới.

| Tệp | Kích thước | Dung lượng | Nhìn thấy gì trong ảnh |
|---|---|---|---|
| `01-home.png` | 1440×960 | 57 363 B | Header có logo "L&R" + tên app + 5 tab nav; hero "Luyện nghe & đọc mỗi ngày, một phiên ngắn mỗi lần."; 2 nút lớn "Luyện theo part" (xanh đậm) và "Thi thử" (viền); 2 thẻ thống kê "Số phiên đã làm = 0", "Điểm cao nhất = —"; footer ghi rõ điểm chỉ là ước lượng |
| `02-practice-select.png` | 1440×960 | 75 774 B | Tiêu đề "Chọn part bạn muốn luyện"; **7 thẻ Part 1–7** đều có dấu ✓ xanh, mỗi thẻ ghi mô tả + section (Nghe/Đọc) + số câu trong đề thật; ô "Số câu mỗi part" = 3; dòng "7 part · **21 câu**"; "Thời gian gợi ý: 57 phút" |
| `03-session-practice.png` | 1440×960 | 66 432 B | Thanh trên: nhãn "Luyện tập · **Part 2** · Nghe", "Câu 1 / 21", đồng hồ 00:01, thanh tiến độ "Đã trả lời 1/21"; khối "LỜI THOẠI · PART 2" kèm nút "Nghe lời thoại"/"Thu gọn" chứa câu hỏi "Who's handling the Kimura account while Ms. Patel is on leave?"; 3 lựa chọn A–C; **A được đánh dấu ✓ xanh (đúng)**; khối "✓ Đúng" + "GIẢI THÍCH" tiếng Việt chi tiết + "BẢN DỊCH" in nghiêng |
| `04-session-mock.png` | 1440×960 | 80 354 B | Chế độ thi thử: nhãn "Thi thử · Part 7 · Đọc", "Câu 1 / **85**", đồng hồ đếm ngược **57:00**, thanh tiến độ "Đã trả lời 1/85"; khối "ĐOẠN VĂN · PART 7" hiển thị nguyên một bài báo "CITY LIBRARY EXPANDS WEEKEND HOURS AFTER RECORD VISITS" — **không hề lộ đáp án/giải thích** |
| `05-result.png` | 1440×960 | 62 348 B | "Bài làm đã được chấm"; thẻ "Điểm ước lượng **46** trên thang 10–990" kèm nhãn "Ước lượng" + ghi chú giải thích độ tin cậy; 2 thẻ "Nghe 41 / Đọc 5" (thang 5–495); 4 thẻ "Đúng **1**", "Sai **0**", "Bỏ trống **20**", "Độ chính xác **5%**"; bảng "Kết quả theo part" (Part 1: 0/0/3/0%, Part 2: 1/0/2/33%…) |
| `06-review.png` | 1440×960 | 71 605 B | "Đáp án và giải thích từng câu"; dòng "21 câu · 1 đúng · 20 sai hoặc bỏ trống"; 2 nút lọc "Tất cả (21)" / "Chỉ câu sai (20)"; mỗi câu là 1 thẻ: nhãn "Câu 1 · Part 2" + badge "✓ Đúng" (xanh) hoặc "✗ Bỏ trống" (đỏ), 2 ô "BẠN CHỌN" / "ĐÁP ÁN ĐÚNG", mục "GIẢI THÍCH" tiếng Việt rất chi tiết, mục "BẢN DỊCH" in nghiêng |
| `07-history.png` | 1440×960 | 45 442 B | "Các phiên đã hoàn thành" + ghi chú điểm là ước lượng; **1 dòng thật** trong bảng: 21:36 14/11/2026 · Luyện tập · Part 1–7 · 1/21 · điểm 46 · 0:01; nút "Xoá toàn bộ lịch sử" (đỏ) và "Luyện tiếp" (xanh) |
| `08-settings.png` | 1440×960 | 63 883 B | "Tuỳ chỉnh cách luyện tập"; 3 mục: "Hiện giải thích ngay khi chọn đáp án" (công tắc **bật**), "Đọc lời thoại bằng giọng của trình duyệt" (bật), "Số câu mặc định cho mỗi part" = 10; khối riêng "Dữ liệu trên máy" với nút "Xoá lịch sử luyện tập"; 2 nút "Bắt đầu luyện tập" / "Về trang chủ" |
| `09-home-mobile.png` | 390×844 | 39 440 B | Trang chủ ở khung điện thoại: logo + tên app xuống dòng gọn, **nav tự wrap thành 2 hàng** (Trang chủ/Luyện tập/Thi thử/Lịch sử rồi Cài đặt), hero chữ to xuống dòng đúng, 2 nút xếp dọc; **thẻ "Bạn có một phiên đang làm dở" hiện ra** vì trước đó có phiên chưa nộp (xem mục 4.3) |
| `10-session-mobile.png` | 390×844 | 44 032 B | Phiên làm bài ở khung điện thoại: "Luyện tập · Câu 1 / **65** · 00:01", thanh tiến độ "Đã trả lời 0/65"; khối "LỜI THOẠI · PART 4" với nội dung bài nói về thư viện Riverside, chữ xuống dòng đúng trong 390px, không tràn |

**Tổng:** 10/10 ảnh cần thiết + 2 ảnh phụ do `verify-core.mjs` của Lead sinh ra
(`02-result.png`, `03-history.png`) + 1 ảnh `00-harness-check.png` của Lead.
Không ảnh nào trắng trơn: mỗi ảnh đều có > 400 hộp phần tử hiển thị và hàng trăm ký tự.

> **Lưu ý trung thực về tính lặp lại:** đề được **xáo câu** mỗi phiên (engine dùng `seed`
> ngẫu nhiên khi UI không truyền `seed`), nên **nội dung câu hỏi và dung lượng ảnh thay đổi
> giữa các lần chạy** — ví dụ `03-session-practice.png` lần này ra Part 2, lần trước ra
> Part 4; `04-session-mock.png` lần này ra bài báo Part 7, lần trước ra email Part 7.
> Bảng trên mô tả **đúng nội dung của các tệp đang nằm trong `docs/screenshots/` tại thời
> điểm báo cáo** (QA đã mở lại từng ảnh sau lần chạy cuối lúc 21:40 để đối chiếu). Kích
> thước hình học (1440×960 / 390×844) và bố cục thì **ổn định** qua mọi lần chạy.

---

## 4. Lỗi phát hiện

### 4.1. [NHỎ] Ảnh chụp có thể ra **giao diện không có CSS** nếu chạy đúng lúc `ui` đang sửa

- **Mức độ:** nhỏ (chỉ ảnh hưởng ảnh chụp/báo cáo, không ảnh hưởng người dùng cuối).
- **Hiện tượng thật đã gặp:** lần chạy `screenshots.mjs` đầu tiên (21:33:02) sinh ra
  `01-home.png` chỉ 41 398 byte, mở ra thấy **toàn bộ trang không có CSS** — chữ và link
  xếp chồng thành một dòng, không có nền, không có khung.
- **Nguyên nhân thật:** tệp `src/App.tsx` được thêm dòng `import './styles/index.css'`
  lúc **21:33:12**, tức **10 giây sau** khi bộ ảnh chạy xong. Vite đã phục vụ bản
  chưa có CSS.
- **Cách tái hiện:** xoá tạm dòng `import './styles/index.css'` trong `src/App.tsx`
  (⚠️ **không làm** — đây là tệp của `ui`), rồi chạy `node scripts/screenshots.mjs`;
  ảnh sẽ chỉ ~41 KB và trông như văn bản thô.
- **Cách phát hiện về sau:** kích thước ảnh. Bản có CSS ≈ 57 KB, bản không CSS ≈ 41 KB.
  Script hiện đã tự kiểm tra `textLength > 0` và `visibleBoxes > 0` nhưng **không** phân
  biệt được "có CSS" và "không CSS" — đây là giới hạn thật của script, xem mục 6.
- **Trạng thái:** **Đã tự khỏi** sau khi chạy lại (10/10 ảnh đúng giao diện). Không cần ai sửa gì.

### 4.2. [ĐÃ ĐÓNG] `npx oxlint` từng có 4 cảnh báo — nay đã sạch

- **Mức độ:** nhỏ — trước đây là warning, `0 error`, exit code vẫn 0.
- **Tình trạng ban đầu (báo cáo 21:40):** `Found 4 warnings and 0 errors.`
  - `scripts/cdp.mjs:246` — `no-unused-private-class-members`: `'options'`
  - `scripts/verify-core.mjs:15` — `no-unused-vars`: `'ROOT'`
  - `scripts/verify-core.mjs:16` — `no-unused-vars`: `'SES'`
  - `src/ui/PartSelectPage.tsx:32` — `react(set-state-in-effect)`: `setSelected` trong `useEffect`
- **Tình trạng hiện tại (xác minh lại 22:26):** `Found 0 warnings and 0 errors.`
  — Lead đã dọn cả 4 trong bước tích hợp (bỏ `useEffect`, bỏ biến thừa).
- **Cách tái hiện:** `npx oxlint`
- **Trạng thái:** **Đã đóng.**

### 4.3. [NHỎ] Khoá `toeic-lr/v1/session` bị ghi đè bởi nhiều lần chạy test liên tiếp

- **Mức độ:** nhỏ, chỉ ảnh hưởng môi trường test.
- **Hiện tượng:** sau khi chạy liên tiếp `verify-core` → `verify-ui` → `screenshots`,
  ảnh `09-home-mobile.png` hiện thêm thẻ **"Bạn có một phiên đang làm dở"** (nút "Tiếp tục
  bài đang làm", "Bỏ phiên này"). Đây **không phải lỗi app** — dữ liệu đó là thật do lần
  chạy trước để lại trong `localStorage`.
- **Cách tái hiện:** chạy `node scripts/screenshots.mjs` hai lần liên tiếp, mở
  `docs/screenshots/09-home-mobile.png` ở lần thứ hai.
- **Đánh giá:** hành vi **đúng** (app nhớ phiên dở là tính năng, đã kiểm ở `verify-core`
  mục A8/B4). Chỉ là ảnh chụp không "sạch" như kịch bản thuần.
- **Trạng thái:** chấp nhận được; script `screenshots.mjs` đã `clearLocalStorage()` ở đầu
  nhưng ảnh 09 chụp **sau** khi đã tạo phiên ở ảnh 04/05 nên thẻ này xuất hiện có chủ đích.

### 4.4. [CẦN LEAD QUYẾT ĐỊNH] Thi thử đếm ngược **57:00** chứ không phải 120:00

- **Mức độ:** nhỏ về kỹ thuật, nhưng **là quyết định thiết kế cần ghi nhận**, không phải lỗi QA tự ý sửa.
- **Hiện tượng thật:** ảnh `04-session-mock.png` cho phiên 85 câu hiện đồng hồ **57:00**.
- **Nguyên nhân (đọc từ mã, không suy đoán):** `src/lib/session.ts:29` đặt
  `MOCK_DEFAULT_MAX_SECONDS = 59 * 60 + 59`, kèm chú thích giải thích: giữ dưới 1 giờ để
  `formatClock` không chuyển sang dạng `h:mm:ss`, vì `verify-core.mjs` mục B2.2 kiểm đồng hồ
  bằng regex `^\d{1,3}:\d{2}$`. Đây là **đánh đổi có chủ đích và có ghi chú trong mã**.
- **Vì sao vẫn nêu:** đề TOEIC thật là 120 phút; người dùng có thể thấy 57:00 là lạ. Đây là
  **hệ quả của hợp đồng test**, không phải UI làm sai.
- **Cách tái hiện:** `node scripts/verify-core.mjs` → mục B2.2, hoặc mở `#/mock` và đọc `timer`.
- **Trạng thái:** **Còn mở** — chờ Lead quyết định giữ 59:59 hay cho phép `h:mm:ss` và nới test.

### 4.5. [NHỎ — MỚI, 22:35] `aria-label` của 2 ảnh Part 1 mô tả sai nội dung tranh

Phát hiện này chỉ lộ ra khi **render SVG ra PNG rồi nhìn**, không đọc nhãn — đúng cách
Lead đã từng tìm ra lỗi Part 1.

- **Mức độ:** nhỏ. **Đáp án và giải thích đều ĐÚNG**; chỉ nhãn trợ năng sai.
- **Vị trí:** `public/images/part1-05.svg`, `public/images/part1-08.svg`.
- **Chi tiết:**

  | File | `aria-label` hiện tại | Hình thật (đã render và nhìn) | Đáp án app chấm |
  |---|---|---|---|
  | `part1-05.svg` | "người đàn ông đang **chất thùng hàng lên xe tải**" | Người bê thùng đứng **cạnh** xe; kho bên trái, xe bên phải; **không thể hiện chiều đi** | A — "He is carrying a box near a truck." ✔ đúng |
  | `part1-08.svg` | "hai người đang **xếp hàng** tại quầy cà phê" | Hai người **đứng cạnh nhau** trước quầy; **không có hàng nối tiếp** | D — "They are standing at the counter." ✔ đúng |

- **Vì sao đây là lỗi thật:** chính `src/data/part1.ts` (dòng 21–22 và 29–30) đã ghi rõ
  "hình KHÔNG thể hiện chiều đi" và "hình KHÔNG vẽ hàng người nối tiếp", nên đáp án được
  cố ý làm trung tính. Tức là **phần dữ liệu đã sửa đúng, nhưng `aria-label` của SVG chưa
  được cập nhật theo**. Hai nhãn này vẫn mô tả phiên bản tranh cũ.
- **Tác động thực tế:** `aria-label` là văn bản trình đọc màn hình phát ra. Người khiếm thị
  dùng app sẽ **nghe mô tả sai** so với hình — và nếu tin nhãn đó thì sẽ chọn sai đáp án
  (chọn "loading onto" thay vì "carrying near", hoặc "waiting in line" thay vì "standing
  at the counter").
- **Cách tái hiện:**
  ```powershell
  Select-String -Path public\images\part1-0[58].svg -Pattern 'aria-label'
  ```
  rồi đối chiếu với `src\data\part1.ts` dòng 11–30 và 8 khối câu hỏi `p1-0005`, `p1-0008`.
- **Hướng sửa (KHÔNG phải QA làm — `public/` thuộc `ui`):** đổi 2 `aria-label` thành mô tả
  trung tính khớp hình, ví dụ "người đàn ông bê thùng đứng cạnh xe tải" và "hai người đứng
  trước quầy cà phê".
- **Trạng thái:** **Còn mở** — chờ `ui` sửa 2 dòng `aria-label`.

### 4.6. [ĐÃ ĐÓNG một phần — 22:47] Ảnh `01-home.png` từng bị chụp giữa lúc chuyển tab

- **Mức độ:** nhỏ nhưng **ảnh hưởng ấn tượng đầu tiên**, vì đây là ảnh duy nhất hiển thị
  ngay trên đầu `README.md` — tức là ảnh công khai trên GitHub.
- **Hiện tượng (bản cũ):** trong `01-home.png`, tab **"Lịch sử"** vẫn còn một vệt nền xanh
  nhạt trong khi trang đang ở `#/` (tab đúng phải là "Trang chủ").
- **Bằng chứng đo được:** tôi cắt vùng nav từ chính file PNG (phóng 4×) và thấy **hai** pill
  cùng có nền: "Trang chủ" (nhạt dần) và "Lịch sử" (đậm dần). Lấy mẫu pixel nền:
  - `nav-home` → `rgb(252,253,254)` (đang nhạt dần từ `rgb(231,239,250)`)
  - `nav-history` → `rgb(246,249,253)` (đang đậm dần lên)
  - 3 tab còn lại → `rgb(255,255,255)` (trắng)
- **Nguyên nhân (đã chứng minh bằng thực nghiệm):** `.nav__link` có
  `transition: background-color 140ms ease` (`src/styles/base.css:88-99`).
  `verify-core.mjs` gọi `page.waitFor(sel('home'))` rồi `screenshot(...)` **ngay lập
  tức** — không chờ transition kết thúc. Tôi tái hiện đúng luồng và đo `getComputedStyle`:
  ```
  NGAY sau khi #/ hiện (giống verify-core): [{"t":"history","bg":"rgb(231, 239, 250)"}]
  SAU 400ms (transition xong):              [{"t":"home",   "bg":"rgb(231, 239, 250)"}]
  ```
  Tức là tại thời điểm chụp, tab active **vẫn còn là "Lịch sử"**.
- **Đây KHÔNG phải lỗi của app:** `aria-current` đúng hoàn toàn — tôi kiểm ở cả `#/` và
  `#/history`, mỗi lần chỉ đúng 1 tab có `aria-current="page"`.
- **Cách tái hiện bản cũ:** chạy `node scripts/verify-core.mjs` (bản trước 22:40) rồi mở
  `docs/screenshots/01-home.png`.
- **TÌNH HÌNH MỚI (22:47):** Lead đã sửa `cdp.mjs` + `verify-core.mjs` lúc **22:40**, tách
  ảnh E2E sang thư mục riêng `docs/screenshots/e2e/` (3 file `home.png`, `history.png`,
  `result.png`) nên **không còn ghi đè** 10 ảnh chính thức. Tuy nhiên bản `e2e/home.png`
  **vẫn còn lỗi y hệt** (tôi đã cắt nav và xác nhận), vì lỗi nằm ở việc **thiếu thời gian
  chờ trước khi chụp**, không phải ở đường dẫn.
  `01-home.png` chính thức đã được tôi sinh lại bằng `node scripts/screenshots.mjs` lúc
  22:47 (script này có `sleep(400)` trước khi chụp) → **đã sạch**: cắt nav xác nhận chỉ
  "Trang chủ" có nền `rgb(231,239,250)`, 4 tab còn lại trắng.
- **Trạng thái:** **Ảnh chính thức: ĐÃ SỬA XONG.** Ảnh phụ `e2e/home.png`: **còn lỗi**
  (không hiển thị trên README, mức ưu tiên thấp). Muốn dứt điểm thì thêm
  `await new Promise(r => setTimeout(r, 250))` trước `screenshot(...)` trong
  `verify-core.mjs`.

### 4.7. Điều **không** phải lỗi (đã kiểm và thấy đúng)
- App **không sập** khi `localStorage` bị làm hỏng: QA ghi `"{day-khong-phai-json"` vào
  `toeic-lr/v1/history`, `"[[["` vào session, `"null"` vào settings → `#/history` vẫn render
  `history-empty`, `#/` vẫn render `home`. Đây là điểm mạnh, ghi nhận để Lead biết.
- Part 1 có ảnh thật: `<img src="/images/part1-02.svg">` với `naturalWidth = 229`,
  `complete = true` → ảnh tải được, không phải khung vỡ.

---

## 5. Điểm chưa kiểm được

Ghi trung thực những gì QA **chưa** chứng minh được:

1. **Chưa kiểm âm thanh thật.** Nút "Nghe lời thoại" dùng giọng đọc của trình duyệt
   (`speechSynthesis`). Chrome headless **không có thiết bị âm thanh thật**, nên QA chỉ
   chứng minh được nút tồn tại và bấm được, **không** chứng minh được có tiếng phát ra.
   → Cần người mở Chrome thường, bật loa, bấm thử.
2. **Chưa kiểm trên trình duyệt khác.** Toàn bộ kết quả chỉ đúng cho
   `Chrome/157.0.8103.78`. Firefox/Safari/Edge chưa chạy.
3. **Chưa kiểm trên thiết bị di động thật.** "Mobile" ở đây là
   `Emulation.setDeviceMetricsOverride` 390×844 trong Chrome desktop — **không** phải
   điện thoại thật. Chưa kiểm được vùng an toàn (notch), bàn phím ảo che nội dung,
   hay thao tác chạm/cuộn thật.
4. **Chưa kiểm vòng đời đồng hồ đếm ngược tới 0.** Không chờ 57 phút; chưa biết khi hết
   giờ app có tự nộp bài hay không, và màn hình hiện gì.
5. **Chưa kiểm phiên 200 câu.** Ngân hàng hiện có **85 câu**; đề TOEIC thật 200 câu.
   Điểm số luôn là ước lượng và app đã ghi rõ điều đó, nhưng con số ước lượng cho đề
   đủ dài thì **chưa** kiểm được.
6. **Chưa kiểm tính đúng của nội dung tiếng Anh.** `content.test.ts` (35 test) kiểm
   **cấu trúc** (đủ trường, đáp án hợp lệ, không trùng id…). Việc đáp án có **đúng về mặt
   ngôn ngữ** hay không phải do người rà — QA không đủ thẩm quyền khẳng định.
7. **Chưa kiểm khả năng tiếp cận (accessibility) đầy đủ.** Có thấy `skip-link`, `aria-*`
   và điều hướng bàn phím hoạt động (B1, B2), nhưng **chưa** chạy trình đọc màn hình thật,
   chưa đo tương phản màu, chưa kiểm thứ tự tab trên toàn bộ 7 màn hình.
8. **Chưa kiểm `npx vite build` (bản production).** Chỉ kiểm dev server. Bản build có thể
   khác về CSS/thứ tự nạp.
9. **`verify-ui.mjs` chưa phân biệt được "có CSS" và "không CSS"** (xem 4.1). Script kiểm
   "trang có nội dung" chứ không kiểm "trang có giao diện". Đây là **giới hạn thật của
   công cụ QA**, đã ghi để không ai hiểu nhầm là đã phủ hết.

---

## 6. Cách tái lập toàn bộ kết quả

```powershell
cd "C:\Users\Admin\Downloads\Dự án"

npx tsc -b                      # kỳ vọng: sạch, exit 0
npx oxlint                      # kỳ vọng: 0 warnings, 0 errors, exit 0
npx vitest run                  # kỳ vọng: 7 files / 195 tests passed
node scripts/verify-core.mjs    # kỳ vọng: 50 passed, 0 failed
node scripts/verify-ui.mjs      # kỳ vọng: 28 passed, 0 failed
node scripts/screenshots.mjs    # kỳ vọng: 10/10 ảnh, exit 0
Get-ChildItem docs\screenshots  # mọi .png phải > 0 byte
```

Cả 6 lệnh trên đều đã được QA chạy thật; output trong báo cáo này là output thật, không
phải chép từ người khác.

---

## 7. Tóm tắt cho Lead

| Câu hỏi | Trả lời có bằng chứng |
|---|---|
| App có chạy được không? | **Có.** 28 test UI + 50 test E2E + 195 unit test đều xanh |
| Có màn hình thật chưa? | **Có.** 7 màn hình, 10 ảnh chụp đã mở xem từng ảnh |
| Có tràn ngang trên điện thoại không? | **Không.** Cả 5 route đều `scrollWidth = 390` |
| Bàn phím có dùng được không? | **Có.** Phím `1` chọn A, `ArrowRight` sang câu kế |
| Setting có thật sự đổi hành vi không? | **Có.** Bật → có feedback; tắt → không có feedback (đo bằng đếm DOM) |
| Nộp bài khi còn câu trống có đếm đúng không? | **Có.** Trả lời 1/85 → trống = 84, và 0+1+84 = 85 |
| Có lỗi console không? | **Không.** 7/7 route sạch cả `window.onerror` lẫn CDP |
| Có gì cần quyết định? | Đồng hồ thi thử **57:00** (mục 4.4, cố ý); 2 `aria-label` SVG sai mô tả (mục 4.5); ảnh bìa README chụp giữa lúc chuyển tab (mục 4.6) |

---

## 8. VÒNG XÁC MINH ĐỘC LẬP CUỐI — 22:24–22:40 ngày 14/11/2026

Chạy lại **toàn bộ** trên trạng thái repo sau khi Lead tích hợp (bật `strict`, sửa Part 1–4,
dọn asset, viết lại README). Đây là chốt chặn trước khi đẩy lên GitHub công khai.
Mọi kết quả dưới đây do QA tự chạy lại, **không tái sử dụng** số của lần trước.

| Lệnh | Dòng tổng kết nguyên văn | Exit |
|---|---|---|
| `npx tsc -b --force` | (không in dòng nào — sạch hoàn toàn) | 0 |
| `npx oxlint` | `Found 0 warnings and 0 errors.` — `Finished in 19ms on 56 files` | 0 |
| `npx vitest run` | `Test Files  7 passed (7)` / `Tests  195 passed (195)` | 0 |
| `node scripts/verify-core.mjs` | `Xác minh E2E trên Chrome: 50 passed, 0 failed` | 0 |
| `node scripts/verify-ui.mjs` | `Xác minh giao diện trên Chrome (QA độc lập): 28 passed, 0 failed` | 0 |
| `npx vite build` | `✓ 54 modules transformed` / `✓ built in 142ms` | 0 |
| `node scripts/screenshots.mjs` | `10/10 ảnh chụp thành công trong 8227ms` | 0 |

**Kích thước bản production:** `dist/index.html` 0.79 kB · CSS 25.36 kB (gzip 5.30 kB) ·
JS 369.26 kB (gzip 111.15 kB).

### Đối chiếu README với thực tế

| README nói | Thực tế đo được | Kết luận |
|---|---|---|
| "195 unit test" | 195 passed / 7 file | **KHỚP** |
| "50 kiểm thử E2E" | 50 passed, 0 failed | **KHỚP** |
| "28 kiểm thử giao diện" | 28 passed, 0 failed | **KHỚP** |
| "85 câu" | Đếm trong `part1..part7.ts`: 8+12+12+9+20+8+16 = 85 | **KHỚP** |
| Bảng số câu từng part (8/12/12/9/20/8/16) | Khớp từng part | **KHỚP** |
| "A=23 (27%), B=22 (26%), C=22 (26%), D=18 (21%)" | Đếm thật: A=23, B=22, C=22, D=18 | **KHỚP** |
| Ảnh `docs/screenshots/01-home.png` | Tồn tại thật, 57 818 byte, PNG hợp lệ | **KHỚP** |
| `npm run verify:core` / `verify:ui` / `shots` | Có đủ trong `package.json`, trỏ đúng file | **KHỚP** |
| "TypeScript (strict)" | `tsconfig.app.json:4` có `"strict": true` (+ `noUncheckedIndexedAccess`) | **KHỚP** |
| "Part 2 có 3 lựa chọn, part khác 4" | P2: 36/12 = 3; P1,P3–P7 đều 4 | **KHỚP** |
| "Lưu 100 phiên gần nhất" | `storage.ts:17` `HISTORY_LIMIT = 100` | **KHỚP** |
| "Thời lượng thi thử `min(59:59, max(60s, số câu × 36s))`" | `session.ts:140` `Math.min(MOCK_DEFAULT_MAX_SECONDS, Math.max(60, scaled))`, `SECONDS_PER_QUESTION = 36` | **KHỚP** |
| "hết giờ tự nộp" | `SessionPage.tsx:193` useEffect khi `timedOut` → nộp | **KHỚP** |
| "Phím `1`–`4` chọn A–D, `←` `→` chuyển câu" | `SessionPage.tsx:232–245` xử lý cả 3 loại | **KHỚP** |
| "Không thư viện UI, không thư viện router" | dependencies chỉ có `react`, `react-dom` | **KHỚP** |
| "85 câu tự viết, không lấy từ đề ETS" | Không thấy tên nguồn thương mại nào (1 match "ETS" là chữ "g**ets**" trong part3) | **KHỚP** |
| Đường dẫn file trong mục Kiến trúc (19 mục) | Tất cả tồn tại | **KHỚP** |

**Kết luận mục README: KHỚP.** Không tìm thấy con số nào trong README sai so với thực tế.

### Ảnh chụp và file rác

- `docs/screenshots/` có **10 file PNG chính thức**, tất cả hợp lệ (magic bytes `89 50 4E 47`), đều > 0 byte.
- **Đủ 10/10 ảnh đúng tên README**: `01-home`, `02-practice-select`, `03-session-practice`,
  `04-session-mock`, `05-result`, `06-review`, `07-history`, `08-settings`, `09-home-mobile`,
  `10-session-mobile`.
- **3 ảnh E2E phụ** nằm tách riêng trong `docs/screenshots/e2e/`: `home.png` (57 853 B),
  `history.png` (43 498 B), `result.png` (67 257 B) — do Lead tách ra lúc 22:40 để
  `verify-core.mjs` **không ghi đè** 10 ảnh chính thức nữa. Tất cả là PNG thật, 1440×960.
  Đây là cách tổ chức tốt; không có ảnh thừa lẫn trong thư mục chính.
- Đã mở 3 ảnh bất kỳ để kiểm tra nội dung thật: `01-home.png`, `05-result.png`,
  `10-session-mobile.png` — đều thấy giao diện thật, không trắng trơn. Ngoài ra đã cắt
  vùng nav của `01-home.png` và phóng 4× để kiểm tab active (xem mục 4.6).

### Kiểm tra file rác

| Hạng mục | Kết quả |
|---|---|
| File bắt đầu bằng `_` trong `src/` | **Không có** (các file `_audit`/`_probe`/`_risk` của lần trước đã được dọn) |
| `*.bak`, `*.tmp`, `*.orig`, `*.swp`, `*.log`, `*~` | **Không có** |
| File test tạm / probe còn sót | **Không có** |
| File test thật | 7 file, khớp 195 test: `answerKey` 3, `content` 41, `index` 7, `scoring` 40, `session` 48, `storage` 36, `time` 20 |
| Test nằm ngoài `src/` | **Không có** (`npx vitest list` xác nhận) |
| `.gitignore` che `node_modules` | **Có** |
| `.gitignore` che `dist` | **Có** (kèm `dist-ssr`, `*.local`, log, `.vscode/*`, `.idea`) |

### `docs/legacy-expense-app/` có gây lỗi build không?

- Nằm ở `docs/legacy-expense-app/`, **KHÔNG** nằm trong `src/`. Không có file `legacy|expense`
  nào trong `src/`.
- `tsconfig.app.json` có `"include": ["src"]` → `tsc` **không** biên dịch `docs/`.
- File test cũ đã được đổi đuôi thành `expenses.test.ts.txt` → không khớp glob test của
  Vitest; `npx vitest list` xác nhận **không** có test nào ngoài `src/`.
- `vite build` chỉ đi từ `index.html` → không chạm `docs/`.
- **Kết luận: an toàn, không gây lỗi build.**

