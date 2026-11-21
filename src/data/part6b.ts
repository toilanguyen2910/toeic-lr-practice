import { readingQuestions, readingStimuli, type ReadingGroup } from './questionBuilders'

/**
 * PART 6 — bổ sung 8 đoạn (p6-0009 … p6-0040), nâng Part 6 lên 10 đoạn × 4 câu = 40 câu.
 *
 * Mỗi đoạn có đúng bốn chỗ trống ______. Ba câu đầu là điền từ/ngữ pháp, câu thứ tư là
 * dạng chèn câu (sentence insertion) — câu hỏi hỏi câu nào phù hợp nhất với vị trí trống.
 */
const GROUPS: ReadingGroup[] = [
  {
    id: 'g-p6-0003',
    part: 6,
    passages: [
      {
        label: 'Email nội bộ (Internal email)',
        text:
          'From: Safety Office\n' +
          'To: All warehouse staff\n' +
          'Subject: Updated loading procedures\n\n' +
          'Dear colleagues,\n\n' +
          'Following last month\'s inspection, we have revised the procedures for loading and unloading. ' +
          'The changes take effect (1) ______ Monday morning.\n\n' +
          'The most important change concerns the loading bay. Vehicles must now be reversed into the bay rather ' +
          'than driven in forwards, (2) ______ gives forklift drivers more room to work safely. ' +
          'Drivers who are not comfortable reversing should ask a colleague to guide them.\n\n' +
          'In addition, all staff (3) ______ to wear high-visibility vests at all times while on the bay. ' +
          'Spare vests are kept in the locker room next to the staff entrance.\n\n' +
          'Please read the full procedure, which is posted on the notice board. (4) ______\n\n' +
          'Thank you for your cooperation.\nSafety Office',
      },
    ],
    questions: [
      {
        id: 'p6-0009',
        difficulty: 2,
        tags: ['preposition', 'time'],
        stimulusId: 'g-p6-0003',
        prompt: 'Which word best completes blank (1)?',
        choices: [
        'since',
        'from',
        'during',
        'until',
      ],
        answer: 'B',
        explanation:
          '"Take effect from + mốc thời gian" là cụm chuẩn nghĩa là có hiệu lực từ lúc nào → B đúng. ' +
          'A sai vì "since" cần mốc bắt đầu trong quá khứ và thường đi với thì hoàn thành. ' +
          'C sai vì "during" đi với một khoảng thời gian, không đi với một ngày cụ thể. ' +
          'D sai vì "until" nghĩa là kéo dài đến lúc đó rồi dừng.',
        translation: 'Những thay đổi có hiệu lực từ sáng thứ Hai.',
      },
      {
        id: 'p6-0010',
        difficulty: 3,
        tags: ['relative-pronoun', 'adjective-clause'],
        stimulusId: 'g-p6-0003',
        prompt: 'Which word best completes blank (2)?',
        choices: [
        'who',
        'whose',
        'which',
        'what',
      ],
        answer: 'C',
        explanation:
          'Đại từ quan hệ thay cho cả mệnh đề phía trước (việc lùi xe vào bến) nên phải dùng "which" → C đúng. ' +
          'A sai vì "who" chỉ người. ' +
          'B sai vì "whose" phải đứng trước danh từ chỉ sự sở hữu. ' +
          'D sai vì "what" không làm đại từ quan hệ sau dấu phẩy.',
        translation: '…việc này giúp tài xế xe nâng có thêm chỗ làm việc an toàn.',
      },
      {
        id: 'p6-0011',
        difficulty: 2,
        tags: ['passive-voice', 'modal-verb'],
        stimulusId: 'g-p6-0003',
        prompt: 'Which word best completes blank (3)?',
        choices: [
        'require',
        'requiring',
        'requires',
        'are required',
      ],
        answer: 'D',
        explanation:
          'Chủ ngữ "all staff" số nhiều và nhân viên ĐƯỢD yêu cầu mặc áo phản quang nên cần bị động số nhiều "are required" → D đúng. ' +
          'A sai vì "require" là chủ động số nhiều, đổi nghĩa câu. ' +
          'B sai vì "requiring" không phải động từ chính. ' +
          'C sai vì "requires" chia số ít.',
        translation: 'Ngoài ra, toàn bộ nhân viên được yêu cầu mặc áo phản quang trong suốt thời gian ở bến bốc dỡ.',
      },
      {
        id: 'p6-0012',
        difficulty: 3,
        tags: ['sentence-insertion', 'cohesion'],
        stimulusId: 'g-p6-0003',
        prompt: 'Which sentence best fits blank (4)?',
        choices: [
        'Anyone who has not yet read it should do so before their next shift.',
        'The inspection was carried out by an external team.',
        'We ordered twelve new forklifts last quarter.',
        'The loading bay was resurfaced three years ago.',
      ],
        answer: 'A',
        explanation:
          'Ngay trước chỗ trống là lời đề nghị đọc toàn bộ quy trình trên bảng tin, nên câu nối tiếp tự nhiên là nhắc ai chưa đọc thì đọc trước ca tới → A đúng. ' +
          'B nói về đoàn kiểm tra nhưng lặp lại ý đã nêu ở đoạn đầu, không nối được với câu trước. ' +
          'D nói về việc lát lại mặt bến, không liên quan tài liệu cần đọc. ' +
          'C nói về việc mua xe nâng, cũng không ăn nhập với câu đứng trước.',
        translation: 'Ai chưa đọc thì nên đọc trước ca làm tiếp theo.',
      },
    ],
  },
  {
    id: 'g-p6-0004',
    part: 6,
    passages: [
      {
        label: 'Thông báo tuyển dụng (Job advertisement)',
        text:
          'SENIOR ACCOUNTANT — WESTGATE MANUFACTURING\n\n' +
          'Westgate Manufacturing is looking for a senior accountant to join our finance team of eight people. ' +
          'The successful candidate will report (1) ______ the financial controller and will be responsible for ' +
          'monthly reporting and tax filings.\n\n' +
          'Applicants should hold a recognised accounting qualification and have at least five years of experience, ' +
          '(2) ______ in a manufacturing environment. Experience with our accounting software is an advantage, ' +
          'although training can be provided for the right person.\n\n' +
          'The role is based at our head office, with the option of working from home two days a week. ' +
          'We offer a competitive salary, private health insurance and (3) ______ training budget.\n\n' +
          'To apply, please send a covering letter and CV to recruitment@westgate.example by 30 April. ' +
          '(4) ______\n\n' +
          'Westgate Manufacturing is an equal opportunities employer.',
      },
    ],
    questions: [
      {
        id: 'p6-0013',
        difficulty: 2,
        tags: ['preposition', 'collocation'],
        stimulusId: 'g-p6-0004',
        prompt: 'Which word best completes blank (1)?',
        choices: [
        'of',
        'to',
        'at',
        'with',
      ],
        answer: 'B',
        explanation:
          '"Report to somebody" là cụm chuẩn nghĩa là báo cáo trực tiếp cho ai → B đúng. ' +
          'D sai vì "report with" không diễn tả quan hệ cấp trên. ' +
          'C sai vì "report at" chỉ nộp báo cáo tại địa điểm. ' +
          'A sai vì "report of" dùng cho báo cáo về một vấn đề.',
        translation: 'Ứng viên trúng tuyển sẽ báo cáo trực tiếp cho trưởng phòng tài chính.',
      },
      {
        id: 'p6-0014',
        difficulty: 3,
        tags: ['preposition', 'context'],
        stimulusId: 'g-p6-0004',
        prompt: 'Which word best completes blank (2)?',
        choices: [
        'ideally with',
        'ideally at',
        'ideally',
        'ideally spoken',
      ],
        answer: 'C',
        explanation:
          'Bụm "ideally in a manufacturing environment" chỉ điều kiện mong muốn; trong bốn phương án thì chỉ C tạo được cụm trạng ngữ hợp lệ nối với "in a manufacturing environment" phía sau → C đúng. ' +
          'D sai vì thêm "spoken" tạo cụm vô nghĩa. ' +
          'B sai vì "at" không đi với "environment" trong ngữ cảnh này và tạo câu tối nghĩa. ' +
          'A sai vì "with" cũng không kết hợp được với "environment" ở đây.',
        translation: '…và có ít nhất năm năm kinh nghiệm, lý tưởng là trong môi trường sản xuất.',
      },
      {
        id: 'p6-0015',
        difficulty: 2,
        tags: ['article', 'quantifier'],
        stimulusId: 'g-p6-0004',
        prompt: 'Which word best completes blank (3)?',
        choices: [
        'some',
        'an',
        'the',
        'a',
      ],
        answer: 'D',
        explanation:
          '"Budget" là danh từ đếm được số ít, chưa được xác định trong ngữ cảnh, và "training" bắt đầu bằng phụ âm nên cần "a" → D đúng. ' +
          'B sai vì "an" đứng trước nguyên âm. ' +
          'C sai vì "the" dùng cho đối tượng đã xác định. ' +
          'A sai vì "some" không đi với danh từ đếm được số ít.',
        translation: 'Chúng tôi cung cấp mức lương cạnh tranh, bảo hiểm y tế tư nhân và một ngân sách đào tạo.',
      },
      {
        id: 'p6-0016',
        difficulty: 3,
        tags: ['sentence-insertion', 'cohesion'],
        stimulusId: 'g-p6-0004',
        prompt: 'Which sentence best fits blank (4)?',
        choices: [
        'Our factory is located thirty kilometres from the city centre.',
        'All employees must complete a health and safety course.',
        'Shortlisted candidates will be contacted within two weeks of the closing date.',
        'The company was founded in 1974 by two engineers.',
      ],
        answer: 'C',
        explanation:
          'Dâu trước chỗ trống hướng dẫn cách nộp hồ sơ, nên câu nối tự nhiên là thông báo bước tiếp theo trong quy trình tuyển dụng → C đúng. ' +
          'A nói vị trí nhà máy, không liên quan quy trình nộp đơn. ' +
          'D nói lịch sử thành lập công ty, lạc đề so với câu trước. ' +
          'B nói về khoá huấn luyện an toàn, không nối với hướng dẫn nộp hồ sơ.',
        translation: 'Ứng viên vào danh sách rút gọn sẽ được liên hệ trong vòng hai tuần kể từ ngày hết hạn.',
      },
    ],
  },
  {
    id: 'g-p6-0005',
    part: 6,
    passages: [
      {
        label: 'Thông báo dịch vụ (Service notice)',
        text:
          'IMPORTANT INFORMATION FOR PASSENGERS\n\n' +
          'From 1 March, the airport shuttle bus will operate a new timetable. Buses will leave the city terminal ' +
          '(1) ______ fifteen minutes instead of every twenty, and the journey will take approximately forty minutes.\n\n' +
          'Passengers should be aware that the shuttle now stops at Terminal 2 before Terminal 1. ' +
          '(2) ______ passengers travelling to Terminal 1 should allow an extra ten minutes.\n\n' +
          'Tickets can be bought on board or in advance through our mobile app. ' +
          'Those who buy through the app receive a discount of fifteen percent, (3) ______ the ticket is purchased ' +
          'at least twenty-four hours before departure.\n\n' +
          'We would also like to remind passengers that luggage must not (4) ______ unattended at any time.\n\n' +
          'Thank you for travelling with Citylink.',
      },
    ],
    questions: [
      {
        id: 'p6-0017',
        difficulty: 2,
        tags: ['quantifier', 'frequency'],
        stimulusId: 'g-p6-0005',
        prompt: 'Which word best completes blank (1)?',
        choices: [
        'some',
        'every',
        'all',
        'each',
      ],
        answer: 'B',
        explanation:
          '"Every + khoảng thời gian" diễn tả tần suất lặp lại đều đặn → B đúng. ' +
          'D sai vì "each" không dùng trước cụm thời gian theo cách này. ' +
          'C sai vì "all" cần danh từ số nhiều có mạo từ. ' +
          'A sai vì "some" không diễn tả tần suất.',
        translation: 'Xe buýt sẽ rời bến thành phố mỗi mười lăm phút thay vì hai mươi phút.',
      },
      {
        id: 'p6-0018',
        difficulty: 3,
        tags: ['connector', 'result'],
        stimulusId: 'g-p6-0005',
        prompt: 'Which word best completes blank (2)?',
        choices: [
        'Therefore',
        'Meanwhile',
        'Unless',
        'Although',
      ],
        answer: 'A',
        explanation:
          'Câu trước nói xe dừng ở Nhà ga 2 trước, câu sau nói khách đi Nhà ga 1 cần thêm thời gian — quan hệ kết quả nên cần "Therefore" → A đúng. ' +
          'D sai vì "Although" chỉ nhượng bộ và cần mệnh đề đối lập. ' +
          'C sai vì "Unless" mang nghĩa điều kiện phủ định. ' +
          'B sai vì "Meanwhile" chỉ hai việc song song.',
        translation: 'Vì vậy, hành khách đi Nhà ga 1 nên dự trù thêm mười phút.',
      },
      {
        id: 'p6-0019',
        difficulty: 3,
        tags: ['conditional', 'conjunction'],
        stimulusId: 'g-p6-0005',
        prompt: 'Which word best completes blank (3)?',
        choices: [
        'due to',
        'in case',
        'even though',
        'provided that',
      ],
        answer: 'D',
        explanation:
          '"provided that" nghĩa là với điều kiện là, khớp với điều kiện vé mua trước hai mươi tư giờ → D đúng. ' +
          'A sai vì "due to" đi với cụm danh từ chỉ nguyên nhân. ' +
          'B sai vì "in case" diễn tả việc phòng khi, không phải điều kiện bắt buộc. ' +
          'C sai vì "even though" chỉ nhượng bộ.',
        translation: '…giảm giá mười lăm phần trăm, với điều kiện vé được mua trước giờ khởi hành ít nhất hai mươi tư giờ.',
      },
      {
        id: 'p6-0020',
        difficulty: 3,
        tags: ['passive-voice', 'modal-verb'],
        stimulusId: 'g-p6-0005',
        prompt: 'Which word best completes blank (4)?',
        choices: [
        'be left',
        'leave',
        'leaving',
        'be leaving',
      ],
        answer: 'A',
        explanation:
          'Hành lý KHÔNG được để không người trông coi nên cần bị động sau "must not": "must not be left" → A đúng. ' +
          'B sai vì "leave" là chủ động, đổi nghĩa thành hành lý tự bỏ đi. ' +
          'C sai vì "leaving" không đứng sau "must not". ' +
          'D sai vì "be leaving" là tiếp diễn chủ động.',
        translation: 'Chúng tôi cũng xin nhắc hành khách không được để hành lý mà không có người trông coi.',
      },
    ],
  },
  {
    id: 'g-p6-0006',
    part: 6,
    passages: [
      {
        label: 'Thư mời (Invitation letter)',
        text:
          'Dear Ms. Almeida,\n\n' +
          'On behalf of the Board of Directors, I am delighted to invite you to the opening of our new research ' +
          'centre in Porto. The event will take place (1) ______ Friday, 14 November, from six in the evening.\n\n' +
          'The evening will begin with a short tour of the laboratories, (2) ______ will be followed by a reception ' +
          'and dinner in the main hall. We expect around eighty guests, including researchers, suppliers and ' +
          'representatives from the city council.\n\n' +
          'As we need to confirm numbers with the caterer, we would be grateful if you could reply (3) ______ ' +
          '1 November. Free parking will be available in the visitors\' car park, and a map is enclosed.\n\n' +
          'We very much hope you will be able to join us. (4) ______\n\n' +
          'Yours sincerely,\nIsabel Ferreira\nDirector of Research',
      },
    ],
    questions: [
      {
        id: 'p6-0021',
        difficulty: 1,
        tags: ['preposition', 'time'],
        stimulusId: 'g-p6-0006',
        prompt: 'Which word best completes blank (1)?',
        choices: [
        'in',
        'on',
        'at',
        'by',
      ],
        answer: 'B',
        explanation:
          'Trước một ngày cụ thể ("Friday, 14 November") dùng giới từ "on" → B đúng. ' +
          'A sai vì "in" dùng cho tháng, năm hoặc khoảng thời gian dài. ' +
          'C sai vì "at" dùng cho giờ hoặc địa điểm. ' +
          'D sai vì "by" chỉ hạn chót, không dùng để nêu ngày diễn ra sự kiện.',
        translation: 'Buổi lễ sẽ diễn ra vào thứ Sáu, ngày 14 tháng Mười Một, từ sáu giờ chiều.',
      },
      {
        id: 'p6-0022',
        difficulty: 3,
        tags: ['relative-pronoun', 'passive'],
        stimulusId: 'g-p6-0006',
        prompt: 'Which word best completes blank (2)?',
        choices: [
        'who',
        'what',
        'where',
        'which',
      ],
        answer: 'D',
        explanation:
          'Đại từ quan hệ thay cho cả mệnh đề trước (chuyến tham quan phòng thí nghiệm) nên dùng "which" → D đúng. ' +
          'A sai vì "who" chỉ người. ' +
          'B sai vì "what" không đứng sau dấu phẩy làm đại từ quan hệ. ' +
          'C sai vì "where" chỉ nơi chốn.',
        translation: 'Buổi tối sẽ bắt đầu bằng chuyến tham quan các phòng thí nghiệm, sau đó là tiệc chiêu đãi và bữa tối.',
      },
      {
        id: 'p6-0023',
        difficulty: 2,
        tags: ['preposition', 'time'],
        stimulusId: 'g-p6-0006',
        prompt: 'Which word best completes blank (3)?',
        choices: [
        'by',
        'since',
        'until',
        'during',
      ],
        answer: 'A',
        explanation:
          'Trả lời hồi âm trước một hạn chót nên dùng "by + mốc thời gian" → A đúng. ' +
          'B sai vì "since" chỉ mốc bắt đầu kéo dài đến hiện tại. ' +
          'C sai vì "until" nghĩa là tiếp tục đến lúc đó, không phải phải xong trước mốc đó. ' +
          'D sai vì "during" đi với một khoảng thời gian.',
        translation: 'Vì cần chốt số lượng với đơn vị phục vụ tiệc, mong bà hồi âm trước ngày 1 tháng Mười Một.',
      },
      {
        id: 'p6-0024',
        difficulty: 3,
        tags: ['sentence-insertion', 'cohesion'],
        stimulusId: 'g-p6-0006',
        prompt: 'Which sentence best fits blank (4)?',
        choices: [
        'The laboratories were designed by a local architecture firm.',
        'The city council has approved the new building plans.',
        'Please do let us know if you require any assistance with your travel arrangements.',
        'Our research budget increased by twelve percent this year.',
      ],
        answer: 'C',
        explanation:
          'Dâu trước là lời mong khách tham dự, câu sau là chữ ký; câu nối phù hợp là lời đề nghị hỗ trợ thêm, giữ đúng giọng thư mời → C đúng. ' +
          'A nói về kiến trúc sư thiết kế, không ăn nhập với lời mời. ' +
          'D nói về ngân sách nghiên cứu, lạc chủ đề. ' +
          'B nói về việc phê duyệt kế hoạch xây dựng, cũng không nối với câu trước.',
        translation: 'Xin cho chúng tôi biết nếu bà cần hỗ trợ về việc sắp xếp đi lại.',
      },
    ],
  },
  {
    id: 'g-p6-0007',
    part: 6,
    passages: [
      {
        label: 'Hướng dẫn sử dụng (User guide)',
        text:
          'GETTING STARTED WITH YOUR SMART THERMOSTAT\n\n' +
          'Thank you for purchasing the Halo 3 thermostat. Before using the device for the first time, please read ' +
          'these instructions carefully. The thermostat should (1) ______ to the wall bracket before the power is ' +
          'connected.\n\n' +
          'Once the device is switched on, it will search for your home network. If your router is more than ten ' +
          'metres away, the connection may be weak, (2) ______ case we recommend using the supplied extender.\n\n' +
          'The Halo 3 learns your habits over the first two weeks. During this period you may notice that the ' +
          'temperature changes more (3) ______ than usual. This is normal, and the device will settle once a ' +
          'pattern has been established.\n\n' +
          'For further help, visit our support website or call our helpline. (4) ______',
      },
    ],
    questions: [
      {
        id: 'p6-0025',
        difficulty: 2,
        tags: ['passive-voice', 'modal-verb'],
        stimulusId: 'g-p6-0007',
        prompt: 'Which word best completes blank (1)?',
        choices: [
        'attaching',
        'be attached',
        'be attaching',
        'attach',
      ],
        answer: 'B',
        explanation:
          'Thiết bị ĐƯỢC gắn lên giá treo nên cần bị động sau "should": "should be attached" → B đúng. ' +
          'D sai vì "attach" là chủ động. ' +
          'A sai vì "attaching" không đứng sau "should". ' +
          'C sai vì "be attaching" là tiếp diễn chủ động.',
        translation: 'Nhiệt kế nên được gắn vào giá treo tường trước khi kết nối nguồn điện.',
      },
      {
        id: 'p6-0026',
        difficulty: 4,
        tags: ['idiom', 'fixed-phrase'],
        stimulusId: 'g-p6-0007',
        prompt: 'Which word best completes blank (2)?',
        choices: [
        'of which',
        'at which',
        'for which',
        'in which',
      ],
        answer: 'D',
        explanation:
          'Bụm cố định "in which case" nghĩa là trong trường hợp đó → D đúng. ' +
          'A sai vì "of which case" không phải cụm tiếng Anh. ' +
          'B sai vì "at which case" cũng không tồn tại. ' +
          'C sai vì "for which case" không dùng trong thành ngữ này.',
        translation: '…kết nối có thể yếu, trong trường hợp đó chúng tôi khuyên dùng bộ khuếch đại đi kèm.',
      },
      {
        id: 'p6-0027',
        difficulty: 3,
        tags: ['adverb', 'comparative'],
        stimulusId: 'g-p6-0007',
        prompt: 'Which word best completes blank (3)?',
        choices: [
        'often',
        'oftener',
        'most often',
        'more often',
      ],
        answer: 'D',
        explanation:
          'Dó "more … than" nên cần dạng so sánh hơn của trạng từ tần suất dài "often", tức "more often" → D đúng. ' +
          'A sai vì "often" là dạng gốc. ' +
          'B sai vì "oftener" không phải dạng chuẩn trong tiếng Anh hiện đại. ' +
          'C sai vì "most often" là so sánh nhất.',
        translation: 'Trong giai đoạn này bạn có thể thấy nhiệt độ thay đổi thường xuyên hơn bình thường.',
      },
      {
        id: 'p6-0028',
        difficulty: 2,
        tags: ['sentence-insertion', 'cohesion'],
        stimulusId: 'g-p6-0007',
        prompt: 'Which sentence best fits blank (4)?',
        choices: [
        'The Halo 3 is available in white and graphite grey at most retailers.',
        'The device weighs approximately three hundred grams without its bracket.',
        'Our lines are open from eight in the morning until eight in the evening, seven days a week.',
        'Installation by a qualified electrician is strongly recommended in older homes.',
      ],
        answer: 'C',
        explanation:
          'Dâu trước nhắc tới trang hỗ trợ và đường dây trợ giúp, nên câu nối tự nhiên là giờ hoạt động của tổng đài → C đúng. ' +
          'A nói về màu sắc, lạc chủ đề. ' +
          'D nói về khuyến nghị lắp đặt, đã được đề cập gián tiếp ở đầu và không nối với câu trước. ' +
          'B nói về trọng lượng thiết bị, không liên quan hỗ trợ khách hàng.',
        translation: 'Tổng đài của chúng tôi mở từ tám giờ sáng đến tám giờ tối, bảy ngày một tuần.',
      },
    ],
  },
  {
    id: 'g-p6-0008',
    part: 6,
    passages: [
      {
        label: 'Biên bản họp (Meeting minutes)',
        text:
          'MINUTES OF THE QUARTERLY STAFF MEETING\n' +
          'Held in the Cedar Room on 12 April, 10 a.m. – 11.30 a.m.\n\n' +
          'Present: 24 members of staff; apologies from three colleagues in the field office.\n\n' +
          '1. Opening\n' +
          'The chair, Ms. Lund, welcomed everyone and thanked staff for their work during the busiest quarter ' +
          '(1) ______ the year.\n\n' +
          '2. Office relocation\n' +
          'The chair confirmed that the move to the Kirkby site has been postponed until September because the ' +
          'landlord requires additional time. A full update (2) ______ at the next meeting.\n\n' +
          '3. Training\n' +
          'Several members raised concerns about the new invoicing software. It was agreed that two refresher ' +
          'sessions (3) ______ before the end of May, and that the trainer would be asked to focus on reporting.\n\n' +
          '4. Any other business\n' +
          'The chair reminded staff that the car park barrier will be repaired on 2 May, so the entrance will be ' +
          'closed for most of that day. (4) ______\n\n' +
          'The meeting closed at 11.30 a.m.',
      },
    ],
    questions: [
      {
        id: 'p6-0029',
        difficulty: 2,
        tags: ['preposition', 'superlative'],
        stimulusId: 'g-p6-0008',
        prompt: 'Which word best completes blank (1)?',
        choices: [
        'in',
        'of',
        'at',
        'on',
      ],
        answer: 'B',
        explanation:
          'Cấu trúc "the busiest quarter of the year" dùng "of" để chỉ một phần trong tổng thể → B đúng. ' +
          'A sai vì "in the year" không tạo được cụm so sánh chuẩn này. ' +
          'C sai vì "at the year" không phải cụm hợp lệ. ' +
          'D sai vì "on" chỉ ngày hoặc bề mặt.',
        translation: '…và cảm ơn nhân viên vì công sức trong quý bận rộn nhất năm.',
      },
      {
        id: 'p6-0030',
        difficulty: 3,
        tags: ['passive-voice', 'future'],
        stimulusId: 'g-p6-0008',
        prompt: 'Which word best completes blank (2)?',
        choices: [
        'will be provided',
        'will provide',
        'is providing',
        'has provided',
      ],
        answer: 'A',
        explanation:
          'Aản cập nhật ĐƯỢC cung cấp tại cuộc họp sau nên cần bị động tương lai "will be provided" → A đúng. ' +
          'B sai vì "will provide" là chủ động, khiến "B full update" thành người cung cấp. ' +
          'C sai vì tiếp diễn không hợp và vẫn là chủ động. ' +
          'D sai vì hiện tại hoàn thành không diễn tả việc sẽ làm ở cuộc họp sau.',
        translation: 'Một bản cập nhật đầy đủ sẽ được cung cấp tại cuộc họp tới.',
      },
      {
        id: 'p6-0031',
        difficulty: 3,
        tags: ['subjunctive', 'verb-form'],
        stimulusId: 'g-p6-0008',
        prompt: 'Which word best completes blank (3)?',
        choices: [
        'be held',
        'are held',
        'were held',
        'will hold',
      ],
        answer: 'A',
        explanation:
          'Sau "It was agreed that" dùng thức giả định với động từ nguyên mẫu, ở dạng bị động là "be held" → A đúng. ' +
          'B sai vì "are held" chia theo hiện tại đơn thường. ' +
          'C sai vì "were held" đưa câu về quá khứ, không phải giả định. ' +
          'D sai vì "will hold" vừa chủ động vừa không đúng cấu trúc giả định.',
        translation: 'Hai buổi ôn lại sẽ được tổ chức trước cuối tháng Năm.',
      },
      {
        id: 'p6-0032',
        difficulty: 3,
        tags: ['sentence-insertion', 'cohesion'],
        stimulusId: 'g-p6-0008',
        prompt: 'Which sentence best fits blank (4)?',
        choices: [
        'Parking permits will be issued free of charge next year.',
        'New invoicing software will be installed by the vendor.',
        'Staff are therefore advised to arrive early or use public transport that day.',
        'The Cedar Room has been reserved for training since January.',
      ],
        answer: 'C',
        explanation:
          'Dâu trước nói cổng vào sẽ đóng gần như cả ngày 2 tháng Năm, nên lời khuyên đến sớm hoặc đi phương tiện công cộng là câu nối logic → C đúng. ' +
          'A nói về giấy phép đỗ xe năm sau, không liên quan sự cố một ngày. ' +
          'D nói về việc đặt phòng họp, đã nêu ở đầu biên bản. ' +
          'B lặp lại nội dung phần đào tạo, không nối với câu trước.',
        translation: 'Vì vậy, nhân viên nên đến sớm hoặc dùng phương tiện công cộng vào ngày hôm đó.',
      },
    ],
  },
  {
    id: 'g-p6-0009',
    part: 6,
    passages: [
      {
        label: 'Email khách hàng (Customer email)',
        text:
          'From: Customer Services, Larkfield Holidays\n' +
          'To: Mr. D. Brennan\n' +
          'Subject: Your booking reference LF-4471\n\n' +
          'Dear Mr. Brennan,\n\n' +
          'Thank you for your booking with Larkfield Holidays. This email (1) ______ the details we hold for your ' +
          'stay at the Hotel Mirador from 4 to 11 July.\n\n' +
          'Your reservation is for a double room with a sea view, half board. Please note that the hotel is ' +
          'undergoing renovation work on the ground floor until the end of June, (2) ______ that the swimming pool ' +
          'will reopen in time for your visit.\n\n' +
          'We would like to remind you that the balance must (3) ______ at least six weeks before departure. ' +
          'This can be paid by bank transfer or by card through your account page.\n\n' +
          'If any of the details above are incorrect, please contact us as soon as possible. (4) ______\n\n' +
          'Kind regards,\nCustomer Services\nLarkfield Holidays',
      },
    ],
    questions: [
      {
        id: 'p6-0033',
        difficulty: 2,
        tags: ['vocabulary', 'verb'],
        stimulusId: 'g-p6-0009',
        prompt: 'Which word best completes blank (1)?',
        choices: [
        'confirming',
        'confirmation',
        'confirms',
        'to confirm',
      ],
        answer: 'C',
        explanation:
          'Chủ ngữ "This email" số ít nên cần động từ chính chia ngôi thứ ba ở hiện tại: "confirms" → C đúng. ' +
          'A sai vì "confirming" không thể là động từ chính. ' +
          'B sai vì "confirmation" là danh từ nên câu thiếu động từ. ' +
          'D sai vì "to confirm" không đứng sau chủ ngữ làm vị ngữ.',
        translation: 'Email này xác nhận thông tin chúng tôi có về kỳ nghỉ của ông tại khách sạn Mirador.',
      },
      {
        id: 'p6-0034',
        difficulty: 4,
        tags: ['conjunction', 'contrast'],
        stimulusId: 'g-p6-0009',
        prompt: 'Which word best completes blank (2)?',
        choices: [
        'however',
        'although',
        'whereas',
        'in so far',
      ],
        answer: 'A',
        explanation:
          'Sau "however" có thể nối hai mệnh đề với dấu phẩy, và nghĩa tương phản ở đây là công trình cải tạo kéo dài nhưng hồ bơi vẫn kịp mở → A đúng. ' +
          'B sai vì "although" phải đứng mở mệnh đề phụ chứ không chen giữa hai mệnh đề đã đầy đủ như vậy. ' +
          'C sai vì "whereas" cần một mệnh đề tương phản trực tiếp và thường không có "that" theo sau. ' +
          'D sai vì "in so far" phải đi với "as", không phải cụm hợp lệ.',
        translation: 'Tuy nhiên, hồ bơi sẽ mở lại kịp trước kỳ nghỉ của ông.',
      },
      {
        id: 'p6-0035',
        difficulty: 3,
        tags: ['passive-voice', 'modal-verb'],
        stimulusId: 'g-p6-0009',
        prompt: 'Which word best completes blank (3)?',
        choices: [
        'pay',
        'be paying',
        'have paid',
        'be paid',
      ],
        answer: 'D',
        explanation:
          'Khoản còn lại phải ĐƯỢD thanh toán nên cần bị động sau "must": "must be paid" → D đúng. ' +
          'A sai vì "pay" là chủ động. ' +
          'B sai vì "be paying" là tiếp diễn chủ động. ' +
          'C sai vì "must have paid" là cấu trúc suy đoán về quá khứ.',
        translation: 'Chúng tôi xin nhắc khoản tiền còn lại phải được thanh toán trước ngày khởi hành ít nhất sáu tuần.',
      },
      {
        id: 'p6-0036',
        difficulty: 2,
        tags: ['sentence-insertion', 'cohesion'],
        stimulusId: 'g-p6-0009',
        prompt: 'Which sentence best fits blank (4)?',
        choices: [
        'The Hotel Mirador has ninety rooms and two restaurants.',
        'Please quote your booking reference in all correspondence.',
        'Our office is open from Monday to Friday, nine to five.',
        'Sea views are available at an additional charge.',
      ],
        answer: 'B',
        explanation:
          'Dâu trước đề nghị liên hệ nếu thông tin chưa chính xác, nên câu nối tự nhiên là nhắc khách ghi kèm mã đặt chỗ khi liên lạc → B đúng. ' +
          'A mô tả khách sạn, không liên quan việc liên hệ. ' +
          'C nêu giờ làm việc, có liên quan nhưng không nối trực tiếp với câu trước bằng "booking reference". ' +
          'D nói về phụ phí nhìn biển, trái với thông tin phòng đã có view biển ở đoạn trên.',
        translation: 'Vui lòng ghi kèm mã đặt chỗ trong mọi thư từ liên hệ.',
      },
    ],
  },
  {
    id: 'g-p6-0010',
    part: 6,
    passages: [
      {
        label: 'Bài giới thiệu (Programme introduction)',
        text:
          'WELCOME TO THE HARBOR STREET BUSINESS PROGRAMME\n\n' +
          'The Harbor Street Business Programme has supported new companies in the east of the city (1) ______ 2016. ' +
          'Over that period we have helped more than three hundred businesses to open their first premises.\n\n' +
          'Our programme offers three things: a low-rent workspace for the first year, weekly advice sessions with ' +
          'experienced mentors, and access to a small grant for equipment. ' +
          '(2) ______ projects are eligible for the grant, but most applicants receive between one and three thousand ' +
          'dollars.\n\n' +
          'Places are limited to twelve businesses per year, so early (3) ______ is strongly recommended. ' +
          'Applications for the next intake close on 15 August.\n\n' +
          'If you would like to visit before applying, our office is open to the public every Wednesday afternoon. ' +
          '(4) ______',
      },
    ],
    questions: [
      {
        id: 'p6-0037',
        difficulty: 2,
        tags: ['preposition', 'present-perfect'],
        stimulusId: 'g-p6-0010',
        prompt: 'Which word best completes blank (1)?',
        choices: [
        'for',
        'from',
        'since',
        'during',
      ],
        answer: 'C',
        explanation:
          'Bâu dùng hiện tại hoàn thành "has supported" và mốc bắt đầu là một năm cụ thể, nên cần "since" → C đúng. ' +
          'A sai vì "for" đi với khoảng thời gian, không đi với mốc năm. ' +
          'B sai vì "from" cần đi kèm "to" mới thành cụm thời gian. ' +
          'D sai vì "during" đi với một giai đoạn, không dùng với một mốc bắt đầu.',
        translation: 'Chương trình doanh nghiệp Harbor Street đã hỗ trợ các công ty mới ở phía đông thành phố từ năm 2016.',
      },
      {
        id: 'p6-0038',
        difficulty: 3,
        tags: ['determiner', 'quantifier'],
        stimulusId: 'g-p6-0010',
        prompt: 'Which word best completes blank (2)?',
        choices: [
        'Not all',
        'None all',
        'Not every of',
        'No all',
      ],
        answer: 'A',
        explanation:
          '"Not all + danh từ số nhiều" là cấu trúc phủ định bộ phận hợp lệ → A đúng. ' +
          'B sai vì "None all" không phải cụm tiếng Anh. ' +
          'C sai vì "every" không đi với "of" theo cách này. ' +
          'D sai vì "No all" không tồn tại.',
        translation: 'Không phải mọi dự án đều đủ điều kiện nhận khoản tài trợ, nhưng phần lớn ứng viên nhận từ một đến ba nghìn đô.',
      },
      {
        id: 'p6-0039',
        difficulty: 2,
        tags: ['word-form', 'noun'],
        stimulusId: 'g-p6-0010',
        prompt: 'Which word best completes blank (3)?',
        choices: [
        'apply',
        'applied',
        'applying',
        'application',
      ],
        answer: 'D',
        explanation:
          'Sau tính từ "early" cần danh từ, và "early application" là cụm hợp nghĩa → D đúng. ' +
          'A sai vì "apply" là động từ. ' +
          'B sai vì "applied" là tính từ đuôi -ed hoặc quá khứ. ' +
          'C sai vì "applying" là V-ing, không đứng sau "early" như một danh từ.',
        translation: 'Số suất giới hạn mười hai doanh nghiệp mỗi năm, nên rất khuyến khích nộp hồ sơ sớm.',
      },
      {
        id: 'p6-0040',
        difficulty: 3,
        tags: ['sentence-insertion', 'cohesion'],
        stimulusId: 'g-p6-0010',
        prompt: 'Which sentence best fits blank (4)?',
        choices: [
        'The programme was featured in a national newspaper last month.',
        'Rents in the area have risen sharply since 2016.',
        'No appointment is needed, although we recommend booking a short slot in advance.',
        'Mentors are paid for each session they deliver.',
      ],
        answer: 'C',
        explanation:
          'Dâu trước nói văn phòng mở cửa cho công chúng vào chiều thứ Tư, nên câu nối tự nhiên là thông tin về việc có cần đặt trước không → C đúng. ' +
          'A nói về bài báo, lạc chủ đề. ' +
          'D nói về thù lao của cố vấn, không nối với câu trước. ' +
          'B nói về giá thuê mặt bằng, cũng không ăn nhập với việc tham quan văn phòng.',
        translation: 'Không cần hẹn trước, tuy vậy chúng tôi khuyên nên đặt một khung giờ ngắn từ trước.',
      },
    ],
  },
]

export const PART6B_STIMULI = readingStimuli(GROUPS)
export const PART6B_QUESTIONS = readingQuestions(GROUPS)
