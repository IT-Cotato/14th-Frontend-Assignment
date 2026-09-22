import './PokedexTitle.css';

interface PokedexTitleProps {
  title: string;
  description: string;
  totalCount: number;
}

function PokedexTitle({ title, description, totalCount }: PokedexTitleProps) {
  return (
    <section className="pokedex-title">
      <div className="pokedex-title__text">
        <h1 className="pokedex-title__heading">{title}</h1>
        <p className="pokedex-title__description">{description}</p>
      </div>
      <span className="pokedex-title__badge">전체 {totalCount}마리</span>
    </section>
  );
}

export default PokedexTitle;
