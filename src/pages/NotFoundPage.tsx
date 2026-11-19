import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return <section className="route-page"><h1>페이지를 찾을 수 없어요</h1><p>주소를 확인해 주세요.</p><Link to="/">홈으로</Link></section>
}
