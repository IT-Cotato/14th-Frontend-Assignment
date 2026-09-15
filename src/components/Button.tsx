import type { ReactNode } from 'react';
import './Button.css';

interface ButtonProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary';
  size?: 'md' | 'sm';
}

function Button({ children, variant = 'primary', size = 'md' }: ButtonProps) {
  return (
    <button type="button" className={`button button--${variant} button--${size}`}>
      {children}
    </button>
  );
}

export default Button;
