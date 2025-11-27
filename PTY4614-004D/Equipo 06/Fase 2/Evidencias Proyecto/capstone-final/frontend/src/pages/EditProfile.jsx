// src/pages/EditProfile.jsx 
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function EditProfile() {
  const navigate = useNavigate();
  const { user, login } = useAuth(); // login actualiza el contexto

  const [formData, setFormData] = useState({
    username: '',
    avatar: '',
    intention: 'just-play'
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await api.get('/auth/me');
        setFormData({
          username: res.data.username || '',
          avatar: res.data.avatar || '',
          intention: res.data.intention || 'just-play'
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      await api.put('/users/me', formData);

      // REDIRIGIR SIN HACER LOGIN DE NUEVO
      navigate('/profile'); // ← PERFECTO, SIN RECARGA DE PÁGINA

      // O con recarga si quieres estar 100% seguro:
      // window.location.href = '/profile';

    } catch (err) {
      console.error('Error guardando perfil:', err);
      alert(err.response?.data?.message || 'Error al guardar');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-purple-950/50 to-gray-950 pt-20 px-6">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white/5 backdrop-blur-xl border border-purple-500/30 rounded-3xl p-10 shadow-2xl">
          <h1 className="text-5xl font-bold text-white mb-10 text-center">Editar Perfil</h1>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div>
              <label className="block text-xl text-purple-300 mb-3">Username</label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className="w-full px-6 py-4 bg-white/10 border border-purple-500/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>

            <div>
              <label className="block text-xl text-purple-300 mb-3">Avatar (nombre del archivo en /public/avatars)</label>
              <input
                type="text"
                value={formData.avatar}
                onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                placeholder="ej: ninja.png"
                className="w-full px-6 py-4 bg-white/10 border border-purple-500/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-xl text-purple-300 mb-3">Intención</label>
              <select
                value={formData.intention}
                onChange={(e) => setFormData({ ...formData, intention: e.target.value })}
                className="w-full px-6 py-4 bg-white/10 border border-purple-500/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="just-play">Solo jugar</option>
                <option value="make-friends">Hacer amigos</option>
              </select>
            </div>

            <div className="flex gap-6 justify-center pt-6">
              <button
                type="submit"
                disabled={saving}
                className="px-12 py-5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl font-bold text-xl hover:scale-105 transition shadow-xl disabled:opacity-70"
              >
                {saving ? 'Guardando...' : 'Guardar Cambios'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/profile')}
                className="px-12 py-5 bg-white/10 border border-purple-500/50 rounded-2xl font-bold text-xl hover:scale-105 transition"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}