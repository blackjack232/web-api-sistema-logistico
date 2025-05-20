"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  asignacionSchema,
  AsignacionFormData,
} from "../schemas/asignacionSchema";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { useAuth } from "@/auth/AuthContext";
import { useRouter } from "next/navigation";
import { useDecodedToken } from "../utils/useDecodedToken";
import { registrarAsignacion } from "../../api/rutas";

export default function AsignacionUTA() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [token, setToken] = useState("");
  const usuario = useDecodedToken();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<AsignacionFormData>({
    resolver: zodResolver(asignacionSchema),
  });

  // Ver valores actuales
  const envioSeleccionado = watch("envio_id");
  const rutaSeleccionada = watch("ruta_id");
  const transportistaSeleccionado = watch("transportista_id");

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated) {
      router.replace("/login");
    } else {
      const storedToken = localStorage.getItem("authToken");
      if (storedToken) setToken(storedToken);
    }
  }, [isAuthenticated, isLoading, router]);

  const onSubmit = async (data: AsignacionFormData) => {
    setLoading(true);
    try {
      const payload = {
        ...data,
      };
      const response = await registrarAsignacion(payload, token);
      if (response.esExitoso) {
        toast.success("Asignación registrada correctamente");
        reset();
      } else {
        toast.error("Error al registrar la asignación");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error inesperado");
    } finally {
      setLoading(false);
    }
  };

  const envios = [
    { id: 1, nombre: "Envío 1" },
    { id: 2, nombre: "Envío 2" },
  ];

  const rutas = [
    { id: 1, nombre: "Ruta 5" },
    { id: 1, nombre: "Ruta 6" },
  ];

  const transportistas = [
    { id: 1, nombre: "Transportista 1" }
  ];

  if (!isAuthenticated) return null;

  return (
    <div className="mt-24 min-h-screen bg-gray-100 p-6">
      <div className="max-w-2xl mx-auto bg-white p-6 rounded-2xl shadow-md">
        <h2 className="text-xl font-bold text-orange-700 mb-6">Asignar ruta</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Select de Envío */}
          <div>
            <label className="text-gray-700">ID del envío:</label>
            <select
              {...register("envio_id", { valueAsNumber: true })}
              defaultValue=""
              className={`w-full p-2 border rounded ${
                !envioSeleccionado ? "text-gray-400" : "text-[#686868]"
              }`}
            >
              <option value="" disabled hidden>
                Seleccione un envío
              </option>
              {envios.map((envio) => (
                <option key={envio.id} value={envio.id}>
                  {envio.nombre}
                </option>
              ))}
            </select>
            {errors.envio_id && (
              <p className="text-red-500">{errors.envio_id.message}</p>
            )}
          </div>

          {/* Select de Ruta */}
          <div>
            <label className="text-gray-700">ID de la ruta:</label>
            <select
              {...register("ruta_id", { valueAsNumber: true })}
              defaultValue=""
              className={`w-full p-2 border rounded ${
                !rutaSeleccionada ? "text-gray-400" : "text-[#686868]"
              }`}
            >
              <option value="" disabled hidden>
                Seleccione una ruta
              </option>
              {rutas.map((ruta) => (
                <option key={ruta.id} value={ruta.id}>
                  {ruta.nombre}
                </option>
              ))}
            </select>
            {errors.ruta_id && (
              <p className="text-red-500">{errors.ruta_id.message}</p>
            )}
          </div>

          {/* Select de Transportista */}
          <div>
            <label className="text-gray-700">ID del transportista:</label>
            <select
              {...register("transportista_id", { valueAsNumber: true })}
              defaultValue=""
              className={`w-full p-2 border rounded ${
                !transportistaSeleccionado ? "text-gray-400" : "text-[#686868]"
              }`}
            >
              <option value="" disabled hidden>
                Seleccione un transportista
              </option>
              {transportistas.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.nombre}
                </option>
              ))}
            </select>
            {errors.transportista_id && (
              <p className="text-red-500">
                {errors.transportista_id.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`min-w-[150px] flex justify-center items-center gap-2 bg-orange-700 text-white font-bold py-2 px-4 rounded-md transition ${
              loading
                ? "bg-orange-500 cursor-not-allowed"
                : "hover:bg-orange-800"
            }`}
          >
            {loading ? (
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
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8H4z"
                />
              </svg>
            ) : (
              "Asignar"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
