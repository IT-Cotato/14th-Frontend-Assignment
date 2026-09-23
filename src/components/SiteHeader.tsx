import "./SiteHeader.css";

type SiteHeaderProps = {
    activeMenu: string;
    teamCount: number;
    maxTeamSize: number;
};

const menus = [
    { key: "home", label: "홈" },
    { key: "pokedex", label: "도감" },
    { key: "team", label: "내 팀" },
];

function SiteHeader({ activeMenu, teamCount, maxTeamSize }: SiteHeaderProps) {
    return (
        <header className="site-header">
            <div className="site-header__brand">
                <span className="site-header__logo">PM</span>
                <span className="site-header__name">PokéMate</span>
            </div>

            <nav className="site-header__nav">
                {menus.map((menu) => (
                    <span
                        key={menu.key}
                        className={[
                            "site-header__nav-item",
                            `site-header__nav-item--${menu.key}`,
                            menu.label === activeMenu
                                ? "site-header__nav-item--active"
                                : "",
                        ].join(" ")}
                    >
                        {menu.label}
                    </span>
                ))}
                <span className="site-header__team-count">
                    {teamCount} / {maxTeamSize}
                </span>
            </nav>
        </header>
    );
}

export default SiteHeader;
