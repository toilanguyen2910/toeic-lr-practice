# TOEIC Listening & Reading — web luyện thi cá nhân

Ứng dụng web để **một người tự luyện TOEIC Listening & Reading hằng ngày**: luyện
theo từng part, thi thử có tính giờ, chấm điểm quy đổi thang 0–990, và xem giải
thích chi tiết bằng tiếng Việt cho từng câu.

Chạy hoàn toàn trong trình duyệt — không backend, không tài khoản, không phí, dữ liệu
nằm trong `localStorage` của chính máy bạn.

![Trang chủ](docs/screenshots/01-home.png)

## Tính năng

| Tính năng | Mô tả |
|---|---|
| **Luyện theo part** | Chọn bất kỳ tổ hợp trong 7 part, chọn số câu mỗi part |
| **Thi thử** | Làm liền mạch có đồng hồ đếm ngược, hết giờ tự nộp, không lộ đáp án khi đang làm |
| **Chấm điểm** | Đúng/sai/bỏ trống, tách theo part và theo kỹ năng, quy đổi thang 0–990 |
| **Giải thích** | Mỗi câu có giải thích vì sao đáp án đúng và vì sao 3 đáp án kia sai, kèm bản dịch |
| **Xem lại** | Lọc câu sai để ôn lại sau mỗi phiên |
| **Lịch sử** | Lưu 100 phiên gần nhất, theo dõi điểm tiến bộ |
| **Tiếp tục** | Đóng tab giữa chừng vẫn làm tiếp được |
| **Bàn phím** | Phím `1`–`4` chọn A–D, `←` `→` chuyển câu |

## Công nghệ

- **React 19** + **TypeScript** (strict), build bằng **Vite 8**
- **Vitest** cho unit test phần logic thuần
- **oxlint** cho lint
- **Không thư viện UI, không thư viện router** — CSS viết tay, hash router tự viết
- Bộ kiểm thử thật trên **Chrome qua Chrome DevTools Protocol** (không Playwright/Puppeteer)

## Chạy dự án

```bash
npm install
npm run dev       # http://localhost:5173
```

Các lệnh khác:

```bash
npm run build       # type-check (tsc -b) + build production
npm run lint        # oxlint
npm test            # 261 unit test
npm run verify:core # 50 kiểm thử E2E thật trên Chrome qua CDP
npm run verify:ui   # 28 kiểm thử giao diện độc lập (do QA viết)
npm run shots       # chụp 10 ảnh màn hình vào docs/screenshots/
```

> `verify:core` / `verify:ui` / `shots` tự khởi động Vite + Chrome headless rồi dọn dẹp,
> không cần mở terminal riêng. Cần Chrome cài ở đường dẫn mặc định, hoặc đặt biến
> `CHROME_PATH`.

## Kiến trúc

```
src/
  types.ts            # Hợp đồng dữ liệu: Question, Stimulus, QuestionBank, PART_META
  testids.ts          # Hợp đồng data-testid + route hash (UI và test dùng chung)
  data/
    part1..part7.ts   # Ngân hàng 425 câu, chia theo part
    index.ts          # Ghép thành FULL_BANK
    content.test.ts   # 41 test kiểm cấu trúc nội dung
    answerKey.test.ts # Chốt cứng đáp án theo NỘI DUNG (chống đổi đáp án ngầm)
  lib/
    contract.ts       # Hợp đồng API engine (Session, SessionResult, EngineApi)
    session.ts        # Tạo/trả lời/nộp phiên — hàm thuần, bất biến
    scoring.ts        # Chấm điểm + quy đổi thang điểm
    storage.ts        # localStorage, không bao giờ throw
    time.ts           # formatClock
  ui/                 # 7 màn hình React + hash router
  styles/             # CSS viết tay
scripts/
  cdp.mjs             # Bộ khung test Chrome qua CDP (tự viết, không phụ thuộc ngoài)
  verify-core.mjs     # E2E: chọn part → làm bài → nộp → xem lại → lịch sử
  verify-ui.mjs       # QA: responsive, bàn phím, trạng thái rỗng, cài đặt
  screenshots.mjs     # Chụp 10 ảnh màn hình
docs/
  PLAN.md             # Kế hoạch thi công
  QA-REPORT.md        # Báo cáo kiểm thử độc lập
  screenshots/        # Ảnh chụp thật
```

**Nguyên tắc thiết kế:** toàn bộ quy tắc nghiệp vụ nằm trong `src/lib/` dưới dạng
**hàm thuần** — không import React, không chạm DOM — nên kiểm thử được độc lập ở môi
trường Node. UI chỉ là lớp mỏng hiển thị và gọi engine. Nhờ vậy điểm số chỉ có **một
nguồn sự thật** duy nhất, không thể lệch giữa hai nơi.

## Ngân hàng câu hỏi

425 câu tự viết, không lấy từ đề của ETS:

