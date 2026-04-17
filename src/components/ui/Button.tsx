import { type ButtonHTMLAttributes, type ReactNode } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger'
  loading?: boolean
  children: ReactNode
}

// variant classes map — keeps the JSX clean
const variantClasses = {
  primary:   'bg-brand-primary hover:bg-brand-secondary text-white',
  secondary: 'bg-white hover:bg-gray-50 text-brand-primary border border-brand-primary',
  danger:    'bg-danger hover:bg-red-700 text-white',
}

export default function Button({
  variant = 'primary',
  loading = false,
  disabled,
  children,
  className = '',
  ...rest
}: ButtonProps) {
  return (
    <button
      disabled={disabled || loading}
      className={[
        'px-4 py-2 rounded-lg font-medium text-sm transition-colors cursor-pointer',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        variantClasses[variant],
        className,
      ].join(' ')}
      {...rest}
    >
      {loading ? 'Loading…' : children}
    </button>
  )
}
