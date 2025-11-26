// src/pages/Profile.jsx
import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import api from '../services/api'
import { useAuth } from '../context/AuthContext'

const intentionConfig = {
  'just-play': { label: 'Solo jugar', gradient: 'from-orange-500 to-red-600' },
  'make-friends': { label: 'Hacer amigos', gradient: 'from-emerald-400 to-cyan-500' }
}

const getRatingInfo = (r) => {
  const rating = Math.round(r || 3)
  if (rating <= 1) return { label: 'Tóxico', color: 'text-red-500' }
  if (rating === 2) return { label: 'Malo', color: 'text-orange-500' }
  if (rating === 3) return { label: 'Normal', color: 'text-yellow-400' }
  if (rating === 4) return { label: 'Bueno', color: 'text-lime-400' }
  return { label: 'GOAT', color: 'text-purple-400' }
}

export default function Profile() {
  const { id } = useParams()
  const { user: currentUser } = useAuth()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

useEffect(() => {
  const controller = new AbortController();
  let isMounted = true;

  const loadData = async () => {
    setLoadingMy(true); // ← aseguramos que empiece en true
    try {
      const [profileRes, groupsRes] = await Promise.all([
        api.get('/users/me', { signal: controller.signal }),
        api.get('/groups', { signal: controller.signal })
      ]);

      // Solo actualizamos si el componente sigue montado
      if (isMounted) {
        setProfile(profileRes.data);
        setMyGroups(groupsRes.data);
      }
    } catch (err) {
      if (err.name !== 'CanceledError' && err.name !== 'AbortError') {
        console.error('Error cargando datos del dashboard:', err);
        // Si hay error de auth → redirigir al login
        if (err.response?.status === 401) {
          localStorage.removeItem('token');
          window.location.href = '/login';
        }
      }
    } finally {
      if (isMounted) {
        setLoadingMy(false); // ← SIEMPRE se ejecuta
      }
    }
  };

  loadData();
{/* DEBUG TEMPORAL - BÓRRALO DESPUÉS */}
<div className="text-white mb-4">
  Debug: loadingMy = {loadingMy.toString()} | profile = {profile ? 'SÍ' : 'NO'}
</div>
  return () => {
    isMounted = false;
    controller.abort();
  };
}, []);

  if (loading) return <div className="min-h-screen flex justify-center items-center"><div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div></div>
  if (!user) return <div className="text-center py-32 text-3xl text-gray-400">Usuario no encontrado</div>

  const isOwnProfile = !id || id === currentUser._id

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-purple-950/50 to-gray-950 pt-20 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white/5 backdrop-blur-xl border border-purple-500/30 rounded-3xl p-10 shadow-2xl overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 to-pink-600/10"></div>
          <div className="relative z-10 flex flex-col lg:flex-row items-center gap-10">
            <img
              src={user.avatar?.startsWith('http') ? user.avatar : `/avatars/${user.avatar || 'default.png'}`}
              alt={user.username}
              className="w-40 h-40 lg:w-56 lg:h-56 rounded-full border-4 border-purple-500/60 object-cover shadow-2xl"
            />
            <div className="text-center lg:text-left">
              <h1 className="text-6xl lg:text-8xl font-extrabold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                {user.username}
              </h1>
              <div className="mt-8 flex flex-wrap gap-6 justify-center lg:justify-start">
                <div className={`px-8 py-4 rounded-2xl bg-gradient-to-r ${intentionConfig[user.intention].gradient} text-white font-bold shadow-xl`}>
                  {intentionConfig[user.intention].label}
                </div>
                <div className="px-8 py-4 rounded-2xl bg-white/10 border border-purple-500/30 flex items-center gap-4">
                  <span className={`text-4xl font-bold ${getRatingInfo(user.rating).color}`}>
                    {Number(user.rating).toFixed(1)}
                  </span>
                  <span className={`text-2xl font-bold ${getRatingInfo(user.rating).color}`}>
                    {getRatingInfo(user.rating).label}
                  </span>
                </div>
              </div>
              {isOwnProfile && (
                <div className="mt-10">
                  <Link to="/profile/edit" className="px-10 py-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl font-bold text-xl hover:scale-105 transition shadow-xl">
                    Editar Perfil
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}