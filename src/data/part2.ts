import type { Question, Stimulus } from '../types'

/**
 * PART 2 — Hỏi – đáp (12 câu, mỗi câu CHỈ 3 lựa chọn A/B/C).
 *
 * `prompt` để rỗng theo hợp đồng; câu hỏi nằm trong `audioScript` của stimulus.
 * `choices` là 3 câu trả lời người học nghe được.
 *
 * Vì đây là ngữ liệu NÓI, toàn bộ câu hỏi và câu trả lời dùng dạng rút gọn tự nhiên
 * (I'm, isn't, I'll…) đúng như đề thật.
 *
 * Bẫy được dùng có chủ đích, giống đề thật:
 * - trả lời sai loại câu hỏi (where ↔ when ↔ how many),
 * - lặp lại một từ trong câu hỏi mà không trả lời,
 * - bắt âm gần giống ("deadline" → "line", "price" → "prize").
 */
export const PART2_STIMULI: Stimulus[] = [
  {
    id: 'g-p2-0001',
    part: 2,
    audioScript: 'Where did you leave the signed contracts?',
  },
  {
    id: 'g-p2-0002',
    part: 2,
    audioScript: 'Have you booked the conference room for Friday?',
  },
  {
    id: 'g-p2-0003',
    part: 2,
    audioScript: "Who's handling the Kimura account while Ms. Patel is on leave?",
  },
  {
    id: 'g-p2-0004',
    part: 2,
    audioScript: 'Why was the shipment delayed?',
  },
  {
    id: 'g-p2-0005',
    part: 2,
    audioScript: 'Should we print the brochures in color or in black and white?',
  },
  {
    id: 'g-p2-0006',
    part: 2,
    audioScript: 'When does the new sales assistant start?',
  },
  {
    id: 'g-p2-0007',
    part: 2,
    audioScript: 'Could you send me the updated price list by noon?',
  },
  {
    id: 'g-p2-0008',
    part: 2,
    audioScript: "You haven't submitted your expense report yet, have you?",
  },
  {
    id: 'g-p2-0009',
    part: 2,
    audioScript: 'How long will the safety training take?',
  },
  {
    id: 'g-p2-0010',
    part: 2,
    audioScript: 'Do you know whether the flight to Osaka has been confirmed?',
  },
  {
    id: 'g-p2-0011',
    part: 2,
    audioScript: 'Who approved the budget for the new copier?',
  },
  {
    id: 'g-p2-0012',
    part: 2,
    audioScript: "Isn't the deadline next Monday?",
  },
]

