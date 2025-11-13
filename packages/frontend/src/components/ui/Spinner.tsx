import { HTMLAttributes } from 'react'

export interface SpinnerProps extends HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg'
  variant?: 'primary' | 'white'
}

export function Spinner({
  size = 'md',
  variant = 'primary',
  className = '',
  ...props
}: SpinnerProps) {
  const sizeClass = {
    sm: 'spinner-sm',
    md: 'spinner-md',
    lg: 'spinner-lg',
  }[size]

  const variantClass = {
    primary: 'spinner-primary',
    white: 'spinner-white',
  }[variant]

  return (
    <div
      className={`${variantClass} ${sizeClass} ${className}`}
      {...props}
    />
  )
}
