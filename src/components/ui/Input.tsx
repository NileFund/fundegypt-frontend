import { type InputHTMLAttributes, forwardRef } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

// forwardRef lets React Hook Form (or any parent) attach a ref to the real <input>.
// This is required for uncontrolled form libraries to work correctly.
const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', ...rest }, ref) => {
    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label className="text-sm font-medium text-text-primary">{label}</label>
        )}
        <input
          ref={ref}
          className={[
            'w-full px-3 py-2 rounded-lg border text-sm outline-none transition-colors',
            'bg-white text-text-body placeholder:text-text-muted',
            error
              ? 'border-danger focus:ring-1 focus:ring-danger'
              : 'border-gray-300 focus:border-brand-primary focus:ring-1 focus:ring-brand-primary',
            className,
          ].join(' ')}
          {...rest}
        />
        {error && <p className="text-xs text-danger">{error}</p>}
      </div>
    )
  }
)

Input.displayName = 'Input'
export default Input
