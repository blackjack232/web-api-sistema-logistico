"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { envioSchema, EnvioFormData } from "../schemas/envioSchema";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useAuth } from "@/auth/AuthContext";
import { useRouter } from "next/navigation";
import { registrarEnvio } from "../../api/envios";
import { Envio } from "@/domain/Envio.interface";

export default function CrearEnvio() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [token, setToken] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<EnvioFormData>({
    resolver: zodResolver(envioSchema),
  });

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/login");
    } else {
      const storedToken = localStorage.getItem("authToken");
      if (storedToken) setToken(storedToken);
    }
  }, [isAuthenticated, router]);

  const onSubmit = async (data: EnvioFormData) => {
    try {
    
      const envio: Envio = {
      nombre_remitente: data.nombre_remitente,
      nombre_destinatario: data.nombre_destinatario,
      apellido_remitente: data.apellido_remitente,
      apellido_destinatario: data.apellido_destinatario,
      cedula_remitente: data.cedula_remitente,
      cedula_destinatario: data.cedula_destinatario,
      telefono_remitente: data.telefono_remitente,
      telefono_destinatario: data.telefono_destinatario,
      direccion_envio: data.direccion_envio,
      direccion_destino: data.direccion_destino,
      peso: data.peso,
      ancho: data.ancho,
      alto: data.alto,
      tipo_producto: data.tipo_producto,
      estado: "En espera",
      usuario_creacion_id: 2,
    };
      const response = await registrarEnvio(envio, token);

      if (response.esExitoso) {
        toast.success("Envío registrado correctamente");
        reset();
      } else {
        toast.error("Error al registrar el envío");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error inesperado");
    }
  };

  if (!isAuthenticated) return null;

  return (
    <div className="mt-24 min-h-screen bg-gray-100 p-6">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-2xl shadow-md">
        <h2 className="text-xl font-bold text-orange-700 mb-6">Registrar nuevo envío</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Remitente */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-gray-700">Nombre remitente:</label>
              <input
                {...register("nombre_remitente")}
                className="w-full p-2 border rounded text-[#686868]"
              />
              {errors.nombre_remitente && (
                <p className="text-red-500">{errors.nombre_remitente.message}</p>
              )}
            </div>
            <div>
              <label className="text-gray-700">Apellido remitente:</label>
              <input
                {...register("apellido_remitente")}
                className="w-full p-2 border rounded text-[#686868]"
              />
              {errors.apellido_remitente && (
                <p className="text-red-500">{errors.apellido_remitente.message}</p>
              )}
            </div>
            <div>
              <label className="text-gray-700">Cédula remitente:</label>
              <input
                {...register("cedula_remitente")}
                className="w-full p-2 border rounded text-[#686868]"
              />
              {errors.cedula_remitente && (
                <p className="text-red-500">{errors.cedula_remitente.message}</p>
              )}
            </div>
            <div>
              <label className="text-gray-700">Teléfono remitente:</label>
              <input
                {...register("telefono_remitente")}
                className="w-full p-2 border rounded text-[#686868]"
              />
              {errors.telefono_remitente && (
                <p className="text-red-500">{errors.telefono_remitente.message}</p>
              )}
            </div>
          </div>

          {/* Destinatario */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-gray-700">Nombre destinatario:</label>
              <input
                {...register("nombre_destinatario")}
                className="w-full p-2 border rounded text-[#686868]"
              />
              {errors.nombre_destinatario && (
                <p className="text-red-500">{errors.nombre_destinatario.message}</p>
              )}
            </div>
            <div>
              <label className="text-gray-700">Apellido destinatario:</label>
              <input
                {...register("apellido_destinatario")}
                className="w-full p-2 border rounded text-[#686868]"
              />
              {errors.apellido_destinatario && (
                <p className="text-red-500">{errors.apellido_destinatario.message}</p>
              )}
            </div>
            <div>
              <label className="text-gray-700">Cédula destinatario:</label>
              <input
                {...register("cedula_destinatario")}
                className="w-full p-2 border rounded text-[#686868]"
              />
              {errors.cedula_destinatario && (
                <p className="text-red-500">{errors.cedula_destinatario.message}</p>
              )}
            </div>
            <div>
              <label className="text-gray-700">Teléfono destinatario:</label>
              <input
                {...register("telefono_destinatario")}
                className="w-full p-2 border rounded text-[#686868]"
              />
              {errors.telefono_destinatario && (
                <p className="text-red-500">{errors.telefono_destinatario.message}</p>
              )}
            </div>
          </div>

          {/* Direcciones */}
          <div>
            <label className="text-gray-700">Dirección de envío:</label>
            <input
              {...register("direccion_envio")}
              className="w-full p-2 border rounded text-[#686868]"
            />
            {errors.direccion_envio && (
              <p className="text-red-500">{errors.direccion_envio.message}</p>
            )}
          </div>
          <div>
            <label className="text-gray-700">Dirección de destino:</label>
            <input
              {...register("direccion_destino")}
              className="w-full p-2 border rounded text-[#686868]"
            />
            {errors.direccion_destino && (
              <p className="text-red-500">{errors.direccion_destino.message}</p>
            )}
          </div>

          {/* Detalles del paquete */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-gray-700">Peso (kg):</label>
              <input
                type="number"
                step="0.01"
                {...register("peso", { valueAsNumber: true })}
                className="w-full p-2 border rounded text-[#686868]"
              />
              {errors.peso && <p className="text-red-500">{errors.peso.message}</p>}
            </div>
            <div>
              <label className="text-gray-700">Ancho (cm):</label>
              <input
                type="number"
                step="0.1"
                {...register("ancho", { valueAsNumber: true })}
                className="w-full p-2 border rounded text-[#686868]"
              />
              {errors.ancho && <p className="text-red-500">{errors.ancho.message}</p>}
            </div>
            <div>
              <label className="text-gray-700">Alto (cm):</label>
              <input
                type="number"
                step="0.1"
                {...register("alto", { valueAsNumber: true })}
                className="w-full p-2 border rounded text-[#686868]"
              />
              {errors.alto && <p className="text-red-500">{errors.alto.message}</p>}
            </div>
          </div>

          <div>
            <label className="text-gray-700">Tipo de producto:</label>
            <input
              {...register("tipo_producto")}
              className="w-full p-2 border rounded text-[#686868]"
            />
            {errors.tipo_producto && (
              <p className="text-red-500">{errors.tipo_producto.message}</p>
            )}
          </div>

          <button
            type="submit"
            className="bg-orange-700 text-white px-6 py-2 rounded-md hover:bg-orange-800 mt-4"
          >
            Registrar Envío
          </button>
        </form>
      </div>
    </div>
  );
}
