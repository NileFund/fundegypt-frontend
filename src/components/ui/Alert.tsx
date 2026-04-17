type AlertType = 'success' | 'error' | 'warning' | 'info'

const styles: Record<AlertType, string> = {
  success: 'bg-green-50 border-brand-success text-green-800',
  error:   'bg-red-50 border-danger text-red-800',
  warning: 'bg-amber-50 border-warning text-amber-800',
  info:    'bg-blue-50 border-info text-blue-800',
}

interface AlertProps {
  type: AlertType
  message: string
}

export default function Alert({ type, message }: AlertProps) {
  return (
    <div className={`rounded-lg border px-4 py-3 text-sm ${styles[type]}`}>
      {message}
    </div>
  )
}
