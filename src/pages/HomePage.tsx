import Navbar from "@/components/Navbar";
import PokemonIntro from "@/components/PokemonIntro";
import PokemonList from "@/components/PokemonList";
import SearchBar from "@/components/SearchBar";

export default function HomePage() {
  return (
    <div className="flex flex-col gap-6 px-20 py-9 bg-neutral-canvas">
      <Navbar activeTab="home" />
      <PokemonIntro />
      <SearchBar />
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <span className="text-[22px] font-bold leading-none text-neutral-ink">
            추천 포켓몬
          </span>
          <button className="text-caption font-bold leading-none text-text-brand">
            전체 보기
          </button>
        </div>
        <PokemonList />
      </div>
    </div>
  );
}
