import './PokedexTitle.css';

interface PokedexTitleProps {
  title: string;
  description: string;
  teamCount: number;
  teamLimit: number;
}

function PokedexTitle({ title, description, teamCount, teamLimit }: PokedexTitleProps) {
  return (
    <section className="pokedex-title">
      <div className="pokedex-title__text">
        <h1 className="pokedex-title__heading">{title}</h1>
        <p className="pokedex-title__description">{description}</p>
      </div>
      <span className="pokedex-title__badge">
        내 팀 {teamCount} / {teamLimit}
      </span>
    </section>
  );
}

export default PokedexTitle;