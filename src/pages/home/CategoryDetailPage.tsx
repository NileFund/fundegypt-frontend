import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { getProjects } from '../../services/projectService'
import { getCategories } from '../../services/categoryService'
import ProjectCard from '../../components/ui/ProjectCard'
import Spinner from '../../components/ui/Spinner'
import { type Project } from '../../types'
import Button from '../../components/ui/Button'

export default function CategoryDetailPage() {
  const { id } = useParams()
  const [sortBy, setSortBy] = useState<'newest' | 'rating' | 'popular'>('newest')

  const categoryId = id ? parseInt(id) : null

  const { data: categories, isLoading: categoriesLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
  })

  const { data: projectsData, isLoading: projectsLoading } = useQuery({
    queryKey: ['projects', 'category', categoryId],
    queryFn: () => getProjects({ category: categoryId! }),
    enabled: categoryId !== null && !Number.isNaN(categoryId),
  })

  const projects = (projectsData?.results ?? []) as Project[]
  const selectedCategory = categories?.find(c => c.id === categoryId)
  const isLoading = categoriesLoading || projectsLoading

  const sortedProjects = [...projects].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
      case 'rating':
        return (b.averageRating ?? 0) - (a.averageRating ?? 0)
      case 'popular':
        return (b.totalDonated ?? 0) - (a.totalDonated ?? 0)
      default:
        return 0
    }
  })

  if (isLoading) {
    return (
      <div className="min-h-screen bg-surface-page">
        <div className="max-w-7xl mx-auto px-8 py-24">
          <Spinner centered />
        </div>
      </div>
    )
  }

  if (!selectedCategory) {
    return (
      <div className="min-h-screen bg-surface-page">
        <div className="max-w-7xl mx-auto px-8 py-24">
          <div className="text-center text-text-muted">
            <p className="text-lg font-medium">Category not found</p>
            <Link to="/categories" className="inline-block mt-4 text-brand-primary hover:text-brand-secondary transition-colors font-medium">
              ← Back to categories
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-surface-page min-h-screen">
      <div className="max-w-7xl mx-auto px-8 pb-16">
        {/* Breadcrumbs */}
        <div className="my-8 flex items-center gap-2 text-sm">
          <Link to="/" className="text-brand-primary hover:text-brand-secondary transition-colors">
            Home
          </Link>
          <span className="text-text-muted">/</span>
          <Link to="/categories" className="text-brand-primary hover:text-brand-secondary transition-colors">
            Categories
          </Link>
          <span className="text-text-muted">/</span>
          <span className="text-text-primary font-medium">{selectedCategory.name}</span>
        </div>

        {/* Category Header */}
        <div className="mb-12">
          <div className="flex items-start gap-6 mb-6">
            <div className="w-24 h-24 rounded-2xl bg-brand-mint flex items-center justify-center shrink-0 shadow-md">
              {selectedCategory.icon ? (
                <img src={selectedCategory.icon} alt={selectedCategory.name} className="w-12 h-12 object-contain" />
              ) : (
                <span className="text-brand-primary font-bold text-3xl">
                  {selectedCategory.name.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-text-primary mb-2">{selectedCategory.name}</h1>
              <p className="text-text-muted text-lg mb-4">
                {projects.length} {projects.length === 1 ? 'project' : 'projects'} in this category
              </p>
              {selectedCategory.description && (
                <p className="text-text-body text-base leading-relaxed max-w-3xl">{selectedCategory.description}</p>
              )}
            </div>
          </div>
        </div>

        {/* Sort Controls */}
        {projects.length > 0 && (
          <div className="mb-8 flex items-center gap-4 flex-wrap">
            <span className="text-text-muted text-sm font-medium">Sort by:</span>
            <div className="flex gap-2">
              {(['newest', 'rating', 'popular'] as const).map(sort => (
                <Button
                  key={sort}
                  onClick={() => setSortBy(sort)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${sortBy === sort
                    ? 'bg-brand-primary text-white shadow-md'
                    : 'bg-surface-card text-text-body hover:bg-surface-card/80'
                    }`}
                >
                  {sort === 'newest' && 'Newest First'}
                  {sort === 'rating' && 'Highest Rated'}
                  {sort === 'popular' && 'Most Funded'}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Projects Grid */}
        {sortedProjects.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedProjects.map(project => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-surface-card rounded-2xl">
            <svg
              className="w-16 h-16 mx-auto text-text-muted mb-4 opacity-50"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
              />
            </svg>
            <p className="text-lg font-medium text-text-primary mb-2">No projects yet</p>
            <p className="text-text-muted">Projects in this category will appear here soon.</p>
          </div>
        )}
      </div>
    </div>
  )
}