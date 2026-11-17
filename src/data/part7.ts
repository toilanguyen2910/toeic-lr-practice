import type { Question, Stimulus } from '../types'
import { PART7B_QUESTIONS, PART7B_STIMULI } from './part7b'
import { PART7C_QUESTIONS, PART7C_STIMULI } from './part7c'

/**
 * PART 7 — Đọc hiểu (4 nhóm × 4 câu = 16 câu).
 *
 * - Nhóm 1: thông báo nội bộ (single passage).
 * - Nhóm 2: email + bảng giá (DOUBLE passage — câu hỏi buộc phải đọc cả hai văn bản).
 * - Nhóm 3: bài báo ngắn (single passage).
 * - Nhóm 4: email khiếu nại + bảng theo dõi đơn hàng (DOUBLE passage).
 *
 * Mỗi nhóm 4 câu theo cấu trúc: main topic → chi tiết → suy luận → câu hỏi tổng hợp.
 */
const PART7_BASE_STIMULI: Stimulus[] = [
  {
    id: 'g-p7-0001',
    part: 7,
    passages: [
      {
        label: 'Thông báo (Notice)',
        text:
          'NOTICE TO ALL RESIDENTS OF HARBOR VIEW TOWERS\n\n' +
          'Beginning on 15 October, the building management will carry out repairs to the water pipes on ' +
          'floors 3 through 8. Work will take place on weekdays between 9 a.m. and 4 p.m. and is expected ' +
          'to last approximately three weeks.\n\n' +
          'During this period, running water will be unavailable in the affected apartments for short ' +
          'periods, normally no longer than two hours at a time. The building will announce each interruption ' +
          'at least twenty-four hours in advance through the notice board in the lobby and the residents\' ' +
          'mobile app.\n\n' +
          'We recommend that residents on these floors store enough water for drinking and cooking in advance. ' +
          'The shared laundry room in the basement is not affected and will remain open as usual.\n\n' +
          'Residents who are unable to be at home during the day may leave a spare key with the concierge ' +
          'desk so that technicians can enter. Please note that the management cannot accept responsibility ' +
          'for valuables left in the apartments.\n\n' +
          'We thank you for your cooperation. Questions may be directed to the management office at extension 30.',
      },
    ],
  },
  {
    id: 'g-p7-0002',
    part: 7,
    passages: [
      {
        label: 'Email',
        text:
          'To: orders@northwindprint.com\n' +
          'From: ryu.ito@brightleafcafe.com\n' +
          'Subject: Order for printed menus\n\n' +
          'Hello,\n\n' +
          'I run a small cafe in the Harbor View neighborhood that will be expanding to a second location next ' +
          'month. I would like to order printed menus for both locations and I am writing to check a few details ' +
          'before I place the order.\n\n' +
          'Based on your price list, I plan to order 500 standard menus and 200 of the laminated version, since ' +
          'the outdoor seating area tends to get wet in the rainy season. Could you confirm whether the laminated ' +
          'menus are waterproof and whether the prices include delivery to the second-floor address?\n\n' +
          'My current logo is only available as a low-resolution image. Could your designer recreate it in a ' +
          'higher resolution, or would I need to supply a new file?\n\n' +
          'I would also like to know how long the whole order usually takes, as I hope to have everything ready ' +
          'for the opening on the tenth of next month.\n\n' +
          'Thank you for your help.\n\n' +
          'Ryu Ito\nBright Leaf Cafe',
      },
      {
        label: 'Bảng giá (Price list)',
        text:
          'NORTHWIND PRINTING — MENU PRICE LIST\n' +
          'All prices are per unit unless stated otherwise.\n\n' +
          'Standard menu (single sheet, full color): $1.20 each; $1.00 each for orders of 500 or more\n' +
          'Laminated menu (double-sided, waterproof): $2.40 each; $2.10 each for orders of 200 or more\n' +
          'Custom logo design: $75 flat fee (one logo; two revisions included)\n' +
          'Logo cleanup from a low-resolution file: $40 flat fee\n\n' +
          'Delivery: $25 within the city center; free for orders over $500\n' +
          'Standard production time: 7 business days from approval of the final proof\n' +
          'Rush production: 3 business days, plus 30% of the order total\n' +
          'Payment: 50% deposit required before production begins',
      },
    ],
  },
  {
    id: 'g-p7-0003',
    part: 7,
    passages: [
      {
        label: 'Bài báo (Newspaper article)',
        text:
          'CITY LIBRARY EXPANDS WEEKEND HOURS AFTER RECORD VISITS\n\n' +
          'The Crestline City Library welcomed 48,000 visitors last year, its highest figure since the building ' +
          'opened in 1998 and a 22 percent increase over the previous year. Library director Amara Diallo ' +
          'attributes the rise to two changes introduced in the spring: a renovation that added a children\'s ' +
          'wing and a partnership with local schools that brings classes in for weekly research sessions.\n\n' +
          '"The building was simply too small for what the community wanted to do in it," Diallo said. ' +
          '"Families were coming in on Saturday mornings and there was nowhere for them to sit."\n\n' +
          'Starting next month, the library will open at nine on Saturday mornings instead of ten, and will ' +
          'remain open until seven in the evening on Sundays. Diallo said the extension will cost roughly ' +
          '$18,000 a year in staff wages, funded by a grant from a local foundation rather than from the city ' +
          'budget.\n\n' +
          'Not everyone is enthusiastic. Council member Peter Yates questioned whether the extra hours would ' +
          'attract enough visitors to justify the expense, pointing out that Sunday afternoons are already ' +
          'the library\'s quietest period. Diallo countered that weekend visits have grown faster than weekday ' +
          'visits for three years running.',
      },
    ],
  },
  {
    id: 'g-p7-0004',
    part: 7,
    passages: [
      {
        label: 'Email khiếu nại',
        text:
          'To: service@taylorfurniture.com\n' +
          'From: dana.brooks@meridianstudio.com\n' +
          'Date: 4 November\n' +
          'Subject: Damaged desk and missing assembly kit — order 88214\n\n' +
          'Dear Customer Service,\n\n' +
          'On 28 October I received order 88214, which included one walnut standing desk and one steel ' +
          'bookshelf. The bookshelf arrived in perfect condition, but the desk has a deep scratch across the ' +
          'top surface, and the assembly kit (screws and hex key) was missing from the box.\n\n' +
          'I called your service line the same afternoon and spoke with an agent who promised that a ' +
          'replacement top and a new assembly kit would be dispatched within two business days. As of today, ' +
          'nothing has arrived and I have received no further update.\n\n' +
          'I need the desk in working order before 12 November, when our new employees start. If the parts ' +
          'cannot be delivered by then, please let me know what alternatives you can offer.\n\n' +
          'Regards,\nDana Brooks\nMeridian Studio',
      },
      {
        label: 'Bảng theo dõi đơn hàng (Order tracking)',
        text:
          'TAYLOR FURNITURE — CUSTOMER SERVICE LOG\n' +
          'Order 88214 — Dana Brooks, Meridian Studio\n\n' +
          '28 Oct — Delivered. Customer called: scratch on desk top; assembly kit missing.\n' +
          '28 Oct — Replacement request created (case 4471). Agent: L. Marsh.\n' +
          '29 Oct — Warehouse confirmed a replacement top is in stock; assembly kits are back-ordered ' +
          'until 14 Nov.\n' +
          '30 Oct — Note added: customer offered a $60 partial refund OR a free assembly service visit if she ' +
          'agrees to keep the scratched top. No reply received.\n' +
          '3 Nov — Dispatch of replacement top placed on hold pending customer response.\n\n' +
          'Standard policy: replacement parts ship within two business days when in stock.',
      },
    ],
  },
]

