import type { PokemonType } from "../data/pokemons";
import "./PokemonCard.css";

type PokemonCardProps =
    | {
          variant?: "default";
          id: number;
          name: string;
          types: PokemonType[];
          imageUrl: string;
          isAdded: boolean;
          isTeamFull: boolean;
          onAdd: () => void;
      }
    | {
          variant: "error";
          id: number;
          onRetry: () => void;
      };

function formatNumber(id: number) {
    return `#${String(id).padStart(4, "0")}`;
}

function PokemonCard(props: PokemonCardProps) {
    if (props.variant === "error") {
        return (
            <article className="pokemon-card pokemon-card--error">
                <div className="pokemon-card__image-box" />
                <p className="pokemon-card__number">{formatNumber(props.id)}</p>
                <h3 className="pokemon-card__name">상세 정보 실패</h3>
                <button
                    className="pokemon-card__button"
                    type="button"
                    onClick={props.onRetry}
                >
                    다시 시도
                </button>
            </article>
        );
    }

    const { id, name, types, imageUrl, isAdded, isTeamFull, onAdd } = props;

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
            <p className="pokemon-card__number">{formatNumber(id)}</p>
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
