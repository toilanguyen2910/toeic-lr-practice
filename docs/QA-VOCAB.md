# QA TỪ VỰNG — BÁO CÁO ĐỘC LẬP

> Ngày chạy: 28/11/2026 · Trình duyệt: Chrome/158.0.8127.88 · Node 22.23.1
> Bộ kiểm: `scripts/verify-vocab.mjs` (do QA viết, không sửa `src/`)
> Kết quả thô đầy đủ: [`docs/QA-VOCAB-RUN.txt`](QA-VOCAB-RUN.txt)
> Ảnh chụp: [`docs/screenshots/`](screenshots/)

**Kết luận một dòng:** dữ liệu 600 từ sạch và engine đúng, nhưng **luồng học có 3 lỗi
mức cao** làm mất dữ liệu hoặc mất nội dung — chưa dùng được cho người thật cho tới
khi sửa xong ba lỗi đó.

---

## 1. Kết quả bộ kiểm

```
Xác minh từ vựng trên Chrome (QA độc lập): 116 passed, 14 failed
```

14 phép kiểm đỏ đến từ **12 lỗi thật** (một số lỗi bị hai phép kiểm bắt). Danh sách
theo mức độ ở mục 3. Toàn bộ log — gồm 20 từ ngẫu nhiên in ra để đọc bằng mắt — nằm
trong `docs/QA-VOCAB-RUN.txt`.

Bộ kiểm cũ (`verify-core`, `verify-ui`) vẫn xanh vì nó chỉ đo `documentElement.scrollWidth`
và đếm phần tử; nó **không** đo bảng có bị cắt, không kiểm phiên có bị ngắt giữa
đường, không kiểm ghi đè localStorage.

---

## 2. Ảnh chụp

| Ảnh | Nội dung |
|---|---|
| [study-side-by-side.png](screenshots/study-side-by-side.png) | Màn ôn, light trái / dark phải |
| [study-light.png](screenshots/study-light.png) · [study-dark.png](screenshots/study-dark.png) | Màn ôn từng theme |
| [topics-side-by-side.png](screenshots/topics-side-by-side.png) | 12 thẻ chủ đề, light / dark |
| [study-375-light.png](screenshots/study-375-light.png) · [study-375-dark.png](screenshots/study-375-dark.png) | 375px + dark cùng lúc |
| [browse-375-table-light.png](screenshots/browse-375-table-light.png) | **Bảng từ ở 375px bị cắt cột** (lỗi 3) |
| [study-empty-after-session.png](screenshots/study-empty-after-session.png) | **Hết từ đến hạn → ô rỗng thay màn tổng kết** (lỗi 2) |
| [study-truncated-session.png](screenshots/study-truncated-session.png) | **Phiên bị cắt giữa đường** (lỗi 1) |
| [study-done-light.png](screenshots/study-done-light.png) | Màn tổng kết (trường hợp bình thường) |
| [browse-no-results.png](screenshots/browse-no-results.png) | Trạng thái rỗng khi tìm `xyzabc` — đúng, không lỗi console |
| [study-longest-card.png](screenshots/study-longest-card.png) | Thẻ nội dung dài nhất (`tort`) — không tràn |
| [quiz-light.png](screenshots/quiz-light.png) | Trắc nghiệm, phản hồi đúng/sai |

---

## 3. Danh sách lỗi THẬT

### CAO

**L1. Phiên ôn bị cắt ngang khi vừa dọn hết số từ đến hạn — mất nửa phiên.**
Dựng cảnh: chủ đề `office` có 10 từ đến hạn + 40 từ hẹn xa. Màn ôn mở phiên 20 thẻ
(10 đến hạn + 10 bù từ hẹn xa — đúng thiết kế `pickDueWords`). Trả lời hết 10 thẻ đầu
thì màn hình **nhảy sang "Chưa có từ nào cần ôn"**: 10 thẻ còn lại biến mất, không có
màn tổng kết, không thông báo. Người học tưởng đã học xong.
Nguyên nhân trong `src/ui/vocab/VocabStudyPage.tsx`: khối `if (dueInScope === 0) return
<LucianEmptyState …>` nằm TRƯỚC cả nhánh `finished` lẫn nhánh đang học, mà `dueInScope`
tính lại sau mỗi câu trả lời. Đây đúng là "lỗ hổng kiểu lỗi người viết UI đã tự tìm":
engine đúng, kiểu đúng, test xanh, chỉ sai khi dùng thật.

