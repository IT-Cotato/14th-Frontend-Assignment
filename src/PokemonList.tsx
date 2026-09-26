import { pokemons } from "./data/pokemons";
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

            <ul className="flex gap-5">
                {pokemons.map((value, index) => (
                    <li key={index}>
                        <PokemonCard
                            imageSrc={value.imageSrc}
                            number={value.number}
                            name={value.name}
                            type={value.type}
                        ></PokemonCard>
                    </li>
                ))}
            </ul>
        </div>
    );
}
