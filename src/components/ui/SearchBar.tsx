import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

interface SearchBarProps {
  placeholder?: string
  showInSearchPage?: boolean
}

export default function SearchBar({
  placeholder = 'Search for projects, categories, or causes...',
  showInSearchPage = false
}: SearchBarProps) {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    if (search.trim()) navigate(`/search?q=${encodeURIComponent(search.trim())}`)
  }

  return (
    <div className={`${showInSearchPage ? 'max-w-7xl mx-auto px-8' : 'relative z-20 -mt-8 px-4 sm:px-8'}`}>
      <div className={showInSearchPage ? 'mb-12' : 'max-w-3xl mx-auto'}>
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
            placeholder={placeholder}
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
  )
}