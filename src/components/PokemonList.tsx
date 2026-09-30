import PokemonCard from "./PokemonCard";
import EmptySlot from "./EmptySlot";
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
      role: "전기ㆍ스피드",
    },
    {
      number: "#0006",
      name: "리자몽",
      type: "FIRE",
      image: Charizard,
      role: "불꽃ㆍ공격",
    },
    {
      number: "#0001",
      name: "이상해씨",
      type: "GRASS",
      image: Bulbasaur,
      role: "전기ㆍ스피드",
    },
    {
      number: "#0009",
      name: "거북왕",
      type: "WATER",
      image: Blastoise,
      role: "풀ㆍ서포트",
    },
  ];

  return (
    <section className="pokemon-section">
      <div className="pokemon-grid">
        {Array.from({ length: 6 }).map((_, index) => {
          const pokemon = pokemonList[index];

          return pokemon ? (
            <PokemonCard
              key={index}
              name={pokemon.name}
              role={pokemon.role}
              image={pokemon.image} number={""} type={""}            />
          ) : (
            <EmptySlot key={index} />
          );
        })}
      </div>
    </section>
  );
}

export default PokemonList;