**L2. Học xong cả chủ đề thì màn tổng kết bị ô rỗng thay thế.**
Cùng gốc với L1 nhưng ở thẻ cuối: vừa trả lời thẻ 20/20 thì `dueInScope` về 0 và ô rỗng
thắng — mất "Đã thuộc 12 · chưa thuộc 8", mất chuỗi ngày, mất lời chúc. Trường hợp này
xảy ra với mọi phiên dọn sạch phần đến hạn. Bộ kiểm xếp **L2 mức trung bình** vì chỉ
mất phần ăn mừng, không mất từ nào; **L1 mức cao** vì mất hẳn 10 thẻ chưa học.

**L3. Bảng 600 từ ở 375px bị cắt mất hai cột, không cuộn được.**
`.vocab-table` đặt `overflow: hidden` trong khi dòng có `min-width: 620px`. Đo thật:
bảng rộng **341px**, nội dung **620px**, cột "Trạng thái" kết thúc ở **621px** →
cột "Mức độ" và "Trạng thái" **không thể xem trên điện thoại, không có thanh cuộn**.
Chú thích ngay trên quy tắc đó ghi "Cuộn ngang RIÊNG cho bảng" nhưng mã dùng `hidden`
chứ không phải `auto`. Bộ kiểm cũ vẫn xanh vì nó chỉ đo `scrollWidth` của
`documentElement` — mà `overflow: hidden` thì không đẩy trang rộng ra.

**L4. Hai tab cùng mở: tab ghi sau xoá mất tiến độ của tab ghi trước.**
Tab B ghi một từ (`v-0600`) vào localStorage; tab A (mở từ trước, giữ bản đồ tiến độ cũ
trong state) bấm "Đã thuộc" rồi ghi lại **toàn bộ** bản đồ → `v-0600` biến mất, không
cảnh báo. `useVocabProgress` không nghe `storage`, không merge trước khi ghi. Đây là mất
dữ liệu thật, không phải chỉ chậm cập nhật. Kèm theo: tab đang mở không tự cập nhật khi
tab khác ghi (đo: due 600→600, mastered 0→0).

### TRUNG BÌNH

**L5. Tìm kiếm không chuẩn hoá tiếng Việt.** `"hoá đơn"` ra 2 dòng; `"hóa đơn"` (chính
tả mới) ra **0**; `"hoa don"` (không dấu) ra **0**; `"HOA DON"` ra **0**. Thiếu NFD +
bỏ dấu và gộp `oà/oá`. Người Việt gõ không dấu là chuyện hằng ngày — họ sẽ thấy "không
có từ nào" trong khi từ có trong ngân hàng.

**L6. Vuốt thẻ bị "nuốt" ở 3/8 mức tốc độ.** Quét thật trên cùng một thẻ: 80px lật,
96px lật, 108px lật, **120px KHÔNG**, **136px KHÔNG**, 150px lật, **210px KHÔNG**,
200px lật. Công thức thả trong `LucianFlipCard.finishDrag` là `start + dx*0.9 + vx*8`
rồi làm tròn về bội số 180°; quán tính đẩy tổng vượt 540° thì rơi vào bội số 360° —
mặt cũ — và cú vuốt bị bỏ. Trên điện thoại, thẻ có lúc "đứng im" mà người dùng không
hiểu vì sao.

**L7. Cài đặt số từ mỗi lượt bị bỏ qua hoàn toàn.** Đặt `sessionSize: 5` trong
localStorage → phiên vẫn 20 thẻ. Ba màn hình đều dùng hằng `DEFAULT_VOCAB_SETTINGS.sessionSize`,
không nơi nào gọi `loadVocabSettings()`. `saveVocabSettings`/`loadVocabSettings` có trong
engine nhưng không UI nào dùng — mã chết.