| Part | Số câu | Nội dung |
|---|---|---|
| 1 | 20 | Mô tả tranh (có ảnh SVG minh hoạ) |
| 2 | 60 | Hỏi – đáp (3 lựa chọn) |
| 3 | 60 | 20 hội thoại × 3 câu |
| 4 | 45 | 15 bài nói × 3 câu |
| 5 | 120 | Điền từ vào câu |
| 6 | 40 | 10 đoạn văn × 4 chỗ trống |
| 7 | 80 | 20 nhóm đọc hiểu, có 10 nhóm hai đoạn |

Phân bố đáp án đúng cân bằng từng part (chênh lệch ≤ 2 câu), để không thể đoán
đúng. Ba cơ chế chặn sai sót được cài thành test vĩnh viễn: phân bố đáp án theo
part, độ dài phương án đúng không trội bất thường, và đáp án đúng không bao giờ
bị giải thích là "sai".

**Hai bộ đề:**

| Bộ | Số đề | Kích thước | Dùng khi |
|---|---|---|---|
| Luyện tập | 20 đề | 52 / 101 / 200 câu | Làm hằng ngày, có ba cỡ |
| Thi thử | 15 đề | Luôn 200 câu, 120 phút | Kiểm tra như đi thi thật |

Hai bộ dùng seed khác nhau (1001–1020 và 2001–2015) nên không đề nào trùng đề
nào. Test kiểm từng cặp đề phải khác nhau ít nhất 20 câu.

## Quy tắc nghiệp vụ

| Quy tắc | Chi tiết |
|---|---|
| Điểm mỗi phần | `round(đúng / 100 × 495)`, kẹp 0–495 |
| Tổng điểm | `nghe + đọc`, kẹp 0–990 |
| Mẫu số | 100 câu chính thức mỗi kỹ năng của đề thật, **không phải** số câu có trong phiên |
| Độ tin cậy | Luôn gắn nhãn "ước lượng" khi làm < 200 câu |
| Bỏ trống | `answers[id] === null`, khác với "không có key" |
| Lịch sử | 100 bản ghi gần nhất, có `scoringVersion` để loại bản ghi công thức cũ khỏi thống kê |
| Thời lượng thi thử | 120 phút cố định |
| Dữ liệu hỏng | `localStorage` hỏng → trả mặc định, **không làm sập app** |

## Kiểm thử

**Unit test** — 261 test, chạy ở Node, không cần trình duyệt:

```bash
npm test
```

**Kiểm thử thật trên Chrome** — mở Vite + Chrome headless, điều khiển qua CDP,
đọc DOM và `localStorage` thật:

```bash
npm run verify:core   # 59 điểm kiểm tra
npm run verify:ui     # 28 điểm kiểm tra
npm run verify:prod   # 16 điểm kiểm tra trên bản build thật
```

Không có kết quả nào trong `docs/QA-REPORT.md` được chép từ báo cáo của người khác —
QA tự chạy và tự đọc. Các giới hạn của việc kiểm thử (âm thanh, thiết bị thật, trình
duyệt khác) được ghi rõ ở mục cuối báo cáo.

## Âm thanh

102 file MP3 sinh sẵn cho toàn bộ Part 1–4, dùng giọng ElevenLabs
(`eleven_turbo_v2_5`). Hội thoại hai người trong Part 3 có hai giọng khác nhau
(Roger cho nam, Sarah cho nữ) nên nghe rõ là hai người.

Sinh lại hoặc thêm câu mới:

```bash
python scripts/generate-audio.py            # sinh phần còn thiếu
python scripts/generate-audio.py --check    # kiểm credits và số đoạn
python scripts/generate-audio.py --force    # sinh lại tất cả
```

Cần `ELEVENLABS_API_KEY` trong `.env.local` (đã bị `.gitignore` chặn). Không có key
thì script tự rơi về Google Translate TTS miễn phí.

## Giới hạn đã biết

- **Ảnh Part 1 là hình vẽ, không phải ảnh chụp.** Đủ để hiểu nội dung nhưng không
  giống đề thi thật. Muốn thay bằng ảnh chụp thì bỏ file `part1-XX.jpg` vào
  `public/images/` và sửa `imageUrl` trong `src/data/part1.ts`.
- **Điểm chỉ là ước lượng**, không phải điểm TOEIC thật. Công thức hiện tại:
  `đúng / 100 × 495` mỗi kỹ năng, coi câu không có trong phiên là chưa làm.
- Chưa có chế độ "ôn câu sai" xuyên phiên và biểu đồ tiến bộ theo tuần.

## Ghi công

Dự án được lắp ghép bởi 1 lead + 4 vai trò làm song song: nội dung (`content`),
logic (`engine`), giao diện (`ui`), kiểm thử độc lập (`qa`). Kế hoạch thi công ở
[`docs/PLAN.md`](docs/PLAN.md), kết quả kiểm thử ở [`docs/QA-REPORT.md`](docs/QA-REPORT.md).




