import { listeningQuestions, listeningStimuli, type ListeningGroup } from './questionBuilders'

/**
 * PART 4 — bổ sung 12 nhóm (p4-0010 … p4-0045), nâng Part 4 lên 15 nhóm × 3 câu = 45 câu.
 *
 * Mỗi nhóm là một bài nói một người: thông báo nội bộ, tin nhắn thoại, quảng cáo dịch vụ,
 * hướng dẫn viên du lịch, thông báo sân bay… Ba câu hỏi đi theo nhịp mục đích → chi tiết →
 * suy luận/hành động tiếp theo.
 */
const GROUPS: ListeningGroup[] = [
  {
    id: 'g-p4-0004',
    part: 4,
    audioScript:
      'Good morning, everyone. This is Priya from the design studio with the weekly update. ' +
      'The client has approved the packaging concepts we presented on Tuesday, so we can move to the final artwork. ' +
      'Please have all print files ready by Thursday afternoon, because the supplier needs them before the weekend. ' +
      'One change: the client wants the logo slightly larger on the front panel. ' +
      'I have updated the template on the shared drive, so please download it again rather than using last month\'s ' +
      'version. If you have any questions, my calendar is open between two and four this afternoon.',
    questions: [
      {
        id: 'p4-0010',
        difficulty: 2,
        tags: ['main-topic', 'notice'],
        prompt: 'What is the purpose of the message?',
        choices: [
        'To announce the loss of a client',
        'To introduce a new member of the studio',
        'To give a weekly update on a design project',
        'To explain a change in office hours',
      ],
        answer: 'C',
        explanation:
          'Người nói tự giới thiệu đây là "the weekly update" của studio thiết kế và thông báo tiến độ dự án → C đúng. ' +
          'B sai vì cô ấy tự giới thiệu mình, không giới thiệu người mới. ' +
          'A sai vì khách hàng vừa phê duyệt chứ không rời bỏ. ' +
          'D sai vì giờ làm việc không được nêu.',
        translation: 'Mục đích của thông báo là gì? — Cập nhật hằng tuần về một dự án thiết kế.',
      },
      {
        id: 'p4-0011',
        difficulty: 3,
        tags: ['detail', 'deadline'],
        prompt: 'What must the listeners do by Thursday afternoon?',
        choices: [
          'Present new packaging concepts',
          'Finish the print files',
          'Contact the supplier directly',
          'Reschedule a meeting with the client',
        ],
        answer: 'B',
        explanation:
          '"Please have all print files ready by Thursday afternoon" là yêu cầu trực tiếp → B đúng. ' +
          'A sai vì buổi trình bày phương án đã diễn ra hôm thứ Ba. ' +
          'C sai vì nhà cung cấp không nhận liên hệ trực tiếp từ họ. ' +
          'D sai vì không ai nói tới việc dời lịch họp.',
        translation: 'Người nghe phải hoàn thành gì trước chiều thứ Năm? — Toàn bộ tệp in.',
      },
      {
        id: 'p4-0012',
        difficulty: 4,
        tags: ['detail', 'change'],
        prompt: 'What change does the client want?',
        choices: [
        'A different colour for the packaging',
        'A new supplier for the printing',
        'A larger logo on the front panel',
        'An earlier delivery date',
      ],
        answer: 'C',
        explanation:
          '"the client wants the logo slightly larger on the front panel" → C đúng. ' +
          'A sai vì màu sắc không được nhắc tới. ' +
          'B sai vì nhà cung cấp vẫn giữ nguyên. ' +
          'D sai vì ngày giao hàng không đổi, chỉ có hạn nộp tệp.',
        translation: 'Khách hàng muốn thay đổi điều gì? — Logo lớn hơn một chút ở mặt trước.',
      },
    ],
  },
  {
    id: 'g-p4-0005',
    part: 4,
    audioScript:
      'Hi, this is Daniel Reyes returning your call about the office furniture order. ' +
      'I checked with our warehouse and the two standing desks you asked about are in stock, but the ergonomic chairs ' +
      'are back-ordered until the middle of next month. ' +
      'I can send the desks this week and the chairs as soon as they arrive, with no second delivery charge. ' +
      'Alternatively, we have a similar chair model in grey that is available immediately. ' +
      'If you would like to see it, I can bring one to your office on Wednesday morning. ' +
      'Please call me back on extension 47 before noon tomorrow to let me know.',
    questions: [
      {
        id: 'p4-0013',
        difficulty: 2,
        tags: ['main-topic', 'purpose'],
        prompt: 'Why is the speaker calling?',
        choices: [
          'To respond to a question about an order',
          'To advertise a new office chair',
          'To complain about a late delivery',
          'To confirm a change of warehouse address',
        ],
        answer: 'A',
        explanation:
          '"this is Daniel Reyes returning your call about the office furniture order" — anh ta gọi lại để trả lời về đơn hàng → A đúng. ' +
          'B sai vì anh ta không chào bán, chỉ nêu một phương án thay thế. ' +
          'C sai vì anh ta là bên bán, không phải bên phàn nàn. ' +
          'D sai vì địa chỉ kho không được nhắc tới.',
        translation: 'Vì sao người nói gọi điện? — Để trả lời câu hỏi về một đơn hàng.',
      },
      {
        id: 'p4-0014',
        difficulty: 2,
        tags: ['detail', 'availability'],
        prompt: 'Which item is not currently available?',
        choices: [
        'The standing desks',
        'The grey chair model',
        'The ergonomic chairs',
        'The delivery service',
      ],
        answer: 'C',
        explanation:
          '"the ergonomic chairs are back-ordered until the middle of next month" → C đúng. ' +
          'A sai vì ông ấy xác nhận bàn đứng còn hàng. ' +
          'B sai vì mẫu ghế xám "is available immediately". ' +
          'D sai vì dịch vụ giao hàng vẫn hoạt động bình thường.',
        translation: 'Món hàng nào hiện không có sẵn? — Ghế công thái học.',
      },
      {
        id: 'p4-0015',
        difficulty: 3,
        tags: ['future-action', 'detail'],
        prompt: 'What does the speaker offer to do on Wednesday morning?',
        choices: [
          'Deliver all the furniture at once',
          'Bring a chair to the listener\'s office',
          'Collect the old chairs for recycling',
          'Meet the listener at the warehouse',
        ],
        answer: 'B',
        explanation:
          '"I can bring one to your office on Wednesday morning" — "one" là chiếc ghế mẫu xám → B đúng. ' +
          'A sai vì ông ấy đề nghị gửi bàn trước, ghế sau. ' +
          'C sai vì việc thu hồi ghế cũ không được nhắc tới. ' +
          'D sai vì cuộc gặp đề xuất diễn ra tại văn phòng người nghe.',
        translation: 'Người nói đề nghị làm gì vào sáng thứ Tư? — Mang một chiếc ghế đến văn phòng người nghe.',
      },
    ],
  },
  {
    id: 'g-p4-0006',
    part: 4,
    audioScript:
      'Ladies and gentlemen, welcome aboard the seven forty-five service to Brighton. ' +
      'If you are travelling with us today, please note that the carriage at the very front is reserved for passengers ' +
      'with reduced mobility and their companions. ' +
      'The buffet car is in carriage C, towards the middle of the train, and will open shortly after departure. ' +
      'Because of engineering work near Croydon, we will take a slightly longer route, and the journey will take ' +
      'about ninety minutes instead of seventy. ' +
      'We expect to arrive at eleven minutes past nine. We apologise for the delay and thank you for travelling with us.',
    questions: [
      {
        id: 'p4-0016',
        difficulty: 2,
        tags: ['main-topic', 'announcement'],
        prompt: 'Where is this announcement most likely being made?',
        choices: [
        'At a railway station ticket office',
        'At an airport departure gate',
        'On board a train',
        'In a bus terminal',
      ],
        answer: 'C',
        explanation:
          '"welcome aboard", "carriage B" và "buffet car" đều là từ ngữ của tàu hoả, và thông báo được đưa ra ngay trước khi chạy → C đúng. ' +
          'A sai vì đây là lời chào trên phương tiện, không phải quầy vé. ' +
          'B sai vì sân bay không có toa tàu hay toa ăn. ' +
          'D sai vì bến xe không dùng từ "carriage".',
        translation: 'Thông báo này nhiều khả năng được đưa ra ở đâu? — Trên một đoàn tàu.',
      },
      {
        id: 'p4-0017',
        difficulty: 3,
        tags: ['detail', 'reason'],
        prompt: 'Why will the journey take longer than usual?',
        choices: [
          'The train is overcrowded.',
          'Engineering work is taking place near Croydon.',
          'A carriage has been removed from the train.',
          'The buffet car is closed.',
        ],
        answer: 'B',
        explanation:
          '"Because of engineering work near Croydon, we will take a slightly longer route" → B đúng. ' +
          'A sai vì số lượng khách không được nêu là nguyên nhân. ' +
          'C sai vì không có toa nào bị gỡ, chỉ có một toa được dành riêng. ' +
          'D sai vì toa ăn sẽ mở ngay sau khi tàu chạy.',
        translation: 'Vì sao hành trình lần này lâu hơn bình thường? — Có công trình kỹ thuật gần Croydon.',
      },
      {
        id: 'p4-0018',
        difficulty: 4,
        tags: ['detail', 'location'],
        prompt: 'Where can passengers find the buffet car?',
        choices: [
        'At the very front of the train',
        'Next to the ticket office',
        'In carriage C',
        'Behind the last carriage',
      ],
        answer: 'C',
        explanation:
          '"The buffet car is in carriage B, towards the middle of the train" → C đúng. ' +
          'A sai vì toa đầu tiên dành cho người cần hỗ trợ đi lại. ' +
          'B sai vì quầy vé không nằm trên tàu. ' +
          'D sai vì toa ăn ở giữa đoàn tàu chiều dài chứ không phải cuối.',
        translation: 'Hành khách có thể tìm toa phục vụ ăn uống ở đâu? — Ở toa C.',
      },
    ],
  },
  {
    id: 'g-p4-0007',
    part: 4,
    audioScript:
      'Thank you for calling Greenfield Dental. Our clinic will be closed for renovation from the third to the ' +
      'seventh of October. ' +
      'During that period, patients with urgent problems should call the emergency line at the number shown on our ' +
      'website, and a dentist will see you at the partner clinic on Mill Road. ' +
      'If you already have an appointment booked in that week, our reception team will contact you this week to ' +
      'arrange a new time. ' +
      'We reopen on the eighth of October with two additional treatment rooms, which means we will be able to offer ' +
      'more evening appointments.',
    questions: [
      {
        id: 'p4-0019',
        difficulty: 2,
        tags: ['main-topic', 'notice'],
        prompt: 'What is the purpose of the message?',
        choices: [
          'To explain a temporary closure of a clinic',
          'To advertise a new partner clinic',
          'To announce the retirement of a dentist',
          'To recruit new reception staff',
        ],
        answer: 'A',
        explanation:
          'Thông báo cho biết phòng khám đóng cửa để cải tạo từ ngày 3 đến ngày 7 tháng Mười → A đúng. ' +
          'B sai vì phòng khám đối tác chỉ được nhắc tới như nơi khám thay. ' +
          'C sai vì không có ai nghỉ hưu. ' +
          'D sai vì không có hoạt động tuyển dụng nào.',
        translation: 'Mục đích của thông báo là gì? — Giải thích việc một phòng khám tạm đóng cửa.',
      },
      {
        id: 'p4-0020',
        difficulty: 3,
        tags: ['detail', 'instruction'],
        prompt: 'What should patients with urgent problems do during the closure?',
        choices: [
        'Come to the clinic as usual',
        'Wait until the eighth of October',
        'Call the emergency line',
        'Send an email to reception',
      ],
        answer: 'C',
        explanation:
          '"patients with urgent problems should call the emergency line" → C đúng. ' +
          'A sai vì phòng khám đóng cửa để cải tạo. ' +
          'B sai vì có phương án khám ở phòng khám đối tác. ' +
          'D sai vì email không được nhắc tới.',
        translation: 'Bệnh nhân có vấn đề khẩn cấp nên làm gì trong thời gian đóng cửa? — Gọi đường dây khẩn cấp.',
      },
      {
        id: 'p4-0021',
        difficulty: 4,
        tags: ['inference', 'detail'],
        prompt: 'What benefit is mentioned about the renovated clinic?',
        choices: [
          'It will be open at weekends.',
          'It will offer more evening appointments.',
          'It will no longer need appointments.',
          'It will move to Mill Road permanently.',
        ],
        answer: 'B',
        explanation:
          '"two additional treatment rooms, which means we will be able to offer more evening appointments" → B đúng. ' +
          'A sai vì giờ mở cửa cuối tuần không được nêu. ' +
          'C sai vì vẫn cần đặt lịch, ngay cả khi có thêm lịch buổi tối. ' +
          'D sai vì Mill Road là nơi phòng khám đối tác, không phải địa chỉ mới.',
        translation: 'Lợi ích nào được nêu cho phòng khám sau cải tạo? — Sẽ có nhiều lịch hẹn buổi tối hơn.',
      },
    ],
  },
  {
    id: 'g-p4-0008',
    part: 4,
    audioScript:
      'Welcome to the Norwood Museum of Transport. Before you begin your visit, a few practical points. ' +
      'The main exhibition on the second floor is open until half past five, but the workshop area in the basement ' +
      'closes at four. ' +
      'Photography without a flash is allowed throughout the museum. ' +
      'For families, there is a free discovery trail aimed at children aged five to eight; pick up a leaflet at the ' +
      'information desk. ' +
      'Finally, the café on the ground floor closes fifteen minutes earlier than the museum itself, so please place ' +
      'your orders before four forty-five.',
    questions: [
      {
        id: 'p4-0022',
        difficulty: 2,
        tags: ['main-topic', 'announcement'],
        prompt: 'What is the purpose of this talk?',
        choices: [
        'To train new museum guides',
        'To advertise a new exhibition',
        'To give visitors practical information about the museum',
        'To request donations for a workshop',
      ],
        answer: 'C',
        explanation:
          '"a few practical points" rồi lần lượt nêu giờ mở cửa các khu, quy định chụp ảnh và quầy cà phê → C đúng. ' +
          'B sai vì triển lãm chính không phải nội dung quảng bá mới. ' +
          'A sai vì người nghe là khách tham quan. ' +
          'D sai vì không có lời kêu gọi quyên góp.',
        translation: 'Mục đích của bài nói là gì? — Cung cấp thông tin thực tế cho khách tham quan bảo tàng.',
      },
      {
        id: 'p4-0023',
        difficulty: 3,
        tags: ['detail', 'time'],
        prompt: 'Which area closes earliest?',
        choices: [
        'The main exhibition',
        'The information desk',
        'The café',
        'The workshop area',
      ],
        answer: 'D',
        explanation:
          'Khu hội thảo ở tầng hầm đóng lúc bốn giờ, sớm hơn triển lãm chính (năm giờ rưỡi) và quầy cà phê (bốn giờ bốn lăm) → D đúng. ' +
          'A sai vì triển lãm chính mở đến năm giờ rưỡi. ' +
          'C sai vì quầy cà phê đóng lúc bốn giờ bốn lăm, muộn hơn khu hội thảo. ' +
          'B sai vì giờ đóng của quầy thông tin không được nêu.',
        translation: 'Khu vực nào đóng cửa sớm nhất? — Khu hội thảo.',
      },
      {
        id: 'p4-0024',
        difficulty: 4,
        tags: ['detail', 'rule'],
        prompt: 'What are visitors allowed to do?',
        choices: [
        'Eat in the main exhibition hall',
        'Touch the exhibits in the workshop',
        'Take photographs without a flash',
        'Enter the basement after four',
      ],
        answer: 'C',
        explanation:
          '"Photography without a flash is allowed throughout the museum" → C đúng. ' +
          'B sai vì không ai nói được chạm vào hiện vật. ' +
          'A sai vì việc ăn uống chỉ gắn với quầy cà phê, không phải hội trường triển lãm. ' +
          'D sai vì khu tầng hầm đóng lúc bốn giờ.',
        translation: 'Khách tham quan được phép làm gì? — Chụp ảnh không dùng đèn flash.',
      },
    ],
  },
  {
    id: 'g-p4-0009',
    part: 4,
    audioScript:
      'Good afternoon. I am leaving this message for Ms. Park of the Westbridge Hotel regarding the conference ' +
      'booking for the twenty-second. ' +
      'We have sixty delegates registered and had originally reserved the larger hall, but our chairperson now ' +
      'needs to leave early, so we would prefer to finish by four rather than six. ' +
      'Is it possible to move the lunch break forward to half past twelve? ' +
      'Also, three delegates have asked for gluten-free meals, which I did not mention in the original form. ' +
      'Please call me back on my mobile and leave a message if I do not answer, as I will be in meetings until noon.',
    questions: [
      {
        id: 'p4-0025',
        difficulty: 2,
        tags: ['main-topic', 'purpose'],
        prompt: 'Why is the speaker leaving a message?',
        choices: [
        'To complain about the quality of the food',
        'To cancel a hotel reservation completely',
        'To confirm the number of hotel rooms needed',
        'To change arrangements for a conference booking',
      ],
        answer: 'D',
        explanation:
          'Người nói đề nghị dời giờ ăn trưa, kết thúc sớm hơn và bổ sung suất ăn kiêng — đều là thay đổi so với đơn ban đầu → D đúng. ' +
          'B sai vì đơn chưa hề bị huỷ. ' +
          'C sai vì số phòng không được nhắc tới, chỉ có số đại biểu. ' +
          'A sai vì không có lời phàn nàn nào về đồ ăn.',
        translation: 'Vì sao người nói để lại tin nhắn? — Để thay đổi các thoả thuận cho một đơn đặt hội nghị.',
      },
      {
        id: 'p4-0026',
        difficulty: 3,
        tags: ['detail', 'reason'],
        prompt: 'Why does the speaker want to finish earlier?',
        choices: [
        'The hotel closes at four.',
        'The venue is double-booked.',
        'The chairperson has to leave early.',
        'The delegates arrive late.',
      ],
        answer: 'C',
        explanation:
          '"our chairperson now needs to leave early, so we would prefer to finish by four rather than six" → C đúng. ' +
          'A sai vì khách sạn không bị giới hạn giờ đóng trong thông tin này. ' +
          'B sai vì đơn đặt phòng vẫn giữ hội trường lớn. ' +
          'D sai vì việc đến muộn không được nhắc tới.',
        translation: 'Vì sao người nói muốn kết thúc sớm hơn? — Vì chủ toạ phải rời đi sớm.',
      },
      {
        id: 'p4-0027',
        difficulty: 2,
        tags: ['detail', 'addition'],
        prompt: 'What extra information does the speaker add?',
        choices: [
        'The hotel must provide a projector.',
        'The event will use a smaller room.',
        'Two speakers have withdrawn from the programme.',
        'Three delegates need gluten-free meals.',
      ],
        answer: 'D',
        explanation:
          '"three delegates have asked for gluten-free meals, which I did not mention in the original form" → D đúng. ' +
          'B sai vì họ vẫn giữ hội trường lớn như ban đầu. ' +
          'C sai vì không có diễn giả nào rút. ' +
          'A sai vì máy chiếu không được nhắc tới.',
        translation: 'Người nói bổ sung thông tin gì? — Ba đại biểu cần suất ăn không chứa gluten.',
      },
    ],
  },
  {
    id: 'g-p4-0010',
    part: 4,
    audioScript:
      'Thank you for choosing Alton Financial for your business account. This short message explains what happens ' +
      'on your first day as a customer. ' +
      'Your account number has already been sent by post and should arrive within three working days. ' +
      'You can download the mobile app now, but you will only be able to sign in once the welcome letter arrives, ' +
      'because it contains a security code. ' +
      'Card payments to existing suppliers will not be affected, so you can keep your usual payment schedule. ' +
      'A relationship manager will contact you before the end of the month to discuss any further services you may need.',
    questions: [
      {
        id: 'p4-0028',
        difficulty: 2,
        tags: ['main-topic', 'instructions'],
        prompt: 'What is the speaker explaining?',
        choices: [
        'Why interest rates have changed',
        'How to close a bank account',
        'How to apply for a mortgage',
        'What happens after opening a business account',
      ],
        answer: 'D',
        explanation:
          '"explains what happens on your first day as a customer" và các bước nhận thư, ký hợp đồng số → D đúng. ' +
          'B sai vì nội dung nói về việc bắt đầu dùng dịch vụ. ' +
          'C sai vì thế chấp không được nhắc tới. ' +
          'A sai vì lãi suất không được đề cập.',
        translation: 'Người nói đang giải thích điều gì? — Những gì diễn ra sau khi mở tài khoản doanh nghiệp.',
      },
      {
        id: 'p4-0029',
        difficulty: 3,
        tags: ['detail', 'condition'],
        prompt: 'What must happen before customers can sign in to the app?',
        choices: [
          'They must visit a branch in person.',
          'They must receive the welcome letter.',
          'They must contact a relationship manager.',
          'They must make their first card payment.',
        ],
        answer: 'B',
        explanation:
          '"you will only be able to sign in once the welcome letter arrives, because it contains a security code" → B đúng. ' +
          'A sai vì không ai yêu cầu đến chi nhánh. ' +
          'C sai vì người quản lý quan hệ chỉ liên hệ cuối tháng. ' +
          'D sai vì thanh toán bằng thẻ không phải điều kiện đăng nhập.',
        translation: 'Khách hàng phải làm gì trước khi đăng nhập được ứng dụng? — Phải nhận được thư chào mừng.',
      },
      {
        id: 'p4-0030',
        difficulty: 2,
        tags: ['detail', 'reassurance'],
        prompt: 'What does the speaker say will NOT be affected?',
        choices: [
        'The mobile app',
        'The security code',
        'Card payments to existing suppliers',
        'The relationship manager visit',
      ],
        answer: 'C',
        explanation:
          '"Card payments to existing suppliers will not be affected" → C đúng. ' +
          'A sai vì ứng dụng phải chờ thư mới dùng được. ' +
          'B sai vì mã bảo mật là nội dung của lá thư, không phải thứ bị ảnh hưởng. ' +
          'D sai vì người quản lý sẽ liên hệ trong tháng.',
        translation: 'Người nói cho biết điều gì sẽ KHÔNG bị ảnh hưởng? — Các khoản thanh toán bằng thẻ cho nhà cung cấp hiện tại.',
      },
    ],
  },
  {
    id: 'g-p4-0011',
    part: 4,
    audioScript:
      'Hello, this is a message for the parents of children enrolled in the summer swimming programme at ' +
      'Eastcliff Pool. ' +
      'Lessons next week will start thirty minutes later than usual because the pool is being cleaned in the ' +
      'mornings: that means nine thirty rather than nine. ' +
      'Children should still arrive ten minutes before the lesson to change. ' +
      'Please also remember that goggles are now compulsory for all levels, and the pool shop sells them at the ' +
      'reception desk. ' +
      'If your child has an inhaler, please leave it with the instructor at the start of each lesson.',
    questions: [
      {
        id: 'p4-0031',
        difficulty: 2,
        tags: ['main-topic', 'reason'],
        prompt: 'Why will lessons start later next week?',
        choices: [
        'The pool shop is opening late.',
        'The instructors are attending training.',
        'The children arrive late school.',
        'The pool is being cleaned in the mornings.',
      ],
        answer: 'D',
        explanation:
          '"because the pool is being cleaned in the mornings" → D đúng. ' +
          'B sai vì việc tập huấn giảng viên không được nêu. ' +
          'C sai vì bản thân học sinh vẫn phải đến sớm mười phút. ' +
          'A sai vì cửa hàng ở quầy lễ tân không liên quan việc dời giờ.',
        translation: 'Vì sao tuần sau buổi học bắt đầu muộn hơn? — Vì bể bơi được vệ sinh vào buổi sáng.',
      },
      {
        id: 'p4-0032',
        difficulty: 2,
        tags: ['detail', 'rule'],
        prompt: 'What is now compulsory for all levels?',
        choices: ['Swimming caps', 'Goggles', 'A medical certificate', 'A parent on the poolside'],
        answer: 'B',
        explanation:
          '"goggles are now compulsory for all levels" → B đúng. ' +
          'A sai vì mũ bơi không được nhắc tới. ' +
          'C sai vì chỉ có trường hợp ống hít thở cần gửi lại cho giảng viên. ' +
          'D sai vì việc phụ huynh đứng cạnh bể không được đề cập.',
        translation: 'Vật dụng nào hiện là bắt buộc ở mọi cấp độ? — Kính bơi.',
      },
      {
        id: 'p4-0033',
        difficulty: 4,
        tags: ['detail', 'instruction'],
        prompt: 'What should parents of a child with an inhaler do?',
        choices: [
          'Leave it with the instructor at the start of each lesson',
          'Buy a spare one from the pool shop',
          'Keep it in the changing room',
          'Ask the reception desk to store it',
        ],
        answer: 'A',
        explanation:
          '"please leave it with the instructor at the start of each lesson" → A đúng. ' +
          'B sai vì cửa hàng chỉ bán kính bơi. ' +
          'C sai vì không ai nói để trong phòng thay đồ. ' +
          'D sai vì quầy lễ tân chỉ là nơi bán kính bơi.',
        translation: 'Phụ huynh của trẻ dùng ống hít nên làm gì? — Gửi lại cho giảng viên vào đầu mỗi buổi học.',
      },
    ],
  },
  {
    id: 'g-p4-0012',
    part: 4,
    audioScript:
      'Good evening and thank you for joining the Northfield Community Library annual meeting. ' +
      'This year we lent forty-two thousand items, an increase of nine percent, and our evening reading group ' +
      'doubled in size. ' +
      'However, use of the study rooms fell, because the booking system has been unavailable since the spring. ' +
      'We are pleased to announce that a new system will be installed in November. ' +
      'We also want to hear from you: a short survey is available at the front desk and online, and it closes at the ' +
      'end of the month. ' +
      'The library will remain open as usual during the installation, though the study rooms will be closed for two days.',
    questions: [
      {
        id: 'p4-0034',
        difficulty: 2,
        tags: ['main-topic', 'report'],
        prompt: 'What is the speaker mainly doing?',
        choices: [
        'Collecting fines for overdue books',
        'Training new library volunteers',
        'Advertising a new library branch',
        'Reporting on the library\'s year at a meeting',
      ],
        answer: 'D',
        explanation:
          'Người nói nêu số lượng tài liệu cho mượn, tình hình các nhóm đọc và kế hoạch sắp tới tại cuộc họp thường niên → D đúng. ' +
          'B sai vì không có nội dung đào tạo. ' +
          'C sai vì không có chi nhánh mới nào. ' +
          'A sai vì tiền phạt không được nhắc tới.',
        translation: 'Người nói chủ yếu đang làm gì? — Báo cáo hoạt động trong năm của thư viện tại một cuộc họp.',
      },
      {
        id: 'p4-0035',
        difficulty: 3,
        tags: ['detail', 'reason'],
        prompt: 'Why did use of the study rooms decrease?',
        choices: [
          'The rooms were redecorated.',
          'The booking system has been unavailable.',
          'The library reduced its opening hours.',
          'Students began studying elsewhere.',
        ],
        answer: 'B',
        explanation:
          '"use of the study rooms fell, because the booking system has been unavailable since the spring" → B đúng. ' +
          'A sai vì việc sửa sang không được nêu. ' +
          'C sai vì giờ mở cửa vẫn giữ nguyên. ' +
          'D sai vì lý do được nêu rõ là hệ thống đặt phòng, không phải sở thích của sinh viên.',
        translation: 'Vì sao việc sử dụng các phòng tự học giảm? — Vì hệ thống đặt phòng không hoạt động.',
      },
      {
        id: 'p4-0036',
        difficulty: 4,
        tags: ['future-action', 'detail'],
        prompt: 'What does the speaker ask the audience to do?',
        choices: [
          'Complete a short survey',
          'Volunteer for the reading group',
          'Return their overdue items',
          'Attend the November installation',
        ],
        answer: 'A',
        explanation:
          '"a short survey is available at the front desk and online … we also want to hear from you" → A đúng. ' +
          'B sai vì nhóm đọc đã tăng gấp đôi, không có lời kêu gọi tình nguyện. ' +
          'C sai vì tài liệu quá hạn không được nhắc tới. ' +
          'D sai vì người nghe không cần có mặt khi lắp đặt hệ thống.',
        translation: 'Người nói đề nghị khán giả làm gì? — Hoàn thành một bản khảo sát ngắn.',
      },
    ],
  },
  {
    id: 'g-p4-0013',
    part: 4,
    audioScript:
      'This is an automated message from Rapid Parcel about your delivery scheduled for today between two and five. ' +
      'Our driver attempted delivery at two fifteen but could not obtain a signature. ' +
      'You can either arrange a new delivery for tomorrow, at no extra cost, or collect the parcel from the depot ' +
      'on Fulton Road after four today. ' +
      'Please bring photographic identification if you collect in person. ' +
      'If we do not hear from you within three days, the parcel will be returned to the sender. ' +
      'To choose an option, press one to speak to an agent or visit our website.',
    questions: [
      {
        id: 'p4-0037',
        difficulty: 2,
        tags: ['main-topic', 'notice'],
        prompt: 'Why is this message being sent?',
        choices: [
        'A delivery charge was calculated incorrectly.',
        'A parcel was delivered to the wrong address.',
        'A parcel was damaged in transit.',
        'A delivery could not be completed.',
      ],
        answer: 'D',
        explanation:
          '"Our driver attempted delivery … but could not obtain a signature" cho thấy giao hàng không thành công → D đúng. ' +
          'B sai vì không có địa chỉ sai nào được nêu. ' +
          'C sai vì hư hỏng không được nhắc tới. ' +
          'A sai vì phí giao hàng không phải chủ đề.',
        translation: 'Vì sao tin nhắn này được gửi? — Một lần giao hàng không hoàn tất.',
      },
      {
        id: 'p4-0038',
        difficulty: 2,
        tags: ['detail', 'option'],
        prompt: 'What can the listener do at no extra cost?',
        choices: [
          'Arrange delivery for the following day',
          'Ask for the parcel to be sent to another city',
          'Request a refund of the delivery fee',
          'Have the parcel held for a month',
        ],
        answer: 'A',
        explanation:
          '"arrange a new delivery for tomorrow, at no extra cost" → A đúng. ' +
          'B sai vì không có phương án chuyển thành phố khác. ' +
          'C sai vì hoàn phí không được nhắc tới. ' +
          'D sai vì thời hạn giữ chỉ là ba ngày.',
        translation: 'Người nghe có thể làm gì mà không mất thêm phí? — Sắp xếp giao lại vào ngày mai.',
      },
      {
        id: 'p4-0039',
        difficulty: 4,
        tags: ['detail', 'requirement'],
        prompt: 'What should the listener bring when collecting the parcel?',
        choices: [
          'The delivery note',
          'Photographic identification',
          'A printed confirmation email',
          'Proof of payment',
        ],
        answer: 'B',
        explanation:
          '"Please bring photographic identification if you collect in person" → B đúng. ' +
          'A sai vì phiếu giao hàng không được nhắc tới. ' +
          'C sai vì email xác nhận không được nêu. ' +
          'D sai vì chứng từ thanh toán không nằm trong yêu cầu.',
        translation: 'Người nghe nên mang gì khi đến nhận hàng? — Giấy tờ tuỳ thân có ảnh.',
      },
    ],
  },
  {
    id: 'g-p4-0014',
    part: 4,
    audioScript:
      'Good morning, this is the project office with an update on the harbour footbridge. ' +
      'The concrete work finished ahead of schedule, so the bridge will open to pedestrians a fortnight earlier ' +
      'than planned, on the eighteenth rather than the second of next month. ' +
      'The official opening ceremony will still take place on the second, as the mayor is unavailable before then. ' +
      'Residents should note that the path along the quay will be closed for resurfacing from Monday for five days. ' +
      'A temporary crossing has been marked near the boathouse, and signs will direct you from the main car park.',
    questions: [
      {
        id: 'p4-0040',
        difficulty: 2,
        tags: ['main-topic', 'update'],
        prompt: 'What is the purpose of the announcement?',
        choices: [
        'To recruit workers for a bridge project',
        'To advertise a new car park',
        'To explain a change in bus routes',
        'To update residents on a construction project',
      ],
        answer: 'D',
        explanation:
          'Thông báo nêu tiến độ cầu đi bộ, ngày mở cửa và việc đóng đường tạm thời → D đúng. ' +
          'B sai vì bãi đỗ xe chỉ được nhắc làm mốc chỉ đường. ' +
          'C sai vì tuyến xe buýt không được nêu. ' +
          'A sai vì không có hoạt động tuyển dụng.',
        translation: 'Mục đích của thông báo là gì? — Cập nhật cho cư dân về một dự án xây dựng.',
      },
      {
        id: 'p4-0041',
        difficulty: 3,
        tags: ['detail', 'change'],
        prompt: 'What change has been made to the schedule?',
        choices: [
        'The crossing will close for five weeks.',
        'The ceremony has been cancelled.',
        'The concrete work will start next month.',
        'The bridge will open earlier than planned.',
      ],
        answer: 'D',
        explanation:
          '"the bridge will open to pedestrians a fortnight earlier than planned" → D đúng. ' +
          'B sai vì lễ khai trương vẫn giữ nguyên ngày mùng hai. ' +
          'C sai vì phần bê tông đã xong trước tiến độ. ' +
          'A sai vì đường đi bị đóng năm ngày, không phải năm tuần.',
        translation: 'Lịch trình có thay đổi gì? — Cây cầu sẽ mở sớm hơn dự kiến.',
      },
      {
        id: 'p4-0042',
        difficulty: 4,
        tags: ['detail', 'instruction'],
        prompt: 'What is provided for pedestrians during the closure?',
        choices: [
          'A temporary crossing near the boathouse',
          'A shuttle bus to the main car park',
          'An extra footbridge over the harbour',
          'A guided route through the construction site',
        ],
        answer: 'A',
        explanation:
          '"A temporary crossing has been marked near the boathouse" → A đúng. ' +
          'B sai vì xe buýt đưa đón không được nhắc tới. ' +
          'C sai vì chỉ có một cây cầu đang xây dở, chưa mở. ' +
          'D sai vì lối đi qua công trường không được nêu.',
        translation: 'Người đi bộ được bố trí gì trong thời gian đóng đường? — Một lối qua đường tạm gần nhà thuyền.',
      },
    ],
  },
  {
    id: 'g-p4-0015',
    part: 4,
    audioScript:
      'Thanks for contacting Citywide Storage. I am calling to confirm the details of your unit. ' +
      'You have reserved a medium unit on the ground floor, which gives you about eight square metres, and access ' +
      'is available between six in the morning and ten at night. ' +
      'Your first month is half price, and after that the rate is one hundred and sixty dollars a month if you pay ' +
      'by direct debit. ' +
      'Please bring a padlock on the day you move in; we do not supply them for security reasons. ' +
      'You will also need to show a utility bill with your current address, as our contract requires proof of address.',
    questions: [
      {
        id: 'p4-0043',
        difficulty: 2,
        tags: ['main-topic', 'purpose'],
        prompt: 'Why is the speaker calling?',
        choices: [
          'To confirm the details of a storage unit',
          'To complain about a broken padlock',
          'To advertise a larger storage unit',
          'To arrange a move to another address',
        ],
        answer: 'A',
        explanation:
          '"I am calling to confirm the details of your unit" → A đúng. ' +
          'B sai vì người nói không phàn nàn gì về khoá. ' +
          'C sai vì đơn vị đã được đặt, không có chào bán thêm. ' +
          'D sai vì công ty không giúp chuyển nhà.',
        translation: 'Vì sao người nói gọi điện? — Để xác nhận thông tin của một khoang lưu trữ.',
      },
      {
        id: 'p4-0044',
        difficulty: 3,
        tags: ['detail', 'cost'],
        prompt: 'What is offered for the first month?',
        choices: [
          'Half price',
          'A free padlock',
          'Twenty-four-hour access',
          'A larger unit at the same rate',
        ],
        answer: 'A',
        explanation:
          '"Your first month is half price" → A đúng. ' +
          'B sai vì công ty nói rõ họ không cung cấp ổ khoá. ' +
          'C sai vì giờ ra vào là sáu giờ sáng đến mười giờ đêm. ' +
          'D sai vì không có ưu đãi đổi khoang lớn hơn được nêu.',
        translation: 'Tháng đầu tiên được ưu đãi gì? — Giảm một nửa giá.',
      },
      {
        id: 'p4-0045',
        difficulty: 4,
        tags: ['detail', 'requirement'],
        prompt: 'What must the listener bring on the day of moving in?',
        choices: [
          'A padlock and a utility bill',
          'A signed contract and a deposit',
          'A photograph and an identity card',
          'A receipt for the first month',
        ],
        answer: 'A',
        explanation:
          'Người nói yêu cầu "bring a padlock" và "a utility bill with your current address" → A đúng. ' +
          'B sai vì hợp đồng được lập tại chỗ, không phải mang sẵn. ' +
          'C sai vì ảnh và thẻ không được nhắc tới. ' +
          'D sai vì hoá đơn tháng đầu không phải giấy tờ bắt buộc.',
        translation: 'Người nghe phải mang gì trong ngày nhận khoang? — Một ổ khoá và một hoá đơn tiện ích.',
      },
    ],
  },
]

export const PART4B_STIMULI = listeningStimuli(GROUPS)
export const PART4B_QUESTIONS = listeningQuestions(GROUPS)
