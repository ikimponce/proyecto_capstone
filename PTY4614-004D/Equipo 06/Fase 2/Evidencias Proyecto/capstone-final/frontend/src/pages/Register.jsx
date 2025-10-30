import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../services/api'

export default function Register() {
  const [form, setForm] = useState({ username: '', email: '', password: '' })
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      await api.post('/auth/register', form)
      navigate('/login')
    } catch (err) {
      setError(err.response?.data?.message || 'Error al registrarse')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-2xl w-full max-w-md">
        <h2 className="text-3xl font-bold text-center mb-6 text-purple-300">Crear Cuenta</h2>
        {error && <p className="text-red-400 text-center mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Nombre de usuario"
            className="w-full px-4 py-3 bg-white/20 border border-purple-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 text-white placeholder-gray-300"
            value={form.username}
            onChange={e => setForm({ ...form, username: e.target.value })}
            required
          />
          <input
            type="email"
            placeholder="Email"
            className="w-full px-4 py-3 bg-white/20 border border-purple-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 text-white placeholder-gray-300"
            value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
            required
          />
          <input
            type="password"
            placeholder="Contraseña"
            className="w-full px-4 py-3 bg-white/20 border border-purple-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 text-white placeholder-gray-300"
            value={form.password}
            onChange={e => setForm({ ...form, password: e.target.value })}
            required
          />
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition"
          >
            Registrarse
          </button>
        </form>
        <p className="text-center mt-4 text-sm">
          ¿Ya tienes cuenta? <Link to="/login" className="text-purple-400 hover:underline">Inicia sesión</Link>
        </p>
      </div>
    </div>
  )
}