"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { login} from "@/api/auth";
import { registrarUsuario } from "@/api/usuario";
import { LoginRequest } from "@/domain/LoginRequest.interface";
import { useAuth } from "@/auth/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ModalRegistroUsuario from "../components/ModalRegistroUsuario";
import { UserFormData } from "../schemas/usuarioSchema";
import toast from "react-hot-toast";
import { Usuario } from "@/domain/Usuario.interface";

const schema = z.object({
  correo_electronico: z
    .string()
    .min(1, "El correo es obligatorio")
    .email("Correo inválido"),
  contrasena: z
    .string()
    .min(6, "La contraseña debe tener al menos 6 caracteres"),
});

type FormData = z.infer<typeof schema>;

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [token, setToken] = useState("");

  const { login: authLogin } = useAuth();
  const router = useRouter();

  const onSubmitLogin = async (data: FormData) => {
    setIsLoading(true);
    try {
      const response = await login(data as LoginRequest);
      if (response.data.token) {
        authLogin(response.data.token);
        router.push("/");
      } else {
        alert("No se recibió token de autenticación");
      }
    } catch (error) {
      console.error("Error en login:", error);
      alert("Error al iniciar sesión, verifica tus credenciales");
    } finally {
      setIsLoading(false);
    }
  };
  const transformarAUsuario = (
    data: UserFormData,
    usuarioCreacion: string
  ): Usuario => {
    const fechaActual = new Date();

    return {
      nombre: data.nombre,
      apellido: data.apellido,
      identificacion: data.identificacion,
      correo_electronico: data.correo_electronico,
      contrasena: data.contrasena,
      tipo_usuario_id: Number(data.tipo_usuario_id),
      activo: Number(data.activo),
      telefono: data.telefono,
      fecha_creacion: fechaActual,
      usuario_creacion: usuarioCreacion,
      fecha_modificacion: fechaActual,
      usuario_modificacion: usuarioCreacion,
    };
  };
  const onSubmit = async (data: UserFormData) => {
    try {
      const obtenerUsuarioCreacion = transformarAUsuario(data, "admin");
      const resultado = await registrarUsuario(obtenerUsuarioCreacion, token);
      console.log("res", resultado);
      if (resultado.esExitoso) {
        toast.success("Usuario insertado correctamente");
      } else {
        toast.error("Error al guardar usuario");
      }
    } catch (error) {
      toast.error("El correo o identificación ya están en uso");
      console.error("Error al enviar el formulario:", error);
    }
  };
  useEffect(() => {
    const storedToken = localStorage.getItem("authToken");
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-md">
        <h2 className="text-2xl font-bold text-center mb-6 text-orange-700">
          Iniciar Sesión
        </h2>

        <form onSubmit={handleSubmit(onSubmitLogin)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Correo electrónico
            </label>
            <input
              type="email"
              {...register("correo_electronico")}
              className={`mt-1 block w-full p-2 border text-[#686868] ${
                errors.correo_electronico ? "border-red-500" : "border-gray-300"
              } rounded-md`}
            />
            {errors.correo_electronico && (
              <p className="text-red-500 text-sm mt-1">
                {errors.correo_electronico.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Contraseña
            </label>
            <input
              type="password"
              {...register("contrasena")}
              className={`mt-1 block w-full p-2 border text-[#686868]  ${
                errors.contrasena ? "border-red-500" : "border-gray-300"
              } rounded-md`}
            />
            {errors.contrasena && (
              <p className="text-red-500 text-sm mt-1">
                {errors.contrasena.message}
              </p>
            )}
          </div>
          <p className="text-center text-sm text-gray-600">
            ¿No tienes cuenta?{" "}
            <button
              type="button"
              onClick={() => setShowRegisterModal(true)}
              className="text-orange-700 hover:underline font-medium"
            >
              Regístrate
            </button>
          </p>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full flex justify-center items-center gap-2 bg-orange-700 text-white font-bold py-2 px-4 rounded-md transition ${
              isLoading
                ? "bg-orange-500 cursor-not-allowed"
                : "hover:bg-orange-800"
            }`}
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8z"
                  ></path>
                </svg>
                Iniciando...
              </>
            ) : (
              "Iniciar sesión"
            )}
          </button>
        </form>
      </div>
      {showRegisterModal && (
        <ModalRegistroUsuario
          isOpen={showRegisterModal}
          onClose={() => {
            setShowRegisterModal(false);
          }}
          onSubmit={onSubmit}
        />
      )}
    </div>
  );
}
