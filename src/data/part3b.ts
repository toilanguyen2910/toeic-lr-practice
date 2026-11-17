import { listeningQuestions, listeningStimuli, type ListeningGroup } from './questionBuilders'

/**
 * PART 3 — bổ sung 16 nhóm (p3-0013 … p3-0060), nâng Part 3 lên 20 nhóm × 3 câu = 60 câu.
 *
 * Mỗi nhóm là một hội thoại hai người (W: / M:) trong bối cảnh công sở, đời sống hoặc
 * dịch vụ. Ba câu hỏi của nhóm theo đúng nhịp đề thật: mục đích/chủ đề → chi tiết →
 * suy luận hoặc hành động tiếp theo.
 */
const GROUPS: ListeningGroup[] = [
  {
    id: 'g-p3-0005',
    part: 3,
    audioScript:
      'M: Good morning. I have an appointment to pick up my passport at eleven. Is it ready? ' +
      'W: Let me check the number for you. Ah, I see it here, but the photo you submitted was rejected because ' +
      'you were wearing glasses with a slight reflection. ' +
      "M: Nobody told me about that. I fly out in ten days. " +
      'W: There is still time. There is a photo booth on the second floor. Bring me a new set of photos and ' +
      'I can process the application this afternoon. ' +
      'M: Great. Should I fill in the form again? ' +
      "W: No, the original form is fine. Just the photos.",
    questions: [
      {
        id: 'p3-0013',
        difficulty: 2,
        tags: ['main-topic', 'service'],
        prompt: 'Where does the conversation most likely take place?',
        choices: ['At an airport check-in desk', 'At a photography studio', 'At a passport office', 'At a travel agency'],
        answer: 'C',
        explanation:
          'Người đàn ông đến lấy hộ chiếu theo lịch hẹn, người phụ nữ kiểm tra hồ sơ và nói sẽ "process the application" → C đúng. ' +
          'B sai vì studio chỉ được nhắc tới như nơi chụp lại ảnh, không phải nơi họ đang nói chuyện. ' +
          'A sai vì sân bay chỉ xuất hiện trong lời anh ta nói về chuyến bay sắp tới. ' +
          'D sai vì không ai bàn về việc đặt vé hay đặt tour.',
        translation: 'Cuộc trò chuyện nhiều khả năng diễn ra ở đâu? — Tại một phòng cấp hộ chiếu.',
      },
      {
        id: 'p3-0014',
        difficulty: 3,
        tags: ['detail', 'reason'],
        prompt: 'Why is the man unable to collect his passport?',
        choices: [
          'He arrived on the wrong day.',
          'The photograph did not meet the requirements.',
          'He forgot to bring his identification.',
          'The application form was incomplete.',
        ],
        answer: 'B',
        explanation:
          'Người phụ nữ nói rõ ảnh bị từ chối vì "you were wearing glasses with a slight reflection" → B đúng. ' +
          'A sai vì anh ta đến đúng lịch hẹn lúc mười một giờ. ' +
          'C sai vì giấy tờ tuỳ thân không phải vấn đề được nêu. ' +
          'D sai vì cô ấy khẳng định "the original form is fine", tức đơn không thiếu.',
        translation: 'Vì sao người đàn ông chưa lấy được hộ chiếu? — Ảnh không đáp ứng yêu cầu.',
      },
      {
        id: 'p3-0015',
        difficulty: 2,
        tags: ['future-action', 'detail'],
        prompt: 'What does the woman ask the man to do?',
        choices: [
          'Come back the following morning',
          'Pay an additional processing fee',
          'Complete a new application form',
          'Bring a new set of photographs',
        ],
        answer: 'D',
        explanation:
          '"Bring me a new set of photos" là yêu cầu trực tiếp của người phụ nữ → D đúng. ' +
          'A sai vì cô ấy nói có thể xử lý ngay trong buổi chiều cùng ngày. ' +
          'B sai vì không có khoản phí nào được nhắc tới. ' +
          'C sai vì cô ấy nói rõ đơn cũ vẫn dùng được, chỉ cần ảnh mới.',
        translation: 'Người phụ nữ đề nghị người đàn ông làm gì? — Mang theo một bộ ảnh mới.',
      },
    ],
  },
  {
    id: 'g-p3-0006',
    part: 3,
    audioScript:
      "W: Hi, this is Lisa from the Riverside branch. I'm calling about the training session for the new " +
      'billing system next week. ' +
      'M: Oh, right. We had to postpone it because the software update was delayed. ' +
      'W: Do you have a new date in mind? Our staff have already blocked Wednesday and Thursday. ' +
      "M: The vendor says the update will be live on the fifteenth, so let's aim for the following Tuesday. " +
      'W: That works. Could you send over the agenda so I can brief my team beforehand? ' +
      "M: I'll email it this afternoon. And tell them to bring their laptops, since the session is hands-on.",
    questions: [
      {
        id: 'p3-0016',
        difficulty: 2,
        tags: ['main-topic', 'reason'],
        prompt: 'Why was the training session postponed?',
        choices: [
          'The software update was delayed.',
          'The trainer became unavailable.',
          'The room had already been booked.',
          'Too few staff signed up.',
        ],
        answer: 'A',
        explanation:
          'Người đàn ông nói "We had to postpone it because the software update was delayed" → A đúng. ' +
          'B sai vì giảng viên không phải lý do được nêu. ' +
          'C sai vì không ai nhắc tới việc trùng lịch phòng. ' +
          'D sai vì ngược lại, nhân viên đã giữ sẵn thứ Tư và thứ Năm.',
        translation: 'Vì sao buổi đào tạo bị hoãn? — Vì bản cập nhật phần mềm bị trễ.',
      },
      {
        id: 'p3-0017',
        difficulty: 2,
        tags: ['future-action', 'detail'],
        prompt: 'What will the man do this afternoon?',
        choices: [
          'Confirm the room booking',
          'Contact the software vendor',
          'Email the agenda to the woman',
          'Reschedule the staff briefing',
        ],
        answer: 'C',
        explanation:
          'Anh ấy đáp lời đề nghị bằng "I\'ll email it this afternoon", trong đó "it" là bản chương trình họp → C đúng. ' +
          'A sai vì việc đặt phòng không được nhắc tới. ' +
          'B sai vì anh ta chỉ dẫn lời nhà cung cấp chứ không nói sẽ gọi lại. ' +
          'D sai vì buổi họp giao ban của nhóm cô Lisa do chính cô ấy phụ trách.',
        translation: 'Chiều nay người đàn ông sẽ làm gì? — Gửi email chương trình họp cho người phụ nữ.',
      },
      {
        id: 'p3-0018',
        difficulty: 4,
        tags: ['inference', 'detail'],
        prompt: 'What does the man suggest the staff bring?',
        choices: [
          'Printed copies of the user guide',
          'Their own laptops',
          'A signed attendance form',
          'Their staff identification cards',
        ],
        answer: 'B',
        explanation:
          '"Tell them to bring their laptops, since the session is hands-on" là chỉ dẫn rõ ràng → B đúng. ' +
          'A sai vì không ai nhắc tới tài liệu in. ' +
          'C sai vì không có biểu mẫu điểm danh nào được nêu. ' +
          'D sai vì thẻ nhân viên không được nhắc tới trong hội thoại.',
        translation: 'Người đàn ông đề nghị nhân viên mang theo gì? — Máy tính xách tay của chính họ.',
      },
    ],
  },
  {
    id: 'g-p3-0007',
    part: 3,
    audioScript:
      'M: Ms. Okafor, do you have a moment? I wanted to talk about the supplier contract for the cafeteria. ' +
      'W: Of course. I thought we had already agreed on the terms with Fresh Kitchen. ' +
      "M: We had, but their new quote is nine percent higher than what we budgeted. I looked at two other suppliers. " +
      'W: What do they offer? ' +
      "M: Golden Plate is the same price as before but only delivers twice a week. The other one, Daily Harvest, " +
      'is slightly cheaper and delivers every morning. ' +
      "W: Fresh food matters more than saving a little money. Ask Daily Harvest for a sample menu before we decide.",
    questions: [
      {
        id: 'p3-0019',
        difficulty: 2,
        tags: ['main-topic'],
        prompt: 'What are the speakers mainly discussing?',
        choices: ['Redesigning the cafeteria menu', 'Repairing the kitchen equipment', 'Hiring a new kitchen manager', 'Choosing a new cafeteria supplier'],
        answer: 'D',
        explanation:
          'Hai người so sánh ba nhà cung cấp Fresh Kitchen, Golden Plate và Daily Harvest để chọn đơn vị cung cấp cho căn-tin → D đúng. ' +
          'B sai vì không có thiết bị nào hỏng được nhắc tới. ' +
          'C sai vì không ai bàn chuyện tuyển người. ' +
          'A sai vì thực đơn chỉ được nhắc như tài liệu cần xem, không phải việc thiết kế lại.',
        translation: 'Hai người chủ yếu đang thảo luận điều gì? — Chọn nhà cung cấp mới cho căn-tin.',
      },
      {
        id: 'p3-0020',
        difficulty: 3,
        tags: ['detail', 'comparison'],
        prompt: 'What is the disadvantage of Golden Plate?',
        choices: [
          'Its prices are the highest.',
          'It has stopped delivering to the building.',
          'It delivers only twice a week.',
          'It does not offer fresh food.',
        ],
        answer: 'C',
        explanation:
          'Người đàn ông nói Golden Plate giữ nguyên giá nhưng "only delivers twice a week" → C đúng. ' +
          'A sai vì bên đắt nhất là Fresh Kitchen với mức tăng chín phần trăm. ' +
          'B sai vì không ai nói Golden Plate ngừng giao hàng. ' +
          'D sai vì hội thoại không đánh giá độ tươi của Golden Plate.',
        translation: 'Nhược điểm của Golden Plate là gì? — Họ chỉ giao hàng hai lần một tuần.',
      },
      {
        id: 'p3-0021',
        difficulty: 4,
        tags: ['future-action', 'inference'],
        prompt: 'What will the man most likely do next?',
        choices: [
          'Sign the contract with Fresh Kitchen',
          'Request a sample menu from Daily Harvest',
          'Cancel the cafeteria service for a month',
          'Reduce the cafeteria budget',
        ],
        answer: 'B',
        explanation:
          'Người phụ nữ yêu cầu "Ask Daily Harvest for a sample menu before we decide", nên bước tiếp theo là gửi yêu cầu đó → B đúng. ' +
          'A sai vì bà Okafor chưa quyết và đang cân nhắc bên rẻ hơn. ' +
          'C sai vì không ai nói tới việc huỷ dịch vụ. ' +
          'D sai vì phương án tăng ngân sách mới là điều đang bàn, không phải cắt giảm.',
        translation: 'Người đàn ông nhiều khả năng sẽ làm gì tiếp theo? — Yêu cầu Daily Harvest gửi thực đơn mẫu.',
      },
    ],
  },
  {
    id: 'g-p3-0008',
    part: 3,
    audioScript:
      'W: Dr. Mensah, your two o\'clock patient called to say she will be about twenty minutes late. ' +
      'M: Thank you for letting me know. That gives me time to finish the notes from this morning. ' +
      'W: Also, the supplier of the new examination table phoned. The delivery is scheduled for Thursday between ' +
      'eight and eleven, but they need someone to sign for it. ' +
      "M: I'm in surgery all Thursday morning. Could you ask them to deliver after two? " +
      "W: I'll try. And if they cannot change it, I can come in early and sign.",
    questions: [
      {
        id: 'p3-0022',
        difficulty: 2,
        tags: ['main-topic', 'workplace'],
        prompt: 'Where do the speakers most likely work?',
        choices: ['At a dental clinic', 'At a furniture store', 'At a delivery company', 'At a research library'],
        answer: 'A',
        explanation:
          'Có bệnh nhân, có "examination table" và bác sĩ nói "I\'m in surgery all Thursday morning" → A đúng. ' +
          'B sai vì cửa hàng nội thất không có bệnh nhân hay ca mổ. ' +
          'C sai vì công ty giao hàng chỉ là bên thứ ba gọi tới. ' +
          'D sai vì thư viện không khớp với bối cảnh khám bệnh.',
        translation: 'Hai người nhiều khả năng làm việc ở đâu? — Tại một phòng khám nha khoa.',
      },
      {
        id: 'p3-0023',
        difficulty: 3,
        tags: ['detail', 'request'],
        prompt: 'What does the man ask the woman to do?',
        choices: [
          'Reschedule his afternoon patients',
          'Call the patient back immediately',
          'Ask the supplier to deliver later in the day',
          'Collect the table himself on Thursday',
        ],
        answer: 'C',
        explanation:
          '"Could you ask them to deliver after two?" là đề nghị trực tiếp → C đúng. ' +
          'A sai vì bệnh nhân tự báo sẽ đến muộn, không ai phải dời lịch. ' +
          'B sai vì người phụ nữ đã nhận thông tin, không có yêu cầu gọi lại. ' +
          'D sai vì chính người phụ nữ đề nghị đến sớm ký hộ, không phải anh ta đi lấy bàn.',
        translation: 'Người đàn ông đề nghị người phụ nữ làm gì? — Đề nghị nhà cung cấp giao muộn hơn trong ngày.',
      },
      {
        id: 'p3-0024',
        difficulty: 4,
        tags: ['inference', 'offer'],
        prompt: 'What does the woman offer to do if the delivery time cannot be changed?',
        choices: ['Cancel the order with the supplier', 'Ask another clinic to receive the table', 'Come in early to sign for the delivery', 'Move the surgery to the afternoon'],
        answer: 'C',
        explanation:
          '"I can come in early and sign" là lời đề nghị rõ ràng → C đúng. ' +
          'B sai vì không ai nhắc tới phòng khám khác. ' +
          'A sai vì huỷ đơn không phải phương án được nêu. ' +
          'D sai vì ca mổ do bác sĩ phụ trách, không phải việc cô ấy có thể dời.',
        translation: 'Người phụ nữ đề nghị làm gì nếu không đổi được giờ giao hàng? — Đến sớm để ký nhận.',
      },
    ],
  },
  {
    id: 'g-p3-0009',
    part: 3,
    audioScript:
      'M: I am calling about the apartment advertised on your website, the one on Cedar Lane with two bedrooms. ' +
      'W: Yes, it is still available. The rent is eleven hundred a month, and that includes water but not electricity. ' +
      'M: Is parking included? I have a small car. ' +
      'W: There is one space in the garage at no extra cost. The current tenant moves out at the end of the month, ' +
      'so you could move in from the first. ' +
      "M: I'd like to see it. Would Saturday morning be possible? " +
      'W: Saturday is fully booked. How about Sunday at ten?',
    questions: [
      {
        id: 'p3-0025',
        difficulty: 2,
        tags: ['main-topic', 'request'],
        prompt: 'Why is the man calling?',
        choices: [
          'To schedule a viewing of an apartment',
          'To report a problem with the garage',
          'To complain about the monthly rent',
          'To apply for a parking permit',
        ],
        answer: 'A',
        explanation:
          'Anh ta gọi về căn hộ quảng cáo trên trang web và cuối cùng xin đi xem vào cuối tuần → A đúng. ' +
          'B sai vì anh ta chỉ hỏi chỗ đậu xe có kèm theo không. ' +
          'C sai vì anh ta không phàn nàn về giá. ' +
          'D sai vì giấy phép đỗ xe không phải nội dung cuộc gọi.',
        translation: 'Vì sao người đàn ông gọi điện? — Để hẹn đi xem một căn hộ.',
      },
      {
        id: 'p3-0026',
        difficulty: 2,
        tags: ['detail', 'cost'],
        prompt: 'What is included in the monthly rent?',
        choices: [
          'Electricity and internet',
          'Water and a garage space',
          'Cleaning service and water',
          'Furniture and electricity',
        ],
        answer: 'B',
        explanation:
          'Người phụ nữ nói "includes water but not electricity" và sau đó xác nhận có một chỗ đỗ xe "at no extra cost" → B đúng. ' +
          'A sai vì tiền điện không nằm trong giá thuê và internet không được nhắc tới. ' +
          'C sai vì dịch vụ dọn dẹp không được nêu. ' +
          'D sai vì cả hai thứ này đều không nằm trong giá thuê.',
        translation: 'Giá thuê hằng tháng bao gồm những gì? — Tiền nước và một chỗ đỗ xe.',
      },
      {
        id: 'p3-0027',
        difficulty: 2,
        tags: ['detail', 'time'],
        prompt: 'When will the man most likely see the apartment?',
        choices: ['Saturday morning', 'The first of the month', 'Monday afternoon', 'Sunday at ten'],
        answer: 'D',
        explanation:
          'Người phụ nữ nói thứ Bảy kín lịch rồi đề nghị "How about Sunday at ten?", tức buổi hẹn chốt vào chủ nhật → D đúng. ' +
          'A sai vì chính cô ấy nói thứ Bảy đã kín. ' +
          'C sai vì thứ Hai không được nêu. ' +
          'B sai vì mùng một là ngày có thể chuyển vào ở, không phải buổi xem nhà.',
        translation: 'Khi nào người đàn ông nhiều khả năng sẽ xem căn hộ? — Chủ nhật lúc mười giờ.',
      },
    ],
  },
  {
    id: 'g-p3-0010',
    part: 3,
    audioScript:
      'W: Mr. Bianchi, the print shop called. The banners for the trade fair will not be ready until Wednesday afternoon. ' +
      'M: Wednesday? The fair opens on Thursday morning and the booth has to be set up the night before. ' +
      'W: I know. They offered to deliver them directly to the exhibition centre on Wednesday evening, free of charge. ' +
      "M: That could work if someone is there to receive them. What about the leaflets? " +
      "W: The leaflets are already printed. I'll pick them up tomorrow and bring them to the office.",
    questions: [
      {
        id: 'p3-0028',
        difficulty: 3,
        tags: ['main-topic', 'problem'],
        prompt: 'What problem are the speakers discussing?',
        choices: ['A change of venue for the fair', 'A mistake in the booth design', 'A shortage of leaflets', 'A delay in printing the banners'],
        answer: 'D',
        explanation:
          'Người phụ nữ báo "the banners … will not be ready until Wednesday afternoon", tức bị trễ so với kế hoạch → D đúng. ' +
          'B sai vì thiết kế gian hàng không được nhắc tới. ' +
          'C sai vì tờ rơi đã in xong, không thiếu. ' +
          'A sai vì địa điểm không thay đổi, chỉ có việc giao hàng đổi nơi nhận.',
        translation: 'Hai người đang bàn về vấn đề gì? — Việc in băng-rôn bị trễ.',
      },
      {
        id: 'p3-0029',
        difficulty: 3,
        tags: ['detail', 'offer'],
        prompt: 'What does the print shop offer to do?',
        choices: [
          'Refund the cost of the banners',
          'Deliver the banners to the exhibition centre',
          'Print the banners at a larger size',
          'Finish the banners by Tuesday morning',
        ],
        answer: 'B',
        explanation:
          '"They offered to deliver them directly to the exhibition centre on Wednesday evening, free of charge" → B đúng. ' +
          'A sai vì không có chuyện hoàn tiền. ' +
          'C sai vì kích thước không được bàn tới. ' +
          'D sai vì họ nói sớm nhất là chiều thứ Tư.',
        translation: 'Cửa hàng in đề nghị làm gì? — Giao băng-rôn trực tiếp đến trung tâm triển lãm.',
      },
      {
        id: 'p3-0030',
        difficulty: 2,
        tags: ['future-action', 'detail'],
        prompt: 'What will the woman do tomorrow?',
        choices: [
          'Set up the booth at the fair',
          'Collect the leaflets from the print shop',
          'Call the exhibition centre',
          'Redesign the banners',
        ],
        answer: 'B',
        explanation:
          '"I\'ll pick them up tomorrow and bring them to the office" — "them" là các tờ rơi → B đúng. ' +
          'A sai vì việc dựng gian hàng diễn ra đêm trước ngày hội chợ. ' +
          'C sai vì cô ấy không nói sẽ gọi trung tâm triển lãm. ' +
          'D sai vì không ai bàn việc thiết kế lại.',
        translation: 'Ngày mai người phụ nữ sẽ làm gì? — Lấy tờ rơi ở cửa hàng in.',
      },
    ],
  },
  {
    id: 'g-p3-0011',
    part: 3,
    audioScript:
      'M: Professor Adeyemi, I wanted to ask about the deadline for the research proposal. I have been in hospital ' +
      'for a week and I am behind. ' +
      'W: I am sorry to hear that. The official deadline is Friday, but I can grant an extension of one week ' +
      'if you submit a medical certificate. ' +
      'M: That would help a lot. Do I send it to you or to the department office? ' +
      'W: Send the certificate to the department office and copy me. And do not worry about the proposal itself; ' +
      'the literature review is the part that usually takes longest, so start there.',
    questions: [
      {
        id: 'p3-0031',
        difficulty: 2,
        tags: ['main-topic', 'request'],
        prompt: 'Why does the man speak to the professor?',
        choices: [
          'To ask for more time on an assignment',
          'To change his research topic',
          'To request a letter of recommendation',
          'To report a problem with the library',
        ],
        answer: 'A',
        explanation:
          'Anh ta hỏi về hạn nộp và nói mình đang bị chậm tiến độ → A đúng. ' +
          'B sai vì đề tài không được đổi. ' +
          'C sai vì không có thư giới thiệu nào. ' +
          'D sai vì thư viện không được nhắc tới.',
        translation: 'Vì sao người đàn ông nói chuyện với giáo sư? — Để xin thêm thời gian làm bài tập.',
      },
      {
        id: 'p3-0032',
        difficulty: 3,
        tags: ['detail', 'condition'],
        prompt: 'What must the man do to receive an extension?',
        choices: ['Meet the professor in person', 'Submit the proposal by Friday', 'Present a medical certificate', 'Ask the department head for approval'],
        answer: 'C',
        explanation:
          'Giáo sư nói rõ điều kiện: "if you submit a medical certificate" → C đúng. ' +
          'B sai vì nộp đúng hạn thứ Sáu thì không cần gia hạn nữa. ' +
          'A sai vì buổi trao đổi này đã diễn ra rồi. ' +
          'D sai vì trưởng khoa không phải người duyệt.',
        translation: 'Người đàn ông phải làm gì để được gia hạn? — Nộp giấy chứng nhận y tế.',
      },
      {
        id: 'p3-0033',
        difficulty: 4,
        tags: ['inference', 'advice'],
        prompt: 'What does the professor advise the man to begin with?',
        choices: [
          'The literature review',
          'The conclusion',
          'The data collection',
          'The list of references',
        ],
        answer: 'A',
        explanation:
          '"the literature review is the part that usually takes longest, so start there" là lời khuyên trực tiếp → A đúng. ' +
          'B sai vì không được nhắc tới. ' +
          'C sai vì việc thu thập dữ liệu không được nêu. ' +
          'D sai vì danh mục tài liệu tham khảo không phải phần được khuyên làm trước.',
        translation: 'Giáo sư khuyên người đàn ông nên bắt đầu từ phần nào? — Phần tổng quan tài liệu.',
      },
    ],
  },
  {
    id: 'g-p3-0012',
    part: 3,
    audioScript:
      'W: Good afternoon, this is the maintenance line. How can I help? ' +
      'M: The lift in our building, number fourteen Elm Court, has been stuck on the fourth floor since this morning. ' +
      'We called yesterday about a strange noise, too. ' +
      'W: I can see the report from yesterday. A technician came out but only did a temporary repair. ' +
      'M: My neighbour on the fourth floor uses a wheelchair, so this is urgent. ' +
      "W: I understand. I'll mark it as a priority and send a team within two hours. Could you ask the residents to " +
      'keep the lobby clear so the technicians can bring in their equipment?',
    questions: [
      {
        id: 'p3-0034',
        difficulty: 2,
        tags: ['main-topic', 'problem'],
        prompt: 'What is the man reporting?',
        choices: ['A water leak on the fourth floor', 'A broken window in the lobby', 'A missed rubbish collection', 'A lift that has stopped working'],
        answer: 'D',
        explanation:
          '"The lift … has been stuck on the fourth floor since this morning" là nội dung chính → D đúng. ' +
          'B sai vì cửa sổ không được nhắc tới. ' +
          'C sai vì không có việc thu gom rác nào. ' +
          'A sai vì tầng bốn được nhắc nhưng về người hàng xóm và chiếc lift, không phải rò rỉ nước.',
        translation: 'Người đàn ông đang báo cáo việc gì? — Một chiếc thang máy bị hỏng.',
      },
      {
        id: 'p3-0035',
        difficulty: 3,
        tags: ['detail', 'urgency'],
        prompt: 'Why is the situation especially urgent?',
        choices: [
          'The building is about to be sold.',
          'A resident in a wheelchair lives on the fourth floor.',
          'The technicians are on holiday.',
          'The lift company has closed its office.',
        ],
        answer: 'B',
        explanation:
          '"My neighbour on the fourth floor uses a wheelchair, so this is urgent" → B đúng. ' +
          'A sai vì việc bán toà nhà không được đề cập. ' +
          'C sai vì công ty vẫn cử được đội trong hai giờ. ' +
          'D sai vì tổng đài bảo trì vẫn đang trực.',
        translation: 'Vì sao tình huống này đặc biệt khẩn cấp? — Vì có một cư dân dùng xe lăn sống ở tầng bốn.',
      },
      {
        id: 'p3-0036',
        difficulty: 3,
        tags: ['future-action', 'request'],
        prompt: 'What does the woman ask the man to do?',
        choices: [
          'Keep the lobby clear for the technicians',
          'Bring the equipment up himself',
          'Wait until the next morning',
          'Collect signatures from the residents',
        ],
        answer: 'A',
        explanation:
          '"Could you ask the residents to keep the lobby clear so the technicians can bring in their equipment?" → A đúng. ' +
          'B sai vì đội kỹ thuật tự mang thiết bị, anh ta chỉ cần giữ lối đi thông. ' +
          'C sai vì cô ấy nói sẽ cử đội trong vòng hai giờ. ' +
          'D sai vì chữ ký không được nhắc tới.',
        translation: 'Người phụ nữ đề nghị người đàn ông làm gì? — Giữ sảnh thông thoáng cho đội kỹ thuật.',
      },
    ],
  },
  {
    id: 'g-p3-0013',
    part: 3,
    audioScript:
      'M: Hi Nadia, it is Tom from the events team. I have the final numbers for the customer appreciation dinner. ' +
      'W: Great, how many are we expecting? ' +
      'M: Eighty-two confirmed, but nine of them asked for vegetarian meals. Last year we ordered a hundred and ten plates. ' +
      'W: With eighty-two guests we should order ninety plates to be safe. What about the seating? ' +
      "M: I'll send you the seating plan by Thursday. The hotel needs it at least three days before the event. " +
      "W: Good. Do not forget the awards themselves. They were delayed last year.",
    questions: [
      {
        id: 'p3-0037',
        difficulty: 1,
        tags: ['main-topic', 'numbers'],
        prompt: 'What are the speakers mainly talking about?',
        choices: ['A customer satisfaction survey', 'A change to the hotel menu', 'A staff recruitment event', 'Arrangements for a company dinner'],
        answer: 'D',
        explanation:
          'Hai người bàn số khách dự tiệc, số suất ăn và sơ đồ chỗ ngồi — đều là khâu chuẩn bị cho bữa tiệc tri ân khách hàng → D đúng. ' +
          'B sai vì thực đơn chỉ được nhắc tới ở phần suất ăn chay, không ai sửa thực đơn. ' +
          'C sai vì không có hoạt động tuyển dụng nào. ' +
          'A sai vì khảo sát không hề được nhắc tới.',
        translation: 'Hai người chủ yếu đang bàn về việc gì? — Việc chuẩn bị cho một bữa tiệc của công ty.',
      },
      {
        id: 'p3-0038',
        difficulty: 3,
        tags: ['detail', 'numbers'],
        prompt: 'How many meals does the woman suggest ordering?',
        choices: ['Eighty-two', 'One hundred and ten', 'Ninety', 'Nine'],
        answer: 'C',
        explanation:
          '"With eighty-two guests we should order ninety plates to be safe" → C đúng. ' +
          'B sai vì đó là số suất năm ngoái. ' +
          'A sai vì đó là số khách đã xác nhận, không phải số suất ăn cần đặt. ' +
          'D sai vì đó là số khách yêu cầu suất chay.',
        translation: 'Người phụ nữ đề nghị đặt bao nhiêu suất ăn? — Chín mươi.',
      },
      {
        id: 'p3-0039',
        difficulty: 2,
        tags: ['detail', 'deadline'],
        prompt: 'What will the man send by Thursday?',
        choices: [
          'The seating plan',
          'The catering invoice',
          'The list of vegetarian guests',
          'The award certificates',
        ],
        answer: 'A',
        explanation:
          '"I\'ll send you the seating plan by Thursday" → A đúng. ' +
          'B sai vì hoá đơn không được nhắc tới. ' +
          'C sai vì số khách ăn chay đã được báo bằng lời trong cuộc gọi. ' +
          'D sai vì phần thưởng chỉ được nhắc như việc phải nhớ, không phải tài liệu gửi kèm.',
        translation: 'Người đàn ông sẽ gửi gì trước thứ Năm? — Sơ đồ chỗ ngồi.',
      },
    ],
  },
  {
    id: 'g-p3-0014',
    part: 3,
    audioScript:
      'W: Excuse me, I am looking for the parts department. I ordered a replacement filter for my dishwasher ' +
      'over the phone last week and was told to collect it today. ' +
      'M: Let me check. Could I have the order number, please? ' +
      'W: It is 3391. I have the email here. ' +
      'M: Thank you. The filter has arrived, but I am afraid it is the model for the smaller unit. A colleague ' +
      'may have written down the wrong code. We can order the correct one, and it usually takes four working days. ' +
      'W: Four days is a long time. Do you have it in stock anywhere else in the city? ' +
      'M: I can ring the branch on Castle Road. They often keep a wider range of parts.',
    questions: [
      {
        id: 'p3-0040',
        difficulty: 2,
        tags: ['main-topic', 'service'],
        prompt: 'What does the woman want to do?',
        choices: ['Order a completely new appliance', 'Return a dishwasher she bought', 'Apply for a warranty repair', 'Collect a part she ordered'],
        answer: 'D',
        explanation:
          'Cô ấy nói mình được yêu cầu "collect it today" và có mã đơn hàng → D đúng. ' +
          'B sai vì cô ấy không mang máy rửa bát tới trả. ' +
          'C sai vì bảo hành không được nhắc tới. ' +
          'A sai vì cô ấy chỉ cần một chi tiết thay thế.',
        translation: 'Người phụ nữ muốn làm gì? — Lấy một bộ phận cô ấy đã đặt.',
      },
      {
        id: 'p3-0041',
        difficulty: 3,
        tags: ['detail', 'problem'],
        prompt: 'What is the problem with the order?',
        choices: [
          'The part has not arrived yet.',
          'The order was cancelled by mistake.',
          'The wrong model was ordered.',
          'The price has increased since last week.',
        ],
        answer: 'C',
        explanation:
          'Người đàn ông nói "it is the model for the smaller unit" và rất có thể đã ghi nhầm mã → C đúng. ' +
          'A sai vì anh ta xác nhận "The filter has arrived". ' +
          'B sai vì đơn vẫn còn hiệu lực. ' +
          'D sai vì giá không được nhắc tới.',
        translation: 'Vấn đề của đơn hàng là gì? — Đã đặt sai mẫu.',
      },
      {
        id: 'p3-0042',
        difficulty: 4,
        tags: ['future-action', 'inference'],
        prompt: 'What will the man most likely do next?',
        choices: [
          'Refund the cost of the filter',
          'Call another branch to check stock',
          'Order the part from the manufacturer',
          'Repair the dishwasher himself',
        ],
        answer: 'B',
        explanation:
          '"I can ring the branch on Castle Road. They often keep a wider range of parts" cho thấy bước tiếp theo là gọi chi nhánh kia → B đúng. ' +
          'A sai vì hoàn tiền không được nhắc tới. ' +
          'C sai vì đặt hàng mất bốn ngày, đó là phương án dự phòng sau khi kiểm tra chi nhánh. ' +
          'D sai vì anh ta là nhân viên bán phụ tùng, không phải thợ sửa.',
        translation: 'Người đàn ông nhiều khả năng sẽ làm gì tiếp theo? — Gọi chi nhánh khác để kiểm tra hàng tồn.',
      },
    ],
  },
  {
    id: 'g-p3-0015',
    part: 3,
    audioScript:
      'M: I have reviewed the draft of the annual report you sent. Overall it is strong, but the section on ' +
      'sustainability needs more numbers. ' +
      'W: I thought so too. The problem is that the energy figures for the third quarter are still with the ' +
      'facilities team. ' +
      'M: Then write that section with a placeholder table and we will fill it in later. The printer needs the ' +
      'final file by the twenty-eighth. ' +
      'W: Understood. Should I keep the interview with the chief executive at the beginning? ' +
      'M: Yes, but shorten it by half. Two pages is too long for a report of this length.',
    questions: [
      {
        id: 'p3-0043',
        difficulty: 3,
        tags: ['main-topic', 'feedback'],
        prompt: 'What is the man doing?',
        choices: [
          'Giving feedback on a draft report',
          'Interviewing a job candidate',
          'Explaining a printing error',
          'Presenting quarterly energy figures',
        ],
        answer: 'A',
        explanation:
          'Anh ta nói đã đọc bản nháp và chỉ ra phần nào cần bổ sung, phần nào cần rút ngắn → A đúng. ' +
          'B sai vì không có ứng viên nào. ' +
          'C sai vì lỗi in không được nhắc tới, chỉ có hạn gửi tệp cho nhà in. ' +
          'D sai vì chính anh ta đang thiếu số liệu năng lượng.',
        translation: 'Người đàn ông đang làm gì? — Góp ý cho một bản báo cáo nháp.',
      },
      {
        id: 'p3-0044',
        difficulty: 2,
        tags: ['detail', 'deadline'],
        prompt: 'What is the deadline for the final file?',
        choices: ['Two pages before the interview', 'The third quarter', 'The twenty-eighth', 'The end of the week'],
        answer: 'C',
        explanation:
          '"The printer needs the final file by the twenty-eighth" là hạn chót được nêu → C đúng. ' +
          'B sai vì đó là quý cần lấy số liệu. ' +
          'A sai vì hai trang là độ dài phần phỏng vấn, không phải hạn nộp. ' +
          'D sai vì không ai nhắc tới cuối tuần.',
        translation: 'Hạn chót nộp tệp cuối cùng là khi nào? — Ngày 28.',
      },
      {
        id: 'p3-0045',
        difficulty: 3,
        tags: ['detail', 'instruction'],
        prompt: 'What does the man ask the woman to do with the interview?',
        choices: ['Move it to the end of the report', 'Remove it completely', 'Replace it with a table of figures', 'Cut it to half its current length'],
        answer: 'D',
        explanation:
          '"shorten it by half. Two pages is too long" là chỉ dẫn rõ ràng → D đúng. ' +
          'A sai vì anh ta đồng ý giữ nó ở đầu báo cáo. ' +
          'C sai vì bảng số liệu dành cho phần môi trường, không thay phần phỏng vấn. ' +
          'B sai vì anh ta nói "Yes" khi được hỏi có nên giữ lại không.',
        translation: 'Người đàn ông yêu cầu làm gì với phần phỏng vấn? — Rút ngắn còn một nửa độ dài hiện tại.',
      },
    ],
  },
  {
    id: 'g-p3-0016',
    part: 3,
    audioScript:
      'W: Welcome to the Northgate Dental Practice. Is this your first visit? ' +
      'M: Yes. I chipped a tooth on Saturday and the pain has been getting worse. ' +
      'W: I am sorry to hear that. Dr. Haddad has an emergency slot at four today, but that is with the senior ' +
      'dentist, so the fee is higher. Alternatively, you could see Dr. Lim tomorrow morning at the standard rate. ' +
      'M: I cannot wait until tomorrow. Let us take the four o\'clock. ' +
      'W: Fine. Please arrive fifteen minutes early to complete the registration form and bring a list of any ' +
      'medication you are taking.',
    questions: [
      {
        id: 'p3-0046',
        difficulty: 2,
        tags: ['main-topic', 'reason'],
        prompt: 'Why is the man at the dental practice?',
        choices: [
          'He has a broken tooth that is hurting.',
          'He is applying for a job there.',
          'He needs a routine check-up.',
          'He is collecting a registration form.',
        ],
        answer: 'A',
        explanation:
          '"I chipped a tooth on Saturday and the pain has been getting worse" → A đúng. ' +
          'B sai vì anh ta là bệnh nhân, không phải ứng viên. ' +
          'C sai vì đây là lần đầu đến và lý do là cơn đau cấp. ' +
          'D sai vì biểu mẫu chỉ là thủ tục cần làm trước giờ hẹn.',
        translation: 'Vì sao người đàn ông đến phòng khám nha khoa? — Anh ấy bị mẻ răng và đang đau.',
      },
      {
        id: 'p3-0047',
        difficulty: 3,
        tags: ['detail', 'comparison'],
        prompt: 'What is the disadvantage of the four o\'clock appointment?',
        choices: [
          'It lasts longer than usual.',
          'It costs more than the standard rate.',
          'It is with a dentist he has already seen.',
          'It requires a follow-up visit.',
        ],
        answer: 'B',
        explanation:
          '"that is with the senior dentist, so the fee is higher" → B đúng. ' +
          'A sai vì thời lượng không được nhắc tới. ' +
          'C sai vì đây là lần đầu anh ta đến phòng khám. ' +
          'D sai vì không ai nói cần tái khám.',
        translation: 'Nhược điểm của buổi hẹn lúc bốn giờ là gì? — Chi phí cao hơn mức thông thường.',
      },
      {
        id: 'p3-0048',
        difficulty: 2,
        tags: ['future-action', 'detail'],
        prompt: 'What is the man asked to bring?',
        choices: ['His insurance card', 'A referral letter', 'Proof of address', 'A list of his medication'],
        answer: 'D',
        explanation:
          '"bring a list of any medication you are taking" là yêu cầu trực tiếp → D đúng. ' +
          'A sai vì thẻ bảo hiểm không được nhắc tới. ' +
          'C sai vì chứng minh địa chỉ không được nêu. ' +
          'B sai vì giấy giới thiệu không xuất hiện trong hội thoại.',
        translation: 'Người đàn ông được yêu cầu mang theo gì? — Danh sách các loại thuốc đang dùng.',
      },
    ],
  },
  {
    id: 'g-p3-0017',
    part: 3,
    audioScript:
      'M: Thanks for meeting me on such short notice. I want to talk about the delivery routes for the new ' +
      'supermarket contract. ' +
      'W: I have looked at the schedule. Three vans will not be enough if we have to reach twelve stores before ' +
      'seven in the morning. ' +
      'M: Agreed. What if we hire two more vehicles for the first three months? ' +
      'W: That is expensive, but cheaper than losing the contract. I can get quotes from two rental companies ' +
      'by Monday. ' +
      'M: Do that. And check whether their vans have refrigeration, because the dairy products must stay below ' +
      'four degrees.',
    questions: [
      {
        id: 'p3-0049',
        difficulty: 3,
        tags: ['main-topic', 'planning'],
        prompt: 'What are the speakers discussing?',
        choices: [
          'Adding vehicles for a new delivery contract',
          'Reducing the number of supermarket clients',
          'Repairing three broken vans',
          'Changing the company opening hours',
        ],
        answer: 'A',
        explanation:
          'Hai người bàn việc ba xe không đủ và phương án thuê thêm hai xe cho hợp đồng mới → A đúng. ' +
          'B sai vì họ đang tìm cách phục vụ đủ mười hai cửa hàng, không cắt bớt. ' +
          'C sai vì không nói xe nào hỏng. ' +
          'D sai vì giờ mở cửa công ty không được nhắc tới.',
        translation: 'Hai người đang bàn việc gì? — Bổ sung xe cho một hợp đồng giao hàng mới.',
      },
      {
        id: 'p3-0050',
        difficulty: 3,
        tags: ['detail', 'reason'],
        prompt: 'Why does the woman think three vans are not enough?',
        choices: [
          'The drivers work only part-time.',
          'Twelve stores must be reached before seven.',
          'The vans are too old to use daily.',
          'The supermarket is far from the depot.',
        ],
        answer: 'B',
        explanation:
          '"Three vans will not be enough if we have to reach twelve stores before seven in the morning" → B đúng. ' +
          'A sai vì lịch làm của tài xế không được nêu. ' +
          'C sai vì tuổi xe không được nhắc tới. ' +
          'D sai vì khoảng cách chỉ được đề cập gián tiếp ở ý "reach before seven", không phải lý do chính được nêu.',
        translation: 'Vì sao người phụ nữ cho rằng ba xe là không đủ? — Phải đến mười hai cửa hàng trước bảy giờ.',
      },
      {
        id: 'p3-0051',
        difficulty: 4,
        tags: ['detail', 'requirement'],
        prompt: 'What must the man check about the hired vans?',
        choices: ['Whether the drivers speak English', 'Whether they are less than five years old', 'Whether they have refrigeration', 'Whether they can carry twelve pallets'],
        answer: 'C',
        explanation:
          '"check whether their vans have refrigeration, because the dairy products must stay below four degrees" → C đúng. ' +
          'B sai vì tuổi xe không được nêu. ' +
          'A sai vì trình độ ngoại ngữ của tài xế không được bàn. ' +
          'D sai vì số pa-lét không được nhắc tới.',
        translation: 'Người đàn ông phải kiểm tra điều gì ở xe thuê? — Xe có hệ thống làm lạnh hay không.',
      },
    ],
  },
  {
    id: 'g-p3-0018',
    part: 3,
    audioScript:
      'W: I have the results of the customer survey here. Satisfaction with the checkout speed fell from ' +
      'eighty-one percent to sixty-four. ' +
      'M: That is a big drop. Did we change anything at the tills recently? ' +
      'W: We installed the new payment terminals in March, and the staff had only one afternoon of training. ' +
      'M: That probably explains it. What do customers say in the comments? ' +
      'W: Several mention that the screens are confusing and that they were not offered a receipt. ' +
      'M: Then let us run two short refresher sessions and ask the terminal supplier for a simpler screen layout.',
    questions: [
      {
        id: 'p3-0052',
        difficulty: 2,
        tags: ['main-topic', 'problem'],
        prompt: 'What problem are the speakers discussing?',
        choices: [
          'A decline in checkout satisfaction',
          'A rise in product prices',
          'A shortage of cashiers',
          'A delay in opening a new store',
        ],
        answer: 'A',
        explanation:
          '"Satisfaction with the checkout speed fell from eighty-one percent to sixty-four" là vấn đề chính → A đúng. ' +
          'B sai vì giá sản phẩm không được nhắc tới. ' +
          'C sai vì số thu ngân không được bàn. ' +
          'D sai vì việc mở cửa hàng mới không được đề cập.',
        translation: 'Hai người đang bàn về vấn đề gì? — Sự sụt giảm mức độ hài lòng ở quầy thu ngân.',
      },
      {
        id: 'p3-0053',
        difficulty: 3,
        tags: ['detail', 'reason'],
        prompt: 'What does the woman suggest caused the problem?',
        choices: ['Fewer customers visiting the store', 'A change in the store layout', 'Higher prices during the holiday period', 'Too little staff training on new terminals'],
        answer: 'D',
        explanation:
          '"the staff had only one afternoon of training" ngay sau khi nói về thiết bị mới cho thấy đây là nguyên nhân cô ấy nêu → D đúng. ' +
          'B sai vì việc thay đổi cách bày biện không được nhắc tới. ' +
          'C sai vì giá không nằm trong cuộc trao đổi. ' +
          'A sai vì lượng khách không được đề cập, chỉ có mức độ hài lòng.',
        translation: 'Người phụ nữ cho rằng nguyên nhân là gì? — Nhân viên được đào tạo quá ít về thiết bị mới.',
      },
      {
        id: 'p3-0054',
        difficulty: 4,
        tags: ['future-action', 'detail'],
        prompt: 'What will the speakers most likely do?',
        choices: [
          'Reinstall the old payment terminals',
          'Run refresher training and request a simpler layout',
          'Hire additional cashiers for peak hours',
          'Offer discounts to dissatisfied customers',
        ],
        answer: 'B',
        explanation:
          '"let us run two short refresher sessions and ask the terminal supplier for a simpler screen layout" → B đúng. ' +
          'A sai vì không ai đề nghị quay lại thiết bị cũ. ' +
          'C sai vì thu ngân không phải vấn đề được nêu. ' +
          'D sai vì giảm giá không được nhắc tới.',
        translation: 'Hai người nhiều khả năng sẽ làm gì? — Tổ chức đào tạo nhắc lại và đề nghị bố cục màn hình đơn giản hơn.',
      },
    ],
  },
  {
    id: 'g-p3-0019',
    part: 3,
    audioScript:
      'M: Hello, I am calling about the photography course starting in September. Is there still a place? ' +
      'W: There are two places left, but the evening group is nearly full. The morning group has more room. ' +
      'M: I work during the day, so it has to be the evening. Does the fee cover the materials? ' +
      'W: It covers the course and the darkroom materials, but you will need your own camera. ' +
      'M: That is fine. Is there a discount if I pay for the full term in advance? ' +
      'W: Yes, ten percent. Most students take that option.',
    questions: [
      {
        id: 'p3-0055',
        difficulty: 1,
        tags: ['main-topic', 'request'],
        prompt: 'Why is the man calling?',
        choices: [
          'To enrol in a photography course',
          'To buy a new camera',
          'To rent a darkroom for a project',
          'To apply for a teaching position',
        ],
        answer: 'A',
        explanation:
          'Anh ta hỏi còn chỗ trong khoá nhiếp ảnh tháng Chín không và hỏi học phí → A đúng. ' +
          'B sai vì anh ta tự có máy ảnh, chỉ cần xác nhận yêu cầu đó. ' +
          'C sai vì phòng tối chỉ là một phần vật tư của khoá học. ' +
          'D sai vì anh ta là học viên, không phải người xin dạy.',
        translation: 'Vì sao người đàn ông gọi điện? — Để đăng ký một khoá học nhiếp ảnh.',
      },
      {
        id: 'p3-0056',
        difficulty: 2,
        tags: ['detail', 'reason'],
        prompt: 'Why does the man choose the evening group?',
        choices: ['It is cheaper than the morning group.', 'It has a more experienced teacher.', 'The morning group is already full.', 'He works during the day.'],
        answer: 'D',
        explanation:
          '"I work during the day, so it has to be the evening" → D đúng. ' +
          'A sai vì học phí không khác nhau giữa hai nhóm. ' +
          'C sai vì chính người phụ nữ nói nhóm sáng còn nhiều chỗ. ' +
          'B sai vì giảng viên không được bàn tới.',
        translation: 'Vì sao người đàn ông chọn nhóm học buổi tối? — Vì ban ngày anh ấy đi làm.',
      },
      {
        id: 'p3-0057',
        difficulty: 3,
        tags: ['detail', 'cost'],
        prompt: 'What does the course fee NOT include?',
        choices: ['Darkroom materials', 'A camera', 'The full term of lessons', 'Access to the studio'],
        answer: 'B',
        explanation:
          '"you will need your own camera" cho thấy máy ảnh không nằm trong học phí → B đúng. ' +
          'A sai vì học phí "covers … the darkroom materials". ' +
          'C sai vì học phí bao trọn khoá học. ' +
          'D sai vì phòng tối là một phần được chi trả, không có ngoại lệ nào được nêu.',
        translation: 'Học phí KHÔNG bao gồm khoản nào? — Máy ảnh.',
      },
    ],
  },
  {
    id: 'g-p3-0020',
    part: 3,
    audioScript:
      'W: Mr. Tanaka, the caterers need a final decision on the menu for the anniversary lunch by tomorrow. ' +
      'M: Remind me what the choices are. ' +
      'W: The first option is a hot buffet with two main dishes. The second is a set menu served at the table, ' +
      'which is a little more formal. ' +
      'M: Half our guests are visiting from overseas. Would a set menu be easier for them? ' +
      'W: Possibly, but some of them have dietary restrictions, and the buffet makes that easier to manage. ' +
      'M: Then let us go with the buffet and ask for clear labels on each dish.',
    questions: [
      {
        id: 'p3-0058',
        difficulty: 2,
        tags: ['main-topic', 'decision'],
        prompt: 'What are the speakers deciding?',
        choices: ['Where to hold an anniversary lunch', 'Which caterer to hire', 'Which menu to order for an event', 'How many overseas guests to invite'],
        answer: 'C',
        explanation:
          'Hai người so sánh hai phương án thực đơn và chốt chọn buffet → C đúng. ' +
          'B sai vì nhà cung cấp dịch vụ ăn uống đã có. ' +
          'A sai vì địa điểm không được bàn. ' +
          'D sai vì số khách nước ngoài chỉ được nêu làm bối cảnh.',
        translation: 'Hai người đang quyết định điều gì? — Chọn thực đơn nào cho một sự kiện.',
      },
      {
        id: 'p3-0059',
        difficulty: 3,
        tags: ['detail', 'comparison'],
        prompt: 'What advantage of the buffet does the woman mention?',
        choices: [
          'It is cheaper than the set menu.',
          'It makes dietary restrictions easier to manage.',
          'It can be served more quickly.',
          'It includes more dessert options.',
        ],
        answer: 'B',
        explanation:
          '"some of them have dietary restrictions, and the buffet makes that easier to manage" → B đúng. ' +
          'A sai vì giá không được so sánh. ' +
          'C sai vì tốc độ phục vụ không được nêu. ' +
          'D sai vì món tráng miệng không được nhắc tới.',
        translation: 'Người phụ nữ nêu ưu điểm nào của hình thức buffet? — Dễ xử lý hơn với các yêu cầu ăn kiêng.',
      },
      {
        id: 'p3-0060',
        difficulty: 2,
        tags: ['future-action', 'detail'],
        prompt: 'What does the man ask the woman to request?',
        choices: [
          'Labels on each dish',
          'Extra serving staff',
          'A vegetarian set menu',
          'A later start time',
        ],
        answer: 'A',
        explanation:
          '"ask for clear labels on each dish" là yêu cầu cuối cùng → A đúng. ' +
          'B sai vì nhân viên phục vụ không được nhắc tới. ' +
          'C sai vì các yêu cầu ăn kiêng mới chỉ được nêu khái quát. ' +
          'D sai vì không ai nói tới giờ bắt đầu.',
        translation: 'Người đàn ông yêu cầu người phụ nữ đề nghị điều gì? — Gắn nhãn rõ ràng cho từng món.',
      },
    ],
  },
]

export const PART3B_STIMULI = listeningStimuli(GROUPS)
export const PART3B_QUESTIONS = listeningQuestions(GROUPS)
