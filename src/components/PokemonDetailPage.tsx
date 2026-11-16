import { Link, useParams } from "react-router";
import { formatPokemonNumber } from "../data/pokemons";
import "./PokemonDetailPage.css";

function PokemonDetailPage() {
    const { pokemonId = "" } = useParams();
    const currentLabel = /^\d+$/.test(pokemonId)
        ? formatPokemonNumber(Number(pokemonId))
        : pokemonId;

    return (
        <nav className="pokemon-detail__breadcrumb" aria-label="현재 위치">
            <Link className="pokemon-detail__breadcrumb-link" to="/pokemon">
                도감
            </Link>
            <span aria-hidden="true"> / </span>
            <span aria-current="page">{currentLabel}</span>
        </nav>
    );
}

export default PokemonDetailPage;
