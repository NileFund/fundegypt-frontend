/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { User as UserIcon, Heart } from 'lucide-react'
import { getProject, getDonationSummary, cancelProject, getProjects } from '../../services/projectService'
import { createDonation } from '../../services/donationService'
import { useAuth } from '../../context/useAuth'
import { formatEGP, formatDate, getPercent } from '../../utils/formatters'
import { getImageUrl } from '../../utils/helpers'
import ProgressBar from '../../components/ui/ProgressBar'
import ProjectCard from '../../components/ui/ProjectCard'
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
import RatingSection from '../../components/ratings/RatingSection'
import { Flag } from 'lucide-react'
import { reportProject } from '../../services/projectService'

function daysLeft(endTime: string): number {
  return Math.max(0, Math.ceil((new Date(endTime).getTime() - Date.now()) / 86_400_000))
}

export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user } = useAuth()
  const queryClient = useQueryClient()
  const [amount, setAmount] = useState('')
  const [donationError, setDonationError] = useState('')
  const [donationSuccess, setDonationSuccess] = useState(false)
  const [cancelError, setCancelError] = useState('')
  const [showReportDialog, setShowReportDialog] = useState(false)
  const [reportReason, setReportReason] = useState('')
  const [reportError, setReportError] = useState('')
  const [reportSuccess, setReportSuccess] = useState('')

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

  const projectTagIds = new Set(Array.isArray(project?.tags) ? project.tags.map(t => t.id) : [])
  const similar = (Array.isArray(similarData?.results) ? similarData.results : [])
    .filter(p => p.id !== project?.id)
    .sort((a, b) => {
      const aMatches = Array.isArray(a.tags) ? a.tags.filter(t => projectTagIds.has(t.id)).length : 0
      const bMatches = Array.isArray(b.tags) ? b.tags.filter(t => projectTagIds.has(t.id)).length : 0
      return bMatches - aMatches
    })
    .slice(0, 3)

  const donateMutation = useMutation({
    mutationFn: () => createDonation(Number(id), Number(amount)),
    onSuccess: () => {
      setDonationSuccess(true)
      setAmount('')
      queryClient.invalidateQueries({ queryKey: ['donation-summary', id] })
    },
    onError: (e: any) => {
      const data = e?.response?.data;
      const msg =
        data?.details?.non_field_errors?.[0] ||
        data?.details?.amount?.[0] ||
        data?.details?.project?.[0] ||
        data?.message ||
        'Donation failed. Please try again.';
      setDonationError(msg);
    },
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
  const handleReportProject = async () => {
    try {
      setReportError('')
      setReportSuccess('')
      await reportProject(Number(id), reportReason.trim() || undefined)
      setReportSuccess('Project reported successfully. Thank you for your feedback.')
      setReportReason('')
      setShowReportDialog(false)
      setTimeout(() => {
        setReportSuccess('')
      }, 4000)
    } catch (err: any) {
      const data = err?.response?.data
      const msg =
        data?.detail ||
        data?.message ||
        data?.error ||
        'Failed to report project'
      setReportError(msg)
    }
  }

  if (projectLoading) return <Spinner centered />
  if (!project) return <p className="text-center py-16 text-text-muted">Project not found.</p>

  const raised = summary?.totalDonated ?? project.totalDonated
  const target = summary?.totalTarget ?? project.totalTarget
  const remaining = summary?.remaining ?? (target - raised)
  const percent = getPercent(raised, target)
  const isOwner = !!user && user.id === project.ownerId
  const canCancel = isOwner && percent < 25 && project.status === 'running'

  const images = Array.isArray(project.pictures) ? project.pictures.map(i => i.image) : []
  const heroImg = images[0] ?? null
  const canReport = user && !isOwner

  return (
    <div className="bg-slate-50 min-h-screen pb-20 font-inter">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 pt-6">
        <div className="relative h-[380px] w-full overflow-hidden rounded-[2.5rem] shadow-2xl">
          {heroImg ? (
            <img
              src={getImageUrl(heroImg)}
              alt={project.title}
              className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
            />
          ) : (
            <div className="w-full h-full bg-linear-to-br from-brand-primary/40 to-brand-secondary/30" />
          )}

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-linear-to-t from-slate-900/90 via-slate-900/40 to-transparent" />

          {/* Content Overlay */}
          <div className="absolute inset-0 flex flex-col justify-end px-6 pb-12">
            <div className="max-w-7xl mx-auto w-full">
              <div className="flex flex-col gap-4 animate-in slide-in-from-bottom-6 duration-500">
                {project.category && (
                  <div className="flex items-center gap-2">
                    <span className="bg-brand-primary/95 backdrop-blur-md text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-lg">
                      {project.category.name}
                    </span>
                    <div className="h-px w-12 bg-white/30" />
                  </div>
                )}
                <h1 className="text-white text-4xl md:text-6xl font-black tracking-tight max-w-4xl leading-[1.1] break-all drop-shadow-2xl">
                  {project.title}
                </h1>
                <div className="flex items-center gap-4 text-white/80 text-sm font-medium">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-sm">
                      <UserIcon size={14} className="text-white" />
                    </div>
                    <span>by <span className="text-white font-bold">{project.owner}</span></span>
                  </div>
                  <div className="w-1 h-1 rounded-full bg-white/30" />
                  <span>Launched {formatDate(project.startTime)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 mt-12 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Main Content Area */}
        <div className="lg:col-span-8 space-y-10">
          {/* About Section */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl shadow-slate-200/50 p-8 md:p-10">
            <div className="flex items-center gap-3 mb-8">
              <div className="h-8 w-1.5 bg-brand-primary rounded-full" />
              <h2 className="text-2xl font-black text-slate-800 tracking-tight">About the Project</h2>
            </div>

            <p className="text-slate-600 leading-[1.8] break-words whitespace-pre-line text-lg font-medium tracking-tight">
              {project.details}
            </p>

            {project.tags?.length > 0 && (
              <div className="flex flex-wrap gap-2.5 mt-10 pt-8 border-t border-slate-100">
                {Array.isArray(project.tags) && project.tags.map(tag => (
                  <TagBadge key={tag.id} tag={tag.name} />
                ))}
              </div>
            )}
          </div>

          {/* Rating Section */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-lg p-2 overflow-hidden">
            <RatingSection
              projectId={Number(id)}
              isOwner={isOwner}
              isAuthenticated={!!user}
            />
          </div>

          {/* Comment Section */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-lg px-8">
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
              title="Campaign Discussion"
            />
          </div>
        </div>

        {/* Sidebar - Donation Card */}
        <div className="lg:col-span-4">
          <div className="sticky top-28 bg-white rounded-3xl border-2 border-slate-100 shadow-2xl shadow-slate-300/50 p-8 space-y-8 animate-in slide-in-from-right-8 duration-700 delay-200">
            {/* Progress Stats */}
            <div className="space-y-4">
              <div className="flex justify-between items-baseline">
                <span className="text-4xl font-black text-slate-900 tracking-tighter">
                  {formatEGP(raised)}
                </span>
                <span className="text-sm font-bold text-brand-primary bg-brand-primary/10 px-3 py-1 rounded-full">
                  {percent}%
                </span>
              </div>

              <ProgressBar percent={percent} />

              <div className="flex justify-between text-[11px] font-black text-slate-400 uppercase tracking-[0.15em]">
                <span>Raised so far</span>
                <span>Goal: {formatEGP(target)}</span>
              </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-3 gap-2 py-6 border-y border-slate-100">
              <div className="space-y-1">
                <p className="text-xl font-black text-slate-800 tracking-tighter">{formatEGP(remaining)}</p>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Remaining</p>
              </div>
              <div className="space-y-1 text-center">
                <p className="text-xl font-black text-slate-800 tracking-tighter">{summary?.donors_count || 0}</p>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Donations</p>
              </div>
              <div className="space-y-1 text-right">
                <p className="text-xl font-black text-slate-800 tracking-tighter">{daysLeft(project.endTime)}</p>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Days Left</p>
              </div>
            </div>

            {/* Action Section */}
            {project.status === 'running' && (
              <div className="space-y-4">
                {!user ? (
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-center">
                    <p className="text-sm text-slate-600">
                      <a href="/login" className="text-brand-primary font-bold hover:underline decoration-2 underline-offset-4">Sign in</a> to contribute to this cause.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleDonate} className="space-y-4">
                    <div className="relative group">
                      <input
                        type="number"
                        min={10}
                        placeholder="Contribution amount"
                        value={amount}
                        onChange={e => setAmount(e.target.value)}
                        className="w-full pl-6 pr-16 py-4 rounded-2xl bg-slate-50 border-2 border-slate-100 text-slate-900 font-bold focus:border-brand-primary focus:bg-white outline-none transition-all placeholder:text-slate-400"
                      />
                      <span className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm tracking-widest">EGP</span>
                    </div>

                    {donationError && (
                      <div className="p-3 bg-red-50 border border-red-100 rounded-xl">
                        <p className="text-xs text-red-600 font-bold text-center">{donationError}</p>
                      </div>
                    )}

                    {donationSuccess && (
                      <div className="p-3 bg-green-50 border border-green-100 rounded-xl">
                        <p className="text-xs text-green-600 font-bold text-center">Thank you for your support! ❤️</p>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={donateMutation.isPending}
                      className="w-full py-5 bg-brand-primary hover:bg-brand-primary/90 text-white rounded-2xl font-black text-lg transition-all shadow-[0_8px_30px_rgb(31,111,95,0.4)] hover:shadow-[0_8px_40px_rgb(31,111,95,0.6)] active:scale-[0.98] disabled:opacity-60 disabled:shadow-none flex items-center justify-center gap-3"
                    >
                      {donateMutation.isPending ? (
                        <>
                          <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>Processing...</span>
                        </>
                      ) : (
                        <>
                          <Heart size={20} fill="currentColor" />
                          <span>Donate Now</span>
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            )}

            {/* Campaign Meta */}
            <div className="pt-2 space-y-4">
              <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
                  <UserIcon size={18} className="text-slate-400" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Campaign by</p>
                  <p className="text-sm font-black text-slate-800">{project.owner}</p>
                </div>
              </div>

              {canReport && (
                <button
                  onClick={() => setShowReportDialog(true)}
                  className="w-full flex items-center justify-center gap-2 py-3 text-xs font-bold text-slate-400 hover:text-red-500 transition-colors uppercase tracking-widest"
                >
                  <Flag size={14} />
                  Report Campaign
                </button>
              )}
              {reportSuccess && (
                <div className="p-3 bg-green-50 border border-green-100 rounded-xl">
                  <p className="text-xs text-green-600 font-bold text-center">{reportSuccess}</p>
                </div>
              )}

              {isOwner && (
                <div className="flex flex-col gap-3">
                  <Button
                    variant="secondary"
                    className="w-full rounded-2xl py-4 bg-slate-100 hover:bg-slate-200 border-none text-slate-800 font-bold"
                    onClick={() => navigate(`/projects/${id}/edit`)}
                  >
                    Edit Workspace
                  </Button>
                  {canCancel && (
                    <Button
                      variant="danger"
                      className="w-full rounded-2xl py-4"
                      loading={cancelMutation.isPending}
                      onClick={() => cancelMutation.mutate()}
                    >
                      Cancel Campaign
                    </Button>
                  )}
                  {cancelError && <Alert type="error" message={cancelError} />}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {
        similar.length > 0 && (
          <section className="max-w-7xl mx-auto px-6 mt-24">
            <div className="flex items-center gap-4 mb-10">
              <div className="h-8 w-1.5 bg-slate-300 rounded-full" />
              <h3 className="text-3xl font-black text-slate-800 tracking-tighter">Recommended For You</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {Array.isArray(similar) && similar.map(p => <ProjectCard key={p.id} project={p} />)}
            </div>
          </section>
        )
      }

      {showReportDialog && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-6">
          <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-200">
            <h3 className="text-2xl font-black text-slate-900 tracking-tight mb-2">Report Campaign</h3>
            <p className="text-slate-500 text-sm mb-6 font-medium">Help us keep FundEgypt safe. Tell us why you're reporting this project.</p>

            <textarea
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
              placeholder="Provide a reason (privacy, fraud, spam...)"
              className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 text-sm outline-none focus:border-brand-primary transition-all min-h-[120px] font-medium"
            />

            {reportError && (
              <p className="mt-3 text-xs text-red-500 font-bold">{reportError}</p>
            )}

            <div className="flex gap-3 mt-8">
              <Button
                variant="secondary"
                className="flex-1 rounded-2xl py-4 font-bold"
                onClick={() => setShowReportDialog(false)}
              >
                Cancel
              </Button>
              <Button
                className="flex-1 rounded-2xl py-4 bg-red-500 hover:bg-red-600 text-white border-none font-bold shadow-lg shadow-red-200"
                onClick={handleReportProject}
              >
                Submit
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
