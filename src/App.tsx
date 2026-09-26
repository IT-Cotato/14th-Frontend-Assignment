import PokemonHeader from "./PokemonHeader";
import PokemonList from "./PokemonList";

function App() {
    return (
        <div className="flex flex-col gap-6 px-[80px] py-[36px] gap-[24px] bg-canvas">
            <PokemonHeader />

            <search className="flex gap-3 max-w-[760px]">
                <div className="relative flex-1">
                    <img
                        src="/search-icon.svg"
                        alt=""
                        className="absolute left-[14px] top-1/2 -translate-y-1/2 w-4 h-4"
                    />
                    <input
                        type="text"
                        placeholder="이름 또는 번호"
                        className="flex w-full h-[42px] pl-[38px] pr-[14px] py-[11px] items-center gap-[10px] rounded-2 border border-neutral-line bg-neutral-white
                        placeholder:text--neutral-muted placeholder:text-[13px] placeholder:h-max"
                    />
                </div>
                <button
                    className="text-label rounded-lg py-3 px-5 bg-brand-red shadow-hard-red text-text-inverse"
                    lang="ko"
                >
                    검색
                </button>
            </search>
            <PokemonList />
        </div>
    );
}

export default App;
