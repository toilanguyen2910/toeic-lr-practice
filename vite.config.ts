import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

/**
 * Cấu hình build.
 *
 * `base` phải là `/ten-repo/` khi deploy lên GitHub Pages, vì trang được phục vụ ở
 * `https://<user>.github.io/<ten-repo>/` chứ không phải gốc tên miền. Nếu để mặc
 * định `/`, mọi đường dẫn tới `/assets/…` và `/images/…` sẽ trỏ sai và trang trắng.
 *
 * Vì vậy `base` đọc từ biến môi trường:
 * - Build cho GitHub Pages: `VITE_BASE=/toeic-lr-practice/ npm run build`
 * - Build cho Vercel hoặc chạy local: không đặt biến → dùng `/`
 *
 * Không hard-code để tránh làm hỏng đường dẫn khi deploy ở nơi khác.
 */
export default defineConfig({
  base: process.env.VITE_BASE ?? '/',
  plugins: [react()],
  build: {
    /*
     * Bundle chính giờ ~1,12 MB vì chứa TOÀN BỘ dữ liệu tĩnh:
     * - 425 câu hỏi TOEIC + giải thích + bản dịch
     * - 600 từ vựng + phiên âm + định nghĩa + ví dụ hai thứ tiếng
     *
     * Đây là dữ liệu, không phải mã chết, và toàn bộ nằm trong một lần tải
     * (offline-first, không cần mạng sau khi mở). Nhưng 1,12 MB là quá lớn để
     * tải hết trước khi thấy màn hình đầu tiên, nên tách làm ba phần:
     *
     *   1. `vendor`  — React + chart.js, đổi rất ít, cache lâu dài
     *   2. `questions` — 425 câu hỏi, chỉ cần khi vào phần luyện/thi
     *   3. phần còn lại — khung ứng dụng, tải ngay
     *
     * `manualChunks` chỉ tách file; ứng dụng vẫn cần dữ liệu lúc render, nên
     * đây là cải thiện về cache và thứ tự tải, không phải lazy-load thật.
     */
    chunkSizeWarningLimit: 950,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) {
            // Dữ liệu câu hỏi tách riêng để trình duyệt cache độc lập với mã.
            if (id.includes('/src/data/')) return 'questions'
            return undefined
          }
          if (id.includes('chart.js') || id.includes('@kurkle')) return 'charts'
          return 'vendor'
        },
      },
    },
  },
})
