// src/pages/EditProfile.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function EditProfile() {
  const navigate = useNavigate();
  const { user, login } = useAuth(); // login actualiza el contexto

  const [formData, setFormData] = useState({
    username: "",
    avatar: "",
    intention: "just-play",
  });
  const [avatars, setAvatars] = useState([]); // ← Lista de avatares
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const profileRes = await api.get("/auth/me");
        const avatarsRes = await api.get("/avatars/list"); // ← CORRECTO
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

      // REDIRIGIR SIN HACER LOGIN DE NUEVO
      navigate("/profile"); // ← PERFECTO, SIN RECARGA DE PÁGINA

      // O con recarga si quieres estar 100% seguro:
      // window.location.href = '/profile';
    } catch (err) {
      console.error("Error guardando perfil:", err);
      alert(err.response?.data?.message || "Error al guardar");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-purple-950/50 to-gray-950 pt-20 px-6">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white/5 backdrop-blur-xl border border-purple-500/30 rounded-3xl p-10 shadow-2xl">
          <h1 className="text-5xl font-bold text-white mb-10 text-center">
            Editar Perfil
          </h1>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div>
              <label className="block text-xl text-purple-300 mb-3">
                Username
              </label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
                className="w-full px-6 py-4 bg-white/10 border border-purple-500/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>

            {/* Avatar con selector visual */}
            <div>
              <label className="block text-xl text-purple-300 mb-4">
                Elige tu Avatar
              </label>
              <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-4 max-h-96 overflow-y-auto p-4 bg-white/5 rounded-xl border border-purple-500/30">
                {avatars.map((avatar) => (
                  <div
                    key={avatar}
                    onClick={() => setFormData({ ...formData, avatar })}
                    className={`relative cursor-pointer rounded-xl overflow-hidden border-4 transition-all duration-200 ${
                      formData.avatar === avatar
                        ? "border-purple-500 ring-4 ring-purple-500/50 scale-110"
                        : "border-white/20 hover:border-purple-400"
                    }`}
                  >
                    <img
                      src={`${API_URL}/avatars/${avatar}`}
                      alt={avatar}
                      className="w-full h-full object-cover aspect-square"
                    />
                    {formData.avatar === avatar && (
                      <div className="absolute inset-0 bg-purple-500/30 flex items-center justify-center">
                        <svg
                          className="w-8 h-8 text-white"
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
            </div>

            <div>
              <label className="block text-xl text-purple-300 mb-3">
                Intención
              </label>
              <select
                value={formData.intention}
                onChange={(e) =>
                  setFormData({ ...formData, intention: e.target.value })
                }
                className="w-full px-6 py-4 bg-white/10 border border-purple-500/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="just-play">Solo jugar</option>
                <option value="make-friends">Hacer amigos</option>
              </select>
            </div>

            <div className="flex gap-6 justify-center pt-6">
              <button
                type="submit"
                disabled={saving}
                className="px-12 py-5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl font-bold text-xl hover:scale-105 transition shadow-xl disabled:opacity-70"
              >
                {saving ? "Guardando..." : "Guardar Cambios"}
              </button>
              <button
                type="button"
                onClick={() => navigate("/profile")}
                className="px-12 py-5 bg-white/10 border border-purple-500/50 rounded-2xl font-bold text-xl hover:scale-105 transition"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