**L7b. Không đồng bộ giữa hai tab.** Tab B ghi tiến độ thì tab A vẫn hiện số cũ (đo:
due 600 → 600, mastered 0 → 0) dù đã phát đúng `StorageEvent`. Không nghe `storage`.

### THẤP

**L8. Không có phát âm từ.** PLAN mục 4.5 hứa dùng `SpeechSynthesis` cho từng từ + cài
đặt `speechEnabled`; trong mã từ vựng không chỗ nào gọi tới. Người học thấy phiên âm IPA
nhưng không nghe được.

**L9. Màn Cài đặt không có mục từ vựng.** PLAN mục 4.4 hứa thêm số từ mỗi lượt và bật/tắt
phát âm vào Cài đặt; màn Cài đặt không nhắc gì tới từ vựng → hai cài đặt đó không có
đường nào để người dùng đổi.

**L10. Hai từ khác nhau dùng chung một nghĩa tiếng Việt:** `quyền truy cập`
(v-0528 `permission`, v-0539 `access`); `chứng nhận` (v-0496 `certify`, v-0387
`certification`). Không sai chính tả, nhưng khi trắc nghiệm hai từ cùng chủ đề có thể ra
hai đáp án đọc như nhau — engine đã chặn trùng nghĩa khi tạo nhiễu nên không thành lỗi
chấm điểm, chỉ là dữ liệu trùng nghĩa.

**L11. Thẻ màn ôn trước đây có pseudo-element `::after` làm `scrollHeight` phình 440px
trong khung 300px.** Đã kiểm lại bằng que đo đúng (cộng chiều cao các con nằm trong luồng):
**không có thẻ nào tràn chữ** — 20/20 thẻ của phiên, và cả thẻ nội dung dài nhất (`tort`:
mặt trước 236/252px, mặt sau 199/264px). Ghi lại đây để người sau không "sửa" một lỗi
không tồn tại: `scrollHeight > clientHeight` trên `.u052-front` là **báo động giả**.

---

## 4. Những gì ĐÃ kiểm và ĐẠT (bằng chứng thật)

| Hạng mục | Bằng chứng đo được |
|---|---|
| 600 từ, 12 chủ đề × 50 | đọc thẳng 12 tệp `.ts`: 600, mỗi chủ đề 50, không trùng từ, không trùng id |
| `exampleEn` chứa đúng từ | 600/600 từ khớp (không phải "có vẻ") |
| Phiên âm đúng dạng `/…/` | 600/600 |
| Không trường rỗng | 0 trường rỗng trên 600×6 trường |
| 20 từ ngẫu nhiên đọc bằng mắt | in đủ trong log, nghĩa khớp từ, câu dịch khớp nghĩa |
| Nội dung thẻ khớp ngân hàng | 20/20 thẻ — so từng chuỗi nghĩa/định nghĩa/ví dụ/dịch |
| Tiến độ ghi + tải lại | 1 bản ghi đúng hình dạng (hộp 2, hẹn 3 ngày), tải lại còn, due 599 |
| Từ vừa thuộc không quay lại phiên kế | đúng (`invoice` → phiên kế bắt đầu `receipt`) |
| Màn tổng kết | "Đã thuộc 12 · chưa thuộc 8", 8 từ về hộp 1 — đúng |
| Bấm dồn 30 lần | 4ms, **1 bản ghi**, không long task, DOM không phình (86 → 86 node) |
| Nhịp 250ms × 20 thẻ | 343ms/thẻ, đủ 20 bản ghi, không mất thẻ |
| Tìm `xyzabc` | 0 dòng, ô rỗng hiện, có nút xoá lọc, **không lỗi console** |
| Xoá localStorage | 4 route đều không trắng trang, không lỗi |
| JSON tiến độ hỏng | không sập, coi như chưa học (due 600) |
| Đã thuộc hết 600 | ô rỗng hiện đúng, không bày nút trả lời |
| Dark mode | body lum 0.05, thẻ 0.09, icon 0.16, thanh tiến độ 0.20 — không mảng trắng; chữ/nền chênh > 0.35 |
| 375px light + dark | 8/8 tổ hợp route×theme không tràn ngang; thẻ 343px; nền vẫn tối |
| Bàn phím | Space lật; phím 2 đánh dấu; **Space trên nút khác không bị cướp**; Tab đi được |
| Trắc nghiệm | 4 lựa chọn không trùng, cả 4 đều là nghĩa có trong ngân hàng, có phản hồi đúng/sai |
| Lỗi console toàn luồng | **0** lỗi JS, **0** ngoại lệ, **0** console.error |

