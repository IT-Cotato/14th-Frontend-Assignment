import pikachu from '../assets/pikachu.png'

interface PokemonHeaderProps {
  badge: string
  title: string
  description: string
//상단바의 '내 팀' 버튼과 동일하게, 이 버튼도 눌렀을 때 나의 팀 화면으로
  //전환되도록 App의 setActiveView('team')을 그대로 받아서 쓴다.
  onTeamClick: () => void
}

function PokemonHeader({ badge, title, description, onTeamClick }: PokemonHeaderProps) {
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
          <button type="button" className="btn btn-secondary" onClick={onTeamClick}>
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
