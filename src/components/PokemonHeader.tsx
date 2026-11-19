import { Link } from "react-router-dom";
import { MAX_TEAM_SIZE, type ActivePage } from "./teamTypes";

type PokemonHeaderProps = {
  activePage?: ActivePage;
  teamCount: number;
};

function PokemonHeader({ activePage, teamCount }: PokemonHeaderProps) {

  const getNavClass = (page: ActivePage, baseClass: string): string => {
    return activePage === page ? `${baseClass} active` : baseClass;
  };

  const getAriaCurrent = (page: ActivePage) => {
    return activePage === page ? "page" : undefined;
  };

  return (
    <header className="header">
      <div className="brand">
        <span className="logo-mark">PM</span>
        <strong>PokéMate</strong>
      </div>

      <nav className="navigation">
        <Link
          className={getNavClass("home", "nav-home")}
          aria-current={getAriaCurrent("home")}
          to="/"
        >
          홈
        </Link>

        <Link
          className={getNavClass("pokedex", "nav-pokedex")}
          aria-current={getAriaCurrent("pokedex")}
          to="/pokemon"
        >
          도감
        </Link>

        <Link
          className={getNavClass("team", "nav-my-team")}
          aria-current={getAriaCurrent("team")}
          to="/my-team"
        >
          내 팀
        </Link>

        <span className="team-count">
          {teamCount} / {MAX_TEAM_SIZE}
        </span>
      </nav>
    </header>
  );
}

export default PokemonHeader;