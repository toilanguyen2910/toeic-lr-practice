import type { Question, Stimulus } from '../types'

/**
 * PART 2 — bổ sung đợt 2 (p2-0029 … p2-0044).
 *
 * Vẫn giữ đúng hợp đồng: 3 lựa chọn A/B/C, `prompt` rỗng, câu hỏi nằm trong `audioScript`.
 * Lần này đẩy mạnh các dạng khó: câu hỏi gián tiếp, câu hỏi đuôi, và câu trả lời đúng
 * không chứa từ khoá nào của câu hỏi (phải hiểu nghĩa mới chọn được).
 */
export const PART2C_STIMULI: Stimulus[] = [
  { id: 'g-p2-0029', part: 2, audioScript: 'Have the invitations for the awards ceremony been mailed?' },
  { id: 'g-p2-0030', part: 2, audioScript: 'Why is the printer on the fourth floor out of order again?' },
  { id: 'g-p2-0031', part: 2, audioScript: 'Do you know when the training materials will arrive?' },
  { id: 'g-p2-0032', part: 2, audioScript: 'Who should I speak to about the damaged flooring?' },
  { id: 'g-p2-0033', part: 2, audioScript: 'Would you mind opening the window before the meeting starts?' },
  { id: 'g-p2-0034', part: 2, audioScript: 'Which supplier gave us the lower quotation?' },
  { id: 'g-p2-0035', part: 2, audioScript: 'How often are the fire extinguishers inspected?' },
  { id: 'g-p2-0036', part: 2, audioScript: "The shipment hasn't arrived yet, has it?" },
  { id: 'g-p2-0037', part: 2, audioScript: 'Could we move the staff briefing to Friday afternoon?' },
  { id: 'g-p2-0038', part: 2, audioScript: "What's the weather forecast for the day of the outdoor event?" },
  { id: 'g-p2-0039', part: 2, audioScript: 'Did you get a chance to look at my proposal?' },
  { id: 'g-p2-0040', part: 2, audioScript: 'How do I apply for the tuition reimbursement program?' },
  { id: 'g-p2-0041', part: 2, audioScript: 'Should we hire a contractor or assign this to the design team?' },
  { id: 'g-p2-0042', part: 2, audioScript: 'Whose signature is required on the purchase order?' },
  { id: 'g-p2-0043', part: 2, audioScript: 'Is the hotel within walking distance of the exhibition hall?' },
  { id: 'g-p2-0044', part: 2, audioScript: 'When does the new overtime policy take effect?' },
]

