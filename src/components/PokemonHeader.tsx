const brandName = 'PokéMate'

/** 팀에 담긴 포켓몬의 도감 ID. 팀 담기 기능은 이후 주차라 개수만 표시한다. */
const teamMemberIds = [25, 6, 1]
const teamLimit = 6

/** 시안에 표시된 도감 전체 수. 화면에 그리는 로컬 예시 데이터 개수와는 별개 값이다. */
const totalDexCount = 151

const dexTitle = '포켓몬 도감'
const dexDescription = '다양한 포켓몬을 만나고 팀에 추가해 보세요.'
const dexBadge = `전체 ${totalDexCount}마리`

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
            <button type="button" className="nav-pill nav-pill--home">
              홈
            </button>
            <button
              type="button"
              className="nav-pill nav-pill--active"
              aria-current="page"
            >
              도감
            </button>
            <button type="button" className="nav-pill">
              내 팀
            </button>
          </nav>

          <span className="team-count">
            {teamMemberIds.length} / {teamLimit}
          </span>
        </div>
      </div>

      <div className="dex-intro">
        <div className="dex-intro__text">
          <h1 className="dex-intro__title">{dexTitle}</h1>
          <p className="dex-intro__description">{dexDescription}</p>
        </div>
        <span className="dex-intro__badge">{dexBadge}</span>
      </div>
    </header>
  )
}

export default PokemonHeader
