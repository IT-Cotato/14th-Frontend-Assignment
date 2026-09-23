import PokemonCard from "./PokemonCard";
import StatePanel from "./StatePanel";
import { pokemons } from "../data/pokemons";
import "./PokemonList.css";

function PokemonList() {
    return (
        <section className="pokemon-list">
            <div className="pokemon-list__header">
                <h2 className="pokemon-list__title">추천 포켓몬</h2>
                <button type="button" className="pokemon-list__view-all">
                    전체 보기
                </button>
            </div>
            {pokemons.length > 0 ? (
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
            ) : (
                <StatePanel
                    title="검색 결과가 없어요"
                    description="다른 이름이나 번호로 검색해 보세요."
                />
            )}
        </section>
    );
}

export default PokemonList;
