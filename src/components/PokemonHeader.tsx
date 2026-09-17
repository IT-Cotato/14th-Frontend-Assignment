import pikachu from '../assets/pikachu.png'

interface PokemonHeaderProps {
  badge: string
  title: string
  description: string
}

function PokemonHeader({ badge, title, description }: PokemonHeaderProps) {
  return (
    <section className="pokemon-header">
      <div className="pokemon-header-text">
        <span className="badge">{badge}</span>
        <h1 className="title">{title}</h1>
        <p className="description">{description}</p>
        <div className="pokemon-header-buttons">
          <button type="button" className="btn btn-primary">
            도감 보기
          </button>
          <button type="button" className="btn btn-secondary">
            내 팀
          </button>
        </div>
      </div>

      <div className="hero-image-box">
        <img src={pikachu} alt={title} />
      </div>
    </section>
  )
}

export default PokemonHeader