import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useNavigate, Link } from 'react-router-dom'
import { getProjects } from '../../services/projectService'
import { getCategories } from '../../services/categoryService'
import ProjectCard from '../../components/ui/ProjectCard'
import ProgressBar from '../../components/ui/ProgressBar'
import Spinner from '../../components/ui/Spinner'
import { formatEGP } from '../../utils/formatters'
import { type Project } from '../../types'

function daysLeft(endTime: string): number {
  return Math.max(0, Math.ceil((new Date(endTime).getTime() - Date.now()) / 86_400_000))
}

function TrendingCard({ project }: { project: Project }) {
  const cover = project.pictures?.[0]?.image
  const pct = project.donationPercentage ?? 0
  const remaining = daysLeft(project.endTime)

  return (
    <Link
      to={`/projects/${project.id}`}
      className="shrink-0 w-85 bg-surface-card rounded-2xl overflow-hidden shadow-md group hover:shadow-xl transition-all duration-300"
    >
      <div className="h-52 overflow-hidden">
        {cover ? (
          <img
            src={cover}
            alt={project.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-brand-mint flex items-center justify-center text-brand-primary text-sm">
            No image
          </div>
        )}
      </div>

      <div className="p-6">
        <h3 className="text-base font-bold text-text-primary mb-4 line-clamp-2 group-hover:text-brand-primary transition-colors">
          {project.title}
        </h3>

        <div className="space-y-3">
          <ProgressBar percent={pct} />

          <div className="flex justify-between items-center pt-1">
            <div className="flex flex-col">
              <span className="text-xs text-text-muted">Raised</span>
              <span className="font-bold text-text-primary text-sm">{formatEGP(project.totalDonated)}</span>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-xs text-text-muted">Days Left</span>
              <span className="font-bold text-text-primary text-sm">{remaining} days</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default function HomePage() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')

  const { data: runningData, isLoading } = useQuery({
    queryKey: ['projects', { status: 'running' }],
    queryFn: () => getProjects({ status: 'running' }),
  })

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
  })

  const allRunning = runningData?.results ?? []

  const trendingProjects = [...allRunning]
    .sort((a, b) => (b.averageRating ?? 0) - (a.averageRating ?? 0))
    .slice(0, 8)

  const featuredProjects = allRunning.filter(p => p.isFeatured).slice(0, 6)
  const latestProjects = [...allRunning].slice(0, 6)

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    if (search.trim()) navigate(`/search?q=${encodeURIComponent(search.trim())}`)
  }

  return (
    <div>
     
      <section className="relative bg-brand-secondary overflow-hidden">
     
        <div className="absolute inset-0 bg-linear-to-br from-brand-secondary via-brand-secondary to-[#0D4438] pointer-events-none" />
        <div className="relative z-10 max-w-7xl mx-auto px-8 py-24 md:py-32">
          <div className="max-w-2xl">
            <h1 className="text-white text-5xl md:text-6xl font-bold leading-tight tracking-tight mb-6">
              Fund Your Dream,<br />
              <span className="text-brand-success">Change Egypt</span>
            </h1>
            <p className="text-white/80 text-lg mb-10 max-w-lg leading-relaxed">
              Empowering Egyptian entrepreneurs and changemakers. Join a growing community of backers building a better future.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/projects/create"
                className="bg-brand-primary hover:bg-[#278a72] text-white px-8 py-4 rounded-lg font-bold text-base transition-all duration-200 shadow-lg shadow-black/20"
              >
                Start Your Campaign
              </Link>
            </div>
          </div>
        </div>
      </section>


      <div className="relative z-20 -mt-8 px-4 sm:px-8">
        <div className="max-w-3xl mx-auto">
          <form
            onSubmit={handleSearch}
            className="bg-surface-card rounded-xl shadow-2xl flex items-center gap-3 px-4 py-3"
          >
            <svg className="w-5 h-5 text-text-muted shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
            </svg>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search for projects, categories, or causes..."
              className="flex-1 border-none outline-none text-text-body text-sm bg-transparent py-2"
            />
            <button
              type="submit"
              className="bg-brand-primary hover:bg-[#278a72] text-white px-6 py-2.5 rounded-lg text-sm font-semibold transition-colors shrink-0"
            >
              Search
            </button>
          </form>
        </div>
      </div>

  
      {categories && categories.length > 0 && (
        <section className="bg-surface-card py-16 mt-4">
          <div className="max-w-7xl mx-auto px-8">
            <div className="flex items-center justify-between mb-10">
              <h2 className="text-xl font-bold text-text-primary tracking-tight">Browse by Category</h2>
              <Link to="/categories" className="text-sm font-semibold text-brand-primary hover:underline">
                View all
              </Link>
            </div>

            <div className="flex gap-6 overflow-x-auto pb-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              {categories.map(c => (
                <Link
                  key={c.id}
                  to={`/categories/${c.id}`}
                  className="shrink-0 flex flex-col items-center gap-3 group cursor-pointer"
                >
                  <div className="w-16 h-16 rounded-2xl bg-brand-mint flex items-center justify-center group-hover:bg-brand-primary transition-all duration-300">
                    {c.icon ? (
                      <img src={c.icon} alt={c.name} className="w-8 h-8 object-contain" />
                    ) : (
                      <span className="text-brand-primary group-hover:text-white font-bold text-lg transition-colors">
                        {c.name.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <span className="text-xs font-semibold text-text-body text-center max-w-18 leading-tight">
                    {c.name}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {isLoading ? (
        <div className="py-24">
          <Spinner centered />
        </div>
      ) : (
        <>
          {trendingProjects.length > 0 && (
            <section className="py-16 bg-surface-page overflow-hidden">
              <div className="max-w-7xl mx-auto px-8">
                <div className="flex items-end justify-between mb-10">
                  <div>
                    <span className="text-xs font-bold tracking-[0.2em] text-brand-primary uppercase">
                      Trending Projects
                    </span>
                    <h2 className="text-3xl font-bold text-text-primary mt-1">Top Performing Today</h2>
                  </div>
                  <Link to="/projects" className="text-sm font-semibold text-brand-primary hover:underline flex items-center gap-1">
                    View all →
                  </Link>
                </div>

                <div className="flex gap-6 overflow-x-auto pb-4 -mx-8 px-8 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                  {trendingProjects.map(p => (
                    <TrendingCard key={p.id} project={p} />
                  ))}
                </div>
              </div>
            </section>
          )}

          {featuredProjects.length > 0 && (
            <section className="py-16 bg-surface-card">
              <div className="max-w-7xl mx-auto px-8">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
                  <div>
                    <span className="text-xs font-bold tracking-[0.2em] text-brand-primary uppercase block mb-2">
                      Handpicked for you
                    </span>
                    <h2 className="text-3xl font-bold text-text-primary leading-tight">
                      Featured Projects
                    </h2>
                  </div>
                  <Link to="/projects?featured=true" className="text-sm font-semibold text-brand-primary hover:underline flex items-center gap-1">
                    View all featured →
                  </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {featuredProjects.map(p => (
                    <ProjectCard key={p.id} project={p} />
                  ))}
                </div>
              </div>
            </section>
          )}

          {latestProjects.length > 0 && (
            <section className="py-16 bg-surface-page">
              <div className="max-w-7xl mx-auto px-8">
                <div className="flex items-end justify-between mb-10">
                  <div>
                    <h2 className="text-3xl font-bold text-text-primary">Latest Projects</h2>
                    <p className="text-text-muted mt-2 text-sm">Be the first to back these fresh ideas from Egypt.</p>
                  </div>
                  <Link to="/projects" className="text-sm font-semibold text-brand-primary hover:underline flex items-center gap-1">
                    View all →
                  </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {latestProjects.map(p => (
                    <ProjectCard key={p.id} project={p} />
                  ))}
                </div>
              </div>
            </section>
          )}

          {allRunning.length === 0 && (
            <div className="py-24 text-center text-text-muted">
              <p className="text-lg font-medium">No active projects yet.</p>
              <p className="text-sm mt-2">Be the first to start a campaign!</p>
              <Link
                to="/projects/create"
                className="inline-block mt-6 bg-brand-primary text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#278a72] transition-colors"
              >
                Start a Campaign
              </Link>
            </div>
          )}
        </>
      )}
    </div>
  )
}
