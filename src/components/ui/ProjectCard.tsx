import { Link } from 'react-router-dom'
import { type Project } from '../../types'
import { formatEGP, getPercent } from '../../utils/formatters'

interface ProjectCardProps {
  project: Project
}

function daysLeft(endTime: string): number {
  return Math.max(0, Math.ceil((new Date(endTime).getTime() - Date.now()) / 86_400_000))
}

function barColor(percent: number): string {
  if (percent < 25)  return 'bg-danger'
  if (percent < 75)  return 'bg-warning'
  return 'bg-brand-success'
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const percent    = getPercent(project.totalDonated, project.totalTarget)
  const coverImage = project.pictures?.[0]?.image
  const days       = daysLeft(project.endTime)

  return (
    <Link
      to={`/projects/${project.id}`}
      className="group rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 block hover:-translate-y-1"
    >
      <div className="relative h-44 bg-gray-200 overflow-hidden">
        {coverImage ? (
          <img
            src={coverImage}
            alt={project.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-linear-to-br from-brand-primary/40 to-brand-secondary/30" />
        )}

        {project.category && (
          <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-brand-primary px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider">
            {project.category.name}
          </span>
        )}

        <span className={`absolute top-3 right-3 px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
          days <= 3 ? 'bg-red-500 text-white' :
          days <= 7 ? 'bg-amber-400 text-white' :
                      'bg-brand-primary text-white'
        }`}>
          {days === 0 ? 'Ended' : `${days}d left`}
        </span>
      </div>

      <div className="bg-white px-4 pt-4 pb-5 flex flex-col gap-3 shadow-[0_4px_20px_rgba(0,0,0,0.10)] -mt-2 relative z-10 rounded-b-xl">
        <h3 className="font-semibold text-text-primary line-clamp-2 text-sm leading-snug">
          {project.title}
        </h3>

        <p className="text-base font-bold text-brand-primary">
          {formatEGP(project.totalDonated)}
          <span className="text-xs font-normal text-text-muted ml-1">raised</span>
        </p>

        <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${barColor(percent)}`}
            style={{ width: `${percent}%` }}
          />
        </div>

        <div className="flex justify-between items-center text-xs text-text-muted">
          <span>Goal: {formatEGP(project.totalTarget)}</span>
          <span className="font-bold text-text-primary">{percent}%</span>
        </div>
      </div>
    </Link>
  )
}
