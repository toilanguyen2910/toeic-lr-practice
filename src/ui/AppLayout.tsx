import { ROUTES, TID } from '../testids'
import { setPreferredReviewFilter } from './reviewFilter'
import { useTheme } from '../hooks/useTheme'

interface NavItem {
  route: string
  testId: string
  label: string
}

const NAV_ITEMS: NavItem[] = [
  { route: ROUTES.home, testId: TID.navHome, label: 'Trang chủ' },
  { route: ROUTES.partSelect, testId: TID.navPractice, label: 'Luyện tập' },
  { route: ROUTES.examSets, testId: TID.navExamSets, label: '20 đề' },
  { route: ROUTES.mock, testId: TID.navMock, label: 'Thi thử' },
  { route: ROUTES.history, testId: TID.navHistory, label: 'Lịch sử' },
  { route: ROUTES.settings, testId: TID.navSettings, label: 'Cài đặt' },
]

/** Thanh đầu trang: thương hiệu + điều hướng chính. */
export function AppHeader({ route }: { route: string }) {
  const { theme, cycleTheme } = useTheme()
  const themeLabel =
    theme === 'dark' ? 'Giao diện: Tối' : theme === 'light' ? 'Giao diện: Sáng' : 'Giao diện: Tự động'
  const themeIcon = theme === 'dark' ? '🌙' : theme === 'light' ? '☀️' : '⚙️'

  return (
    <header className="app__header">
      <div className="app__header-inner">
        <a className="brand" href={ROUTES.home}>
          <span className="brand__mark" aria-hidden="true">
            L&amp;R
          </span>
          <span className="brand__text">
            TOEIC Listening &amp; Reading
            <small>Luyện thi cá nhân</small>
          </span>
        </a>

        <nav className="nav" data-testid={TID.nav} aria-label="Điều hướng chính">
          {NAV_ITEMS.map((item) => {
            const isCurrent =
              route === item.route ||
              (item.route === ROUTES.partSelect && route === ROUTES.practice) ||
              (item.route === ROUTES.examSets && route.startsWith(`${ROUTES.examSets}/`)) ||
              (item.route === ROUTES.mock && route.startsWith(`${ROUTES.mock}/`))

            return (
              <a
                key={item.route}
                className="nav__link"
                href={item.route}
                data-testid={item.testId}
                aria-current={isCurrent ? 'page' : undefined}
                onClick={() => {
                  // Mọi lần vào khu xem lại qua thanh điều hướng đều bắt đầu ở "tất cả".
                  if (item.route === ROUTES.home) setPreferredReviewFilter('all')
                }}
              >
                {item.label}
              </a>
            )
          })}
          <button
            type="button"
            className="theme-toggle"
            onClick={cycleTheme}
            title={`${themeLabel} (Bấm để chuyển đổi)`}
            aria-label={themeLabel}
            data-testid="theme-toggle"
          >
            <span aria-hidden="true">{themeIcon}</span>
          </button>
        </nav>
      </div>
    </header>
  )
}

/** Chân trang gọn, không chiếm chỗ trên mobile. */
export function AppFooter() {
  return (
    <footer className="app__footer">
      <div className="app__footer-inner">
        TOEIC Listening &amp; Reading — ứng dụng tự luyện, không liên kết với ETS. Điểm số hiển thị là ước
        lượng từ bộ câu rút gọn, không phải chứng chỉ.
      </div>
    </footer>
  )
}
