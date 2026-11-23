import type { ReactNode } from 'react';
import { Link } from 'react-router';
import './Button.css';

interface ButtonProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary';
  size?: 'md' | 'sm';
  disabled?: boolean;
  onClick?: () => void;
  to?: string;
}

function Button({ children, variant = 'primary', size = 'md', disabled = false, onClick, to }: ButtonProps) {
  const className = `button button--${variant} button--${size}`;

  if (to !== undefined && !disabled) {
    return (
      <Link to={to} className={className}>
        {children}
      </Link>
    );
  }

  return (
    <button type="button" className={className} disabled={disabled} onClick={onClick}>
      {children}
    </button>
  );
}

export default Button;