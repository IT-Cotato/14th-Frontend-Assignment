import PokemonCard from "./PokemonCard";

export default function PokemonList() {
    return (
        <>
            <h2>추천 포켓몬</h2>
            <PokemonCard
                imageSrc="/0025.svg"
                number="0025"
                name="피카츄"
                type="ELECTRIC"
            />
            <PokemonCard
                imageSrc="/0006.svg"
                number="0006"
                name="리자몽"
                type="FIRE"
            />
            <PokemonCard
                imageSrc="/0001.svg"
                number="0001"
                name="이상해씨"
                type="GLASS"
            />
            <PokemonCard
                imageSrc="/0009.svg"
                number="0009"
                name="거북왕"
                type="WATER"
            />
        </>
    );
}
