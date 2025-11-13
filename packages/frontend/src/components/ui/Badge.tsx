import { HTMLAttributes, ReactNode } from 'react'

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'success' | 'warning' | 'info' | 'default' | 'danger'
  children: ReactNode
}

export function Badge({
  variant = 'default',
  children,
  className = '',
  ...props
}: BadgeProps) {
  const variantClass = {
    success: 'badge-success',
    warning: 'badge-warning',
    info: 'badge-info',
    default: 'badge-default',
    danger: 'badge-danger',
  }[variant]

  return (
    <span className={`${variantClass} ${className}`} {...props}>
      {children}
    </span>
  )
}
