import pikachu from "../assets/pikachu.png";
import "./PokemonHeader.css";

type PokemonHeaderProps = {
    badge: string;
    title: string;
    description: string;
};

function PokemonHeader({ badge, title, description }: PokemonHeaderProps) {
    return (
        <section className="pokemon-header">
            <div className="pokemon-header__text">
                <span className="pokemon-header__badge">{badge}</span>
                <h1 className="pokemon-header__title">{title}</h1>
                <p className="pokemon-header__description">{description}</p>
                <div className="pokemon-header__actions">
                    <button
                        className="pokemon-header__button pokemon-header__button--primary"
                        type="button"
                    >
                        도감 보기
                    </button>
                    <button
                        className="pokemon-header__button pokemon-header__button--secondary"
                        type="button"
                    >
                        내 팀
                    </button>
                </div>
            </div>
            <div className="pokemon-header__image-box">
                <img
                    className="pokemon-header__image"
                    src={pikachu}
                    alt={title}
                />
            </div>
        </section>
    );
}

export default PokemonHeader;
