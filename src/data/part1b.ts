import type { Question, Stimulus } from '../types'

/**
 * PART 1 — bổ sung 12 câu (p1-0009 … p1-0020), nâng Part 1 lên 20 câu.
 *
 * Cùng quy ước với `part1.ts`: `audioScript` đọc lần lượt bốn phương án (A)–(D) và
 * `choices` chép lại đúng bốn câu đó; mỗi phương án kết thúc bằng đúng một dấu chấm.
 *
 * BẢNG NỘI DUNG ẢNH CẦN VẼ (team artist đối chiếu `public/images/`):
 * - part1-09.svg: hai người đứng đối diện bắt tay ngang ngực, sảnh văn phòng phía sau.
 * - part1-10.svg: người đàn ông kéo va-li có bánh đi trên vỉa hè, cửa kính khách sạn phía sau.
 * - part1-11.svg: người phụ nữ đưa thẻ cho thu ngân tại quầy tính tiền siêu thị.
 * - part1-12.svg: ba công nhân đội mũ bảo hộ đứng nhìn công trình đang xây.
 * - part1-13.svg: người đàn ông đứng bên tủ hồ sơ, tay đưa tập tài liệu vào ngăn kéo.
 * - part1-14.svg: người phụ nữ đặt đĩa và dao nĩa lên bàn ăn trong nhà hàng.
 * - part1-15.svg: người đàn ông quỳ bên máy photocopy đang mở nắp, tay cầm tua-vít.
        'Người phụ nữ đứng bên trái tấm bảng trắng, tay phải cầm bút đưa lên chỉ vào biểu đồ đường đã vẽ sẵn trên bảng, hướng về phía đồng nghiệp đang ngồi nghe, nên B đúng. ' +
 * - part1-17.svg: người đàn ông bê thùng các-tông lên sàn xe tải đang mở cửa sau.
 * - part1-18.svg: ba người ngồi trên ghế băng trong công viên, cây xanh phía sau.
 * - part1-19.svg: người đàn ông tra chìa khoá vào ổ cửa gỗ.
 * - part1-20.svg: người phụ nữ ngồi ở bàn họp, tay cầm bút ghi vào sổ tay.
 *
 * Nguyên tắc giữ nguyên: chỉ MỘT phương án tả đúng hành động thật sự được vẽ; ba phương án
 * còn lại mô tả hành động hoặc đồ vật không xuất hiện trong tranh.
 */
