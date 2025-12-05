// src/pages/EditProfile.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function EditProfile() {
  const navigate = useNavigate();
  const { user, login } = useAuth();

  const [formData, setFormData] = useState({
    username: "",
    avatar: "",
    intention: "just-play",
  });
  const [avatars, setAvatars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const profileRes = await api.get("/auth/me");
        const avatarsRes = await api.get("/avatars/list");
        const avatarList = avatarsRes.data;

        setFormData({
          username: profileRes.data.username || "",
          avatar: profileRes.data.avatar || "",
          intention: profileRes.data.intention || "just-play",
        });

        setAvatars(avatarList.length > 0 ? avatarList : ["default.png"]);
      } catch (err) {
        console.error("Error cargando datos:", err);
        setAvatars(["default.png"]);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      await api.put("/users/me", formData);
      navigate("/profile");
    } catch (err) {
      console.error("Error guardando perfil:", err);
      alert(err.response?.data?.message || "Error al guardar");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-purple-950/50 to-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-400 mt-4">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-purple-950/50 to-gray-950 pt-24 pb-16 px-6">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white/5 backdrop-blur-xl border border-purple-500/30 rounded-3xl p-8 lg:p-10 shadow-2xl">
          <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-8 text-center">
            Editar Perfil
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Nombre de usuario
              </label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
                className="w-full px-4 py-3 bg-white/10 border border-purple-500/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                placeholder="Tu nombre de usuario"
                required
              />
            </div>

            {/* Avatar con selector visual */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-3">
                Elige tu Avatar
              </label>
              <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-3 max-h-96 overflow-y-auto p-4 bg-white/5 rounded-xl border border-purple-500/30 custom-scrollbar">
                {avatars.map((avatar) => (
                  <div
                    key={avatar}
                    onClick={() => setFormData({ ...formData, avatar })}
                    className={`relative cursor-pointer rounded-xl overflow-hidden border-4 transition-all duration-200 hover:scale-105 ${
                      formData.avatar === avatar
                        ? "border-purple-500 ring-4 ring-purple-500/50 scale-105"
                        : "border-white/20 hover:border-purple-400"
                    }`}
                  >
                    <img
                      src={`${API_URL}/avatars/${avatar}`}
                      alt={avatar}
                      className="w-full h-full object-cover aspect-square"
                    />
                    {formData.avatar === avatar && (
                      <div className="absolute inset-0 bg-purple-500/30 flex items-center justify-center backdrop-blur-[2px]">
                        <svg
                          className="w-8 h-8 text-white drop-shadow-lg"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          />
                        </svg>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-400 mt-2">
                Selecciona una imagen para tu perfil
              </p>
            </div>

            {/* Intención */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                ¿Qué buscas en SafeZone?
              </label>
              <select
                value={formData.intention}
                onChange={(e) =>
                  setFormData({ ...formData, intention: e.target.value })
                }
                className="w-full px-4 py-3 bg-white/10 border border-purple-500/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
              >
                <option value="just-play" className="bg-gray-900">
                  Solo jugar
                </option>
                <option value="make-friends" className="bg-gray-900">
                  Hacer amigos
                </option>
              </select>
            </div>

            {/* Botones */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <button
                type="button"
                onClick={() => navigate("/profile")}
                className="flex-1 px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-bold rounded-xl transition-all duration-200"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold rounded-xl transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg hover:shadow-purple-500/50"
              >
                {saving ? "Guardando..." : "Guardar Cambios"}
              </button>
            </div>
          </form>
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(168, 85, 247, 0.5);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(168, 85, 247, 0.7);
        }
      `}</style>
    </div>
  );
}