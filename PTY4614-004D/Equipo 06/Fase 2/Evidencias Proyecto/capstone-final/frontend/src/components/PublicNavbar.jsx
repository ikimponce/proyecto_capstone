import { Link } from 'react-router-dom';

export default function PublicNavbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 bg-black/90 backdrop-blur-md border-b border-purple-600 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="text-2xl font-bold text-purple-400">
            SAFEZONE
          </Link>
          <div className="flex items-center gap-4">
            <Link
              to="/login"
              className="text-white hover:text-purple-400 px-4 py-2 rounded-lg text-sm font-medium transition"
            >
              Iniciar Sesión
            </Link>
            <Link
              to="/register"
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold px-4 py-2 rounded-lg text-sm transition"
            >
              Registrarse
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}