export const PART1B_STIMULI: Stimulus[] = [
  {
    id: 'g-p1-0009',
    part: 1,
    imageUrl: '/images/part1-09.svg',
    audioScript:
      '(A) They are shaking hands. ' +
      '(B) They are carrying boxes. ' +
      '(C) They are waiting for an elevator. ' +
      '(D) They are cleaning the floor.',
  },
  {
    id: 'g-p1-0010',
    part: 1,
    imageUrl: '/images/part1-10.svg',
    audioScript:
      '(A) He is checking in at the front desk. ' +
      '(B) He is walking with a suitcase. ' +
      '(C) He is washing a car. ' +
      '(D) He is repairing the entrance door.',
  },
  {
    id: 'g-p1-0011',
    part: 1,
    imageUrl: '/images/part1-11.svg',
    audioScript:
      '(A) She is stacking cans on a shelf. ' +
      '(B) She is pushing a shopping cart. ' +
      '(C) She is paying at the checkout counter. ' +
      '(D) She is weighing some vegetables.',
  },
  {
    id: 'g-p1-0012',
    part: 1,
    imageUrl: '/images/part1-12.svg',
    audioScript:
      '(A) They are painting the building. ' +
      '(B) They are driving a crane. ' +
      '(C) They are eating lunch outside. ' +
      '(D) They are wearing safety helmets.',
  },
  {
    id: 'g-p1-0013',
    part: 1,
    imageUrl: '/images/part1-13.svg',
    audioScript:
      '(A) He is putting files into a cabinet. ' +
      '(B) He is printing a report. ' +
      '(C) He is answering the telephone. ' +
      '(D) He is locking the office door.',
  },
  {
    id: 'g-p1-0014',
    part: 1,
    imageUrl: '/images/part1-14.svg',
    audioScript:
      '(A) She is cooking in the kitchen. ' +
      '(B) She is washing the dishes. ' +
      '(C) She is setting a table. ' +
      '(D) She is paying the bill.',
  },
  {
    id: 'g-p1-0015',
    part: 1,
    imageUrl: '/images/part1-15.svg',
    audioScript:
      '(A) He is making copies of a document. ' +
      '(B) He is carrying the machine upstairs. ' +
      '(C) He is cleaning the window. ' +
      '(D) He is repairing a photocopier.',
  },
  {
    id: 'g-p1-0016',
    part: 1,
    imageUrl: '/images/part1-16.svg',
    audioScript:
      '(A) She is turning off the lights. ' +
      '(B) She is giving a presentation. ' +
      '(C) She is moving the chairs. ' +
      '(D) She is handing out the reports.',
  },
  {
    id: 'g-p1-0017',
    part: 1,
    imageUrl: '/images/part1-17.svg',
    audioScript:
      '(A) He is loading boxes into a van. ' +
      '(B) He is driving the van. ' +
      '(C) He is closing the garage door. ' +
      '(D) He is fixing a bicycle.',
  },
  {
    id: 'g-p1-0018',
    part: 1,
    imageUrl: '/images/part1-18.svg',
    audioScript:
      '(A) They are planting trees. ' +
      '(B) They are riding bicycles. ' +
      '(C) They are sitting on benches. ' +
      '(D) They are standing in line.',
  },
  {
    id: 'g-p1-0019',
    part: 1,
    imageUrl: '/images/part1-19.svg',
    audioScript:
      '(A) He is painting the door. ' +
      '(B) He is unlocking the door. ' +
      '(C) He is knocking on the window. ' +
      '(D) He is sweeping the entrance.',
  },
  {
    id: 'g-p1-0020',
    part: 1,
    imageUrl: '/images/part1-20.svg',
    audioScript:
      '(A) She is erasing the board. ' +
      '(B) She is pouring coffee. ' +
      '(C) She is answering a phone call. ' +
      '(D) She is taking notes in a notebook.',
  },
]

