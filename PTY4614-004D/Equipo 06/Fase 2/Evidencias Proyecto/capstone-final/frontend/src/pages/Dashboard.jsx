// src/pages/Dashboard.jsx
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'

export default function Dashboard() {
  const [groups, setGroups] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/groups').then(res => {
      setGroups(res.data)
      setLoading(false)
    })
  }, [])

  return (
    <div className="min-h-screen p-6 sm:p-8 lg:p-12">
      {/* Título + Botón */}
      <div className="max-w-7xl mx-auto mb-12">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold 
                         bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 
                         bg-clip-text text-transparent">
            Mis Grupos
          </h1>
          <Link
            to="/group/create"
            className="bg-gradient-to-r from-purple-600 to-blue-600 
                       hover:from-purple-700 hover:to-blue-700 
                       px-8 py-4 rounded-2xl text-xl font-bold 
                       shadow-2xl hover:shadow-purple-500/50 
                       transition-all duration-300 transform hover:scale-110"
          >
            + Crear Grupo
          </Link>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="max-w-7xl mx-auto">
        {loading ? (
          <div className="text-center py-32">
            <div className="inline-block w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : groups.length === 0 ? (
          <div className="text-center py-32">
            <p className="text-3xl lg:text-4xl text-gray-400 mb-8">
              Aún no estás en ningún grupo
            </p>
            <Link
              to="/group/create"
              className="text-2xl text-purple-400 hover:text-purple-300 underline"
            >
              ¡Crea tu primer grupo ahora!
            </Link>
          </div>
        ) : (
          <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {groups.map(group => (
              <Link
                key={group._id}
                to={`/group/${group._id}`}
                className="group relative bg-white/5 backdrop-blur-xl 
                           border border-purple-500/30 
                           p-8 rounded-3xl 
                           hover:bg-white/10 hover:border-purple-400 
                           transition-all duration-500 
                           transform hover:scale-105 
                           shadow-2xl hover:shadow-purple-500/30
                           overflow-hidden"
              >
                {/* Efecto glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-blue-600/20 
                                opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                <div className="relative z-10">
                  <h3 className="text-2xl lg:text-3xl font-bold text-white mb-3 
                                 group-hover:text-purple-300 transition">
                    {group.name}
                  </h3>
                  <p className="text-lg text-gray-300 mb-2">
                    {group.game || 'Sin juego'}
                  </p>
                  <p className="text-sm text-gray-400">
                    {group.members.length} {group.members.length === 1 ? 'miembro' : 'miembros'}
                  </p>
                </div>

                {/* Icono decorativo */}
                <div className="absolute top-4 right-4 text-purple-400 opacity-20 
                                group-hover:opacity-40 transition">
                  <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"/>
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}