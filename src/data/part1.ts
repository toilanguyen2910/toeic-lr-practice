import type { Question, Stimulus } from '../types'
import { PART1B_QUESTIONS, PART1B_STIMULI } from './part1b'

/**
 * PART 1 — Mô tả tranh (20 câu, mỗi câu một tranh riêng).
 *
 * Quy ước nội dung: `audioScript` đọc lần lượt 4 phương án (A)–(D); `choices` chép
 * lại đúng 4 câu đó. Ảnh tương ứng nằm ở `public/images/part1-XX.svg` do team UI vẽ.
 *
 * BẢNG ĐỐI CHIẾU ẢNH — đọc trực tiếp từ `aria-label` và cấu trúc của từng file SVG
 * trong `public/images/`. Đáp án đúng của mỗi câu CHỈ dựa trên những gì thực sự được vẽ:
 * - part1-01.svg: cửa sổ nền, bàn, màn hình, bàn phím, người phụ nữ, ghế
 *                → người phụ nữ ngồi gõ máy tính tại bàn làm việc.
 * - part1-02.svg: tường gạch, xe đạp, người đàn ông, hộp dụng cụ
 *                → người đàn ông đứng cạnh xe đạp, tay đặt ở bánh sau, hộp dụng cụ dưới đất.
 * - part1-03.svg: bảng trắng, bàn họp, ba người, giấy tờ trên bàn
 *                → ba người ngồi quanh bàn họp, giấy tờ để trước mặt.
 * - part1-04.svg: quầy, kệ sau, người phụ nữ, điện thoại trên tay, tay kia đặt trên quầy
 *                → người phụ nữ nghe điện thoại tại quầy, tay kia đặt trên mặt quầy.
 * - part1-05.svg: toà nhà kho, xe tải, người đàn ông bê thùng
 *                → người đàn ông đứng giữa, bê thùng các-tông trước bụng; kho bên trái, xe tải bên phải.
 *                  LƯU Ý: hình KHÔNG thể hiện chiều đi, nên đáp án cố ý trung tính
 *                  ("carrying a box near a truck") thay vì loading/unloading.
 * - part1-06.svg: cửa sổ lớn, chậu cây lớn, người phụ nữ, bình tưới
 *                → người phụ nữ cầm bình tưới, chĩa về phía chậu cây.
 * - part1-07.svg: bảng trắng lớn, chân bảng, người đàn ông
 *                → người đàn ông giơ bút viết lên bảng trắng đã có sẵn nội dung.
 * - part1-08.svg: quầy cà phê, máy pha cà phê, cốc, hai người, sàn gạch
 *                → hai người đứng CẠNH NHAU trước quầy, mặt hướng về phía quầy.
 *                  LƯU Ý: hình KHÔNG vẽ hàng người nối tiếp, nên đáp án cố ý trung tính
 *                  ("standing at the counter") thay vì "waiting in line".
 *
 * Nguyên tắc viết phương án nhiễu (giống đề thật): mỗi câu chỉ có MỘT phương án tả đúng
 * hành động trong tranh; ba phương án còn lại mô tả hành động hoặc đồ vật KHÔNG được vẽ
 * trong bức ảnh đó. Không dùng chi tiết không có trong tranh để làm đáp án đúng.
 */
