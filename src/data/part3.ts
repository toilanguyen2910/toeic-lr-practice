import type { Question, Stimulus } from '../types'

/**
 * PART 3 — Hội thoại ngắn (4 nhóm × 3 câu = 12 câu).
 *
 * Mỗi `audioScript` là một hội thoại hai người (W: / M:), bối cảnh công sở.
 * Ba câu hỏi của mỗi nhóm đi theo cấu trúc quen thuộc của đề thật:
 * câu 1 hỏi mục đích/chủ đề, câu 2 hỏi chi tiết, câu 3 hỏi suy luận hoặc hành động tiếp theo.
 */
export const PART3_STIMULI: Stimulus[] = [
  {
    id: 'g-p3-0001',
    part: 3,
    audioScript:
      'M: Good morning, Nina. Do you have a minute to go over the launch event for the new tablet? ' +
      "W: Sure. I was just looking at the venue quotes. The Grand Hall downtown wants four thousand dollars for the evening. " +
      "M: That's well above what we budgeted. What about the Riverside Conference Center? We used it for the software launch last spring. " +
      "W: They quoted twenty-eight hundred, and that includes the projector and the sound system. " +
      "M: Then let's book Riverside. I'll call them this afternoon and confirm. Could you send me the guest list so I can finalize the invitations? " +
      "W: I'll have it to you by lunchtime.",
  },
  {
    id: 'g-p3-0002',
    part: 3,
    audioScript:
      "W: Mr. Alvarez, thank you for coming in. I've reviewed your application for the logistics coordinator position. " +
      'You mentioned three years at a freight company. What did that involve? ' +
      'M: I coordinated shipments between our warehouse and about forty retail stores. I also handled the customs paperwork for imports. ' +
      "W: That's relevant. The role here would also involve negotiating rates with shipping companies. Have you done much of that? " +
      "M: Some. I sat in on negotiations, but my manager usually led them. I'd be comfortable taking the lead after some training. " +
      "W: Good. The next step is a short written test, and then we'll contact you by the end of the week.",
  },
  {
    id: 'g-p3-0003',
    part: 3,
    audioScript:
      "M: Ms. Duarte, I'm booking your trip to the trade fair in Frankfurt. The direct flight on Tuesday is sold out, " +
      "so I'm looking at one with a stop in Dubai that arrives at six in the evening. " +
      'W: Six is too late. My first meeting is at eight that evening. Is there anything earlier? ' +
      "M: There's a seven a.m. departure that gets in at two. It costs about two hundred dollars more. " +
      'W: Book that one, please. And could you reserve a hotel within walking distance of the convention center? ' +
      'The one I stayed in last year was a thirty-minute taxi ride. ' +
      "M: I'll find something nearby and send you the confirmation today.",
  },
  {
    id: 'g-p3-0004',
    part: 3,
    audioScript:
      'W: Thank you for calling Harbor Office Supply. How can I help you? ' +
      'M: Hello, this is Daniel from Fletcher and Company. We ordered twelve ergonomic chairs two weeks ago, ' +
      'and the delivery this morning brought only nine. ' +
      "W: I'm sorry about that. Let me look up the order. I see it here: twelve chairs, invoice 4471. " +
      'The warehouse may have split the shipment. ' +
      'M: Nothing on the packing slip mentions a second delivery, and we need all twelve for a new office that opens on Monday. ' +
      "W: I understand. I'll have the remaining three sent by express courier tomorrow morning and waive the delivery fee. " +
      'Could you email me the packing slip so I can attach it to the claim? ' +
      "M: Sure, I'll send it right away.",
  },
]

