import Navbar from "@/components/Navbar";
import PokedexIntro from "@/components/PokedexIntro";
import PokemonList from "@/components/PokemonList";
import SearchBar from "@/components/SearchBar";

export default function PokedexPage() {
  return (
    <div className="flex flex-col gap-6 px-20 py-9 bg-neutral-canvas">
      <Navbar activeTab="dex" />
      <PokedexIntro />
      <SearchBar />
      <PokemonList />
    </div>
  );
}
