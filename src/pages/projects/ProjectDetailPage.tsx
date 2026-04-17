import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { getProject, getDonationSummary, cancelProject, getProjects } from '../../services/projectService'
import { donate } from '../../services/donationService'
import { useAuth } from '../../context/useAuth'
import { formatEGP, formatDate, getPercent } from '../../utils/formatters'
import ProgressBar from '../../components/ui/ProgressBar'
import ProjectCard from '../../components/ui/ProjectCard'
import RatingStars from '../../components/ui/RatingStars'
import TagBadge from '../../components/ui/TagBadge'
import Spinner from '../../components/ui/Spinner'
import Alert from '../../components/ui/Alert'
import Button from '../../components/ui/Button'
import {
  getProjectComments,
  createProjectComment,
  updateProjectComment,
  deleteProjectComment,
  createCommentReply,
} from '../../services/commentService'
import CommentSection from '../../components/comments/CommentSection'

function daysLeft(endTime: string): number {
  return Math.max(0, Math.ceil((new Date(endTime).getTime() - Date.now()) / 86_400_000))
}

export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user } = useAuth()
  const queryClient = useQueryClient()
  const [imgIndex, setImgIndex] = useState(0)
  const [amount, setAmount] = useState('')
  const [donationError, setDonationError] = useState('')
  const [donationSuccess, setDonationSuccess] = useState(false)
  const [cancelError, setCancelError] = useState('')

  const { data: project, isLoading: projectLoading } = useQuery({
    queryKey: ['project', id],
    queryFn: () => getProject(Number(id)),
    enabled: !!id,
  })

  const { data: summary } = useQuery({
    queryKey: ['donation-summary', id],
    queryFn: () => getDonationSummary(Number(id)),
    enabled: !!id && !!user,
  })

  const { data: similarData } = useQuery({
    queryKey: ['similar-projects', project?.category?.id],
    queryFn: () => getProjects({ category: project!.category.id, status: 'running' }),
    enabled: !!project?.category?.id,
  })

  const { data: commentsData, isLoading: commentsLoading } = useQuery({
    queryKey: ['project', id, 'comments'],
    queryFn: () => getProjectComments(Number(id)),
    enabled: !!id,
  })

  const projectTagIds = new Set(project?.tags?.map(t => t.id) ?? [])
  const similar = (similarData?.results ?? [])
    .filter(p => p.id !== project?.id)
    .sort((a, b) => {
      const aMatches = a.tags?.filter(t => projectTagIds.has(t.id)).length ?? 0
      const bMatches = b.tags?.filter(t => projectTagIds.has(t.id)).length ?? 0
      return bMatches - aMatches
    })
    .slice(0, 3)

  const donateMutation = useMutation({
    mutationFn: () => donate(Number(id), Number(amount)),
    onSuccess: () => {
      setDonationSuccess(true)
      setAmount('')
      queryClient.invalidateQueries({ queryKey: ['donation-summary', id] })
    },
    onError: () => setDonationError('Donation failed. Please try again.'),
  })

  const cancelMutation = useMutation({
    mutationFn: () => cancelProject(Number(id)),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['project', id] }),
    onError: () => setCancelError('Cannot cancel: project has reached 25%+ of its target.'),
  })

  const addCommentMutation = useMutation({
    mutationFn: (content: string) => createProjectComment(Number(id), { content }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project', id, 'comments'] })
    },
  })

  const editCommentMutation = useMutation({
    mutationFn: ({ commentId, content }: { commentId: number; content: string }) =>
      updateProjectComment(Number(id), commentId, { content }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project', id, 'comments'] })
    },
  })

  const deleteCommentMutation = useMutation({
    mutationFn: (commentId: number) => deleteProjectComment(Number(id), commentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project', id, 'comments'] })
    },
  })

  const replyMutation = useMutation({
    mutationFn: ({ parentCommentId, content }: { parentCommentId: number; content: string }) =>
      createCommentReply(Number(id), parentCommentId, { content }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project', id, 'comments'] })
    },
  })

  function handleDonate(e: React.FormEvent) {
    e.preventDefault()
    setDonationError('')
    setDonationSuccess(false)
    if (!amount || Number(amount) < 10) {
      setDonationError('Minimum donation is 10 EGP.')
      return
    }
    donateMutation.mutate()
  }

  if (projectLoading) return <Spinner centered />
  if (!project) return <p className="text-center py-16 text-text-muted">Project not found.</p>

  const raised = summary?.totalDonated ?? project.totalDonated
  const target = summary?.totalTarget ?? project.totalTarget
  const remaining = summary?.remaining ?? (target - raised)
  const percent = getPercent(raised, target)
  const isOwner = !!user && user.id === project.ownerId
  const canCancel = isOwner && percent < 25 && project.status === 'running'

  const images = project.pictures?.map(i => i.image) ?? []
  const heroImg = images[imgIndex] ?? null

  return (
    <div className="pb-20">
      <section className="relative h-125 w-full overflow-hidden">
        {heroImg ? (
          <img src={heroImg} alt={project.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-linear-to-br from-brand-primary/30 to-brand-secondary/20" />
        )}

        <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />

        <div className="absolute bottom-0 left-0 right-0 px-6 pb-10 max-w-7xl mx-auto">
          <div className="flex flex-col gap-3">
            {project.category && (
              <span className="self-start bg-brand-primary text-white px-3 py-1 rounded-full text-xs font-bold tracking-widest uppercase">
                {project.category.name}
              </span>
            )}
            <h1 className="text-white text-4xl md:text-5xl font-bold tracking-tight max-w-3xl leading-tight">
              {project.title}
            </h1>
          </div>
        </div>

        {images.length > 1 && (
          <div className="absolute bottom-8 right-6 flex gap-2">
            <button
              onClick={() => setImgIndex(i => (i === 0 ? images.length - 1 : i - 1))}
              className="bg-white/20 backdrop-blur-md p-2.5 rounded-full text-white hover:bg-white/40 transition-colors"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={() => setImgIndex(i => (i === images.length - 1 ? 0 : i + 1))}
              className="bg-white/20 backdrop-blur-md p-2.5 rounded-full text-white hover:bg-white/40 transition-colors"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        )}
      </section>

      <div className="max-w-7xl mx-auto px-6 mt-12 grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 space-y-8">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-8">
            <h2 className="text-2xl font-semibold text-text-primary mb-5">About the Project</h2>
            <p className="text-text-body leading-relaxed whitespace-pre-line text-sm">{project.details}</p>

            {project.tags?.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-6 pt-6 border-t border-gray-100">
                {project.tags.map(tag => <TagBadge key={tag.id} tag={tag.name} />)}
              </div>
            )}
          </div>

          {project.averageRating > 0 && (
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-8">
              <h3 className="text-xl font-semibold text-text-primary mb-6">Community Rating</h3>
              <div className="flex items-center gap-6 bg-gray-50 rounded-lg p-5">
                <div className="text-center min-w-15">
                  <span className="text-5xl font-bold text-brand-primary">{project.averageRating.toFixed(1)}</span>
                  <div className="mt-1">
                    <RatingStars value={project.averageRating} />
                  </div>
                </div>
                <div className="border-l border-gray-200 pl-6">
                  <p className="font-medium text-text-primary">Top Rated Campaign</p>
                  <p className="text-sm text-text-muted mt-1">
                    Based on verified contributor ratings.
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="bg-white rounded-xl border border-gray-100 shadow-sm px-8">
            <CommentSection
              comments={commentsData || []}
              isLoading={commentsLoading || addCommentMutation.isPending}
              onAddComment={async (content) => {
                await addCommentMutation.mutateAsync(content)
              }}
              onEditComment={async (commentId, content) => {
                await editCommentMutation.mutateAsync({ commentId, content })
              }}
              onDeleteComment={(commentId) => deleteCommentMutation.mutateAsync(commentId)}
              onReply={async (parentCommentId, content) => {
                await replyMutation.mutateAsync({ parentCommentId, content })
              }}
              title="Project Discussion"
            />
          </div>
        </div>

        <div className="lg:col-span-4">
          <div className="sticky top-24 bg-white rounded-xl border-2 border-brand-primary/20 shadow-lg p-7 space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between items-end">
                <span className="text-3xl font-bold text-text-primary">{formatEGP(raised)}</span>
                <span className="text-sm font-medium text-brand-primary">{percent}% of target</span>
              </div>
              <ProgressBar percent={percent} />
              <div className="flex justify-between text-xs font-semibold text-text-muted uppercase tracking-wider pt-0.5">
                <span>Raised</span>
                <span>Goal: {formatEGP(target)}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 py-4 border-y border-gray-100">
              <div className="text-center">
                <p className="text-2xl font-bold text-text-primary">{formatEGP(remaining)}</p>
                <p className="text-xs text-text-muted font-medium mt-0.5">Remaining</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-text-primary">{daysLeft(project.endTime)}</p>
                <p className="text-xs text-text-muted font-medium mt-0.5">Days Left</p>
              </div>
            </div>

            {project.status === 'running' && (
              !user ? (
                <p className="text-sm text-text-muted text-center">
                  <a href="/login" className="text-brand-primary font-semibold hover:underline">Log in</a> to donate.
                </p>
              ) : (
                <form onSubmit={handleDonate} className="space-y-3">
                  <input
                    type="number"
                    min={10}
                    placeholder="Amount in EGP"
                    value={amount}
                    onChange={e => setAmount(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-brand-primary transition-colors"
                  />
                  {donationError && <p className="text-xs text-danger">{donationError}</p>}
                  {donationSuccess && <p className="text-xs text-brand-primary font-medium">Thank you for your donation!</p>}
                  <button
                    type="submit"
                    disabled={donateMutation.isPending}
                    className="w-full py-4 bg-brand-primary hover:bg-brand-secondary text-white rounded-xl font-bold text-lg transition-all shadow-md active:scale-[0.98] disabled:opacity-60"
                  >
                    {donateMutation.isPending ? 'Processing…' : 'Donate Now'}
                  </button>
                </form>
              )
            )}

            <div className="text-xs text-text-muted space-y-1 pt-1">
              <div className="flex justify-between">
                <span>Start</span>
                <span className="font-medium text-text-body">{formatDate(project.startTime)}</span>
              </div>
              <div className="flex justify-between">
                <span>End</span>
                <span className="font-medium text-text-body">{formatDate(project.endTime)}</span>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-4">
              <p className="text-xs font-bold uppercase tracking-widest text-text-muted mb-1">Campaign by</p>
              <p className="text-sm font-medium text-text-primary truncate">{project.owner}</p>
            </div>

            {isOwner && (
              <div className="flex flex-col gap-2 border-t border-gray-100 pt-4">
                <Button variant="secondary" onClick={() => navigate(`/projects/${id}/edit`)}>
                  Edit Campaign
                </Button>
                {canCancel && (
                  <Button variant="danger" loading={cancelMutation.isPending} onClick={() => cancelMutation.mutate()}>
                    Cancel Campaign
                  </Button>
                )}
                {cancelError && <Alert type="error" message={cancelError} />}
              </div>
            )}
          </div>
        </div>
      </div>

      {similar.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 mt-16">
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-text-primary">Similar Projects</h3>
            <p className="text-sm text-text-muted mt-1">Continue supporting similar campaigns.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {similar.map(p => <ProjectCard key={p.id} project={p} />)}
          </div>
        </section>
      )}
    </div>
  )
}