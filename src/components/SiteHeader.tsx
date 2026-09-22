import "./SiteHeader.css";

type SiteHeaderProps = {
    activeMenu: string;
    teamCount: number;
    maxTeamSize: number;
};

function SiteHeader({ activeMenu, teamCount, maxTeamSize }: SiteHeaderProps) {
    const menus = ["홈", "도감", "내 팀"];

    return (
        <header className="site-header">
            <div className="site-header__brand">
                <span className="site-header__logo">PM</span>
                <span className="site-header__name">PokéMate</span>
            </div>

            <nav className="site-header__nav">
                {menus.map((menu) => (
                    <span
                        key={menu}
                        className={
                            menu === activeMenu
                                ? "site-header__nav-item site-header__nav-item--active"
                                : "site-header__nav-item"
                        }
                    >
                        {menu}
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
