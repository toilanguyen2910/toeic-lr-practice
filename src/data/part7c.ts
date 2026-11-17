import { readingQuestions, readingStimuli, type ReadingGroup } from './questionBuilders'

/**
 * PART 7 — bổ sung đợt 2: 8 nhóm (p7-0049 … p7-0080), hoàn tất 20 nhóm × 4 = 80 câu.
 *
 * Bốn nhóm single passage (thư, thông báo tuyển dụng, bài báo, biên bản) và bốn nhóm
 * double passage (email + bảng, thông báo + thư, hoá đơn + email, quảng cáo + lịch).
 */
const GROUPS: ReadingGroup[] = [
  {
    id: 'g-p7-0013',
    part: 7,
    passages: [
      {
        label: 'Thư (Letter)',
        text:
          'Dear Ms. Okonkwo,\n\n' +
          'Thank you for your application for the position of warehouse supervisor at Delaney Distribution. ' +
          'We were impressed by your eleven years of experience and your knowledge of customs procedures.\n\n' +
          'Unfortunately, we are unable to offer you the position at this time. The successful candidate had ' +
          'previous experience of our specific inventory system, which was listed as desirable rather than ' +
          'essential in the advertisement.\n\n' +
          'I would, however, like to encourage you to apply for the shift manager role that we will advertise in ' +
          'the autumn. That position places more emphasis on customs knowledge and less on systems experience. ' +
          'I have asked our HR team to send you a notification when the vacancy is posted.\n\n' +
          'Thank you again for your interest in Delaney Distribution.\n\n' +
          'Yours sincerely,\nAlan Prentice\nOperations Manager',
      },
    ],
    questions: [
      {
        id: 'p7-0049',
        difficulty: 2,
        tags: ['main-topic', 'purpose'],
        stimulusId: 'g-p7-0013',
        prompt: 'What is the purpose of the letter?',
        choices: [
          'To inform an applicant that she was unsuccessful',
          'To offer an applicant a supervisory position',
          'To request references from a previous employer',
          'To confirm the date of a job interview',
        ],
        answer: 'A',
        explanation:
          '"we are unable to offer you the position at this time" nêu rõ đây là thư từ chối → A đúng. ' +
          'B sai vì thư không trao vị trí nào. ' +
          'C sai vì người viết không yêu cầu người giới thiệu. ' +
          'D sai vì buổi phỏng vấn đã diễn ra trước đó.',
        translation: 'Mục đích của lá thư là gì? — Thông báo cho ứng viên rằng cô ấy không trúng tuyển.',
      },
      {
        id: 'p7-0050',
        difficulty: 3,
        tags: ['detail', 'reason'],
        stimulusId: 'g-p7-0013',
        prompt: 'Why was another candidate chosen?',
        choices: [
          'She had more years of experience.',
          'She had used the company\'s inventory system before.',
          'She was available to start immediately.',
          'She had better references.',
        ],
        answer: 'B',
        explanation:
          '"The successful candidate had previous experience of our specific inventory system" → B đúng. ' +
          'A sai vì không có so sánh số năm kinh nghiệm. ' +
          'C sai vì ngày bắt đầu làm việc không được nêu. ' +
          'D sai vì người giới thiệu không được nhắc tới.',
        translation: 'Vì sao một ứng viên khác được chọn? — Vì cô ấy từng dùng hệ thống quản lý kho của công ty.',
      },
      {
        id: 'p7-0051',
        difficulty: 3,
        tags: ['detail', 'advice'],
        stimulusId: 'g-p7-0013',
        prompt: 'What does Mr. Prentice encourage Ms. Okonkwo to do?',
        choices: [
        'Take a short course in inventory systems',
        'Reapply for the same role next year',
        'Apply for a different position in the autumn',
        'Contact him for feedback on her interview',
      ],
        answer: 'C',
        explanation:
          '"encourage you to apply for the shift manager role that we will advertise in the autumn" → C đúng. ' +
          'B sai vì vị trí giám sát kho không được nhắc lại. ' +
          'A sai vì không có khoá học nào được đề nghị. ' +
          'D sai vì ông ấy không mời trao đổi phản hồi.',
        translation: 'Ông Prentice khuyến khích bà Okonkwo làm gì? — Ứng tuyển một vị trí khác vào mùa thu.',
      },
      {
        id: 'p7-0052',
        difficulty: 3,
        tags: ['inference', 'detail'],
        stimulusId: 'g-p7-0013',
        prompt: 'What has Mr. Prentice already arranged?',
        choices: [
        'A second interview for Ms. Okonkwo',
        'A reference for Ms. Okonkwo',
        'A transfer to the operations department',
        'A notification about a future vacancy',
      ],
        answer: 'D',
        explanation:
          '"I have asked our HR team to send you a notification when the vacancy is posted" → D đúng. ' +
          'A sai vì không có buổi phỏng vấn thứ hai nào. ' +
          'C sai vì việc chuyển bộ phận không được nêu. ' +
          'B sai vì thư từ chối không cấp thư giới thiệu.',
        translation: 'Ông Prentice đã sắp xếp sẵn việc gì? — Một thông báo về vị trí tuyển dụng trong tương lai.',
      },
    ],
  },
  {
    id: 'g-p7-0014',
    part: 7,
    passages: [
      {
        label: 'Thông báo tuyển dụng (Job posting)',
        text:
          'GUEST SERVICES COORDINATOR — THE ALDER HOTEL\n\n' +
          'The Alder Hotel, a forty-room boutique hotel in the old town, is recruiting a guest services coordinator.\n\n' +
          'Responsibilities: managing reservations and group bookings, supervising the front desk team of four, ' +
          'and handling guest complaints.\n\n' +
          'Requirements: at least two years in a front-of-house role, fluency in English and one other language, ' +
          'and confidence with booking software. Experience with the Opera system is desirable but not essential.\n\n' +
          'The role is full-time, thirty-nine hours over five days, and includes one weekend day each week. ' +
          'The salary starts at $34,000 with an annual bonus based on guest satisfaction scores.\n\n' +
          'To apply, send a CV and a covering letter explaining why you would suit a small hotel to ' +
          'careers@thealder.example. The closing date is 12 May. Interviews will be held in the week beginning ' +
          '19 May.',
      },
    ],
    questions: [
      {
        id: 'p7-0053',
        difficulty: 2,
        tags: ['main-topic'],
        stimulusId: 'g-p7-0014',
        prompt: 'What is being advertised?',
        choices: [
          'A management position at a hotel',
          'A training course in booking software',
          'A part-time reception role',
          'A hotel for sale in the old town',
        ],
        answer: 'A',
        explanation:
          'Thông báo tuyển "guest services coordinator" với trách nhiệm giám sát bốn nhân viên lễ tân, tức một vị trí quản lý → A đúng. ' +
          'B sai vì đây là tin tuyển dụng, không phải khoá học. ' +
          'C sai vì công việc toàn thời gian ba mươi chín giờ mỗi tuần. ' +
          'D sai vì không có thông tin bán khách sạn.',
        translation: 'Thông báo đang tuyển dụng gì? — Một vị trí quản lý tại khách sạn.',
      },
      {
        id: 'p7-0054',
        difficulty: 3,
        tags: ['detail', 'requirement'],
        stimulusId: 'g-p7-0014',
        prompt: 'Which requirement is described as desirable rather than essential?',
        choices: [
        'Fluency in English',
        'Experience with the Opera system',
        'Two years of front-of-house experience',
        'A second language',
      ],
        answer: 'B',
        explanation:
          '"Experience with the Opera system is desirable but not essential" → B đúng. ' +
          'A sai vì tiếng Anh lưu loát nằm trong phần yêu cầu bắt buộc. ' +
          'C sai vì hai năm kinh nghiệm cũng là yêu cầu bắt buộc. ' +
          'D sai vì ngoại ngữ thứ hai cũng thuộc nhóm bắt buộc.',
        translation: 'Yêu cầu nào được nêu là "mong muốn" chứ không bắt buộc? — Kinh nghiệm với hệ thống Opera.',
      },
      {
        id: 'p7-0055',
        difficulty: 2,
        tags: ['detail', 'schedule'],
        stimulusId: 'g-p7-0014',
        prompt: 'What does the working pattern include?',
        choices: [
        'Only weekday shifts',
        'Night shifts every week',
        'One weekend day each week',
        'Four days of ten hours',
      ],
        answer: 'C',
        explanation:
          '"thirty-nine hours over five days, and includes one weekend day each week" → C đúng. ' +
          'A sai vì có một ngày cuối tuần. ' +
          'B sai vì ca đêm không được nhắc tới. ' +
          'D sai vì lịch là năm ngày, không phải bốn ngày mười tiếng.',
        translation: 'Lịch làm việc bao gồm điều gì? — Mỗi tuần một ngày cuối tuần.',
      },
      {
        id: 'p7-0056',
        difficulty: 3,
        tags: ['detail', 'application'],
        stimulusId: 'g-p7-0014',
        prompt: 'What must applicants explain in their covering letter?',
        choices: [
        'When they can begin work',
        'How they would increase room rates',
        'Which languages they speak at home',
        'Why they are suited to a small hotel',
      ],
        answer: 'D',
        explanation:
          '"a covering letter explaining why you would suit a small hotel" → D đúng. ' +
          'B sai vì giá phòng không được nhắc tới. ' +
          'C sai vì ngôn ngữ dùng ở nhà không được hỏi. ' +
          'A sai vì ngày bắt đầu không nằm trong yêu cầu của thư ứng tuyển.',
        translation: 'Ứng viên phải giải thích điều gì trong thư xin việc? — Vì sao họ phù hợp với một khách sạn nhỏ.',
      },
    ],
  },
  {
    id: 'g-p7-0015',
    part: 7,
    passages: [
      {
        label: 'Bài báo (Newspaper article)',
        text:
          'MARKET HALL REOPENS AFTER TWO-YEAR RESTORATION\n\n' +
          'The covered market in Wexbury reopened on Saturday after a restoration project that lasted two years ' +
          'and cost 6.4 million pounds.\n\n' +
          'The building, which dates from 1893, had been closed since a survey found serious problems with the ' +
          'roof and drainage. Sixty traders were relocated to a temporary site near the station during the works, ' +
          'and all but four have now returned.\n\n' +
          'The restoration kept the original ironwork and stone floor, but added underfloor heating and a glass ' +
          'extension on the north side, which will house a small events space.\n\n' +
          '"Traders told us they did not want a shopping centre," said project architect Helen Marsh. ' +
          '"They wanted the building they already loved, only warmer, drier and easier to move around in."\n\n' +
          'The market will open six days a week, closing on Mondays, and a weekend food market will run on the ' +
          'first Saturday of each month.',
      },
    ],
    questions: [
      {
        id: 'p7-0057',
        difficulty: 2,
        tags: ['main-topic'],
        stimulusId: 'g-p7-0015',
        prompt: 'What is the article about?',
        choices: [
          'The reopening of a restored market building',
          'The construction of a new shopping centre',
          'A campaign to save a railway station',
          'An increase in market rents',
        ],
        answer: 'A',
        explanation:
          'Tiêu đề và đoạn mở nói rõ chợ có mái được mở lại sau hai năm trùng tu → A đúng. ' +
          'B sai vì bài báo nhấn mạnh người bán không muốn một trung tâm thương mại. ' +
          'C sai vì nhà ga chỉ là nơi đặt địa điểm tạm. ' +
          'D sai vì giá thuê không được nhắc tới.',
        translation: 'Bài báo nói về điều gì? — Việc mở lại một khu chợ đã được trùng tu.',
      },
      {
        id: 'p7-0058',
        difficulty: 3,
        tags: ['detail', 'reason'],
        stimulusId: 'g-p7-0015',
        prompt: 'Why was the building closed before the restoration?',
        choices: [
          'It had been damaged by fire.',
          'A survey found problems with the roof and drainage.',
          'The traders moved to a larger site.',
          'The council wanted to build offices there.',
        ],
        answer: 'B',
        explanation:
          '"had been closed since a survey found serious problems with the roof and drainage" → B đúng. ' +
          'A sai vì không có hoả hoạn nào. ' +
          'C sai vì việc di dời là hệ quả của việc đóng cửa, không phải nguyên nhân. ' +
          'D sai vì hội đồng không có kế hoạch xây văn phòng.',
        translation: 'Vì sao toà nhà phải đóng cửa trước khi trùng tu? — Một cuộc khảo sát phát hiện vấn đề ở mái và hệ thống thoát nước.',
      },
      {
        id: 'p7-0059',
        difficulty: 3,
        tags: ['detail', 'change'],
        stimulusId: 'g-p7-0015',
        prompt: 'What was added during the restoration?',
        choices: [
        'A new stone floor',
        'An additional row of market stalls',
        'Underfloor heating and a glass extension',
        'A railway station entrance',
      ],
        answer: 'C',
        explanation:
          '"added underfloor heating and a glass extension on the north side" → C đúng. ' +
          'A sai vì sàn đá là hạng mục được giữ nguyên. ' +
          'B sai vì số quầy không tăng trong thông tin bài báo. ' +
          'D sai vì nhà ga chỉ là nơi địa điểm tạm.',
        translation: 'Hạng mục nào được bổ sung trong quá trình trùng tu? — Hệ thống sưởi dưới sàn và một phần mở rộng bằng kính.',
      },
      {
        id: 'p7-0060',
        difficulty: 3,
        tags: ['inference', 'quote'],
        stimulusId: 'g-p7-0015',
        prompt: 'What did the traders want, according to the architect?',
        choices: [
        'A completely new building',
        'Longer opening hours on Sundays',
        'A move to the temporary site permanently',
        'The same building, made more comfortable',
      ],
        answer: 'D',
        explanation:
          '"They wanted the building they already loved, only warmer, drier and easier to move around in" → D đúng. ' +
          'A sai vì bà Marsh nhấn mạnh họ không muốn một trung tâm thương mại mới. ' +
          'C sai vì địa điểm tạm chỉ dùng trong thời gian thi công. ' +
          'B sai vì giờ mở cửa chủ nhật không được bàn tới.',
        translation: 'Theo kiến trúc sư, những người bán hàng muốn gì? — Chính toà nhà cũ nhưng tiện nghi hơn.',
      },
    ],
  },
  {
    id: 'g-p7-0016',
    part: 7,
    passages: [
      {
        label: 'Biên bản (Committee minutes)',
        text:
          'SELWORTH RESIDENTS\' ASSOCIATION — COMMITTEE MINUTES\n' +
          'Meeting held on 3 February at the community centre\n\n' +
          '1. Playground equipment\n' +
          'The committee agreed to replace the two swings in the play area behind Mercer Road. The current ' +
          'equipment was installed in 2011 and has needed repairs three times in the past year. Two quotes were ' +
          'considered; the committee accepted the lower one, from PlaySafe Ltd, at $4,300.\n\n' +
          '2. Unpaid subscriptions\n' +
          'Only forty-one of the sixty-two households have paid this year. The treasurer will write to the ' +
          'remaining households before the next meeting.\n\n' +
          '3. Traffic on Selworth Lane\n' +
          'Complaints about speeding continue. The association will ask the council for a speed survey.\n\n' +
          '4. Date of next meeting\n' +
          '7 April, in the small hall. Members are asked to bring ideas for the summer fair, since the usual ' +
          'organiser is standing down.',
      },
    ],
    questions: [
      {
        id: 'p7-0061',
        difficulty: 2,
        tags: ['main-topic', 'detail'],
        stimulusId: 'g-p7-0016',
        prompt: 'What was decided about the playground equipment?',
        choices: [
        'Two swings will be replaced.',
        'It will be repaired a fourth time.',
        'The whole play area will be moved.',
        'A quotation will be requested next year.',
      ],
        answer: 'A',
        explanation:
          '"agreed to replace the two swings in the play area behind Mercer Road" → A đúng. ' +
          'B sai vì việc sửa chữa ba lần là lý do phải thay mới. ' +
          'C sai vì khu vui chơi giữ nguyên vị trí. ' +
          'D sai vì báo giá đã được xem và chọn ngay trong cuộc họp.',
        translation: 'Hội đồng đã quyết định gì về thiết bị sân chơi? — Hai chiếc xích đu sẽ được thay.',
      },
      {
        id: 'p7-0062',
        difficulty: 3,
        tags: ['detail', 'numbers'],
        stimulusId: 'g-p7-0016',
        prompt: 'How many households have NOT paid their subscription?',
        choices: ['Forty-one', 'Twenty-one', 'Sixty-two', 'Four'],
        answer: 'B',
        explanation:
          'Có sáu mươi hai hộ, trong đó bốn mươi mốt hộ đã nộp, nên số chưa nộp là hai mươi mốt → B đúng. ' +
          'A sai vì đó là số hộ đã nộp. ' +
          'C sai vì đó là tổng số hộ. ' +
          'D sai vì con số bốn không xuất hiện trong biên bản.',
        translation: 'Bao nhiêu hộ chưa nộp hội phí? — Hai mươi mốt hộ.',
      },
      {
        id: 'p7-0063',
        difficulty: 3,
        tags: ['detail', 'action'],
        stimulusId: 'g-p7-0016',
        prompt: 'What will the association ask the council to do?',
        choices: [
        'Repair the road behind Mercer Road',
        'Close Selworth Lane to traffic',
        'Carry out a speed survey on Selworth Lane',
        'Provide a new community centre',
      ],
        answer: 'C',
        explanation:
          '"The association will ask the council for a speed survey" → C đúng. ' +
          'B sai vì việc đóng đường không được đề nghị. ' +
          'A sai vì việc sửa đường không được nhắc tới. ' +
          'D sai vì trung tâm cộng đồng là nơi họp, không phải đề nghị xây mới.',
        translation: 'Hội sẽ đề nghị hội đồng làm gì? — Thực hiện một cuộc khảo sát tốc độ trên đường Selworth.',
      },
      {
        id: 'p7-0064',
        difficulty: 3,
        tags: ['inference', 'detail'],
        stimulusId: 'g-p7-0016',
        prompt: 'Why are members asked to bring ideas to the next meeting?',
        choices: [
        'The council has cancelled the fair.',
        'The budget for the fair has been cut.',
        'The fair will be held somewhere new.',
        'The summer fair has no organiser.',
      ],
        answer: 'D',
        explanation:
          '"the usual organiser is standing down" — người tổ chức quen thuộc rút lui nên cần ý tưởng mới → D đúng. ' +
          'B sai vì ngân sách hội chợ không được nhắc tới. ' +
          'C sai vì địa điểm không đổi. ' +
          'A sai vì hội đồng không huỷ hội chợ.',
        translation: 'Vì sao thành viên được đề nghị mang ý tưởng đến cuộc họp tới? — Vì hội chợ mùa hè hiện không có người tổ chức.',
      },
    ],
  },
  {
    id: 'g-p7-0017',
    part: 7,
    passages: [
      {
        label: 'Thông báo (Notice)',
        text:
          'NOTICE TO ALL CONTRACTORS — NORTHGATE BUSINESS PARK\n\n' +
          'From 1 March, all contractors working on site must follow the new access procedure.\n\n' +
          '1. Vehicle entry is through gate 3 only. Gate 1 is now reserved for pedestrians and cyclists.\n' +
          '2. All vehicles must carry a valid site permit displayed on the dashboard.\n' +
          '3. Deliveries weighing more than three tonnes must be booked at least forty-eight hours in advance.\n' +
          '4. Contractors working above the ground floor must complete a working-at-height certificate, ' +
          'renewable every two years.\n\n' +
          'Permits and certificates can be obtained from the site office between 7 a.m. and 4 p.m., Monday to Friday.\n\n' +
          'Failure to follow these procedures may result in a vehicle being refused entry or a contractor being ' +
          'asked to leave the site.',
      },
      {
        label: 'Email (Email)',
        text:
          'To: site.office@northgatepark.example\n' +
          'From: Dan Whitlock, Whitlock Roofing\n' +
          'Subject: Delivery on 6 March\n\n' +
          'Hello,\n\n' +
          'We are installing the roof on unit 12 and have a delivery of tiles arriving on Thursday 6 March at ' +
          'around 9 a.m. The load is roughly four and a half tonnes, on a flatbed lorry.\n\n' +
          'Two questions. First, do we need to book this in advance, and if so, can you arrange it now, since ' +
          'Thursday is only three days away?\n\n' +
          'Second, my foreman\'s working-at-height certificate expired in January. Can it be renewed at the site ' +
          'office, or does he have to go through a training provider? He is available any afternoon this week.\n\n' +
          'Regards,\nDan Whitlock',
      },
    ],
    questions: [
      {
        id: 'p7-0065',
        difficulty: 2,
        tags: ['main-topic', 'synthesis'],
        stimulusId: 'g-p7-0017',
        prompt: 'What is the notice mainly about?',
        choices: [
          'New rules for contractors entering the site',
          'The opening of a new business park',
          'A change to pedestrian opening hours',
          'The closure of gates 1 and 3',
        ],
        answer: 'A',
        explanation:
          'Thông báo nêu thủ tục mới từ 1 tháng Ba dành cho mọi nhà thầu → A đúng. ' +
          'B sai vì khu công nghiệp đã hoạt động, chỉ thay đổi quy định ra vào. ' +
          'C sai vì giờ mở cửa của người đi bộ không được nêu. ' +
          'D sai vì cổng 1 vẫn dùng và cổng 3 là cổng xe chính.',
        translation: 'Thông báo chủ yếu nói về điều gì? — Quy định mới cho nhà thầu ra vào công trường.',
      },
      {
        id: 'p7-0066',
        difficulty: 3,
        tags: ['detail', 'synthesis'],
        stimulusId: 'g-p7-0017',
        prompt: 'Which rule applies to Mr. Whitlock\'s delivery?',
        choices: [
        'It must be delivered through gate 1.',
        'It must be booked at least 48 hours in advance.',
        'It must arrive before 7 a.m.',
        'It must be carried by pedestrians.',
      ],
        answer: 'B',
        explanation:
          'Xe tải nặng khoảng bốn tấn rưỡi, tức trên ba tấn, nên rơi vào quy định đặt trước bốn mươi tám giờ → B đúng. ' +
          'A sai vì cổng 1 chỉ dành cho người đi bộ và xe đạp. ' +
          'C sai vì 7 giờ là giờ mở cửa phòng công trường, không phải hạn giao hàng. ' +
          'D sai vì hàng hoá không thể do người đi bộ chuyển.',
        translation: 'Quy định nào áp dụng cho chuyến giao hàng của ông Whitlock? — Phải đặt trước ít nhất 48 giờ.',
      },
      {
        id: 'p7-0067',
        difficulty: 4,
        tags: ['inference', 'problem'],
        stimulusId: 'g-p7-0017',
        prompt: 'What problem does Mr. Whitlock mention?',
        choices: [
        'His delivery is heavier than allowed.',
        'He cannot find gate 3.',
        'His foreman\'s certificate has expired.',
        'His vehicle has no parking permit.',
      ],
        answer: 'C',
        explanation:
          '"my foreman\'s working-at-height certificate expired in January" → C đúng. ' +
          'A sai vì tải trọng phù hợp nhưng chỉ cần đặt trước. ' +
          'B sai vì ông ấy không hỏi đường. ' +
          'D sai vì giấy phép xe không được nêu là vấn đề.',
        translation: 'Ông Whitlock nêu ra vấn đề gì? — Giấy chứng nhận làm việc trên cao của tổ trưởng đã hết hạn.',
      },
      {
        id: 'p7-0068',
        difficulty: 4,
        tags: ['synthesis', 'detail'],
        stimulusId: 'g-p7-0017',
        prompt: 'Where and when can documents be renewed?',
        choices: [
        'By post, at any time',
        'At gate 3, every morning',
        'At a training provider, at weekends',
        'At the site office, Monday to Friday',
      ],
        answer: 'D',
        explanation:
          'Thông báo ghi rõ "Permits and certificates can be obtained from the site office between 7 a.m. and 4 p.m., Monday to Friday" → D đúng. ' +
          'B sai vì cổng 3 chỉ là cổng xe vào, không cấp giấy tờ. ' +
          'C sai vì ông Whitlock chỉ nêu khả năng này như một câu hỏi, không phải thông tin trong thông báo. ' +
          'A sai vì việc gia hạn qua đường bưu điện không được nêu.',
        translation: 'Có thể gia hạn giấy tờ ở đâu và khi nào? — Tại phòng công trường, từ thứ Hai đến thứ Sáu.',
      },
    ],
  },
  {
    id: 'g-p7-0018',
    part: 7,
    passages: [
      {
        label: 'Email (Email)',
        text:
          'To: accounts@harborlinefreight.example\n' +
          'From: billing@seacrestterminals.example\n' +
          'Subject: Invoice 8842 — storage charges\n\n' +
          'Dear Sir or Madam,\n\n' +
          'Please find attached invoice 8842 for storage of container HL-5592 at Seacrest Terminal between ' +
          '4 and 19 March.\n\n' +
          'Our records show that the container arrived on 4 March and was collected on 19 March, a total of ' +
          'fifteen days. Free storage is allowed for the first ten days, so we have charged for five days at ' +
          '$42 per day, plus the handling fee of $75. The total due is $285.\n\n' +
          'Payment is due within thirty days. Please quote the invoice number with your payment.\n\n' +
          'If you believe this invoice is incorrect, please contact us within fourteen days of the invoice date, ' +
          'after which the amount is treated as accepted.\n\n' +
          'Kind regards,\nSeacrest Billing',
      },
      {
        label: 'Sao kê (Internal record)',
        text:
          'HARBORLINE FREIGHT — CONTAINER LOG (extract)\n' +
          'Container: HL-5592 — origin Guangzhou\n' +
          'Arrived at Seacrest Terminal: 4 March\n' +
          'Customs clearance completed: 12 March\n' +
          'Collection by customer: 19 March\n' +
          'Note from operations (17 March): the delay between arrival and clearance was caused by a missing ' +
          'certificate of origin, which the shipper provided late. Handling fee for clearance: $75, already paid ' +
          'directly to our agent.',
      },
    ],
    questions: [
      {
        id: 'p7-0069',
        difficulty: 2,
        tags: ['main-topic'],
        stimulusId: 'g-p7-0018',
        prompt: 'What is the purpose of the email?',
        choices: [
          'To send an invoice and explain its charges',
          'To request a missing certificate of origin',
          'To confirm a collection date',
          'To complain about a delay in clearance',
        ],
        answer: 'A',
        explanation:
          'Email gửi hoá đơn 8842 và giải thích cách tính phí lưu bãi → A đúng. ' +
          'B sai vì giấy chứng nhận xuất xứ đã được nhắc trong ghi chú nội bộ, không phải yêu cầu của email. ' +
          'C sai vì ngày lấy hàng là thông tin có sẵn, không phải mục đích xác nhận. ' +
          'D sai vì bên gửi là chủ bến bãi, không phàn nàn.',
        translation: 'Mục đích của email là gì? — Gửi hoá đơn và giải thích các khoản phí.',
      },
      {
        id: 'p7-0070',
        difficulty: 3,
        tags: ['detail', 'calculation'],
        stimulusId: 'g-p7-0018',
        prompt: 'How many days of storage were charged?',
        choices: [
        'Fifteen',
        'Five',
        'Ten',
        'Nineteen',
      ],
        answer: 'B',
        explanation:
          'Số bị tính phí là năm ngày, vì mười ngày đầu được miễn → B đúng. ' +
          'A sai vì đó là tổng số ngày lưu bãi. ' +
          'C sai vì đó là số ngày miễn phí. ' +
          'D sai vì đó là ngày lấy hàng, không phải số ngày tính phí.',
        translation: 'Có bao nhiêu ngày lưu bãi bị tính phí? — Năm ngày.',
      },
      {
        id: 'p7-0071',
        difficulty: 4,
        tags: ['synthesis', 'inference'],
        stimulusId: 'g-p7-0018',
        prompt: 'Why might Harborline dispute part of the invoice?',
        choices: [
        'The container arrived later than recorded.',
        'The handling fee was already paid last year.',
        'The delay was caused by the shipper, not by them.',
        'The daily storage rate is higher than agreed.',
      ],
        answer: 'C',
        explanation:
          'Ghi chú nội bộ cho biết chậm trễ do người gửi hàng cung cấp giấy chứng nhận xuất xứ muộn, nên có cơ sở khiếu nại các ngày phát sinh → C đúng. ' +
          'A sai vì ngày đến đã được xác nhận là 4 tháng Ba. ' +
          'B sai vì phí xếp dỡ là khoản của đại lý, không phải của năm trước. ' +
          'D sai vì đơn giá không bị phản đối.',
        translation: 'Vì sao Harborline có thể khiếu nại một phần hoá đơn? — Vì sự chậm trễ do người gửi hàng gây ra, không phải do họ.',
      },
      {
        id: 'p7-0072',
        difficulty: 3,
        tags: ['detail', 'deadline'],
        stimulusId: 'g-p7-0018',
        prompt: 'What happens if the invoice is not questioned within fourteen days?',
        choices: [
        'The container is returned to the shipper.',
        'The invoice is cancelled.',
        'A late fee is added.',
        'The amount is treated as accepted.',
      ],
        answer: 'D',
        explanation:
          '"after which the amount is treated as accepted" → D đúng. ' +
          'B sai vì không có việc huỷ hoá đơn. ' +
          'C sai vì phụ phí trễ hạn không được nhắc tới. ' +
          'A sai vì hàng đã được lấy đi từ ngày 19 tháng Ba.',
        translation: 'Điều gì xảy ra nếu không thắc mắc hoá đơn trong mười bốn ngày? — Khoản tiền được coi là đã chấp nhận.',
      },
    ],
  },
  {
    id: 'g-p7-0019',
    part: 7,
    passages: [
      {
        label: 'Quảng cáo (Advertisement)',
        text:
          'SUMMER EVENING COURSES — WEXBURY ADULT EDUCATION\n\n' +
          'Writing for Business\n' +
          'Tuesdays, 7–9 p.m., ten weeks from 22 April. $180.\n' +
          'For anyone who writes reports, proposals or customer letters. Covers structure, tone and editing. ' +
          'Students should bring a piece of their own writing to the first session.\n\n' +
          'Digital Photography\n' +
          'Thursdays, 6.30–8.30 p.m., eight weeks from 24 April. $150.\n' +
          'Suitable for those using any camera with manual settings. A tripod is recommended but not required. ' +
          'Two sessions will be held outdoors, weather permitting.\n\n' +
          'Bookkeeping Essentials\n' +
          'Mondays, 7–9 p.m., six weeks from 28 April. $120.\n' +
          'An introduction to double-entry bookkeeping for small business owners and volunteers.\n\n' +
          'Courses are limited to sixteen people. A 10 percent discount is available to anyone who has taken ' +
          'a course at Wexbury in the past two years.',
      },
      {
        label: 'Email (Email)',
        text:
          'To: adult.education@wexbury.example\n' +
          'From: Marina Costa\n' +
          'Subject: Enquiry about evening courses\n\n' +
          'Hello,\n\n' +
          'I am the treasurer of a small community allotment society and I currently keep our accounts in a ' +
          'spreadsheet. I would like to do them properly.\n\n' +
          'I am free on Monday and Tuesday evenings, but I am away on a training course on the first Monday in May.\n\n' +
          'I would also be interested in the photography course, although my camera is quite basic and I am not ' +
          'sure it has manual settings.\n\n' +
          'I took a Spanish course with you in 2023. Does that make me eligible for a discount?\n\n' +
          'Thank you,\nMarina Costa',
      },
    ],
    questions: [
      {
        id: 'p7-0073',
        difficulty: 2,
        tags: ['main-topic', 'synthesis'],
        stimulusId: 'g-p7-0019',
        prompt: 'Why is Ms. Costa writing?',
        choices: [
          'To ask about courses she would like to take',
          'To apply for a teaching position',
          'To request a refund for a previous course',
          'To advertise her business',
        ],
        answer: 'A',
        explanation:
          'Bà Costa hỏi về khoá kế toán và khoá nhiếp ảnh, kèm câu hỏi về giảm giá → A đúng. ' +
          'B sai vì bà ấy là học viên, không xin dạy. ' +
          'C sai vì không có yêu cầu hoàn tiền nào. ' +
          'D sai vì bà ấy chỉ nêu vai trò thủ quỹ để giải thích nhu cầu học.',
        translation: 'Vì sao bà Costa viết thư? — Để hỏi về những khoá học bà ấy muốn tham gia.',
      },
      {
        id: 'p7-0074',
        difficulty: 3,
        tags: ['detail', 'synthesis'],
        stimulusId: 'g-p7-0019',
        prompt: 'Which course best matches her main need?',
        choices: [
        'Writing for Business',
        'Bookkeeping Essentials',
        'Digital Photography',
        'Spanish',
      ],
        answer: 'B',
        explanation:
          'Bà ấy nói đang giữ sổ sách cho hội làm vườn bằng bảng tính và "would like to do them properly", nên khoá kế toán phù hợp nhất → B đúng. ' +
          'A sai vì viết báo cáo không phải nhu cầu chính được nêu. ' +
          'C sai vì nhiếp ảnh chỉ là mối quan tâm thêm. ' +
          'D sai vì tiếng Tây Ban Nha chỉ được nhắc khi hỏi về giảm giá.',
        translation: 'Khoá học nào phù hợp nhất với nhu cầu chính của bà ấy? — Kiến thức cơ bản về ghi sổ kế toán.',
      },
      {
        id: 'p7-0075',
        difficulty: 4,
        tags: ['inference', 'scheduling'],
        stimulusId: 'g-p7-0019',
        prompt: 'What scheduling problem does Ms. Costa\'s situation create?',
        choices: [
        'The photography course clashes with her work.',
        'She is only free on Thursdays.',
        'She cannot attend the first Monday session of the summer term.',
        'The bookkeeping course begins before her holiday.',
      ],
        answer: 'C',
        explanation:
          'Khoá kế toán học thứ Hai, và bà ấy báo mình vắng mặt thứ Hai đầu tiên của tháng Năm, tức buổi thứ hai của khoá → C đúng. ' +
          'B sai vì bà ấy nói rảnh tối thứ Hai và thứ Ba. ' +
          'A sai vì lớp nhiếp ảnh là thứ Năm và bà ấy không nêu xung đột công việc. ' +
          'D sai vì khoá bắt đầu ngày 28 tháng Tư, trước kỳ vắng của bà ấy.',
        translation: 'Lịch của bà Costa tạo ra vấn đề gì? — Bà ấy không dự được buổi thứ Hai đầu tiên của khoá hè.',
      },
      {
        id: 'p7-0076',
        difficulty: 3,
        tags: ['synthesis', 'detail'],
        stimulusId: 'g-p7-0019',
        prompt: 'On what basis might Ms. Costa receive a discount?',
        choices: [
        'She is a small business owner.',
        'She is a member of a community group.',
        'She is enrolling in two courses at once.',
        'She took a course at Wexbury recently.',
      ],
        answer: 'D',
        explanation:
          'Quảng cáo giảm giá cho người đã học tại Wexbury trong hai năm qua, và bà Costa học tiếng Tây Ban Nha năm 2023 → D đúng. ' +
          'A sai vì quyền lợi không dựa vào việc làm chủ doanh nghiệp nhỏ. ' +
          'C sai vì học hai khoá không được nêu là điều kiện. ' +
          'B sai vì việc là thành viên hội làm vườn không mang lại ưu đãi.',
        translation: 'Bà Costa có thể được giảm giá dựa trên cơ sở nào? — Bà ấy đã học một khoá tại Wexbury gần đây.',
      },
    ],
  },
  {
    id: 'g-p7-0020',
    part: 7,
    passages: [
      {
        label: 'Thông báo nội bộ (Internal announcement)',
        text:
          'CHANGES TO THE EXPENSES SYSTEM — FROM 1 MAY\n\n' +
          'From 1 May all expense claims must be submitted through the new online system, Expenselink. Paper forms ' +
          'will no longer be accepted after that date.\n\n' +
          'Training: two demonstration sessions will be held on 22 and 24 April in the Ash Room, each lasting ' +
          'one hour. Attendance is recommended for anyone who claims expenses more than once a month.\n\n' +
          'Reimbursement: claims submitted before the twentieth of the month will be paid with that month\'s ' +
          'salary. Later claims are paid in the following month.\n\n' +
          'Receipts: a photograph of each receipt must be uploaded. Original paper receipts should be kept for ' +
          'six months in case of audit.\n\n' +
          'Support: the finance team has prepared a one-page guide, available on the intranet.',
      },
      {
        label: 'Email (Email)',
        text:
          'To: finance@brightwell.example\n' +
          'From: Ruth Adeyemi\n' +
          'Subject: Expense claim for March conference\n\n' +
          'Hello,\n\n' +
          'I attended the regional sales conference in Leeds on 26 and 27 March and have the receipts for the train ' +
          'and two nights in a hotel. I submitted a paper form on 2 April, before the changeover.\n\n' +
          'I have two questions. First, will my paper claim still be processed, or do I need to resubmit it through ' +
          'the new system?\n\n' +
          'Second, I have lost one of the hotel receipts. I have the booking confirmation email, which shows the ' +
          'amount paid. Will that be accepted, or do you need something else?\n\n' +
          'I am happy to attend one of the demonstration sessions if that helps.\n\n' +
          'Thank you,\nRuth Adeyemi',
      },
    ],
    questions: [
      {
        id: 'p7-0077',
        difficulty: 2,
        tags: ['main-topic', 'synthesis'],
        stimulusId: 'g-p7-0020',
        prompt: 'What does the announcement mainly describe?',
        choices: [
          'A new system for claiming expenses',
          'A change to the monthly salary date',
          'A training course on spreadsheets',
          'A new policy on business travel',
        ],
        answer: 'A',
        explanation:
          'Thông báo nói từ 1 tháng Năm mọi yêu cầu hoàn chi phí phải nộp qua Expenselink → A đúng. ' +
          'B sai vì ngày trả lương không đổi, chỉ có mốc nộp chi phí. ' +
          'C sai vì các buổi demo hướng dẫn dùng hệ thống mới, không dạy bảng tính. ' +
          'D sai vì chính sách công tác không được bàn tới.',
        translation: 'Thông báo chủ yếu mô tả điều gì? — Một hệ thống mới để yêu cầu hoàn chi phí.',
      },
      {
        id: 'p7-0078',
        difficulty: 3,
        tags: ['detail', 'deadline'],
        stimulusId: 'g-p7-0020',
        prompt: 'When must a claim be submitted to be paid with that month\'s salary?',
        choices: ['Before the first of the month', 'Before the twentieth of the month', 'Within six months', 'By the end of the month'],
        answer: 'B',
        explanation:
          '"claims submitted before the twentieth of the month will be paid with that month\'s salary" → B đúng. ' +
          'A sai vì mốc là ngày hai mươi, không phải ngày đầu tháng. ' +
          'C sai vì sáu tháng là thời gian giữ hoá đơn gốc. ' +
          'D sai vì nộp sau ngày hai mươi sẽ được trả vào tháng sau.',
        translation: 'Phải nộp yêu cầu trước khi nào để được trả cùng lương tháng đó? — Trước ngày 20 của tháng.',
      },
      {
        id: 'p7-0079',
        difficulty: 4,
        tags: ['synthesis', 'inference'],
        stimulusId: 'g-p7-0020',
        prompt: 'What does Ms. Adeyemi want to know about her paper form?',
        choices: [
        'Whether it needs a manager\'s signature',
        'Whether it was sent to the right address',
        'Whether it will still be processed',
        'Whether it covers the correct dates',
      ],
        answer: 'C',
        explanation:
          '"will my paper claim still be processed, or do I need to resubmit it through the new system?" → C đúng. ' +
          'B sai vì địa chỉ gửi không bị nghi vấn. ' +
          'A sai vì chữ ký quản lý không được nhắc tới. ' +
          'D sai vì ngày đi công tác đã nêu rõ và không bị thắc mắc.',
        translation: 'Bà Adeyemi muốn biết điều gì về mẫu đơn giấy của mình? — Liệu đơn đó còn được xử lý không.',
      },
      {
        id: 'p7-0080',
        difficulty: 4,
        tags: ['synthesis', 'detail'],
        stimulusId: 'g-p7-0020',
        prompt: 'Which requirement will Ms. Adeyemi have difficulty meeting?',
        choices: [
        'Keeping her paper receipts for six months',
        'Attending a demonstration session',
        'Submitting her claim before the twentieth',
        'Uploading a photograph of each receipt',
      ],
        answer: 'D',
        explanation:
          'Bà ấy nói đã mất một hoá đơn khách sạn, trong khi quy định mới yêu cầu ảnh chụp của từng hoá đơn → D đúng. ' +
          'B sai vì bà ấy tự nguyện tham dự buổi demo. ' +
          'C sai vì bà ấy đã nộp từ ngày 2 tháng Tư. ' +
          'A sai vì việc lưu hoá đơn giấy không gây khó khăn nào được nêu.',
        translation: 'Yêu cầu nào bà Adeyemi sẽ khó đáp ứng? — Tải ảnh chụp của từng hoá đơn lên.',
      },
    ],
  },
]

export const PART7C_STIMULI = readingStimuli(GROUPS)
export const PART7C_QUESTIONS = readingQuestions(GROUPS)
