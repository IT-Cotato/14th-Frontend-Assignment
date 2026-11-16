import { formatPokemonNumber } from "../data/pokemons";
import type { PokemonProfile } from "../data/pokeApi";
import "./PokemonDetailCard.css";

const STAT_BAR_MAX = 120;

type PokemonDetailCardProps = {
    profile: PokemonProfile;
    isAdded: boolean;
    isTeamFull: boolean;
    onAdd: () => void;
};

function PokemonDetailCard({
    profile,
    isAdded,
    isTeamFull,
    onAdd,
}: PokemonDetailCardProps) {
    const { pokemon, height, weight, ability, stats, description } = profile;

    let buttonLabel = "내 팀에 추가";
    let buttonModifier = "";
    if (isAdded) {
        buttonLabel = "추가됨";
        buttonModifier = " pokemon-detail__button--added";
    } else if (isTeamFull) {
        buttonLabel = "팀이 가득 참";
        buttonModifier = " pokemon-detail__button--full";
    }

    return (
        <article className="pokemon-detail">
            <div className="pokemon-detail__artwork-panel">
                <div className="pokemon-detail__artwork">
                    <img
                        className="pokemon-detail__image"
                        src={pokemon.imageUrl}
                        alt={pokemon.name}
                    />
                </div>
            </div>
            <div className="pokemon-detail__info">
                <span className="pokemon-detail__number">
                    {formatPokemonNumber(pokemon.id)}
                </span>
                <h1 className="pokemon-detail__name">{pokemon.name}</h1>
                <p className="pokemon-detail__description">
                    {description ?? "설명이 없어요"}
                </p>
                <div className="pokemon-detail__types">
                    {pokemon.types.map((type) => (
                        <span
                            key={type}
                            className="pokemon-detail__type"
                            style={{ backgroundColor: `var(--type-${type})` }}
                        >
                            {type.toUpperCase()}
                        </span>
                    ))}
                </div>
                <dl className="pokemon-detail__facts">
                    <div className="pokemon-detail__fact">
                        <dt className="pokemon-detail__fact-label">키</dt>
                        <dd className="pokemon-detail__fact-value">
                            {height} m
                        </dd>
                    </div>
                    <div className="pokemon-detail__fact">
                        <dt className="pokemon-detail__fact-label">몸무게</dt>
                        <dd className="pokemon-detail__fact-value">
                            {weight} kg
                        </dd>
                    </div>
                    {ability !== null && (
                        <div className="pokemon-detail__fact">
                            <dt className="pokemon-detail__fact-label">특성</dt>
                            <dd className="pokemon-detail__fact-value">
                                {ability}
                            </dd>
                        </div>
                    )}
                </dl>
                <ul className="pokemon-detail__stats">
                    {stats.map((stat) => (
                        <li key={stat.label} className="pokemon-detail__stat">
                            <span
                                className="pokemon-detail__stat-label"
                                aria-hidden="true"
                            >
                                {stat.label}
                            </span>
                            <span
                                className="pokemon-detail__stat-track"
                                role="meter"
                                aria-label={stat.label}
                                aria-valuemin={0}
                                aria-valuemax={STAT_BAR_MAX}
                                aria-valuenow={Math.min(
                                    stat.value,
                                    STAT_BAR_MAX,
                                )}
                                aria-valuetext={String(stat.value)}
                            >
                                <span
                                    className="pokemon-detail__stat-bar"
                                    style={{
                                        width: `${Math.min(stat.value / STAT_BAR_MAX, 1) * 100}%`,
                                    }}
                                />
                            </span>
                        </li>
                    ))}
                </ul>
                <button
                    type="button"
                    className={`pokemon-detail__button${buttonModifier}`}
                    disabled={isAdded || isTeamFull}
                    onClick={onAdd}
                >
                    {buttonLabel}
                </button>
            </div>
        </article>
    );
}

export default PokemonDetailCard;
