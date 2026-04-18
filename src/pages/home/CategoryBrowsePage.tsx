import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getCategories } from '../../services/categoryService'
import Spinner from '../../components/ui/Spinner'

export default function CategoryBrowsePage() {
  const { data: categories, isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
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

  return (
    <div className="bg-surface-page min-h-screen">
      <div className="max-w-7xl mx-auto px-8 pb-16">
        {/* Breadcrumbs */}
        <div className="my-8 flex items-center gap-2 text-sm">
          <Link to="/" className="text-brand-primary hover:text-brand-secondary transition-colors">
            Home
          </Link>
          <span className="text-text-muted">/</span>
          <span className="text-text-primary font-medium">Categories</span>
        </div>

        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-text-primary mb-3">Explore Categories</h1>
          <p className="text-text-muted text-lg">Browse projects by category and find causes that matter to you.</p>
        </div>

        {/* Categories Grid */}
        {categories && categories.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
            {Array.isArray(categories) && categories.map(category => (
              <Link
                key={category.id}
                to={`/categories/${category.id}`}
                className="group flex flex-col items-center gap-3 p-5 rounded-xl hover:bg-surface-card transition-all duration-300"
              >
                <div className="w-20 h-20 rounded-2xl bg-brand-mint flex items-center justify-center group-hover:bg-brand-primary transition-all duration-300 shadow-sm group-hover:shadow-md">
                  {category.icon ? (
                    <img src={category.icon} alt={category.name} className="w-10 h-10 object-contain" />
                  ) : (
                    <span className="text-brand-primary group-hover:text-white font-bold text-2xl transition-colors">
                      {category.name.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                <span className="text-sm font-semibold text-text-body text-center leading-tight line-clamp-2 group-hover:text-text-primary transition-colors">
                  {category.name}
                </span>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-surface-card rounded-2xl">
            <p className="text-lg font-medium text-text-primary mb-2">No categories found</p>
            <p className="text-text-muted">Categories will appear here soon.</p>
          </div>
        )}
      </div>
    </div>
  )
}
