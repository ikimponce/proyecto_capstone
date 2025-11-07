// src/pages/GroupChat.jsx
import { useParams, useNavigate } from 'react-router-dom';
import Chat from '../components/Chat';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useState, useEffect } from 'react';

export default function GroupChat() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [group, setGroup] = useState(null);
  const [isMember, setIsMember] = useState(false);
  const [inviteCode, setInviteCode] = useState('');
  const [showInvite, setShowInvite] = useState(false);

  useEffect(() => {
    const fetchGroup = async () => {
      try {
        const res = await api.get(`/groups/${id}`);
        setGroup(res.data);
        setIsMember(res.data.members.some(m => m._id === user._id));
      } catch (err) {
        if (err.response?.status === 403 || err.response?.status === 404) {
          setShowInvite(true);
        }
      }
    };
    fetchGroup();
  }, [id, user._id]);

  const handleJoin = async () => {
    try {
      const res = await api.post(`/groups/${id}/join`, { inviteCode });
      setGroup(res.data);
      setIsMember(true);
      setShowInvite(false);
    } catch (err) {
      alert('Código inválido o error al unirse');
    }
  };

  if (showInvite) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="bg-white/10 backdrop-blur-xl border border-purple-500/30 p-8 rounded-3xl max-w-md w-full">
          <h2 className="text-3xl font-bold text-white mb-4">Grupo Privado</h2>
          <input
            type="text"
            value={inviteCode}
            onChange={(e) => setInviteCode(e.target.value)}
            placeholder="Código de invitación"
            className="w-full px-4 py-3 bg-white/5 border border-purple-500/30 rounded-xl text-white mb-4"
          />
          <button
            onClick={handleJoin}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 py-3 rounded-xl font-bold"
          >
            Unirse
          </button>
        </div>
      </div>
    );
  }

  if (!isMember) {
    return <div className="text-center py-32 text-2xl text-gray-400">Cargando...</div>;
  }

  return (
    <div className="min-h-screen p-6 sm:p-8 lg:p-12">
      <div className="max-w-7xl mx-auto h-full flex flex-col gap-6">
        <div className="bg-white/5 backdrop-blur-xl border border-purple-500/30 p-6 lg:p-8 rounded-3xl shadow-2xl">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            {group?.name}
          </h1>
          <p className="text-lg text-gray-400 mt-2">Juego: {group?.game}</p>
          <p className="text-sm text-gray-500">
            {group?.members.length} {group?.members.length === 1 ? 'miembro' : 'miembros'}
          </p>
        </div>
        <div className="flex-1 bg-black/30 backdrop-blur-xl rounded-3xl overflow-hidden border border-purple-500/30 shadow-2xl">
          <Chat groupId={id} />
        </div>
      </div>
    </div>
  );
}