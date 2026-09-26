import TitleBadge from "./components/TitleBadge";
import HomePanel from "./home/HomePanel";
import RecommendationList from "./home/RecommendationList";
import PokemonList from "./PokemonList";
import SearchBar from "./SearchBar";

type TabKey = "home" | "pokedex" | "myTeam";

export default function MainPanel({ currentTab }: { currentTab: TabKey }) {
    switch (currentTab) {
        case "home":
            return (
                <>
                    <HomePanel />
                    <SearchBar />
                    <RecommendationList />
                </>
            );
        case "pokedex":
            return (
                <>
                    <section className="flex flex-row justify-between items-center self-stretch">
                        <div>
                            <h1 className="text-neutral-ink text-[30px] font-bold">
                                포켓몬 도감
                            </h1>
                            <p className="text-neutral-muted text-[15px] font-regular">
                                다양한 포켓몬을 만나고 팀에 추가해보세요.
                            </p>
                        </div>
                        <TitleBadge>전체 151마리</TitleBadge>
                    </section>
                    <SearchBar />
                    <PokemonList />
                </>
            );
        case "myTeam":
            return;
    }
}
