import { useState } from 'react'
import { useAuth } from '../../context/useAuth'
import Button from '../ui/Button'
import { formatDistanceToNow } from 'date-fns'
import { getImageUrl } from '../../utils/helpers'
import { reportComment } from '../../services/commentService';
import { MessageCircle, Trash2, Edit2, Flag } from 'lucide-react'

export interface Comment {
  id: number
  content: string
  author: {
    id: number
    username: string
    profilePicture?: string
    profilePic?: string
  }
  createdAt: string
  updatedAt: string
  replies?: Comment[]
  _count?: {
    replies: number
  }
}

interface CommentItemProps {
  comment: Comment
  onReplyClick: (commentId: number) => void
  onEdit?: (commentId: number, content: string) => Promise<void>
  onDelete?: (commentId: number) => Promise<void>
  isReply?: boolean
  isLoading?: boolean
}

// Safe date formatter – returns a readable string or "recently" if invalid
function formatRelativeTime(dateString: string | undefined | null): string {
  if (!dateString) return 'recently'
  try {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return 'recently'
    return formatDistanceToNow(date, { addSuffix: true })
  } catch {
    return 'recently'
  }
}

export default function CommentItem({
  comment,
  onReplyClick,
  onEdit,
  onDelete,
  isReply = false,
  isLoading = false,
}: CommentItemProps) {
  const { user } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [editContent, setEditContent] = useState(comment.content)
  const [editError, setEditError] = useState('')
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const isAuthor = user?.id === comment.author?.id

  const username = comment.author?.username || 'Anonymous'
  const authorId = comment.author?.id
  const profilePicture = comment.author?.profilePicture || comment.author?.profilePic
  const userInitial = username.charAt(0).toUpperCase()

  const [showReportDialog, setShowReportDialog] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [reportError, setReportError] = useState('');

  const handleReport = async () => {
    try {
      setReportError('');
      await reportComment(comment.id, reportReason.trim() || undefined);
      setShowReportDialog(false);
      setReportReason('');
      alert('Comment reported. Thank you for your feedback.');
    } catch (err) {
      setReportError(err instanceof Error ? err.message : 'Failed to report comment');
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editContent.trim()) {
      setEditError('Comment cannot be empty')
      return
    }
    try {
      setEditError('')
      await onEdit?.(comment.id, editContent.trim())
      setIsEditing(false)
    } catch (err) {
      setEditError(err instanceof Error ? err.message : 'Failed to edit comment')
    }
  }

  const handleDelete = async () => {
    try {
      await onDelete?.(comment.id)
      setShowDeleteConfirm(false)
    } catch (err) {
      console.error('Failed to delete comment:', err)
    }
  }

  const timeAgo = formatRelativeTime(comment.createdAt)
  const isEdited = comment.updatedAt !== comment.createdAt

  return (
    <div className={`${isReply ? 'ml-4 sm:ml-8' : ''}`}>
      <div className={`${isReply ? 'bg-surface-page' : 'bg-surface-card'} rounded-lg p-4 space-y-3`}>
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            {authorId ? (
              <div
                className="shrink-0 w-10 h-10 rounded-full bg-brand-mint flex items-center justify-center overflow-hidden"
              >
                {profilePicture ? (
                  <img
                    src={getImageUrl(profilePicture)}
                    alt={username}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-brand-primary font-bold text-sm">
                    {userInitial}
                  </span>
                )}
              </div>
            ) : (
              <div className="shrink-0 w-10 h-10 rounded-full bg-brand-mint flex items-center justify-center">
                <span className="text-brand-primary font-bold text-sm">
                  {userInitial}
                </span>
              </div>
            )}
            <div className="min-w-0">
              {authorId ? (
                <div
                  className="font-semibold text-text-primary hover:text-brand-primary transition-colors text-sm truncate block"
                >
                  {username}
                </div>
              ) : (
                <p className="font-semibold text-text-primary text-sm truncate">
                  {username}
                </p>
              )}
              <p className="text-xs text-text-muted">
                {timeAgo}
                {isEdited && ' (edited)'}
              </p>
            </div>
          </div>

          {isAuthor && (
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="cursor-pointer p-2 hover:bg-surface-page rounded-lg transition-colors text-text-muted hover:text-brand-primary"
                title="Edit comment"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="cursor-pointer p-2 hover:bg-surface-page rounded-lg transition-colors text-text-muted hover:text-red-500"
                title="Delete comment"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          )}

          {user && !isAuthor && (
            <button
              onClick={() => setShowReportDialog(true)}
              className="p-2 hover:bg-surface-page rounded-lg transition-colors text-text-muted hover:text-red-500"
              title="Report comment"
            >
              <Flag className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Content */}
        {isEditing ? (
          <form onSubmit={handleEditSubmit} className="space-y-2">
            <textarea
              value={editContent}
              onChange={e => setEditContent(e.target.value)}
              maxLength={500}
              className="w-full bg-surface-page border border-text-muted/20 rounded-lg p-3 text-text-body focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent resize-none text-sm"
              rows={3}
            />
            {editError && <p className="text-xs text-red-500">{editError}</p>}
            <div className="flex gap-2">
              <Button type="submit" disabled={isLoading}>
                Save
              </Button>
              <Button
                variant='secondary'
                type="button"
                onClick={() => {
                  setIsEditing(false)
                  setEditContent(comment.content)
                  setEditError('')
                }}
              >
                Cancel
              </Button>
            </div>
          </form>
        ) : (
          <p className="text-text-body text-sm leading-relaxed">{comment.content}</p>
        )}

        {/* Actions */}
        {!isEditing && !isReply && (
          <div className="flex items-center gap-4 pt-2">
            <button
              onClick={() => onReplyClick(comment.id)}
              className="cursor-pointer flex items-center gap-2 text-xs font-medium text-text-muted hover:text-brand-primary transition-colors group"
            >
              <MessageCircle className="w-4 h-4 group-hover:fill-current" />
              Reply
            </button>
          </div>
        )}
      </div>

      {/* Delete Confirmation */}
      {showDeleteConfirm && (
        <div className="mt-3 bg-red-50 border border-red-200 rounded-lg p-4 space-y-3">
          <p className="text-sm text-red-800">Are you sure you want to delete this comment?</p>
          <div className="flex gap-2">
            <Button
              onClick={handleDelete}
              disabled={isLoading}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              Delete
            </Button>
            <Button variant='secondary' onClick={() => setShowDeleteConfirm(false)}>
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-4 space-y-3">
          {comment && Array.isArray(comment.replies) && comment.replies.map(reply => (
            <CommentItem
              key={reply.id}
              comment={reply}
              onReplyClick={onReplyClick}
              onEdit={onEdit}
              onDelete={onDelete}
              isReply
              isLoading={isLoading}
            />
          ))}
        </div>
      )}
      {showReportDialog && (
        <div className="mt-3 bg-yellow-50 border border-yellow-200 rounded-lg p-4 space-y-3">
          <p className="text-sm text-yellow-800">Report this comment?</p>
          <textarea
            value={reportReason}
            onChange={e => setReportReason(e.target.value)}
            placeholder="Optional: provide a reason (e.g., spam, offensive content)"
            maxLength={500}
            className="w-full bg-white border border-yellow-200 rounded-lg p-2 text-sm"
            rows={2}
          />
          {reportError && <p className="text-xs text-red-500">{reportError}</p>}
          <div className="flex gap-2">
            <Button
              onClick={handleReport}
              className="bg-yellow-500 hover:bg-yellow-600 text-white"
            >
              Submit Report
            </Button>
            <Button variant='secondary' onClick={() => setShowReportDialog(false)}>
              Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}