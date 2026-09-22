import './Header.css';

export type NavItem = '홈' | '도감' | '내 팀';

interface HeaderProps {
  activeNav: NavItem;
  teamCount: number;
  teamLimit: number;
}

const NAV_ITEMS: { label: NavItem; pcOnly: boolean }[] = [
  { label: '홈', pcOnly: true },
  { label: '도감', pcOnly: false },
  { label: '내 팀', pcOnly: false },
];

function Header({ activeNav, teamCount, teamLimit }: HeaderProps) {
  return (
    <header className="header">
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
            <span key={label} className={classNames.join(' ')}>
              {label}
            </span>
          );
        })}
        <span className="header__count">
          {teamCount} / {teamLimit}
        </span>
      </nav>
    </header>
  );
}

export default Header;

