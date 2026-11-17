import type { Question, Stimulus } from '../types'

/**
 * PART 2 — bổ sung đợt 3 (p2-0045 … p2-0060).
 *
 * Đợt cuối của Part 2: đủ 60 câu. Bổ sung các dạng còn thiếu — câu mệnh lệnh,
 * lời cảm ơn, câu hỏi về số lượng/thời lượng khó, và câu trả lời đúng mang tính
 * thay thế (người nói đưa ra phương án khác thay vì trả lời trực tiếp).
 */
export const PART2D_STIMULI: Stimulus[] = [
  { id: 'g-p2-0045', part: 2, audioScript: 'Could you turn the projector on before the presentation?' },
  { id: 'g-p2-0046', part: 2, audioScript: 'Could you cover the front desk during my lunch break?' },
  { id: 'g-p2-0047', part: 2, audioScript: "Why didn't you mention the price change at the meeting?" },
  { id: 'g-p2-0048', part: 2, audioScript: 'How far is the nearest warehouse from the airport?' },
  { id: 'g-p2-0049', part: 2, audioScript: 'Are the contracts ready to be signed?' },
  { id: 'g-p2-0050', part: 2, audioScript: "Who's in charge of ordering office supplies this quarter?" },
  { id: 'g-p2-0051', part: 2, audioScript: 'Would Friday the ninth be too early for the client visit?' },
  { id: 'g-p2-0052', part: 2, audioScript: 'Have you had a chance to try the new scheduling system?' },
  { id: 'g-p2-0053', part: 2, audioScript: 'Which format should the presentation be saved in?' },
  { id: 'g-p2-0054', part: 2, audioScript: 'Can you tell me where the loading dock is?' },
  { id: 'g-p2-0055', part: 2, audioScript: "The auditor's report is due on Friday, isn't it?" },
  { id: 'g-p2-0056', part: 2, audioScript: 'How was the first day of the trade show?' },
  { id: 'g-p2-0057', part: 2, audioScript: 'Should I copy the regional managers on this email?' },
  { id: 'g-p2-0058', part: 2, audioScript: 'What made you choose this location for the new branch?' },
  { id: 'g-p2-0059', part: 2, audioScript: 'Do we have enough chairs for the workshop on Monday?' },
  { id: 'g-p2-0060', part: 2, audioScript: 'Whose turn is it to present the sales figures?' },
]

