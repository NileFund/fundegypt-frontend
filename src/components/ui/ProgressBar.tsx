// color: red <25%, amber 25-75%, green >=75%
interface ProgressBarProps {
  percent: number   // 0–100
  showLabel?: boolean
}

function getColor(percent: number): string {
  if (percent < 25) return 'bg-danger'
  if (percent < 75) return 'bg-warning'
  return 'bg-brand-success'
}

export default function ProgressBar({ percent, showLabel = false }: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, percent))

  return (
    <div className="w-full">
      <div className="w-full h-3.5 bg-slate-100 rounded-full overflow-hidden relative border border-slate-200/50">
        <div
          className="h-full rounded-full transition-all duration-1000 ease-out relative"
          style={{ width: `${clamped}%`, backgroundColor: '#1F6F5F' }}
        >
          {/* Subtle shimmer effect */}
          <div
            className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent animate-shimmer"
            style={{ backgroundSize: '200% 100%' }}
          />
        </div>
      </div>
      {showLabel && (
        <div className="flex justify-between items-center mt-1.5">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{clamped}% funded</p>
        </div>
      )}
    </div>
  )
}
