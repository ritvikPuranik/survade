import { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { pageVariants } from '../../lib/animations'

export interface PageContainerProps {
  children: ReactNode
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '7xl'
  className?: string
  animated?: boolean
}

export function PageContainer({
  children,
  maxWidth = '7xl',
  className = '',
  animated = true,
}: PageContainerProps) {
  const maxWidthClass = {
    sm: 'max-w-screen-sm',
    md: 'max-w-screen-md',
    lg: 'max-w-screen-lg',
    xl: 'max-w-screen-xl',
    '2xl': 'max-w-screen-2xl',
    '7xl': 'max-w-7xl',
  }[maxWidth]

  if (animated) {
    return (
      <motion.div
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className={`${maxWidthClass} mx-auto px-4 sm:px-6 lg:px-8 py-8 ${className}`}
      >
        {children}
      </motion.div>
    )
  }

  return (
    <div className={`${maxWidthClass} mx-auto px-4 sm:px-6 lg:px-8 py-8 ${className}`}>
      {children}
    </div>
  )
}
