import { MAX_TEAM_SIZE, type ActivePage } from "./teamTypes";

type PokemonHeaderProps = {
  activePage: ActivePage;
  teamCount: number;
  onNavigate: (page: ActivePage) => void;
};

function PokemonHeader({ activePage, teamCount, onNavigate }: PokemonHeaderProps) {

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
        <button
          className={getNavClass("home", "nav-home")}
          aria-current={getAriaCurrent("home")}
          onClick={() => onNavigate("home")}
        >
          홈
        </button>

        <button
          className={getNavClass("pokedex", "nav-pokedex")}
          aria-current={getAriaCurrent("pokedex")}
          onClick={() => onNavigate("pokedex")}
        >
          도감
        </button>

        <button
          className={getNavClass("team", "nav-my-team")}
          aria-current={getAriaCurrent("team")}
          onClick={() => onNavigate("team")}
        >
          내 팀
        </button>

        <span className="team-count">
          {teamCount} / {MAX_TEAM_SIZE}
        </span>
      </nav>
    </header>
  );
}

export default PokemonHeader;