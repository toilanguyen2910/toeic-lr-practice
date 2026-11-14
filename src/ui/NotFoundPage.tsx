import { ROUTES } from '../testids'

/** Màn hình dự phòng khi hash không khớp route nào. */
export function NotFoundPage() {
  return (
    <div className="stack">
      <div className="page-head">
        <span className="section-label">Không tìm thấy trang</span>
        <h1>Đường dẫn này chưa có</h1>
        <p className="page-head__lead">
          Địa chỉ bạn mở không nằm trong ứng dụng. Hãy quay về trang chủ để chọn chế độ luyện tập.
        </p>
      </div>
      <div className="btn-row">
        <a className="btn btn--primary" href={ROUTES.home}>
          Về trang chủ
        </a>
        <a className="btn" href={ROUTES.partSelect}>
          Luyện theo part
        </a>
      </div>
    </div>
  )
}
