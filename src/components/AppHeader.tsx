import { Link, NavLink } from 'react-router';

interface AppHeaderProps {
  teamCount: number;
}

const navClassName = ({ isActive }: { isActive: boolean }) =>
  isActive ? 'red-button' : 'basic-button';

function AppHeader({ teamCount }: AppHeaderProps) {
  return (
    <header className="container header">
      <Link className="logo" to="/pokemon">
        <span>PM</span>
        <strong>PokéMate</strong>
      </Link>

      <nav>
        <Link className="basic-button nav-home" to="/pokemon">
          홈
        </Link>
        <NavLink className={navClassName} to="/pokemon">
          도감
        </NavLink>
        <NavLink className={navClassName} to="/my-team">
          내 팀
        </NavLink>
        <span>{teamCount} / 6</span>
      </nav>
    </header>
  );
}

export default AppHeader;
