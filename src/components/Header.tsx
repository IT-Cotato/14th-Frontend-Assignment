import { NavLink } from 'react-router';
import './Header.css';

interface HeaderProps {
  teamCount: number;
  teamLimit: number;
}

const NAV_ITEMS: { label: string; to: string; end: boolean; pcOnly: boolean }[] = [
  { label: '홈', to: '/', end: true, pcOnly: true },
  { label: '도감', to: '/pokemon', end: false, pcOnly: false },
  { label: '내 팀', to: '/my-team', end: false, pcOnly: false },
];

function Header({ teamCount, teamLimit }: HeaderProps) {
  return (
    <header className="header">
      <div className="header__brand">
        <span className="header__logo">PM</span>
        <span className="header__title">PokéMate</span>
      </div>

      <nav className="header__nav">
        {NAV_ITEMS.map(({ label, to, end, pcOnly }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) => {
              const classNames = ['header__nav-item'];
              if (isActive) classNames.push('header__nav-item--active');
              if (pcOnly) classNames.push('header__nav-item--pc-only');
              return classNames.join(' ');
            }}
          >
            {label}
          </NavLink>
        ))}
        <span className="header__count">
          {teamCount} / {teamLimit}
        </span>
      </nav>
    </header>
  );
}

export default Header;