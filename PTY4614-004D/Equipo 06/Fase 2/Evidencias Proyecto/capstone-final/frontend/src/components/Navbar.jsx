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

  if (!user) return null;

  return (
    <nav className="fixed top-0 left-0 right-0 bg-gray-950/90 backdrop-blur-xl border-b border-purple-500/30 z-50 shadow-lg shadow-purple-500/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link 
            to="/dashboard" 
            className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent hover:from-purple-300 hover:to-pink-300 transition-all duration-200"
          >
            SAFEZONE
          </Link>
          
          <div className="flex items-center gap-3">
            {/* BOTÓN ADMIN – SOLO SI role === 'admin' */}
            {user.role === 'admin' && (
              <Link
                to="/admin/games"
                className={`px-5 py-2 rounded-xl text-sm font-bold transition-all duration-200
                           ${location.pathname === '/admin/games'
                             ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-lg shadow-yellow-500/50 scale-105'
                             : 'bg-gradient-to-r from-yellow-600 to-orange-600 text-white hover:from-yellow-500 hover:to-orange-500 hover:scale-105 active:scale-95 shadow-md'}`}
              >
              Admin Juegos
              </Link>
            )}
            
            <span className="text-sm hidden sm:block text-gray-300 font-medium">
              @{user.username}
            </span>
            
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-xl text-sm font-bold transition-all duration-200 hover:scale-105 active:scale-95 shadow-md hover:shadow-lg hover:shadow-red-500/50"
            >
              Salir
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}