const PART7_BASE_QUESTIONS: Question[] = [
  // ---------- Nhóm 1: thông báo sửa ống nước ----------
  {
    id: 'p7-0001',
    part: 7,
    section: 'reading',
    difficulty: 2,
    tags: ['main-topic', 'notice'],
    stimulusId: 'g-p7-0001',
    prompt: 'What is the purpose of the notice?',
    choices: [
      { letter: 'A', text: 'To inform residents about upcoming water pipe repairs' },
      { letter: 'B', text: 'To announce a change in the building management company' },
      { letter: 'C', text: 'To ask residents to pay for a new laundry room' },
      { letter: 'D', text: 'To advertise apartments that are available for rent' },
    ],
    answer: 'A',
    explanation:
      'Câu đầu thông báo nói rõ "the building management will carry out repairs to the water pipes on floors 3 ' +
      'through 8" và phần còn lại hướng dẫn cách chuẩn bị — mục đích là thông báo về việc sửa ống nước, nên A đúng. ' +
      'B sai vì không có công ty quản lý mới nào được giới thiệu. ' +
      'C sai vì phòng giặt chung không bị ảnh hưởng và không ai phải trả tiền cho nó. ' +
      'D sai vì thông báo dành cho cư dân hiện tại, không mời thuê nhà.',
    translation:
      'Mục đích của thông báo là gì? — Thông báo cho cư dân về việc sắp sửa đường ống nước. ' +
      '(Ban quản lý sẽ sửa ống nước tầng 3 đến tầng 8 từ ngày 15 tháng 10, kéo dài khoảng ba tuần.)',
  },
  {
    id: 'p7-0002',
    part: 7,
    section: 'reading',
    difficulty: 3,
    tags: ['detail', 'negative-fact'],
    stimulusId: 'g-p7-0001',
    prompt: 'According to the notice, what will NOT be affected by the repairs?',
    choices: [
      { letter: 'A', text: 'The laundry room in the basement' },
      { letter: 'B', text: 'The notice board in the lobby' },
      { letter: 'C', text: 'The residents\' mobile app' },
      { letter: 'D', text: 'The water supply in the apartments' },
    ],
    answer: 'A',
    explanation:
      'Thông báo nói: "The shared laundry room in the basement is not affected and will remain open as usual" — nên A đúng. ' +
      'D sai vì nước sinh hoạt bị ngắt ngắn hạn, đó chính là ảnh hưởng chính. ' +
      'B và C đều là kênh được dùng để thông báo về các lần ngắt nước, tức chịu ảnh hưởng của đợt sửa chữa này theo nghĩa phải phục vụ việc thông báo.',
    translation:
      'Theo thông báo, điều gì sẽ KHÔNG bị ảnh hưởng bởi việc sửa chữa? — Phòng giặt chung ở tầng hầm. ' +
      '("Phòng giặt chung dưới tầng hầm không bị ảnh hưởng và vẫn mở cửa như thường lệ.")',
  },
  {
    id: 'p7-0003',
    part: 7,
    section: 'reading',
    difficulty: 3,
    tags: ['inference', 'detail'],
    stimulusId: 'g-p7-0001',
    prompt: 'What can residents who will be away during the day do?',
    choices: [
      { letter: 'A', text: 'Request that the work be done at a later date' },
      { letter: 'B', text: 'Turn off the water supply in their apartment themselves' },
      { letter: 'C', text: 'Ask a neighbor on a lower floor to let the technicians in' },
      { letter: 'D', text: 'Leave a spare key with the concierge desk' },
    ],
    answer: 'D',
    explanation:
      'Thông báo hướng dẫn: "Residents who are unable to be at home during the day may leave a spare key with ' +
      'the concierge desk so that technicians can enter" → D đúng. ' +
      'C sai vì nhờ hàng xóm không phải phương án được nêu, và thông báo chỉ nói tới quầy lễ tân. ' +
      'A sai vì thông báo không cho phép dời lịch sửa chữa. ' +
      'B sai vì việc ngắt nước do ban quản lý thực hiện, không phải cư dân tự làm.',
    translation:
      'Cư dân vắng nhà ban ngày có thể làm gì? — Gửi chìa khoá dự phòng ở quầy lễ tân.',
  },
  {
    id: 'p7-0004',
    part: 7,
    section: 'reading',
    difficulty: 4,
    tags: ['inference', 'notification'],
    stimulusId: 'g-p7-0001',
    prompt: 'What can be inferred about how residents will learn of each water interruption?',
    choices: [
      { letter: 'A', text: 'They will be notified at least one day before it happens.' },
      { letter: 'B', text: 'They will hear an announcement in the lobby at the time of the interruption.' },
      { letter: 'C', text: 'They must check the laundry room schedule each morning.' },
      { letter: 'D', text: 'They will receive the information only after the work is complete.' },
    ],
    answer: 'A',
    explanation:
      'Thông báo cam kết sẽ thông báo "at least twenty-four hours in advance" — ít nhất 24 giờ, tức một ngày trước khi ngắt nước → A đúng. ' +
      'B sai vì bảng tin và ứng dụng được dùng để THÔNG BÁO TRƯỚC, không phải loa phát tại thời điểm ngắt nước. ' +
      'C sai vì lịch phòng giặt không liên quan và phòng giặt không bị ảnh hưởng. ' +
      'D sai vì mục đích của việc thông báo trước là để cư dân kịp trữ nước, rõ ràng không phải thông báo sau khi xong việc.',
    translation:
      'Có thể suy ra điều gì về cách cư dân biết mỗi lần ngắt nước? — Họ sẽ được thông báo ít nhất một ngày trước khi việc đó xảy ra.',
  },

  // ---------- Nhóm 2: email đặt in menu + bảng giá (hai đoạn) ----------
  {
    id: 'p7-0005',
    part: 7,
    section: 'reading',
    difficulty: 3,
    tags: ['main-topic', 'purpose'],
    stimulusId: 'g-p7-0002',
    prompt: 'Why did Mr. Ito write the email?',
    choices: [
      { letter: 'A', text: 'To complain about a late delivery' },
      { letter: 'B', text: 'To apply for a job as a graphic designer' },
      { letter: 'C', text: 'To request a refund for damaged menus' },
      { letter: 'D', text: 'To ask questions before placing a printing order' },
    ],
    answer: 'D',
    explanation:
      'Ông ấy viết: "I am writing to check a few details before I place the order", rồi nêu các câu hỏi về chất liệu, ' +
      'giao hàng và thời gian hoàn thành — nên D đúng. ' +
      'C sai vì chưa có đơn hàng nào được giao; ông ấy mới đang chuẩn bị đặt. ' +
      'A sai vì không có lời phàn nàn nào về giao hàng chậm. ' +
      'B sai vì ông ấy hỏi dịch vụ thiết kế logo, không xin việc.',
    translation:
      'Vì sao ông Ito viết email? — Để hỏi vài điều trước khi đặt đơn in.',
  },
  {
    id: 'p7-0006',
    part: 7,
    section: 'reading',
    difficulty: 4,
    tags: ['cross-reference', 'detail'],
    stimulusId: 'g-p7-0002',
    prompt: 'What is the total unit price Mr. Ito will pay for the 500 standard menus?',
    choices: [
      { letter: 'A', text: '$2.40 each' },
      { letter: 'B', text: '$1.20 each' },
      { letter: 'C', text: '$1.00 each' },
      { letter: 'D', text: '$2.10 each' },
    ],
    answer: 'C',
    explanation:
      'Bảng giá ghi: "Standard menu … $1.20 each; $1.00 each for orders of 500 or more". Ông Ito đặt đúng 500 chiếc ' +
      'nên đủ điều kiện hưởng mức giá thấp hơn → C đúng. ' +
      'B là giá cho đơn dưới 500 chiếc. ' +
      'D và A là giá của loại menu CÁN MỀM (laminated) mà ông ấy đặt riêng 200 chiếc — không áp dụng cho 500 menu thường.',
    translation:
      'Đơn giá ông Ito phải trả cho 500 menu thường là bao nhiêu? — 1,00 đô mỗi chiếc, ' +
      'vì bảng giá giảm giá cho đơn từ 500 chiếc trở lên.',
  },
  {
    id: 'p7-0007',
    part: 7,
    section: 'reading',
    difficulty: 4,
    tags: ['cross-reference', 'inference'],
    stimulusId: 'g-p7-0002',
    prompt: 'What will Mr. Ito most likely do about his logo?',
    choices: [
      { letter: 'A', text: 'Design a completely new logo himself' },
      { letter: 'B', text: 'Pay Northwind $40 to clean up his existing file' },
      { letter: 'C', text: 'Pay Northwind $75 for a custom logo design' },
      { letter: 'D', text: 'Use the menus without any logo' },
    ],
    answer: 'B',
    explanation:
      'Ông ấy nói logo hiện tại "is only available as a low-resolution image", và bảng giá có dịch vụ ' +
      '"Logo cleanup from a low-resolution file: $40" — đúng với tình huống của ông, nên B là phương án hợp lý nhất. ' +
      'A sai vì ông ấy nhờ công ty in làm giúp, không tự thiết kế. ' +
      'C sai vì dịch vụ 75 đô là thiết kế logo mới, trong khi ông ấy đã có logo và chỉ cần làm lại cho nét hơn. ' +
      'D sai vì mục đích của câu hỏi là đưa logo lên menu in.',
    translation:
      'Ông Ito nhiều khả năng sẽ làm gì với logo của mình? — Trả 40 đô cho Northwind để xử lý lại file logo hiện có. ' +
      '("Logo của tôi hiện chỉ có dưới dạng ảnh độ phân giải thấp." / "Chỉnh sửa logo từ file độ phân giải thấp: 40 đô".)',
  },
  {
    id: 'p7-0008',
    part: 7,
    section: 'reading',
    difficulty: 5,
    tags: ['cross-reference', 'calculation'],
    stimulusId: 'g-p7-0002',
    prompt: 'What is true about the delivery fee for Mr. Ito\'s order?',
    choices: [
      { letter: 'A', text: 'The delivery fee is included in the $2.10 laminated menu price.' },
      { letter: 'B', text: 'He must pay $25 because he is inside the city center.' },
      { letter: 'C', text: 'Delivery is free because his order totals more than $500.' },
      { letter: 'D', text: 'He must pay the fee twice because two locations will receive menus.' },
    ],
    answer: 'C',
    explanation:
      'Tính giá trị đơn theo bảng giá: 500 menu thường × $1.00 = $500, cộng 200 menu cán mềm × $2.10 = $420, ' +
      'tổng đã là $920 (chưa kể logo) — vượt mức $500. Bảng giá ghi "free for orders over $500", nên C đúng. ' +
      'B sai vì mức $25 chỉ áp dụng cho đơn nhỏ. ' +
      'D sai vì bảng giá chỉ nêu một mức phí giao hàng, không nói tính theo số điểm đến. ' +
      'A sai vì giá menu và phí giao hàng là hai dòng riêng trong bảng giá.',
    translation:
      'Điều gì đúng về phí giao hàng cho đơn của ông Ito? — Được miễn phí vì tổng đơn vượt 500 đô.',
  },

  // ---------- Nhóm 3: bài báo về thư viện ----------
  {
    id: 'p7-0009',
    part: 7,
    section: 'reading',
    difficulty: 2,
    tags: ['main-topic', 'article'],
    stimulusId: 'g-p7-0003',
    prompt: 'What is the article mainly about?',
    choices: [
      { letter: 'A', text: 'A library\'s plan to extend its weekend hours' },
      { letter: 'B', text: 'The construction of a completely new library' },
      { letter: 'C', text: 'A dispute between two city council members' },
      { letter: 'D', text: 'A fundraising campaign for a local school' },
    ],
    answer: 'A',
    explanation:
      'Tiêu đề bài báo là "City Library Expands Weekend Hours After Record Visits" và phần lớn nội dung xoay quanh ' +
      'việc mở cửa sớm hơn vào thứ Bảy, muộn hơn vào Chủ nhật cùng chi phí và tranh luận liên quan → A đúng. ' +
      'B sai vì toà nhà đã mở từ năm 1998, bài báo chỉ nói về một đợt cải tạo, không xây mới. ' +
      'C sai vì chỉ có một hội đồng viên lên tiếng chất vấn, không phải tranh chấp giữa hai người. ' +
      'D sai vì khoản tài trợ đến từ một quỹ địa phương, không phải chiến dịch gây quỹ cho trường học.',
    translation:
      'Bài báo chủ yếu nói về điều gì? — Kế hoạch mở cửa muộn hơn vào cuối tuần của một thư viện.',
  },
  {
    id: 'p7-0010',
    part: 7,
    section: 'reading',
    difficulty: 3,
    tags: ['detail', 'reason'],
    stimulusId: 'g-p7-0003',
    prompt: 'According to Ms. Diallo, what caused the increase in visitors?',
    choices: [
      { letter: 'A', text: 'An annual grant from a local educational foundation' },
      { letter: 'B', text: 'The longer weekend opening hours alone' },
      { letter: 'C', text: 'Lower ticket prices for city residents' },
      { letter: 'D', text: 'A new children\u2019s wing and school partnerships' },
    ],
    answer: 'D',
    explanation:
      'Bài báo viết: Diallo "attributes the rise to two changes introduced in the spring: a renovation that added ' +
      'a children\'s wing and a partnership with local schools" → D đúng. ' +
      'C sai vì thư viện công cộng không thu vé, bài báo không nhắc giá vé. ' +
      'A sai vì khoản tài trợ dùng để TRẢ cho giờ mở cửa thêm, không phải nguyên nhân tăng khách của năm trước. ' +
      'B sai vì việc mở rộng giờ chỉ bắt đầu "next month", tức chưa thể tạo ra con số 48.000 lượt của năm đã qua.',
    translation:
      'Theo bà Diallo, điều gì đã khiến lượng khách tăng? — Khu dành cho thiếu nhi mới và quan hệ hợp tác với các trường học địa phương.',
  },
  {
    id: 'p7-0011',
    part: 7,
    section: 'reading',
    difficulty: 3,
    tags: ['inference', 'detail'],
    stimulusId: 'g-p7-0003',
    prompt: 'How will the extended hours be paid for?',
    choices: [
      { letter: 'A', text: 'By raising the city budget for libraries' },
      { letter: 'B', text: 'By charging visitors on Sundays' },
      { letter: 'C', text: 'By a grant from a local foundation' },
      { letter: 'D', text: 'By reducing staff wages during the week' },
    ],
    answer: 'C',
    explanation:
      'Bài báo nói rõ khoảng $18.000 tiền lương nhân viên sẽ được "funded by a grant from a local foundation rather ' +
      'than from the city budget" → C đúng. ' +
      'A sai vì bài báo phủ định trực tiếp: khoản này KHÔNG lấy từ ngân sách thành phố. ' +
      'B sai vì không có việc thu phí vào Chủ nhật. ' +
      'D sai vì chi phí tăng thêm là trả thêm lương, không phải cắt lương ngày thường.',
    translation:
      'Giờ mở cửa tăng thêm sẽ được chi trả thế nào? — Bằng một khoản tài trợ từ quỹ địa phương.',
  },
  {
    id: 'p7-0012',
    part: 7,
    section: 'reading',
    difficulty: 5,
    tags: ['inference', 'author-attitude'],
    stimulusId: 'g-p7-0003',
    prompt: 'What is suggested about Council member Peter Yates?',
    choices: [
      { letter: 'A', text: 'He supports the plan because it is funded privately.' },
      { letter: 'B', text: 'He doubts the extra hours will attract enough visitors.' },
      { letter: 'C', text: 'He wants the library to close earlier on Sundays.' },
      { letter: 'D', text: 'He believes the children\'s wing was a waste of money.' },
    ],
    answer: 'B',
    explanation:
      'Bài báo viết Yates "questioned whether the extra hours would attract enough visitors to justify the expense" — ' +
      'ông ấy nghi ngờ hiệu quả của việc mở thêm giờ, nên B đúng. ' +
      'A sai vì ông ấy là người chất vấn, bài báo không nói ông ủng hộ kế hoạch. ' +
      'C sai vì ông ấy chỉ nêu rằng chiều Chủ nhật vốn đã vắng khách, chứ không đề nghị đóng cửa sớm hơn. ' +
      'D sai vì khu thiếu nhi không bị ông ấy phê bình; ý kiến của ông chỉ liên quan chi phí mở thêm giờ.',
    translation:
      'Có thể suy ra gì về hội đồng viên Peter Yates? — Ông ấy nghi ngờ rằng việc mở thêm giờ sẽ thu hút đủ khách.',
  },

  // ---------- Nhóm 4: email khiếu nại + nhật ký xử lý (hai đoạn) ----------
  {
    id: 'p7-0013',
    part: 7,
    section: 'reading',
    difficulty: 2,
    tags: ['detail', 'problem'],
    stimulusId: 'g-p7-0004',
    prompt: 'What problem does Ms. Brooks report?',
    choices: [
      { letter: 'A', text: 'Her order arrived three weeks late.' },
      { letter: 'B', text: 'She was charged twice for the same order.' },
      { letter: 'C', text: 'She received the wrong model of bookshelf.' },
      { letter: 'D', text: 'Her desk was scratched and the assembly kit was missing.' },
    ],
    answer: 'D',
    explanation:
      'Bà ấy viết: "the desk has a deep scratch across the top surface, and the assembly kit (screws and hex key) ' +
      'was missing from the box" → D đúng. ' +
      'C sai vì bà ấy nói rõ "The bookshelf arrived in perfect condition". ' +
      'A sai vì đơn được giao ngày 28 tháng 10 và bà ấy không phàn nàn về việc giao trễ. ' +
      'B sai vì không có vấn đề thanh toán nào được nêu.',
    translation:
      'Bà Brooks báo cáo vấn đề gì? — Bàn làm việc bị xước và bộ phụ kiện lắp ráp bị thiếu.',
  },
  {
    id: 'p7-0014',
    part: 7,
    section: 'reading',
    difficulty: 4,
    tags: ['cross-reference', 'detail'],
    stimulusId: 'g-p7-0004',
    prompt: 'According to the order tracking log, why has the replacement top not been dispatched?',
    choices: [
      { letter: 'A', text: 'The model is no longer in production.' },
      { letter: 'B', text: 'The customer has not responded to an alternative offer.' },
      { letter: 'C', text: 'The warehouse has run out of assembly kits for all orders.' },
      { letter: 'D', text: 'The delivery address was entered incorrectly.' },
    ],
    answer: 'B',
    explanation:
      'Nhật ký ghi ngày 30 tháng 10: công ty đề nghị hoàn lại 60 đô hoặc cử người đến lắp miễn phí nếu khách giữ ' +
      'mặt bàn bị xước, kèm ghi chú "No reply received"; ngày 3 tháng 11: "Dispatch of replacement top placed on ' +
      'hold pending customer response" → B đúng. ' +
      'A sai vì nhật ký xác nhận "a replacement top is in stock". ' +
      'C sai vì chỉ có bộ phụ kiện lắp ráp bị chậm về kho ("back-ordered until 14 Nov"), không phải toàn bộ đơn hàng khác. ' +
      'D sai vì không có thông tin nào về địa chỉ giao hàng sai.',
    translation:
      'Theo nhật ký theo dõi đơn hàng, vì sao mặt bàn thay thế chưa được gửi đi? — Vì khách hàng chưa phản hồi một đề nghị thay thế.',
  },
  {
    id: 'p7-0015',
    part: 7,
    section: 'reading',
    difficulty: 4,
    tags: ['inference', 'deadline'],
    stimulusId: 'g-p7-0004',
    prompt: 'What does Ms. Brooks indicate she needs?',
    choices: [
      { letter: 'A', text: 'A full refund of the entire order' },
      { letter: 'B', text: 'A different style of desk' },
      { letter: 'C', text: 'A working desk before 12 November' },
      { letter: 'D', text: 'An apology from the service agent' },
    ],
    answer: 'C',
    explanation:
      'Bà ấy viết: "I need the desk in working order before 12 November, when our new employees start" → C đúng. ' +
      'A sai vì bà ấy muốn có bàn dùng được, không đòi hoàn tiền toàn bộ đơn. ' +
      'B sai vì bà ấy không đề cập đổi sang mẫu bàn khác, chỉ hỏi về "alternatives" nếu không kịp giao. ' +
      'D sai vì lời xin lỗi không phải điều bà ấy yêu cầu; bà ấy cần giải pháp cụ thể.',
    translation:
      'Bà Brooks cho biết bà ấy cần gì? — Một chiếc bàn dùng được trước ngày 12 tháng 11.',
  },
  {
    id: 'p7-0016',
    part: 7,
    section: 'reading',
    difficulty: 5,
    tags: ['cross-reference', 'inference'],
    stimulusId: 'g-p7-0004',
    prompt: 'What is indicated about the assembly kit Ms. Brooks is waiting for?',
    choices: [
      { letter: 'A', text: 'It was included in a separate box that has already arrived.' },
      { letter: 'B', text: 'It cannot be shipped until 14 November at the earliest.' },
      { letter: 'C', text: 'It will be replaced free of charge only if she returns the desk.' },
      { letter: 'D', text: 'It was sent by express courier on 30 October.' },
    ],
    answer: 'B',
    explanation:
      'Nhật ký ngày 29 tháng 10 ghi: "assembly kits are back-ordered until 14 Nov" — bộ phụ kiện lắp ráp phải chờ ' +
      'đến 14 tháng 11 mới có hàng, nên B đúng. ' +
      'A sai vì bà ấy nói rõ bộ phụ kiện "was missing from the box", và nhật ký xác nhận đang chờ hàng về. ' +
      'C sai vì nhật ký đề nghị hoàn tiền hoặc lắp miễn phí như một lựa chọn cho mặt bàn xước, không kèm điều kiện trả lại bàn. ' +
      'D sai vì ngày 30 tháng 10 chỉ ghi nhận đề nghị với khách, không có việc gửi hàng.',
    translation:
      'Có thông tin gì về bộ phụ kiện lắp ráp mà bà Brooks đang chờ? — Sớm nhất phải đến ngày 14 tháng 11 mới có thể giao.',
  },
]
// ---- Nối phần mở rộng (p7-0017 … p7-0080) ----
export const PART7_STIMULI: Stimulus[] = [...PART7_BASE_STIMULI, ...PART7B_STIMULI, ...PART7C_STIMULI]
export const PART7_QUESTIONS: Question[] = [
  ...PART7_BASE_QUESTIONS,
  ...PART7B_QUESTIONS,
  ...PART7C_QUESTIONS,
]