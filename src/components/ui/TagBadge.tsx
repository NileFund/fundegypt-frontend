import { X } from 'lucide-react'

interface TagBadgeProps {
  tag: string
  onRemove?: () => void   // if provided, shows an ✕ button (used in Create/Edit form)
}

export default function TagBadge({ tag, onRemove }: TagBadgeProps) {
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-brand-mint text-brand-secondary">
      #{tag}
      {onRemove && (
        <button onClick={onRemove} className="hover:text-danger transition-colors">
          <X size={12} />
        </button>
      )}
    </span>
  )
}
