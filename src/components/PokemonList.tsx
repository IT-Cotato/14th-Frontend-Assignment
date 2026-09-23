import PokemonCard from "./PokemonCard";
import StatePanel from "./StatePanel";
import { pokemons } from "../data/pokemons";
import "./PokemonList.css";

function PokemonList() {
    if (pokemons.length === 0) {
        return (
            <StatePanel
                title="검색 결과가 없어요"
                description="다른 이름이나 번호로 검색해 보세요."
            />
        );
    }

    return (
        <ul className="pokemon-list">
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
    );
}

export default PokemonList;
