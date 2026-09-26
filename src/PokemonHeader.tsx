type TabKey = "home" | "pokedex" | "myTeam";

export default function PokemonHeader({
    currentTab,
    handleCurrentTab,
}: {
    currentTab: TabKey;
    handleCurrentTab: (tab: TabKey) => void;
}) {
    const NAV_ITEMS: { key: TabKey; label: string }[] = [
        { key: "home", label: "홈" },
        { key: "pokedex", label: "도감" },
        { key: "myTeam", label: "내 팀" },
    ];

    return (
        <div className="flex flex-col gap-6">
            <header className="flex w-full h-[72px] px-6 py-3.5 justify-between items-center shrink-0 rounded-lg border border-border-default bg-white">
                <div className="flex items-center gap-2.5">
                    <div className="flex gap-[10px] flex-col justify-center items-center w-[38px] h-[38px] rounded-lg bg-brand-red font-['Inter'] text-[11px] font-extrabold  text-text-inverse">
                        PM
                    </div>
                    <h2 className="text-title">PokéMate</h2>
                </div>

                <nav className="flex gap-2 items-center">
                    {NAV_ITEMS.map((item) => (
                        <button
                            key={item.key}
                            onClick={() => handleCurrentTab(item.key)}
                            aria-selected={currentTab === item.key}
                            className={`justify-start text-[13px] font-bold font-['Noto_Sans_KR'] px-[14px] py-[9px] rounded-full
                              ${
                                  currentTab === item.key
                                      ? "text-text-inverse bg-brand-red"
                                      : "text-neutral-muted bg-neutral-surface-strong"
                              }`}
                        >
                            {item.label}
                        </button>
                    ))}

                    <span className="text-caption " lang="en">
                        0/6
                    </span>
                </nav>
            </header>
        </div>
    );
}
