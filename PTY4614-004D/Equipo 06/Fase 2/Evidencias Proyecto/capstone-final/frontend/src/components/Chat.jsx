// src/components/Chat.jsx
import { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Chat({ groupId }) {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const loadHistory = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/groups/${groupId}/messages`);
        setMessages(res.data);
      } catch (err) {
        console.error('Error cargando historial:', err);
      } finally {
        setLoading(false);
      }
    };
    loadHistory();
  }, [groupId]);

  useEffect(() => {
    const socket = io(import.meta.env.VITE_API_URL || 'http://localhost:5000');
    socketRef.current = socket;
    socket.emit('joinGroup', groupId);

    socket.on('message', (msg) => {
      setMessages(prev => [...prev, msg]);
    });

    return () => socket.disconnect();
  }, [groupId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    const newMsg = { groupId, message: text, userId: user._id };
    socketRef.current.emit('chatMessage', newMsg);
    setText('');
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {loading ? (
          <div className="text-center py-8">
            <div className="inline-block w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-xl text-gray-400">Aún no hay mensajes</p>
            <p className="text-sm text-gray-500 mt-2">¡Sé el primero en escribir!</p>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg._id}
              className={`flex ${msg.user._id === user._id ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`group relative max-w-xs lg:max-w-md p-4 rounded-3xl
                           transition-all duration-300 transform hover:scale-105
                           ${msg.user._id === user._id
                             ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg hover:shadow-purple-500/50'
                             : 'bg-white/10 backdrop-blur-xl border border-purple-500/30 text-gray-200 shadow-md hover:shadow-purple-500/30'
                           }`}
              >
                <p className="text-xs font-bold opacity-80 mb-1">
                  {msg.user._id === user._id ? 'Tú' : msg.user.username}
                </p>
                <p className="text-sm lg:text-base">{msg.content}</p>
                <p className="text-xs opacity-60 mt-2">
                  {msg.timestamp 
                    ? new Date(msg.timestamp).toLocaleTimeString('es-CL', {
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: false
                      })
                    : 'Ahora'
                  }
                </p>
                <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br from-purple-600/20 to-blue-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`}></div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={sendMessage} className="p-4 lg:p-6 border-t border-purple-500/30 bg-black/50 backdrop-blur-xl">
        <div className="flex gap-3">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Escribe un mensaje..."
            className="flex-1 px-5 py-3 bg-white/5 border border-purple-500/30 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 shadow-inner"
          />
          <button
            type="submit"
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold rounded-2xl shadow-lg hover:shadow-purple-500/50 transition-all duration-300 transform hover:scale-105"
          >
            Enviar
          </button>
        </div>
      </form>
    </div>
  );
}