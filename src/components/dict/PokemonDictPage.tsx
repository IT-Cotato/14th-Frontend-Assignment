import PokemonHeader from "./PokemonHeader";
import PokemonList from "./PokemonList";
import PokemonCard from "./PokemonCard";
import "./dict.css";

function PokemonDictPage() {
  return (
    <>
      <PokemonHeader />
      <PokemonList />
      <PokemonCard number={""} name={""} type={""} image={""} />
    </>
  );
}

export default PokemonDictPage;