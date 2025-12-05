// src/pages/Profile.jsx
import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

const intentionConfig = {
  "just-play": { label: "Solo jugar", gradient: "from-orange-500 to-red-600", glow: "shadow-orange-500/50" },
  "make-friends": {
    label: "Hacer amigos",
    gradient: "from-emerald-400 to-cyan-500",
    glow: "shadow-cyan-500/50"
  },
};

const getRatingInfo = (r) => {
  const rating = Math.round(r || 3);
  if (rating <= 1) return { label: "Tóxico", color: "text-red-500" };
  if (rating === 2) return { label: "Malo", color: "text-orange-500" };
  if (rating === 3) return { label: "Normal", color: "text-yellow-400" };
  if (rating === 4) return { label: "Bueno", color: "text-lime-400" };
  return { label: "GOAT", color: "text-purple-400" };
};

export default function Profile() {
  const { id } = useParams();
  const { user: currentUser } = useAuth();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    const loadProfile = async () => {
      try {
        setLoading(true);

        // Si hay id en la URL → perfil de otro usuario
        // Si no → perfil propio
        const endpoint = id ? `/users/${id}` : "/auth/me";
        const res = await api.get(endpoint, { signal: controller.signal });

        setUser(res.data);
      } catch (err) {
        if (err.name !== "CanceledError" && err.name !== "AbortError") {
          console.error("Error cargando perfil:", err);
          if (err.response?.status === 401) {
            localStorage.removeItem("token");
            window.location.href = "/login";
          }
        }
      } finally {
        setLoading(false);
      }
    };

    loadProfile();

    return () => controller.abort();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-purple-950/50 to-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-400 mt-4">Cargando perfil...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-purple-950/50 to-gray-950 flex items-center justify-center px-6">
        <div className="text-center bg-white/5 backdrop-blur-xl border border-purple-500/30 rounded-3xl p-12">
          <p className="text-3xl text-gray-400 mb-6">Usuario no encontrado</p>
          <Link
            to="/dashboard"
            className="inline-block px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-xl font-bold transition-all duration-200 hover:scale-105 active:scale-95"
          >
            Volver al Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const isOwnProfile = !id || id === currentUser?._id;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-purple-950/50 to-gray-950 pt-24 pb-16 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white/5 backdrop-blur-xl border border-purple-500/30 rounded-3xl p-10 lg:p-16 shadow-2xl overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 to-pink-600/10"></div>

          <div className="relative z-10 flex flex-col lg:flex-row items-center gap-10">
            {/* Avatar con efecto glow */}
            <div className="relative">
              <img
                src={
                  user.avatar?.startsWith("http")
                    ? user.avatar
                    : `http://localhost:5000/avatars/${
                        user.avatar || "default.png"
                      }`
                }
                alt={user.username}
                className="w-40 h-40 lg:w-56 lg:h-56 rounded-full border-4 border-purple-500/60 object-cover shadow-2xl"
                onError={(e) => {
                  e.currentTarget.src = 'http://localhost:5000/avatars/default.png';
                }}
              />
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-purple-600 to-pink-600 opacity-30 blur-xl"></div>
            </div>

            <div className="text-center lg:text-left flex-1">
              <h1 className="text-5xl lg:text-7xl font-extrabold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent mb-8">
                {user.username}
              </h1>

              <div className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start">
                {/* Intención */}
                {user.intention && (
                  <div
                    className={`px-8 py-4 rounded-2xl bg-gradient-to-r ${
                      intentionConfig[user.intention]?.gradient ||
                      "from-gray-600 to-gray-700"
                    } text-white font-bold text-xl shadow-2xl ${
                      intentionConfig[user.intention]?.glow || ""
                    }`}
                  >
                    {intentionConfig[user.intention]?.label || "Sin intención"}
                  </div>
                )}

                {/* Rating con estrellas */}
                <div className="px-8 py-4 rounded-2xl bg-white/10 backdrop-blur-xl border-2 border-purple-500/30">
                  <div className="flex items-center gap-3">
                    <span
                      className={`text-3xl font-bold ${
                        getRatingInfo(user.rating).color
                      }`}
                    >
                      {Number(user.rating || 3).toFixed(1)}
                    </span>
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <svg
                          key={i}
                          className={`w-7 h-7 ${
                            i <= Math.round(user.rating || 3)
                              ? "text-yellow-400"
                              : "text-gray-600"
                          }`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span
                      className={`text-2xl font-bold ${
                        getRatingInfo(user.rating).color
                      }`}
                    >
                      {getRatingInfo(user.rating).label}
                    </span>
                  </div>
                </div>
              </div>

              {/* Botones de acción */}
              <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                {isOwnProfile ? (
                  <>
                    <Link
                      to="/profile/edit"
                      className="px-10 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-xl font-bold text-xl hover:scale-105 active:scale-95 transition-all duration-200 shadow-xl hover:shadow-purple-500/50 text-center"
                    >
                      Editar Perfil
                    </Link>
                    <Link
                      to="/dashboard"
                      className="px-10 py-4 bg-white/10 backdrop-blur border border-purple-500/50 hover:bg-white/20 rounded-xl font-bold text-xl hover:scale-105 active:scale-95 transition-all duration-200 text-center"
                    >
                      Dashboard
                    </Link>
                  </>
                ) : (
                  <Link
                    to="/dashboard"
                    className="px-10 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-xl font-bold text-xl hover:scale-105 active:scale-95 transition-all duration-200 shadow-xl hover:shadow-purple-500/50 text-center"
                  >
                    Volver al Dashboard
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}