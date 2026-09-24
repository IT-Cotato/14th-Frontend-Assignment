type ActivePage = "home" | "pokedex" | "team";

type PokemonHeaderProps = {
  activePage: ActivePage;
};

function PokemonHeader({ activePage }: PokemonHeaderProps) {

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
        >
          홈
        </button>

        <button
          className={getNavClass("pokedex", "nav-pokedex")}
          aria-current={getAriaCurrent("pokedex")}
        >
          도감
        </button>

        <button
          className={getNavClass("team", "nav-my-team")}
          aria-current={getAriaCurrent("team")}
        >
          내 팀
        </button>

        <span className="team-count">3 / 6</span>
      </nav>
    </header>
  );
}

export default PokemonHeader;