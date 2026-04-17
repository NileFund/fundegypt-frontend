import { Star } from 'lucide-react'

interface RatingStarsProps {
  value: number   // 0–5, can be decimal (e.g. 3.7)
  count?: number  // optional: show "(42 ratings)"
}

// Read-only star display. We don't need interactive ratings since
// the backend ratings API isn't ready yet.
export default function RatingStars({ value, count }: RatingStarsProps) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map(star => (
        <Star
          key={star}
          size={16}
          className={star <= Math.round(value) ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}
        />
      ))}
      <span className="text-sm text-text-muted ml-1">
        {value.toFixed(1)}
        {count !== undefined && ` (${count})`}
      </span>
    </div>
  )
}
