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
    const res = await api.get('/games');  // ← ahora trae todos
    setGames(res.data);
  } catch (err) {
    alert('Error al cargar juegos');
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
      await api.put(`/games/${editingGame._id}`, form);  // ← PUT
    } else {
      await api.post('/games', form);
    }
    setShowForm(false);
    setEditingGame(null);
    setForm({ name: '', genre: '', platform: '', description: '', image: '' });
    loadGames();  // ← recarga TODOS
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
    <div className="min-h-screen p-6 sm:p-8 lg:p-12 bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
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
            className="bg-gradient-to-r from-purple-600 to-blue-600
                       hover:from-purple-700 hover:to-blue-700
                       px-8 py-4 rounded-2xl text-xl font-bold
                       shadow-2xl hover:shadow-purple-500/50
                       transition-all duration-300 transform hover:scale-110"
          >
            + Agregar Juego
          </button>
        </div>
      </div>

      {/* Formulario (modal-like) */}
      {showForm && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white/10 backdrop-blur-xl border border-purple-500/30
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
                className="w-full px-5 py-3 bg-white/5 border border-purple-500/30
                           rounded-xl text-white placeholder-gray-400
                           focus:outline-none focus:ring-2 focus:ring-purple-500
                           focus:border-transparent transition"
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  placeholder="Género"
                  value={form.genre}
                  onChange={e => setForm({ ...form, genre: e.target.value })}
                  className="px-5 py-3 bg-white/5 border border-purple-500/30
                             rounded-xl text-white placeholder-gray-400
                             focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <input
                  placeholder="Plataforma"
                  value={form.platform}
                  onChange={e => setForm({ ...form, platform: e.target.value })}
                  className="px-5 py-3 bg-white/5 border border-purple-500/30
                             rounded-xl text-white placeholder-gray-400
                             focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <input
                placeholder="URL de imagen"
                value={form.image}
                onChange={e => setForm({ ...form, image: e.target.value })}
                className="w-full px-5 py-3 bg-white/5 border border-purple-500/30
                           rounded-xl text-white placeholder-gray-400
                           focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <textarea
                placeholder="Descripción"
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
                rows={3}
                className="w-full px-5 py-3 bg-white/5 border border-purple-500/30
                           rounded-xl text-white placeholder-gray-400
                           focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <div className="flex gap-3 justify-end">
                <button
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600
                             text-white font-bold rounded-xl shadow-lg
                             hover:from-green-600 hover:to-emerald-700
                             transition-all duration-300 transform hover:scale-105"
                >
                  {editingGame ? 'Guardar' : 'Crear'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingGame(null);
                  }}
                  className="px-6 py-3 bg-gray-600 text-white font-bold rounded-xl
                             hover:bg-gray-700 transition-all duration-300"
                >
                  Cancelar
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
          </div>
        ) : games.length === 0 ? (
          <div className="text-center py-32">
            <p className="text-3xl lg:text-4xl text-gray-400 mb-8">
              No hay juegos aún
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="text-2xl text-purple-400 hover:text-purple-300 underline"
            >
              ¡Agrega el primero!
            </button>
          </div>
        ) : (
          <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {games.map(game => (
              <div
                key={game._id}
                className={`group relative bg-white/5 backdrop-blur-xl
                           border ${game.active ? 'border-purple-500/30' : 'border-red-500/30'}
                           p-8 rounded-3xl
                           hover:bg-white/10 hover:border-purple-400
                           transition-all duration-500
                           transform hover:scale-105
                           shadow-2xl hover:shadow-purple-500/30
                           overflow-hidden ${!game.active ? 'opacity-60' : ''}`}
              >
                {/* Efecto glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-blue-600/20
                                opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                {/* Imagen */}
                <div className="relative z-10 mb-4">
                  {game.image ? (
                    <img
                      src={game.image}
                      alt={game.name}
                      className="w-full h-32 object-cover rounded-2xl"
                    />
                  ) : (
                    <div className="bg-gray-700/50 border-2 border-dashed border-purple-500/30
                                    rounded-2xl w-full h-32 flex items-center justify-center">
                      <span className="text-gray-400 text-sm">Sin imagen</span>
                    </div>
                  )}
                </div>

                <div className="relative z-10">
                  <h3 className="text-2xl lg:text-3xl font-bold text-white mb-2
                                 group-hover:text-purple-300 transition">
                    {game.name}
                  </h3>
                  <p className="text-lg text-gray-300 mb-1">
                    {game.genre} • {game.platform}
                  </p>
                  <p className="text-sm text-gray-400 line-clamp-2">
                    {game.description || 'Sin descripción'}
                  </p>
                  <p className="text-xs text-gray-500 mt-3">
                    {game.active ? 'Activo' : 'Desactivado'}
                  </p>
                </div>

                {/* Botones */}
                <div className="relative z-10 mt-5 flex gap-2">
                  <button
                    onClick={() => startEdit(game)}
                    className="flex-1 px-3 py-2 bg-blue-600 text-white text-sm font-bold
                               rounded-xl hover:bg-blue-700 transition"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => toggleActive(game._id, game.active)}
                    className={`flex-1 px-3 py-2 text-white text-sm font-bold rounded-xl transition
                               ${game.active 
                                 ? 'bg-red-600 hover:bg-red-700' 
                                 : 'bg-green-600 hover:bg-green-700'}`}
                  >
                    {game.active ? 'Desactivar' : 'Activar'}
                  </button>
                </div>

                {/* Icono decorativo */}
                <div className="absolute top-4 right-4 text-purple-400 opacity-20
                                group-hover:opacity-40 transition">
                  <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"/>
                  </svg>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}