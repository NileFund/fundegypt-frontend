import { type ReactNode } from 'react'
import { X } from 'lucide-react'

// A simple confirmation/dialog modal.
// Usage:
//   <Modal isOpen={showDelete} onClose={() => setShowDelete(false)} title="Delete Account">
//     <p>Are you sure?</p>
//     <Button variant="danger" onClick={handleDelete}>Yes, delete</Button>
//   </Modal>

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: ReactNode
}

export default function Modal({ isOpen, onClose, title, children }: ModalProps) {
  if (!isOpen) return null

  return (
    // Backdrop — clicking outside closes the modal
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onClose}
    >
      {/* Stop click from bubbling to backdrop */}
      <div
        className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4 p-6"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-text-primary">{title}</h2>
          <button
            onClick={onClose}
            className="text-text-muted hover:text-text-body transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}
