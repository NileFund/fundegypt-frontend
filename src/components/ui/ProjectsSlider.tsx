import { useState, useEffect, useCallback } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'   // <-- import Link
import Button from './Button'

interface Project {
  id: string | number
  title: string
  pictures?: { image: string }[]
}

interface ProjectsSliderProps {
  projects: Project[]
  autoPlay?: boolean
  autoPlayInterval?: number
  showIndicators?: boolean
  showArrows?: boolean
  className?: string
  showTitle?: boolean
  height?: string
  placeholderImageUrl?: string
}

const DEFAULT_PLACEHOLDER = 'https://placehold.co/800x500?text=No+Image'

export default function ProjectsSlider({
  projects,
  autoPlay = false,
  autoPlayInterval = 5000,
  showIndicators = true,
  showArrows = true,
  className = '',
  showTitle = true,
  height = 'h-96',
  placeholderImageUrl = DEFAULT_PLACEHOLDER,
}: ProjectsSliderProps) {
  const [current, setCurrent] = useState(0)

  const next = useCallback(() => {
    setCurrent((i) => (i + 1) % projects.length)
  }, [projects.length])

  const prev = useCallback(() => {
    setCurrent((i) => (i - 1 + projects.length) % projects.length)
  }, [projects.length])

  useEffect(() => {
    if (!autoPlay || projects.length <= 1) return
    const interval = setInterval(next, autoPlayInterval)
    return () => clearInterval(interval)
  }, [autoPlay, autoPlayInterval, projects.length, next])

  if (projects.length === 0) {
    return (
      <div className={`bg-gray-100 rounded-xl flex items-center justify-center ${height} ${className}`}>
        <p className="text-text-muted text-sm">No projects to display</p>
      </div>
    )
  }

  const currentProject = projects[current]
  const imageUrl = currentProject.pictures?.[0]?.image || placeholderImageUrl

  return (
    <div className={`relative overflow-hidden rounded-xl ${height} ${className}`}>
      <Link
        to={`/projects/${currentProject.id}`}
        className="block w-full h-full"
      >
        <img
          src={imageUrl}
          alt={currentProject.title}
          className="w-full h-full object-cover"
        />
        {showTitle && (
          <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/70 to-transparent p-4">
            <h3 className="text-white font-bold text-lg">{currentProject.title}</h3>
          </div>
        )}
      </Link>

      {showArrows && projects.length > 1 && (
        <>
          <Button
            onClick={prev}
            className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full p-1 transition-colors z-10"
          >
            <ChevronLeft size={20} />
          </Button>
          <Button
            onClick={next}
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full p-1 transition-colors z-10"
          >
            <ChevronRight size={20} />
          </Button>
        </>
      )}

      {showIndicators && projects.length > 1 && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
          {Array.isArray(projects) && projects.map((_, idx) => (
            <Button
              key={idx}
              onClick={() => setCurrent(idx)}
              className={`w-2 h-2 rounded-full transition-colors ${idx === current ? 'bg-white' : 'bg-white/50'}`}
              children={undefined}
            />
          ))}
        </div>
      )}
    </div>
  )
}