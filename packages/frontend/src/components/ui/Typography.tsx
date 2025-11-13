import { HTMLAttributes, ReactNode } from 'react'

// Heading Components
interface HeadingProps extends HTMLAttributes<HTMLHeadingElement> {
  children: ReactNode
}

export function H1({ children, className = '', ...props }: HeadingProps) {
  return (
    <h1 className={`heading-1 ${className}`} {...props}>
      {children}
    </h1>
  )
}

export function H2({ children, className = '', ...props }: HeadingProps) {
  return (
    <h2 className={`heading-2 ${className}`} {...props}>
      {children}
    </h2>
  )
}

export function H3({ children, className = '', ...props }: HeadingProps) {
  return (
    <h3 className={`heading-3 ${className}`} {...props}>
      {children}
    </h3>
  )
}

export function H4({ children, className = '', ...props }: HeadingProps) {
  return (
    <h4 className={`heading-4 ${className}`} {...props}>
      {children}
    </h4>
  )
}

// Text Components
interface TextProps extends HTMLAttributes<HTMLParagraphElement> {
  children: ReactNode
}

export function Text({ children, className = '', ...props }: TextProps) {
  return (
    <p className={`text-body ${className}`} {...props}>
      {children}
    </p>
  )
}

export function TextSmall({ children, className = '', ...props }: TextProps) {
  return (
    <p className={`text-body-sm ${className}`} {...props}>
      {children}
    </p>
  )
}

export function Caption({ children, className = '', ...props }: TextProps) {
  return (
    <p className={`text-caption ${className}`} {...props}>
      {children}
    </p>
  )
}

// Label Component
interface LabelProps extends HTMLAttributes<HTMLLabelElement> {
  htmlFor?: string
  children: ReactNode
}

export function Label({ children, className = '', ...props }: LabelProps) {
  return (
    <label className={`input-label ${className}`} {...props}>
      {children}
    </label>
  )
}
