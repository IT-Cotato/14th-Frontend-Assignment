import PokemonCard from "./PokemonCard";
import Pikachu from "../assets/Pikachu.png";
import Charizard from "../assets/Charizard.png";
import Bulbasaur from "../assets/Bulbasaur.png";
import Blastoise from "../assets/Blastoise.png";

function PokemonList() {
  const pokemonList = [
    {
      number: "#0025",
      name: "피카츄",
      type: "ELECTRIC",
      image: Pikachu,
    },
    {
      number: "#0006",
      name: "리자몽",
      type: "FIRE",
      image: Charizard,
    },
    {
      number: "#0001",
      name: "이상해씨",
      type: "GRASS",
      image: Bulbasaur,
    },
    {
      number: "#0009",
      name: "거북왕",
      type: "WATER",
      image: Blastoise,
    },
  ];

  return (
    <section className="pokemon-section">
      <div className="pokemon-grid">
        {pokemonList.map((pokemon) => (
          <PokemonCard
            key={pokemon.number}
            number={pokemon.number}
            name={pokemon.name}
            type={pokemon.type}
            image={pokemon.image}
          />
        ))}
      </div>
    </section>
  );
}

export default PokemonList;