const PART1_BASE_STIMULI: Stimulus[] = [
  {
    id: 'g-p1-0001',
    part: 1,
    imageUrl: '/images/part1-01.svg',
    audioScript:
      '(A) She is typing on a keyboard. ' +
      '(B) She is answering a phone call. ' +
      '(C) She is opening a window. ' +
      '(D) She is carrying a box.',
  },
  {
    id: 'g-p1-0002',
    part: 1,
    imageUrl: '/images/part1-02.svg',
    audioScript:
      '(A) He is riding a bicycle. ' +
      '(B) He is washing a car. ' +
      '(C) He is repairing a bicycle. ' +
      '(D) He is painting a wall.',
  },
  {
    id: 'g-p1-0003',
    part: 1,
    imageUrl: '/images/part1-03.svg',
    audioScript:
      '(A) They are standing in line at a counter. ' +
      '(B) They are seated around a meeting table. ' +
      '(C) They are writing on the whiteboard. ' +
      '(D) They are carrying chairs into the room.',
  },
  {
    id: 'g-p1-0004',
    part: 1,
    imageUrl: '/images/part1-04.svg',
    audioScript:
      '(A) She is writing in a register. ' +
      '(B) She is arranging items on the shelf. ' +
      '(C) She is opening a drawer. ' +
      '(D) She is talking on the phone.',
  },
  {
    id: 'g-p1-0005',
    part: 1,
    imageUrl: '/images/part1-05.svg',
    audioScript:
      '(A) He is carrying a box near a truck. ' +
      '(B) He is driving the truck. ' +
      '(C) He is painting the warehouse. ' +
      '(D) He is opening a crate.',
  },
  {
    id: 'g-p1-0006',
    part: 1,
    imageUrl: '/images/part1-06.svg',
    audioScript:
      '(A) She is opening the window. ' +
      '(B) She is sweeping the floor. ' +
      '(C) She is watering the plants. ' +
      '(D) She is moving a plant pot.',
  },
  {
    id: 'g-p1-0007',
    part: 1,
    imageUrl: '/images/part1-07.svg',
    audioScript:
      '(A) He is erasing the whiteboard. ' +
      '(B) He is writing on the whiteboard. ' +
      '(C) He is folding the chairs. ' +
      '(D) He is closing the blinds.',
  },
  {
    id: 'g-p1-0008',
    part: 1,
    imageUrl: '/images/part1-08.svg',
    audioScript:
      '(A) They are wiping the counter. ' +
      '(B) They are carrying cups. ' +
      '(C) They are repairing the coffee machine. ' +
      '(D) They are standing at the counter.',
  },
]

