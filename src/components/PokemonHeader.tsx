import pikachuArtwork from '../assets/pikachu.png'

function PokemonHeader() {
  return (
    <section className="pokemon-hero" aria-labelledby="pokemon-hero-title">
      <div className="pokemon-hero__copy">
        <span className="pokemon-hero__eyebrow">오늘의 추천</span>
        <h1 className="pokemon-hero__title" id="pokemon-hero-title">
          포켓몬과 함께하는 하루
        </h1>
        <p className="pokemon-hero__description">
          좋아하는 포켓몬을 찾고 나만의 팀을 만들어 보세요.
        </p>

        <div className="pokemon-hero__actions">
          <a className="pokemon-hero__button pokemon-hero__button--primary" href="#pokedex">
            도감 보기
          </a>
          <a className="pokemon-hero__button pokemon-hero__button--secondary" href="#team">
            내 팀
          </a>
        </div>
      </div>

      <div className="pokemon-hero__artwork" aria-hidden="true">
        <img src={pikachuArtwork} alt="" />
      </div>
    </section>
  )
}

export default PokemonHeader
