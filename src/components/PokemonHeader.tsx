import pikachuImage from '../assets/pokemon/pikachu.png'

const brandName = 'PokéMate'
const teamCount = 0
const teamLimit = 6

const heroBadge = '오늘의 추천'
const heroTitle = '포켓몬과 함께하는 하루'
const heroDescription = '좋아하는 포켓몬을 찾고 나만의 팀을 만들어 보세요.'
const heroImageAlt = '피카츄 일러스트'

function PokemonHeader() {
  return (
    <header className="pokemon-header">
      <div className="top-bar">
        <div className="brand">
          <span className="brand__mark" aria-hidden="true">
            PM
          </span>
          <span className="brand__name">{brandName}</span>
        </div>

        <div className="top-bar__actions">
          <nav className="top-nav" aria-label="주요 메뉴">
            <button
              type="button"
              className="nav-pill nav-pill--active"
              aria-current="page"
            >
              홈
            </button>
            <button type="button" className="nav-pill">
              도감
            </button>
            <button type="button" className="nav-pill">
              내 팀
            </button>
          </nav>

          <span className="team-count">
            {teamCount} / {teamLimit}
          </span>
        </div>
      </div>

      <section className="hero">
        <div className="hero__content">
          <span className="hero__badge">{heroBadge}</span>
          <h1 className="hero__title">{heroTitle}</h1>
          <p className="hero__description">{heroDescription}</p>
          <div className="hero__actions">
            <button type="button" className="button button--primary">
              도감 보기
            </button>
            <button type="button" className="button button--secondary">
              내 팀
            </button>
          </div>
        </div>

        <div className="hero__image-box">
          <img
            className="hero__image"
            src={pikachuImage}
            alt={heroImageAlt}
            width={204}
            height={204}
          />
        </div>
      </section>
    </header>
  )
}

export default PokemonHeader
