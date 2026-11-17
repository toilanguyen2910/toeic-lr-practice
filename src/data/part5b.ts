import { buildPart5, type ReadingRow } from './questionBuilders'

/**
 * PART 5 — bổ sung đợt 1 (p5-0021 … p5-0070).
 *
 * Mỗi câu kiểm tra đúng một điểm ngữ pháp hoặc một cặp từ dễ nhầm, phương án nhiễu
 * chọn theo lỗi người học thật hay mắc. Đáp án đúng trải đều A/B/C/D.
 */
export const PART5B_ROWS: ReadingRow[] = [
  {
    id: 'p5-0021',
    difficulty: 2,
    tags: ['subject-verb-agreement', 'passive-voice'],
    prompt: 'The list of approved vendors ______ updated at the end of every quarter.',
    choices: ['are', 'were', 'is', 'have been'],
    answer: 'C',
    explanation:
      'Chủ ngữ chính là "The list" (số ít); cụm "of approved vendors" chỉ bổ nghĩa nên không đổi số của động từ, và câu mang nghĩa bị động → C ("is") đúng. ' +
      'A sai vì "are" là dạng số nhiều, không hợp với chủ ngữ số ít. ' +
      'B sai vì "were" vừa số nhiều vừa ở quá khứ, trong khi câu nói về việc lặp lại hằng quý. ' +
      'D sai vì "have been" là dạng số nhiều của hiện tại hoàn thành.',
    translation: 'Danh sách các nhà cung cấp đã được duyệt được cập nhật vào cuối mỗi quý.',
  },
  {
    id: 'p5-0022',
    difficulty: 3,
    tags: ['past-perfect', 'tense'],
    prompt: 'By the time the auditors arrived, the finance team ______ all the receipts.',
    choices: ['had already filed', 'has already filed', 'already files', 'was already filing'],
    answer: 'A',
    explanation:
      'Mốc "By the time the auditors arrived" ở quá khứ, hành động sắp xếp hoá đơn xong trước mốc đó nên phải dùng quá khứ hoàn thành → A đúng. ' +
      'B sai vì hiện tại hoàn thành không diễn tả được hành động xảy ra trước một mốc quá khứ. ' +
      'C sai vì hiện tại đơn không hợp với chuỗi sự việc đã xảy ra. ' +
      'D sai vì tiếp diễn nhấn mạnh hành động đang kéo dài, không phải việc đã hoàn tất trước đó.',
    translation: 'Vào lúc kiểm toán viên đến, phòng tài chính đã lưu hết các hoá đơn rồi.',
  },
  {
    id: 'p5-0023',
    difficulty: 1,
    tags: ['word-form', 'noun'],
    prompt: 'The ______ of the new safety rules will take place next Monday.',
    choices: ['introduce', 'introduction', 'introduced', 'introducing'],
    answer: 'B',
    explanation:
      'Sau mạo từ "The" và trước giới từ "of" cần một danh từ, và "the introduction of something" là cụm chuẩn → B đúng. ' +
      'A sai vì "introduce" là động từ, không đứng sau mạo từ. ' +
      'C sai vì "introduced" là dạng quá khứ/V3, chỉ dùng như động từ hoặc tính từ. ' +
      'D sai vì "introducing" là V-ing, không làm danh từ đứng sau "The … of" trong câu này.',
    translation: 'Việc giới thiệu các quy định an toàn mới sẽ diễn ra vào thứ Hai tới.',
  },
  {
    id: 'p5-0024',
    difficulty: 2,
    tags: ['preposition', 'time'],
    prompt: 'Please submit your timesheet ______ Friday at the latest.',
    choices: ['since', 'during', 'until', 'by'],
    answer: 'D',
    explanation:
      '"By + mốc thời gian" nghĩa là chậm nhất vào lúc đó, đúng nghĩa hạn chót của câu → D đúng. ' +
      'A sai vì "since" dùng với mốc bắt đầu kéo dài đến hiện tại. ' +
      'B sai vì "during" đi với một khoảng thời gian, không đi với một ngày cụ thể. ' +
      'C sai vì "until" nghĩa là tiếp tục đến lúc đó rồi thôi, không diễn tả hạn nộp.',
    translation: 'Vui lòng nộp bảng chấm công trước thứ Sáu, muộn nhất là thứ Sáu.',
  },
  {
    id: 'p5-0025',
    difficulty: 1,
    tags: ['modal-verb', 'base-form'],
    prompt: 'All visitors ______ wear a badge while inside the laboratory.',
    choices: ['must', 'must to', 'are must', 'musts'],
    answer: 'A',
    explanation:
      'Động từ khuyết thiếu "must" đứng trước động từ nguyên mẫu không "to", nên A đúng. ' +
      'B sai vì sau "must" không có "to". ' +
      'C sai vì "must" không đi sau động từ "be". ' +
      'D sai vì "must" không bao giờ chia theo ngôi.',
    translation: 'Mọi khách tham quan phải đeo thẻ khi ở trong phòng thí nghiệm.',
  },
  {
    id: 'p5-0026',
    difficulty: 1,
    tags: ['comparative', 'adjective'],
    prompt: 'The new scanner is ______ than the previous model and much quieter.',
    choices: ['fast', 'fastest', 'faster', 'as fast'],
    answer: 'C',
    explanation:
      'Có "than" nên cần dạng so sánh hơn của tính từ ngắn: "faster" → C đúng. ' +
      'A sai vì "fast" là dạng gốc, không dùng với "than". ' +
      'B sai vì "fastest" là so sánh nhất, đi với "the" chứ không đi với "than". ' +
      'D sai vì cấu trúc "as … as" không có "than" theo sau.',
    translation: 'Máy quét mới nhanh hơn mẫu cũ và êm hơn nhiều.',
  },
  {
    id: 'p5-0027',
    difficulty: 3,
    tags: ['vocabulary', 'meaning-in-context'],
    prompt: 'Because the shipment was late, the team had to ______ the installation by two weeks.',
    choices: ['increase', 'expand', 'enlarge', 'postpone'],
    answer: 'D',
    explanation:
      '"Postpone something by + khoảng thời gian" nghĩa là lùi lại, khớp với lý do hàng về muộn → D đúng. ' +
      'A sai vì "increase" dùng cho số lượng hoặc mức giá, không dùng để dời một buổi lắp đặt. ' +
      'B sai vì "expand" dùng cho quy mô, diện tích. ' +
      'C sai vì "enlarge" dùng cho kích thước vật lý hoặc hình ảnh.',
    translation: 'Vì lô hàng về muộn, nhóm phải lùi buổi lắp đặt lại hai tuần.',
  },
  {
    id: 'p5-0028',
    difficulty: 3,
    tags: ['pronoun', 'reciprocal'],
    prompt: 'The two departments agreed to share the equipment with ______ during the busy season.',
    choices: ['themselves', 'each other', 'itself', 'one'],
    answer: 'B',
    explanation:
      'Hai chủ thể cùng chia sẻ qua lại nên cần đại từ tương hỗ "each other" → B đúng. ' +
      'A sai vì "themselves" là đại từ phản thân, không diễn tả quan hệ qua lại giữa hai bên. ' +
      'C sai vì "itself" chỉ một vật ở số ít. ' +
      'D sai vì "one" không tạo thành cụm "with one" mang nghĩa lẫn nhau.',
    translation: 'Hai phòng ban đồng ý chia sẻ thiết bị với nhau trong mùa cao điểm.',
  },
  {
    id: 'p5-0029',
    difficulty: 2,
    tags: ['word-form', 'adverb'],
    prompt: 'The technician checked the wiring ______ before signing off on the inspection.',
    choices: ['care', 'careful', 'carefulness', 'carefully'],
    answer: 'D',
    explanation:
      'Chỗ trống bổ nghĩa cho động từ "checked" nên cần trạng từ → D đúng. ' +
      'A sai vì "care" là danh từ hoặc động từ, không đứng sau động từ để bổ nghĩa. ' +
      'B sai vì "careful" là tính từ, phải bổ nghĩa cho danh từ. ' +
      'C sai vì "carefulness" là danh từ.',
    translation: 'Kỹ thuật viên đã kiểm tra đường dây một cách cẩn thận trước khi ký xác nhận.',
  },
  {
    id: 'p5-0030',
    difficulty: 2,
    tags: ['conjunction', 'contrast'],
    prompt: '______ the weather was poor, the outdoor training session went ahead as planned.',
    choices: ['Although', 'Despite', 'Because of', 'Unless'],
    answer: 'A',
    explanation:
      'Sau chỗ trống là một mệnh đề đầy đủ chủ ngữ và động từ ("the weather was poor"), và hai vế mang nghĩa nhượng bộ → A đúng. ' +
      'B sai vì "Despite" phải đi với danh từ hoặc cụm danh từ. ' +
      'C sai vì "Because of" cũng cần danh từ, hơn nữa lại chỉ nguyên nhân chứ không phải nhượng bộ. ' +
      'D sai vì "Unless" mang nghĩa điều kiện phủ định, không hợp với quan hệ nhượng bộ ở đây.',
    translation: 'Dù thời tiết xấu, buổi huấn luyện ngoài trời vẫn diễn ra như kế hoạch.',
  },
  {
    id: 'p5-0031',
    difficulty: 2,
    tags: ['subject-verb-agreement', 'present-perfect'],
    prompt: 'The results of the survey ______ not yet been released to the public.',
    choices: ['has', 'have', 'is', 'was'],
    answer: 'B',
    explanation:
      'Chủ ngữ chính là "The results" (số nhiều), cụm "of the survey" chỉ bổ nghĩa, nên trợ động từ phải ở số nhiều → B đúng. ' +
      'A sai vì "has" chia theo chủ ngữ số ít. ' +
      'C sai vì "is" không dùng làm trợ động từ cho hiện tại hoàn thành. ' +
      'D sai vì "was" vừa sai số vừa sai thì.',
    translation: 'Kết quả khảo sát vẫn chưa được công bố cho công chúng.',
  },
  {
    id: 'p5-0032',
    difficulty: 4,
    tags: ['gerund', 'preposition'],
    prompt: 'The manager insisted on ______ the contract reviewed by legal counsel.',
    choices: ['have', 'has', 'had', 'having'],
    answer: 'D',
    explanation:
      'Sau giới từ "on" phải dùng dạng V-ing, và "insist on having something done" là cấu trúc chuẩn → D đúng. ' +
      'A sai vì "have" là nguyên mẫu, không đứng sau giới từ. ' +
      'B sai vì "has" là dạng chia ngôi thứ ba, không đứng sau giới từ. ' +
      'C sai vì "had" là quá khứ, cũng không đứng sau giới từ.',
    translation: 'Người quản lý khăng khăng yêu cầu bộ phận pháp chế rà soát hợp đồng.',
  },
  {
    id: 'p5-0033',
    difficulty: 1,
    tags: ['article', 'indefinite'],
    prompt: 'Ms. Park is looking for ______ experienced accountant to join her team.',
    choices: ['a', 'the', 'an', 'some'],
    answer: 'C',
    explanation:
      '"Experienced" bắt đầu bằng nguyên âm /ɪ/ nên cần mạo từ "an" → C đúng. ' +
      'A sai vì "a" đứng trước phụ âm. ' +
      'B sai vì "the" dùng cho đối tượng đã xác định, trong khi đây là người chưa xác định. ' +
      'D sai vì "some" không đi với danh từ đếm được số ít.',
    translation: 'Cô Park đang tìm một kế toán viên có kinh nghiệm để gia nhập nhóm của cô ấy.',
  },
  {
    id: 'p5-0034',
    difficulty: 3,
    tags: ['quantifier', 'comparison'],
    prompt: 'There were ______ applicants this year than last year, so the process was faster.',
    choices: ['fewer', 'less', 'few', 'little'],
    answer: 'A',
    explanation:
      '"Applicants" là danh từ đếm được số nhiều, và câu có "than" nên cần dạng so sánh của "few" là "fewer" → A đúng. ' +
      'B sai vì "less" dùng cho danh từ không đếm được. ' +
      'C sai vì "few" là dạng gốc, không kết hợp với "than". ' +
      'D sai vì "little" dùng cho không đếm được và cũng không đi với "than".',
    translation: 'Năm nay có ít ứng viên hơn năm ngoái nên quy trình diễn ra nhanh hơn.',
  },
  {
    id: 'p5-0035',
    difficulty: 2,
    tags: ['past-continuous', 'tense'],
    prompt: 'While the crew ______ the roof, the manager took photos for the report.',
    choices: ['repairs', 'has repaired', 'repair', 'was repairing'],
    answer: 'D',
    explanation:
      '"While" mở ra một hành động đang diễn ra ở quá khứ, xen vào là hành động ngắn ở quá khứ đơn → D đúng. ' +
      'A sai vì hiện tại đơn không hợp với bối cảnh quá khứ của vế sau. ' +
      'B sai vì hiện tại hoàn thành không dùng với "while" trong chuỗi sự việc này. ' +
      'C sai vì "repair" là dạng nguyên mẫu, không chia thì.',
    translation: 'Trong khi tổ công nhân đang sửa mái nhà, người quản lý chụp ảnh để làm báo cáo.',
  },
  {
    id: 'p5-0036',
    difficulty: 3,
    tags: ['relative-adverb', 'adjective-clause'],
    prompt: 'The warehouse ______ the goods are stored is monitored around the clock.',
    choices: ['which', 'where', 'who', 'whose'],
    answer: 'B',
    explanation:
      'Mệnh đề sau chỗ trống đã đủ chủ ngữ và động từ, nên cần trạng từ quan hệ chỉ nơi chốn "where" → B đúng. ' +
      'A sai vì "which" thay cho danh từ làm chủ ngữ hoặc tân ngữ, không thay cho cụm chỉ nơi chốn. ' +
      'C sai vì "who" chỉ người. ' +
      'D sai vì "whose" chỉ sở hữu và phải đứng ngay trước một danh từ.',
    translation: 'Nhà kho nơi cất giữ hàng hoá được giám sát suốt ngày đêm.',
  },
  {
    id: 'p5-0037',
    difficulty: 3,
    tags: ['passive-voice', 'vocabulary'],
    prompt: 'Employees will be ______ for travel expenses within ten working days.',
    choices: ['reimbursed', 'reimbursing', 'reimbursement', 'reimburse'],
    answer: 'A',
    explanation:
      'Sau "will be" cần quá khứ phân từ để tạo câu bị động, và nghĩa là nhân viên ĐƯỢC hoàn tiền → A đúng. ' +
      'B sai vì "reimbursing" là V-ing, không tạo thành dạng bị động sau "be". ' +
      'C sai vì "reimbursement" là danh từ, không đứng sau "be" trong cấu trúc bị động. ' +
      'D sai vì "reimburse" là nguyên mẫu, không dùng sau "be" ở đây.',
    translation: 'Nhân viên sẽ được hoàn lại chi phí đi lại trong vòng mười ngày làm việc.',
  },
  {
    id: 'p5-0038',
    difficulty: 3,
    tags: ['conditional', 'passive-voice'],
    prompt: 'If the deposit ______ by Friday, the reservation will be cancelled.',
    choices: ['is not receiving', 'does not received', 'is not received', 'will not receive'],
    answer: 'C',
    explanation:
      'Mệnh đề "If" của câu điều kiện loại 1 dùng hiện tại đơn, và khoản đặt cọc là đối tượng ĐƯỢC nhận nên cần bị động → C đúng. ' +
      'A sai vì dạng tiếp diễn chủ động không diễn tả nghĩa bị động. ' +
      'B sai vì sau "does not" phải là động từ nguyên mẫu, không phải "received". ' +
      'D sai vì không dùng "will" trong mệnh đề "If".',
    translation: 'Nếu tiền đặt cọc không được nhận trước thứ Sáu, đơn đặt phòng sẽ bị huỷ.',
  },
  {
    id: 'p5-0039',
    difficulty: 3,
    tags: ['conjunction', 'purpose'],
    prompt: 'The instructions were translated into four languages ______ all new staff could follow them.',
    choices: ['so', 'so that', 'such that', 'in order to'],
    answer: 'B',
    explanation:
      'Sau chỗ trống là mệnh đề đầy đủ ("all new staff could follow them") chỉ mục đích, nên cần "so that" → B đúng. ' +
      'A sai vì "so" đứng một mình thường chỉ kết quả và không mở đầu mệnh đề mục đích theo cách này. ' +
      'C sai vì "such that" đi sau một tính từ hoặc danh từ nhấn mạnh, không dùng trực tiếp như vậy. ' +
      'D sai vì "in order to" phải đi với động từ nguyên mẫu, không đi với mệnh đề.',
    translation: 'Bản hướng dẫn được dịch sang bốn thứ tiếng để mọi nhân viên mới đều theo được.',
  },
  {
    id: 'p5-0040',
    difficulty: 2,
    tags: ['word-form', 'adverb'],
    prompt: 'The renovation will cost ______ two million dollars, according to the estimate.',
    choices: ['approximate', 'approximated', 'approximation', 'approximately'],
    answer: 'D',
    explanation:
      'Chỗ trống đứng trước cụm số tiền để ước lượng nên cần trạng từ → D đúng. ' +
      'A sai vì "approximate" là tính từ, không bổ nghĩa cho cụm số lượng theo cách này. ' +
      'B sai vì "approximated" là dạng động từ quá khứ. ' +
      'C sai vì "approximation" là danh từ.',
    translation: 'Theo bản dự toán, việc cải tạo sẽ tốn khoảng hai triệu đô.',
  },
  {
    id: 'p5-0041',
    difficulty: 2,
    tags: ['preposition', 'contrast'],
    prompt: '______ several delays, the bridge reopened before the end of the year.',
    choices: ['Although', 'Because', 'Unless', 'Despite'],
    answer: 'D',
    explanation:
      'Sau chỗ trống là cụm danh từ "several delays" và hai vế mang nghĩa nhượng bộ nên cần "Despite" → D đúng. ' +
      'A sai vì "Although" phải đi với một mệnh đề. ' +
      'B sai vì "Because" chỉ nguyên nhân và cũng cần mệnh đề. ' +
      'C sai vì "Unless" cần mệnh đề và mang nghĩa điều kiện phủ định.',
    translation: 'Dù bị chậm trễ vài lần, cây cầu vẫn thông xe trước cuối năm.',
  },
  {
    id: 'p5-0042',
    difficulty: 4,
    tags: ['subject-verb-agreement', 'correlative'],
    prompt: 'Neither the supervisor nor the technicians ______ available on Saturday.',
    choices: ['were', 'was', 'is', 'has been'],
    answer: 'A',
    explanation:
      'Với "neither … nor", động từ chia theo chủ ngữ gần nhất là "the technicians" (số nhiều), và câu kể sự việc trong quá khứ → A đúng. ' +
      'B sai vì "was" là số ít, không hợp với "the technicians". ' +
      'C sai vì "is" vừa số ít vừa sai thì so với ngữ cảnh. ' +
      'D sai vì "has been" chia số ít.',
    translation: 'Cả người giám sát lẫn các kỹ thuật viên đều không có mặt vào thứ Bảy.',
  },
  {
    id: 'p5-0043',
    difficulty: 4,
    tags: ['causative', 'participle'],
    prompt: 'The director had the proposal ______ by an outside consultant.',
    choices: ['review', 'reviewed', 'reviewing', 'to review'],
    answer: 'B',
    explanation:
      'Cấu trúc nhờ vả "have something done" dùng quá khứ phân từ, nghĩa là đề xuất ĐƯỢC người khác rà soát → B đúng. ' +
      'A sai vì "review" là nguyên mẫu, chỉ dùng khi chủ ngữ trực tiếp thực hiện hành động. ' +
      'C sai vì "reviewing" không hợp với cấu trúc nhờ vả. ' +
      'D sai vì "to review" không xuất hiện trong mẫu "have something done".',
    translation: 'Giám đốc đã cho một tư vấn bên ngoài rà soát bản đề xuất.',
  },
  {
    id: 'p5-0044',
    difficulty: 3,
    tags: ['vocabulary', 'adjective'],
    prompt: 'Only employees who have worked here for a year are ______ for the tuition program.',
    choices: ['eligibility', 'eligibly', 'eligible', 'election'],
    answer: 'C',
    explanation:
      'Sau "are" cần tính từ bổ nghĩa cho chủ ngữ, và "be eligible for" là cụm chuẩn → C đúng. ' +
      'A sai vì "eligibility" là danh từ, không đứng sau "are" làm vị ngữ. ' +
      'B sai vì "eligibly" là trạng từ. ' +
      'D sai vì "election" là danh từ và khác nghĩa hoàn toàn.',
    translation: 'Chỉ những nhân viên đã làm việc ở đây một năm mới đủ điều kiện tham gia chương trình hỗ trợ học phí.',
  },
  {
    id: 'p5-0045',
    difficulty: 2,
    tags: ['correlative', 'conjunction'],
    prompt: 'The new system is not only faster ______ easier to maintain.',
    choices: ['but also', 'and also', 'but', 'as well'],
    answer: 'A',
    explanation:
      'Cấu trúc tương liên "not only … but also …" là cặp cố định → A đúng. ' +
      'B sai vì thiếu "also" trong vế thứ hai của cấu trúc chuẩn. ' +
      'C sai vì "but" đơn lẻ không hoàn tất cấu trúc "not only". ' +
      'D sai vì "as well" đứng cuối câu, không nối hai vế giữa câu.',
    translation: 'Hệ thống mới không chỉ nhanh hơn mà còn dễ bảo trì hơn.',
  },
  {
    id: 'p5-0046',
    difficulty: 2,
    tags: ['passive-voice', 'past-simple'],
    prompt: 'The old bridge ______ in 1928 and restored twice since then.',
    choices: ['builds', 'has built', 'was building', 'was built'],
    answer: 'D',
    explanation:
      'Cây cầu ĐƯỢC xây nên cần bị động, và mốc "in 1928" là quá khứ xác định → D đúng. ' +
      'A sai vì hiện tại đơn chủ động sai cả thì lẫn nghĩa. ' +
      'B sai vì "has built" là chủ động và sai thì với mốc năm cụ thể. ' +
      'C sai vì tiếp diễn không diễn tả việc đã hoàn thành.',
    translation: 'Cây cầu cũ được xây năm 1928 và đã được trùng tu hai lần kể từ đó.',
  },
  {
    id: 'p5-0047',
    difficulty: 2,
    tags: ['word-form', 'adjective'],
    prompt: 'The committee is looking for a ______ solution rather than a temporary fix.',
    choices: ['persist', 'persistence', 'permanent', 'permanently'],
    answer: 'C',
    explanation:
      'Chỗ trống đứng trước danh từ "solution" nên cần tính từ, và nghĩa đối lập với "temporary" là "permanent" → C đúng. ' +
      'A sai vì "persist" là động từ. ' +
      'B sai vì "persistence" là danh từ, không bổ nghĩa cho danh từ khác. ' +
      'D sai vì "permanently" là trạng từ.',
    translation: 'Uỷ ban đang tìm một giải pháp lâu dài chứ không phải biện pháp tạm thời.',
  },
  {
    id: 'p5-0048',
    difficulty: 3,
    tags: ['preposition', 'time'],
    prompt: 'Please return the signed form ______ five business days.',
    choices: ['during', 'within', 'since', 'among'],
    answer: 'B',
    explanation:
      '"Within + khoảng thời gian" nghĩa là trong vòng bao lâu, đúng nghĩa hạn nộp → B đúng. ' +
      'A sai vì "during" đi với một giai đoạn được xác định cụ thể, không dùng để nêu hạn. ' +
      'C sai vì "since" chỉ mốc bắt đầu. ' +
      'D sai vì "among" dùng cho số nhiều đối tượng, không dùng cho thời gian.',
    translation: 'Vui lòng trả lại mẫu đơn đã ký trong vòng năm ngày làm việc.',
  },
  {
    id: 'p5-0049',
    difficulty: 1,
    tags: ['infinitive', 'verb-form'],
    prompt: 'The hotel requires a credit card to ______ the booking.',
    choices: ['confirm', 'confirms', 'confirming', 'confirmation'],
    answer: 'A',
    explanation:
      'Sau "to" của mục đích cần động từ nguyên mẫu → A đúng. ' +
      'B sai vì "confirms" đã chia ngôi thứ ba. ' +
      'C sai vì "confirming" là V-ing. ' +
      'D sai vì "confirmation" là danh từ, không đứng sau "to" theo mẫu này.',
    translation: 'Khách sạn yêu cầu thẻ tín dụng để xác nhận đơn đặt phòng.',
  },
  {
    id: 'p5-0050',
    difficulty: 3,
    tags: ['conjunction', 'condition'],
    prompt: 'The shipment will not be released ______ the customs documents are complete.',
    choices: ['if', 'although', 'whereas', 'unless'],
    answer: 'D',
    explanation:
      'Nghĩa câu là hàng chỉ được giao khi giấy tờ hải quan đã đủ, nên cần "unless" (trừ khi) → D đúng. ' +
      'A sai vì "if" tạo nghĩa ngược lại hoàn toàn. ' +
      'B sai vì "although" chỉ nhượng bộ. ' +
      'C sai vì "whereas" dùng để đối chiếu hai vế tương phản.',
    translation: 'Lô hàng sẽ không được thông quan trừ khi giấy tờ hải quan đã đầy đủ.',
  },
  {
    id: 'p5-0051',
    difficulty: 3,
    tags: ['so-that', 'intensifier'],
    prompt: 'The instructions were ______ complicated that half the team asked for help.',
    choices: ['such', 'too', 'so', 'very'],
    answer: 'C',
    explanation:
      'Trước tính từ "complicated" và có "that" phía sau, cần "so … that" → C đúng. ' +
      'A sai vì "such" phải đi với cụm danh từ. ' +
      'B sai vì "too … to" mang nghĩa không thể làm gì, không đi với "that". ' +
      'D sai vì "very" không tạo được cấu trúc kết quả với "that".',
    translation: 'Bản hướng dẫn phức tạp đến mức nửa nhóm phải nhờ trợ giúp.',
  },
  {
    id: 'p5-0052',
    difficulty: 4,
    tags: ['modal-verb', 'past-modals'],
    prompt: 'You ______ have notified the client before changing the delivery date.',
    choices: ['must', 'should', 'can', 'will'],
    answer: 'B',
    explanation:
      '"Should have + V3" diễn tả việc lẽ ra nên làm nhưng đã không làm, khớp với lời trách nhẹ trong câu → B đúng. ' +
      'A sai vì "must have + V3" chỉ suy đoán chắc chắn về quá khứ. ' +
      'C sai vì "can have + V3" không dùng để nói điều lẽ ra phải làm. ' +
      'D sai vì "will have + V3" chỉ thì tương lai hoàn thành.',
    translation: 'Lẽ ra bạn nên thông báo cho khách hàng trước khi đổi ngày giao hàng.',
  },
  {
    id: 'p5-0053',
    difficulty: 1,
    tags: ['vocabulary', 'verb'],
    prompt: 'All department heads are expected to ______ the quarterly review.',
    choices: ['attend', 'attend to', 'attendance', 'attending'],
    answer: 'A',
    explanation:
      '"Attend" là ngoại động từ nghĩa là tham dự, đứng sau "to" của cấu trúc "be expected to" → A đúng. ' +
      'B sai vì "attend to" nghĩa là chăm sóc, xử lý một việc cụ thể. ' +
      'C sai vì "attendance" là danh từ, không đứng sau "to". ' +
      'D sai vì "attending" là V-ing, không dùng sau "to" trong mẫu này.',
    translation: 'Tất cả trưởng phòng đều được yêu cầu tham dự buổi đánh giá quý.',
  },
  {
    id: 'p5-0054',
    difficulty: 2,
    tags: ['preposition', 'time'],
    prompt: '______ the presentation, please keep your questions until the end.',
    choices: ['While', 'When', 'As', 'During'],
    answer: 'D',
    explanation:
      'Sau chỗ trống là cụm danh từ "the presentation" nên cần giới từ "During" → D đúng. ' +
      'A sai vì "While" phải đi với mệnh đề hoặc cụm V-ing có chủ ngữ rõ. ' +
      'B sai vì "When" cũng cần mệnh đề. ' +
      'C sai vì "As" dùng để nối mệnh đề.',
    translation: 'Trong suốt buổi thuyết trình, xin giữ câu hỏi lại đến cuối buổi.',
  },
  {
    id: 'p5-0055',
    difficulty: 3,
    tags: ['passive-voice', 'modal-verb'],
    prompt: 'The samples ______ to the laboratory before the results can be verified.',
    choices: ['must send', 'must sending', 'must be sent', 'must be sending'],
    answer: 'C',
    explanation:
      'Mẫu vật ĐƯỢC gửi đi nên cần bị động, cấu trúc "must be + V3" → C đúng. ' +
      'A sai vì thiếu dạng bị động, hàm ý chủ ngữ tự gửi. ' +
      'B sai vì sau "must" không dùng V-ing. ' +
      'D sai vì "must be sending" là tiếp diễn chủ động.',
    translation: 'Các mẫu phải được gửi đến phòng thí nghiệm trước khi kết quả được xác minh.',
  },
  {
    id: 'p5-0056',
    difficulty: 4,
    tags: ['comparative', 'the-more-the-more'],
    prompt: 'The ______ carefully you plan the route, the less fuel the trucks will use.',
    choices: ['more', 'most', 'much', 'many'],
    answer: 'A',
    explanation:
      'Cấu trúc "the more … the less …" diễn tả hai đại lượng thay đổi song hành, và trạng từ "carefully" cần "more" để tạo so sánh hơn → A đúng. ' +
      'B sai vì "most" tạo so sánh nhất, không đi theo cặp với "the less". ' +
      'C sai vì "much" không tạo thành dạng so sánh hơn của trạng từ dài. ' +
      'D sai vì "many" dùng cho danh từ đếm được số nhiều.',
    translation: 'Bạn càng lên kế hoạch tuyến đường kỹ bao nhiêu, xe tải sẽ càng tốn ít nhiên liệu bấy nhiêu.',
  },
  {
    id: 'p5-0057',
    difficulty: 2,
    tags: ['collocation', 'preposition'],
    prompt: 'Ms. Villanueva is ______ of the customer service division.',
    choices: ['charge', 'charged', 'charging', 'in charge'],
    answer: 'D',
    explanation:
      '"Be in charge of" là cụm cố định nghĩa là phụ trách → D đúng. ' +
      'A sai vì "charge" đứng một mình không tạo thành cụm với "of". ' +
      'B sai vì "charged of" không phải cụm chuẩn. ' +
      'C sai vì "charging of" không dùng để nói phụ trách.',
    translation: 'Bà Villanueva phụ trách bộ phận chăm sóc khách hàng.',
  },
  {
    id: 'p5-0058',
    difficulty: 5,
    tags: ['inversion', 'word-order'],
    prompt: 'Rarely ______ such a detailed report from a new supplier.',
    choices: ['we have received', 'have we received', 'we received', 'did we received'],
    answer: 'B',
    explanation:
      'Trạng từ phủ định "Rarely" đứng đầu câu buộc phải đảo trợ động từ lên trước chủ ngữ, và thì hiện tại hoàn thành hợp với tính chất ít khi xảy ra → B đúng. ' +
      'A sai vì không đảo trợ động từ lên trước chủ ngữ. ' +
      'C sai vì cũng không đảo và đổi thì không cần thiết. ' +
      'D sai vì sau "did" phải là động từ nguyên mẫu, không phải "received".',
    translation: 'Hiếm khi chúng tôi nhận được một báo cáo chi tiết như vậy từ một nhà cung cấp mới.',
  },
  {
    id: 'p5-0059',
    difficulty: 2,
    tags: ['infinitive', 'verb-form'],
    prompt: 'The retailer plans to ______ its online store to three more countries.',
    choices: ['expansion', 'expanded', 'expand', 'expanding'],
    answer: 'C',
    explanation:
      'Sau "plans to" cần động từ nguyên mẫu → C đúng. ' +
      'A sai vì "expansion" là danh từ, không đứng sau "to". ' +
      'B sai vì "expanded" là quá khứ, không dùng sau "to" ở đây. ' +
      'D sai vì "expanding" là V-ing.',
    translation: 'Nhà bán lẻ dự định mở rộng cửa hàng trực tuyến sang thêm ba quốc gia.',
  },
  {
    id: 'p5-0060',
    difficulty: 2,
    tags: ['passive-voice', 'agent'],
    prompt: 'The mural was painted ______ a local artist.',
    choices: ['from', 'by', 'with', 'of'],
    answer: 'B',
    explanation:
      'Trong câu bị động, tác nhân thực hiện hành động đứng sau "by" → B đúng. ' +
      'A sai vì "from" chỉ nguồn gốc, xuất xứ. ' +
      'C sai vì "with" chỉ công cụ hoặc nguyên liệu. ' +
      'D sai vì "of" chỉ sở hữu hoặc thành phần.',
    translation: 'Bức bích hoạ được vẽ bởi một hoạ sĩ địa phương.',
  },
  {
    id: 'p5-0061',
    difficulty: 3,
    tags: ['subject-verb-agreement', 'quantifier'],
    prompt: 'A number of employees ______ volunteered to help at the charity event.',
    choices: ['have', 'has', 'is', 'was'],
    answer: 'A',
    explanation:
      '"A number of + danh từ số nhiều" giữ động từ ở số nhiều → A đúng. ' +
      'B sai vì "has" chia số ít, chỉ đúng khi chủ ngữ là "the number of". ' +
      'C sai vì "is" không dùng làm trợ động từ cho hiện tại hoàn thành và cũng sai số. ' +
      'D sai vì "was" vừa số ít vừa sai thì.',
    translation: 'Một số nhân viên đã tình nguyện giúp đỡ tại sự kiện từ thiện.',
  },
  {
    id: 'p5-0062',
    difficulty: 3,
    tags: ['subject-verb-agreement', 'present-simple'],
    prompt: 'Every invoice ______ a purchase order number before payment is approved.',
    choices: ['require', 'requiring', 'are required', 'requires'],
    answer: 'D',
    explanation:
      '"Every + danh từ số ít" luôn chia động từ số ít → D đúng. ' +
      'A sai vì "require" là dạng số nhiều. ' +
      'B sai vì "requiring" không phải động từ chính của câu. ' +
      'C sai vì "are required" chia số nhiều.',
    translation: 'Mỗi hoá đơn đều cần một mã đơn đặt hàng trước khi được duyệt thanh toán.',
  },
  {
    id: 'p5-0063',
    difficulty: 3,
    tags: ['adverb', 'meaning-in-context'],
    prompt: 'The team had ______ finished the audit when the system crashed.',
    choices: ['hard', 'hardly', 'harder', 'hardness'],
    answer: 'B',
    explanation:
      'Cấu trúc "had hardly … when …" nghĩa là vừa mới … thì …, khớp mạch sự việc bất ngờ → B đúng. ' +
      'A sai vì "hard" nghĩa là chăm chỉ hoặc cứng, không mang nghĩa phủ định. ' +
      'C sai vì "harder" là so sánh hơn. ' +
      'D sai vì "hardness" là danh từ.',
    translation: 'Nhóm vừa mới làm xong đợt kiểm toán thì hệ thống sập.',
  },
  {
    id: 'p5-0064',
    difficulty: 3,
    tags: ['connector', 'cause'],
    prompt: 'The flight was delayed ______ heavy fog at the airport.',
    choices: ['because', 'although', 'due to', 'in spite of'],
    answer: 'C',
    explanation:
      'Sau chỗ trống là cụm danh từ "heavy fog" và quan hệ là nguyên nhân nên cần "due to" → C đúng. ' +
      'A sai vì "because" phải đi với mệnh đề. ' +
      'B sai vì "although" cần mệnh đề và mang nghĩa nhượng bộ. ' +
      'D sai vì "in spite of" tuy đứng trước danh từ nhưng mang nghĩa nhượng bộ, ngược với logic câu.',
    translation: 'Chuyến bay bị hoãn do sương mù dày đặc ở sân bay.',
  },
  {
    id: 'p5-0065',
    difficulty: 1,
    tags: ['infinitive', 'verb-form'],
    prompt: 'The agency asked us to ______ the budget proposal before Friday.',
    choices: ['revision', 'revised', 'revising', 'revise'],
    answer: 'D',
    explanation:
      'Sau "asked us to" cần động từ nguyên mẫu → D đúng. ' +
      'A sai vì "revision" là danh từ. ' +
      'B sai vì "revised" là quá khứ/V3. ' +
      'C sai vì "revising" là V-ing.',
    translation: 'Cơ quan đã đề nghị chúng tôi chỉnh sửa bản dự toán ngân sách trước thứ Sáu.',
  },
  {
    id: 'p5-0066',
    difficulty: 3,
    tags: ['subject-verb-agreement', 'neither'],
    prompt: 'Neither of the two candidates ______ the required certification.',
    choices: ['has', 'have', 'are having', 'were having'],
    answer: 'A',
    explanation:
      '"Neither of + danh từ số nhiều" chia động từ số ít → A đúng. ' +
      'B sai vì "have" là dạng số nhiều. ' +
      'C sai vì vừa sai số vừa dùng thì tiếp diễn không hợp. ' +
      'D sai vì "were having" cũng sai số.',
    translation: 'Không ứng viên nào trong hai người có chứng chỉ bắt buộc.',
  },
  {
    id: 'p5-0067',
    difficulty: 4,
    tags: ['conditional', 'conjunction'],
    prompt: 'The contract will be extended ______ both parties agree to the new terms.',
    choices: ['in case', 'provided that', 'even though', 'as long'],
    answer: 'B',
    explanation:
      '"Provided that" nghĩa là với điều kiện là, phù hợp logic gia hạn hợp đồng → B đúng. ' +
      'A sai vì "in case" nói về việc phòng khi điều gì xảy ra, không phải điều kiện bắt buộc. ' +
      'C sai vì "even though" chỉ nhượng bộ. ' +
      'D sai vì "as long" phải là "as long as" mới đủ nghĩa điều kiện.',
    translation: 'Hợp đồng sẽ được gia hạn với điều kiện hai bên đồng ý các điều khoản mới.',
  },
  {
    id: 'p5-0068',
    difficulty: 4,
    tags: ['participle', 'reduced-clause'],
    prompt: '______ in 1995, the firm now operates in twelve countries.',
    choices: ['Founding', 'Found', 'Founded', 'To found'],
    answer: 'C',
    explanation:
      'Công ty ĐƯỢC thành lập nên cần phân từ quá khứ mang nghĩa bị động "Founded" → C đúng. ' +
      'A sai vì "Founding" mang nghĩa chủ động, hàm ý công ty tự thành lập chính mình. ' +
      'B sai vì "Found" là nguyên mẫu của "find" ở dạng gốc, không dùng làm phân từ ở đây. ' +
      'D sai vì "To found" chỉ mục đích, không rút gọn mệnh đề được.',
    translation: 'Được thành lập năm 1995, công ty hiện hoạt động tại mười hai quốc gia.',
  },
  {
    id: 'p5-0069',
    difficulty: 2,
    tags: ['word-form', 'adjective'],
    prompt: 'There was a ______ increase in online sales after the campaign.',
    choices: ['significantly', 'signify', 'significance', 'significant'],
    answer: 'D',
    explanation:
      'Chỗ trống đứng trước danh từ "increase" nên cần tính từ → D đúng. ' +
      'A sai vì "significantly" là trạng từ. ' +
      'B sai vì "signify" là động từ. ' +
      'C sai vì "significance" là danh từ, không bổ nghĩa cho "increase".',
    translation: 'Doanh số trực tuyến đã tăng đáng kể sau chiến dịch.',
  },
  {
    id: 'p5-0070',
    difficulty: 3,
    tags: ['connector', 'addition'],
    prompt: '______ her regular duties, Ms. Rao trains new hires every month.',
    choices: ['In addition to', 'In addition', 'Beside', 'Apart'],
    answer: 'A',
    explanation:
      '"In addition to + danh từ" nghĩa là ngoài việc gì đó ra → A đúng. ' +
      'B sai vì "In addition" đứng riêng và thường theo sau là dấu phẩy, không đi trực tiếp với danh từ. ' +
      'C sai vì "Beside" nghĩa là ở bên cạnh (vị trí). ' +
      'D sai vì "Apart" phải là "apart from" mới đủ nghĩa.',
    translation: 'Ngoài công việc thường ngày, cô Rao còn đào tạo nhân viên mới mỗi tháng.',
  },
]

export const PART5B_QUESTIONS = buildPart5(PART5B_ROWS)
