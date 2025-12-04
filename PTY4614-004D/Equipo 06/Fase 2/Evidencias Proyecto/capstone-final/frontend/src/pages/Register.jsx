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
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <div className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-2xl w-full max-w-md">
        <h2 className="text-3xl font-bold text-center mb-6 text-purple-300">Crear Cuenta</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Username */}
          <div>
            <input
              {...register("username")}
              type="text"
              placeholder="Nombre de usuario"
              className={`w-full px-4 py-3 rounded-lg bg-white/20 border ${
                errors.username ? "border-red-500" : "border-purple-500"
              } focus:outline-none focus:ring-2 focus:ring-purple-400 text-white placeholder-gray-300 transition`}
            />
            {errors.username && <p className="text-red-400 text-sm mt-1">{errors.username.message}</p>}
          </div>

          {/* Email */}
          <div>
            <input
              {...register("email")}
              type="email"
              placeholder="Email"
              className={`w-full px-4 py-3 rounded-lg bg-white/20 border ${
                errors.email ? "border-red-500" : "border-purple-500"
              } focus:outline-none focus:ring-2 focus:ring-purple-400 text-white placeholder-gray-300 transition`}
            />
            {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>}
          </div>

          {/* Password */}
          <div>
            <input
              {...register("password")}
              type="password"
              placeholder="Contraseña (mín. 8 caracteres)"
              className={`w-full px-4 py-3 rounded-lg bg-white/20 border ${
                errors.password ? "border-red-500" : "border-purple-500"
              } focus:outline-none focus:ring-2 focus:ring-purple-400 text-white placeholder-gray-300 transition`}
            />
            {errors.password && <p className="text-red-400 text-sm mt-1">{errors.password.message}</p>}
          </div>

          {/* Confirm Password */}
          <div>
            <input
              {...register("confirmPassword")}
              type="password"
              placeholder="Confirmar contraseña"
              className={`w-full px-4 py-3 rounded-lg bg-white/20 border ${
                errors.confirmPassword ? "border-red-500" : "border-purple-500"
              } focus:outline-none focus:ring-2 focus:ring-purple-400 text-white placeholder-gray-300 transition`}
            />
            {errors.confirmPassword && <p className="text-red-400 text-sm mt-1">{errors.confirmPassword.message}</p>}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition disabled:opacity-70"
          >
            {isSubmitting ? "Creando cuenta..." : "Registrarse"}
          </button>
        </form>

        <p className="text-center mt-6 text-sm text-gray-300">
          ¿Ya tienes cuenta? <Link to="/login" className="text-purple-400 hover:underline font-medium">Inicia sesión</Link>
        </p>
      </div>
    </div>
  );
}