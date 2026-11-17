import type { Question, Stimulus } from '../types'
import { PART4B_QUESTIONS, PART4B_STIMULI } from './part4b'

/**
 * PART 4 — Bài nói ngắn (3 nhóm × 3 câu = 9 câu).
 *
 * Mỗi `audioScript` là một bài nói một người: thông báo nội bộ, tin nhắn thoại,
 * và một đoạn quảng cáo/giới thiệu dịch vụ. Ba câu hỏi mỗi nhóm hỏi mục đích,
 * chi tiết, rồi suy luận.
 */
const PART4_BASE_STIMULI: Stimulus[] = [
  {
    id: 'g-p4-0001',
    part: 4,
    audioScript:
      'Attention, all staff. This is a reminder from the facilities office. ' +
      'The parking garage on level B2 will be closed from Monday through Wednesday next week ' +
      'while the ventilation system is replaced. Employees who normally park there should use the ' +
      'lot on Mercer Street, which is about a five-minute walk from the main entrance. ' +
      "You'll need to show your staff identification card at the gate. " +
      "If you're expecting a delivery during those three days, please notify the mailroom so that " +
      'couriers can be directed to the loading dock rather than the garage. ' +
      'We apologize for the inconvenience and expect the garage to reopen on Thursday morning.',
  },
  {
    id: 'g-p4-0002',
    part: 4,
    audioScript:
      'Hi, this is Karen from the Crestview Hotel calling for Mr. Yamada. ' +
      "I'm confirming the arrangements for your department meeting on the fourteenth. " +
      "We've reserved the Willow Room for twenty people from nine in the morning until four in the afternoon. " +
      "The room comes with a projector and a screen, but I'm afraid the wireless microphone you asked about " +
      'is not available that day. We can provide a wired microphone instead, or you may bring your own. ' +
      'Also, the caterer needs a final count of guests by Wednesday at noon. ' +
      'Please call me back at extension 214 to let me know your choice. ' +
      'Thank you, and we look forward to seeing you.',
  },
  {
    id: 'g-p4-0003',
    part: 4,
    audioScript:
      'Welcome to the Riverside Community Library. Before you begin browsing, here is some information ' +
      'about our updated services. Starting this month, the library is open until nine in the evening ' +
      'on weekdays, three hours later than before. ' +
      "The second floor's been converted into a quiet study area, and the group meeting rooms on the " +
      'third floor can now be reserved online up to one week in advance. ' +
      'Our book-drop box outside the main entrance is available twenty-four hours a day, so you no longer ' +
      'need to wait for opening hours to return items. ' +
      'Finally, the children\'s reading hour has moved from Saturday morning to Sunday afternoon at two o\'clock. ' +
      'A printed schedule is available at the front desk.',
  },
]

