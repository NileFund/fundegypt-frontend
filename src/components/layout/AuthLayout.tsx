import { Outlet, Navigate } from 'react-router-dom'
import { useAuth } from '../../context/useAuth'
import Spinner from '../ui/Spinner'

export default function AuthLayout() {
  const { user, isLoading } = useAuth()
  if (isLoading) return <Spinner centered />
  if (!user) return <Navigate to="/login" replace />
  return <Outlet />
}
