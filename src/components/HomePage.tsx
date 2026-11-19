import { Link } from 'react-router'

/** / 홈. 앱 진입점에서 도감과 내 팀으로 가는 선택지를 보여 준다. (W07 Route Map, 기존 PokéMate 스타일) */
function HomePage() {
  return (
    <main className="home">
      <div className="dex-intro">
        <div className="dex-intro__text">
          <h1 className="dex-intro__title">PokéMate</h1>
          <p className="dex-intro__description">
            도감에서 포켓몬을 살펴보고 최대 6마리로 나만의 팀을 완성하세요.
          </p>
        </div>
      </div>
      <div className="home__actions">
        <Link to="/pokemon" className="button button--primary">
          도감 보기
        </Link>
        <Link to="/my-team" className="button button--secondary">
          내 팀 보기
        </Link>
      </div>
    </main>
  )
}

export default HomePage
