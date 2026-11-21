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
    // Bundle hiện ~670 kB do chứa toàn bộ 425 câu hỏi dưới dạng dữ liệu tĩnh.
    // Nâng ngưỡng cảnh báo để log build không nhiễu; đây là dữ liệu, không phải
    // mã chết, và toàn bộ nằm sau một lần tải (offline-first, không cần mạng).
    chunkSizeWarningLimit: 900,
  },
})