export const PART2_QUESTIONS: Question[] = [
  {
    id: 'p2-0001',
    part: 2,
    section: 'listening',
    difficulty: 1,
    tags: ['wh-question', 'location'],
    stimulusId: 'g-p2-0001',
    prompt: '',
    choices: [
      { letter: 'A', text: 'Yes, before the meeting.' },
      { letter: 'B', text: 'In the top drawer of my desk.' },
      { letter: 'C', text: 'About twenty of them.' },
    ],
    answer: 'B',
    explanation:
      'Câu hỏi bắt đầu bằng "Where" nên cần một cụm chỉ nơi chốn; B nêu vị trí cụ thể nên đúng. ' +
      'C trả lời cho câu hỏi "How many" (bao nhiêu bản), không phải nơi chốn, nên sai. ' +
      'A là câu trả lời Yes/No kèm mốc thời gian, không trả lời "ở đâu", nên sai.',
    translation: 'Bạn đã để hợp đồng đã ký ở đâu? — Trong ngăn kéo trên cùng của bàn tôi.',
  },
  {
    id: 'p2-0002',
    part: 2,
    section: 'listening',
    difficulty: 2,
    tags: ['yes-no-question', 'present-perfect'],
    stimulusId: 'g-p2-0002',
    prompt: '',
    choices: [
      { letter: 'A', text: "Not yet. I'm waiting for the final headcount." },
      { letter: 'B', text: "No, it's on the second floor." },
      { letter: 'C', text: 'Friday works well for me.' },
    ],
    answer: 'A',
    explanation:
      'Đây là câu hỏi Yes/No ở thì hiện tại hoàn thành ("Have you booked…"), nên A trả lời trực tiếp bằng ' +
      '"Not yet" kèm lý do — tự nhiên và đúng trọng tâm. ' +
      'B mở đầu bằng "No" nhưng phần sau lại chỉ vị trí, như thể câu hỏi là "Where is the conference room?", nên sai. ' +
      'C chỉ lặp lại từ "Friday" trong câu hỏi mà không cho biết đã đặt phòng hay chưa, nên sai.',
    translation:
      'Bạn đã đặt phòng hội nghị cho thứ Sáu chưa? — Chưa. Tôi vẫn đang chờ biết có bao nhiêu người tham dự.',
  },
  {
    id: 'p2-0003',
    part: 2,
    section: 'listening',
    difficulty: 3,
    tags: ['wh-question', 'person-reference'],
    stimulusId: 'g-p2-0003',
    prompt: '',
    choices: [
      { letter: 'A', text: 'Mr. Ortiz took it over last week.' },
      { letter: 'B', text: "She'll be back in three weeks." },
      { letter: 'C', text: 'At the Tokyo branch.' },
    ],
    answer: 'A',
    explanation:
      '"Who" hỏi về người, nên A nêu tên người tiếp quản là đúng. ' +
      'B tuy có nhắc tới người nhưng trả lời cho câu hỏi "When will Ms. Patel be back?" — ở đây câu hỏi là AI ' +
      'đang phụ trách, không phải khi nào cô Patel quay lại, nên sai. ' +
      'C là cụm chỉ địa điểm, trả lời cho "Where", nên sai.',
    translation: 'Ai đang phụ trách tài khoản Kimura trong lúc cô Patel nghỉ phép? — Ông Ortiz đã tiếp nhận tuần trước.',
  },
  {
    id: 'p2-0004',
    part: 2,
    section: 'listening',
    difficulty: 2,
    tags: ['wh-question', 'reason'],
    stimulusId: 'g-p2-0004',
    prompt: '',
    choices: [
      { letter: 'A', text: 'The courier company changed its name.' },
      { letter: 'B', text: 'The delivery van broke down on the highway.' },
      { letter: 'C', text: 'Last Thursday, I believe.' },
    ],
    answer: 'B',
    explanation:
      '"Why" hỏi nguyên nhân, nên B nêu lý do chiếc xe giao hàng bị hỏng — đúng. ' +
      'A có nhắc tới công ty chuyển phát (từ liên quan tới "shipment") nhưng chỉ nói về việc đổi tên, ' +
      'không giải thích vì sao hàng bị chậm, nên sai. ' +
      'C trả lời cho câu hỏi "When", nên sai.',
    translation: 'Vì sao lô hàng bị chậm? — Xe giao hàng bị hỏng trên đường cao tốc.',
  },
  {
    id: 'p2-0005',
    part: 2,
    section: 'listening',
    difficulty: 3,
    tags: ['choice-question', 'preference'],
    stimulusId: 'g-p2-0005',
    prompt: '',
    choices: [
      { letter: 'A', text: 'Color. The client specifically asked for it.' },
      { letter: 'B', text: 'About five hundred copies.' },
      { letter: 'C', text: "Yes, the printer's working again." },
    ],
    answer: 'A',
    explanation:
      'Đây là câu hỏi lựa chọn "X or Y", phải chọn một trong hai phương án được nêu; A chọn "color" và nêu lý do — đúng. ' +
      'B trả lời cho "How many" (số bản in), không nằm trong hai phương án được hỏi, nên sai. ' +
      'C trả lời "Yes" cho một câu hỏi lựa chọn — người bản ngữ không dùng Yes/No cho câu hỏi "or", nên sai.',
    translation: 'Chúng ta nên in tờ rơi màu hay đen trắng? — In màu. Khách hàng đã yêu cầu cụ thể như vậy.',
  },
  {
    id: 'p2-0006',
    part: 2,
    section: 'listening',
    difficulty: 2,
    tags: ['wh-question', 'time'],
    stimulusId: 'g-p2-0006',
    prompt: '',
    choices: [
      { letter: 'A', text: 'In the sales department.' },
      { letter: 'B', text: 'The first Monday of next month.' },
      { letter: 'C', text: 'She has three years of experience.' },
    ],
    answer: 'B',
    explanation:
      '"When" hỏi thời điểm, nên B nêu mốc thời gian cụ thể là đúng. ' +
      'A trả lời cho "Where" (làm ở bộ phận nào), nên sai. ' +
      'C là thông tin về kinh nghiệm của ứng viên — có liên quan tới chủ đề tuyển dụng nhưng không trả lời "khi nào", nên sai.',
    translation: 'Khi nào trợ lý kinh doanh mới bắt đầu làm việc? — Thứ Hai đầu tiên của tháng sau.',
  },
  {
    id: 'p2-0007',
    part: 2,
    section: 'listening',
    difficulty: 2,
    tags: ['request', 'modal-verb'],
    stimulusId: 'g-p2-0007',
    prompt: '',
    choices: [
      { letter: 'A', text: "It's a very reasonable price." },
      { letter: 'B', text: 'Yes, the post office closes at noon.' },
      { letter: 'C', text: "Sure. I'll email it right after this call." },
    ],
    answer: 'C',
    explanation:
      '"Could you…?" là lời nhờ vả, nên cần một câu nhận lời hoặc từ chối; C nhận lời và nêu cách thực hiện — đúng. ' +
      'A lặp lại từ "price" nhưng chỉ bình luận về giá, không phản hồi lời nhờ, nên sai. ' +
      'B bắt âm "noon" nhưng nói về giờ đóng cửa bưu điện, không liên quan tới việc gửi bảng giá, nên sai.',
    translation: 'Anh/chị có thể gửi cho tôi bảng giá cập nhật trước buổi trưa không? — Được. Tôi sẽ gửi email ngay sau cuộc gọi này.',
  },
  {
    id: 'p2-0008',
    part: 2,
    section: 'listening',
    difficulty: 4,
    tags: ['tag-question', 'present-perfect'],
    stimulusId: 'g-p2-0008',
    prompt: '',
    choices: [
      { letter: 'A', text: 'I sent it in on Tuesday, actually.' },
      { letter: 'B', text: 'Yes, the total came to three hundred dollars.' },
      { letter: 'C', text: "I'll be out of town until Tuesday." },
    ],
    answer: 'A',
    explanation:
      'Câu hỏi đuôi phủ định ("…have you?") ngụ ý người nói cho rằng việc đó CHƯA xảy ra; A phản hồi bằng ' +
      'thông tin trái lại (đã gửi hôm thứ Ba) — cách đáp tự nhiên và đúng. ' +
      'B trả lời "Yes" rồi lại nêu số tiền, như thể câu hỏi là "How much was your expense report?", nên sai. ' +
      'C chỉ nhắc tới thứ Ba — trùng với mốc thời gian đã nêu ở phương án đúng — mà không cho biết đã nộp báo cáo hay chưa, nên sai.',
    translation: 'Bạn vẫn chưa nộp báo cáo chi phí, đúng không? — Thật ra tôi đã nộp hôm thứ Ba rồi.',
  },
  {
    id: 'p2-0009',
    part: 2,
    section: 'listening',
    difficulty: 1,
    tags: ['wh-question', 'duration'],
    stimulusId: 'g-p2-0009',
    prompt: '',
    choices: [
      { letter: 'A', text: 'In the main auditorium.' },
      { letter: 'B', text: 'About two hours, including the quiz.' },
      { letter: 'C', text: "Because it's now mandatory." },
    ],
    answer: 'B',
    explanation:
      '"How long" hỏi độ dài thời gian, nên B nêu khoảng thời gian là đúng. ' +
      'A trả lời cho "Where" (ở đâu), nên sai. ' +
      'C trả lời cho "Why" (vì sao), nên sai.',
    translation: 'Buổi huấn luyện an toàn sẽ kéo dài bao lâu? — Khoảng hai tiếng, tính cả phần trắc nghiệm.',
  },
  {
    id: 'p2-0010',
    part: 2,
    section: 'listening',
    difficulty: 4,
    tags: ['indirect-question', 'present-perfect'],
    stimulusId: 'g-p2-0010',
    prompt: '',
    choices: [
      { letter: 'A', text: 'Yes, I know her quite well.' },
      { letter: 'B', text: 'It leaves from gate twelve.' },
      { letter: 'C', text: "I'll check the booking system right now." },
    ],
    answer: 'C',
    explanation:
      '"Do you know whether…?" là câu hỏi gián tiếp, thực chất hỏi thông tin chuyến bay đã được xác nhận chưa; ' +
      'C hứa kiểm tra ngay — cách đáp hợp lý khi người trả lời chưa biết. ' +
      'A hiểu sai "know" thành "quen biết ai đó" nên trả lời về người, sai. ' +
      'B nêu cổng khởi hành, không trả lời chuyện xác nhận vé, nên sai.',
    translation: 'Anh/chị có biết chuyến bay đi Osaka đã được xác nhận chưa? — Tôi sẽ kiểm tra hệ thống đặt vé ngay bây giờ.',
  },
  {
    id: 'p2-0011',
    part: 2,
    section: 'listening',
    difficulty: 2,
    tags: ['wh-question', 'person-reference'],
    stimulusId: 'g-p2-0011',
    prompt: '',
    choices: [
      { letter: 'A', text: 'On the third floor, near the stairs.' },
      { letter: 'B', text: 'About eight hundred dollars.' },
      { letter: 'C', text: 'Ms. Chen signed off on it yesterday.' },
    ],
    answer: 'C',
    explanation:
      '"Who" hỏi người, nên C nêu tên người đã duyệt là đúng ("sign off on" = phê duyệt). ' +
      'A trả lời cho "Where is the new copier?", nên sai. ' +
      'B trả lời cho "How much is the budget?", không trả lời ai duyệt, nên sai.',
    translation: 'Ai đã duyệt ngân sách cho máy photocopy mới? — Cô Chen đã phê duyệt hôm qua.',
  },
  {
    id: 'p2-0012',
    part: 2,
    section: 'listening',
    difficulty: 5,
    tags: ['negative-question', 'time'],
    stimulusId: 'g-p2-0012',
    prompt: '',
    choices: [
      { letter: 'A', text: 'Yes, I stood in line for over an hour.' },
      { letter: 'B', text: 'The Monday meeting was cancelled.' },
      { letter: 'C', text: 'Actually, they moved it up to Friday.' },
    ],
    answer: 'C',
    explanation:
      'Đây là câu hỏi phủ định (negative question) dùng để xác nhận điều người nói tin là đúng; ' +
      'C sửa lại thông tin và cho biết hạn chót thực tế là thứ Sáu — đúng và tự nhiên. ' +
      'A là bẫy đồng âm: "deadline" nghe gần giống "line", nên A nói về việc xếp hàng chứ không trả lời hạn chót. ' +
      'B chỉ lặp lại từ "Monday" mà không cho biết hạn chót là ngày nào, nên sai.',
    translation: 'Hạn chót là thứ Hai tới, đúng không? — Thật ra họ đã dời lên thứ Sáu.',
  },
]
