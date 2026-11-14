import type { Question } from '../types'

/**
 * PART 5 — Điền từ vào câu (20 câu).
 *
 * Mỗi câu kiểm tra đúng một điểm ngữ pháp/từ vựng và ba phương án nhiễu được chọn
 * theo lỗi mà người học thật hay mắc (sai dạng từ, sai giới từ, sai thì, sai nghĩa).
 * Không có stimulus vì mỗi câu là một câu độc lập.
 *
 * Quy ước giải thích: luôn nêu đáp án đúng trước, rồi lần lượt gọi tên A/B/C/D của
 * từng phương án nhiễu để người học đối chiếu được ngay với màn hình làm bài.
 */
export const PART5_QUESTIONS: Question[] = [
  {
    id: 'p5-0001',
    part: 5,
    section: 'reading',
    difficulty: 1,
    tags: ['modal-verb', 'base-form'],
    prompt: 'All visitors must ______ a photo identification badge at the front desk.',
    choices: [
      { letter: 'A', text: 'obtained' },
      { letter: 'B', text: 'obtains' },
      { letter: 'C', text: 'obtaining' },
      { letter: 'D', text: 'obtain' },
    ],
    answer: 'D',
    explanation:
      'Sau động từ khuyết thiếu "must" phải dùng động từ nguyên mẫu không "to", nên D ("obtain") đúng. ' +
      'C sai vì "obtaining" là dạng V-ing, không đứng sau "must". ' +
      'A sai vì "obtained" là dạng quá khứ/V3, không hợp với động từ khuyết thiếu. ' +
      'B sai vì "obtains" chia ngôi thứ ba số ít, chỉ dùng ở thì hiện tại đơn, không đứng sau "must".',
    translation: 'Mọi khách tham quan phải lấy thẻ nhận dạng có ảnh tại quầy lễ tân.',
  },
  {
    id: 'p5-0002',
    part: 5,
    section: 'reading',
    difficulty: 2,
    tags: ['preposition', 'collocation'],
    prompt: 'The revised safety guidelines apply ______ everyone working on the production floor.',
    choices: [
      { letter: 'A', text: 'with' },
      { letter: 'B', text: 'at' },
      { letter: 'C', text: 'for' },
      { letter: 'D', text: 'to' },
    ],
    answer: 'D',
    explanation:
      'Cụm cố định "apply to somebody" nghĩa là áp dụng cho ai, nên D đúng. ' +
      'B sai vì "apply at" chỉ dùng khi nói nộp đơn tại một địa điểm cụ thể. ' +
      'C sai vì "apply for" dùng khi nộp đơn xin việc hoặc xin học bổng, không hợp với ngữ cảnh quy định. ' +
      'A sai vì "apply with" không phải cụm chuẩn trong trường hợp này.',
    translation: 'Hướng dẫn an toàn sửa đổi áp dụng cho tất cả những ai làm việc ở khu vực sản xuất.',
  },
  {
    id: 'p5-0003',
    part: 5,
    section: 'reading',
    difficulty: 2,
    tags: ['word-form', 'adverb'],
    prompt: 'The manager praised the team for handling the customer complaint ______.',
    choices: [
      { letter: 'A', text: 'professionalism' },
      { letter: 'B', text: 'profession' },
      { letter: 'C', text: 'professional' },
      { letter: 'D', text: 'professionally' },
    ],
    answer: 'D',
    explanation:
      'Chỗ trống bổ nghĩa cho động từ "handling" nên cần một trạng từ → D ("professionally") đúng. ' +
      'B sai vì "profession" là danh từ, không thể bổ nghĩa cho động từ. ' +
      'C sai vì "professional" là tính từ; muốn dùng nó phải có danh từ theo sau (a professional response). ' +
      'A sai vì "professionalism" là danh từ, không làm trạng ngữ được.',
    translation: 'Người quản lý khen ngợi nhóm vì đã xử lý khiếu nại của khách hàng một cách chuyên nghiệp.',
  },
  {
    id: 'p5-0004',
    part: 5,
    section: 'reading',
    difficulty: 3,
    tags: ['conjunction', 'contrast'],
    prompt: '______ the heavy rain, the outdoor conference was moved to the hotel ballroom.',
    choices: [
      { letter: 'A', text: 'Because of' },
      { letter: 'B', text: 'Even though' },
      { letter: 'C', text: 'In spite of' },
      { letter: 'D', text: 'Unless' },
    ],
    answer: 'A',
    explanation:
      '"The heavy rain" là một cụm danh từ, và quan hệ ý nghĩa là nguyên nhân – kết quả (mưa to nên phải dời vào ' +
      'trong), nên A đúng. ' +
      'B sai vì "Even though" cần một mệnh đề đầy đủ chủ ngữ + động từ, không đứng trước danh từ. ' +
      'C sai vì "In spite of" tuy đứng trước danh từ nhưng mang nghĩa nhượng bộ (dù mưa vẫn tổ chức ngoài trời), ' +
      'trái với việc họ đã dời vào trong. ' +
      'D sai vì "Unless" cũng cần một mệnh đề và mang nghĩa điều kiện phủ định.',
    translation: 'Vì trời mưa to, hội nghị ngoài trời đã được chuyển vào phòng khiêu vũ của khách sạn.',
  },
  {
    id: 'p5-0005',
    part: 5,
    section: 'reading',
    difficulty: 2,
    tags: ['present-perfect', 'tense'],
    prompt: 'Ms. Okonkwo ______ in the accounting department for six years and still enjoys the work.',
    choices: [
      { letter: 'A', text: 'worked' },
      { letter: 'B', text: 'is working' },
      { letter: 'C', text: 'works' },
      { letter: 'D', text: 'has worked' },
    ],
    answer: 'D',
    explanation:
      'Vế sau dùng hiện tại đơn "still enjoys" cho thấy tình trạng còn tiếp diễn, nên vế trước cần hiện tại hoàn thành ' +
      'diễn tả hành động kéo dài từ quá khứ đến hiện tại: "has worked … for six years" → D đúng. ' +
      'C sai vì hiện tại đơn không kết hợp được với "for six years". ' +
      'A sai vì quá khứ đơn gợi ý cô ấy đã nghỉ làm, mâu thuẫn với "still enjoys". ' +
      'B sai vì hiện tại tiếp diễn chỉ hành động tạm thời, không hợp với khoảng thời gian sáu năm.',
    translation: 'Cô Okonkwo đã làm việc ở phòng kế toán sáu năm và vẫn thích công việc này.',
  },
  {
    id: 'p5-0006',
    part: 5,
    section: 'reading',
    difficulty: 3,
    tags: ['vocabulary', 'meaning-in-context'],
    prompt: 'The supplier agreed to ______ the delivery date by one week at no extra charge.',
    choices: [
      { letter: 'A', text: 'extend' },
      { letter: 'B', text: 'expand' },
      { letter: 'C', text: 'enlarge' },
      { letter: 'D', text: 'increase' },
    ],
    answer: 'A',
    explanation:
      '"Extend the delivery date" là cụm cố định nghĩa là lùi lại một mốc thời gian, nên A đúng. ' +
      'B sai vì "expand" dùng cho quy mô, diện tích (expand a warehouse), không dùng với mốc ngày. ' +
      'C sai vì "enlarge" dùng cho kích thước vật lý hoặc hình ảnh (enlarge a photo). ' +
      'D sai vì "increase" dùng cho số lượng, giá cả, không dùng với một mốc thời gian.',
    translation: 'Nhà cung cấp đồng ý lùi ngày giao hàng thêm một tuần mà không tính thêm phí.',
  },
  {
    id: 'p5-0007',
    part: 5,
    section: 'reading',
    difficulty: 4,
    tags: ['relative-pronoun', 'adjective-clause'],
    prompt: 'The consultant ______ report was quoted in the meeting will join us by video call.',
    choices: [
      { letter: 'A', text: 'whom' },
      { letter: 'B', text: 'who' },
      { letter: 'C', text: 'which' },
      { letter: 'D', text: 'whose' },
    ],
    answer: 'D',
    explanation:
      'Sau chỗ trống là danh từ "report" không có mạo từ, tức cần đại từ quan hệ sở hữu chỉ "báo cáo CỦA vị tư vấn" ' +
      '→ D ("whose") đúng. ' +
      'B sai vì "who" thay cho chủ ngữ chỉ người, không đứng trước danh từ sở hữu. ' +
      'C sai vì "which" thay cho vật, không dùng cho người. ' +
      'A sai vì "whom" là tân ngữ chỉ người, cũng không thể đứng trước "report".',
    translation: 'Vị tư vấn mà báo cáo của ông ấy được trích dẫn trong cuộc họp sẽ tham gia với chúng ta qua cuộc gọi video.',
  },
  {
    id: 'p5-0008',
    part: 5,
    section: 'reading',
    difficulty: 2,
    tags: ['subjunctive', 'verb-form'],
    prompt: 'The board recommended that the new policy ______ reviewed before the end of the quarter.',
    choices: [
      { letter: 'A', text: 'is' },
      { letter: 'B', text: 'was' },
      { letter: 'C', text: 'be' },
      { letter: 'D', text: 'will be' },
    ],
    answer: 'C',
    explanation:
      'Sau "recommend that" trong văn phong trang trọng dùng thức giả định (subjunctive): "that + chủ ngữ + động từ ' +
      'nguyên mẫu", nên "be reviewed" là đúng → C. ' +
      'A sai vì "is" chia theo hiện tại đơn bình thường, không đúng cấu trúc giả định. ' +
      'B sai vì "was" đưa câu về quá khứ, không phải thức giả định. ' +
      'D sai vì "will be" không xuất hiện trong mệnh đề giả định sau "recommend".',
    translation: 'Hội đồng quản trị đề nghị chính sách mới được xem xét lại trước khi hết quý.',
  },
  {
    id: 'p5-0009',
    part: 5,
    section: 'reading',
    difficulty: 3,
    tags: ['passive-voice', 'modal-verb'],
    prompt: 'All expense claims ______ by the finance office before reimbursement is issued.',
    choices: [
      { letter: 'A', text: 'must approve' },
      { letter: 'B', text: 'must be approved' },
      { letter: 'C', text: 'must be approving' },
      { letter: 'D', text: 'must have approved' },
    ],
    answer: 'B',
    explanation:
      'Chủ ngữ "All expense claims" là đối tượng ĐƯỢC duyệt chứ không phải người duyệt, nên cần bị động ' +
      '"must be + V3" → B đúng. ' +
      'A sai vì "must approve" là chủ động, ngụ ý các khoản chi tự đi duyệt — vô nghĩa. ' +
      'C sai vì "must be approving" là tiếp diễn chủ động, không mang nghĩa bị động. ' +
      'D sai vì "must have approved" là chủ động ở dạng hoàn thành, cũng không hợp nghĩa bị động.',
    translation: 'Mọi đề nghị hoàn chi phí phải được phòng tài chính duyệt trước khi việc hoàn tiền được thực hiện.',
  },
  {
    id: 'p5-0010',
    part: 5,
    section: 'reading',
    difficulty: 2,
    tags: ['comparative', 'quantifier'],
    prompt: 'There were ______ applicants for the summer internship than we had anticipated.',
    choices: [
      { letter: 'A', text: 'fewer' },
      { letter: 'B', text: 'less' },
      { letter: 'C', text: 'many' },
      { letter: 'D', text: 'few' },
    ],
    answer: 'A',
    explanation:
      'Có "than" nên cần dạng so sánh hơn, và "applicants" là danh từ đếm được số nhiều → A ("fewer") đúng. ' +
      'D sai vì "few" là dạng nguyên cấp, không đi với "than". ' +
      'B sai vì "less" dùng cho danh từ không đếm được (less time, less money). ' +
      'C sai vì "many" cũng là nguyên cấp, không tạo được câu so sánh.',
    translation: 'Số người nộp đơn cho kỳ thực tập hè ít hơn chúng tôi dự kiến.',
  },
  {
    id: 'p5-0011',
    part: 5,
    section: 'reading',
    difficulty: 4,
    tags: ['inversion', 'adverb'],
    prompt: 'Not until the audit was complete ______ the extent of the accounting error.',
    choices: [
      { letter: 'A', text: 'the company discovered' },
      { letter: 'B', text: 'did the company discover' },
      { letter: 'C', text: 'the company did discover' },
      { letter: 'D', text: 'discovered the company' },
    ],
    answer: 'B',
    explanation:
      'Khi câu mở đầu bằng cụm phủ định "Not until…", mệnh đề chính phải đảo ngữ: trợ động từ đứng trước chủ ngữ ' +
      '→ B ("did the company discover") đúng. ' +
      'A sai vì giữ trật tự từ thường, không đảo ngữ. ' +
      'C sai vì đặt "did" sau chủ ngữ, tức vẫn là trật tự thường. ' +
      'D sai vì đảo động từ chính lên trước chủ ngữ nhưng thiếu trợ động từ, sai ngữ pháp.',
    translation: 'Mãi đến khi cuộc kiểm toán hoàn tất, công ty mới phát hiện mức độ nghiêm trọng của lỗi kế toán.',
  },
  {
    id: 'p5-0012',
    part: 5,
    section: 'reading',
    difficulty: 3,
    tags: ['word-form', 'noun'],
    prompt: 'The success of the campaign depended largely on the ______ of the sales team.',
    choices: [
      { letter: 'A', text: 'dedicate' },
      { letter: 'B', text: 'dedicated' },
      { letter: 'C', text: 'dedication' },
      { letter: 'D', text: 'dedicating' },
    ],
    answer: 'C',
    explanation:
      'Sau "the" và trước "of the sales team" cần một danh từ → C ("dedication", sự tận tâm) đúng. ' +
      'A sai vì "dedicate" là động từ nguyên mẫu. ' +
      'B sai vì "dedicated" là tính từ, không đứng sau "the … of". ' +
      'D sai vì "dedicating" là V-ing, không tạo thành cụm danh từ đúng ở vị trí này.',
    translation: 'Sự thành công của chiến dịch phụ thuộc phần lớn vào sự tận tâm của đội ngũ kinh doanh.',
  },
  {
    id: 'p5-0013',
    part: 5,
    section: 'reading',
    difficulty: 2,
    tags: ['preposition', 'time'],
    prompt: 'The shipment is expected to arrive ______ the morning of March 12.',
    choices: [
      { letter: 'A', text: 'at' },
      { letter: 'B', text: 'in' },
      { letter: 'C', text: 'on' },
      { letter: 'D', text: 'by' },
    ],
    answer: 'C',
    explanation:
      'Trước một ngày cụ thể ("the morning of March 12") dùng giới từ "on" → C đúng. ' +
      'A sai vì "at" dùng cho giờ chính xác (at 9 a.m.). ' +
      'B sai vì "in" dùng cho buổi nói chung hoặc tháng/năm (in the morning, in March), không dùng khi buổi đó bị ' +
      'giới hạn bởi một ngày cụ thể. ' +
      'D sai vì "by" nghĩa là "trước mốc thời gian", khác nghĩa với câu này.',
    translation: 'Lô hàng dự kiến đến vào buổi sáng ngày 12 tháng 3.',
  },
  {
    id: 'p5-0014',
    part: 5,
    section: 'reading',
    difficulty: 3,
    tags: ['result-clause', 'adverb'],
    prompt: 'Demand for the new model was ______ high that the factory added a second shift.',
    choices: [
      { letter: 'A', text: 'very' },
      { letter: 'B', text: 'too' },
      { letter: 'C', text: 'so' },
      { letter: 'D', text: 'such' },
    ],
    answer: 'C',
    explanation:
      'Cấu trúc chỉ kết quả "so + tính từ/trạng từ + that + mệnh đề" → C ("so high that…") đúng. ' +
      'A sai vì "very" không tạo được cấu trúc với "that". ' +
      'B sai vì "too" đi theo cấu trúc "too + adj + to + V" (quá … để làm gì), không dùng với "that". ' +
      'D sai vì "such" phải đứng trước cụm danh từ (such high demand that…), không đứng trước tính từ đơn "high".',
    translation: 'Nhu cầu với mẫu xe mới cao đến mức nhà máy phải thêm một ca làm việc.',
  },
  {
    id: 'p5-0015',
    part: 5,
    section: 'reading',
    difficulty: 3,
    tags: ['gerund', 'preposition'],
    prompt: 'The department is responsible for ______ that all invoices are filed correctly.',
    choices: [
      { letter: 'A', text: 'ensure' },
      { letter: 'B', text: 'ensuring' },
      { letter: 'C', text: 'ensured' },
      { letter: 'D', text: 'to ensure' },
    ],
    answer: 'B',
    explanation:
      'Sau giới từ "for" phải dùng danh động từ (V-ing) → B ("ensuring") đúng. ' +
      'A sai vì động từ nguyên mẫu không đứng sau giới từ. ' +
      'C sai vì "ensured" là V3/quá khứ, không hợp sau giới từ. ' +
      'D sai vì "to + V" chỉ dùng sau một số tính từ hoặc động từ nhất định, không dùng sau giới từ.',
    translation: 'Bộ phận này chịu trách nhiệm đảm bảo mọi hoá đơn được lưu đúng cách.',
  },
  {
    id: 'p5-0016',
    part: 5,
    section: 'reading',
    difficulty: 3,
    tags: ['conditional', 'tense'],
    prompt: 'If the client ______ the revised quotation by Friday, we will begin production on Monday.',
    choices: [
      { letter: 'A', text: 'approves' },
      { letter: 'B', text: 'will approve' },
      { letter: 'C', text: 'approved' },
      { letter: 'D', text: 'would approve' },
    ],
    answer: 'A',
    explanation:
      'Câu điều kiện loại 1: mệnh đề "if" dùng hiện tại đơn, mệnh đề chính dùng "will + V". Mệnh đề chính đã có ' +
      '"will begin" nên chỗ trống phải là "approves" → A đúng. ' +
      'B sai vì không dùng "will" trong mệnh đề "if". ' +
      'C sai vì "approved" đưa câu sang điều kiện loại 2/3, không khớp với "will begin". ' +
      'D sai vì "would approve" cũng thuộc điều kiện loại 2/3, không đi với "will begin".',
    translation: 'Nếu khách hàng duyệt báo giá sửa đổi trước thứ Sáu, chúng ta sẽ bắt đầu sản xuất vào thứ Hai.',
  },
  {
    id: 'p5-0017',
    part: 5,
    section: 'reading',
    difficulty: 5,
    tags: ['vocabulary', 'collocation'],
    prompt: 'The two proposals are similar in cost, but only one is ______ with our long-term strategy.',
    choices: [
      { letter: 'A', text: 'consistent' },
      { letter: 'B', text: 'persistent' },
      { letter: 'C', text: 'insistent' },
      { letter: 'D', text: 'resistant' },
    ],
    answer: 'A',
    explanation:
      '"Be consistent with something" nghĩa là phù hợp, nhất quán với cái gì → A đúng cả nghĩa và giới từ. ' +
      'B sai vì "persistent" (kiên trì) đi với "in", tạo cụm "persistent with" không chuẩn. ' +
      'C sai vì "insistent" (khăng khăng) đi với "on" hoặc "that", không đi với "with". ' +
      'D sai vì "resistant" (kháng lại) đi với "to", nghĩa hoàn toàn trái với câu.',
    translation: 'Hai đề xuất tương đương về chi phí, nhưng chỉ một đề xuất phù hợp với chiến lược dài hạn của chúng ta.',
  },
  {
    id: 'p5-0018',
    part: 5,
    section: 'reading',
    difficulty: 3,
    tags: ['comparative', 'degree-adverb'],
    prompt: 'The new branch is ______ larger than the one it replaced.',
    choices: [
      { letter: 'A', text: 'very' },
      { letter: 'B', text: 'much' },
      { letter: 'C', text: 'too' },
      { letter: 'D', text: 'so' },
    ],
    answer: 'B',
    explanation:
      'Trước dạng so sánh hơn "larger" cần từ nhấn mạnh dùng được với so sánh hơn như "much", "far", "a lot" → B đúng. ' +
      'A sai vì "very" chỉ bổ nghĩa cho tính từ nguyên cấp (very large), không đi với so sánh hơn. ' +
      'C sai vì "too" nghĩa là "quá", mang nghĩa tiêu cực và không đứng trước "larger than" theo cách này. ' +
      'D sai vì "so" không dùng để nhấn mạnh so sánh hơn trong câu trần thuật.',
    translation: 'Chi nhánh mới lớn hơn nhiều so với chi nhánh mà nó thay thế.',
  },
  {
    id: 'p5-0019',
    part: 5,
    section: 'reading',
    difficulty: 4,
    tags: ['word-form', 'connector'],
    prompt: 'Applications submitted after the deadline will not be considered, ______ of the reason.',
    choices: [
      { letter: 'A', text: 'regard' },
      { letter: 'B', text: 'regarding' },
      { letter: 'C', text: 'regardless' },
      { letter: 'D', text: 'regarded' },
    ],
    answer: 'C',
    explanation:
      '"Regardless of + danh từ" là cụm cố định nghĩa là bất kể, không xét đến → C đúng. ' +
      'A sai vì "regard" là động từ/danh từ, không tạo thành cụm "… of the reason". ' +
      'B sai vì "regarding" là giới từ nghĩa "về việc", không hợp nghĩa câu này. ' +
      'D sai vì "regarded" là V3, không đứng trước "of" theo cấu trúc này.',
    translation: 'Đơn nộp sau hạn chót sẽ không được xem xét, bất kể lý do là gì.',
  },
  {
    id: 'p5-0020',
    part: 5,
    section: 'reading',
    difficulty: 5,
    tags: ['participle', 'reduced-clause'],
    prompt: '______ with the results of the pilot program, the committee approved a full rollout.',
    choices: [
      { letter: 'A', text: 'Satisfying' },
      { letter: 'B', text: 'Satisfied' },
      { letter: 'C', text: 'Satisfaction' },
      { letter: 'D', text: 'Satisfy' },
    ],
    answer: 'B',
    explanation:
      'Chủ ngữ của mệnh đề chính là "the committee" — uỷ ban CẢM THẤY hài lòng, nên dùng phân từ quá khứ ' +
      'mang nghĩa bị động/tự thân: "Satisfied with…" → B đúng. ' +
      'A sai vì "Satisfying" là phân từ hiện tại mang nghĩa chủ động (làm hài lòng ai đó), ở đây sẽ hiểu sai thành ' +
      '"uỷ ban làm hài lòng kết quả". ' +
      'C sai vì "Satisfaction" là danh từ, không mở đầu cụm rút gọn được. ' +
      'D sai vì "Satisfy" là động từ nguyên mẫu, không đứng đầu câu làm trạng ngữ.',
    translation: 'Hài lòng với kết quả của chương trình thí điểm, uỷ ban đã phê duyệt triển khai toàn bộ.',
  },
]
