import type { ButtonHTMLAttributes, ReactNode } from 'react'
import './Button.css'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode
  variant?: 'primary' | 'secondary'
}

function Button({ children, className = '', variant = 'primary', ...props }: ButtonProps) {
  return (
    <button className={`button button--${variant} ${className}`.trim()} type="button" {...props}>
      {children}
    </button>
  )
}

export default Button
