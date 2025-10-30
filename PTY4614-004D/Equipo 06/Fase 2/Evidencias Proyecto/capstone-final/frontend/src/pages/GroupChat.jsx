// src/pages/GroupChat.jsx
import { useParams } from 'react-router-dom'
import Chat from '../components/Chat'

export default function GroupChat() {
  const { id } = useParams()

  return (
    <div className="min-h-screen p-6 sm:p-8 lg:p-12">
      <div className="max-w-7xl mx-auto h-full flex flex-col gap-6">
        {/* Header */}
        <div className="bg-white/5 backdrop-blur-xl border border-purple-500/30 
                        p-6 lg:p-8 rounded-3xl shadow-2xl">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold 
                         bg-gradient-to-r from-purple-400 to-blue-400 
                         bg-clip-text text-transparent">
            Chat del Grupo
          </h1>
          <p className="text-lg text-gray-400 mt-2">ID: {id}</p>
        </div>

        {/* Chat */}
        <div className="flex-1 bg-black/30 backdrop-blur-xl rounded-3xl 
                        overflow-hidden border border-purple-500/30 
                        shadow-2xl">
          <Chat groupId={id} />
        </div>
      </div>
    </div>
  )
}