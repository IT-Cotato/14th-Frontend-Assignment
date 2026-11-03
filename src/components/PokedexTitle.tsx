import './PokedexTitle.css';

interface PokedexTitleProps {
  title: string;
  description: string;
  badge: string;
}

function PokedexTitle({ title, description, badge }: PokedexTitleProps) {
  return (
    <section className="pokedex-title">
      <div className="pokedex-title__text">
        <h1 className="pokedex-title__heading">{title}</h1>
        <p className="pokedex-title__description">{description}</p>
      </div>
      <span className="pokedex-title__badge">{badge}</span>
    </section>
  );
}

export default PokedexTitle;