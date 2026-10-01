import dragoniteArtwork from '../assets/dragonite.png'

interface PokemonHeaderProps {
  onNavigate: (path: string) => void
}

function PokemonHeader({ onNavigate }: PokemonHeaderProps) {
  return (
    <section className="pokemon-hero" aria-labelledby="pokemon-hero-title">
      <div className="pokemon-hero__copy">
        <span className="pokemon-hero__eyebrow">PokéMate</span>
        <h1 className="pokemon-hero__title" id="pokemon-hero-title">
          오늘의 파트너를 만나보세요
        </h1>
        <p className="pokemon-hero__description">
          포켓몬을 발견하고, 나만의 팀과 함께 새로운 모험을 시작하세요.
        </p>

        <div className="pokemon-hero__actions">
          <button
            className="pokemon-hero__button pokemon-hero__button--primary"
            type="button"
            onClick={() => onNavigate('/pokemon')}
          >
            포켓몬 찾기
          </button>
          <button
            className="pokemon-hero__button pokemon-hero__button--yellow"
            type="button"
            onClick={() => onNavigate('/my-team')}
          >
            내 팀 보기
          </button>
        </div>
      </div>

      <div className="pokemon-hero__artwork">
        <img src={dragoniteArtwork} alt="망나뇽" />
      </div>
    </section>
  )
}

export default PokemonHeader