export const PART1B_QUESTIONS: Question[] = [
  {
    id: 'p1-0009',
    part: 1,
    section: 'listening',
    difficulty: 2,
    tags: ['photo-description', 'present-continuous'],
    stimulusId: 'g-p1-0009',
    prompt: '',
    choices: [
      { letter: 'A', text: 'They are shaking hands.' },
      { letter: 'B', text: 'They are carrying boxes.' },
      { letter: 'C', text: 'They are waiting for an elevator.' },
      { letter: 'D', text: 'They are cleaning the floor.' },
    ],
    answer: 'A',
    explanation:
      'Hai người đứng đối diện nhau, tay phải của cả hai nắm lấy nhau ngang ngực ở giữa khung hình, nên A mô tả đúng động tác trong tranh. ' +
      'B sai vì hai tay còn lại của họ buông xuôi, trong ảnh không có thùng hàng nào. ' +
        'C sai vì trong ảnh không có thang máy nào; phía sau chỉ có cửa ra vào và cửa sổ. ' +
      'D sai vì sàn sảnh sạch, không có chổi hay cây lau nhà nào trong tranh.',
    translation: 'Họ đang bắt tay. (Đáp án A)',
  },
  {
    id: 'p1-0010',
    part: 1,
    section: 'listening',
    difficulty: 2,
    tags: ['photo-description', 'action-verb'],
    stimulusId: 'g-p1-0010',
    prompt: '',
    choices: [
      { letter: 'A', text: 'He is checking in at the front desk.' },
      { letter: 'B', text: 'He is walking with a suitcase.' },
      { letter: 'C', text: 'He is washing a car.' },
      { letter: 'D', text: 'He is repairing the entrance door.' },
    ],
    answer: 'B',
    explanation:
      'Người đàn ông đi bộ trên vỉa hè, một tay kéo chiếc va-li có bánh lăn theo sau, nên B mô tả đúng điều nhìn thấy. ' +
      'A sai vì anh ta đứng ngoài trời, cách xa quầy lễ tân và không đứng trước quầy. ' +
      'C sai vì trong ảnh không có ô tô, xô nước hay bọt xà phòng nào. ' +
      'D sai vì hai tay anh ta đang giữ cán va-li, cửa kính phía sau đã đóng sẵn và không có dụng cụ sửa chữa.',
    translation: 'Anh ấy đang đi bộ cùng một chiếc va-li. (Đáp án B)',
  },
  {
    id: 'p1-0011',
    part: 1,
    section: 'listening',
    difficulty: 3,
    tags: ['photo-description', 'present-continuous'],
    stimulusId: 'g-p1-0011',
    prompt: '',
    choices: [
      { letter: 'A', text: 'She is stacking cans on a shelf.' },
      { letter: 'B', text: 'She is pushing a shopping cart.' },
      { letter: 'C', text: 'She is paying at the checkout counter.' },
      { letter: 'D', text: 'She is weighing some vegetables.' },
    ],
    answer: 'C',
    explanation:
      'Người phụ nữ đứng trước quầy tính tiền và đưa chiếc thẻ cho thu ngân, trên quầy có máy quét mã, nên C đúng. ' +
      'A sai vì kệ hàng phía sau đã xếp sẵn và cô ấy quay lưng về phía kệ, không cầm hộp nào. ' +
      'B sai vì chiếc xe đẩy đứng yên bên cạnh, hai tay cô ấy đang đưa thẻ chứ không nắm tay đẩy. ' +
      'D sai vì không có cân điện tử nào trên quầy và không có túi rau nào được đặt lên cân.',
    translation: 'Cô ấy đang thanh toán tại quầy tính tiền. (Đáp án C)',
  },
  {
    id: 'p1-0012',
    part: 1,
    section: 'listening',
    difficulty: 4,
    tags: ['photo-description', 'action-verb'],
    stimulusId: 'g-p1-0012',
    prompt: '',
    choices: [
      { letter: 'A', text: 'They are painting the building.' },
      { letter: 'B', text: 'They are driving a crane.' },
      { letter: 'C', text: 'They are eating lunch outside.' },
      { letter: 'D', text: 'They are wearing safety helmets.' },
    ],
    answer: 'D',
    explanation:
      'Cả ba người đều đội mũ bảo hộ màu vàng trên đầu, và mũ là chi tiết rõ nhất trong khung hình, nên D mô tả đúng. ' +
      'A sai vì không có con lăn sơn, xô sơn hay giàn giáo nào đang được dùng. ' +
        'B sai vì trong ảnh không có cần cẩu hay xe cộ nào, chỉ có tường và cửa sổ. ' +
      'C sai vì không ai cầm hộp cơm hay ngồi xuống ăn; cả ba đang đứng nhìn công trình.',
    translation: 'Họ đang đội mũ bảo hộ lao động. (Đáp án D)',
  },
  {
    id: 'p1-0013',
    part: 1,
    section: 'listening',
    difficulty: 3,
    tags: ['photo-description', 'present-continuous'],
    stimulusId: 'g-p1-0013',
    prompt: '',
    choices: [
      { letter: 'A', text: 'He is putting files into a cabinet.' },
      { letter: 'B', text: 'He is printing a report.' },
      { letter: 'C', text: 'He is answering the telephone.' },
      { letter: 'D', text: 'He is locking the office door.' },
    ],
    answer: 'A',
    explanation:
      'Người đàn ông đứng bên tủ hồ sơ đã mở ngăn kéo, tay đưa tập tài liệu vào trong, nên A đúng. ' +
        'B sai vì trong ảnh không có máy in nào; sau lưng anh ta chỉ có cửa sổ. ' +
        'C sai vì không có điện thoại trong ảnh, và tay còn lại của anh ta buông xuôi. ' +
        'D sai vì không có cửa phòng nào trong ảnh và tay anh ta không cầm chìa khoá.',
    translation: 'Anh ấy đang cất tài liệu vào tủ hồ sơ. (Đáp án A)',
  },
  {
    id: 'p1-0014',
    part: 1,
    section: 'listening',
    difficulty: 2,
    tags: ['photo-description', 'present-continuous'],
    stimulusId: 'g-p1-0014',
    prompt: '',
    choices: [
      { letter: 'A', text: 'She is cooking in the kitchen.' },
      { letter: 'B', text: 'She is washing the dishes.' },
      { letter: 'C', text: 'She is setting a table.' },
      { letter: 'D', text: 'She is paying the bill.' },
    ],
    answer: 'C',
    explanation:
        'Người phụ nữ đứng cạnh bàn ăn đã trải khăn trắng, tay đưa đĩa và ly đặt lên mặt bàn, nên C mô tả đúng. ' +
      'A sai vì cô ấy đứng ở khu vực bàn khách, cách xa quầy bếp và không cầm xoong chảo. ' +
      'B sai vì không có bồn rửa hay chồng bát bẩn nào trong ảnh. ' +
      'D sai vì trên bàn không có hoá đơn hay ví tiền, tay cô ấy đang cầm đĩa.',
    translation: 'Cô ấy đang dọn bàn ăn. (Đáp án C)',
  },
  {
    id: 'p1-0015',
    part: 1,
    section: 'listening',
    difficulty: 3,
    tags: ['photo-description', 'action-verb'],
    stimulusId: 'g-p1-0015',
    prompt: '',
    choices: [
      { letter: 'A', text: 'He is making copies of a document.' },
      { letter: 'B', text: 'He is carrying the machine upstairs.' },
      { letter: 'C', text: 'He is cleaning the window.' },
      { letter: 'D', text: 'He is repairing a photocopier.' },
    ],
    answer: 'D',
    explanation:
      'Người đàn ông quỳ bên máy photocopy, nắp máy mở bật ra và trên sàn có hộp dụng cụ cùng chiếc tua-vít trên tay, nên D đúng. ' +
      'A sai vì khay giấy đang trống và không có tờ nào chạy ra; anh ta đang tháo máy chứ không sao chụp. ' +
      'B sai vì chiếc máy vẫn đứng nguyên trên sàn, không được nhấc lên. ' +
      'C sai vì không có khăn lau hay bình xịt nào, cửa kính phía sau để nguyên.',
    translation: 'Anh ấy đang sửa máy photocopy. (Đáp án D)',
  },
  {
    id: 'p1-0016',
    part: 1,
    section: 'listening',
    difficulty: 4,
    tags: ['photo-description', 'present-continuous'],
    stimulusId: 'g-p1-0016',
    prompt: '',
    choices: [
      { letter: 'A', text: 'She is turning off the lights.' },
      { letter: 'B', text: 'She is giving a presentation.' },
      { letter: 'C', text: 'She is moving the chairs.' },
      { letter: 'D', text: 'She is handing out the reports.' },
    ],
    answer: 'B',
    explanation:
        'Người phụ nữ đứng bên trái tấm bảng trắng, tay phải cầm bút đưa lên chỉ vào biểu đồ đường đã vẽ sẵn trên bảng, hướng về phía đồng nghiệp đang ngồi nghe, nên B đúng. ' +
        'A sai vì tay cô ấy đang cầm bút chỉ lên bảng, không với tới công tắc đèn nào. ' +
      'C sai vì tất cả ghế đều đã có người ngồi và không ai kê ghế. ' +
        'D sai vì tay cô ấy cầm bút, không cầm tập tài liệu nào; giấy tờ nằm sẵn trên bàn.',
    translation: 'Cô ấy đang thuyết trình. (Đáp án B)',
  },
  {
    id: 'p1-0017',
    part: 1,
    section: 'listening',
    difficulty: 2,
    tags: ['photo-description', 'action-verb'],
    stimulusId: 'g-p1-0017',
    prompt: '',
    choices: [
      { letter: 'A', text: 'He is loading boxes into a van.' },
      { letter: 'B', text: 'He is driving the van.' },
      { letter: 'C', text: 'He is closing the garage door.' },
      { letter: 'D', text: 'He is fixing a bicycle.' },
    ],
    answer: 'A',
    explanation:
      'Người đàn ông bê thùng các-tông đưa lên sàn xe tải đang mở cửa sau, nên A mô tả đúng hành động. ' +
      'B sai vì anh ta đứng dưới đất sau xe, không ngồi trong buồng lái. ' +
      'C sai vì cửa cuốn ga-ra đang mở và không ai chạm vào tay kéo. ' +
      'D sai vì trong ảnh không có xe đạp hay dụng cụ sửa xe nào.',
    translation: 'Anh ấy đang chất thùng hàng lên xe tải. (Đáp án A)',
  },
  {
    id: 'p1-0018',
    part: 1,
    section: 'listening',
    difficulty: 1,
    tags: ['photo-description', 'present-continuous'],
    stimulusId: 'g-p1-0018',
    prompt: '',
    choices: [
      { letter: 'A', text: 'They are planting trees.' },
      { letter: 'B', text: 'They are riding bicycles.' },
      { letter: 'C', text: 'They are sitting on benches.' },
      { letter: 'D', text: 'They are standing in line.' },
    ],
    answer: 'C',
    explanation:
        'Hai người ngồi cạnh nhau trên ghế băng gỗ trong công viên, nên C đúng. ' +
      'A sai vì cây đã trồng sẵn thành hàng, không ai cầm xẻng hay bình tưới. ' +
      'B sai vì không có chiếc xe đạp nào trong ảnh. ' +
        'D sai vì không có hàng người nối tiếp, cả hai đang ngồi chứ không đứng.',
    translation: 'Họ đang ngồi trên ghế băng. (Đáp án C)',
  },
  {
    id: 'p1-0019',
    part: 1,
    section: 'listening',
    difficulty: 2,
    tags: ['photo-description', 'action-verb'],
    stimulusId: 'g-p1-0019',
    prompt: '',
    choices: [
      { letter: 'A', text: 'He is painting the door.' },
      { letter: 'B', text: 'He is unlocking the door.' },
      { letter: 'C', text: 'He is knocking on the window.' },
      { letter: 'D', text: 'He is sweeping the entrance.' },
    ],
    answer: 'B',
    explanation:
      'Người đàn ông đứng trước cửa gỗ, tay phải tra chìa vào ổ khoá ngang tầm eo, nên B đúng. ' +
      'A sai vì không có thùng sơn hay cọ nào, mặt cửa vẫn một màu phẳng. ' +
      'C sai vì tay anh ta đặt ở ổ khoá chứ không gõ lên ô kính bên cạnh. ' +
      'D sai vì không có chổi quét nào và sàn trước cửa sạch.',
    translation: 'Anh ấy đang mở khoá cửa. (Đáp án B)',
  },
  {
    id: 'p1-0020',
    part: 1,
    section: 'listening',
    difficulty: 4,
    tags: ['photo-description', 'present-continuous'],
    stimulusId: 'g-p1-0020',
    prompt: '',
    choices: [
      { letter: 'A', text: 'She is erasing the board.' },
      { letter: 'B', text: 'She is pouring coffee.' },
      { letter: 'C', text: 'She is answering a phone call.' },
      { letter: 'D', text: 'She is taking notes in a notebook.' },
    ],
    answer: 'D',
    explanation:
      'Người phụ nữ ngồi ở bàn họp, tay phải cầm bút ghi vào cuốn sổ đang mở trước mặt, nên D đúng. ' +
      'A sai vì tấm bảng trắng ở sau đã có sẵn nội dung, cô ấy ngồi quay lưng lại và không cầm khăn lau. ' +
      'B sai vì bình cà phê đặt trên bàn, không ai cầm rót. ' +
      'C sai vì điện thoại nằm úp trên bàn và hai tay cô ấy đều ở trên sổ.',
    translation: 'Cô ấy đang ghi chép vào sổ tay. (Đáp án D)',
  },
]

