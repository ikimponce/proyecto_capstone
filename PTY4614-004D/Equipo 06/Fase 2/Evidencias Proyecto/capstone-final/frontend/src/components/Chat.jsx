import { useState, useEffect, useRef } from 'react'
import { io } from 'socket.io-client'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'

let socket

export default function Chat({ groupId }) {
  const [messages, setMessages] = useState([])
  const [content, setContent] = useState('')
  const { user } = useAuth()
  const messagesEndRef = useRef(null)

  useEffect(() => {
    // Cargar mensajes previos
    api.get(`/messages/${groupId}`)
      .then(res => {
        console.log("Mensajes cargados:", res.data);
        setMessages(res.data)
      })
      .catch(err => {
        console.error("Error al cargar los mensajes:", err);
      })
    
    // Conectar socket
    socket = io('http://localhost:5000')
    socket.emit('joinGroup', groupId)

    socket.on('message', (msg) => {
      console.log("Mensaje recibido por socket:", msg);
      // Añadir el mensaje recibido en tiempo real
      setMessages(prev => [...prev, msg])
    })

    return () => socket.disconnect()
  }, [groupId])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const send = () => {
    if (!content.trim()) return
    socket.emit('sendMessage', { groupId, content, userId: user._id })
    setContent('')
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map(msg => (
          <div key={msg._id} className={`flex ${msg.user._id === user._id ? 'justify-end' : ''}`}>
            <div className={`max-w-xs px-4 py-2 rounded-2xl text-sm ${
              msg.user._id === user._id 
                ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white' 
                : 'bg-white/20 border border-purple-500'
            }`}>
              <p className="font-semibold text-xs">{msg.user.username}</p>
              <p>{msg.content}</p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-purple-600">
        <div className="flex gap-2">
          <input
            className="flex-1 px-4 py-2 bg-white/10 border border-purple-500 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-400"
            placeholder="Escribe un mensaje..."
            value={content}
            onChange={e => setContent(e.target.value)}
            onKeyPress={e => e.key === 'Enter' && send()}
          />
          <button
            onClick={send}
            className="bg-gradient-to-r from-purple-600 to-blue-600 px-5 py-2 rounded-full hover:from-purple-700 hover:to-blue-700 transition"
          >
            Enviar
          </button>
        </div>
      </div>
    </div>
  )
}