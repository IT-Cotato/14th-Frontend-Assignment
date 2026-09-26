import PokemonList from "../PokemonList";

export default function RecommendationList() {
    return (
        <div className="flex flex-col gap-6">
            <div className="flex justify-between items-center self-stretch">
                <h2 className="text-[22px] font-bold" lang="ko">
                    추천 포켓몬
                </h2>
                <button
                    className="text-[12px] font-bold text-brand-blue"
                    lang="ko"
                >
                    전체 보기
                </button>
            </div>
            <PokemonList />
        </div>
    );
}
