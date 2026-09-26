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
    const typeColorMap: Record<string, string> = {
        BUG: "var(--color-type-bug)",
        DARK: "var(--color-type-dark)",
        DRAGON: "var(--color-type-dragon)",
        ELECTRIC: "var(--color-type-electric)",
        FAIRY: "var(--color-type-fairy)",
        FIGHTING: "var(--color-type-fighting)",
        FIRE: "var(--color-type-fire)",
        FLYING: "var(--color-type-flying)",
        GHOST: "var(--color-type-ghost)",
        GRASS: "var(--color-type-grass)",
        GROUND: "var(--color-type-ground)",
        ICE: "var(--color-type-ice)",
        NORMAL: "var(--color-type-normal)",
        POISON: "var(--color-type-poison)",
        PSYCHIC: "var(--color-type-psychic)",
        ROCK: "var(--color-type-rock)",
        STEEL: "var(--color-type-steel)",
        WATER: "var(--color-type-water)",
    };

    return (
        <div className="flex flex-col gap-[14px] p-[18px] w-full h-max items-center border border-[var(--color-neutral-line)] rounded-lg shadow-[var(--elevation-card)] bg-white">
            <div className="p-[10px] rounded-lg bg--neutral-surface-strong">
                <img src={imageSrc} alt={name} />
            </div>

            <caption className="font-semibold text-[11px] text-text-secondary">
                {number}
            </caption>
            <span className="font-bold text-[18px] text-text-primary" lang="ko">
                {name}
            </span>
            <span
                className="justify-center w-max text-[13px] text-text-inverse font-semibold font-['Noto_Sans_KR'] px-[14px] py-[9px] rounded-full"
                style={{ backgroundColor: typeColorMap[type] }}
            >
                {type}
            </span>
            <button
                className="text-label rounded-lg py-3 px-5 bg-brand-red shadow-hard-red text-text-inverse"
                lang="ko"
            >
                팀에 추가
            </button>
        </div>
    );
}
