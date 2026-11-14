import type { Question, Stimulus } from '../types'

/**
 * PART 6 — Điền từ vào đoạn văn (2 đoạn × 4 câu = 8 câu).
 *
 * Mỗi stimulus có đúng một `passage` với bốn chỗ trống đánh số (1)–(4) ngay trong văn bản.
 * Câu hỏi thứ tư của đoạn 2 là dạng chèn câu (sentence insertion) — dạng câu có thật trong đề thi.
 */
export const PART6_STIMULI: Stimulus[] = [
  {
    id: 'g-p6-0001',
    part: 6,
    passages: [
      {
        label: 'Thông báo nội bộ (Memorandum)',
        text:
          'MEMORANDUM\n' +
          'To: All staff, Operations Division\n' +
          'From: Facilities Office\n' +
          'Subject: Relocation to the Eastgate Building\n\n' +
          'As announced last month, our division will move to the Eastgate Building on 1 June. ' +
          'The move was originally (1) ______ for April, but the landlord needed extra time to finish ' +
          'the renovations on the fourth floor.\n\n' +
          'Staff are asked to pack personal belongings in the boxes that will be delivered to each floor ' +
          'on 27 May. Please label every box (2) ______ your name and desk number. Items that are still ' +
          'unpacked at the end of that day will be moved by the relocation company at the owner\u2019s risk.\n\n' +
          'The new offices are on the fourth floor, (3) ______ is connected to the main building by a covered ' +
          'walkway. Because the floor is smaller than our current space, some teams will share meeting areas. ' +
          'A detailed floor plan is available on the intranet.\n\n' +
          'We appreciate your patience during this transition and will keep you (4) ______ of any further ' +
          'changes as the moving date approaches.',
      },
    ],
  },
  {
    id: 'g-p6-0002',
    part: 6,
    passages: [
      {
        label: 'Email nội bộ',
        text:
          'From: Training Department\n' +
          'To: All sales staff\n' +
          'Subject: Advanced Negotiation Workshop\n\n' +
          'Dear colleagues,\n\n' +
          'The advanced negotiation workshop will take place on 18 September in the Maple Room. This year we ' +
          'have invited Ms. Hanako Ishida, a consultant who has advised several international retailers, ' +
          'to lead the session.\n\n' +
          'Because the workshop involves group exercises, attendance is limited to twenty people. Places will ' +
          'be allocated on a first-come, first-served (1) ______, so please register early.\n\n' +
          'Participants should bring a laptop and a copy of their current price list. The workshop ' +
          '(2) ______ entirely in English, and each participant will be asked to present a short negotiation ' +
          'case in pairs.\n\n' +
          'Anyone who has attended a similar course in the past two years does not need to (3) ______ the ' +
          'morning session again, although you are welcome to join the afternoon discussion.\n\n' +
          'Please confirm your attendance by Friday so that we can order enough materials for everyone. ' +
          '(4) ______\n\n' +
          'Best regards,\nTraining Department',
      },
    ],
  },
]

