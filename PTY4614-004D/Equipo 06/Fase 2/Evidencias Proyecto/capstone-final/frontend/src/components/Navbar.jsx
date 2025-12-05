// src/components/Navbar.jsx
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;          // <-- nada si no está logueado

  return (
    <nav className="fixed top-0 left-0 right-0 bg-black/90 backdrop-blur-md border-b border-purple-600 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/dashboard" className="text-2xl font-bold text-purple-400">
            SAFEZONE
          </Link>

          <div className="flex items-center gap-4">
            {/* BOTÓN ADMIN – SOLO SI role === 'admin' */}
            {user.role === 'admin' && (
              <Link
                to="/admin/games"
                className={`px-5 py-2 rounded-lg text-sm font-medium transition-all duration-300
                           ${location.pathname === '/admin/games'
                             ? 'bg-yellow-500 text-purple-900 shadow-lg'
                             : 'bg-gradient-to-r from-yellow-600 to-orange-600 text-white hover:from-yellow-500 hover:to-orange-500 shadow-md hover:shadow-lg'}`}
              >
                Admin Juegos
              </Link>
            )}

            <span className="text-sm hidden sm:block text-gray-300">
              @{user.username}
            </span>

            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg text-sm transition shadow-md hover:shadow-lg"
            >
              Salir
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}