import { buildPart5, type ReadingRow } from './questionBuilders'

/**
 * PART 5 — bổ sung đợt 2 (p5-0071 … p5-0120), hoàn tất 120 câu của Part 5.
 *
 * Đợt này trải thêm chủ đề: y tế, giáo dục, xây dựng, sự kiện, tuyển dụng.
 * Vẫn giữ nguyên tắc: mỗi câu một điểm kiểm tra, bốn phương án A/B/C/D, đáp án đúng
 * không dài hơn hẳn các phương án nhiễu.
 */
export const PART5C_ROWS: ReadingRow[] = [
  {
    id: 'p5-0071',
    difficulty: 2,
    tags: ['subject-verb-agreement', 'present-simple'],
    prompt: 'The number of visitors to the exhibition ______ increased steadily since March.',
    choices: ['have', 'were', 'are', 'has'],
    answer: 'D',
    explanation:
      '"The number of + danh từ số nhiều" chia động từ số ít → D đúng. ' +
      'A sai vì đây là trường hợp "the number of" chứ không phải "a number of". ' +
      'C sai vì "are" không làm trợ động từ cho hiện tại hoàn thành. ' +
      'B sai vì "were" sai cả số lẫn thì.',
    translation: 'Số lượng khách tham quan triển lãm đã tăng đều đặn kể từ tháng Ba.',
  },
  {
    id: 'p5-0072',
    difficulty: 2,
    tags: ['adverb', 'comparative'],
    prompt: 'Please reply as ______ as possible so we can finalize the schedule.',
    choices: ['soon', 'sooner', 'soonest', 'more soon'],
    answer: 'A',
    explanation:
      'Cấu trúc "as + tính từ/trạng từ gốc + as possible" nên cần dạng gốc "soon" → A đúng. ' +
      'B sai vì "sooner" là so sánh hơn, không dùng trong cấu trúc "as … as". ' +
      'C sai vì "soonest" là so sánh nhất. ' +
      'D sai vì "more soon" không phải dạng so sánh chuẩn của trạng từ ngắn.',
    translation: 'Vui lòng trả lời càng sớm càng tốt để chúng tôi chốt được lịch.',
  },
  {
    id: 'p5-0073',
    difficulty: 1,
    tags: ['past-simple', 'tense'],
    prompt: 'The company ______ its first overseas office in Singapore in 2004.',
    choices: ['opens', 'has opened', 'opened', 'is opening'],
    answer: 'C',
    explanation:
      'Mốc "in 2004" là thời gian quá khứ xác định nên dùng quá khứ đơn → C đúng. ' +
      'A sai vì hiện tại đơn không hợp với mốc năm cụ thể trong quá khứ. ' +
      'B sai vì hiện tại hoàn thành không đi với mốc thời gian đã khép lại. ' +
      'D sai vì tiếp diễn không diễn tả sự việc đã hoàn thành năm 2004.',
    translation: 'Công ty đã mở văn phòng nước ngoài đầu tiên tại Singapore vào năm 2004.',
  },
  {
    id: 'p5-0074',
    difficulty: 2,
    tags: ['collocation', 'verb-noun'],
    prompt: 'The hospital asks all patients to ______ an appointment at least a week in advance.',
    choices: ['do', 'give', 'take', 'make'],
    answer: 'D',
    explanation:
      '"Make an appointment" là cụm cố định nghĩa là đặt lịch hẹn → D đúng. ' +
      'A sai vì "do an appointment" không phải cụm chuẩn. ' +
      'C sai vì "take an appointment" không dùng trong ngữ cảnh này. ' +
      'B sai vì "give an appointment" đổi vai, hàm ý cấp lịch cho người khác.',
    translation: 'Bệnh viện yêu cầu bệnh nhân đặt lịch hẹn trước ít nhất một tuần.',
  },
  {
    id: 'p5-0075',
    difficulty: 4,
    tags: ['passive-voice', 'reported-speech'],
    prompt: 'The consultant is believed ______ the project before the funding was withdrawn.',
    choices: ['to have completed', 'to complete', 'completing', 'having completed'],
    answer: 'A',
    explanation:
      'Cấu trúc "be believed to have + V3" diễn tả hành động xảy ra trước thời điểm được nói tới → A đúng. ' +
      'B sai vì "to complete" chỉ hành động đồng thời hoặc sau, không diễn tả việc đã xong trước. ' +
      'C sai vì "completing" không đứng sau "believed". ' +
      'D sai vì "having completed" không theo mẫu bị động kép này.',
    translation: 'Vị tư vấn được cho là đã hoàn thành dự án trước khi nguồn vốn bị rút.',
  },
  {
    id: 'p5-0076',
    difficulty: 3,
    tags: ['participle', 'adjective'],
    prompt: 'The ______ results suggest that the new fertiliser works better in dry soil.',
    choices: ['encourage', 'encouragement', 'encouraging', 'encouraged'],
    answer: 'C',
    explanation:
      'Cần một tính từ bổ nghĩa cho "results"; "encouraging" (đáng khích lệ) là tính từ đúng nghĩa dùng với kết quả → C đúng. ' +
      'A sai vì "encourage" là động từ. ' +
      'B sai vì "encouragement" là danh từ. ' +
      'D sai vì "encouraged" mang nghĩa bị động, dùng cho người cảm thấy được khích lệ chứ không dùng cho kết quả.',
    translation: 'Những kết quả đáng khích lệ cho thấy loại phân bón mới hoạt động tốt hơn trên đất khô.',
  },
  {
    id: 'p5-0077',
    difficulty: 3,
    tags: ['vocabulary', 'verb'],
    prompt: 'The contractor promised to ______ the damaged wall within three days.',
    choices: ['renovate', 'recover', 'repair', 'replace'],
    answer: 'C',
    explanation:
      '"Repair" (sửa chữa chỗ hỏng) là động từ khớp nhất với "damaged wall" cần khắc phục → C đúng. ' +
      'A sai vì "renovate" dùng cho việc cải tạo toàn bộ công trình cho mới hơn. ' +
      'B sai vì "recover" dùng cho quá trình hồi phục của người hoặc nền kinh tế. ' +
      'D sai vì "replace" là thay mới hoàn toàn, không đúng với việc vá chỗ hỏng.',
    translation: 'Nhà thầu hứa sửa lại bức tường bị hỏng trong vòng ba ngày.',
  },
  {
    id: 'p5-0078',
    difficulty: 2,
    tags: ['preposition', 'collocation'],
    prompt: 'The scholarship is open ______ students in their final year of study.',
    choices: ['with', 'at', 'for', 'to'],
    answer: 'D',
    explanation:
      '"Open to + đối tượng" là cụm chuẩn nghĩa là dành cho đối tượng nào → D đúng. ' +
      'A sai vì "open with" dùng khi bắt đầu một việc gì đó. ' +
      'B sai vì "open at" dùng để nói giờ mở cửa. ' +
      'C sai vì "open for" thường nói về mục đích hoặc việc bắt đầu kinh doanh.',
    translation: 'Học bổng dành cho sinh viên năm cuối.',
  },
  {
    id: 'p5-0079',
    difficulty: 2,
    tags: ['word-form', 'noun'],
    prompt: 'The board expressed ______ at the speed of the recovery.',
    choices: ['surprised', 'surprising', 'surprise', 'surprisingly'],
    answer: 'C',
    explanation:
      'Sau động từ "expressed" cần một tân ngữ là danh từ, "express surprise at" là cụm chuẩn → C đúng. ' +
      'A sai vì "surprised" là tính từ. ' +
      'B sai vì "surprising" là tính từ. ' +
      'D sai vì "surprisingly" là trạng từ.',
    translation: 'Hội đồng bày tỏ sự ngạc nhiên trước tốc độ phục hồi.',
  },
  {
    id: 'p5-0080',
    difficulty: 3,
    tags: ['connector', 'concession'],
    prompt: '______ the price increase, demand has remained strong.',
    choices: ['Because of', 'In spite of', 'So as to', 'As a result of'],
    answer: 'B',
    explanation:
      'Hai vế tương phản (giá tăng mà cầu vẫn mạnh) nên cần giới từ nhượng bộ "In spite of" → B đúng. ' +
      'A sai vì "Because of" chỉ nguyên nhân, sẽ tạo nghĩa ngược. ' +
      'C sai vì "So as to" đi với động từ nguyên mẫu chỉ mục đích. ' +
      'D sai vì cũng chỉ nguyên nhân và phải đi với cụm danh từ mang nghĩa kết quả.',
    translation: 'Dù giá tăng, nhu cầu vẫn ở mức cao.',
  },
  {
    id: 'p5-0081',
    difficulty: 3,
    tags: ['subjunctive', 'verb-form'],
    prompt: 'The supervisor requested that every machine ______ before the shift ends.',
    choices: ['is inspected', 'was inspected', 'be inspected', 'will be inspected'],
    answer: 'C',
    explanation:
      'Sau "requested that" dùng thức giả định: "that + chủ ngữ + động từ nguyên mẫu", nên bị động "be inspected" là đúng → C đúng. ' +
      'A sai vì "is inspected" chia theo hiện tại đơn thường. ' +
      'B sai vì "was inspected" là quá khứ, không phải giả định. ' +
      'D sai vì "will be inspected" không dùng trong mệnh đề giả định.',
    translation: 'Người giám sát yêu cầu mọi máy móc được kiểm tra trước khi hết ca.',
  },
  {
    id: 'p5-0082',
    difficulty: 3,
    tags: ['vocabulary', 'meaning-in-context'],
    prompt: 'The manufacturer will ______ the faulty units at no cost to the customer.',
    choices: ['replace', 'substitute', 'remove', 'resign'],
    answer: 'A',
    explanation:
      '"Replace" (thay thế bằng hàng mới) đúng với ngữ cảnh bảo hành sản phẩm lỗi → A đúng. ' +
      'B sai vì "substitute" đòi cấu trúc "substitute something for something" và mang nghĩa thay thế tạm thời. ' +
      'C sai vì "remove" chỉ gỡ bỏ chứ không nói đến việc cấp hàng mới. ' +
      'D sai vì "resign" dùng cho người từ chức.',
    translation: 'Nhà sản xuất sẽ thay thế các sản phẩm bị lỗi mà khách hàng không phải trả phí.',
  },
  {
    id: 'p5-0083',
    difficulty: 1,
    tags: ['article', 'definite'],
    prompt: '______ report you requested is attached to this email.',
    choices: ['A', 'An', 'The', 'Some'],
    answer: 'C',
    explanation:
      '"Report you requested" đã được xác định bằng mệnh đề quan hệ nên cần mạo từ xác định "The" → C đúng. ' +
      'A sai vì "A" dùng cho đối tượng chưa xác định. ' +
      'B sai vì "An" cũng là mạo từ không xác định và sai cả về ngữ âm. ' +
      'D sai vì "Some" không đi với danh từ đếm được số ít.',
    translation: 'Bản báo cáo mà anh yêu cầu được đính kèm trong email này.',
  },
  {
    id: 'p5-0084',
    difficulty: 4,
    tags: ['inversion', 'conditional'],
    prompt: '______ the shipment arrive late, we will notify all customers immediately.',
    choices: ['If', 'Should', 'Would', 'Unless'],
    answer: 'B',
    explanation:
      'Đảo ngữ điều kiện "Should + chủ ngữ + động từ nguyên mẫu" dùng để giả định ít chắc chắn, không dùng "if" → B đúng. ' +
      'A sai vì "If" đứng đầu vẫn cần cấu trúc thường, không đi liền với chủ ngữ mà thiếu trợ động từ. ' +
      'C sai vì "Would" không dùng để mở mệnh đề điều kiện. ' +
      'D sai vì "Unless" mang nghĩa phủ định, không hợp với việc báo tin chủ động.',
    translation: 'Nếu lô hàng về muộn, chúng tôi sẽ thông báo ngay cho toàn bộ khách hàng.',
  },
  {
    id: 'p5-0085',
    difficulty: 2,
    tags: ['preposition', 'collocation'],
    prompt: 'The clinic reserves two hours every morning ______ children under five.',
    choices: ['to', 'among', 'with', 'for'],
    answer: 'D',
    explanation:
      '"Reserve something for somebody" là cấu trúc chuẩn nghĩa là dành riêng cái gì cho ai → D đúng. ' +
      'A sai vì "reserve something to somebody" không phải cụm chuẩn trong tiếng Anh. ' +
      'C sai vì "reserve … with" không tạo ra cụm đúng nghĩa. ' +
      'B sai vì "among" chỉ một nhóm được chọn ra, không diễn tả người nhận.',
    translation: 'Phòng khám dành riêng hai giờ mỗi sáng cho trẻ em dưới năm tuổi.',
  },
  {
    id: 'p5-0086',
    difficulty: 2,
    tags: ['word-form', 'adjective'],
    prompt: 'The city hopes the new bus route will be more ______ for commuters.',
    choices: ['convenience', 'convenient', 'conveniently', 'conveniences'],
    answer: 'B',
    explanation:
      'Sau "more" và sau "be" cần tính từ → B đúng. ' +
      'A sai vì "convenience" là danh từ. ' +
      'C sai vì "conveniently" là trạng từ, không đứng sau "be" để tả chủ ngữ. ' +
      'D sai vì "conveniences" là danh từ số nhiều.',
    translation: 'Thành phố hy vọng tuyến xe buýt mới sẽ thuận tiện hơn cho người đi làm.',
  },
  {
    id: 'p5-0087',
    difficulty: 4,
    tags: ['appositive', 'noun-clause'],
    prompt: 'The fact ______ the committee cancelled the survey surprised everyone.',
    choices: ['which', 'what', 'that', 'who'],
    answer: 'C',
    explanation:
      '"The fact that …" là mẫu mệnh đề đồng vị chuẩn với danh từ "fact" → C đúng. ' +
      'A sai vì "which" không dùng sau "the fact" trong mẫu này. ' +
      'B sai vì "what" đã bao hàm ý đồng vị, không đi sau một danh từ cụ thể. ' +
      'D sai vì "who" chỉ người.',
    translation: 'Việc uỷ ban huỷ cuộc khảo sát khiến mọi người bất ngờ.',
  },
  {
    id: 'p5-0088',
    difficulty: 1,
    tags: ['vocabulary', 'verb'],
    prompt: 'Guests are kindly asked to ______ their room keys at reception.',
    choices: ['return', 'get', 'bring', 'take'],
    answer: 'A',
    explanation:
      '"Return the keys" nghĩa là trả lại chìa khoá, đúng ngữ cảnh trả phòng → A đúng. ' +
      'B sai vì "get" nghĩa là lấy về, ngược lại ý câu. ' +
      'C sai vì "bring" là mang đến đâu đó nhưng không hàm ý trả lại vật đã mượn. ' +
      'D sai vì "take" là mang đi, cũng ngược nghĩa.',
    translation: 'Khách được đề nghị trả chìa khoá phòng tại quầy lễ tân.',
  },
  {
    id: 'p5-0089',
    difficulty: 3,
    tags: ['preposition', 'collocation'],
    prompt: 'The engineer was responsible ______ checking the pressure gauges every morning.',
    choices: ['of', 'in', 'to', 'for'],
    answer: 'D',
    explanation:
      '"Be responsible for + V-ing" là cấu trúc chuẩn nghĩa là chịu trách nhiệm về việc gì → D đúng. ' +
      'A sai vì "responsible of" không phải cụm chuẩn trong tiếng Anh. ' +
      'C sai vì "responsible to" chỉ cấp trên phải báo cáo. ' +
      'B sai vì "responsible in" không dùng.',
    translation: 'Kỹ sư chịu trách nhiệm kiểm tra đồng hồ áp suất mỗi sáng.',
  },
  {
    id: 'p5-0090',
    difficulty: 3,
    tags: ['causative', 'verb-form'],
    prompt: 'The store manager let the trainee ______ the register under supervision.',
    choices: ['operates', 'operated', 'operating', 'operate'],
    answer: 'D',
    explanation:
      'Sau "let + tân ngữ" phải dùng động từ nguyên mẫu không "to" → D đúng. ' +
      'A sai vì "operates" đã chia ngôi thứ ba. ' +
      'B sai vì "operated" là quá khứ. ' +
      'C sai vì "operating" là V-ing.',
    translation: 'Quản lý cửa hàng để nhân viên tập sự vận hành máy tính tiền dưới sự giám sát.',
  },
  {
    id: 'p5-0091',
    difficulty: 2,
    tags: ['reflexive-pronoun', 'pronoun'],
    prompt: 'The two divisions should coordinate with ______ to avoid duplicate orders.',
    choices: ['each other', 'themselves', 'itself', 'one another other'],
    answer: 'A',
    explanation:
      'Hai đơn vị phối hợp qua lại nên cần đại từ tương hỗ "each other" → A đúng. ' +
      'B sai vì "themselves" là đại từ phản thân, không diễn tả quan hệ hai chiều. ' +
      'C sai vì "itself" chỉ một vật số ít. ' +
      'D sai vì "one another other" lặp từ, không phải cụm hợp lệ.',
    translation: 'Hai bộ phận nên phối hợp với nhau để tránh đặt hàng trùng.',
  },
  {
    id: 'p5-0092',
    difficulty: 3,
    tags: ['passive-voice', 'present-perfect'],
    prompt: 'The new safety procedures ______ put into effect since 1 July.',
    choices: ['has been', 'have be', 'have been', 'are been'],
    answer: 'C',
    explanation:
      'Chủ ngữ "procedures" số nhiều nên dùng "have been" cho bị động hiện tại hoàn thành → C đúng. ' +
      'A sai vì "has been" chia số ít. ' +
      'B sai vì "have be" thiếu dạng quá khứ phân từ. ' +
      'D sai vì "are been" không phải cấu trúc nào trong tiếng Anh.',
    translation: 'Các quy trình an toàn mới đã được áp dụng kể từ ngày 1 tháng Bảy.',
  },
  {
    id: 'p5-0093',
    difficulty: 2,
    tags: ['present-perfect-continuous'],
    prompt: 'The search committee ______ for a qualified candidate for almost three months.',
    choices: ['has been looking', 'have been looking', 'is looking', 'looks'],
    answer: 'A',
    explanation:
      '"The search committee" là danh từ tập hợp được xem như một đơn vị số ít, và khoảng thời gian "for almost three months" đòi hỏi hiện tại hoàn thành tiếp diễn → A đúng. ' +
      'B sai vì chia số nhiều. ' +
      'C sai vì hiện tại tiếp diễn không đi với khoảng thời gian dài. ' +
      'D sai vì hiện tại đơn không diễn tả hành động kéo dài.',
    translation: 'Uỷ ban tuyển dụng đã tìm ứng viên đủ tiêu chuẩn gần ba tháng nay.',
  },
  {
    id: 'p5-0094',
    difficulty: 4,
    tags: ['connector', 'purpose'],
    prompt: 'The firm hired extra staff ______ to handle the holiday rush.',
    choices: ['so', 'because', 'such', 'in order'],
    answer: 'D',
    explanation:
      '"In order to + động từ nguyên mẫu" chỉ mục đích, và "in order to" đứng được ngay trước "to handle" khi có "so" bỏ trống → D đúng. ' +
      'A sai vì "so" không đi với "to + động từ" theo mẫu này. ' +
      'C sai vì "such" phải đi với danh từ. ' +
      'B sai vì "because" cần mệnh đề, không đi trực tiếp với "to".',
    translation: 'Công ty đã thuê thêm nhân viên để xử lý đợt cao điểm lễ hội.',
  },
  {
    id: 'p5-0095',
    difficulty: 3,
    tags: ['word-form', 'verb'],
    prompt: 'Only applicants who ______ all the requirements will be contacted.',
    choices: ['meets', 'are meet', 'meet', 'meeting'],
    answer: 'C',
    explanation:
      '"Applicants" số nhiều nên động từ phải là "meet" → C đúng. ' +
      'A sai vì "meets" chia số ít. ' +
      'B sai vì "are meet" không phải cấu trúc hợp lệ. ' +
      'D sai vì "meeting" không làm động từ chính của mệnh đề quan hệ.',
    translation: 'Chỉ những ứng viên đáp ứng đủ các yêu cầu mới được liên hệ.',
  },
  {
    id: 'p5-0096',
    difficulty: 2,
    tags: ['adverb', 'time'],
    prompt: 'The lab results are ______ available for download on the patient portal.',
    choices: ['current', 'now', 'recent', 'presently'],
    answer: 'B',
    explanation:
      '"Are now available" là cách nói tự nhiên trong thông báo cho biết đã có thể tải ngay bây giờ → B đúng. ' +
      'A sai vì "current" là tính từ, không đứng sau "are" để bổ nghĩa như vậy. ' +
      'C sai vì "recent" là tính từ. ' +
      'D sai vì "presently" nghĩa là sắp tới hoặc hiện nay nhưng thường không đi kèm "available" theo mẫu này.',
    translation: 'Kết quả xét nghiệm hiện đã có thể tải về trên cổng thông tin bệnh nhân.',
  },
  {
    id: 'p5-0097',
    difficulty: 3,
    tags: ['conjunction', 'cause'],
    prompt: 'The opening ceremony was postponed ______ the stage had not been completed.',
    choices: ['because', 'despite', 'because of', 'due to'],
    answer: 'A',
    explanation:
      'Sau chỗ trống là mệnh đề đầy đủ chủ ngữ và động từ, chỉ nguyên nhân → A đúng. ' +
      'B sai vì "despite" cần cụm danh từ và mang nghĩa nhượng bộ. ' +
      'C sai vì "because of" cần cụm danh từ. ' +
      'D sai vì "due to" cũng cần cụm danh từ.',
    translation: 'Lễ khai mạc bị hoãn vì sân khấu chưa hoàn thiện.',
  },
  {
    id: 'p5-0098',
    difficulty: 1,
    tags: ['modal-verb', 'ability'],
    prompt: 'Trainees ______ access the online materials from any device.',
    choices: ['can', 'can to', 'are can', 'cans'],
    answer: 'A',
    explanation:
      '"Can" đứng trước động từ nguyên mẫu không "to" → A đúng. ' +
      'B sai vì sau "can" không dùng "to". ' +
      'C sai vì "can" không đi sau động từ "be". ' +
      'D sai vì "can" không chia theo ngôi.',
    translation: 'Học viên có thể truy cập tài liệu trực tuyến từ bất kỳ thiết bị nào.',
  },
  {
    id: 'p5-0099',
    difficulty: 4,
    tags: ['participle', 'reduced-clause'],
    prompt: '______ by the unexpected demand, the factory added a second shift.',
    choices: ['Surprising', 'To surprise', 'Surprise', 'Surprised'],
    answer: 'D',
    explanation:
      'Chủ ngữ "the factory" ở đây được hiểu là bên chịu tác động của nhu cầu bất ngờ, nên cần phân từ quá khứ "Surprised" → D đúng. ' +
      'A sai vì "Surprising" mang nghĩa chủ động (làm ai bất ngờ), gán sai vai cho nhà máy. ' +
      'C sai vì "Surprise" là động từ/danh từ, không mở đầu cụm rút gọn. ' +
      'B sai vì "To surprise" chỉ mục đích, không phù hợp cấu trúc này.',
    translation: 'Bị bất ngờ bởi nhu cầu tăng đột biến, nhà máy đã thêm một ca thứ hai.',
  },
  {
    id: 'p5-0100',
    difficulty: 2,
    tags: ['quantifier', 'countable'],
    prompt: 'We only have a ______ time left before the deadline, so let us prioritize.',
    choices: ['few', 'little', 'many', 'number of'],
    answer: 'B',
    explanation:
      '"Time" ở đây là danh từ không đếm được nên dùng "a little" → B đúng. ' +
      'A sai vì "a few" đi với danh từ đếm được số nhiều. ' +
      'C sai vì "many" cũng cần danh từ đếm được. ' +
      'D sai vì "a number of" chỉ dùng với danh từ đếm được số nhiều.',
    translation: 'Chúng ta chỉ còn ít thời gian trước hạn chót nên hãy ưu tiên việc gấp.',
  },
  {
    id: 'p5-0101',
    difficulty: 3,
    tags: ['word-form', 'noun'],
    prompt: 'The success of the project depends largely on the ______ of the whole team.',
    choices: ['committed', 'commit', 'commitment', 'committing'],
    answer: 'C',
    explanation:
      'Sau "the … of" cần danh từ → C đúng. ' +
      'A sai vì "committed" là tính từ/động từ quá khứ. ' +
      'B sai vì "commit" là động từ, không đứng sau "the". ' +
      'D sai vì "committing" là V-ing.',
    translation: 'Thành công của dự án phụ thuộc phần lớn vào sự tận tâm của cả nhóm.',
  },
  {
    id: 'p5-0102',
    difficulty: 2,
    tags: ['passive-voice', 'future'],
    prompt: 'The new cafeteria ______ by the end of next month.',
    choices: ['will open', 'opens by', 'will be opening', 'will be opened'],
    answer: 'D',
    explanation:
      'Căn-tin là đối tượng được mở nên cần bị động tương lai "will be opened" → D đúng. ' +
      'A sai vì "will open" là chủ động, nghe như căn-tin tự mở. ' +
      'C sai vì tiếp diễn không diễn tả việc hoàn tất đúng hạn. ' +
      'B sai vì "opens by" sai cả thì lẫn cấu trúc.',
    translation: 'Căn-tin mới sẽ được khai trương trước cuối tháng sau.',
  },
  {
    id: 'p5-0103',
    difficulty: 3,
    tags: ['preposition', 'collocation'],
    prompt: 'The brochure gives detailed information ______ the hotel facilities.',
    choices: ['of', 'about', 'with', 'at'],
    answer: 'B',
    explanation:
      '"Information about something" là cụm chuẩn → B đúng. ' +
      'A sai vì "information of" chỉ dùng trong số ít trường hợp như "a piece of information". ' +
      'C sai vì "information with" không phải cụm chuẩn. ' +
      'D sai vì "information at" không dùng.',
    translation: 'Tờ giới thiệu cung cấp thông tin chi tiết về các tiện nghi của khách sạn.',
  },
  {
    id: 'p5-0104',
    difficulty: 4,
    tags: ['word-order', 'adverb'],
    prompt: 'She has ______ completed the certification program.',
    choices: ['yet', 'already', 'still', 'ever'],
    answer: 'B',
    explanation:
      '"Already" đứng giữa "has" và động từ chính, diễn tả việc đã xong sớm hơn dự kiến → B đúng. ' +
      'A sai vì "yet" dùng trong câu phủ định hoặc nghi vấn, thường đứng cuối câu. ' +
      'C sai vì "still" diễn tả việc còn tiếp diễn, không hợp nghĩa đã xong. ' +
      'D sai vì "ever" dùng chủ yếu trong câu hỏi hoặc so sánh.',
    translation: 'Cô ấy đã hoàn thành chương trình chứng chỉ rồi.',
  },
  {
    id: 'p5-0105',
    difficulty: 2,
    tags: ['subject-verb-agreement', 'present-simple'],
    prompt: 'Each of the proposals ______ reviewed by two independent experts.',
    choices: ['are', 'were', 'is', 'have been'],
    answer: 'C',
    explanation:
      '"Each of + danh từ số nhiều" chia động từ số ít → C đúng. ' +
      'A sai vì "are" chia số nhiều. ' +
      'B sai vì "were" vừa số nhiều vừa ở quá khứ, trong khi câu nêu quy trình chung. ' +
      'D sai vì "have been" chia số nhiều.',
    translation: 'Mỗi đề xuất đều được hai chuyên gia độc lập rà soát.',
  },
  {
    id: 'p5-0106',
    difficulty: 3,
    tags: ['vocabulary', 'adjective'],
    prompt: 'The report was so ______ that the board asked for a second review.',
    choices: ['ambiguity', 'ambiguous', 'ambiguously', 'ambiguities'],
    answer: 'B',
    explanation:
      'Sau "so" cần tính từ, và cấu trúc "so … that" yêu cầu tính từ → B đúng. ' +
      'A sai vì "ambiguity" là danh từ. ' +
      'C sai vì "ambiguously" là trạng từ, không đứng sau "so" trong mẫu này. ' +
      'D sai vì "ambiguities" là danh từ số nhiều.',
    translation: 'Bản báo cáo mơ hồ đến mức hội đồng phải yêu cầu rà soát lại.',
  },
  {
    id: 'p5-0107',
    difficulty: 2,
    tags: ['relative-pronoun', 'adjective-clause'],
    prompt: 'The technician ______ repaired our air conditioner will come back on Friday.',
    choices: ['which', 'whose', 'who', 'what'],
    answer: 'C',
    explanation:
      'Chỗ trống thay cho chủ ngữ chỉ người trong mệnh đề quan hệ → C đúng. ' +
      'A sai vì "which" chỉ vật. ' +
      'B sai vì "whose" phải đứng trước một danh từ sở hữu. ' +
      'D sai vì "what" không làm đại từ quan hệ sau danh từ xác định.',
    translation: 'Kỹ thuật viên đã sửa máy điều hoà của chúng tôi sẽ quay lại vào thứ Sáu.',
  },
  {
    id: 'p5-0108',
    difficulty: 3,
    tags: ['connector', 'contrast'],
    prompt: 'The first draft was completed on time; ______, the final version is still under review.',
    choices: ['therefore', 'however', 'moreover', 'otherwise'],
    answer: 'B',
    explanation:
      'Hai vế tương phản (bản nháp xong đúng hạn nhưng bản cuối vẫn đang xét) nên cần "however" → B đúng. ' +
      'A sai vì "therefore" chỉ kết quả. ' +
      'C sai vì "moreover" dùng để bổ sung thêm ý cùng chiều. ' +
      'D sai vì "otherwise" chỉ hệ quả nếu không làm gì đó.',
    translation: 'Bản nháp đầu tiên được hoàn thành đúng hạn; tuy nhiên, bản cuối vẫn đang được xem xét.',
  },
  {
    id: 'p5-0109',
    difficulty: 1,
    tags: ['verb-form', 'base-form'],
    prompt: 'The supervisor told the crew ______ their helmets at all times.',
    choices: ['wearing', 'wear', 'wore', 'to wear'],
    answer: 'D',
    explanation:
      '"Tell somebody to do something" là cấu trúc chuẩn → D đúng. ' +
      'A sai vì "wearing" không theo sau "told somebody". ' +
      'C sai vì "wore" là quá khứ. ' +
      'B sai vì thiếu "to" trong cấu trúc "tell somebody to do".',
    translation: 'Người giám sát yêu cầu tổ công nhân đội mũ bảo hộ trong suốt ca làm.',
  },
  {
    id: 'p5-0110',
    difficulty: 3,
    tags: ['passive-voice', 'modal-verb'],
    prompt: 'Any damaged item must ______ to the supplier within seven days.',
    choices: ['return', 'be returned', 'returning', 'have returned'],
    answer: 'B',
    explanation:
      'Hàng bị hỏng ĐƯỢC trả lại nên cần bị động sau "must": "must be + V3" → B đúng. ' +
      'A sai vì thiếu dạng bị động. ' +
      'C sai vì sau "must" không dùng V-ing. ' +
      'D sai vì "must have returned" là cấu trúc suy đoán về quá khứ.',
    translation: 'Mọi món hàng bị hỏng phải được trả lại nhà cung cấp trong vòng bảy ngày.',
  },
  {
    id: 'p5-0111',
    difficulty: 4,
    tags: ['gerund', 'verb-pattern'],
    prompt: 'The manager suggested ______ the meeting until the figures are confirmed.',
    choices: ['to postpone', 'postpone', 'postponing', 'postponed'],
    answer: 'C',
    explanation:
      '"Suggest + V-ing" là mẫu động từ chuẩn → C đúng. ' +
      'A sai vì "suggest" không đi với "to + động từ" trong mẫu này. ' +
      'B sai vì thiếu dạng V-ing. ' +
      'D sai vì "postponed" là quá khứ, không đứng sau "suggested".',
    translation: 'Người quản lý đề nghị hoãn cuộc họp cho đến khi số liệu được xác nhận.',
  },
  {
    id: 'p5-0112',
    difficulty: 2,
    tags: ['vocabulary', 'verb'],
    prompt: 'Please ______ the attached form and return it to the HR office.',
    choices: ['fill out', 'fill up', 'fill in on', 'fill with'],
    answer: 'A',
    explanation:
      '"Fill out a form" là cụm chuẩn trong tiếng Anh Mỹ, nghĩa là điền đơn → A đúng. ' +
      'B sai vì "fill up" dùng cho bình chứa, không dùng cho mẫu đơn. ' +
      'C sai vì "fill in on" không phải cụm hợp lệ. ' +
      'D sai vì "fill with" nghĩa là đổ đầy bằng chất gì đó.',
    translation: 'Vui lòng điền vào mẫu đính kèm và gửi lại phòng nhân sự.',
  },
  {
    id: 'p5-0113',
    difficulty: 2,
    tags: ['preposition', 'time'],
    prompt: 'The office will be closed ______ the national holiday.',
    choices: ['on', 'at', 'in', 'by'],
    answer: 'A',
    explanation:
      'Với tên một ngày lễ cụ thể, giới từ chỉ thời gian là "on" → A đúng. ' +
      'B sai vì "at" dùng cho giờ hoặc dịp ngắn, không dùng với tên ngày lễ. ' +
      'C sai vì "in" dùng cho tháng, năm, mùa. ' +
      'D sai vì "by" chỉ hạn chót.',
    translation: 'Văn phòng sẽ đóng cửa vào ngày lễ quốc gia.',
  },
  {
    id: 'p5-0114',
    difficulty: 3,
    tags: ['verb-pattern', 'infinitive'],
    prompt: 'The city council agreed ______ the parking fees for electric vehicles.',
    choices: ['reduce', 'reducing', 'to reduce', 'reduced'],
    answer: 'C',
    explanation:
      '"Agree + to + động từ nguyên mẫu" là mẫu chuẩn → C đúng. ' +
      'A sai vì thiếu "to". ' +
      'B sai vì "agree" không đi trực tiếp với V-ing. ' +
      'D sai vì "reduced" là quá khứ.',
    translation: 'Hội đồng thành phố đồng ý giảm phí đỗ xe cho xe điện.',
  },
  {
    id: 'p5-0115',
    difficulty: 2,
    tags: ['adverb', 'manner'],
    prompt: 'The device should be handled ______ to avoid damaging the sensor.',
    choices: ['gentle', 'gently', 'gentleness', 'gentler'],
    answer: 'B',
    explanation:
      'Chỗ trống bổ nghĩa cho động từ "handled" nên cần trạng từ → B đúng. ' +
      'A sai vì "gentle" là tính từ. ' +
      'C sai vì "gentleness" là danh từ. ' +
      'D sai vì "gentler" là so sánh hơn, không dùng để bổ nghĩa cho động từ ở đây.',
    translation: 'Thiết bị cần được xử lý nhẹ nhàng để tránh làm hỏng cảm biến.',
  },
  {
    id: 'p5-0116',
    difficulty: 3,
    tags: ['word-form', 'adjective'],
    prompt: 'The committee needs a ______ estimate before approving the construction budget.',
    choices: ['realism', 'realist', 'realistically', 'realistic'],
    answer: 'D',
    explanation:
      'Chỗ trống đứng trước danh từ "estimate" nên cần tính từ → D đúng. ' +
      'A sai vì "realism" là danh từ. ' +
      'C sai vì "realistically" là trạng từ. ' +
      'B sai vì "realist" là danh từ chỉ người.',
    translation: 'Uỷ ban cần một bản dự toán thực tế trước khi duyệt ngân sách xây dựng.',
  },
  {
    id: 'p5-0117',
    difficulty: 4,
    tags: ['inversion', 'adverb'],
    prompt: 'Not only ______ the deadline, but the team also stayed under budget.',
    choices: ['the team met', 'did the team meet', 'the team did meet', 'met the team'],
    answer: 'B',
    explanation:
      '"Not only" đứng đầu câu buộc đảo trợ động từ lên trước chủ ngữ, và ở quá khứ đơn cần "did" → B đúng. ' +
      'A sai vì không đảo trợ động từ. ' +
      'C sai vì trợ động từ đứng sau chủ ngữ, không phải đảo ngữ. ' +
      'D sai vì đảo cả động từ chính mà thiếu trợ động từ, không đúng mẫu.',
    translation: 'Nhóm không chỉ đúng hạn mà còn chi dưới mức ngân sách.',
  },
  {
    id: 'p5-0118',
    difficulty: 2,
    tags: ['quantifier', 'determiner'],
    prompt: '______ employee must complete the online safety module by 30 June.',
    choices: ['All', 'Several', 'Many', 'Every'],
    answer: 'D',
    explanation:
      '"Every" đi với danh từ đếm được số ít và động từ số ít, khớp với "employee" và "must" trong câu → D đúng. ' +
      'A sai vì "All" cần danh từ số nhiều hoặc điều kiện đi kèm. ' +
      'C sai vì "Many" cần danh từ số nhiều. ' +
      'B sai vì "Several" cũng cần danh từ số nhiều.',
    translation: 'Mỗi nhân viên phải hoàn thành mô-đun an toàn trực tuyến trước ngày 30 tháng Sáu.',
  },
  {
    id: 'p5-0119',
    difficulty: 3,
    tags: ['passive-voice', 'past-perfect'],
    prompt: 'The building ______ before the new regulations came into force.',
    choices: ['had been renovated', 'has been renovated', 'was renovating', 'had renovated'],
    answer: 'A',
    explanation:
      'Hành động cải tạo hoàn tất trước mốc quá khứ "came into force", và toà nhà ĐƯỢC cải tạo nên cần bị động quá khứ hoàn thành → A đúng. ' +
      'B sai vì hiện tại hoàn thành không diễn tả hành động xong trước một mốc quá khứ. ' +
      'C sai vì "was renovating" là chủ động tiếp diễn, gán sai vai. ' +
      'D sai vì "had renovated" là chủ động, hàm ý toà nhà tự cải tạo.',
    translation: 'Toà nhà đã được cải tạo xong trước khi các quy định mới có hiệu lực.',
  },
  {
    id: 'p5-0120',
    difficulty: 5,
    tags: ['mixed-grammar', 'word-order'],
    prompt: 'Hardly ______ the announcement when the phones started ringing.',
    choices: ['had she made', 'she had made', 'did she make', 'she made'],
    answer: 'A',
    explanation:
      'Cấu trúc "Hardly had + chủ ngữ + V3 + when …" là đảo ngữ của quá khứ hoàn thành, diễn tả việc vừa mới xảy ra → A đúng. ' +
      'B sai vì không đảo trợ động từ lên trước chủ ngữ. ' +
      'C sai vì sai thì so với mốc "when the phones started ringing". ' +
      'D sai vì vừa không đảo ngữ vừa không dùng quá khứ hoàn thành.',
    translation: 'Cô ấy vừa mới đưa ra thông báo thì điện thoại bắt đầu đổ chuông.',
  },
]

export const PART5C_QUESTIONS = buildPart5(PART5C_ROWS)
