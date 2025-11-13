import { Eye, EyeOff } from 'lucide-react'

interface ComparisonToggleProps {
  showComparison: boolean
  onToggle: () => void
}

export function ComparisonToggle({ showComparison, onToggle }: ComparisonToggleProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-gray-300 text-gray-700 hover:border-indigo-500 hover:text-indigo-600 hover:bg-indigo-50 transition-all font-medium"
    >
      {showComparison ? (
        <>
          <EyeOff className="w-5 h-5" />
          <span>Hide Original</span>
        </>
      ) : (
        <>
          <Eye className="w-5 h-5" />
          <span>Show Original</span>
        </>
      )}
    </button>
  )
}
