import type { PokemonType } from "../data/pokemons";
import "./PokemonCard.css";

type PokemonCardProps = {
    id: number;
    name: string;
    types: PokemonType[];
    imageUrl: string;
    isAdded: boolean;
    isTeamFull: boolean;
    onAdd: () => void;
};

function PokemonCard({
    id,
    name,
    types,
    imageUrl,
    isAdded,
    isTeamFull,
    onAdd,
}: PokemonCardProps) {
    const number = `#${String(id).padStart(4, "0")}`;

    let buttonLabel = "팀에 추가";
    let buttonModifier = "";
    if (isAdded) {
        buttonLabel = "추가됨";
        buttonModifier = " pokemon-card__button--added";
    } else if (isTeamFull) {
        buttonLabel = "팀이 가득 참";
        buttonModifier = " pokemon-card__button--full";
    }

    return (
        <article
            className={`pokemon-card${isAdded ? " pokemon-card--added" : ""}`}
        >
            <div className="pokemon-card__image-box">
                <img
                    className="pokemon-card__image"
                    src={imageUrl}
                    alt={name}
                />
            </div>
            <p className="pokemon-card__number">{number}</p>
            <h3 className="pokemon-card__name">{name}</h3>
            <div className="pokemon-card__types">
                {types.map((type) => (
                    <span
                        key={type}
                        className={`pokemon-card__type pokemon-card__type--${type}`}
                    >
                        {type.toUpperCase()}
                    </span>
                ))}
            </div>
            <button
                className={`pokemon-card__button${buttonModifier}`}
                type="button"
                disabled={isAdded || isTeamFull}
                onClick={onAdd}
            >
                {buttonLabel}
            </button>
        </article>
    );
}

export default PokemonCard;
