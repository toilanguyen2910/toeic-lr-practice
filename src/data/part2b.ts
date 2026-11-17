import type { Question, Stimulus } from '../types'

/**
 * PART 2 — bổ sung đợt 1 (p2-0013 … p2-0028).
 *
 * Cùng quy ước với `part2.ts`: mỗi câu CHỈ có 3 lựa chọn A/B/C, `prompt` để rỗng,
 * câu hỏi nằm trong `audioScript` của stimulus và phải kết thúc bằng dấu hỏi.
 *
 * Bẫy: trả lời sai loại từ hỏi, lặp lại một từ trong câu hỏi mà không trả lời,
 * bắt âm gần giống, và câu trả lời đúng gián tiếp qua một hành động thay thế.
 */
export const PART2B_STIMULI: Stimulus[] = [
  { id: 'g-p2-0013', part: 2, audioScript: 'How many copies of the annual report should we print?' },
  { id: 'g-p2-0014', part: 2, audioScript: 'Why did the client cancel the site visit?' },
  { id: 'g-p2-0015', part: 2, audioScript: 'Would you like me to book the hotel for Wednesday night?' },
  { id: 'g-p2-0016', part: 2, audioScript: 'Where can I find the spare key to the storage room?' },
  { id: 'g-p2-0017', part: 2, audioScript: 'Who is going to replace Ms. Ferreira while she is on maternity leave?' },
  { id: 'g-p2-0018', part: 2, audioScript: 'When will the new accounting software be installed?' },
  { id: 'g-p2-0019', part: 2, audioScript: 'Should we take a taxi to the airport or use the shuttle service?' },
  { id: 'g-p2-0020', part: 2, audioScript: 'How long does it take to get the security badge approved?' },
  { id: 'g-p2-0021', part: 2, audioScript: "You're coming to the retirement dinner on Saturday, aren't you?" },
  { id: 'g-p2-0022', part: 2, audioScript: 'Could you forward the invoice to the billing department?' },
  { id: 'g-p2-0023', part: 2, audioScript: "What's the best way to reach the conference center from the station?" },
  { id: 'g-p2-0024', part: 2, audioScript: 'Did the supplier confirm the revised delivery schedule?' },
  { id: 'g-p2-0025', part: 2, audioScript: 'Which conference room has been reserved for the interviews?' },
  { id: 'g-p2-0026', part: 2, audioScript: 'How much does the annual maintenance contract cost?' },
  { id: 'g-p2-0027', part: 2, audioScript: 'Do you have the figures for last quarter ready yet?' },
  { id: 'g-p2-0028', part: 2, audioScript: 'Would Thursday morning work for the site inspection?' },
]