export const PART2C_QUESTIONS: Question[] = [
  {
    id: 'p2-0029',
    part: 2,
    section: 'listening',
    difficulty: 2,
    tags: ['yes-no-question', 'passive-voice'],
    stimulusId: 'g-p2-0029',
    prompt: '',
    choices: [
      { letter: 'A', text: 'They went out on Monday morning.' },
      { letter: 'B', text: 'The ceremony was lovely.' },
      { letter: 'C', text: 'At the Grand Hotel, probably.' },
    ],
    answer: 'A',
    explanation:
      'Câu hỏi bị động "have… been mailed?" hỏi việc gửi thư đã xong chưa; A cho biết chúng đã được đưa đi vào sáng thứ Hai, tức đã gửi, nên đúng. ' +
      'B nhận xét buổi lễ dễ thương — như thể câu hỏi là "How was the ceremony?", nên sai. ' +
      'C trả lời cho "Where" nên sai.',
    translation: 'Thiệp mời dự lễ trao giải đã được gửi đi chưa? — Chúng được gửi đi vào sáng thứ Hai.',
  },
  {
    id: 'p2-0030',
    part: 2,
    section: 'listening',
    difficulty: 3,
    tags: ['wh-question', 'reason'],
    stimulusId: 'g-p2-0030',
    prompt: '',
    choices: [
      { letter: 'A', text: 'On the fourth floor, next to the stairs.' },
      { letter: 'B', text: 'The paper feed keeps jamming.' },
      { letter: 'C', text: 'About twenty pages a minute.' },
    ],
    answer: 'B',
    explanation:
      '"Why" hỏi nguyên nhân nên B nêu lỗi kẹt giấy là đúng. ' +
      'A lặp lại "fourth floor" và trả lời cho "Where" nên sai. ' +
      'C nêu tốc độ in, trả lời cho "How fast", nên sai.',
    translation: 'Vì sao máy in ở tầng bốn lại hỏng nữa? — Bộ nạp giấy cứ bị kẹt.',
  },
  {
    id: 'p2-0031',
    part: 2,
    section: 'listening',
    difficulty: 4,
    tags: ['indirect-question', 'time'],
    stimulusId: 'g-p2-0031',
    prompt: '',
    choices: [
      { letter: 'A', text: 'Yes, I know the trainer well.' },
      { letter: 'B', text: 'The training room is upstairs.' },
      { letter: 'C', text: 'They were sent out yesterday.' },
    ],
    answer: 'C',
    explanation:
      'Đây là câu hỏi gián tiếp "Do you know when…", thực chất hỏi thời điểm; C cho biết tài liệu đã được gửi hôm qua nên trả lời đúng ý. ' +
      'A trả lời như thể câu hỏi là "Do you know the trainer?", nên sai. ' +
      'B lặp lại từ "training" nhưng nói về phòng học, không cho biết khi nào tài liệu tới, nên sai.',
    translation: 'Anh có biết khi nào tài liệu đào tạo sẽ đến không? — Chúng được gửi đi hôm qua rồi.',
  },
  {
    id: 'p2-0032',
    part: 2,
    section: 'listening',
    difficulty: 3,
    tags: ['wh-question', 'person'],
    stimulusId: 'g-p2-0032',
    prompt: '',
    choices: [
      { letter: 'A', text: 'The flooring was installed last spring.' },
      { letter: 'B', text: 'Mr. Nakamura in facilities handles that.' },
      { letter: 'C', text: 'On the second floor of the annex.' },
    ],
    answer: 'B',
    explanation:
      '"Who should I speak to" hỏi người phụ trách nên B nêu tên và bộ phận là đúng. ' +
      'A lặp lại từ "flooring" nhưng chỉ nói thời điểm lắp đặt, không cho biết liên hệ ai, nên sai. ' +
      'C trả lời cho "Where" nên sai.',
    translation: 'Tôi nên trao đổi với ai về chuyện sàn bị hỏng? — Ông Nakamura ở bộ phận cơ sở vật chất phụ trách việc đó.',
  },
  {
    id: 'p2-0033',
    part: 2,
    section: 'listening',
    difficulty: 3,
    tags: ['request', 'polite-question'],
    stimulusId: 'g-p2-0033',
    prompt: '',
    choices: [
      { letter: 'A', text: 'No, of course not. Let me get it.' },
      { letter: 'B', text: 'The meeting room is on the left.' },
      { letter: 'C', text: 'Yes, the windows were expensive.' },
    ],
    answer: 'A',
    explanation:
      '"Would you mind…?" nghĩa là "anh có phiền… không?" — trả lời "No" là đồng ý làm; A đồng ý và đứng dậy mở cửa, đúng. ' +
      'B chỉ vị trí phòng họp, không phản hồi lời nhờ, nên sai. ' +
      'C trả lời "Yes" cho câu hỏi "would you mind", người bản ngữ sẽ hiểu là có phiền, lại còn nói về giá cửa sổ, nên sai.',
    translation: 'Anh có phiền mở cửa sổ trước khi cuộc họp bắt đầu không? — Không phiền chút nào, để tôi mở.',
  },
  {
    id: 'p2-0034',
    part: 2,
    section: 'listening',
    difficulty: 2,
    tags: ['wh-question', 'choice-information'],
    stimulusId: 'g-p2-0034',
    prompt: '',
    choices: [
      { letter: 'A', text: 'The quotation was signed yesterday.' },
      { letter: 'B', text: 'We ordered forty boxes.' },
      { letter: 'C', text: 'Redwood came in about ten percent lower.' },
    ],
    answer: 'C',
    explanation:
      '"Which supplier" hỏi nhà cung cấp nào nên C nêu tên và mức chênh giá là đúng. ' +
      'A lặp lại từ "quotation" nhưng chỉ nói việc ký kết, không chỉ ra nhà cung cấp, nên sai. ' +
      'B nêu số lượng đặt hàng, không trả lời câu hỏi, nên sai.',
    translation: 'Nhà cung cấp nào đưa báo giá thấp hơn? — Redwood thấp hơn khoảng mười phần trăm.',
  },
  {
    id: 'p2-0035',
    part: 2,
    section: 'listening',
    difficulty: 2,
    tags: ['wh-question', 'frequency'],
    stimulusId: 'g-p2-0035',
    prompt: '',
    choices: [
      { letter: 'A', text: 'On every floor of the building.' },
      { letter: 'B', text: 'Once a year, in the spring.' },
      { letter: 'C', text: 'The safety officer ordered new ones.' },
    ],
    answer: 'B',
    explanation:
      '"How often" hỏi tần suất nên B nêu chu kỳ mỗi năm một lần là đúng. ' +
      'A trả lời cho "Where" nên sai. ' +
      'C nói ai đặt mua bình mới, không cho biết tần suất kiểm tra, nên sai.',
    translation: 'Bình chữa cháy được kiểm tra bao lâu một lần? — Mỗi năm một lần, vào mùa xuân.',
  },
  {
    id: 'p2-0036',
    part: 2,
    section: 'listening',
    difficulty: 4,
    tags: ['tag-question', 'present-perfect'],
    stimulusId: 'g-p2-0036',
    prompt: '',
    choices: [
      { letter: 'A', text: "No, it's still at the port." },
      { letter: 'B', text: 'The shipment weighed twelve tons.' },
      { letter: 'C', text: 'Yes, I ordered the larger size.' },
    ],
    answer: 'A',
    explanation:
      'Câu hỏi đuôi phủ định ("…has it?") ngụ ý người nói cho rằng hàng chưa tới; A xác nhận đúng như vậy và nêu lý do, nên đúng. ' +
      'B chỉ nói khối lượng lô hàng, không cho biết đã tới hay chưa, nên sai. ' +
      'C trả lời "Yes" nhưng nói về việc đặt cỡ lớn hơn — như thể câu hỏi là "Did you order the larger size?", nên sai.',
    translation: 'Lô hàng vẫn chưa tới, đúng không? — Đúng, nó vẫn còn ở cảng.',
  },
  {
    id: 'p2-0037',
    part: 2,
    section: 'listening',
    difficulty: 3,
    tags: ['suggestion', 'time'],
    stimulusId: 'g-p2-0037',
    prompt: '',
    choices: [
      { letter: 'A', text: 'The staff briefing lasted an hour.' },
      { letter: 'B', text: "Friday's fine with me." },
      { letter: 'C', text: 'Yes, we moved the furniture.' },
    ],
    answer: 'B',
    explanation:
      '"Could we move… to Friday afternoon?" là lời đề nghị đổi lịch nên B đồng ý với mốc mới là đúng. ' +
      'A lặp lại từ "briefing" nhưng kể về buổi trước, không trả lời việc dời lịch, nên sai. ' +
      'C trả lời "Yes" rồi nói về chuyện kê đồ đạc — như thể câu hỏi là "Did we move the furniture?", nên sai.',
    translation: 'Chúng ta có thể dời buổi họp giao ban sang chiều thứ Sáu không? — Thứ Sáu với tôi ổn.',
  },
  {
    id: 'p2-0038',
    part: 2,
    section: 'listening',
    difficulty: 3,
    tags: ['wh-question', 'weather'],
    stimulusId: 'g-p2-0038',
    prompt: '',
    choices: [
      { letter: 'A', text: 'The event was cancelled.' },
      { letter: 'B', text: 'Clear and warm all afternoon.' },
      { letter: 'C', text: 'In the north parking lot.' },
    ],
    answer: 'B',
    explanation:
      '"What\'s the weather forecast" hỏi dự báo thời tiết nên B mô tả trời quang và ấm là đúng. ' +
      'A nói sự kiện bị huỷ, không trả lời câu hỏi, nên sai. ' +
      'C trả lời cho "Where" nên sai.',
    translation: 'Dự báo thời tiết ngày diễn ra sự kiện ngoài trời thế nào? — Trời quang và ấm suốt buổi chiều.',
  },
  {
    id: 'p2-0039',
    part: 2,
    section: 'listening',
    difficulty: 2,
    tags: ['yes-no-question', 'past-simple'],
    stimulusId: 'g-p2-0039',
    prompt: '',
    choices: [
      { letter: 'A', text: 'The proposal needs a budget section.' },
      { letter: 'B', text: 'I would suggest a different format.' },
      { letter: 'C', text: 'I did, and I have a few questions.' },
    ],
    answer: 'C',
    explanation:
      '"Did you get a chance to…?" là câu hỏi Yes/No nên C trả lời rõ rồi mở ra trao đổi là đúng. ' +
      'A nhận xét đề xuất còn thiếu mục ngân sách nhưng không cho biết đã xem hay chưa, nên sai. ' +
      'B gợi ý đổi định dạng, cũng không trả lời câu hỏi, nên sai.',
    translation: 'Anh đã có dịp xem bản đề xuất của tôi chưa? — Tôi xem rồi, và có vài câu hỏi.',
  },
  {
    id: 'p2-0040',
    part: 2,
    section: 'listening',
    difficulty: 3,
    tags: ['wh-question', 'procedure'],
    stimulusId: 'g-p2-0040',
    prompt: '',
    choices: [
      { letter: 'A', text: 'Submit the form to human resources.' },
      { letter: 'B', text: 'The tuition went up this year.' },
      { letter: 'C', text: 'A few of us are taking courses.' },
    ],
    answer: 'A',
    explanation:
      '"How do I apply" hỏi cách thức nên A nêu đúng bước nộp hồ sơ là đúng. ' +
      'B chỉ bình luận học phí tăng, không hướng dẫn thủ tục, nên sai. ' +
      'C nói vài đồng nghiệp đang học, không trả lời câu hỏi, nên sai.',
    translation: 'Tôi phải làm sao để xin hỗ trợ học phí? — Nộp đơn cho phòng nhân sự.',
  },
  {
    id: 'p2-0041',
    part: 2,
    section: 'listening',
    difficulty: 3,
    tags: ['choice-question'],
    stimulusId: 'g-p2-0041',
    prompt: '',
    choices: [
      { letter: 'A', text: 'The design team is on the fifth floor.' },
      { letter: 'B', text: 'Yes, the contractor is available.' },
      { letter: 'C', text: 'Let us keep it in-house this time.' },
    ],
    answer: 'C',
    explanation:
      'Đây là câu hỏi lựa chọn "X or Y" nên C chọn phương án làm nội bộ, tức chọn chính thức hai, là đúng. ' +
      'A chỉ vị trí nhóm thiết kế, không chọn phương án nào, nên sai. ' +
      'B trả lời "Yes" cho câu hỏi lựa chọn — người bản ngữ không dùng Yes/No với câu hỏi "or", nên sai.',
    translation: 'Chúng ta nên thuê nhà thầu hay giao cho nhóm thiết kế? — Lần này để nhóm nhà làm.',
  },
  {
    id: 'p2-0042',
    part: 2,
    section: 'listening',
    difficulty: 4,
    tags: ['wh-question', 'possession'],
    stimulusId: 'g-p2-0042',
    prompt: '',
    choices: [
      { letter: 'A', text: 'The order came to nine thousand dollars.' },
      { letter: 'B', text: 'Anyone above ten thousand needs the director.' },
      { letter: 'C', text: 'It was signed in blue ink.' },
    ],
    answer: 'B',
    explanation:
      '"Whose signature" hỏi chữ ký của ai nên B nêu rõ mức nào thì cần giám đốc ký là đúng. ' +
      'A nói giá trị đơn hàng, không trả lời ai phải ký, nên sai. ' +
      'C nói chữ ký bằng mực xanh — như thể câu hỏi là "How was it signed?", nên sai.',
    translation: 'Chữ ký của ai là bắt buộc trên đơn đặt hàng? — Đơn trên mười nghìn đô cần chữ ký giám đốc.',
  },
  {
    id: 'p2-0043',
    part: 2,
    section: 'listening',
    difficulty: 2,
    tags: ['yes-no-question', 'location'],
    stimulusId: 'g-p2-0043',
    prompt: '',
    choices: [
      { letter: 'A', text: 'It is about a fifteen-minute walk.' },
      { letter: 'B', text: 'The exhibition opened on Tuesday.' },
      { letter: 'C', text: 'Yes, we booked two rooms.' },
    ],
    answer: 'A',
    explanation:
      'Câu hỏi "Is the hotel within walking distance…?" hỏi khoảng cách; A cho biết đi bộ mất chừng mười lăm phút, tức nằm trong khoảng đi bộ được, nên đúng. ' +
      'B nói ngày khai mạc triển lãm, không liên quan khoảng cách, nên sai. ' +
      'C trả lời "Yes" nhưng lại nói về việc đặt hai phòng — như thể câu hỏi là "Did you book the rooms?", nên sai.',
    translation: 'Khách sạn có nằm trong khoảng cách đi bộ tới hội trường triển lãm không? — Đi bộ khoảng mười lăm phút.',
  },
  {
    id: 'p2-0044',
    part: 2,
    section: 'listening',
    difficulty: 2,
    tags: ['wh-question', 'time'],
    stimulusId: 'g-p2-0044',
    prompt: '',
    choices: [
      { letter: 'A', text: 'The policy was explained in the memo.' },
      { letter: 'B', text: 'Starting with the next pay period.' },
      { letter: 'C', text: 'Two hours a week, usually.' },
    ],
    answer: 'B',
    explanation:
      '"When" hỏi thời điểm nên B nêu mốc áp dụng là đúng. ' +
      'A lặp lại từ "policy" nhưng chỉ nói nó được giải thích ở đâu, không cho biết khi nào có hiệu lực, nên sai. ' +
      'C trả lời cho "How much overtime", không trả lời "When", nên sai.',
    translation: 'Chính sách làm thêm giờ mới có hiệu lực khi nào? — Từ kỳ trả lương tới.',
  },
]
