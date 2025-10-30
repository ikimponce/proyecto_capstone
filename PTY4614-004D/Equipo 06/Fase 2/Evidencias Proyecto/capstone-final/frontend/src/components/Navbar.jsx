import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav className="fixed top-0 left-0 right-0 bg-black/90 backdrop-blur-md border-b border-purple-600 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/dashboard" className="text-2xl font-bold text-purple-400">
            GameTree
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm hidden sm:block">@{user.username}</span>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg text-sm transition"
            >
              Salir
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}