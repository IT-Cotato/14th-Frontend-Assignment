type NavKey = "home" | "dex" | "team";

interface NavbarProps {
  activeTab: NavKey;
}

export default function Navbar({ activeTab }: NavbarProps) {
  const tabs: { key: NavKey; label: string }[] = [
    { key: "home", label: "홈" },
    { key: "dex", label: "도감" },
    { key: "team", label: "내 팀" },
  ];

  return (
    <div className="flex justify-between px-6 py-2.5 rounded-lg border border-neutral-line bg-white">
      <div className="flex items-center gap-2.5">
        <span className="flex w-[38px] h-[38px] items-center justify-center rounded-lg bg-brand-red text-text-inverse text-[11px] font-extrabold leading-none">
          PM
        </span>
        <p className="text-xl font-extrabold text-neutral-ink leading-none">
          PokéMate
        </p>
      </div>

      <div className="flex items-center gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            className={`flex items-center justify-center px-[14px] py-[9px] rounded-full text-[13px] font-bold leading-none ${activeTab === tab.key ? "bg-brand-red text-text-inverse" : "bg-neutral-surface-strong text-neutral-muted"}`}
          >
            {tab.label}
          </button>
        ))}
        <p className="text-neutral-ink text-caption font-bold">0 / 6</p>
      </div>
    </div>
  );
}
