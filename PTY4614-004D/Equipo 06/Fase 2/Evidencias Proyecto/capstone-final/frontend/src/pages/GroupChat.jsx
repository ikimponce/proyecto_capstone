// src/pages/GroupChat.jsx
import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import socket from '../socket';

export default function GroupChat() {
  const { id } = useParams();
  const { user: authUser } = useAuth();
  const [group, setGroup] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true); // ← AQUÍ ESTABA EL ERROR
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Cargar grupo y mensajes
   useEffect(() => {
    const loadData = async () => {
      try {
        const [groupRes, messagesRes] = await Promise.all([
          api.get(`/groups/${id}`),
          api.get(`/messages/${id}`)
        ]);
        setGroup(groupRes.data);
        setMessages(messagesRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadData();

    // === ENTRAR A LA SALA ===
    socket.emit('join-group', id);

    // === ESCUCHAR MENSAJES NUEVOS ===
    const handleNewMessage = (msg) => {
        const groupId = msg.group?._id || msg.group || msg.groupId;
        if (groupId && groupId.toString() === id) {
          setMessages(prev => {
            const exists = prev.some(m => m._id === msg._id);
            if (exists) return prev;
            return [...prev, msg];
        });
      }
    };

    socket.on('new-message', handleNewMessage);

    // === LIMPIEZA ===
    return () => {
      socket.emit('leave-group', id);  // ← SALIR DE LA SALA
      socket.off('new-message', handleNewMessage);
    };
  }, [id]);

const sendMessage = async (e) => {
  e.preventDefault();
  if (!newMessage.trim()) return;

  const messageContent = newMessage.trim();
  setNewMessage(''); // ← Limpia el input al instante

  try {
    const res = await api.post(`/messages/${id}`, {
      content: messageContent
    });

    // ← AÑADE ESTO: el mensaje aparece al instante para ti también
    //comentado por dublicacion al escribir en chat
    //setMessages(prev => [...prev, res.data]);

  } catch (err) {
    console.error('Error enviando mensaje:', err);
    alert(err.response?.data?.message || 'Error enviando mensaje');
    // Si falla, vuelve a poner el texto
    setNewMessage(messageContent);
  }
};

  const rateUser = async (targetUserId, stars) => {
    try {
      await api.post(`/groups/${id}/rate`, { targetUserId, stars });
      // Opcional: recargar grupo para ver rating actualizado
      const res = await api.get(`/groups/${id}`);
      setGroup(res.data);
    } catch (err) {
      alert(err.response?.data?.message || 'Error al valorar');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!group) {
    return <div className="text-white text-center pt-20">Grupo no encontrado</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-purple-950/50 to-gray-950">
      <div className="max-w-6xl mx-auto p-6 pt-24">
        <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-purple-500/30 shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600/50 to-pink-600/50 p-6 border-b border-purple-500/30">
            <h1 className="text-4xl font-bold text-white">{group.name}</h1>
            <p className="text-purple-200">{group.game} • {group.members.length} miembros</p>
          </div>

          <div className="flex flex-col lg:flex-row h-[75vh]">
            {/* Chat */}
            <div className="flex-1 flex flex-col">
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.map(msg => (
                  <div key={msg._id} className={`flex ${msg.user._id === authUser._id ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                      msg.user._id === authUser._id 
                        ? 'bg-purple-600 text-white' 
                        : 'bg-white/10 text-gray-200 border border-purple-500/30'
                    }`}>
                      <p className="text-xs opacity-70 mb-1">@{msg.user.username}</p>
                      <p>{msg.content}</p>
                      <p className="text-xs opacity-50 mt-1">
                        {new Date(msg.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              <form onSubmit={sendMessage} className="p-4 border-t border-purple-500/30">
                <div className="flex gap-4">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Escribe un mensaje..."
                    className="flex-1 bg-white/10 border border-purple-500/50 rounded-xl px-6 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <button
                    type="submit"
                    className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-bold hover:scale-105 transition"
                  >
                    Enviar
                  </button>
                </div>
              </form>
            </div>

            {/* Miembros con valoración */}
            <div className="lg:w-80 border-t lg:border-t-0 lg:border-l border-purple-500/30 p-6 overflow-y-auto">
              <h2 className="text-2xl font-bold text-white mb-6">Miembros</h2>
              <div className="space-y-4">
                {group.members.map(member => (
                  <div key={member._id} className="bg-white/5 rounded-2xl p-4 border border-purple-500/30">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={member.avatar?.startsWith('http') ? member.avatar : `/avatars/${member.avatar || 'default.png'}`}
                          alt={member.username}
                          className="w-12 h-12 rounded-full object-cover border-2 border-purple-500"
                        />
                        <div>
                          <p className="font-bold text-white">@{member.username}</p>
                          {member._id === group.owner._id && (
                            <span className="text-xs text-yellow-400">Dueño</span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Estrellas para valorar (solo si no eres tú) */}
                    {member._id !== authUser._id && (
                      <div className="flex gap-1 justify-center mt-3">
                        {[1,2,3,4,5].map(star => (
                          <button
                            key={star}
                            onClick={() => rateUser(member._id, star)}
                            className="text-2xl hover:scale-125 transition transform"
                          >
                            {star === 5 ? 'GOAT' : '★'}
                          </button>
                        ))}
                      </div>
                    )}

                    {member._id === authUser._id && (
                      <div className="text-center mt-3">
                        <span className="text-3xl font-bold text-purple-400">
                          {Number(member.rating || 3).toFixed(1)} ★
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}