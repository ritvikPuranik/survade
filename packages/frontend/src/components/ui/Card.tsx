import { HTMLAttributes, ReactNode } from 'react'
import { motion } from 'framer-motion'

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'flat' | 'elevated' | 'interactive' | 'gradient'
  padding?: 'none' | 'sm' | 'md' | 'lg'
  children: ReactNode
}

export function Card({
  variant = 'elevated',
  padding = 'md',
  children,
  className = '',
  ...props
}: CardProps) {
  const variantClass = {
    flat: 'card-flat',
    elevated: 'card-elevated',
    interactive: 'card-interactive',
    gradient: 'card-gradient',
  }[variant]

  const paddingClass = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  }[padding]

  if (variant === 'interactive') {
    return (
      <motion.div
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.2 }}
        className={`${variantClass} ${paddingClass} ${className}`}
        {...props}
      >
        {children}
      </motion.div>
    )
  }

  return (
    <div className={`${variantClass} ${paddingClass} ${className}`} {...props}>
      {children}
    </div>
  )
}