export const PART2D_QUESTIONS: Question[] = [
  {
    id: 'p2-0045',
    part: 2,
    section: 'listening',
    difficulty: 1,
    tags: ['request', 'modal-verb'],
    stimulusId: 'g-p2-0045',
    prompt: '',
    choices: [
      { letter: 'A', text: "Sure, it's warming up now." },
      { letter: 'B', text: 'The presentation lasted forty minutes.' },
      { letter: 'C', text: 'The projector is in the supply closet.' },
    ],
    answer: 'A',
    explanation:
      '"Could you…?" là lời nhờ vả nên A nhận lời và báo máy đang khởi động, đúng chức năng. ' +
      'B lặp lại từ "presentation" nhưng nói về độ dài buổi thuyết trình, không thực hiện lời nhờ, nên sai. ' +
      'C cho biết máy chiếu ở đâu — trả lời cho "Where", không hoàn thành lời nhờ, nên sai.',
    translation: 'Anh có thể bật máy chiếu trước buổi thuyết trình không? — Được, máy đang khởi động rồi.',
  },
  {
    id: 'p2-0046',
    part: 2,
    section: 'listening',
    difficulty: 2,
    tags: ['request', 'modal-verb'],
    stimulusId: 'g-p2-0046',
    prompt: '',
    choices: [
      { letter: 'A', text: 'My lunch is at noon.' },
      { letter: 'B', text: 'No problem at all.' },
      { letter: 'C', text: 'The front desk is near the entrance.' },
    ],
    answer: 'B',
    explanation:
      '"Could you…?" là lời nhờ vả nên B là câu nhận lời tự nhiên, đúng chức năng. ' +
      'A chỉ cho biết giờ ăn trưa của người nói, không phản hồi lời nhờ, nên sai. ' +
      'C lặp lại "front desk" và chỉ vị trí — như thể câu hỏi là "Where is the front desk?", nên sai.',
    translation: 'Anh có thể trực quầy lễ tân trong giờ ăn trưa của tôi không? — Không vấn đề gì.',
  },
  {
    id: 'p2-0047',
    part: 2,
    section: 'listening',
    difficulty: 4,
    tags: ['wh-question', 'past-simple', 'reason'],
    stimulusId: 'g-p2-0047',
    prompt: '',
    choices: [
      { letter: 'A', text: 'The meeting room was moved.' },
      { letter: 'B', text: 'I wanted to be sure the figures were final first.' },
      { letter: 'C', text: 'Yes, the price went up in June.' },
    ],
    answer: 'B',
    explanation:
      '"Why didn\'t you…?" hỏi lý do nên B giải thích động cơ chờ số liệu là đúng. ' +
      'A nói phòng họp bị đổi, không liên quan lý do không nêu giá, nên sai. ' +
      'C trả lời "Yes" cho câu hỏi có từ để hỏi và chỉ nhắc mốc tăng giá — như thể câu hỏi là "Did the price go up?", nên sai.',
    translation: 'Sao anh không nêu việc đổi giá ở cuộc họp? — Tôi muốn chắc số liệu đã chốt trước đã.',
  },
  {
    id: 'p2-0048',
    part: 2,
    section: 'listening',
    difficulty: 3,
    tags: ['wh-question', 'distance'],
    stimulusId: 'g-p2-0048',
    prompt: '',
    choices: [
      { letter: 'A', text: 'About forty kilometres.' },
      { letter: 'B', text: 'The warehouse is closed on Sundays.' },
      { letter: 'C', text: 'We flew in on Monday.' },
    ],
    answer: 'A',
    explanation:
      '"How far" hỏi khoảng cách nên A nêu số ki-lô-mét là đúng. ' +
      'B lặp lại "warehouse" nhưng nói giờ mở cửa, không trả lời khoảng cách, nên sai. ' +
      'C nói ngày bay, trả lời cho "When", nên sai.',
    translation: 'Kho hàng gần nhất cách sân bay bao xa? — Khoảng bốn mươi cây số.',
  },
  {
    id: 'p2-0049',
    part: 2,
    section: 'listening',
    difficulty: 2,
    tags: ['yes-no-question', 'passive-voice'],
    stimulusId: 'g-p2-0049',
    prompt: '',
    choices: [
      { letter: 'A', text: 'The lawyer is reviewing the last page.' },
      { letter: 'B', text: 'They signed the lease in March.' },
      { letter: 'C', text: 'In the conference room at three.' },
    ],
    answer: 'A',
    explanation:
      'Câu hỏi Yes/No hỏi hợp đồng đã sẵn sàng ký chưa; A cho biết luật sư còn đang xem trang cuối, tức chưa xong — cách đáp gián tiếp đúng. ' +
      'B nói về hợp đồng thuê đã ký hồi tháng Ba, không trả lời câu hỏi hiện tại, nên sai. ' +
      'C trả lời cho "When and where" nên sai.',
    translation: 'Hợp đồng đã sẵn sàng để ký chưa? — Luật sư vẫn đang xem trang cuối.',
  },
  {
    id: 'p2-0050',
    part: 2,
    section: 'listening',
    difficulty: 2,
    tags: ['wh-question', 'person'],
    stimulusId: 'g-p2-0050',
    prompt: '',
    choices: [
      { letter: 'A', text: 'We ordered two boxes of pens.' },
      { letter: 'B', text: 'Every quarter, on the first Monday.' },
      { letter: 'C', text: 'Mr. Osei usually does it.' },
    ],
    answer: 'C',
    explanation:
      '"Who\'s in charge of…" hỏi người phụ trách nên C nêu tên người là đúng. ' +
      'A nói số hộp bút đã đặt, không trả lời ai phụ trách, nên sai. ' +
      'B trả lời cho "How often / When", dù có lặp lại từ "quarter" trong câu hỏi, nên sai.',
    translation: 'Ai phụ trách đặt mua văn phòng phẩm quý này? — Ông Osei thường làm việc đó.',
  },
  {
    id: 'p2-0051',
    part: 2,
    section: 'listening',
    difficulty: 4,
    tags: ['suggestion', 'time'],
    stimulusId: 'g-p2-0051',
    prompt: '',
    choices: [
      { letter: 'A', text: 'The client arrives by train.' },
      { letter: 'B', text: "It's tight, but we could manage." },
      { letter: 'C', text: 'Yes, the ninth was a holiday.' },
    ],
    answer: 'B',
    explanation:
      '"Would Friday the ninth be too early…?" hỏi liệu mốc thời gian đó có quá sớm không; B thừa nhận sát nhưng vẫn xoay được — cách đáp đúng. ' +
      'A cho biết khách đi tàu, không trả lời về mốc thời gian, nên sai. ' +
      'C trả lời "Yes" như thể câu hỏi là "Was the ninth a holiday?", nên sai.',
    translation: 'Thứ Sáu ngày mùng 9 có quá sớm cho chuyến thăm của khách không? — Hơi sát, nhưng có thể xoay được.',
  },
  {
    id: 'p2-0052',
    part: 2,
    section: 'listening',
    difficulty: 3,
    tags: ['yes-no-question', 'present-perfect'],
    stimulusId: 'g-p2-0052',
    prompt: '',
    choices: [
      { letter: 'A', text: 'I have not, but the demo looked promising.' },
      { letter: 'B', text: 'The schedule changed again.' },
      { letter: 'C', text: 'Yes, it is in the system menu.' },
    ],
    answer: 'A',
    explanation:
      'Câu hỏi Yes/No hỏi đã thử hệ thống chưa; A xác nhận chưa thử và nêu nhận xét — cách đáp đúng. ' +
      'B lặp lại từ "schedule" nhưng nói lịch thay đổi, không trả lời câu hỏi, nên sai. ' +
      'C trả lời "Yes" rồi chỉ vị trí trong menu — như thể câu hỏi là "Is the system in the menu?", nên sai.',
    translation: 'Anh đã có dịp thử hệ thống xếp lịch mới chưa? — Tôi chưa thử, nhưng buổi demo trông khả quan.',
  },
  {
    id: 'p2-0053',
    part: 2,
    section: 'listening',
    difficulty: 2,
    tags: ['wh-question', 'choice-information'],
    stimulusId: 'g-p2-0053',
    prompt: '',
    choices: [
      { letter: 'A', text: 'The presentation went well.' },
      { letter: 'B', text: 'Send it as a PDF, please.' },
      { letter: 'C', text: 'About thirty slides.' },
    ],
    answer: 'B',
    explanation:
      '"Which format" hỏi định dạng nên B nêu đúng một định dạng cụ thể là đúng. ' +
      'A lặp lại từ "presentation" nhưng chỉ nhận xét buổi thuyết trình, không trả lời định dạng, nên sai. ' +
      'C nêu số trang chiếu — trả lời cho "How many", nên sai.',
    translation: 'Bài thuyết trình nên được lưu ở định dạng nào? — Gửi tôi dạng PDF nhé.',
  },
  {
    id: 'p2-0054',
    part: 2,
    section: 'listening',
    difficulty: 3,
    tags: ['indirect-question', 'location'],
    stimulusId: 'g-p2-0054',
    prompt: '',
    choices: [
      { letter: 'A', text: 'The truck was unloaded at ten.' },
      { letter: 'B', text: 'Take the second left after the gate.' },
      { letter: 'C', text: 'Yes, the dock is quite old.' },
    ],
    answer: 'B',
    explanation:
      '"Can you tell me where…" là câu hỏi gián tiếp về vị trí nên B đưa chỉ dẫn đường đi là đúng. ' +
      'A nói giờ dỡ hàng, không trả lời vị trí, nên sai. ' +
      'C trả lời "Yes" cho câu hỏi gián tiếp, lại còn nhận xét cầu tàu cũ — như thể câu hỏi là "Is the dock old?", nên sai.',
    translation: 'Anh có thể cho tôi biết cầu dỡ hàng ở đâu không? — Đi qua cổng rồi rẽ trái lần thứ hai.',
  },
  {
    id: 'p2-0055',
    part: 2,
    section: 'listening',
    difficulty: 3,
    tags: ['tag-question', 'time'],
    stimulusId: 'g-p2-0055',
    prompt: '',
    choices: [
      { letter: 'A', text: 'Yes, she finished it this morning.' },
      { letter: 'B', text: 'The auditor works in another city.' },
      { letter: 'C', text: "Actually, they've extended it to Monday." },
    ],
    answer: 'C',
    explanation:
      'Câu hỏi đuôi khẳng định ("…isn\'t it?") chờ xác nhận; C cho biết mốc đã được dời sang thứ Hai, tức đính chính đúng cách. ' +
      'A trả lời "Yes" nhưng nói "she finished it" — như thể câu hỏi là "Did she finish it?", nên sai. ' +
      'B nói nơi làm việc của kiểm toán viên, không liên quan hạn nộp, nên sai.',
    translation: 'Báo cáo của kiểm toán viên đến hạn thứ Sáu, đúng không? — Thật ra họ đã dời sang thứ Hai.',
  },
  {
    id: 'p2-0056',
    part: 2,
    section: 'listening',
    difficulty: 2,
    tags: ['wh-question', 'evaluation'],
    stimulusId: 'g-p2-0056',
    prompt: '',
    choices: [
      { letter: 'A', text: 'The show opens at ten tomorrow morning, I believe.' },
      { letter: 'B', text: 'Quiet at first, but we got a lot of leads.' },
      { letter: 'C', text: 'It is being held in the main hall, Hall B.' },
    ],
    answer: 'B',
    explanation:
      '"How was…?" hỏi đánh giá nên B nêu nhận xét về kết quả là đúng. ' +
      'A nói giờ mở cửa, trả lời cho "When" chứ không đánh giá, nên sai. ' +
      'C nói địa điểm triển lãm — trả lời cho "Where", nên sai.',
    translation: 'Ngày đầu tiên của hội chợ thế nào? — Đầu buổi khá vắng, nhưng chúng ta thu được nhiều khách tiềm năng.',
  },
  {
    id: 'p2-0057',
    part: 2,
    section: 'listening',
    difficulty: 3,
    tags: ['suggestion', 'modal-verb'],
    stimulusId: 'g-p2-0057',
    prompt: '',
    choices: [
      { letter: 'A', text: 'Yes, include all five of them.' },
      { letter: 'B', text: 'The manager is out until noon.' },
      { letter: 'C', text: 'The email address has changed.' },
    ],
    answer: 'A',
    explanation:
      '"Should I…?" là câu hỏi xin ý kiến/đề nghị nên A đồng ý và nêu rõ số người cần gửi kèm là đúng. ' +
      'B cho biết quản lý đang vắng, không trả lời về việc gửi kèm, nên sai. ' +
      'C nói địa chỉ email đã đổi, không trả lời câu hỏi, nên sai.',
    translation: 'Tôi có nên gửi kèm các trưởng vùng trong email này không? — Có, gửi cả năm người.',
  },
  {
    id: 'p2-0058',
    part: 2,
    section: 'listening',
    difficulty: 4,
    tags: ['wh-question', 'reason'],
    stimulusId: 'g-p2-0058',
    prompt: '',
    choices: [
      { letter: 'A', text: 'The branch opens next year.' },
      { letter: 'B', text: 'The rent is low and the foot traffic is high.' },
      { letter: 'C', text: 'Yes, we chose the new branch.' },
    ],
    answer: 'B',
    explanation:
      '"What made you choose…" hỏi lý do nên B nêu hai yếu tố quyết định là đúng. ' +
      'A lặp lại "branch" nhưng chỉ nói thời điểm khai trương, không giải thích lý do chọn địa điểm, nên sai. ' +
      'C trả lời "Yes" cho câu hỏi có từ để hỏi và chỉ nhắc lại chuyện chọn chi nhánh, không nêu lý do, nên sai.',
    translation: 'Điều gì khiến anh chọn địa điểm này cho chi nhánh mới? — Giá thuê thấp và lưu lượng người qua lại cao.',
  },
  {
    id: 'p2-0059',
    part: 2,
    section: 'listening',
    difficulty: 2,
    tags: ['yes-no-question', 'quantity'],
    stimulusId: 'g-p2-0059',
    prompt: '',
    choices: [
      { letter: 'A', text: 'The workshop starts at nine.' },
      { letter: 'B', text: "We're three short, actually." },
      { letter: 'C', text: 'The chairs were delivered flat.' },
    ],
    answer: 'B',
    explanation:
      'Câu hỏi "Do we have enough…?" hỏi số lượng; B cho biết còn thiếu ba chiếc — trả lời gián tiếp chính xác, đúng. ' +
      'A nói giờ bắt đầu, trả lời cho "When", nên sai. ' +
      'C nói ghế được giao ở dạng tháo rời nhưng không cho biết có đủ hay không, nên sai.',
    translation: 'Chúng ta có đủ ghế cho buổi hội thảo thứ Hai không? — Thật ra còn thiếu ba chiếc.',
  },
  {
    id: 'p2-0060',
    part: 2,
    section: 'listening',
    difficulty: 3,
    tags: ['wh-question', 'possession'],
    stimulusId: 'g-p2-0060',
    prompt: '',
    choices: [
      { letter: 'A', text: 'It is your turn, I believe.' },
      { letter: 'B', text: 'The figures were revised twice.' },
      { letter: 'C', text: 'In the main conference room.' },
    ],
    answer: 'A',
    explanation:
      '"Whose turn is it…" hỏi lượt của ai nên A trả lời trực tiếp là đến lượt người đối thoại — đúng. ' +
      'B lặp lại từ "figures" nhưng nói số liệu bị sửa, không trả lời ai trình bày, nên sai. ' +
      'C trả lời cho "Where" nên sai.',
    translation: 'Đến lượt ai trình bày số liệu bán hàng? — Theo tôi thì đến lượt anh.',
  },
]
