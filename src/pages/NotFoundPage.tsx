import { Link, useLocation } from 'react-router';

// 앱에 정의하지 않은 경로(예: /unknown)에서 보여주는 화면
function NotFoundPage() {
  const { pathname } = useLocation();

  return (
    <section className="empty-result-card">
      <div className="empty-icon">404</div>
      <h2 className="empty-title">페이지를 찾을 수 없어요</h2>
      <p className="empty-description">
        '{pathname}'은(는) 없는 주소예요. 주소를 다시 확인해 주세요.
      </p>
      <Link className="red-shadow-button empty-action" to="/pokemon">
        도감으로 가기
      </Link>
    </section>
  );
}

export default NotFoundPage;
