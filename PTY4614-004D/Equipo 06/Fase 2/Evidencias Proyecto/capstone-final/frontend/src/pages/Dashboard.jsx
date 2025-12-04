// src/pages/Dashboard.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import socket from '../socket'; // ← Notificaciones en tiempo real

const intentionConfig = {
  'just-play': { label: 'Solo jugar', gradient: 'from-orange-500 to-red-600', glow: 'shadow-orange-500/50' },
  'make-friends': { label: 'Hacer amigos', gradient: 'from-emerald-400 to-cyan-500', glow: 'shadow-cyan-500/50' }
};

const getRatingInfo = (rating) => {
  const r = Math.round(rating || 3);
  if (r <= 1) return { label: 'Tóxico', color: 'text-red-500' };
  if (r === 2) return { label: 'Malo', color: 'text-orange-500' };
  if (r === 3) return { label: 'Normal', color: 'text-yellow-400' };
  if (r === 4) return { label: 'Bueno', color: 'text-lime-400' };
  return { label: 'GOAT', color: 'text-purple-400' };
};

export default function Dashboard() {
  const { user: authUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [myGroups, setMyGroups] = useState([]);
  const [publicGroups, setPublicGroups] = useState([]);
  const [games, setGames] = useState([]);
  const [selectedGame, setSelectedGame] = useState('');
  const [loadingMy, setLoadingMy] = useState(true);
  const [loadingPublic, setLoadingPublic] = useState(true);
  const [abortController, setAbortController] = useState(null);

  // NOTIFICACIONES EN TIEMPO REAL
  useEffect(() => {
    const handleNewRating = (data) => {
      showToast(data.message, data.stars === 5 ? 'goat' : 'normal');
    };

    const handleFiveStars = (data) => {
      // SONIDO ÉPICO
      const audio = new Audio('/sounds/five-stars.mp3');
      audio.volume = 0.6;
      audio.play().catch(() => {});

      showToast(
        `¡${data.from} TE DIO 5 ESTRELLAS EN "${data.groupName}"!`,
        'goat'
      );
    };

    socket.on('new-rating', handleNewRating);
    socket.on('five-stars', handleFiveStars);

    return () => {
      socket.off('new-rating', handleNewRating);
      socket.off('five-stars', handleFiveStars);
    };
  }, []);

  // Toast personalizado sin librerías
  const showToast = (message, type = 'normal') => {
    const toast = document.createElement('div');
    toast.className = `fixed bottom-8 right-8 z-50 px-8 py-6 rounded-2xl shadow-2xl text-white font-bold text-xl transform translate-y-32 opacity-0 transition-all duration-500`;

    if (type === 'goat') {
      toast.className += ' bg-gradient-to-r from-purple-600 via-pink-600 to-yellow-600 animate-pulse';
      toast.innerHTML = `
        <div class="flex items-center gap-4">
          <span class="text-5xl">GOAT</span>
          <div class="max-w-xs">${message}</div>
        </div>
      `;
    } else {
      toast.className += ' bg-gradient-to-r from-blue-600 to-purple-600';
      toast.textContent = message;
    }

    document.body.appendChild(toast);

    // Animación de entrada
    requestAnimationFrame(() => {
      toast.classList.remove('translate-y-32', 'opacity-0');
    });

    // Auto eliminar
    setTimeout(() => {
      toast.classList.add('translate-y-32', 'opacity-0');
      setTimeout(() => toast.remove(), 600);
    }, 4500);
  };

  // Cargar juegos
  useEffect(() => {
    api.get('/games/active')
      .then(res => setGames(res.data.filter(g => g.active)))
      .catch(() => {});
  }, []);

  // Cargar perfil + mis grupos
  useEffect(() => {
    const controller = new AbortController();

    const loadData = async () => {
      try {
        const [profileRes, groupsRes] = await Promise.all([
          api.get('/auth/me', { signal: controller.signal }),
          api.get('/groups', { signal: controller.signal })
        ]);
        setProfile(profileRes.data);
        setMyGroups(groupsRes.data);
      } catch (err) {
        // Silenciar errores cancelados
      } finally {
        setLoadingMy(false);
      }
    };

    loadData();
    return () => controller.abort();
  }, []);

  // Cargar grupos públicos
  const loadPublicGroups = async () => {
    if (abortController) abortController.abort();
    const controller = new AbortController();
    setAbortController(controller);
    setLoadingPublic(true);

    try {
      const params = selectedGame ? { game: selectedGame } : {};
      const res = await api.get('/groups/search', {
        params,
        signal: controller.signal
      });
      setPublicGroups(res.data);
    } catch (err) {
      if (!['CanceledError', 'AbortError'].includes(err.name)) {
        console.error(err);
      }
    } finally {
      setLoadingPublic(false);
      setAbortController(null);
    }
  };

  useEffect(() => {
    loadPublicGroups();
    return () => {
      if (abortController) abortController.abort();
    };
  }, [selectedGame]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-purple-950/50 to-gray-950">
      <div className="pt-20 pb-16 px-6 sm:px-8 lg:px-12">
        <div className="max-w-7xl mx-auto">

          {/* PERFIL ÉPICO */}
          {profile ? (
            <div className="mb-16">
              <div className="relative overflow-hidden rounded-3xl bg-white/5 backdrop-blur-xl border border-purple-500/30 shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 via-pink-600/10 to-blue-600/20"></div>
                <div className="relative z-10 p-10 lg:p-16 flex flex-col lg:flex-row items-center gap-10">
                  {/* Avatar */}
                  <div className="relative">
                    <img
                      src={
                        profile.avatar?.startsWith('http') 
                          ? profile.avatar 
                          : `http://localhost:5000/avatars/${profile.avatar || 'default.png'}`
                      }
                      alt={profile.username}
                      className="w-40 h-40 lg:w-56 lg:h-56 rounded-full border-4 border-purple-500/60 shadow-2xl object-cover"
                      onError={(e) => {
                        e.currentTarget.src = 'http://localhost:5000/avatars/default.png';
                      }}
                    />
                    <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-purple-600 to-pink-600 opacity-30 blur-xl"></div>
                  </div>

                  {/* Info */}
                  <div className="text-center lg:text-left flex-1">
                    <h1 className="text-5xl lg:text-7xl font-extrabold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent mb-4">
                      ¡Hola, {profile.username}!
                    </h1>
                    <div className="flex flex capitano sm:flex-row gap-6 justify-center lg:justify-start items-center">
                      {/* Intención */}
                      <div className={`px-8 py-4 rounded-2xl bg-gradient-to-r ${intentionConfig[profile.intention || 'just-play'].gradient} text-white font-bold text-xl shadow-2xl ${intentionConfig[profile.intention || 'just-play'].glow}`}>
                        {intentionConfig[profile.intention || 'just-play'].label}
                      </div>

                      {/* Rating con estrellas */}
                      <div className="px-8 py-4 rounded-2xl bg-white/10 backdrop-blur-xl border-2 border-purple-500/30">
                        <div className="flex items-center gap-3">
                          <span className={`text-3xl font-bold ${getRatingInfo(profile.rating).color}`}>
                            {Number(profile.rating || 3).toFixed(1)}
                          </span>
                          <div className="flex">
                            {[1,2,3,4,5].map(i => (
                              <svg
                                key={i}
                                className={`w-8 h-8 ${i <= Math.round(profile.rating || 3) ? 'text-yellow-400 drop-shadow-glow' : 'text-gray-600'}`}
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                          <span className={`font-bold text-2xl ${getRatingInfo(profile.rating).color}`}>
                            {getRatingInfo(profile.rating).label}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Botones */}
                  <div className="flex gap-4">
                    <Link to="/profile" className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl font-bold text-xl hover:scale-105 transition shadow-xl">
                      Ver Perfil
                    </Link>
                    <Link to="/profile/edit" className="px-8 py-4 bg-white/10 backdrop-blur border border-purple-500/50 rounded-2xl font-bold text-xl hover:scale-105 transition">
                      Editar
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="inline-block w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}

          {/* MIS GRUPOS */}
          <section className="mb-16">
            <h2 className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-8">
              Mis Grupos
            </h2>

            {loadingMy ? (
              <div className="text-center py-20">
                <div className="inline-block w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : myGroups.length === 0 ? (
              <div className="text-center py-20 bg-white/5 backdrop-blur-xl border border-purple-500/30 rounded-3xl p-12">
                <p className="text-2xl text-gray-400 mb-6">Aún no estás en ningún grupo</p>
                <Link to="/group/create" className="text-xl text-purple-400 hover:text-purple-300 underline">
                  ¡Crea uno ahora!
                </Link>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {myGroups.map(group => (
                  <Link
                    key={group._id}
                    to={`/group/${group._id}`}
                    className="group relative bg-white/5 backdrop-blur-xl border border-purple-500/30 p-6 rounded-3xl hover:bg-white/10 hover:border-purple-400 transition-all duration-500 transform hover:scale-105 shadow-2xl hover:shadow-purple-500/30 overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-blue-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="relative z-10">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="text-xl font-bold text-white group-hover:text-purple-300 transition">
                          {group.name}
                        </h3>
                        {group.owner._id === profile?._id && (
                          <span className="text-xs bg-yellow-500/20 text-yellow-300 px-2 py-1 rounded-full">
                            Dueño
                          </span>
                        )}
                      </div>
                      <p className="text-gray-300 mb-1">{group.game || 'Sin juego'}</p>
                      <p className="text-sm text-gray-400">
                        {group.members.length} {group.members.length === 1 ? 'miembro' : 'miembros'}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </section>

          {/* DESCUBRIR GRUPOS */}
          <section>
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">
              <h2 className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                Descubre Grupos {selectedGame && `de ${selectedGame}`}
              </h2>
              <div className="flex gap-4 items-center">
                <select
                  value={selectedGame}
                  onChange={(e) => setSelectedGame(e.target.value)}
                  className="px-4 py-3 bg-white/10 backdrop-blur-xl border border-purple-500/30 rounded-xl text-white font-medium focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                >
                  <option value="">Todos los juegos</option>
                  {games.map(game => (
                    <option key={game._id} value={game.name}>{game.name}</option>
                  ))}
                </select>
                <Link
                  to="/group/create"
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 px-8 py-4 rounded-2xl text-xl font-bold shadow-2xl hover:shadow-purple-500/50 transition-all transform hover:scale-110"
                >
                  + Crear Grupo
                </Link>
              </div>
            </div>

            {loadingPublic ? (
              <div className="text-center py-20">
                <div className="inline-block w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : publicGroups.length === 0 ? (
              <div className="text-center py-20 bg-white/5 backdrop-blur-xl border border-purple-500/30 rounded-3xl p-12">
                <p className="text-2xl text-gray-400 mb-6">
                  {selectedGame ? `No hay grupos de ${selectedGame}` : 'No hay grupos públicos'}
                </p>
                <Link to="/group/create" className="text-xl text-purple-400 hover:text-purple-300 underline">
                  ¡Crea uno público!
                </Link>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {publicGroups.map(group => {
                  const isMember = myGroups.some(g => g._id === group._id);
                  return (
                    <div
                      key={group._id}
                      className="group relative bg-white/5 backdrop-blur-xl border border-purple-500/30 p-6 rounded-3xl hover:bg-white/10 hover:border-purple-400 transition-all duration-500 transform hover:scale-105 shadow-2xl hover:shadow-purple-500/30 overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-blue-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      <div className="relative z-10">
                        <h3 className="text-xl font-bold text-white mb-3 group-hover:text-purple-300 transition">
                          {group.name}
                        </h3>
                        <p className="text-gray-300 mb-1">{group.game || 'Sin juego'}</p>
                        <p className="text-sm text-gray-400">
                          {group.members.length} {group.members.length === 1 ? 'miembro' : 'miembros'}
                        </p>
                        <p className="text-xs text-purple-300 mt-1">
                          Creado por @{group.owner.username}
                        </p>

                        <div className="mt-6 flex justify-end">
                          {isMember ? (
                            <Link
                              to={`/group/${group._id}`}
                              className="px-5 py-2.5 bg-purple-600/60 hover:bg-purple-600 text-white text-sm font-bold rounded-xl transition"
                            >
                              Ver Chat
                            </Link>
                          ) : (
                            <button
                              onClick={async () => {
                                try {
                                  await api.post(`/groups/${group._id}/join`, {});
                                  const res = await api.get('/groups');
                                  setMyGroups(res.data);
                                  showToast('¡Te has unido al grupo!', 'normal');
                                } catch (err) {
                                  showToast(err.response?.data?.message || 'Error', 'normal');
                                }
                              }}
                              className="px-5 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white text-sm font-bold rounded-xl shadow-lg hover:shadow-green-500/50 transition-all transform hover:scale-105"
                            >
                              Unirse
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

        </div>
      </div>
    </div>
  );
}