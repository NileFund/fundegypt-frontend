import { useSearchParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { getProjects } from '../../services/projectService'
import ProjectCard from '../../components/ui/ProjectCard'
import SearchBar from '../../components/ui/SearchBar'
import Spinner from '../../components/ui/Spinner'
import { type Project } from '../../types'
import Button from '../../components/ui/Button'

export default function SearchResultsPage() {
  const [searchParams] = useSearchParams()
  const query = searchParams.get('q') || ''
  const [sortBy, setSortBy] = useState<'relevant' | 'newest' | 'rating' | 'popular'>('relevant')

  const { data: searchData, isLoading, error } = useQuery({
    queryKey: ['projects', 'search', query],
    queryFn: () => getProjects({ search: query }),
    enabled: query.length > 0,
  })

  const results = (searchData?.results ?? []) as Project[]

  const sortedResults = [...results].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
      case 'rating':
        return (b.averageRating ?? 0) - (a.averageRating ?? 0)
      case 'popular':
        return (b.totalDonated ?? 0) - (a.totalDonated ?? 0)
      case 'relevant':
      default:
        return 0
    }
  })

  if (!query) {
    return (
      <div className="min-h-screen bg-surface-page">
        <SearchBar showInSearchPage />
        <div className="max-w-7xl mx-auto px-8 py-12">
          <div className="text-center text-text-muted">
            <p className="text-lg font-medium">No search query provided</p>
            <p className="text-sm mt-2">Try entering a search term to find projects.</p>
          </div>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-surface-page">
        <SearchBar showInSearchPage />
        <div className="max-w-7xl mx-auto px-8 py-24">
          <Spinner centered />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-surface-page">
        <SearchBar showInSearchPage />
        <div className="max-w-7xl mx-auto px-8 py-24">
          <div className="text-center text-text-muted">
            <p className="text-lg font-medium">Error loading search results</p>
            <p className="text-sm mt-2">Please try again later.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-surface-page min-h-screen">
      <div className="mt-8 pb-12">
        <SearchBar showInSearchPage />
      </div>

      <div className="max-w-7xl mx-auto px-8 pb-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-text-primary mb-2">
            Search Results
          </h1>
          <p className="text-text-muted text-lg">
            {results.length} {results.length === 1 ? 'result' : 'results'} found for <span className="font-semibold text-text-primary">"{query}"</span>
          </p>
        </div>

        {/* Sort Controls */}
        {results.length > 0 && (
          <div className="mb-8 flex items-center gap-4">
            <span className="text-text-muted text-sm font-medium">Sort by:</span>
            <div className="flex gap-2">
              {(['relevant', 'newest', 'rating', 'popular'] as const).map(sort => (
                <Button
                  key={sort}
                  onClick={() => setSortBy(sort)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${sortBy === sort
                    ? 'bg-brand-primary text-white'
                    : 'bg-surface-card text-text-body hover:bg-surface-card/80'
                    }`}
                >
                  {sort === 'relevant' && 'Most Relevant'}
                  {sort === 'newest' && 'Newest'}
                  {sort === 'rating' && 'Highest Rated'}
                  {sort === 'popular' && 'Most Popular'}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Results Grid */}
        {sortedResults.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.isArray(sortedResults) && sortedResults.map(project => (
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
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <p className="text-lg font-medium text-text-primary mb-2">No projects found</p>
            <p className="text-text-muted text-sm">
              Try adjusting your search terms or browse by category.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
