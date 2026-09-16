import PokemonCard from "./PokemonCard";
import "./PokemonList.css";

const pokemons = [
    { id: 25, name: "피카츄", type: "electric", image: "pikachu.png" },
    { id: 6, name: "리자몽", type: "fire", image: "charizard.png" },
    { id: 1, name: "이상해씨", type: "grass", image: "bulbasaur.png" },
    { id: 9, name: "거북왕", type: "water", image: "blastoise.png" },
];

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
                            type={pokemon.type}
                            image={pokemon.image}
                        />
                    </li>
                ))}
            </ul>
        </section>
    );
}

export default PokemonList;
