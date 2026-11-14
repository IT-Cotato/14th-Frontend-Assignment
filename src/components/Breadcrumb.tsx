import { Link } from 'react-router';
import './Breadcrumb.css';

interface BreadcrumbProps {
  parentLabel: string;
  parentTo: string;
  current: string;
}

function Breadcrumb({ parentLabel, parentTo, current }: BreadcrumbProps) {
  return (
    <nav className="breadcrumb" aria-label="현재 위치">
      <Link to={parentTo} className="breadcrumb__link">
        {parentLabel}
      </Link>
      <span className="breadcrumb__divider" aria-hidden="true">
        /
      </span>
      <span aria-current="page">{current}</span>
    </nav>
  );
}

export default Breadcrumb;