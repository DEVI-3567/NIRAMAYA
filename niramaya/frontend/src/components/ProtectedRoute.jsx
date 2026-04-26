import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useEffect } from 'react'

export default function ProtectedRoute({ children, role }) {
  const { user, isLoggedIn } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!isLoggedIn) { navigate(`/login/${role}`); return }
    if (user.role !== role) { navigate(`/login/${role}`) }
  }, [isLoggedIn, user, role])

  if (!isLoggedIn || user?.role !== role) return null
  return children
}
