import { useQuery } from '@tanstack/react-query'
import { useSearchParams } from 'react-router-dom'
import { getProjects } from '../../services/projectService'
import { getCategories } from '../../services/categoryService'
import ProjectCard from '../../components/ui/ProjectCard'
import Spinner from '../../components/ui/Spinner'

export default function ExplorePage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const status   = searchParams.get('status') ?? ''
  const category = searchParams.get('category') ?? ''
  const page     = Number(searchParams.get('page') ?? 1)

  const { data, isLoading } = useQuery({
    queryKey: ['projects', { status, category, page }],
    queryFn: () => getProjects({
      status:   status   || undefined,
      category: category ? Number(category) : undefined,
      page,
    }),
  })

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
  })

  function setFilter(key: string, value: string) {
    const next = new URLSearchParams(searchParams)
    if (value) next.set(key, value)
    else next.delete(key)
    if (key !== 'page') next.delete('page')   // reset to page 1 when filters change
    setSearchParams(next)
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-text-primary mb-6">Explore Projects</h1>

      <div className="flex flex-wrap gap-3 mb-8">
        <select
          value={status}
          onChange={e => setFilter('status', e.target.value)}
          className="px-3 py-2 rounded-lg border border-gray-300 text-sm bg-white outline-none focus:border-brand-primary"
        >
          <option value="">All statuses</option>
          <option value="running">Running</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
        </select>

        <select
          value={category}
          onChange={e => setFilter('category', e.target.value)}
          className="px-3 py-2 rounded-lg border border-gray-300 text-sm bg-white outline-none focus:border-brand-primary"
        >
          <option value="">All categories</option>
          {categories?.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      {isLoading ? (
        <Spinner centered />
      ) : data?.results.length === 0 ? (
        <p className="text-text-muted text-center py-16">No projects found.</p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {data?.results.map(project => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>

          <div className="flex justify-center gap-3 mt-10">
            <button
              disabled={!data?.previous}
              onClick={() => setFilter('page', String(page - 1))}
              className="px-4 py-2 rounded-lg border text-sm disabled:opacity-40 hover:bg-gray-50"
            >Previous</button>
            <span className="px-4 py-2 text-sm text-text-muted">Page {page}</span>
            <button
              disabled={!data?.next}
              onClick={() => setFilter('page', String(page + 1))}
              className="px-4 py-2 rounded-lg border text-sm disabled:opacity-40 hover:bg-gray-50"
            >Next</button>
          </div>
        </>
      )}
    </div>
  )
}
