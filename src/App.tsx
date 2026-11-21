import './styles/index.css'
import { FULL_BANK } from './data'
import { ROUTES, TID, parseExamSetRoute, parseMockSetRoute } from './testids'
import { useBankIndex } from './hooks/useBankIndex'
import { useHashRoute } from './hooks/useHashRoute'
import { AppFooter, AppHeader } from './ui/AppLayout'
import { ExamSetRoute } from './ui/ExamSetRoute'
import { ExamSetsPage } from './ui/ExamSetsPage'
import { HistoryPage } from './ui/HistoryPage'
import { HomePage } from './ui/HomePage'
import { MockSetRoute } from './ui/MockSetRoute'
import { MockSetsPage } from './ui/MockSetsPage'
import { NotFoundPage } from './ui/NotFoundPage'
import { PartSelectPage } from './ui/PartSelectPage'
import { ResultPage } from './ui/ResultPage'
import { ReviewPage } from './ui/ReviewPage'
import { SessionProvider } from './ui/SessionProvider'
import { PracticeSessionRoute } from './ui/SessionRoutes'
import { SettingsPage } from './ui/SettingsPage'
import { SettingsProvider } from './ui/SettingsProvider'
import type { BankIndex } from './hooks/useBankIndex'

/**
 * ỨNG DỤNG TOEIC LISTENING & READING.
 *
 * Điều hướng dùng hash thuần (`window.location.hash` + `hashchange`), không thêm
 * thư viện router. Mọi route lấy từ `ROUTES` trong `src/testids.ts` — đó là hợp
 * đồng với bộ kiểm thử thật, nên không đặt chuỗi route rải rác trong component.
 */
function App() {
  const route = useHashRoute()
  const index = useBankIndex(FULL_BANK)

  return (
    <SettingsProvider>
      <SessionProvider bank={FULL_BANK}>
        <div className="app" data-testid={TID.app}>
          <a className="skip-link" href="#main-content">
            Bỏ qua điều hướng, tới nội dung chính
          </a>

          <AppHeader route={route} />

          <main className="app__main" id="main-content">
            <AppRoutes route={route} index={index} />
          </main>

          <AppFooter />
        </div>
      </SessionProvider>
    </SettingsProvider>
  )
}

/** Bảng định tuyến — route có tham số được phân tích trước, còn lại vào `switch`. */
function AppRoutes({ route, index }: { route: string; index: BankIndex }) {
  // Hai route có tham số: `#/de/<số>` (đề luyện) và `#/mock/<số>` (đề thi thử).
  const examSetId = parseExamSetRoute(route)
  if (examSetId != null) {
    return <ExamSetRoute id={examSetId} index={index} />
  }

  const mockSetId = parseMockSetRoute(route)
  if (mockSetId != null) {
    return <MockSetRoute id={mockSetId} index={index} />
  }

  switch (route) {
    case ROUTES.home:
      return <HomePage />
    case ROUTES.partSelect:
      return <PartSelectPage />
    case ROUTES.practice:
      return <PracticeSessionRoute index={index} />
    case ROUTES.mock:
      return <MockSetsPage />
    case ROUTES.examSets:
      return <ExamSetsPage />
    case ROUTES.result:
      return <ResultPage />
    case ROUTES.review:
      return <ReviewPage index={index} />
    case ROUTES.history:
      return <HistoryPage />
    case ROUTES.settings:
      return <SettingsPage />
    default:
      return <NotFoundPage />
  }
}

export default App
