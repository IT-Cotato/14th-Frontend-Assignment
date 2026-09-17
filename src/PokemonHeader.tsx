export default function PokemonHeader() {
    return (
        <header className="flex w-full h-[72px] px-6 py-3.5 justify-between items-center shrink-0 rounded-lg border border-[var(--color-border-default)] bg-[var(--color-bg-surface)]">
            <div className="flex items-center gap-2.5">
                <div className="flex gap-[10px] flex-col justify-center items-center w-[38px] h-[38px] rounded-lg bg-[var(--color-brand-red)] font-['Inter'] text-[11px] font-extrabold  text-[var(--color-text-inverse)]">
                    PM
                </div>
                <h2 className="text-title">PokéMate</h2>
            </div>
            <nav className="flex gap-2 items-center">
                <button className="justify-start text-[var(--color-text-inverse)] text-[13px] font-bold font-['Noto_Sans_KR'] px-[14px] py-[9px] rounded-full bg-[var(--color-brand-red)]">
                    홈
                </button>

                <button className="justify-start text-[var(--color-text-inverse)] text-[13px] font-bold font-['Noto_Sans_KR'] px-[14px] py-[9px] rounded-full bg-[var(--color-brand-red)]">
                    도감
                </button>
                <button className="justify-start text-[var(--color-text-inverse)] text-[13px] font-bold font-['Noto_Sans_KR'] px-[14px] py-[9px] rounded-full bg-[var(--color-brand-red)]">
                    내 팀
                </button>
                <span className="text-caption " lang="en">
                    0/6
                </span>
            </nav>
        </header>
    );
}