const PART1_BASE_QUESTIONS: Question[] = [
  {
    id: 'p1-0001',
    part: 1,
    section: 'listening',
    difficulty: 1,
    tags: ['photo-description', 'present-continuous'],
    stimulusId: 'g-p1-0001',
    prompt: '',
    choices: [
      { letter: 'A', text: 'She is typing on a keyboard.' },
      { letter: 'B', text: 'She is answering a phone call.' },
      { letter: 'C', text: 'She is opening a window.' },
      { letter: 'D', text: 'She is carrying a box.' },
    ],
    answer: 'A',
    explanation:
      'Ảnh có bàn làm việc, màn hình và bàn phím trắng ngay trước mặt người phụ nữ; hai tay cô ấy đặt trên bàn phím ' +
      'nên A ("She is typing on a keyboard") đúng. ' +
      'B sai vì trong ảnh không hề có điện thoại — không có vật nào được đưa lên tai. ' +
      'C sai vì cửa sổ nằm ở phía sau và đang đóng, cô ấy ngồi quay lưng lại và không chạm vào cửa. ' +
      'D sai vì không có thùng hàng nào trong ảnh.',
    translation: 'Cô ấy đang gõ bàn phím. (Đáp án A)',
  },
  {
    id: 'p1-0002',
    part: 1,
    section: 'listening',
    difficulty: 2,
    tags: ['photo-description', 'action-verb'],
    stimulusId: 'g-p1-0002',
    prompt: '',
    choices: [
      { letter: 'A', text: 'He is riding a bicycle.' },
      { letter: 'B', text: 'He is washing a car.' },
      { letter: 'C', text: 'He is repairing a bicycle.' },
      { letter: 'D', text: 'He is painting a wall.' },
    ],
    answer: 'C',
    explanation:
      'Ảnh có chiếc xe đạp dựng cạnh người đàn ông; anh ta đứng bên dưới đất, tay đưa về phía bánh sau, ' +
      'và hộp dụng cụ màu đỏ đặt ngay cạnh chân — đúng cảnh sửa xe nên C đúng. ' +
      'A sai vì anh ta đứng bên cạnh xe chứ không ngồi trên yên và không cầm ghi-đông. ' +
      'B sai vì trong ảnh không có ô tô nào, chỉ có xe đạp. ' +
      'D sai vì không có con lăn sơn, xô sơn hay cọ nào; bức tường gạch phía sau để trơn, không ai sơn.',
    translation: 'Anh ấy đang sửa xe đạp. (Đáp án C)',
  },
  {
    id: 'p1-0003',
    part: 1,
    section: 'listening',
    difficulty: 2,
    tags: ['photo-description', 'present-continuous'],
    stimulusId: 'g-p1-0003',
    prompt: '',
    choices: [
      { letter: 'A', text: 'They are standing in line at a counter.' },
      { letter: 'B', text: 'They are seated around a meeting table.' },
      { letter: 'C', text: 'They are writing on the whiteboard.' },
      { letter: 'D', text: 'They are carrying chairs into the room.' },
    ],
    answer: 'B',
    explanation:
      'Ảnh có chiếc bàn họp hình bầu dục ở giữa, ba người ngồi quanh bàn và giấy tờ trắng đặt ngay trước mặt họ ' +
      '→ B đúng. ' +
      'A sai vì không có quầy nào và ba người đang ngồi chứ không xếp hàng đứng. ' +
      'C sai vì bảng trắng phía sau đã có sẵn các dòng kẻ, không ai cầm bút và không ai quay về phía bảng. ' +
      'D sai vì trong ảnh không có chiếc ghế nào được bê, cũng không có ai đang di chuyển.',
    translation: 'Họ đang ngồi quanh một chiếc bàn họp. (Đáp án B)',
  },
  {
    id: 'p1-0004',
    part: 1,
    section: 'listening',
    difficulty: 3,
    tags: ['photo-description', 'present-continuous'],
    stimulusId: 'g-p1-0004',
    prompt: '',
    choices: [
      { letter: 'A', text: 'She is writing in a register.' },
      { letter: 'B', text: 'She is arranging items on the shelf.' },
      { letter: 'C', text: 'She is opening a drawer.' },
      { letter: 'D', text: 'She is talking on the phone.' },
    ],
    answer: 'D',
    explanation:
      'Trong ảnh, người phụ nữ đứng sau quầy lễ tân, một tay cầm chiếc điện thoại đưa lên sát tai, ' +
      'tay kia đặt trên mặt quầy → D đúng. ' +
      'A sai vì tay còn lại của cô ấy đặt phẳng trên quầy, không cầm bút và không có quyển sổ nào. ' +
      'B sai vì kệ phía sau đã xếp sẵn các gáy sách thẳng hàng, cô ấy quay lưng về phía kệ và không chạm vào chúng. ' +
      'C sai vì không có ngăn kéo nào được vẽ trong ảnh.',
    translation: 'Cô ấy đang nói chuyện điện thoại. (Đáp án D)',
  },
  {
    id: 'p1-0005',
    part: 1,
    section: 'listening',
    difficulty: 3,
    tags: ['photo-description', 'action-verb'],
    stimulusId: 'g-p1-0005',
    prompt: '',
    choices: [
      { letter: 'A', text: 'He is carrying a box near a truck.' },
      { letter: 'B', text: 'He is driving the truck.' },
      { letter: 'C', text: 'He is painting the warehouse.' },
      { letter: 'D', text: 'He is opening a crate.' },
    ],
    answer: 'A',
    explanation:
      'Trong ảnh, người đàn ông đứng ở giữa, bê một chiếc thùng các-tông bằng hai tay ngay trước bụng; ' +
      'bên trái là toà nhà kho, bên phải là chiếc xe tải đang đỗ — A ("He is carrying a box near a truck") ' +
      'mô tả đúng điều nhìn thấy, không cần suy đoán hướng đi. ' +
      'B sai vì anh ta đứng dưới đất bên ngoài xe, không ngồi trong buồng lái. ' +
      'C sai vì không có sơn, cọ hay thang nào trong ảnh. ' +
      'D sai vì chiếc thùng đang được bê trọn trong hai tay, không có nắp nào được mở ra.',
    translation: 'Anh ấy đang bê một chiếc thùng ở gần xe tải. (Đáp án A)',
  },
  {
    id: 'p1-0006',
    part: 1,
    section: 'listening',
    difficulty: 2,
    tags: ['photo-description', 'present-continuous'],
    stimulusId: 'g-p1-0006',
    prompt: '',
    choices: [
      { letter: 'A', text: 'She is opening the window.' },
      { letter: 'B', text: 'She is sweeping the floor.' },
      { letter: 'C', text: 'She is watering the plants.' },
      { letter: 'D', text: 'She is moving a plant pot.' },
    ],
    answer: 'C',
    explanation:
      'Người phụ nữ cầm chiếc bình tưới màu xanh, tay chĩa vòi về phía chậu cây lớn có lá xanh bên cạnh → C đúng. ' +
      'A sai vì cửa sổ lớn phía sau đang đóng và cô ấy đứng quay lưng lại, không chạm vào cửa. ' +
      'B sai vì trong ảnh không có chổi hay cây lau nhà nào. ' +
      'D sai vì chậu cây vẫn đứng yên trên sàn; cô ấy tưới cây chứ không nhấc chậu lên.',
    translation: 'Cô ấy đang tưới cây. (Đáp án C)',
  },
  {
    id: 'p1-0007',
    part: 1,
    section: 'listening',
    difficulty: 2,
    tags: ['photo-description', 'present-continuous'],
    stimulusId: 'g-p1-0007',
    prompt: '',
    choices: [
      { letter: 'A', text: 'He is erasing the whiteboard.' },
      { letter: 'B', text: 'He is writing on the whiteboard.' },
      { letter: 'C', text: 'He is folding the chairs.' },
      { letter: 'D', text: 'He is closing the blinds.' },
    ],
    answer: 'B',
    explanation:
      'Người đàn ông đứng bên trái tấm bảng trắng lớn, tay giơ cao cầm chiếc bút và hướng về mặt bảng — ' +
      'trên bảng đã có các dòng kẻ và một biểu đồ → B đúng. ' +
      'A sai vì vật trên tay anh ta là bút viết, không phải khăn lau hay cục tẩy, và các dòng chữ vẫn còn nguyên. ' +
      'C sai vì trong ảnh hoàn toàn không có chiếc ghế nào. ' +
      'D sai vì không có rèm hay mành che nào được vẽ.',
    translation: 'Anh ấy đang viết lên bảng trắng. (Đáp án B)',
  },
  {
    id: 'p1-0008',
    part: 1,
    section: 'listening',
    difficulty: 3,
    tags: ['photo-description', 'present-continuous'],
    stimulusId: 'g-p1-0008',
    prompt: '',
    choices: [
      { letter: 'A', text: 'They are wiping the counter.' },
      { letter: 'B', text: 'They are carrying cups.' },
      { letter: 'C', text: 'They are repairing the coffee machine.' },
      { letter: 'D', text: 'They are standing at the counter.' },
    ],
    answer: 'D',
    explanation:
      'Hai người đứng cạnh nhau ngay trước quầy cà phê; trên quầy có máy pha cà phê và một chiếc cốc — ' +
      'D ("They are standing at the counter") chỉ mô tả tư thế và vị trí nhìn thấy rõ trong ảnh. ' +
      'A sai vì tay cả hai người đều buông xuôi, không ai cầm khăn hay cúi xuống lau mặt quầy. ' +
      'B sai vì chiếc cốc duy nhất trong ảnh đang đứng trên mặt quầy, không ai cầm nó trên tay. ' +
      'C sai vì máy pha cà phê còn nguyên vẹn và không có dụng cụ sửa chữa nào trong ảnh.',
    translation: 'Họ đang đứng ở quầy. (Đáp án D)',
  },
]

// ---- Nối phần mở rộng (p1-0009 … p1-0020) ----
export const PART1_STIMULI: Stimulus[] = [...PART1_BASE_STIMULI, ...PART1B_STIMULI]
export const PART1_QUESTIONS: Question[] = [...PART1_BASE_QUESTIONS, ...PART1B_QUESTIONS]