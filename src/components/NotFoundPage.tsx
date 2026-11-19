import { Link, useLocation, useNavigate } from 'react-router'
import StatePanel from './StatePanel.tsx'

/** 정의되지 않은 경로(*). 앱 안에서 이동해 왔으면 이전 화면으로, 직접 접근이면 홈으로 돌아갈 수 있다. */
function NotFoundPage() {
  const navigate = useNavigate()
  const location = useLocation()
  // 주소창에 직접 입력해 처음 들어온 화면은 돌아갈 이전 화면이 앱 안에 없다.
  const hasPrevious = location.key !== 'default'

  return (
    <main className="not-found">
      <StatePanel
        variant="error"
        title="페이지를 찾을 수 없어요"
        description="주소를 확인하거나 도감으로 돌아가세요."
      >
        <div className="state-panel__actions">
          {hasPrevious && (
            <button
              type="button"
              className="button button--secondary button--card"
              onClick={() => navigate(-1)}
            >
              이전 화면
            </button>
          )}
          <Link to="/" className="button button--primary button--card">
            홈으로
          </Link>
        </div>
      </StatePanel>
    </main>
  )
}

export default NotFoundPage