export const PART2B_QUESTIONS: Question[] = [
  {
    id: 'p2-0013',
    part: 2,
    section: 'listening',
    difficulty: 1,
    tags: ['wh-question', 'quantity'],
    stimulusId: 'g-p2-0013',
    prompt: '',
    choices: [
      { letter: 'A', text: 'On the second floor.' },
      { letter: 'B', text: 'Last Friday afternoon.' },
      { letter: 'C', text: 'About two hundred, I think.' },
    ],
    answer: 'C',
    explanation:
      '"How many" hỏi số lượng nên C nêu con số ước chừng là đúng. ' +
      'A trả lời cho câu hỏi "Where" (ở đâu) nên sai. ' +
      'B trả lời cho câu hỏi "When" (khi nào) nên sai.',
    translation: 'Chúng ta nên in bao nhiêu bản báo cáo thường niên? — Khoảng hai trăm bản, tôi nghĩ vậy.',
  },
  {
    id: 'p2-0014',
    part: 2,
    section: 'listening',
    difficulty: 2,
    tags: ['wh-question', 'reason'],
    stimulusId: 'g-p2-0014',
    prompt: '',
    choices: [
      { letter: 'A', text: 'The conference room downstairs.' },
      { letter: 'B', text: 'No, the contract was signed.' },
      { letter: 'C', text: 'Their building inspector found a leak.' },
    ],
    answer: 'C',
    explanation:
      '"Why" hỏi nguyên nhân nên C nêu lý do cụ thể (phát hiện chỗ rò rỉ) là đúng. ' +
      'A trả lời cho "Where" nên sai, dù có lặp lại từ "conference". ' +
      'B trả lời Yes/No cho một câu hỏi có từ để hỏi, không hợp nên sai.',
    translation: 'Vì sao khách hàng huỷ buổi tham quan công trường? — Thanh tra xây dựng của họ phát hiện một chỗ rò rỉ.',
  },
  {
    id: 'p2-0015',
    part: 2,
    section: 'listening',
    difficulty: 2,
    tags: ['offer', 'modal-verb'],
    stimulusId: 'g-p2-0015',
    prompt: '',
    choices: [
      { letter: 'A', text: "That'd be great, thanks." },
      { letter: 'B', text: 'I normally take the train.' },
      { letter: 'C', text: 'The hotel is fully booked.' },
    ],
    answer: 'A',
    explanation:
      '"Would you like me to…?" là lời đề nghị giúp đỡ, nên A là câu nhận lời lịch sự và phù hợp. ' +
      'B nói về thói quen đi tàu của người nói, không liên quan tới việc đặt phòng, nên sai. ' +
      'C nêu một thông tin về khách sạn nhưng không trả lời lời đề nghị đặt phòng hộ, nên sai.',
    translation: 'Anh/chị có muốn tôi đặt khách sạn cho đêm thứ Tư không? — Thế thì tốt quá, cảm ơn.',
  },
  {
    id: 'p2-0016',
    part: 2,
    section: 'listening',
    difficulty: 2,
    tags: ['wh-question', 'location'],
    stimulusId: 'g-p2-0016',
    prompt: '',
    choices: [
      { letter: 'A', text: 'Yes, the room is quite large.' },
      { letter: 'B', text: 'Hang on, I have it on my badge.' },
      { letter: 'C', text: 'We moved the boxes yesterday.' },
    ],
    answer: 'B',
    explanation:
      '"Where" hỏi vị trí; B hứa tra thông tin trên thẻ ra vào để tìm chìa khoá, đó là cách đáp tự nhiên trong hội thoại thật. ' +
      'A trả lời Yes/No cho câu hỏi có từ để hỏi, lại chỉ nhận xét về căn phòng, nên sai. ' +
      'C nhắc tới việc chuyển thùng nhưng không cho biết chìa khoá ở đâu, nên sai.',
    translation: 'Tôi có thể tìm chìa khoá dự phòng của phòng kho ở đâu? — Chờ chút, tôi có ghi trên thẻ ra vào.',
  },
  {
    id: 'p2-0017',
    part: 2,
    section: 'listening',
    difficulty: 3,
    tags: ['wh-question', 'person'],
    stimulusId: 'g-p2-0017',
    prompt: '',
    choices: [
      { letter: 'A', text: 'Next month at the earliest.' },
      { letter: 'B', text: 'In the finance office.' },
      { letter: 'C', text: 'Ms. Duarte has agreed to cover it.' },
    ],
    answer: 'C',
    explanation:
      '"Who" hỏi người nên C nêu tên người đảm nhiệm là đúng. ' +
      'A trả lời cho câu hỏi "When" nên sai. ' +
      'B trả lời cho "Where" nên sai; nó cũng không nêu ai sẽ thay thế.',
    translation: 'Ai sẽ thay bà Ferreira khi bà ấy nghỉ sinh? — Bà Duarte đã đồng ý đảm nhiệm thay.',
  },
  {
    id: 'p2-0018',
    part: 2,
    section: 'listening',
    difficulty: 2,
    tags: ['wh-question', 'time', 'passive-voice'],
    stimulusId: 'g-p2-0018',
    prompt: '',
    choices: [
      { letter: 'A', text: 'The vendor is sending one of their own engineers.' },
      { letter: 'B', text: 'Yes, it turned out to be quite a costly upgrade.' },
      { letter: 'C', text: 'At the end of the month, once the training is done.' },
    ],
    answer: 'C',
    explanation:
      '"When" hỏi thời điểm nên C nêu mốc thời gian cụ thể là đúng. ' +
      'A cho biết ai sẽ đến nhưng không nói khi nào, nên không trả lời trực tiếp câu hỏi. ' +
      'B trả lời Yes/No cho một câu hỏi có từ để hỏi, nên sai.',
    translation: 'Khi nào phần mềm kế toán mới sẽ được cài đặt? — Cuối tháng, sau khi xong khoá đào tạo.',
  },
  {
    id: 'p2-0019',
    part: 2,
    section: 'listening',
    difficulty: 3,
    tags: ['choice-question'],
    stimulusId: 'g-p2-0019',
    prompt: '',
    choices: [
      { letter: 'A', text: 'The shuttle, since the roads will be busy.' },
      { letter: 'B', text: 'The flight leaves at seven.' },
      { letter: 'C', text: 'Yes, I already have a ticket.' },
    ],
    answer: 'A',
    explanation:
      'Đây là câu hỏi lựa chọn "X or Y" nên A chọn một trong hai phương án kèm lý do là đúng. ' +
      'B nêu giờ bay nhưng không chọn phương tiện nào, nên sai. ' +
      'C trả lời "Yes" cho câu hỏi lựa chọn — người bản ngữ không dùng Yes/No với câu hỏi "or", nên sai.',
    translation: 'Chúng ta nên đi taxi ra sân bay hay dùng xe đưa đón? — Xe đưa đón, vì đường sẽ đông.',
  },
  {
    id: 'p2-0020',
    part: 2,
    section: 'listening',
    difficulty: 2,
    tags: ['wh-question', 'duration'],
    stimulusId: 'g-p2-0020',
    prompt: '',
    choices: [
      { letter: 'A', text: 'In the security office near the gate.' },
      { letter: 'B', text: 'Because it includes a briefing.' },
      { letter: 'C', text: 'Usually three working days.' },
    ],
    answer: 'C',
    explanation:
      '"How long" hỏi độ dài thời gian nên C nêu số ngày là đúng. ' +
      'A trả lời cho "Where" nên sai. ' +
      'B trả lời cho "Why" nên sai, dù có cùng chủ đề quy trình cấp thẻ.',
    translation: 'Mất bao lâu để thẻ ra vào được duyệt? — Thường là ba ngày làm việc.',
  },
  {
    id: 'p2-0021',
    part: 2,
    section: 'listening',
    difficulty: 3,
    tags: ['tag-question'],
    stimulusId: 'g-p2-0021',
    prompt: '',
    choices: [
      { letter: 'A', text: 'The dinner was delicious.' },
      { letter: 'B', text: "I wouldn't miss it." },
      { letter: 'C', text: 'He retired after thirty years.' },
    ],
    answer: 'B',
    explanation:
      'Câu hỏi đuôi khẳng định ("…aren\'t you?") chờ một lời xác nhận; B là cách đáp gián tiếp thể hiện chắc chắn sẽ đến, rất tự nhiên. ' +
      'A nói về chất lượng bữa ăn trong quá khứ, không xác nhận việc tham dự, nên sai. ' +
      'C nêu thông tin về người nghỉ hưu nhưng không trả lời câu hỏi, nên sai.',
    translation: 'Anh sẽ đến bữa tối chia tay vào thứ Bảy chứ? — Tôi không thể bỏ lỡ được.',
  },
  {
    id: 'p2-0022',
    part: 2,
    section: 'listening',
    difficulty: 2,
    tags: ['request', 'modal-verb'],
    stimulusId: 'g-p2-0022',
    prompt: '',
    choices: [
      { letter: 'A', text: 'Yes, the billing department moved upstairs.' },
      { letter: 'B', text: 'The invoice covers four months.' },
      { letter: 'C', text: 'Sure, I will do that now.' },
    ],
    answer: 'C',
    explanation:
      '"Could you…?" là lời nhờ vả nên C nhận lời và nêu hành động là đúng. ' +
      'A lặp lại đúng từ "billing department" nhưng chỉ thông báo chuyện chuyển phòng, không thực hiện lời nhờ, nên sai. ' +
      'B bàn về nội dung hoá đơn, không phản hồi việc chuyển tiếp, nên sai.',
    translation: 'Anh/chị có thể chuyển tiếp hoá đơn cho phòng thanh toán không? — Được, tôi làm ngay.',
  },
  {
    id: 'p2-0023',
    part: 2,
    section: 'listening',
    difficulty: 3,
    tags: ['wh-question', 'directions'],
    stimulusId: 'g-p2-0023',
    prompt: '',
    choices: [
      { letter: 'A', text: 'Take the express train and get off at Central.' },
      { letter: 'B', text: 'The conference starts at nine.' },
      { letter: 'C', text: 'About fifty people signed up.' },
    ],
    answer: 'A',
    explanation:
      '"What\'s the best way to…" hỏi cách đi lại nên A đưa ra chỉ dẫn cụ thể là đúng. ' +
      'B nêu giờ khai mạc, không trả lời câu hỏi đường đi, nên sai. ' +
      'C nêu số người đăng ký, không liên quan tới cách di chuyển, nên sai.',
    translation: 'Cách tốt nhất để đến trung tâm hội nghị từ ga là gì? — Đi tàu nhanh và xuống bến Trung tâm.',
  },
  {
    id: 'p2-0024',
    part: 2,
    section: 'listening',
    difficulty: 2,
    tags: ['yes-no-question', 'past-simple'],
    stimulusId: 'g-p2-0024',
    prompt: '',
    choices: [
      { letter: 'A', text: 'The revised schedule looks a lot better than the old one.' },
      { letter: 'B', text: 'At the loading dock.' },
      { letter: 'C', text: 'Not yet, but I expect an answer this afternoon.' },
    ],
    answer: 'C',
    explanation:
      'Câu hỏi Yes/No nên C trả lời rõ là chưa và hứa cập nhật, đúng chức năng. ' +
      'A nhắc tới "revised schedule" nhưng chỉ nhận xét lịch mới tốt hơn, không cho biết nhà cung cấp đã xác nhận hay chưa, nên sai. ' +
      'B trả lời cho "Where" nên sai.',
    translation: 'Nhà cung cấp đã xác nhận lịch giao hàng sửa đổi chưa? — Chưa, nhưng chiều nay tôi mong có trả lời.',
  },
  {
    id: 'p2-0025',
    part: 2,
    section: 'listening',
    difficulty: 1,
    tags: ['wh-question', 'location'],
    stimulusId: 'g-p2-0025',
    prompt: '',
    choices: [
      { letter: 'A', text: 'The Birch Room on the third floor.' },
      { letter: 'B', text: 'Three candidates were shortlisted.' },
      { letter: 'C', text: 'For about forty minutes.' },
    ],
    answer: 'A',
    explanation:
      '"Which conference room" hỏi phòng cụ thể nên A nêu tên phòng là đúng. ' +
      'B nói về số ứng viên, không trả lời phòng nào, nên sai. ' +
      'C trả lời cho "How long" nên sai.',
    translation: 'Phòng họp nào được đặt cho các buổi phỏng vấn? — Phòng Birch ở tầng ba.',
  },
  {
    id: 'p2-0026',
    part: 2,
    section: 'listening',
    difficulty: 2,
    tags: ['wh-question', 'price'],
    stimulusId: 'g-p2-0026',
    prompt: '',
    choices: [
      { letter: 'A', text: 'It renews in January.' },
      { letter: 'B', text: 'The service technician will call you.' },
      { letter: 'C', text: 'Eighteen hundred dollars a year.' },
    ],
    answer: 'C',
    explanation:
      '"How much" hỏi giá nên C nêu con số tiền là đúng. ' +
      'A trả lời cho "When" nên sai. ' +
      'B nói ai sẽ gọi lại, không cho biết chi phí, nên sai.',
    translation: 'Hợp đồng bảo trì hằng năm tốn bao nhiêu? — Mười tám trăm đô một năm.',
  },
  {
    id: 'p2-0027',
    part: 2,
    section: 'listening',
    difficulty: 3,
    tags: ['yes-no-question', 'present-perfect'],
    stimulusId: 'g-p2-0027',
    prompt: '',
    choices: [
      { letter: 'A', text: "I'm almost finished with them." },
      { letter: 'B', text: 'Yes, the quarter was difficult.' },
      { letter: 'C', text: "It's in the top drawer." },
    ],
    answer: 'A',
    explanation:
      'Câu hỏi "…ready yet?" hỏi tiến độ; A cho biết sắp xong, trả lời tự nhiên và đúng chức năng. ' +
      'B trả lời như thể câu hỏi là "Was the quarter profitable?", lại không nói gì về số liệu, nên sai. ' +
      'C chỉ vị trí cất đồ, không trả lời tiến độ, nên sai.',
    translation: 'Anh đã tính xong số liệu quý trước chưa? — Tôi sắp xong rồi.',
  },
  {
    id: 'p2-0028',
    part: 2,
    section: 'listening',
    difficulty: 4,
    tags: ['suggestion', 'time'],
    stimulusId: 'g-p2-0028',
    prompt: '',
    choices: [
      { letter: 'A', text: 'The inspector is from the city office.' },
      { letter: 'B', text: 'Thursday is bad for me, unfortunately.' },
      { letter: 'C', text: 'Yes, the site is still being cleaned.' },
    ],
    answer: 'B',
    explanation:
      '"Would Thursday morning work for…?" là lời đề nghị sắp lịch, nên B xác nhận không phù hợp là cách đáp đúng. ' +
      'A cho biết thanh tra thuộc đâu nhưng không trả lời về việc sắp lịch, nên sai. ' +
      'C trả lời Yes/No rồi nói về việc vệ sinh công trường, như thể câu hỏi là "Is the site ready?", nên sai.',
    translation: 'Sáng thứ Năm có hợp để đi kiểm tra công trường không? — Thật tiếc thứ Năm tôi bận.',
  },
]
