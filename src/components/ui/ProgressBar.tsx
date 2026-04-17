// color: red <25%, amber 25-75%, green >=75%
interface ProgressBarProps {
  percent: number   // 0–100
  showLabel?: boolean
}

function getColor(percent: number): string {
  if (percent < 25)  return 'bg-danger'
  if (percent < 75)  return 'bg-warning'
  return 'bg-brand-success'
}

export default function ProgressBar({ percent, showLabel = false }: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, percent))

  return (
    <div className="w-full">
      <div className="w-full h-2 bg-brand-mint rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${getColor(clamped)}`}
          style={{ width: `${clamped}%` }}
        />
      </div>
      {showLabel && (
        <p className="text-xs text-text-muted mt-1">{clamped}% funded</p>
      )}
    </div>
  )
}