---

## 5. Những gì CHƯA kiểm được

1. **Thiết bị thật.** Vuốt thẻ mới mô phỏng bằng `PointerEvent` trong Chrome headless.
   Lỗi L6 cần xác nhận lại trên điện thoại thật (cùng công thức thì gần như chắc chắn
   vẫn lỗi, nhưng `pointerType: 'touch'` thật có thể khác ở `pointercancel`).
2. **Giọng đọc.** Không kiểm vì nút phát âm không tồn tại (L8).
3. **Hai tab thật.** Mô phỏng bằng `StorageEvent` + ghi thẳng localStorage, không mở
   hai tiến trình Chrome. Hành vi ghi đè đọc được từ mã nên kết luận vững, nhưng
   "tab A có tự vẽ lại không" chỉ đúng khi trình duyệt phát `storage` — mô phỏng đã
   gửi đúng sự kiện đó mà app vẫn không phản ứng, nên kết luận "không nghe storage" là chắc.
4. **Trình đọc màn hình thật.** Chỉ kiểm được `aria-label`/`aria-hidden` qua DOM.
5. **Hiệu năng trên máy yếu.** Chỉ đo được trên máy này (343ms/thẻ, không long task).
6. **`prefers-reduced-motion`.** Có nhánh CSS nhưng chưa chạy thử với cờ đó bật.
7. **600/600 từ đọc bằng mắt.** Đọc 20 từ ngẫu nhiên + 12 từ mẫu + thẻ dài nhất. Không
   ai đọc hết 600 — sai nghĩa tinh vi ở từ ít dùng vẫn có thể lọt.

---

## 6. Đánh giá thẳng

**Chưa dùng được cho người thật.** Không phải vì dữ liệu — dữ liệu tốt, sạch, khớp
từng trường. Mà vì **ba lỗi mức cao đều nằm trên đường đi chính**:

- Người học **mất nửa phiên** khi chủ đề vơi từ đến hạn (L1) — và điều này xảy ra
  thường xuyên sau vài ngày dùng, đúng lúc họ đã quen.
- Người học **không thấy màn tổng kết** khi học hết chủ đề (L2) — mất toàn bộ động lực
  "phiên xong, nghỉ ngơi".
- Người dùng điện thoại **không đọc được hai cột cuối** của bảng 600 từ (L3).

Cộng thêm mất dữ liệu khi mở hai tab (L4) — loại lỗi người dùng không bao giờ báo, chỉ
lặng lẽ mất tiến độ rồi bỏ app.

**Yếu nhất:** `VocabStudyPage.tsx` — hai lỗi cao nhất cùng nằm trong một khối `if` đặt
sai thứ tự. **Sửa nhanh nhất, lợi nhiều nhất:** đưa khối `dueInScope === 0` xuống dưới
nhánh `finished`, và chỉ dùng nó khi `words.length === 0` (tức là chưa mở phiên nào),
không dùng sau khi phiên đã chạy. Sửa L1+L2 chỉ tốn vài dòng.

**Mạnh nhất:** engine `lib/vocab.ts` và dữ liệu 600 từ. Chúng đúng như hợp đồng — kiểm
20 từ ngẫu nhiên, không một chỗ lệch; Leitner ghi đúng hộp; chống bấm đúp chắc; dark
mode và 375px sạch ở mọi màn trừ cái bảng.

**Thứ tự sửa đề nghị:** L1+L2 (một chỗ, vài dòng) → L3 (một dòng CSS: `overflow: hidden`
→ `auto`, hoặc bỏ `min-width` ở mobile) → L4 (nghe `storage` + merge trước khi ghi) →
L5 (chuẩn hoá NFD) → L6 (bỏ `vx*8` hoặc kẹp góc) → L7/L8/L9 (tính năng còn thiếu so với
kế hoạch).
