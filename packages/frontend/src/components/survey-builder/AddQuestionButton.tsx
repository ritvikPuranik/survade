import { Plus } from 'lucide-react'

interface AddQuestionButtonProps {
  onClick: () => void
}

export function AddQuestionButton({ onClick }: AddQuestionButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full py-4 border-2 border-dashed border-gray-300 rounded-xl text-gray-600 hover:border-indigo-500 hover:text-indigo-600 hover:bg-indigo-50/50 transition-all flex items-center justify-center gap-2 group"
    >
      <Plus className="w-6 h-6 group-hover:scale-110 transition-transform" />
      <span className="font-medium">Add Question</span>
    </button>
  )
}
