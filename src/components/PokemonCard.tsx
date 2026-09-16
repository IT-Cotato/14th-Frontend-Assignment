import "./PokemonCard.css";

type PokemonCardProps = {
    id: number;
    name: string;
    type: string;
    image: string;
};

function PokemonCard({ id, name, type, image }: PokemonCardProps) {
    const imageUrl = new URL(`../assets/${image}`, import.meta.url).href;
    const number = `#${String(id).padStart(4, "0")}`;

    return (
        <article className="pokemon-card">
            <div className="pokemon-card__image-box">
                <img
                    className="pokemon-card__image"
                    src={imageUrl}
                    alt={name}
                />
            </div>
            <p className="pokemon-card__number">{number}</p>
            <h3 className="pokemon-card__name">{name}</h3>
            <span className={`pokemon-card__type pokemon-card__type--${type}`}>
                {type.toUpperCase()}
            </span>
            <button className="pokemon-card__button" type="button">
                팀에 추가
            </button>
        </article>
    );
}

export default PokemonCard;
