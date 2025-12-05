// src/pages/AdminGamesPage.jsx
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function AdminGamesPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingGame, setEditingGame] = useState(null);
  const [form, setForm] = useState({
    name: '',
    genre: '',
    platform: '',
    description: '',
    image: ''
  });

  // Cargar juegos
  const loadGames = async () => {
    try {
      setLoading(true);
      const res = await api.get('/games');
      setGames(res.data || []);
    } catch (err) {
      console.error('Error al cargar juegos:', err);
      setGames([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role !== 'admin') {
      navigate('/');
      return;
    }
    loadGames();
  }, [user, navigate]);

  // Enviar formulario
  const submitForm = async (e) => {
    e.preventDefault();
    try {
      if (editingGame) {
        await api.put(`/games/${editingGame._id}`, form);
      } else {
        await api.post('/games', form);
      }
      setShowForm(false);
      setEditingGame(null);
      setForm({ name: '', genre: '', platform: '', description: '', image: '' });
      loadGames();
    } catch (err) {
      alert(err.response?.data?.message || 'Error');
    }
  };

  const toggleActive = async (id, active) => {
    try {
      const method = active ? 'delete' : 'patch';
      const endpoint = active ? `/games/${id}` : `/games/${id}/reactivate`;
      await api[method](endpoint);
      loadGames();
    } catch (err) {
      alert('Error al cambiar estado');
    }
  };

  const startEdit = (game) => {
    setEditingGame(game);
    setForm({
      name: game.name,
      genre: game.genre,
      platform: game.platform,
      description: game.description,
      image: game.image
    });
    setShowForm(true);
  };

  if (user?.role !== 'admin') return null;

  return (
    <div className="min-h-screen p-6 sm:p-8 lg:p-12 bg-gradient-to-br from-gray-950 via-purple-950/50 to-gray-950 pt-24">
      {/* Título + Botón */}
      <div className="max-w-7xl mx-auto mb-12">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold
                         bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400
                         bg-clip-text text-transparent">
            Gestión de Juegos
          </h1>
          <button
            onClick={() => {
              setEditingGame(null);
              setForm({ name: '', genre: '', platform: '', description: '', image: '' });
              setShowForm(true);
            }}
            className="bg-gradient-to-r from-purple-600 to-pink-600
                       hover:from-purple-700 hover:to-pink-700
                       px-8 py-4 rounded-xl text-xl font-bold
                       shadow-lg hover:shadow-purple-500/50
                       transition-all duration-200 hover:scale-105 active:scale-95"
          >
            + Agregar Juego
          </button>
        </div>
      </div>

      {/* Formulario (modal) */}
      {showForm && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white/5 backdrop-blur-xl border border-purple-500/30
                          p-8 rounded-3xl max-w-2xl w-full shadow-2xl">
            <h2 className="text-3xl font-bold text-white mb-6">
              {editingGame ? 'Editar Juego' : 'Nuevo Juego'}
            </h2>
            <form onSubmit={submitForm} className="space-y-5">
              <input
                placeholder="Nombre del juego *"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                required
                className="w-full px-5 py-3 bg-white/10 border border-purple-500/50
                           rounded-xl text-white placeholder-gray-400
                           focus:outline-none focus:ring-2 focus:ring-purple-500
                           focus:border-transparent transition-all duration-200"
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  placeholder="Género"
                  value={form.genre}
                  onChange={e => setForm({ ...form, genre: e.target.value })}
                  className="px-5 py-3 bg-white/10 border border-purple-500/50
                             rounded-xl text-white placeholder-gray-400
                             focus:outline-none focus:ring-2 focus:ring-purple-500
                             transition-all duration-200"
                />
                <input
                  placeholder="Plataforma"
                  value={form.platform}
                  onChange={e => setForm({ ...form, platform: e.target.value })}
                  className="px-5 py-3 bg-white/10 border border-purple-500/50
                             rounded-xl text-white placeholder-gray-400
                             focus:outline-none focus:ring-2 focus:ring-purple-500
                             transition-all duration-200"
                />
              </div>
              <input
                placeholder="URL de imagen"
                value={form.image}
                onChange={e => setForm({ ...form, image: e.target.value })}
                className="w-full px-5 py-3 bg-white/10 border border-purple-500/50
                           rounded-xl text-white placeholder-gray-400
                           focus:outline-none focus:ring-2 focus:ring-purple-500
                           transition-all duration-200"
              />
              <textarea
                placeholder="Descripción"
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
                rows={3}
                className="w-full px-5 py-3 bg-white/10 border border-purple-500/50
                           rounded-xl text-white placeholder-gray-400
                           focus:outline-none focus:ring-2 focus:ring-purple-500
                           resize-none transition-all duration-200"
              />
              <div className="flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingGame(null);
                  }}
                  className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-bold rounded-xl
                             transition-all duration-200"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600
                             text-white font-bold rounded-xl shadow-lg
                             hover:from-green-600 hover:to-emerald-700
                             transition-all duration-200 hover:scale-105 active:scale-95"
                >
                  {editingGame ? 'Guardar Cambios' : 'Crear Juego'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Lista de juegos */}
      <div className="max-w-7xl mx-auto">
        {loading ? (
          <div className="text-center py-32">
            <div className="inline-block w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-400 mt-4">Cargando juegos...</p>
          </div>
        ) : games.length === 0 ? (
          <div className="text-center py-32">
            <div className="text-6xl mb-6">🎮</div>
            <p className="text-3xl lg:text-4xl text-gray-400 mb-8">
              No hay juegos aún
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="text-xl text-purple-400 hover:text-purple-300 underline transition-colors"
            >
              ¡Agrega el primero!
            </button>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {games.map(game => (
              <div
                key={game._id}
                className={`group relative bg-white/5 backdrop-blur-xl
                           border ${game.active ? 'border-purple-500/30' : 'border-red-500/50'}
                           p-6 rounded-3xl
                           hover:bg-white/10 hover:border-purple-400/50
                           transition-all duration-300
                           hover:scale-105
                           shadow-xl hover:shadow-purple-500/30
                           overflow-hidden ${!game.active ? 'opacity-60' : ''}`}
              >
                {/* Badge de estado */}
                <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold z-20
                               ${game.active 
                                 ? 'bg-green-500/20 text-green-400 border border-green-500/50' 
                                 : 'bg-red-500/20 text-red-400 border border-red-500/50'}`}>
                  {game.active ? '✓ Activo' : '✗ Inactivo'}
                </div>

                {/* Efecto glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 to-pink-600/10
                                opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                {/* Imagen */}
                <div className="relative z-10 mb-4">
                  {game.image ? (
                    <img
                      src={game.image}
                      alt={game.name}
                      className="w-full h-40 object-cover rounded-2xl border border-purple-500/20"
                    />
                  ) : (
                    <div className="bg-gray-800/50 border-2 border-dashed border-purple-500/30
                                    rounded-2xl w-full h-40 flex items-center justify-center">
                      <div className="text-center">
                        <span className="text-4xl mb-2 block">🎮</span>
                        <span className="text-gray-500 text-sm">Sin imagen</span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="relative z-10">
                  <h3 className="text-xl font-bold text-white mb-2 truncate
                                 group-hover:text-purple-300 transition-colors">
                    {game.name}
                  </h3>
                  {(game.genre || game.platform) && (
                    <p className="text-sm text-gray-400 mb-2">
                      {[game.genre, game.platform].filter(Boolean).join(' • ')}
                    </p>
                  )}
                  {game.description && (
                    <p className="text-sm text-gray-500 line-clamp-2 mb-4">
                      {game.description}
                    </p>
                  )}
                </div>

                {/* Botones */}
                <div className="relative z-10 flex gap-2">
                  <button
                    onClick={() => startEdit(game)}
                    className="flex-1 px-4 py-2 bg-blue-600/80 hover:bg-blue-600 text-white text-sm font-bold
                               rounded-xl transition-all duration-200 hover:scale-105 active:scale-95"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => toggleActive(game._id, game.active)}
                    className={`flex-1 px-4 py-2 text-white text-sm font-bold rounded-xl 
                               transition-all duration-200 hover:scale-105 active:scale-95
                               ${game.active 
                                 ? 'bg-red-600/80 hover:bg-red-600' 
                                 : 'bg-green-600/80 hover:bg-green-600'}`}
                  >
                    {game.active ? 'Desactivar' : 'Activar'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}