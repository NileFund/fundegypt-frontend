import { useState } from 'react'
import { useAuth } from '../../context/useAuth'
import Button from '../ui/Button'
import { MessageSquare } from 'lucide-react'

interface CommentFormProps {
  onSubmit: (content: string) => Promise<void>
  isLoading?: boolean
  placeholder?: string
}

export default function CommentForm({
  onSubmit,
  isLoading = false,
  placeholder = 'Share your thoughts...'
}: CommentFormProps) {
  const { user } = useAuth()
  const [content, setContent] = useState('')
  const [error, setError] = useState('')

  if (!user) {
    return (
      <div className="bg-surface-card rounded-lg p-6 text-center border-2 border-dashed border-text-muted/30">
        <MessageSquare className="w-12 h-12 mx-auto text-text-muted/50 mb-3" />
        <p className="text-text-muted mb-4">Sign in to share your thoughts</p>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim()) {
      setError('Comment cannot be empty')
      return
    }

    try {
      setError('')
      await onSubmit(content.trim())
      setContent('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to post comment')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-surface-card rounded-lg p-6 space-y-4">
      <div>
        <textarea
          value={content}
          onChange={e => setContent(e.target.value)}
          placeholder={placeholder}
          maxLength={500}
          className="w-full bg-surface-page border border-text-muted/20 rounded-lg p-3 text-text-body placeholder-text-muted/60 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent resize-none"
          rows={3}
        />
        <div className="flex justify-between items-center mt-2">
          <p className="text-xs text-text-muted">{content.length}/500</p>
          {error && <p className="text-xs text-red-500">{error}</p>}
        </div>
      </div>
      <Button
        type="submit"
        disabled={isLoading || !content.trim()}
        variant="primary"
        className="w-full sm:w-auto"
      >
        {isLoading ? 'Posting...' : 'Post Comment'}
      </Button>
    </form>
  )
}