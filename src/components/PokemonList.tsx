import PokemonCard from "./PokemonCard";
import { pokemons } from "../data/pokemons";
import "./PokemonList.css";

function PokemonList() {
    return (
        <section>
            <div className="pokemon-list__header">
                <h2 className="pokemon-list__title">추천 포켓몬</h2>
                <button type="button" className="pokemon-list__view-all">
                    전체 보기
                </button>
            </div>
            <ul className="pokemon-list__grid">
                {pokemons.map((pokemon) => (
                    <li key={pokemon.id}>
                        <PokemonCard
                            id={pokemon.id}
                            name={pokemon.name}
                            types={pokemon.types}
                            imageUrl={pokemon.imageUrl}
                        />
                    </li>
                ))}
            </ul>
        </section>
    );
}

export default PokemonList;
