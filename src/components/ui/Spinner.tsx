// A simple animated ring spinner.
// Use <Spinner /> inline or <Spinner centered /> to fill the parent container.
export default function Spinner({ centered = false }: { centered?: boolean }) {
  const spinner = (
    <div className="w-8 h-8 rounded-full border-4 border-brand-mint border-t-brand-primary animate-spin" />
  )

  if (centered) {
    return (
      <div className="flex justify-center items-center py-16">
        {spinner}
      </div>
    )
  }

  return spinner
}
