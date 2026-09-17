type PokemonCardProps = {
    imageSrc: string;
    number: string;
    name: string;
    type: string;
};

export default function PokemonCard({
    imageSrc,
    number,
    name,
    type,
}: PokemonCardProps) {
    return (
        <>
            <img src={imageSrc} />
            <caption>{number}</caption>
            <title>{name}</title>
            <span>{type}</span>
            <button>팀에 추가</button>
        </>
    );
}