export const PART6_QUESTIONS: Question[] = [
  // ---------- Đoạn 1: thông báo chuyển văn phòng ----------
  {
    id: 'p6-0001',
    part: 6,
    section: 'reading',
    difficulty: 2,
    tags: ['word-form', 'passive-voice'],
    stimulusId: 'g-p6-0001',
    prompt: 'Which word best completes blank (1)?',
    choices: [
      { letter: 'A', text: 'scheduling' },
      { letter: 'B', text: 'schedules' },
      { letter: 'C', text: 'schedule' },
      { letter: 'D', text: 'scheduled' },
    ],
    answer: 'D',
    explanation:
      'Câu bị động "The move was originally ______ for April": sau "was" cần quá khứ phân từ (V3) → D ' +
      '("scheduled", được lên lịch) là đúng. ' +
      'C là động từ nguyên mẫu, không đứng sau "was"; ' +
      'A là V-ing, chỉ dùng trong thì tiếp diễn chứ không mang nghĩa bị động ở đây; ' +
      'B chia ngôi thứ ba số ít, không hợp với "The move was".',
    translation:
      'Việc chuyển văn phòng ban đầu được lên lịch vào tháng Tư, nhưng chủ toà nhà cần thêm thời gian ' +
      'hoàn thiện việc cải tạo tầng bốn.',
  },
  {
    id: 'p6-0002',
    part: 6,
    section: 'reading',
    difficulty: 2,
    tags: ['preposition', 'collocation'],
    stimulusId: 'g-p6-0001',
    prompt: 'Which word best completes blank (2)?',
    choices: [
      { letter: 'A', text: 'by' },
      { letter: 'B', text: 'at' },
      { letter: 'C', text: 'of' },
      { letter: 'D', text: 'with' },
    ],
    answer: 'D',
    explanation:
      'Cấu trúc "label something with something" — ghi nhãn cái gì BẰNG cái gì → "label every box with your ' +
      'name and desk number" là đúng, nên D. ' +
      'A sai vì "by" dùng cho phương thức hoặc tác nhân (labelled by hand), không hợp ở đây. ' +
      'B sai vì "at" chỉ địa điểm hoặc thời điểm. ' +
      'C sai vì "of" chỉ sở hữu hoặc thành phần, không tạo ra cụm đúng nghĩa.',
    translation: 'Vui lòng ghi nhãn mỗi thùng bằng tên và số bàn làm việc của bạn.',
  },
  {
    id: 'p6-0003',
    part: 6,
    section: 'reading',
    difficulty: 3,
    tags: ['relative-pronoun', 'adjective-clause'],
    stimulusId: 'g-p6-0001',
    prompt: 'Which word best completes blank (3)?',
    choices: [
      { letter: 'A', text: 'that' },
      { letter: 'B', text: 'which' },
      { letter: 'C', text: 'where' },
      { letter: 'D', text: 'what' },
    ],
    answer: 'B',
    explanation:
      'Đây là mệnh đề quan hệ không xác định (non-defining), đứng sau dấu phẩy và bổ sung thông tin cho ' +
      '"the fourth floor", nên phải dùng "which" → B đúng. ' +
      'A sai vì "that" không bao giờ đứng sau dấu phẩy trong mệnh đề quan hệ không xác định. ' +
      'C sai vì "where" thay cho trạng ngữ chỉ nơi chốn, nhưng ở đây nó phải làm CHỦ NGỮ của "is connected". ' +
      'D sai vì "what" không có tiền từ (antecedent) đứng trước nên không dùng được.',
    translation: 'Văn phòng mới nằm ở tầng bốn, tầng này được nối với toà nhà chính bằng một lối đi có mái che.',
  },
  {
    id: 'p6-0004',
    part: 6,
    section: 'reading',
    difficulty: 3,
    tags: ['collocation', 'participle'],
    stimulusId: 'g-p6-0001',
    prompt: 'Which word best completes blank (4)?',
    choices: [
      { letter: 'A', text: 'inform' },
      { letter: 'B', text: 'informing' },
      { letter: 'C', text: 'informed' },
      { letter: 'D', text: 'information' },
    ],
    answer: 'C',
    explanation:
      'Cụm cố định "keep somebody informed of something" — luôn giữ ai đó được biết thông tin → cần quá khứ ' +
      'phân từ "informed" → C đúng. ' +
      'A là động từ nguyên mẫu, không đứng sau "keep you"; ' +
      'B là V-ing, tạo nghĩa sai ("giữ bạn đang thông báo"); ' +
      'D là danh từ, không đứng sau "keep you" trong cấu trúc này.',
    translation:
      'Chúng tôi cảm ơn sự kiên nhẫn của bạn trong thời gian chuyển giao này và sẽ luôn thông báo cho bạn ' +
      'mọi thay đổi khi ngày chuyển đi gần kề.',
  },

  // ---------- Đoạn 2: email về buổi đào tạo ----------
  {
    id: 'p6-0005',
    part: 6,
    section: 'reading',
    difficulty: 3,
    tags: ['noun-phrase', 'idiom'],
    stimulusId: 'g-p6-0002',
    prompt: 'Which word best completes blank (1)?',
    choices: [
      { letter: 'A', text: 'based' },
      { letter: 'B', text: 'basically' },
      { letter: 'C', text: 'basis' },
      { letter: 'D', text: 'base' },
    ],
    answer: 'C',
    explanation:
      'Cụm thành ngữ "on a first-come, first-served basis" (theo nguyên tắc đến trước được phục vụ trước) luôn ' +
      'dùng danh từ "basis" → C đúng. ' +
      'D sai vì "base" mang nghĩa khác (căn cứ, nền) và không xuất hiện trong cụm này. ' +
      'A sai vì "based" là tính từ/V3, không đứng sau mạo từ "a". ' +
      'B sai vì "basically" là trạng từ, cũng không thể đứng sau "a".',
    translation:
      'Vì buổi đào tạo có các bài tập nhóm, số người tham dự giới hạn ở hai mươi. Suất được phân bổ theo ' +
      'nguyên tắc ai đăng ký trước được nhận trước, nên hãy đăng ký sớm.',
  },
  {
    id: 'p6-0006',
    part: 6,
    section: 'reading',
    difficulty: 2,
    tags: ['passive-voice', 'future'],
    stimulusId: 'g-p6-0002',
    prompt: 'Which word best completes blank (2)?',
    choices: [
      { letter: 'A', text: 'will conduct' },
      { letter: 'B', text: 'will be conducted' },
      { letter: 'C', text: 'will be conducting' },
      { letter: 'D', text: 'has conducted' },
    ],
    answer: 'B',
    explanation:
      'Chủ ngữ "The workshop" không tự tiến hành mà ĐƯỢC tiến hành, nên cần bị động tương lai ' +
      '"will be + V3" → B ("will be conducted") đúng. ' +
      'A là chủ động kép sai cấu trúc; C là tương lai tiếp diễn chủ động ("will be conducting" = sẽ đang tự tiến hành) — ' +
      'cả hai đều mâu thuẫn với nghĩa "buổi đào tạo được tiến hành"; ' +
      'D ở thì hiện tại hoàn thành, không khớp với sự kiện chưa diễn ra trong tương lai.',
    translation: 'Buổi đào tạo sẽ được tiến hành hoàn toàn bằng tiếng Anh, và mỗi người tham dự sẽ phải trình bày một tình huống đàm phán ngắn theo cặp.',
  },
  {
    id: 'p6-0007',
    part: 6,
    section: 'reading',
    difficulty: 2,
    tags: ['verb-form', 'modal-verb'],
    stimulusId: 'g-p6-0002',
    prompt: 'Which word best completes blank (3)?',
    choices: [
      { letter: 'A', text: 'attend' },
      { letter: 'B', text: 'attending' },
      { letter: 'C', text: 'attendance' },
      { letter: 'D', text: 'attended' },
    ],
    answer: 'A',
    explanation:
      'Sau "does not need to" phải là động từ nguyên mẫu không "to" → A ("attend") đúng. ' +
      'B là V-ing, không đứng sau "to" trong cấu trúc này; ' +
      'C là danh từ nên không thể nhận tân ngữ "the morning session"; ' +
      'D là V3, chỉ dùng trong thì hoàn thành hoặc bị động.',
    translation:
      'Ai đã tham dự một khoá tương tự trong hai năm qua thì không cần tham dự lại buổi sáng, ' +
      'tuy nhiên vẫn được hoan nghênh tham gia phần thảo luận buổi chiều.',
  },
  {
    id: 'p6-0008',
    part: 6,
    section: 'reading',
    difficulty: 4,
    tags: ['sentence-insertion', 'coherence'],
    stimulusId: 'g-p6-0002',
    prompt: 'Which sentence best fits blank (4)?',
    choices: [
      { letter: 'A', text: 'We look forward to seeing you there.' },
      { letter: 'B', text: 'The materials were ordered last month.' },
      { letter: 'C', text: 'Unfortunately, the workshop has been cancelled.' },
      { letter: 'D', text: 'Please return your laptop to the IT desk.' },
    ],
    answer: 'A',
    explanation:
      'Chỗ trống nằm ở cuối email, ngay sau lời nhờ xác nhận tham dự, nên cần một câu kết thân thiện → A phù hợp. ' +
      'B mâu thuẫn với câu ngay trước: tài liệu còn phải đặt SAU khi biết số người, nên không thể "đã đặt từ tháng trước"; ' +
      'C trái hoàn toàn với nội dung thông báo về một buổi đào tạo sắp diễn ra; ' +
      'D mâu thuẫn với yêu cầu "Participants should bring a laptop".',
    translation:
      'Vui lòng xác nhận việc tham dự trước thứ Sáu để chúng tôi đặt đủ tài liệu cho mọi người. ' +
      'Rất mong gặp bạn ở đó.',
  },
]
