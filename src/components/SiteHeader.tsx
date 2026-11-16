import { NavLink } from "react-router";
import "./SiteHeader.css";

type SiteHeaderProps = {
    teamCount: number;
    maxTeamSize: number;
};

const menus = [
    { to: "/", label: "홈", modifier: "home", end: true },
    { to: "/pokemon", label: "도감", modifier: "pokedex", end: false },
    { to: "/my-team", label: "내 팀", modifier: "team", end: false },
];

function SiteHeader({ teamCount, maxTeamSize }: SiteHeaderProps) {
    return (
        <header className="site-header">
            <div className="site-header__brand">
                <span className="site-header__logo">PM</span>
                <span className="site-header__name">PokéMate</span>
            </div>

            <nav className="site-header__nav">
                {menus.map((menu) => (
                    <NavLink
                        key={menu.to}
                        to={menu.to}
                        end={menu.end}
                        className={({ isActive }) =>
                            [
                                "site-header__nav-item",
                                `site-header__nav-item--${menu.modifier}`,
                                isActive ? "site-header__nav-item--active" : "",
                            ].join(" ")
                        }
                    >
                        {menu.label}
                    </NavLink>
                ))}
                <span className="site-header__team-count">
                    {teamCount} / {maxTeamSize}
                </span>
            </nav>
        </header>
    );
}

export default SiteHeader;
