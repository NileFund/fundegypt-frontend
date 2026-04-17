import { format, parseISO } from 'date-fns'

// e.g. 250000 -> "250,000 EGP"
export function formatEGP(amount: number): string {
  return `${amount.toLocaleString('en-EG')} EGP`
}

// ISO string -> "Apr 17, 2026"
export function formatDate(dateString: string): string {
  return format(parseISO(dateString), 'MMM d, yyyy')
}

// percentage string for display
export function formatPercent(donated: number, target: number): string {
  if (target === 0) return '0%'
  return `${Math.min(100, Math.round((donated / target) * 100))}%`
}

// 0-100 number for progress bars
export function getPercent(donated: number, target: number): number {
  if (target === 0) return 0
  return Math.min(100, Math.round((donated / target) * 100))
}
