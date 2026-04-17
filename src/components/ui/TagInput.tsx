import { useState, useRef, useEffect } from 'react'
import { X } from 'lucide-react'
import { type Tag } from '../../types'

interface TagInputProps {
  value: string[]                    // selected tag names
  onChange: (tags: string[]) => void
  suggestions: Tag[]                 // existing tags from backend
}

export default function TagInput({ value, onChange, suggestions }: TagInputProps) {
  const [input, setInput] = useState('')
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const query = input.trim().toLowerCase()

  const filtered = suggestions.filter(
    t => t.name.includes(query) && !value.includes(t.name)
  )

  const canCreate =
    query.length > 0 &&
    !suggestions.some(t => t.name === query) &&
    !value.includes(query)

  function addTag(name: string) {
    const clean = name.trim().toLowerCase()
    if (!clean || value.includes(clean)) return
    onChange([...value, clean])
    setInput('')
    setOpen(false)
  }

  function removeTag(name: string) {
    onChange(value.filter(t => t !== name))
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if ((e.key === 'Enter' || e.key === ',') && query) {
      e.preventDefault()
      // pick top suggestion if exact prefix match, else create new
      if (filtered.length > 0 && filtered[0].name === query) {
        addTag(filtered[0].name)
      } else {
        addTag(query)
      }
    }
    if (e.key === 'Backspace' && !input && value.length > 0) {
      removeTag(value[value.length - 1])
    }
  }

  const showDropdown = open && (filtered.length > 0 || canCreate)

  return (
    <div ref={containerRef} className="relative">
      {/* Input + chips box */}
      <div
        className="min-h-[46px] w-full flex flex-wrap gap-1.5 items-center px-3 py-2 rounded-lg ring-1 ring-gray-200 focus-within:ring-2 focus-within:ring-brand-primary transition-all bg-white cursor-text"
        onClick={() => { setOpen(true) }}
      >
        {value.map(tag => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-brand-primary text-white"
          >
            #{tag}
            <button
              type="button"
              onClick={e => { e.stopPropagation(); removeTag(tag) }}
              className="hover:opacity-70 transition-opacity"
            >
              <X size={11} />
            </button>
          </span>
        ))}

        <input
          value={input}
          onChange={e => { setInput(e.target.value); setOpen(true) }}
          onKeyDown={handleKeyDown}
          onFocus={() => setOpen(true)}
          placeholder={value.length === 0 ? 'Type to search or create tags…' : ''}
          className="flex-1 min-w-24 text-sm text-text-body outline-none bg-transparent placeholder:text-text-muted"
        />
      </div>

      {/* Dropdown */}
      {showDropdown && (
        <ul className="absolute z-30 mt-1 w-full bg-white rounded-lg shadow-lg border border-gray-100 max-h-48 overflow-y-auto py-1">
          {filtered.map(tag => (
            <li key={tag.id}>
              <button
                type="button"
                onMouseDown={e => { e.preventDefault(); addTag(tag.name) }}
                className="w-full text-left px-4 py-2 text-sm text-text-body hover:bg-brand-mint hover:text-brand-primary transition-colors"
              >
                #{tag.name}
              </button>
            </li>
          ))}
          {canCreate && (
            <li>
              <button
                type="button"
                onMouseDown={e => { e.preventDefault(); addTag(query) }}
                className="w-full text-left px-4 py-2 text-sm font-medium text-brand-primary hover:bg-brand-mint transition-colors flex items-center gap-2"
              >
                <span className="text-xs bg-brand-primary text-white px-1.5 py-0.5 rounded">New</span>
                Add #{query}
              </button>
            </li>
          )}
        </ul>
      )}

      <p className="text-xs text-text-muted mt-1">Press Enter or comma to add · Backspace to remove</p>
    </div>
  )
}
