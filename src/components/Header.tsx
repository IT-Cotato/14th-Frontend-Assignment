import './Header.css';

interface HeaderProps {
  teamCount: number;
  teamLimit: number;
}

const NAV_ITEMS = ['홈', '도감', '내 팀'];

function Header({ teamCount, teamLimit }: HeaderProps) {
  return (
    <header className="header">
      <div className="header__brand">
        <span className="header__logo">PM</span>
        <span className="header__title">PokéMate</span>
      </div>

      <nav className="header__nav">
        {NAV_ITEMS.map((item, index) => (
          <span
            key={item}
            className={`header__nav-item ${index === 0 ? 'header__nav-item--active' : ''}`}
          >
            {item}
          </span>
        ))}
        <span className="header__count">
          {teamCount} / {teamLimit}
        </span>
      </nav>
    </header>
  );
}

export default Header;
