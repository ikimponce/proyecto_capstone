// src/pages/EditProfile.jsx
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'

const avatars = ['avatar1.png','avatar2.png','avatar3.png','avatar4.png','avatar5.png','avatar6.png','avatar7.png','avatar8.png']

export default function EditProfile() {
  const [user, setUser] = useState(null)
  const [avatar, setAvatar] = useState('')
  const [intention, setIntention] = useState('just-play')
  const navigate = useNavigate()

  useEffect(() => {
    api.get('/users/me').then(res => {
      setUser(res.data)
      setAvatar(res.data.avatar || 'default.png')
      setIntention(res.data.intention || 'just-play')
    })
  }, [])

  const save = async () => {
    await api.put('/users/me', { avatar, intention })
    alert('Perfil actualizado')
    navigate('/profile')
  }

  if (!user) return <div>Cargando...</div>

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-purple-950/50 to-gray-950 pt-20 px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-6xl font-bold text-center mb-12 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          Editar Perfil
        </h1>

        <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-10 border border-purple-500/30">
          <h2 className="text-3xl mb-6 text-white">Avatar</h2>
          <div className="grid grid-cols-4 gap-6 mb-12">
            {avatars.map(a => (
              <img
                key={a}
                src={`/avatars/${a}`}
                onClick={() => setAvatar(a)}
                className={`w-24 h-24 rounded-full cursor-pointer border-4 transition ${
                  avatar === a ? 'border-purple-500 scale-110 shadow-purple-500/50' : 'border-gray-700'
                }`}
              />
            ))}
          </div>

          <h2 className="text-3xl mb-6 text-white">¿Qué buscas?</h2>
          <div className="grid grid-cols-2 gap-8 max-w-xl mx-auto">
            <button
              onClick={() => setIntention('just-play')}
              className={`p-8 rounded-2xl font-bold text-2xl transition ${
                intention === 'just-play'
                  ? 'bg-gradient-to-r from-orange-500 to-red-600 shadow-orange-500/50'
                  : 'bg-gray-800/50 border border-gray-600'
              }`}
            >
              Solo jugar
            </button>
            <button
              onClick={() => setIntention('make-friends')}
              className={`p-8 rounded-2xl font-bold text-2xl transition ${
                intention === 'make-friends'
                  ? 'bg-gradient-to-r from-emerald-400 to-cyan-500 shadow-cyan-500/50'
                  : 'bg-gray-800/50 border border-gray-600'
              }`}
            >
              Hacer amigos
            </button>
          </div>

          <div className="text-center mt-12">
            <button
              onClick={save}
              className="px-12 py-5 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl font-bold text-2xl hover:scale-110 transition shadow-2xl"
            >
              Guardar Cambios
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}