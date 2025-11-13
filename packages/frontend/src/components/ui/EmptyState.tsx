import { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { floatVariants, fadeInVariants } from '../../lib/animations'
import { FileText } from 'lucide-react'

export interface EmptyStateProps {
  icon?: ReactNode
  title: string
  description?: string
  action?: ReactNode
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <motion.div
      variants={fadeInVariants}
      initial="hidden"
      animate="visible"
      className="text-center py-16"
    >
      {/* Animated Icon */}
      <motion.div
        variants={floatVariants}
        animate="animate"
        className="flex justify-center mb-6"
      >
        {icon || (
          <FileText className="w-24 h-24 text-gray-300 stroke-[1.5]" />
        )}
      </motion.div>

      {/* Title */}
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>

      {/* Description */}
      {description && (
        <p className="text-sm text-gray-500 mb-6 max-w-md mx-auto">{description}</p>
      )}

      {/* Action Button */}
      {action && <div className="flex justify-center">{action}</div>}
    </motion.div>
  )
}
