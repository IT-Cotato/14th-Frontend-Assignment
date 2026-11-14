import Button from './Button';
import './PokemonHeader.css';

interface PokemonHeaderProps {
  badge: string;
  title: string;
  description: string;
  heroImageUrl: string;
  heroImageName: string;
}

function PokemonHeader({
  badge,
  title,
  description,
  heroImageUrl,
  heroImageName,
}: PokemonHeaderProps) {
  return (
    <section className="pokemon-header">
      <div className="pokemon-header__text">
        <span className="pokemon-header__badge">{badge}</span>
        <h1 className="pokemon-header__title">{title}</h1>
        <p className="pokemon-header__description">{description}</p>
        <div className="pokemon-header__actions">
          <Button variant="primary" to="/pokemon">
            도감 보기
          </Button>
          <Button variant="secondary" to="/my-team">
            내 팀
          </Button>
        </div>
      </div>

      <div className="pokemon-header__artwork">
        <img src={heroImageUrl} alt={`${heroImageName} 일러스트`} />
      </div>
    </section>
  );
}

export default PokemonHeader;