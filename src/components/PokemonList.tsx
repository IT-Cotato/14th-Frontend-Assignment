import PokemonCard from "./PokemonCard";

function PokemonList() {
  return (
    <div className="pokemon-grid">
      <PokemonCard
        image="/Pikachu.svg"
        number="#0025"
        name="피카츄"
        type="ELECTRIC"
        typeClass="electric"
      />

      <PokemonCard
        image="/charizard.svg"
        number="#0006"
        name="리자몽"
        type="FIRE"
        typeClass="fire"
      />

      <PokemonCard
        image="/bulbasaur.svg"
        number="#0001"
        name="이상해씨"
        type="GRASS"
        typeClass="grass"
      />

      <PokemonCard
        image="/blastoise.svg"
        number="#0009"
        name="거북왕"
        type="WATER"
        typeClass="water"
      />
    </div>
  );
}

export default PokemonList;