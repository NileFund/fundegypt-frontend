import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { getCategories } from '../../services/categoryService'
import ProjectCard from '../../components/ui/ProjectCard'
import ProgressBar from '../../components/ui/ProgressBar'
import Spinner from '../../components/ui/Spinner'
import ProjectsSlider from '../../components/ui/ProjectsSlider'
import SearchBar from '../../components/ui/SearchBar'
import { formatEGP } from '../../utils/formatters'
import { type Project } from '../../types'
import { Star, ChevronRight } from 'lucide-react'
import { getFeaturedProjects, getLatestProjects, getTopRatedProjects } from '../../services/projectService'

function daysLeft(endTime: string): number {
  return Math.max(0, Math.ceil((new Date(endTime).getTime() - Date.now()) / 86_400_000))
}

function TopRatedCard({ project }: { project: Project }) {
  const cover = project.pictures?.[0]?.image
  const pct = project.donationPercentage ?? 0
  const remaining = daysLeft(project.endTime)
  const rating = project.averageRating ?? 0

  return (
    <Link
      to={`/projects/${project.id}`}
      className="group relative h-full overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300"
    >
      <div className="absolute inset-0">
        {cover ? (
          <img
            src={cover}
            alt={project.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-brand-mint flex items-center justify-center text-brand-primary">
            No image
          </div>
        )}
        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />
      </div>

      <div className="absolute inset-0 flex flex-col justify-between p-6">
        <div className="flex justify-between items-start">
          <div className="bg-brand-primary/90 backdrop-blur-sm text-white px-4 py-2 rounded-lg">
            <p className="text-sm font-bold"> <Star className="w-4 h-4 fill-current text-yellow-400" /> {rating.toFixed(1)}</p>
          </div>
          <div className="bg-black/50 backdrop-blur-sm text-white px-3 py-1 rounded-lg text-xs font-semibold">
            {remaining} days
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-white font-bold text-xl line-clamp-2 group-hover:text-brand-primary transition-colors">
            {project.title}
          </h3>

          <div className="space-y-2">
            <div className="flex justify-between items-center text-white text-sm">
              <span className="opacity-80">Raised</span>
              <span className="font-bold">{formatEGP(project.totalDonated)}</span>
            </div>
            <ProgressBar percent={pct} />
          </div>
        </div>
      </div>
    </Link>
  )
}

export default function HomePage() {
  const { data: topRatedData, isLoading: topRatedLoading } = useQuery({
    queryKey: ['projects', 'top_rated'],
    queryFn: () => getTopRatedProjects(),
  })

  const { data: featuredData, isLoading: featuredLoading } = useQuery({
    queryKey: ['projects', 'featured'],
    queryFn: () => getFeaturedProjects(),
  })

  const { data: latestData, isLoading: latestLoading } = useQuery({
    queryKey: ['projects', 'latest'],
    queryFn: () => getLatestProjects(),
  })

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
  })

  const topRatedProjects = (topRatedData ?? []).slice(0, 5)
  const featuredProjects = (featuredData ?? []).slice(0, 5)
  const latestProjects = (latestData ?? []).slice(0, 5)

  const isLoading = topRatedLoading || featuredLoading || latestLoading

  const sliderItems = Array.isArray(topRatedProjects) && topRatedProjects.map(p => ({
    id: p.id,
    image: p.pictures?.[0]?.image || '',
    title: p.title,
    component: <TopRatedCard project={p} />,
  }))

  return (
    <div>
      {/* Hero Section */}
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

      {/* Search Bar */}
      <SearchBar />

      {/* Categories Section */}
      {categories && categories.length > 0 && (
        <section className="bg-surface-card py-16 mt-4">
          <div className="max-w-7xl mx-auto px-8">
            <div className="flex items-center justify-between mb-10">
              <h2 className="text-xl font-bold text-text-primary tracking-tight">Browse by Category</h2>
              <Link to="/categories" className="text-sm font-semibold text-brand-primary hover:underline flex items-center gap-1">
                View all <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="flex gap-6 overflow-x-auto pb-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              {Array.isArray(categories) && categories.map(c => (
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
          {/* Top Rated Slider Section */}
          {topRatedProjects.length > 0 && (
            <section className="py-16 bg-surface-page overflow-hidden">
              <div className="max-w-7xl mx-auto px-8">
                <div className="flex items-end justify-between mb-10">
                  <div>
                    <span className="text-xs font-bold tracking-[0.2em] text-brand-primary uppercase">
                      Highest Rated
                    </span>
                    <h2 className="text-3xl font-bold text-text-primary mt-1">Top Projects to Support</h2>
                    <p className="text-text-muted mt-2 text-sm">Support these highly-rated projects and make an impact.</p>
                  </div>
                  <Link to="/projects?ordering=rating" className="text-sm font-semibold text-brand-primary hover:underline flex items-center gap-1">
                    View all <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>

                {Array.isArray(sliderItems) && sliderItems.length > 0 ? (
                  <ProjectsSlider
                    projects={topRatedProjects}
                    autoPlay
                    autoPlayInterval={5000}
                    showIndicators
                    showArrows
                    showTitle
                    height="h-96"
                  />
                ) : (
                  <div className="h-96 bg-surface-card rounded-2xl flex items-center justify-center text-text-muted">
                    <p>No rated projects available</p>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* Featured Projects Section */}
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
                    <p className="text-text-muted mt-2 text-sm">Projects selected by our team for exceptional impact.</p>
                  </div>
                  <Link to="/projects?featured=true" className="text-sm font-semibold text-brand-primary hover:underline flex items-center gap-1">
                    View all featured <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Array.isArray(featuredProjects) && featuredProjects.map(p => (
                    <ProjectCard key={p.id} project={p} />
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Latest Projects Section */}
          {latestProjects.length > 0 && (
            <section className="py-16 bg-surface-page">
              <div className="max-w-7xl mx-auto px-8">
                <div className="flex items-end justify-between mb-10">
                  <div>
                    <h2 className="text-3xl font-bold text-text-primary">Latest Projects</h2>
                    <p className="text-text-muted mt-2 text-sm">Be the first to back these fresh ideas from Egypt.</p>
                  </div>
                  <Link to="/projects?ordering=newest" className="text-sm font-semibold text-brand-primary hover:underline flex items-center gap-1">
                    View all <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Array.isArray(latestProjects) && latestProjects.map(p => (
                    <ProjectCard key={p.id} project={p} />
                  ))}
                </div>
              </div>
            </section>
          )}

          {topRatedProjects.length === 0 && featuredProjects.length === 0 && latestProjects.length === 0 && (
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
