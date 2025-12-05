import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useNavigate } from "react-router-dom";
import api from '../services/api';

// Esquema de validación con Zod
const schema = z.object({
  username: z.string().min(3, "Mínimo 3 caracteres"),
  email: z.string().email("Email inválido"),
  password: z.string().min(8, "Mínimo 8 caracteres"),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"],
});

export default function Register() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema)
  });

  const onSubmit = async (data) => {
    try {
      await api.post('/auth/register', {
        username: data.username,
        email: data.email,
        password: data.password
      });
      navigate('/login');
    } catch (err) {
      alert(err.response?.data?.message || "Error al registrarse");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-gray-950 via-purple-950/50 to-gray-950">
      <div className="bg-white/5 backdrop-blur-xl p-8 rounded-3xl border border-purple-500/30 shadow-2xl w-full max-w-md">
        <h2 className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          Crear Cuenta
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Username */}
          <div>
            <input
              {...register("username")}
              type="text"
              placeholder="Nombre de usuario"
              className={`w-full px-4 py-3 rounded-xl bg-white/10 border ${
                errors.username ? "border-red-500" : "border-purple-500/50"
              } focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-400 transition-all duration-200`}
            />
            {errors.username && (
              <p className="text-red-400 text-sm mt-2 flex items-center gap-1">
                <span>⚠️</span> {errors.username.message}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <input
              {...register("email")}
              type="email"
              placeholder="Email"
              className={`w-full px-4 py-3 rounded-xl bg-white/10 border ${
                errors.email ? "border-red-500" : "border-purple-500/50"
              } focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-400 transition-all duration-200`}
            />
            {errors.email && (
              <p className="text-red-400 text-sm mt-2 flex items-center gap-1">
                <span>⚠️</span> {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <input
              {...register("password")}
              type="password"
              placeholder="Contraseña (mín. 8 caracteres)"
              className={`w-full px-4 py-3 rounded-xl bg-white/10 border ${
                errors.password ? "border-red-500" : "border-purple-500/50"
              } focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-400 transition-all duration-200`}
            />
            {errors.password && (
              <p className="text-red-400 text-sm mt-2 flex items-center gap-1">
                <span>⚠️</span> {errors.password.message}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <input
              {...register("confirmPassword")}
              type="password"
              placeholder="Confirmar contraseña"
              className={`w-full px-4 py-3 rounded-xl bg-white/10 border ${
                errors.confirmPassword ? "border-red-500" : "border-purple-500/50"
              } focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-400 transition-all duration-200`}
            />
            {errors.confirmPassword && (
              <p className="text-red-400 text-sm mt-2 flex items-center gap-1">
                <span>⚠️</span> {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 py-3 rounded-xl font-bold hover:from-purple-700 hover:to-pink-700 transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg hover:shadow-purple-500/50"
          >
            {isSubmitting ? "Creando cuenta..." : "Registrarse"}
          </button>
        </form>

        <p className="text-center mt-6 text-sm text-gray-300">
          ¿Ya tienes cuenta?{" "}
          <Link 
            to="/login" 
            className="text-purple-400 hover:text-purple-300 font-semibold transition-colors duration-200"
          >
            Inicia sesión
          </Link>
        </p>
      </div>
    </div>
  );
}