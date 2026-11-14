import type { QuestionBank } from '../types'

/**
 * NGÂN HÀNG MẪU — không phải nội dung luyện thi thật.
 *
 * Mục đích duy nhất: chứng minh hợp đồng dữ liệu trong `src/types.ts` hoạt động
 * và cho phép UI/engine chạy được trước khi ngân hàng câu hỏi thật hoàn thành.
 *
 * Ngân hàng thật nằm ở `src/data/` và được ghép trong `src/data/index.ts`.
 */
export const SAMPLE_BANK: QuestionBank = {
  version: 1,
  stimuli: [
    {
      id: 'g-p1-0001',
      part: 1,
      audioScript:
        '(A) The woman is typing at her desk. (B) The woman is answering the phone. ' +
        '(C) The woman is closing the window. (D) The woman is carrying a box.',
      imageUrl: '/images/placeholder-part1.svg',
    },
    {
      id: 'g-p1-0002',
      part: 1,
      audioScript:
        '(A) The man is repairing a bicycle. (B) The man is riding a bicycle. ' +
        '(C) The man is washing a car. (D) The man is painting a wall.',
      imageUrl: '/images/placeholder-part1.svg',
    },
    {
      id: 'g-p2-0002',
      part: 2,
      audioScript: 'Have you finished the monthly inventory yet?',
    },
    {
      id: 'g-p2-0001',
      part: 2,
      audioScript: 'Where did you put the quarterly report?',
    },
    {
      id: 'g-p7-0001',
      part: 7,
      passages: [
        {
          label: 'Email',
          text:
            'To: All staff\nFrom: Human Resources\nSubject: Training session postponed\n\n' +
            'Dear colleagues,\n\n' +
            'The customer-service training session originally scheduled for Thursday, 12 March ' +
            'has been postponed until the following Tuesday because the trainer is unavailable. ' +
            'The session will still take place in Conference Room B from 9 a.m. to noon.\n\n' +
            'Please note that the pre-session reading materials have already been uploaded to ' +
            'the staff portal. All participants are expected to finish them before the new date.\n\n' +
            'Regards,\nHuman Resources',
        },
      ],
    },
  ],
  questions: [
    {
      id: 'p1-0001',
      part: 1,
      section: 'listening',
      difficulty: 2,
      tags: ['photo-description', 'present-continuous'],
      stimulusId: 'g-p1-0001',
      prompt: '',
      choices: [
        { letter: 'A', text: 'She is typing at her desk.' },
        { letter: 'B', text: 'She is answering the phone.' },
        { letter: 'C', text: 'She is closing the window.' },
        { letter: 'D', text: 'She is carrying a box.' },
      ],
      answer: 'A',
      explanation:
        'Ảnh mô tả một người phụ nữ đang gõ bàn phím tại bàn làm việc. ' +
        'Không có điện thoại, cửa sổ hay thùng hàng nào trong ảnh nên B, C, D sai.',
      translation: 'Người phụ nữ đang gõ máy tính tại bàn làm việc.',
    },
    {
      id: 'p2-0001',
      part: 2,
      section: 'listening',
      difficulty: 2,
      tags: ['wh-question', 'location'],
      stimulusId: 'g-p2-0001',
      prompt: '',
      choices: [
        { letter: 'A', text: 'In the top drawer of the filing cabinet.' },
        { letter: 'B', text: 'Yes, I did.' },
        { letter: 'C', text: 'About three hours ago.' },
      ],
      answer: 'A',
      explanation:
        'Câu hỏi dùng "Where" nên cần một câu trả lời chỉ địa điểm. ' +
        'A nêu vị trí ("In the top drawer…"). B trả lời cho câu hỏi Yes/No, ' +
        'C trả lời cho "When/How long" nên đều sai.',
      translation: 'Bạn đã để báo cáo quý ở đâu? — Trong ngăn kéo trên cùng của tủ hồ sơ.',
    },
    {
      id: 'p1-0002',
      part: 1,
      section: 'listening',
      difficulty: 2,
      tags: ['photo-description', 'present-continuous'],
      stimulusId: 'g-p1-0002',
      prompt: '',
      choices: [
        { letter: 'A', text: 'He is repairing a bicycle.' },
        { letter: 'B', text: 'He is riding a bicycle.' },
        { letter: 'C', text: 'He is washing a car.' },
        { letter: 'D', text: 'He is painting a wall.' },
      ],
      answer: 'A',
      explanation:
        'Ảnh cho thấy người đàn ông đang sửa xe đạp với dụng cụ trên tay, ' +
        'không phải đang cưỡi xe. Xe hơi và bức tường không xuất hiện trong ảnh.',
      translation: 'Người đàn ông đang sửa xe đạp.',
    },
    {
      id: 'p2-0002',
      part: 2,
      section: 'listening',
      difficulty: 2,
      tags: ['yes-no-question', 'present-perfect'],
      stimulusId: 'g-p2-0002',
      prompt: '',
      choices: [
        { letter: 'A', text: 'Not yet, I still need the figures from Sales.' },
        { letter: 'B', text: 'At the warehouse entrance.' },
        { letter: 'C', text: 'Yes, the inventory was expensive.' },
      ],
      answer: 'A',
      explanation:
        'Câu hỏi Yes/No thì trả lời trực tiếp bằng "Not yet" kèm lý do là tự nhiên nhất. ' +
        'B trả lời cho câu hỏi "Where", C lặp lại từ "inventory" nhưng không trả lời câu hỏi.',
      translation: 'Bạn đã hoàn thành kiểm kê tháng chưa? — Chưa, tôi vẫn cần số liệu từ phòng Kinh doanh.',
    },
    {
      id: 'p5-0001',
      part: 5,
      section: 'reading',
      difficulty: 2,
      tags: ['modal-verb', 'base-form'],
      prompt: 'Ms. Lee will ______ the meeting on Monday morning.',
      choices: [
        { letter: 'A', text: 'attends' },
        { letter: 'B', text: 'attend' },
        { letter: 'C', text: 'attending' },
        { letter: 'D', text: 'attendance' },
      ],
      answer: 'B',
      explanation:
        'Sau động từ khuyết thiếu "will" phải dùng động từ nguyên mẫu không "to". ' +
        'A chia ngôi thứ ba, C là V-ing, D là danh từ — cả ba đều sai.',
      translation: 'Cô Lee sẽ tham dự cuộc họp vào sáng thứ Hai.',
    },
    {
      id: 'p5-0002',
      part: 5,
      section: 'reading',
      difficulty: 3,
      tags: ['preposition', 'collocation'],
      prompt:
        'The new safety regulations apply ______ all employees, regardless of seniority.',
      choices: [
        { letter: 'A', text: 'to' },
        { letter: 'B', text: 'for' },
        { letter: 'C', text: 'with' },
        { letter: 'D', text: 'at' },
      ],
      answer: 'A',
      explanation:
        'Cụm cố định là "apply to somebody/something" (áp dụng cho ai/cái gì). ' +
        '"Apply for" nghĩa là nộp đơn xin việc/học bổng nên không hợp ngữ cảnh.',
      translation: 'Quy định an toàn mới áp dụng cho tất cả nhân viên, bất kể thâm niên.',
    },
    {
      id: 'p7-0001',
      part: 7,
      section: 'reading',
      difficulty: 3,
      tags: ['detail', 'notice'],
      stimulusId: 'g-p7-0001',
      prompt: 'Why was the training session postponed?',
      choices: [
        { letter: 'A', text: 'The conference room was occupied.' },
        { letter: 'B', text: 'The trainer was not available.' },
        { letter: 'C', text: 'Too few staff registered.' },
        { letter: 'D', text: 'The reading materials were late.' },
      ],
      answer: 'B',
      explanation:
        'Email nêu rõ: "postponed … because the trainer is unavailable". ' +
        'Phòng họp vẫn giữ nguyên (Conference Room B), tài liệu đã được tải lên đúng hạn.',
      translation: 'Buổi đào tạo bị hoãn vì giảng viên không có mặt.',
    },
    {
      id: 'p7-0002',
      part: 7,
      section: 'reading',
      difficulty: 3,
      tags: ['detail', 'inference'],
      stimulusId: 'g-p7-0001',
      prompt: 'What are participants asked to do before the new date?',
      choices: [
        { letter: 'A', text: 'Finish the reading materials.' },
        { letter: 'B', text: 'Contact the trainer directly.' },
        { letter: 'C', text: 'Book Conference Room B.' },
        { letter: 'D', text: 'Submit a training feedback form.' },
      ],
      answer: 'A',
      explanation:
        '"All participants are expected to finish them before the new date", ' +
        'trong đó "them" thay cho "pre-session reading materials".',
      translation: 'Người tham dự được yêu cầu hoàn thành tài liệu đọc trước ngày mới.',
    },
  ],
}
