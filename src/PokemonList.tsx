import PokemonCard from "./PokemonCard";

export default function PokemonList() {
    return (
        <div className="flex flex-col gap-6">
            <div className="flex justify-between items-center self-stretch">
                <h2 className="text-[22px] font-bold" lang="ko">
                    추천 포켓몬
                </h2>
                <button
                    className="text-[12px] font-bold text-[var(--color-brand-blue)]"
                    lang="ko"
                >
                    전체 보기
                </button>
            </div>

            <div className="flex gap-5">
                <PokemonCard
                    imageSrc="/0025.svg"
                    number="#0025"
                    name="피카츄"
                    type="ELECTRIC"
                />
                <PokemonCard
                    imageSrc="/0006.svg"
                    number="#0006"
                    name="리자몽"
                    type="FIRE"
                />
                <PokemonCard
                    imageSrc="/0001.svg"
                    number="#0001"
                    name="이상해씨"
                    type="GRASS"
                />
                <PokemonCard
                    imageSrc="/0009.svg"
                    number="#0009"
                    name="거북왕"
                    type="WATER"
                />
            </div>
        </div>
    );
}
