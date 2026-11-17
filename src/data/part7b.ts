import { readingQuestions, readingStimuli, type ReadingGroup } from './questionBuilders'

/**
 * PART 7 — bổ sung đợt 1: 8 nhóm (p7-0017 … p7-0048).
 *
 * Bốn nhóm đầu là single passage, bốn nhóm sau là DOUBLE passage. Mỗi nhóm bốn câu theo
 * nhịp: chủ đề chính → chi tiết → suy luận → câu hỏi tổng hợp buộc đọc cả hai văn bản.
 */
const GROUPS: ReadingGroup[] = [
  {
    id: 'g-p7-0005',
    part: 7,
    passages: [
      {
        label: 'Email (Email)',
        text:
          'To: all.staff@meridianfoods.example\n' +
          'From: Facilities, Meridian Foods\n' +
          'Subject: Bike storage and showers\n\n' +
          'Dear colleagues,\n\n' +
          'Following the staff survey in March, we are pleased to confirm that two changes will be introduced next ' +
          'month.\n\n' +
          'First, a secure bicycle store with forty spaces will open beside the north entrance on 3 May. Access ' +
          'will be by staff card, and the store will be monitored by camera. Spaces are allocated on a first-come ' +
          'basis, so please register your interest with reception by 25 April.\n\n' +
          'Second, the locker rooms on the ground floor will be extended to include six showers, three in each ' +
          'changing area. These will be available from 6 a.m., which we hope will make cycling to work a realistic ' +
          'option for those living within a reasonable distance.\n\n' +
          'We are also reviewing the shuttle bus timetable, and we will report back before the summer.\n\n' +
          'Facilities Team',
      },
    ],
    questions: [
      {
        id: 'p7-0017',
        difficulty: 2,
        tags: ['main-topic'],
        stimulusId: 'g-p7-0005',
        prompt: 'What is the main purpose of the email?',
        choices: [
          'To announce new facilities for staff who cycle to work',
          'To report the results of a staff survey',
          'To explain changes to the shuttle bus timetable',
          'To advertise vacancies in the facilities team',
        ],
        answer: 'A',
        explanation:
          'Email thông báo mở bãi giữ xe đạp và bổ sung phòng tắm cho nhân viên đi xe đạp → A đúng. ' +
          'B sai vì khảo sát chỉ được nhắc làm bối cảnh, không có kết quả nào được công bố. ' +
          'C sai vì tuyến xe đưa đón chỉ đang được xem xét, chưa có thay đổi. ' +
          'D sai vì không có vị trí tuyển dụng nào.',
        translation: 'Mục đích chính của email là gì? — Thông báo các tiện ích mới cho nhân viên đi xe đạp đi làm.',
      },
      {
        id: 'p7-0018',
        difficulty: 2,
        tags: ['detail', 'deadline'],
        stimulusId: 'g-p7-0005',
        prompt: 'What must staff do by 25 April?',
        choices: [
          'Collect a new staff card',
          'Register their interest in a bike space',
          'Book a shower slot',
          'Complete the facilities survey',
        ],
        answer: 'B',
        explanation:
          '"please register your interest with reception by 25 April" → B đúng. ' +
          'A sai vì thẻ chỉ dùng để ra vào, không phải việc cần làm trước hạn. ' +
          'C sai vì phòng tắm không cần đặt chỗ. ' +
          'D sai vì khảo sát đã diễn ra hồi tháng Ba.',
        translation: 'Nhân viên phải làm gì trước ngày 25 tháng Tư? — Đăng ký nguyện vọng có chỗ giữ xe đạp.',
      },
      {
        id: 'p7-0019',
        difficulty: 3,
        tags: ['inference', 'detail'],
        stimulusId: 'g-p7-0005',
        prompt: 'What can be inferred about the bicycle store?',
        choices: [
          'It will be open only during office hours.',
          'It has more spaces than there are bicycles.',
          'Demand for spaces may exceed the number available.',
          'It will be located inside the locker rooms.',
        ],
        answer: 'C',
        explanation:
          'Cụm "spaces are allocated on a first-come basis" cho thấy số chỗ có hạn và phải đăng ký sớm, tức nhu cầu có thể vượt số chỗ → C đúng. ' +
          'A sai vì email không nêu giờ hoạt động của bãi xe. ' +
          'B sai vì không có số lượng xe đạp nào được nêu. ' +
          'D sai vì bãi xe nằm cạnh cửa phía bắc, không nằm trong phòng thay đồ.',
        translation: 'Có thể suy ra điều gì về bãi giữ xe đạp? — Nhu cầu có thể vượt quá số chỗ hiện có.',
      },
      {
        id: 'p7-0020',
        difficulty: 3,
        tags: ['detail', 'synthesis'],
        stimulusId: 'g-p7-0005',
        prompt: 'Why are the showers being added?',
        choices: [
        'To replace the locker rooms on the ground floor',
        'To meet a legal requirement for changing facilities',
        'To serve visitors attending meetings',
        'To make cycling to work more practical',
      ],
        answer: 'D',
        explanation:
          '"which we hope will make cycling to work a realistic option" nêu rõ mục đích → D đúng. ' +
          'A sai vì phòng thay đồ được mở rộng chứ không bị thay thế. ' +
          'C sai vì khách đến họp không được nhắc tới. ' +
          'B sai vì yêu cầu pháp lý không được nêu.',
        translation: 'Vì sao phòng tắm được bổ sung? — Để việc đi xe đạp đi làm trở nên khả thi hơn.',
      },
    ],
  },
  {
    id: 'g-p7-0006',
    part: 7,
    passages: [
      {
        label: 'Bài báo (Newspaper article)',
        text:
          'LOCAL FIRM TO OPEN TRAINING ACADEMY\n\n' +
          'Ashford Engineering has announced plans to open a training academy at its Riverside works, offering ' +
          'apprenticeships to sixty young people each year from next September.\n\n' +
          'The academy will run a two-year programme combining college study with paid work on the factory floor. ' +
          'Apprentices will spend one day a week at Northfield College and the rest of the week working alongside ' +
          'experienced engineers.\n\n' +
          '"We have struggled to recruit skilled machinists for a decade," said managing director Ruth Ashford. ' +
          '"Rather than competing for the small number of qualified people in the region, we decided to train our own."\n\n' +
          'The company has invested two million pounds in equipment for the academy, including twelve computer-controlled ' +
          'machines that apprentices will use throughout the programme. Places will be open to school leavers aged ' +
          'sixteen to nineteen, and applications open in February.\n\n' +
          'The local council has welcomed the plan, noting that youth unemployment in the district is above the ' +
          'national average.',
      },
    ],
    questions: [
      {
        id: 'p7-0021',
        difficulty: 2,
        tags: ['main-topic'],
        stimulusId: 'g-p7-0006',
        prompt: 'What is the article mainly about?',
        choices: [
          'A company opening a training academy for young people',
          'A college expanding its engineering courses',
          'A council campaign to reduce unemployment',
          'A factory closing because of a skills shortage',
        ],
        answer: 'A',
        explanation:
          'Bài báo thông báo Ashford Engineering mở học viện đào tạo và nhận sáu mươi học việc mỗi năm → A đúng. ' +
          'B sai vì trường cao đẳng chỉ là đối tác giảng dạy một ngày mỗi tuần. ' +
          'C sai vì hội đồng chỉ hoan nghênh kế hoạch, không phát động chiến dịch. ' +
          'D sai vì nhà máy đang mở rộng chứ không đóng cửa.',
        translation: 'Bài báo chủ yếu nói về việc gì? — Một công ty mở học viện đào tạo cho người trẻ.',
      },
      {
        id: 'p7-0022',
        difficulty: 2,
        tags: ['detail', 'numbers'],
        stimulusId: 'g-p7-0006',
        prompt: 'How much has the company invested in equipment?',
        choices: [
        'Sixty thousand pounds',
        'Two million pounds',
        'Twelve million pounds',
        'Two hundred thousand pounds',
      ],
        answer: 'B',
        explanation:
          '"invested two million pounds in equipment for the academy" → B đúng. ' +
          'A sai vì sáu mươi là số học viên mỗi năm. ' +
          'C sai vì mười hai là số máy điều khiển bằng máy tính. ' +
          'D sai vì không con số này không xuất hiện trong bài.',
        translation: 'Công ty đã đầu tư bao nhiêu cho thiết bị? — Hai triệu bảng.',
      },
      {
        id: 'p7-0023',
        difficulty: 3,
        tags: ['inference', 'reason'],
        stimulusId: 'g-p7-0006',
        prompt: 'Why did the company decide to train its own staff?',
        choices: [
          'The college offered a large discount.',
          'The council required them to do so.',
          'Qualified machinists were hard to recruit.',
          'The factory needed fewer skilled workers.',
        ],
        answer: 'C',
        explanation:
          'Bà Ashford nói "We have struggled to recruit skilled machinists for a decade" và chọn tự đào tạo thay vì cạnh tranh → C đúng. ' +
          'A sai vì học phí hay ưu đãi của trường không được nêu. ' +
          'B sai vì hội đồng chỉ hoan nghênh kế hoạch. ' +
          'D sai vì nhu cầu nhân lực có tay nghề đang tăng chứ không giảm.',
        translation: 'Vì sao công ty quyết định tự đào tạo nhân viên? — Vì khó tuyển được thợ máy có tay nghề.',
      },
      {
        id: 'p7-0024',
        difficulty: 3,
        tags: ['detail', 'synthesis'],
        stimulusId: 'g-p7-0006',
        prompt: 'What will apprentices do one day a week?',
        choices: [
        'Work on the factory floor',
        'Train other new employees',
        'Attend council meetings',
        'Study at Northfield College',
      ],
        answer: 'D',
        explanation:
          '"Apprentices will spend one day a week at Northfield College" → D đúng. ' +
          'A sai vì thời gian còn lại trong tuần mới là làm việc tại xưởng. ' +
          'C sai vì hội đồng không tham gia chương trình đào tạo. ' +
          'B sai vì học viên học nghề, không đào tạo người khác.',
        translation: 'Mỗi tuần học viên sẽ làm gì một ngày? — Học tại trường cao đẳng Northfield.',
      },
    ],
  },
  {
    id: 'g-p7-0007',
    part: 7,
    passages: [
      {
        label: 'Thông báo (Notice)',
        text:
          'CITY SWIMMING POOL — TEMPORARY TIMETABLE\n\n' +
          'From 5 to 20 June the main pool will be used for the regional championships. Public swimming will be ' +
          'limited as follows:\n\n' +
          'Weekdays: 6.30 a.m. – 9 a.m. and 7 p.m. – 10 p.m. only\n' +
          'Weekends: 8 a.m. – 12 noon only\n\n' +
          'The teaching pool will remain open at the usual times throughout, and all swimming lessons will run as ' +
          'scheduled.\n\n' +
          'Season ticket holders will have the June payment suspended automatically; no action is required. ' +
          'Single-visit tickets will be sold at half price during this period.\n\n' +
          'The sauna and steam room are unaffected, but the upstairs viewing gallery will be closed to the public ' +
          'while the championships take place.\n\n' +
          'We apologise for the disruption and look forward to welcoming spectators to the championships; tickets ' +
          'for the evening finals are available at the front desk.',
      },
    ],
    questions: [
      {
        id: 'p7-0025',
        difficulty: 1,
        tags: ['main-topic'],
        stimulusId: 'g-p7-0007',
        prompt: 'What is the notice mainly about?',
        choices: [
          'A temporary change to public swimming hours',
          'The opening of a new teaching pool',
          'An increase in season ticket prices',
          'The closure of the sauna and steam room',
        ],
        answer: 'A',
        explanation:
          'Thông báo nêu giờ mở cửa tạm thời bị thu hẹp trong thời gian diễn ra giải vô địch → A đúng. ' +
          'B sai vì bể dạy bơi đã tồn tại và vẫn mở như thường lệ. ' +
          'C sai vì giá vé mùa không tăng, mà còn tạm ngừng thu trong tháng Sáu. ' +
          'D sai vì sauna và phòng xông hơi "are unaffected".',
        translation: 'Thông báo chủ yếu nói về điều gì? — Thay đổi tạm thời về giờ bơi công cộng.',
      },
      {
        id: 'p7-0026',
        difficulty: 2,
        tags: ['detail', 'time'],
        stimulusId: 'g-p7-0007',
        prompt: 'When can the public swim on weekends during the championships?',
        choices: ['From 6.30 a.m. to 9 a.m.', 'From 8 a.m. to 12 noon', 'From 7 p.m. to 10 p.m.', 'At any time'],
        answer: 'B',
        explanation:
          '"Weekends: 8 a.m. – 12 noon only" → B đúng. ' +
          'A sai vì đó là khung giờ sáng ngày thường. ' +
          'C sai vì đó là khung giờ tối ngày thường. ' +
          'D sai vì giờ bơi đã bị giới hạn rõ ràng.',
        translation: 'Trong thời gian diễn ra giải, cuối tuần công chúng được bơi khi nào? — Từ 8 giờ sáng đến 12 giờ trưa.',
      },
      {
        id: 'p7-0027',
        difficulty: 3,
        tags: ['detail', 'inference'],
        stimulusId: 'g-p7-0007',
        prompt: 'What happens automatically to season ticket holders?',
        choices: [
        'Their ticket is cancelled.',
        'They receive free championship tickets.',
        'Their June payment is suspended.',
        'They are moved to the teaching pool.',
      ],
        answer: 'C',
        explanation:
          '"Season ticket holders will have the June payment suspended automatically; no action is required" → C đúng. ' +
          'A sai vì vé mùa không bị huỷ. ' +
          'B sai vì vé xem giải bán riêng tại quầy. ' +
          'D sai vì việc chuyển sang bể dạy bơi không được nêu.',
        translation: 'Điều gì tự động xảy ra với người có vé mùa? — Khoản thanh toán tháng Sáu được tạm ngừng.',
      },
      {
        id: 'p7-0028',
        difficulty: 2,
        tags: ['detail', 'exception'],
        stimulusId: 'g-p7-0007',
        prompt: 'Which facility is NOT affected by the championships?',
        choices: [
        'The main pool',
        'The viewing gallery',
        'The teaching pool',
        'The sauna',
      ],
        answer: 'D',
        explanation:
          '"The sauna and steam room are unaffected" → D đúng. ' +
          'A sai vì bể chính bị giới hạn giờ công cộng. ' +
          'B sai vì phòng trưng bày tầng trên đóng cửa với công chúng. ' +
          'C tuy vẫn mở bình thường nhưng vẫn chịu ảnh hưởng chung của thông báo; đáp án được nêu trực tiếp là sauna.',
        translation: 'Tiện ích nào KHÔNG bị ảnh hưởng bởi giải vô địch? — Phòng xông hơi khô.',
      },
    ],
  },
  {
    id: 'g-p7-0008',
    part: 7,
    passages: [
      {
        label: 'Email (Email)',
        text:
          'To: bookings@blueharbour.example\n' +
          'From: j.whitfield@northgatecatering.example\n' +
          'Subject: Anniversary dinner — 8 March\n\n' +
          'Dear Blue Harbour team,\n\n' +
          'We are holding our company anniversary dinner on Saturday 8 March for approximately ninety guests and ' +
          'would like to book your function room.\n\n' +
          'We would need exclusive use of the room from 5 p.m. to set up, with dinner served at 7.30. ' +
          'Two of our guests are vegan, and the head of finance is allergic to shellfish, so a menu with clear ' +
          'labels would be much appreciated.\n\n' +
          'We also plan to show a short video, so we would need a projector and a screen. ' +
          'Please could you confirm whether these are included in the room rate?\n\n' +
          'Finally, could you let me know the latest date by which we must confirm final numbers?\n\n' +
          'Kind regards,\nJoanna Whitfield\nNorthgate Catering',
      },
    ],
    questions: [
      {
        id: 'p7-0029',
        difficulty: 2,
        tags: ['main-topic'],
        stimulusId: 'g-p7-0008',
        prompt: 'Why is Ms. Whitfield writing?',
        choices: [
          'To enquire about booking a room for a dinner',
          'To cancel an existing reservation',
          'To complain about a previous event',
          'To apply for a position at the hotel',
        ],
        answer: 'A',
        explanation:
          '"would like to book your function room" nêu rõ mục đích → A đúng. ' +
          'B sai vì đây là yêu cầu đặt mới, không phải huỷ. ' +
          'C sai vì không có lời phàn nàn nào. ' +
          'D sai vì bà ấy viết với danh nghĩa công ty, không xin việc.',
        translation: 'Vì sao bà Whitfield viết thư? — Để hỏi đặt phòng cho một bữa tối.',
      },
      {
        id: 'p7-0030',
        difficulty: 3,
        tags: ['detail', 'request'],
        stimulusId: 'g-p7-0008',
        prompt: 'What does Ms. Whitfield ask about the projector and screen?',
        choices: [
        'Whether they can be installed in the morning',
        'Whether they are included in the room rate',
        'Whether they are compatible with her laptop',
        'Whether they must be collected in advance',
      ],
        answer: 'B',
        explanation:
          '"Please could you confirm whether these are included in the room rate?" → B đúng. ' +
          'A sai vì giờ lắp đặt là từ năm giờ chiều, không phải buổi sáng. ' +
          'C sai vì khả năng tương thích không được nêu. ' +
          'D sai vì việc tự lấy thiết bị không được nhắc tới.',
        translation: 'Bà Whitfield hỏi gì về máy chiếu và màn chiếu? — Chúng có nằm trong giá thuê phòng không.',
      },
      {
        id: 'p7-0031',
        difficulty: 3,
        tags: ['detail', 'dietary'],
        stimulusId: 'g-p7-0008',
        prompt: 'What dietary issue must the venue handle carefully?',
        choices: [
        'A guest cannot eat nuts.',
        'Several guests are vegetarian.',
        'A guest is allergic to shellfish.',
        'Most guests avoid sugar.',
      ],
        answer: 'C',
        explanation:
          '"the head of finance is allergic to shellfish" → C đúng. ' +
          'A sai vì dị ứng hạt không được nêu. ' +
          'B sai vì chỉ hai khách là thuần chay, không phải nhiều người ăn chay. ' +
          'D sai vì kiêng đường không được nhắc tới.',
        translation: 'Vấn đề ăn uống nào địa điểm cần xử lý cẩn thận? — Một khách bị dị ứng hải sản có vỏ.',
      },
      {
        id: 'p7-0032',
        difficulty: 3,
        tags: ['inference', 'synthesis'],
        stimulusId: 'g-p7-0008',
        prompt: 'What information does Ms. Whitfield still need from the venue?',
        choices: [
        'The address of the function room',
        'The number of parking spaces available',
        'The name of the events manager',
        'The deadline for confirming final numbers',
      ],
        answer: 'D',
        explanation:
          '"could you let me know the latest date by which we must confirm final numbers?" → D đúng. ' +
          'A sai vì địa chỉ là nơi mà cả hai bên đều biết, không được hỏi. ' +
          'C sai vì tên người phụ trách không được yêu cầu. ' +
          'B sai vì số chỗ đỗ xe không được nhắc tới.',
        translation: 'Bà Whitfield còn cần thông tin gì từ địa điểm? — Hạn chót để chốt số lượng khách.',
      },
    ],
  },
  {
    id: 'g-p7-0009',
    part: 7,
    passages: [
      {
        label: 'Email (Email)',
        text:
          'To: Laura Benitez <l.benitez@crestwoodtextiles.example>\n' +
          'From: Orders, Hartley Machinery\n' +
          'Subject: Your enquiry of 12 April\n\n' +
          'Dear Ms. Benitez,\n\n' +
          'Thank you for your enquiry about the Model 7 cutting machine.\n\n' +
          'The Model 7 is in stock and available for delivery within ten working days. The price of $18,400 ' +
          'includes installation and a full day of operator training. An extended warranty, which you did not ' +
          'enquire about, is available for a further $900 per year.\n\n' +
          'You mentioned that your current machine has been out of service since February. With that in mind, ' +
          'we can offer a refurbished Model 5 as a loan unit while your order is being processed, provided that ' +
          'you arrange transport.\n\n' +
          'Please note that installation must be carried out by our engineers; work done by third parties will ' +
          'invalidate the warranty.\n\n' +
          'I look forward to hearing from you.\nPeter Sandberg\nOrders Team',
      },
      {
        label: 'Bảng giá phụ (Price schedule excerpt)',
        text:
          'HARTLEY MACHINERY — MODEL 7 SCHEMATIC\n' +
          'Standard machine: $18,400 (installation and one training day included)\n' +
          'Extended warranty: $900 per year\n' +
          'Additional training day: $450\n' +
          'Loan unit (refurbished Model 5): free of charge, transport at customer\'s cost\n' +
          'Delivery: ten working days from order confirmation\n' +
          'Payment terms: 30 days from delivery\n\n' +
          'Note: warranty is void where installation is carried out by anyone other than an approved Hartley ' +
          'engineer.',
      },
    ],
    questions: [
      {
        id: 'p7-0033',
        difficulty: 2,
        tags: ['main-topic'],
        stimulusId: 'g-p7-0009',
        prompt: 'What is the email mainly about?',
        choices: [
          'A response to a request for information about a machine',
          'A complaint about a faulty cutting machine',
          'An invoice for a delivery made in April',
          'A job application to a textile company',
        ],
        answer: 'A',
        explanation:
          'Email trả lời câu hỏi về máy cắt Model 7 và nêu giá, thời hạn giao, bảo hành → A đúng. ' +
          'B sai vì người viết là bên bán, không có khiếu nại. ' +
          'C sai vì đây là báo giá, chưa có hoá đơn. ' +
          'D sai vì không có nội dung ứng tuyển.',
        translation: 'Email chủ yếu nói về điều gì? — Phản hồi yêu cầu thông tin về một loại máy.',
      },
      {
        id: 'p7-0034',
        difficulty: 3,
        tags: ['detail', 'synthesis'],
        stimulusId: 'g-p7-0009',
        prompt: 'What would cost Ms. Benitez an additional $900 each year?',
        choices: [
          'A second training day', 'The extended warranty', 'Transport of the loan unit', 'Installation'],
        answer: 'B',
        explanation:
          'Cả email và bảng giá đều ghi "Extended warranty: $900 per year" → B đúng. ' +
          'A sai vì ngày huấn luyện thêm tốn 450 đô. ' +
          'C sai vì vận chuyển máy cho mượn do khách trả nhưng không phải 900 đô mỗi năm. ' +
          'D sai vì lắp đặt đã nằm trong giá máy.',
        translation: 'Khoản nào khiến bà Benitez phải trả thêm 900 đô mỗi năm? — Gói bảo hành mở rộng.',
      },
      {
        id: 'p7-0035',
        difficulty: 4,
        tags: ['inference', 'condition'],
        stimulusId: 'g-p7-0009',
        prompt: 'What condition applies to the loan machine?',
        choices: [
        'It must be returned within one month.',
        'It comes with a separate warranty.',
        'The customer must arrange its transport.',
        'It can only be used by trained staff.',
      ],
        answer: 'C',
        explanation:
          'Email ghi "provided that you arrange transport", bảng giá ghi "transport at customer\'s cost" → C đúng. ' +
          'A sai vì thời hạn một tháng không được nêu. ' +
          'B sai vì không có bảo hành riêng cho máy cho mượn. ' +
          'D sai vì yêu cầu nhân viên được đào tạo không được nêu cho máy cho mượn.',
        translation: 'Điều kiện nào áp dụng cho máy cho mượn? — Khách hàng phải tự thu xếp vận chuyển.',
      },
      {
        id: 'p7-0036',
        difficulty: 4,
        tags: ['synthesis', 'detail'],
        stimulusId: 'g-p7-0009',
        prompt: 'What would violate the warranty according to BOTH documents?',
        choices: [
        'Using the machine for more than eight hours a day',
        'Paying later than thirty days after delivery',
        'Missing a scheduled maintenance visit',
        'Having installation done by a third party',
      ],
        answer: 'D',
        explanation:
          'Email ghi "work done by third parties will invalidate the warranty" và bảng giá ghi "warranty is void where installation is carried out by anyone other than an approved Hartley engineer" → D đúng. ' +
          'A sai vì số giờ vận hành không được nêu. ' +
          'C sai vì lịch bảo trì không được nhắc tới. ' +
          'B sai vì điều khoản thanh toán không liên quan bảo hành.',
        translation: 'Điều gì sẽ làm mất hiệu lực bảo hành theo CẢ HAI tài liệu? — Việc lắp đặt do bên thứ ba thực hiện.',
      },
    ],
  },
  {
    id: 'g-p7-0010',
    part: 7,
    passages: [
      {
        label: 'Thông báo nội bộ (Internal memo)',
        text:
          'MEMORANDUM\n' +
          'To: All staff, Distribution Centre\n' +
          'From: Health and Safety Committee\n' +
          'Subject: New footwear policy\n\n' +
          'Following two incidents last quarter, the committee has agreed that from 1 July all staff working in the ' +
          'warehouse must wear steel-toe boots rather than trainers.\n\n' +
          'The company will provide one pair free of charge. Staff should visit the stores office during their break ' +
          'to be measured before 20 June, so that the order can be placed in time.\n\n' +
          'Anyone who already owns suitable boots may continue to wear them if they present a receipt showing that ' +
          'they meet the EN ISO 20345 standard.\n\n' +
          'Office-based staff are not affected by this policy, although they must still wear high-visibility vests ' +
          'whenever they enter the warehouse floor.',
      },
      {
        label: 'Thư từ nhân viên (Staff letter)',
        text:
          'Dear Ms. Petrov,\n\n' +
          'I am writing about the new boot policy. I have worked in the dispatch area for eleven years and I already ' +
          'have two pairs of steel-toe boots, which I bought myself two years ago.\n\n' +
          'Unfortunately I no longer have the receipt. Is there another way to prove that the boots comply, for ' +
          'example an inspection by the stores office? I would rather not order a third pair that I do not need.\n\n' +
          'I would also like to know whether the measuring appointments can be done before 7 a.m., as my shift starts ' +
          'at six and I am not usually on site during the day.\n\n' +
          'Thank you for your help.\nMarcus Bell\nDispatch, Team 4',
      },
    ],
    questions: [
      {
        id: 'p7-0037',
        difficulty: 2,
        tags: ['main-topic', 'synthesis'],
        stimulusId: 'g-p7-0010',
        prompt: 'What change does the memorandum announce?',
        choices: [
          'Staff in the warehouse must wear steel-toe boots.',
          'All staff must buy their own safety equipment.',
          'High-visibility vests are no longer required.',
          'Measuring appointments have been cancelled.',
        ],
        answer: 'A',
        explanation:
          'Công văn nêu rõ từ 1 tháng Bảy nhân viên kho phải đi ủng mũi thép → A đúng. ' +
          'B sai vì công ty cấp một đôi miễn phí. ' +
          'C sai vì áo phản quang vẫn bắt buộc với cả nhân viên văn phòng khi vào kho. ' +
          'D sai vì việc đo cỡ chân vẫn diễn ra, chỉ có hạn chót là 20 tháng Sáu.',
        translation: 'Công văn thông báo thay đổi gì? — Nhân viên kho phải mang ủng mũi thép.',
      },
      {
        id: 'p7-0038',
        difficulty: 3,
        tags: ['detail', 'deadline'],
        stimulusId: 'g-p7-0010',
        prompt: 'What must staff do before 20 June?',
        choices: [
          'Hand in their old trainers',
          'Be measured for boots at the stores office',
          'Attend a health and safety briefing',
          'Sign a new employment contract',
        ],
        answer: 'B',
        explanation:
          '"Staff should visit the stores office during their break to be measured before 20 June" → B đúng. ' +
          'A sai vì việc thu lại giày cũ không được nêu. ' +
          'C sai vì buổi phổ biến an toàn không được nhắc tới. ' +
          'D sai vì hợp đồng lao động không liên quan.',
        translation: 'Nhân viên phải làm gì trước ngày 20 tháng Sáu? — Được đo cỡ chân tại phòng kho.',
      },
      {
        id: 'p7-0039',
        difficulty: 4,
        tags: ['inference', 'problem'],
        stimulusId: 'g-p7-0010',
        prompt: 'What problem does Mr. Bell describe?',
        choices: [
        'He was not measured in time for the order.',
        'His boots no longer meet the required standard.',
        'He has lost the receipt for boots that already comply.',
        'He works in an office rather than the warehouse.',
      ],
        answer: 'C',
        explanation:
          '"Unfortunately I no longer have the receipt" trong khi công văn yêu cầu xuất trình hoá đơn → C đúng. ' +
          'B sai vì anh ta nói đôi ủng của mình là loại mũi thép đạt chuẩn. ' +
          'A sai vì hạn 20 tháng Sáu chưa tới. ' +
          'D sai vì anh ta làm ở bộ phận điều vận trong kho.',
        translation: 'Ông Bell trình bày vấn đề gì? — Ông đã mất hoá đơn của đôi ủng vốn đã đạt chuẩn.',
      },
      {
        id: 'p7-0040',
        difficulty: 4,
        tags: ['synthesis', 'inference'],
        stimulusId: 'g-p7-0010',
        prompt: 'What does Mr. Bell ask Ms. Petrov to consider?',
        choices: [
        'Excusing him from the policy completely',
        'Changing his shift to daytime hours',
        'Reimbursing the cost of his existing boots',
        'An alternative way to prove his boots comply',
      ],
        answer: 'D',
        explanation:
          '"Is there another way to prove that the boots comply, for example an inspection by the stores office?" → D đúng. ' +
          'A sai vì anh ta không xin miễn trừ hoàn toàn. ' +
          'C sai vì anh ta không đề nghị hoàn tiền. ' +
          'B sai vì anh ta chỉ hỏi có thể đo cỡ trước bảy giờ, không xin đổi ca.',
        translation: 'Ông Bell đề nghị bà Petrov cân nhắc điều gì? — Một cách khác để chứng minh ủng của ông đạt chuẩn.',
      },
    ],
  },
  {
    id: 'g-p7-0011',
    part: 7,
    passages: [
      {
        label: 'Quảng cáo (Advertisement)',
        text:
          'THE WREN & ANVIL — NOW TAKING BOOKINGS FOR AUTUMN\n\n' +
          'Our converted barn seats up to sixty guests for weddings, parties and corporate events. Set in nine ' +
          'acres of meadow, the venue offers exclusive use of the main hall, a walled garden and a covered terrace.\n\n' +
          'Package prices start at $3,200 for a Saturday in October and include tables, chairs, linen and ' +
          'staffing for six hours. Catering is not included, but we work with three approved suppliers and are ' +
          'happy to introduce you to them.\n\n' +
          'Music must finish by 11 p.m. because of a local agreement with neighbouring farms.\n\n' +
          'A non-refundable deposit of $600 secures your date. The balance is due eight weeks before the event.\n\n' +
          'Viewings are held on Tuesday afternoons and Saturday mornings by appointment.',
      },
      {
        label: 'Email (Email)',
        text:
          'To: hello@wrenandanvil.example\n' +
          'From: priya.nair@larkinstudio.example\n' +
          'Subject: October booking and catering question\n\n' +
          'Hello,\n\n' +
          'We are a design studio of about thirty people and would like to hold our tenth-anniversary party on a ' +
          'Saturday in October. Your venue looks ideal, especially the walled garden.\n\n' +
          'Two questions. First, your advertisement mentions that catering is not included. We would prefer to use ' +
          'our own caterer, who has worked with us for years; is that possible, or must we choose one of your three ' +
          'suppliers?\n\n' +
          'Second, we would like to have a live band. Could you confirm whether the 11 p.m. finish applies to all ' +
          'music, or whether an acoustic set would be treated differently?\n\n' +
          'We would also like to visit. Is there any availability on a Tuesday afternoon in the next few weeks?\n\n' +
          'Best wishes,\nPriya Nair',
      },
    ],
    questions: [
      {
        id: 'p7-0041',
        difficulty: 2,
        tags: ['main-topic', 'synthesis'],
        stimulusId: 'g-p7-0011',
        prompt: 'What is the purpose of Ms. Nair\'s email?',
        choices: [
          'To ask questions about a potential venue booking',
          'To complain about a previous event at the barn',
          'To apply to become an approved caterer',
          'To cancel a viewing appointment'],
        answer: 'A',
        explanation:
          'Bà Nair nêu hai câu hỏi về dịch vụ ăn uống và âm nhạc, rồi xin đặt lịch tham quan → A đúng. ' +
          'B sai vì chưa từng tổ chức ở đó. ' +
          'C sai vì bà ấy chỉ muốn dùng đơn vị phục vụ quen, không xin làm nhà cung cấp được duyệt. ' +
          'D sai vì đây là lần đầu liên hệ.',
        translation: 'Mục đích email của bà Nair là gì? — Hỏi về một địa điểm có thể đặt tiệc.',
      },
      {
        id: 'p7-0042',
        difficulty: 3,
        tags: ['detail', 'cost'],
        stimulusId: 'g-p7-0011',
        prompt: 'What does the package price include?',
        choices: [
          'Catering by three suppliers',
          'Tables, chairs, linen and six hours of staffing',
          'Live music until eleven in the evening',
          'Accommodation in the converted barn',
        ],
        answer: 'B',
        explanation:
          '"include tables, chairs, linen and staffing for six hours" → B đúng. ' +
          'A sai vì quảng cáo nói rõ "Catering is not included". ' +
          'C sai vì âm nhạc không nằm trong gói giá. ' +
          'D sai vì chỗ nghỉ qua đêm không được nhắc tới.',
        translation: 'Giá gói bao gồm những gì? — Bàn, ghế, khăn trải bàn và sáu giờ nhân viên phục vụ.',
      },
      {
        id: 'p7-0043',
        difficulty: 3,
        tags: ['inference', 'policy'],
        stimulusId: 'g-p7-0011',
        prompt: 'Why must music finish by 11 p.m.?',
        choices: [
        'The barn has no soundproofing.',
        'Staff are only employed for six hours.',
        'There is an agreement with nearby farms.',
        'The road closes at that time.',
      ],
        answer: 'C',
        explanation:
          '"because of a local agreement with neighbouring farms" → C đúng. ' +
          'A sai vì cách âm không được nêu. ' +
          'B sai vì sáu giờ là thời lượng nhân viên, không phải lý do dừng nhạc. ' +
          'D sai vì việc đóng đường không được nhắc tới.',
        translation: 'Vì sao nhạc phải kết thúc trước 11 giờ đêm? — Vì có thoả thuận với các nông trại bên cạnh.',
      },
      {
        id: 'p7-0044',
        difficulty: 4,
        tags: ['synthesis', 'detail'],
        stimulusId: 'g-p7-0011',
        prompt: 'Which requirement of the venue does Ms. Nair question?',
        choices: [
        'The size of the main hall',
        'The number of available Saturdays',
        'The amount of the deposit',
        'The choice of catering supplier',
      ],
        answer: 'D',
        explanation:
          'Quảng cáo nói khách làm việc với ba nhà cung cấp được duyệt; email hỏi liệu có thể dùng đơn vị quen hay buộc phải chọn một trong ba → D đúng. ' +
          'A sai vì sức chứa sáu mươi người chưa bị đặt dấu hỏi. ' +
          'C sai vì mức đặt cọc không được thắc mắc. ' +
          'B sai vì số ngày thứ Bảy còn trống không được hỏi tới.',
        translation: 'Yêu cầu nào của địa điểm bị bà Nair đặt dấu hỏi? — Việc phải chọn nhà cung cấp dịch vụ ăn uống.',
      },
    ],
  },
  {
    id: 'g-p7-0012',
    part: 7,
    passages: [
      {
        label: 'Thông báo (Public notice)',
        text:
          'ROADWORKS ON THE A19 — 4 TO 22 SEPTEMBER\n\n' +
          'Resurfacing work will take place on the A19 between Millbridge and Fairhaven for three weeks. ' +
          'The road will be closed to through traffic in both directions between 8 p.m. and 6 a.m. on weekdays.\n\n' +
          'During the daytime, one lane will remain open, and traffic will be controlled by temporary lights. ' +
          'Delays of up to twenty minutes should be expected at peak times.\n\n' +
          'A signed diversion will direct traffic via the B421 through Fairhaven village. ' +
          'Residents of Fairhaven are asked to note that the diversion will increase traffic on the village high ' +
          'street, and the council has arranged additional parking restrictions there for the duration of the works.\n\n' +
          'Access to properties on the A19 will be maintained at all times, and emergency services have been ' +
          'informed of the schedule.',
      },
      {
        label: 'Email (Email)',
        text:
          'To: highways@westmere-council.example\n' +
          'From: tom.achebe@fairhavenvillagehall.example\n' +
          'Subject: September roadworks\n\n' +
          'Dear Sir or Madam,\n\n' +
          'I run the village hall in Fairhaven, and we have a wedding booked for Saturday 13 September.\n\n' +
          'Your notice says the diversion will bring traffic through the high street. Our car park entrance is ' +
          'directly off that road, and I am concerned that guests will struggle to turn in, especially with the new ' +
          'parking restrictions in place.\n\n' +
          'Would it be possible to suspend the parking restrictions on the afternoon of the thirteenth, or to ' +
          'provide a marshal for an hour before the ceremony?\n\n' +
          'I would also be grateful to know whether the night-time closures include Saturday nights, since our ' +
          'event finishes at eleven.\n\n' +
          'Yours faithfully,\nTom Achebe',
      },
    ],
    questions: [
      {
        id: 'p7-0045',
        difficulty: 3,
        tags: ['detail', 'synthesis'],
        stimulusId: 'g-p7-0012',
        prompt: 'When is the A19 closed to through traffic?',
        choices: [
        'Between 8 p.m. and 6 a.m. on weekdays',
        'Throughout the whole of every weekday',
        'Only at peak times',
        'For the whole of September, day and night',
      ],
        answer: 'A',
        explanation:
          '"closed to through traffic in both directions between 8 p.m. and 6 a.m. on weekdays" → A đúng. ' +
          'B sai vì ban ngày vẫn còn một làn mở. ' +
          'C sai vì giờ cao điểm chỉ gây chậm trễ, không đóng đường. ' +
          'D sai vì công trình kéo dài ba tuần, không phải cả tháng.',
        translation: 'Khi nào đường A19 đóng với xe đi xuyên tuyến? — Từ 8 giờ tối đến 6 giờ sáng các ngày trong tuần.',
      },
      {
        id: 'p7-0046',
        difficulty: 2,
        tags: ['detail', 'reason'],
        stimulusId: 'g-p7-0012',
        prompt: 'Why has the council arranged extra parking restrictions in Fairhaven?',
        choices: [
        'Because the village hall requested them',
        'Because the diversion will increase village traffic',
        'Because residents parked illegally',
        'Because the B421 will be widened',
      ],
        answer: 'B',
        explanation:
          '"the diversion will increase traffic on the village high street, and the council has arranged additional parking restrictions" → B đúng. ' +
          'A sai vì chính ông Achebe đang xin tạm ngừng các hạn chế đó. ' +
          'C sai vì việc đỗ xe trái phép không được nêu. ' +
          'D sai vì việc mở rộng đường B421 không được nhắc tới.',
        translation: 'Vì sao hội đồng áp thêm hạn chế đỗ xe ở Fairhaven? — Vì tuyến đường tránh sẽ làm tăng lưu lượng trong làng.',
      },
      {
        id: 'p7-0047',
        difficulty: 4,
        tags: ['inference', 'detail'],
        stimulusId: 'g-p7-0012',
        prompt: 'What is Mr. Achebe\'s main concern?',
        choices: [
        'The roadworks will damage the village hall.',
        'The wedding will be postponed by the council.',
        'Guests will be unable to turn into the car park.',
        'Emergency services will not reach the village.',
      ],
        answer: 'C',
        explanation:
          '"our car park entrance is directly off that road, and I am concerned that guests will struggle to turn in" → C đúng. ' +
          'B sai vì việc hoãn đám cưới không được nêu. ' +
          'A sai vì thiệt hại công trình không được nhắc tới. ' +
          'D sai vì thông báo nói dịch vụ khẩn cấp đã được thông báo lịch.',
        translation: 'Lo ngại chính của ông Achebe là gì? — Khách sẽ khó rẽ vào bãi đỗ xe.',
      },
      {
        id: 'p7-0048',
        difficulty: 4,
        tags: ['synthesis', 'detail'],
        stimulusId: 'g-p7-0012',
        prompt: 'Which point is unclear to Mr. Achebe after reading the notice?',
        choices: [
        'Whether property access will be maintained',
        'Which council department is responsible',
        'When the resurfacing began',
        'Whether Saturday nights are included in the closures',
      ],
        answer: 'D',
        explanation:
          '"I would also be grateful to know whether the night-time closures include Saturday nights" → D đúng. ' +
          'A sai vì thông báo đã khẳng định "Access … will be maintained at all times". ' +
          'C sai vì ngày bắt đầu đã ghi rõ 4 tháng Chín. ' +
          'B sai vì ông ấy gửi đúng phòng ban highways, không thắc mắc về đầu mối.',
        translation: 'Điểm nào ông Achebe thấy chưa rõ sau khi đọc thông báo? — Liệu việc đóng đường ban đêm có gồm tối thứ Bảy không.',
      },
    ],
  },
]

export const PART7B_STIMULI = readingStimuli(GROUPS)
export const PART7B_QUESTIONS = readingQuestions(GROUPS)
