import { useState } from 'react'
import { useAuth } from '../../context/useAuth'
import CommentForm from './CommentForm'
import CommentItem, { type Comment } from './CommentItem'
import Spinner from '../ui/Spinner'
import { MessageSquare } from 'lucide-react'

interface CommentSectionProps {
  comments: Comment[]
  isLoading?: boolean
  onAddComment: (content: string) => Promise<void>
  onEditComment?: (commentId: number, content: string) => Promise<void>
  onDeleteComment?: (commentId: number) => Promise<void>
  onReply?: (parentCommentId: number, content: string) => Promise<void>
  title?: string
}

export default function CommentSection({
  comments,
  isLoading = false,
  onAddComment,
  onEditComment,
  onDeleteComment,
  onReply,
  title = 'Comments',
}: CommentSectionProps) {
  const { user } = useAuth()
  const [replyingTo, setReplyingTo] = useState<number | null>(null)
  const [replyContent, setReplyContent] = useState('')

  const handleReplySubmit = async (content: string) => {
    if (replyingTo) {
      await onReply?.(replyingTo, content)
      setReplyingTo(null)
      setReplyContent('')
    }
  }

  return (
    <section className="py-12 border-t border-text-muted/10">
      <div className="max-w-3xl">
        {/* Header */}
        <div className="mb-8 flex items-center gap-3">
          <MessageSquare className="w-6 h-6 text-brand-primary" />
          <h2 className="text-2xl font-bold text-text-primary">
            {title}
          </h2>
          {comments.length > 0 && (
            <span className="ml-auto text-sm text-text-muted bg-surface-card px-3 py-1 rounded-full">
              {comments.length}
            </span>
          )}
        </div>

        {/* Add Comment Form */}
        <div className="mb-10">
          <CommentForm onSubmit={onAddComment} isLoading={isLoading} />
        </div>

        {/* Comments List */}
        {isLoading ? (
          <div className="py-12">
            <Spinner centered />
          </div>
        ) : comments.length > 0 ? (
          <div className="space-y-6">
            {comments.map(comment => (
              <div key={comment.id}>
                <CommentItem
                  comment={comment}
                  onReplyClick={setReplyingTo}
                  onEdit={onEditComment}
                  onDelete={onDeleteComment}
                  isLoading={isLoading}
                />

                {/* Reply Form */}
                {replyingTo === comment.id && user && (
                  <div className="mt-4 ml-4 sm:ml-8 bg-surface-card rounded-lg p-4">
                    <p className="text-sm text-text-muted mb-3 font-medium">Replying to {comment.author.username}</p>
                    <form
                      onSubmit={async e => {
                        e.preventDefault()
                        await handleReplySubmit(replyContent)
                      }}
                      className="space-y-3"
                    >
                      <textarea
                        value={replyContent}
                        onChange={e => setReplyContent(e.target.value)}
                        placeholder="Write a reply..."
                        maxLength={500}
                        className="w-full bg-surface-page border border-text-muted/20 rounded-lg p-3 text-text-body placeholder-text-muted/60 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent resize-none text-sm"
                        rows={2}
                      />
                      <div className="flex gap-2">
                        <button
                          type="submit"
                          disabled={isLoading || !replyContent.trim()}
                          className="px-4 py-2 bg-brand-primary hover:bg-[#278a72] text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Reply
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setReplyingTo(null)
                            setReplyContent('')
                          }}
                          className="px-4 py-2 bg-surface-page hover:bg-surface-page/80 text-text-body text-sm font-medium rounded-lg transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-surface-card rounded-lg">
            <MessageSquare className="w-12 h-12 mx-auto text-text-muted/30 mb-3" />
            <p className="text-text-muted">No comments yet. Be the first to share your thoughts!</p>
          </div>
        )}
      </div>
    </section>
  )
}