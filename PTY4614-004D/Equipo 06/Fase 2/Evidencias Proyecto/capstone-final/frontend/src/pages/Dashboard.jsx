// src/pages/Dashboard.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const { user } = useAuth();
  const [myGroups, setMyGroups] = useState([]);        // Tus grupos
  const [publicGroups, setPublicGroups] = useState([]); // Para unirte
  const [games, setGames] = useState([]);
  const [selectedGame, setSelectedGame] = useState('');
  const [loadingMy, setLoadingMy] = useState(true);
  const [loadingPublic, setLoadingPublic] = useState(true);

  // Cargar juegos
  useEffect(() => {
  api.get('/games').then(res => {
    setGames(res.data.filter(game => game.active));  // ← Solo activos
  });
}, []);

  // Cargar TUS GRUPOS
  useEffect(() => {
    const loadMyGroups = async () => {
      setLoadingMy(true);
      try {
        const res = await api.get('/groups');
        setMyGroups(res.data);
      } catch (err) {
        console.error('Error cargando tus grupos:', err);
      } finally {
        setLoadingMy(false);
      }
    };
    loadMyGroups();
  }, []);

  // Cargar GRUPOS PÚBLICOS
  const loadPublicGroups = async () => {
    setLoadingPublic(true);
    try {
      const params = selectedGame ? { game: selectedGame } : {};
      const res = await api.get('/groups/search', { params });
      setPublicGroups(res.data);
    } catch (err) {
      console.error('Error cargando grupos públicos:', err);
    } finally {
      setLoadingPublic(false);
    }
  };

  useEffect(() => {
    loadPublicGroups();
  }, [selectedGame]);

  return (
    <div className="min-h-screen p-6 sm:p-8 lg:p-12">
      <div className="max-w-7xl mx-auto">

        {/* TUS GRUPOS */}
        <section className="mb-16">
          <h2 className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-8">
            Mis Grupos
          </h2>

          {loadingMy ? (
            <div className="text-center py-16">
              <div className="inline-block w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : myGroups.length === 0 ? (
            <div className="text-center py-16 bg-white/5 backdrop-blur-xl border border-purple-500/30 rounded-3xl p-12">
              <p className="text-2xl text-gray-400 mb-4">Aún no estás en ningún grupo</p>
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
                      {group.owner._id === user._id && (
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

        {/* BUSCADOR DE GRUPOS */}
        <section>
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">
            <h2 className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
              Descubre Grupos {selectedGame && `de ${selectedGame}`}
            </h2>

            <div className="flex gap-4 items-center">
              <select
                value={selectedGame}
                onChange={(e) => setSelectedGame(e.target.value)}
                className="px-4 py-3 bg-white/10 backdrop-blur-xl border border-purple-500/30 rounded-xl text-white font-medium focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300"
              >
                <option value="">Todos los juegos</option>
                {games.map(game => (
                  <option key={game._id} value={game.name}>{game.name}</option>
                ))}
              </select>

              <Link
                to="/group/create"
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 px-8 py-4 rounded-2xl text-xl font-bold shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 transform hover:scale-110"
              >
                + Crear Grupo
              </Link>
            </div>
          </div>

          {loadingPublic ? (
            <div className="text-center py-16">
              <div className="inline-block w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : publicGroups.length === 0 ? (
            <div className="text-center py-16 bg-white/5 backdrop-blur-xl border border-purple-500/30 rounded-3xl p-12">
              <p className="text-2xl text-gray-400 mb-4">
                {selectedGame ? `No hay grupos de ${selectedGame}` : 'No hay grupos públicos'}
              </p>
              <Link to="/group/create" className="text-xl text-purple-400 hover:text-purple-300 underline">
                ¡Crea uno público!
              </Link>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {publicGroups.map(group => {
                const isMember = myGroups.some(g => g._id === group._id); // ← Verifica si ya estás

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

                      {/* BOTÓN UNIRSE O VER CHAT */}
                      <div className="mt-4 flex justify-end">
                        {isMember ? (
                          <Link
                            to={`/group/${group._id}`}
                            className="px-4 py-2 bg-purple-600/50 hover:bg-purple-600 text-white text-sm font-medium rounded-xl transition"
                          >
                            Ver Chat
                          </Link>
                        ) : (
                          <button
                            onClick={async () => {
                              try {
                                const res = await api.post(`/groups/${group._id}/join`, {});
                                // Recargar Mis Grupos
                                const myRes = await api.get('/groups');
                                setMyGroups(myRes.data);
                                alert('¡Te has unido al grupo!');
                              } catch (err) {
                                if (err.response?.status === 403) {
                                  alert('Este grupo es privado. Pide el código.');
                                } else {
                                  alert('Error al unirse');
                                }
                              }
                            }}
                            className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white text-sm font-bold rounded-xl shadow-lg hover:shadow-green-500/50 transition-all duration-300 transform hover:scale-105"
                          >
                            Unirse
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="absolute top-4 right-4 text-purple-400 opacity-20 group-hover:opacity-40 transition">
                      <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"/>
                      </svg>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}