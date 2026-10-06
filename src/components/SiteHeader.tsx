import "./SiteHeader.css";

export type MenuKey = "home" | "pokedex" | "team";

type SiteHeaderProps = {
    activeMenu: MenuKey;
    teamCount: number;
    maxTeamSize: number;
    onNavigate: (menu: MenuKey) => void;
};

const menus: { key: MenuKey; label: string }[] = [
    { key: "home", label: "홈" },
    { key: "pokedex", label: "도감" },
    { key: "team", label: "내 팀" },
];

function SiteHeader({
    activeMenu,
    teamCount,
    maxTeamSize,
    onNavigate,
}: SiteHeaderProps) {
    return (
        <header className="site-header">
            <div className="site-header__brand">
                <span className="site-header__logo">PM</span>
                <span className="site-header__name">PokéMate</span>
            </div>

            <nav className="site-header__nav">
                {menus.map((menu) => (
                    <button
                        key={menu.key}
                        type="button"
                        className={[
                            "site-header__nav-item",
                            `site-header__nav-item--${menu.key}`,
                            menu.key === activeMenu
                                ? "site-header__nav-item--active"
                                : "",
                        ].join(" ")}
                        aria-current={
                            menu.key === activeMenu ? "page" : undefined
                        }
                        onClick={() => onNavigate(menu.key)}
                    >
                        {menu.label}
                    </button>
                ))}
                <span className="site-header__team-count">
                    <span className="site-header__team-count-label">
                        내 팀{" "}
                    </span>
                    {teamCount} / {maxTeamSize}
                </span>
            </nav>
        </header>
    );
}

export default SiteHeader;
