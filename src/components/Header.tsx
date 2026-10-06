import './Header.css';

export type NavItem = '홈' | '도감' | '내 팀';

interface HeaderProps {
  activeNav: NavItem;
  teamCount: number;
  teamLimit: number;
  onNavigate: (nav: NavItem) => void;
}

const NAV_ITEMS: { label: NavItem; pcOnly: boolean }[] = [
  { label: '홈', pcOnly: true },
  { label: '도감', pcOnly: false },
  { label: '내 팀', pcOnly: false },
];

function Header({ activeNav, teamCount, teamLimit, onNavigate }: HeaderProps) {
  return (
    <header className={`header${activeNav === '도감' ? ' header--pokedex' : ''}`}>
      <div className="header__brand">
        <span className="header__logo">PM</span>
        <span className="header__title">PokéMate</span>
      </div>

      <nav className="header__nav">
        {NAV_ITEMS.map(({ label, pcOnly }) => {
          const classNames = ['header__nav-item'];
          if (label === activeNav) classNames.push('header__nav-item--active');
          if (pcOnly) classNames.push('header__nav-item--pc-only');

          return (
            <button
              key={label}
              type="button"
              className={classNames.join(' ')}
              aria-current={label === activeNav ? 'page' : undefined}
              onClick={() => onNavigate(label)}
            >
              {label}
            </button>
          );
        })}
        <span className="header__count">
          <span className="header__count-label">내 팀 </span>
          {teamCount} / {teamLimit}
        </span>
      </nav>
    </header>
  );
}

export default Header;