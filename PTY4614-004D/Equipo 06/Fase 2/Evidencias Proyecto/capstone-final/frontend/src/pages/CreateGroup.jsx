import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'

export default function CreateGroup() {
  const [form, setForm] = useState({ name: '', description: '', game: '', isPrivate: false })
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await api.post('/groups', form)
      navigate(`/group/${res.data._id}`)
    } catch (err) {
      alert('Error al crear grupo')
    }
  }

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Crear Grupo</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Nombre del grupo"
          className="w-full px-4 py-3 bg-white/10 border border-purple-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
          value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Descripción"
          className="w-full px-4 py-3 bg-white/10 border border-purple-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
          value={form.description}
          onChange={e => setForm({ ...form, description: e.target.value })}
        />
        <input
          type="text"
          placeholder="Juego (ej: Valorant)"
          className="w-full px-4 py-3 bg-white/10 border border-purple-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
          value={form.game}
          onChange={e => setForm({ ...form, game: e.target.value })}
        />
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={form.isPrivate}
            onChange={e => setForm({ ...form, isPrivate: e.target.checked })}
          />
          <span>Grupo privado (requiere código)</span>
        </label>
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition"
        >
          Crear Grupo
        </button>
      </form>
    </div>
  )
}