export const PART3_QUESTIONS: Question[] = [
  // ---------- Nhóm 1: chọn địa điểm cho buổi ra mắt sản phẩm ----------
  {
    id: 'p3-0001',
    part: 3,
    section: 'listening',
    difficulty: 2,
    tags: ['main-topic', 'detail'],
    stimulusId: 'g-p3-0001',
    prompt: 'What are the speakers mainly discussing?',
    choices: [
      { letter: 'A', text: 'A budget for a television advertisement' },
      { letter: 'B', text: 'A schedule for staff training' },
      { letter: 'C', text: 'A design change for a tablet' },
      { letter: 'D', text: 'A venue for a product launch' },
    ],
    answer: 'D',
    explanation:
      'Mở đầu hội thoại, người đàn ông nói "go over the launch event for the new tablet", sau đó hai người so sánh ' +
      'giá thuê của Grand Hall và Riverside Conference Center — trọng tâm là chọn địa điểm, nên D đúng. ' +
      'A sai vì quảng cáo truyền hình không được nhắc tới, con số được bàn là giá thuê hội trường. ' +
      'B sai vì không có nội dung đào tạo nhân viên nào. ' +
      'C sai vì máy tính bảng chỉ là sản phẩm sắp ra mắt, không ai bàn đến thiết kế.',
    translation:
      'Hai người chủ yếu đang bàn về: Địa điểm cho buổi ra mắt sản phẩm. ' +
      '(Hội thoại: cùng xem báo giá thuê hội trường cho buổi ra mắt máy tính bảng mới.)',
  },
  {
    id: 'p3-0002',
    part: 3,
    section: 'listening',
    difficulty: 3,
    tags: ['detail', 'reason'],
    stimulusId: 'g-p3-0001',
    prompt: 'Why does the man reject the Grand Hall?',
    choices: [
      { letter: 'A', text: 'It does not have a sound system.' },
      { letter: 'B', text: 'It is too far from the office.' },
      { letter: 'C', text: 'It is already booked that evening.' },
      { letter: 'D', text: 'It is too expensive for their budget.' },
    ],
    answer: 'D',
    explanation:
      'Ông ấy nói ngay sau khi nghe báo giá: "That\'s well above what we budgeted" — tức là bốn nghìn đô vượt ngân sách, nên D đúng. ' +
      'C sai vì Grand Hall vẫn còn trống và vẫn đưa ra giá thuê; không ai nói hội trường đã bị đặt. ' +
      'A sai vì hội thoại không hề nói Grand Hall thiếu hệ thống âm thanh; chi tiết "includes the projector and the sound system" ' +
      'là của gói bên Riverside, không phải lý do loại Grand Hall. ' +
      'B sai vì khoảng cách không được hai người nhắc đến.',
    translation:
      'Vì sao người đàn ông loại Grand Hall? — Vì giá vượt quá ngân sách của họ. ' +
      '(Ông ấy nói: "Bốn nghìn đô là vượt xa mức chúng ta dự trù".)',
  },
  {
    id: 'p3-0003',
    part: 3,
    section: 'listening',
    difficulty: 2,
    tags: ['future-action', 'detail'],
    stimulusId: 'g-p3-0001',
    prompt: 'What will the woman do by lunchtime?',
    choices: [
      { letter: 'A', text: 'Revise the event budget' },
      { letter: 'B', text: 'Call the Riverside Conference Center' },
      { letter: 'C', text: 'Send the man a guest list' },
      { letter: 'D', text: 'Print the invitations' },
    ],
    answer: 'C',
    explanation:
      'Người đàn ông nhờ "Could you send me the guest list", và bà ấy trả lời "I\'ll have it to you by lunchtime" — ' +
      'tức sẽ gửi danh sách khách mời trước bữa trưa, nên C đúng. ' +
      'B sai vì chính người đàn ông nói "I\'ll call them this afternoon". ' +
      'D sai vì anh ấy mới là người sẽ hoàn tất thiệp mời. ' +
      'A sai vì không ai được giao sửa lại ngân sách; họ chỉ chọn phương án rẻ hơn.',
    translation:
      'Người phụ nữ sẽ làm gì trước giờ ăn trưa? — Gửi cho người đàn ông danh sách khách mời.',
  },

  // ---------- Nhóm 2: phỏng vấn tuyển dụng ----------
  {
    id: 'p3-0004',
    part: 3,
    section: 'listening',
    difficulty: 2,
    tags: ['inference', 'workplace'],
    stimulusId: 'g-p3-0002',
    prompt: 'Where most likely does this conversation take place?',
    choices: [
      { letter: 'A', text: 'At a trade fair' },
      { letter: 'B', text: 'At a warehouse inspection' },
      { letter: 'C', text: 'At a job interview' },
      { letter: 'D', text: 'At a staff training session' },
    ],
    answer: 'C',
    explanation:
      'Các dấu hiệu: "thank you for coming in", "I\'ve reviewed your application for the logistics coordinator position", ' +
      'câu hỏi về kinh nghiệm và bước tiếp theo là bài kiểm tra viết — đây là một buổi phỏng vấn tuyển dụng, nên C đúng. ' +
      'D sai vì người phụ nữ đang đánh giá ứng viên chứ không giảng bài. ' +
      'A sai vì không có gian hàng hay sản phẩm nào. ' +
      'B sai vì kho hàng chỉ được nhắc lại như kinh nghiệm cũ của ứng viên.',
    translation:
      'Hội thoại nhiều khả năng diễn ra ở đâu? — Ở một buổi phỏng vấn tuyển dụng. ' +
      '("Cảm ơn anh đã đến. Tôi đã xem đơn ứng tuyển vị trí điều phối logistics của anh.")',
  },
  {
    id: 'p3-0005',
    part: 3,
    section: 'listening',
    difficulty: 3,
    tags: ['detail', 'work-experience'],
    stimulusId: 'g-p3-0002',
    prompt: 'What did the man do in his previous job?',
    choices: [
      { letter: 'A', text: 'He hired and trained warehouse staff.' },
      { letter: 'B', text: 'He designed the company customs forms.' },
      { letter: 'C', text: 'He negotiated shipping rates with carriers.' },
      { letter: 'D', text: 'He coordinated shipments between a warehouse and retail stores.' },
    ],
    answer: 'D',
    explanation:
      'Ông ấy nói rõ: "I coordinated shipments between our warehouse and about forty retail stores" — nên D đúng. ' +
      'C sai vì đó chính là việc ông ấy CHƯA làm nhiều: "I sat in on negotiations, but my manager usually led them". ' +
      'A sai vì không có việc tuyển dụng hay đào tạo nhân viên nào được nhắc. ' +
      'B sai vì ông ấy chỉ "handled the customs paperwork", tức làm thủ tục giấy tờ hải quan, không phải thiết kế biểu mẫu.',
    translation:
      'Người đàn ông đã làm gì ở công việc trước? — Anh ấy điều phối các lô hàng giữa kho và các cửa hàng bán lẻ.',
  },
  {
    id: 'p3-0006',
    part: 3,
    section: 'listening',
    difficulty: 2,
    tags: ['future-action', 'inference'],
    stimulusId: 'g-p3-0002',
    prompt: 'What will happen next?',
    choices: [
      { letter: 'A', text: 'The man will meet the warehouse team.' },
      { letter: 'B', text: 'The woman will call the man\'s former manager.' },
      { letter: 'C', text: 'The man will take a written test.' },
      { letter: 'D', text: 'The woman will offer him the job immediately.' },
    ],
    answer: 'C',
    explanation:
      'Người phụ nữ kết luận: "The next step is a short written test" — bước tiếp theo là bài kiểm tra viết, nên C đúng. ' +
      'A sai vì việc gặp đội kho không được nhắc tới; kho chỉ là nơi anh ấy từng làm. ' +
      'B sai vì không ai nói sẽ gọi cho quản lý cũ. ' +
      'D sai vì bà ấy nói sẽ liên hệ vào cuối tuần, tức còn phải qua bài kiểm tra chứ chưa nhận việc ngay.',
    translation:
      'Điều gì sẽ diễn ra tiếp theo? — Người đàn ông sẽ làm một bài kiểm tra viết ngắn.',
  },

  // ---------- Nhóm 3: chuyến công tác và đặt phòng ----------
  {
    id: 'p3-0007',
    part: 3,
    section: 'listening',
    difficulty: 2,
    tags: ['main-topic', 'request'],
    stimulusId: 'g-p3-0003',
    prompt: 'What is the man doing for the woman?',
    choices: [
      { letter: 'A', text: 'Arranging her travel to a trade fair' },
      { letter: 'B', text: 'Preparing a report on a convention center' },
      { letter: 'C', text: 'Hiring a taxi for a client visit' },
      { letter: 'D', text: 'Rescheduling a meeting in Frankfurt' },
    ],
    answer: 'A',
    explanation:
      'Ông ấy nói: "I\'m booking your trip to the trade fair in Frankfurt", rồi đưa ra các phương án chuyến bay ' +
      'và hứa tìm khách sạn — đó là thu xếp chuyến đi, nên A đúng. ' +
      'B sai vì hội nghị chỉ là địa điểm đến, không ai viết báo cáo về nó. ' +
      'C sai vì taxi chỉ được nhắc khi bà ấy kể lại chuyến đi năm ngoái. ' +
      'D sai vì cuộc hẹn ở Frankfurt vẫn giữ nguyên, chỉ chuyến bay được đổi.',
    translation:
      'Người đàn ông đang làm gì cho người phụ nữ? — Thu xếp chuyến đi của bà ấy tới hội chợ thương mại.',
  },
  {
    id: 'p3-0008',
    part: 3,
    section: 'listening',
    difficulty: 3,
    tags: ['detail', 'reason'],
    stimulusId: 'g-p3-0003',
    prompt: 'Why does the woman reject the flight with a stop in Dubai?',
    choices: [
      { letter: 'A', text: 'It is more expensive than the direct flight.' },
      { letter: 'B', text: 'It arrives too late for her first meeting.' },
      { letter: 'C', text: 'It has no seats left in business class.' },
      { letter: 'D', text: 'It requires an overnight stay in Dubai.' },
    ],
    answer: 'B',
    explanation:
      'Bà ấy nói ngay khi nghe giờ hạ cánh: "Six is too late. My first meeting is at eight that evening" — đến lúc 6 giờ thì quá muộn, nên B đúng. ' +
      'A sai vì chuyến có điểm dừng KHÔNG phải chuyến đắt hơn: chuyến 7 giờ sáng mới "costs about two hundred dollars more". ' +
      'C sai vì hạng ghế không được nhắc tới. ' +
      'D sai vì chỉ là quá cảnh, không ai nói phải ngủ lại Dubai.',
    translation:
      'Vì sao người phụ nữ từ chối chuyến bay quá cảnh ở Dubai? — Vì nó đến quá muộn so với cuộc họp đầu tiên của bà ấy.',
  },
  {
    id: 'p3-0009',
    part: 3,
    section: 'listening',
    difficulty: 4,
    tags: ['inference', 'listening-detail'],
    stimulusId: 'g-p3-0003',
    prompt: 'What does the woman imply about the hotel she used last year?',
    choices: [
      { letter: 'A', text: 'It was too expensive.' },
      { letter: 'B', text: 'It was far from the venue.' },
      { letter: 'C', text: 'Its rooms were too small.' },
      { letter: 'D', text: 'It had already been fully booked.' },
    ],
    answer: 'B',
    explanation:
      'Bà ấy nhắc lại khách sạn năm ngoái ngay sau khi yêu cầu đặt phòng "within walking distance of the convention center", ' +
      'rồi nói chuyến taxi mất ba mươi phút — ngụ ý khách sạn đó quá xa, đi lại bất tiện, nên B đúng. ' +
      'A sai vì không có con số hay lời phàn nàn nào về giá phòng. ' +
      'C sai vì diện tích phòng không được nhắc. ' +
      'D sai vì khách sạn năm ngoái đã từng ở được, vấn đề chỉ là khoảng cách; việc "hết phòng" không ai nói tới.',
    translation:
      'Người phụ nữ ngụ ý gì về khách sạn bà ấy ở năm ngoái? — Nó quá xa trung tâm hội nghị nên đi lại bất tiện. ' +
      '("Khách sạn tôi ở năm ngoái phải đi taxi ba mươi phút.")',
  },

  // ---------- Nhóm 4: khiếu nại đơn hàng thiếu ----------
  {
    id: 'p3-0010',
    part: 3,
    section: 'listening',
    difficulty: 2,
    tags: ['main-topic', 'problem-solving'],
    stimulusId: 'g-p3-0004',
    prompt: 'Why is the man calling?',
    choices: [
      { letter: 'A', text: 'To report that part of his order is missing' },
      { letter: 'B', text: 'To ask for a discount on office chairs' },
      { letter: 'C', text: 'To change the address for a delivery' },
      { letter: 'D', text: 'To cancel an order for a new office' },
    ],
    answer: 'A',
    explanation:
      'Ông ấy nói đã đặt mười hai ghế nhưng "the delivery this morning brought only nine" — tức báo thiếu hàng, nên A đúng. ' +
      'B sai vì ông ấy không xin giảm giá; chính người phụ nữ tự đề nghị miễn phí giao hàng. ' +
      'C sai vì địa chỉ giao hàng không được nhắc tới. ' +
      'D sai vì ông ấy cần đủ cả mười hai ghế cho văn phòng mới, tức muốn giữ đơn chứ không huỷ.',
    translation:
      'Vì sao người đàn ông gọi điện? — Để báo rằng một phần đơn hàng của anh ấy bị thiếu.',
  },
  {
    id: 'p3-0011',
    part: 3,
    section: 'listening',
    difficulty: 3,
    tags: ['detail', 'problem-solving'],
    stimulusId: 'g-p3-0004',
    prompt: 'What does the woman offer to do?',
    choices: [
      { letter: 'A', text: 'Refund the full price of the order' },
      { letter: 'B', text: 'Send the remaining chairs by express courier and waive the delivery fee' },
      { letter: 'C', text: 'Replace all twelve chairs with a different model' },
      { letter: 'D', text: 'Deliver the chairs to a different office' },
    ],
    answer: 'B',
    explanation:
      'Bà ấy nói: "I\'ll have the remaining three sent by express courier tomorrow morning and waive the delivery fee" — ' +
      'gửi nốt ba chiếc bằng chuyển phát nhanh và miễn phí giao hàng, nên B đúng. ' +
      'A sai vì không có việc hoàn tiền toàn bộ; đơn hàng vẫn được giao tiếp. ' +
      'C sai vì không ai đề cập đổi sang mẫu ghế khác. ' +
      'D sai vì địa chỉ giao hàng giữ nguyên.',
    translation:
      'Người phụ nữ đề nghị làm gì? — Gửi nốt số ghế còn lại bằng chuyển phát nhanh và miễn phí giao hàng.',
  },
  {
    id: 'p3-0012',
    part: 3,
    section: 'listening',
    difficulty: 2,
    tags: ['future-action', 'detail'],
    stimulusId: 'g-p3-0004',
    prompt: 'What will the man most likely do next?',
    choices: [
      { letter: 'A', text: 'Email the packing slip' },
      { letter: 'B', text: 'Call the warehouse manager' },
      { letter: 'C', text: 'Return the nine chairs' },
      { letter: 'D', text: 'Postpone the office opening' },
    ],
    answer: 'A',
    explanation:
      'Người phụ nữ nhờ "Could you email me the packing slip so I can attach it to the claim?", và ông ấy đáp ' +
      '"Sure, I\'ll send it right away" — nên A đúng. ' +
      'B sai vì người phụ nữ mới là người liên hệ bộ phận kho để kiểm tra. ' +
      'C sai vì ông ấy cần đủ mười hai ghế, không trả lại số đã nhận. ' +
      'D sai vì lễ khai trương vẫn giữ nguyên thứ Hai, và việc gửi hàng nhanh là để kịp ngày đó.',
    translation:
      'Người đàn ông nhiều khả năng sẽ làm gì tiếp theo? — Gửi email kèm phiếu đóng gói.',
  },
]
