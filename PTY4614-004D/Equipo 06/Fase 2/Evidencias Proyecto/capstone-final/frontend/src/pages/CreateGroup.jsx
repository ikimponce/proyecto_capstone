import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'

export default function CreateGroup() {
  const [form, setForm] = useState({ name: '', description: '', game: '', isPrivate: false })
  const [games, setGames] = useState([])
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const loadGames = async () => {
      try {
        setLoading(true)
        const res = await api.get('/games/active')
        setGames(res.data || [])
      } catch (err) {
        console.error('Error al cargar juegos:', err)
        setGames([])
      } finally {
        setLoading(false)
      }
    }
    loadGames()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      const res = await api.post('/groups', form)
      navigate(`/group/${res.data._id}`)
    } catch (err) {
      alert(err.response?.data?.message || 'Error al crear grupo')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-purple-950/50 to-gray-950 flex items-center justify-center p-6 pt-24">
      <div className="bg-white/5 backdrop-blur-xl border border-purple-500/30 rounded-3xl shadow-2xl w-full max-w-2xl p-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-8 text-center">
          Crear Nuevo Grupo
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Nombre del grupo */}
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">
              Nombre del grupo *
            </label>
            <input
              type="text"
              placeholder="Ej: Los Cracks de Valorant"
              className="w-full px-4 py-3 bg-white/10 border border-purple-500/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">
              Descripción
            </label>
            <textarea
              placeholder="Describe tu grupo y qué tipo de jugadores buscas..."
              className="w-full px-4 py-3 bg-white/10 border border-purple-500/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 resize-none"
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              rows={4}
            />
          </div>

          {/* Seleccionar juego */}
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">
              Juego *
            </label>
            <select
              className="w-full px-4 py-3 bg-white/10 border border-purple-500/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
              value={form.game}
              onChange={e => setForm({ ...form, game: e.target.value })}
              required
              disabled={loading}
            >
              <option value="" className="bg-gray-900">
                {loading ? 'Cargando juegos...' : games.length === 0 ? 'No hay juegos disponibles' : 'Selecciona un juego'}
              </option>
              {games.map(g => (
                <option key={g._id} value={g.name} className="bg-gray-900">
                  {g.name}
                </option>
              ))}
            </select>
          </div>

          {/* Botones */}
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="flex-1 px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-bold rounded-xl transition-all duration-200"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting || loading}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold rounded-xl transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg hover:shadow-purple-500/50"
            >
              {isSubmitting ? 'Creando...' : 'Crear Grupo'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}