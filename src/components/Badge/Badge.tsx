import type { ReactNode } from 'react'
import './Badge.css'

export default function Badge({ children, variant = 'default', className = '' }: {
  children: ReactNode; variant?: 'default' | 'number'; className?: string
}) {
  return <span className={`badge badge--${variant} ${className}`}>{children}</span>
}