const PART4_BASE_QUESTIONS: Question[] = [
  // ---------- Nhóm 1: thông báo nội bộ về bãi đỗ xe ----------
  {
    id: 'p4-0001',
    part: 4,
    section: 'listening',
    difficulty: 2,
    tags: ['main-topic', 'notice'],
    stimulusId: 'g-p4-0001',
    prompt: 'What is the purpose of the announcement?',
    choices: [
      { letter: 'A', text: 'To introduce a new facilities manager' },
      { letter: 'B', text: 'To announce the opening of a new garage' },
      { letter: 'C', text: 'To remind staff to renew their identification cards' },
      { letter: 'D', text: 'To explain a temporary change to parking arrangements' },
    ],
    answer: 'D',
    explanation:
      'Thông báo nói bãi đỗ xe tầng B2 sẽ đóng cửa ba ngày để thay hệ thống thông gió và hướng dẫn nhân viên ' +
      'dùng bãi trên phố Mercer — đó là thay đổi tạm thời về chỗ đỗ xe, nên D đúng. ' +
      'A sai vì không ai được giới thiệu là quản lý mới. ' +
      'B sai vì bãi B2 đóng cửa chứ không mở bãi mới. ' +
      'C sai vì thẻ nhân viên chỉ được nhắc để quẹt ở cổng, không phải yêu cầu gia hạn.',
    translation:
      'Mục đích của thông báo là gì? — Giải thích một thay đổi tạm thời về việc sắp xếp chỗ đỗ xe. ' +
      '(Bãi đỗ tầng B2 đóng cửa ba ngày để thay hệ thống thông gió.)',
  },
  {
    id: 'p4-0002',
    part: 4,
    section: 'listening',
    difficulty: 3,
    tags: ['detail', 'location'],
    stimulusId: 'g-p4-0001',
    prompt: 'Where should employees park during the closure?',
    choices: [
      { letter: 'A', text: 'At the loading dock' },
      { letter: 'B', text: 'In the mailroom parking area' },
      { letter: 'C', text: 'On level B1 of the same building' },
      { letter: 'D', text: 'In the lot on Mercer Street' },
    ],
    answer: 'D',
    explanation:
      'Thông báo nói rõ: "Employees who normally park there should use the lot on Mercer Street" — nên D đúng. ' +
      'C sai vì không có bãi B1 nào được nhắc; chỉ có B2 đóng cửa. ' +
      'A sai vì loading dock (bến bốc dỡ hàng) dành cho xe giao hàng, không phải chỗ đỗ xe của nhân viên. ' +
      'B sai vì mailroom (phòng thư tín) là nơi cần được thông báo về đơn hàng, không phải bãi đỗ xe.',
    translation:
      'Nhân viên nên đỗ xe ở đâu trong thời gian bãi đóng cửa? — Ở bãi trên phố Mercer.',
  },
  {
    id: 'p4-0003',
    part: 4,
    section: 'listening',
    difficulty: 3,
    tags: ['inference', 'procedural'],
    stimulusId: 'g-p4-0001',
    prompt: 'What are employees asked to do if they expect a delivery?',
    choices: [
      { letter: 'A', text: 'Meet the courier in the parking garage' },
      { letter: 'B', text: 'Pick up the package at the main entrance' },
      { letter: 'C', text: 'Tell the mailroom so couriers go to the loading dock' },
      { letter: 'D', text: 'Reschedule the delivery for the following week' },
    ],
    answer: 'C',
    explanation:
      'Thông báo nói: "please notify the mailroom so that couriers can be directed to the loading dock" — ' +
      'tức báo cho phòng thư tín để xe giao hàng được hướng dẫn tới bến bốc dỡ, nên C đúng. ' +
      'B sai vì không ai được yêu cầu nhận hàng ở cổng chính. ' +
      'D sai vì không có việc dời đơn hàng sang tuần sau. ' +
      'A sai vì bãi xe đang đóng cửa — đó chính là lý do phải đổi hướng giao hàng.',
    translation:
      'Nhân viên được yêu cầu làm gì nếu có đơn hàng sắp tới? — Báo cho phòng thư tín để hướng dẫn nhân viên giao hàng tới bến bốc dỡ.',
  },

  // ---------- Nhóm 2: tin nhắn thoại xác nhận đặt phòng họp ----------
  {
    id: 'p4-0004',
    part: 4,
    section: 'listening',
    difficulty: 2,
    tags: ['main-topic', 'phone-message'],
    stimulusId: 'g-p4-0002',
    prompt: 'Why is the speaker calling?',
    choices: [
      { letter: 'A', text: 'To confirm the arrangements for a department meeting' },
      { letter: 'B', text: 'To complain about the quality of a hotel room' },
      { letter: 'C', text: 'To advertise a new conference facility' },
      { letter: 'D', text: 'To cancel a catering order' },
    ],
    answer: 'A',
    explanation:
      'Người nói tự giới thiệu "I\'m confirming the arrangements for your department meeting on the fourteenth", ' +
      'sau đó nêu phòng, số người và thiết bị — xác nhận việc thu xếp cuộc họp, nên A đúng. ' +
      'B sai vì không có lời phàn nàn nào về phòng ốc. ' +
      'C sai vì bà ấy đang phục vụ một khách đã đặt phòng chứ không chào mời. ' +
      'D sai vì bữa ăn chưa bị huỷ, chỉ cần xác nhận số người với nhà cung cấp.',
    translation:
      'Vì sao người nói gọi điện? — Để xác nhận các thu xếp cho cuộc họp phòng ban. ' +
      '("Tôi đang xác nhận việc thu xếp cho cuộc họp phòng ban của ông vào ngày 14.")',
  },
  {
    id: 'p4-0005',
    part: 4,
    section: 'listening',
    difficulty: 3,
    tags: ['detail', 'problem'],
    stimulusId: 'g-p4-0002',
    prompt: 'What problem does the caller mention?',
    choices: [
      { letter: 'A', text: 'The room is too small for twenty people.' },
      { letter: 'B', text: 'A projector cannot be provided.' },
      { letter: 'C', text: 'The wireless microphone is unavailable.' },
      { letter: 'D', text: 'The meeting room has already been taken.' },
    ],
    answer: 'C',
    explanation:
      'Người nói cho biết: "the wireless microphone you asked about is not available that day" — micro không dây không có, nên C đúng. ' +
      'A sai vì phòng Willow được giữ cho đúng hai mươi người, không ai nói phòng chật. ' +
      'B sai vì "The room comes with a projector and a screen", tức máy chiếu có sẵn. ' +
      'D sai vì phòng đã được đặt cho ông Yamada chứ không bị người khác lấy mất.',
    translation:
      'Người gọi nêu vấn đề gì? — Micro không dây không có sẵn. ' +
      '(Khách sạn có máy chiếu và màn chiếu, nhưng micro không dây thì không.)',
  },
  {
    id: 'p4-0006',
    part: 4,
    section: 'listening',
    difficulty: 2,
    tags: ['future-action', 'detail'],
    stimulusId: 'g-p4-0002',
    prompt: 'What does the caller ask Mr. Yamada to do?',
    choices: [
      { letter: 'A', text: 'Pay a deposit before Wednesday' },
      { letter: 'B', text: 'Call back with his choice and final headcount' },
      { letter: 'C', text: 'Move the meeting to a different room' },
      { letter: 'D', text: 'Bring his own projector' },
    ],
    answer: 'B',
    explanation:
      'Bà ấy nói "Please call me back at extension 214 to let me know your choice" và trước đó nhắc nhà cung cấp ' +
      'cần "a final count of guests by Wednesday at noon" — gọi lại để báo lựa chọn và số lượng khách, nên B đúng. ' +
      'A sai vì không có khoản đặt cọc nào được nhắc tới. ' +
      'C sai vì phòng Willow đã được giữ, không ai yêu cầu đổi phòng. ' +
      'D sai vì người gọi đề nghị dùng micro CÓ DÂY của khách sạn, không phải yêu cầu ông tự mang máy chiếu.',
    translation:
      'Người gọi đề nghị ông Yamada làm gì? — Gọi lại để báo lựa chọn và số lượng khách chính thức.',
  },

  // ---------- Nhóm 3: thông báo thay đổi dịch vụ thư viện ----------
  {
    id: 'p4-0007',
    part: 4,
    section: 'listening',
    difficulty: 2,
    tags: ['main-topic', 'announcement'],
    stimulusId: 'g-p4-0003',
    prompt: 'What is the speaker doing?',
    choices: [
      { letter: 'A', text: 'Describing recent changes to library services' },
      { letter: 'B', text: 'Asking for donations to fund a new building' },
      { letter: 'C', text: 'Explaining how to apply for a library card' },
      { letter: 'D', text: 'To introduce a new head librarian' },
    ],
    answer: 'A',
    explanation:
      'Người nói mở đầu bằng "here is some information about our updated services", rồi lần lượt nêu giờ mở cửa mới, ' +
      'khu học yên tĩnh và cách đặt phòng họp — đó là mô tả những thay đổi mới của thư viện, nên A đúng. ' +
      'B sai vì không có lời kêu gọi quyên góp. ' +
      'C sai vì thủ tục làm thẻ thư viện không được nhắc tới. ' +
      'D sai vì không có ai được giới thiệu là thủ thư mới.',
    translation:
      'Người nói đang làm gì? — Mô tả những thay đổi gần đây của dịch vụ thư viện. ' +
      '("Đây là một số thông tin về các dịch vụ mới được cập nhật của chúng tôi.")',
  },
  {
    id: 'p4-0008',
    part: 4,
    section: 'listening',
    difficulty: 3,
    tags: ['detail', 'time'],
    stimulusId: 'g-p4-0003',
    prompt: 'What change was made to the library\'s opening hours?',
    choices: [
      { letter: 'A', text: 'It now opens earlier on weekends.' },
      { letter: 'B', text: 'It stays open until nine in the evening on weekdays.' },
      { letter: 'C', text: 'It is now closed on Monday mornings.' },
      { letter: 'D', text: 'It is now open twenty-four hours a day.' },
    ],
    answer: 'B',
    explanation:
      'Thông báo nói: "the library is open until nine in the evening on weekdays, three hours later than before" — nên B đúng. ' +
      'A sai vì không có thay đổi nào về giờ mở cửa buổi sáng cuối tuần; thứ Bảy chỉ đổi hoạt động đọc sách cho thiếu nhi. ' +
      'C sai vì thư viện vẫn mở vào các ngày trong tuần, thậm chí muộn hơn. ' +
      'D sai vì chỉ có thùng trả sách bên ngoài hoạt động 24 giờ, không phải cả thư viện.',
    translation:
      'Giờ mở cửa của thư viện đã thay đổi thế nào? — Thư viện mở đến chín giờ tối vào các ngày trong tuần.',
  },
  {
    id: 'p4-0009',
    part: 4,
    section: 'listening',
    difficulty: 3,
    tags: ['detail', 'inference'],
    stimulusId: 'g-p4-0003',
    prompt: 'What is true about the children\'s reading hour?',
    choices: [
      { letter: 'A', text: 'It has been moved to Sunday afternoon.' },
      { letter: 'B', text: 'It now requires online registration.' },
      { letter: 'C', text: 'It has been cancelled until next month.' },
      { letter: 'D', text: 'It is now held on the second floor.' },
    ],
    answer: 'A',
    explanation:
      'Thông báo nói: "the children\'s reading hour has moved from Saturday morning to Sunday afternoon at two o\'clock" — nên A đúng. ' +
      'B sai vì chỉ có phòng họp nhóm trên tầng ba mới đặt online được, không liên quan buổi đọc sách. ' +
      'C sai vì buổi đọc sách chỉ đổi giờ, không bị huỷ. ' +
      'D sai vì tầng hai là khu học yên tĩnh mới, không phải nơi tổ chức buổi đọc cho thiếu nhi.',
    translation:
      'Điều gì đúng về giờ đọc sách cho thiếu nhi? — Nó đã được chuyển sang chiều Chủ nhật.',
  },
]
// ---- Nối phần mở rộng (p4-0010 … p4-0045) ----
export const PART4_STIMULI: Stimulus[] = [...PART4_BASE_STIMULI, ...PART4B_STIMULI]
export const PART4_QUESTIONS: Question[] = [...PART4_BASE_QUESTIONS, ...PART4B_QUESTIONS]