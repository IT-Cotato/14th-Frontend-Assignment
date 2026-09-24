import PokemonCard from "./PokemonCard";
import StatePanel from "./StatePanel";

const defaultPokemons = [
  {
    id: 25,
    image: "/Pikachu.svg",
    number: "#0025",
    name: "피카츄",
    type: "ELECTRIC",
  },
  {
    id: 6,
    image: "/charizard.svg",
    number: "#0006",
    name: "리자몽",
    type: "FIRE",
  },
  {
    id: 1,
    image: "/bulbasaur.svg",
    number: "#0001",
    name: "이상해씨",
    type: "GRASS",
  },
  {
    id: 9,
    image: "/blastoise.svg",
    number: "#0009",
    name: "거북왕",
    type: "WATER",
  },
];

function PokemonList({ pokemons = defaultPokemons }) {
  if (pokemons.length === 0) {
    return <StatePanel />;
  }

  return (
    <div className="pokemon-grid">
      {pokemons.map((pokemon) => (
        <PokemonCard
          key={pokemon.id}
          {...pokemon}
        />
      ))}
    </div>
  );
}

export default PokemonList;