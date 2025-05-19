"use client";

import { buscarEnvioPorGuia } from "@/api/envios";
import { useAuth } from "@/auth/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";

interface Envio {
  numero_guia: string;
  cedula_remitente: string;
  apellido_Remitente: string;
  cedula_destinatario: string;
  apellido_Destinatario: string;
  estado: string;
}
const socket = io("http://localhost:3002");
export default function SeguimientoEnvios() {
  const [busqueda, setBusqueda] = useState("");
  const [loading, setLoading] = useState(false);
  const [resultados, setResultados] = useState<Envio | null>(null);
  const [token, setToken] = useState("");
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [estados, setEstados] = useState<
    { numeroGuia: string; nuevoEstado: string }[]
  >([]);

  const buscarPorGuia = async () => {
    setLoading(true);
    try {
      const response = await buscarEnvioPorGuia(busqueda, token);
      if (response.esExitoso) {
        setResultados(response.data.data);
        console.log(estados);
      } else {
        setResultados(null);
      }
    } catch (error) {
      console.error("Error al buscar envío:", error);
      setResultados(null);
    } finally {
      setLoading(false);
    }
  };

  const getEstadoColor = (estado: string) => {
    switch (estado.toLowerCase()) {
      case "en espera":
        return "bg-yellow-500";
      case "en tránsito":
        return "bg-blue-500";
      case "llegó al destino":
        return "bg-green-600";
      default:
        return "bg-gray-400";
    }
  };
  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated) {
      router.replace("/login");
    } else {
      const storedToken = localStorage.getItem("authToken");
      if (storedToken) setToken(storedToken);
    }
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    socket.on("envio_actualizado", (data) => {
      const info = JSON.parse(data);
      setEstados((prevEstados) => [
        ...prevEstados,
        {
          numeroGuia: info.numeroGuia,
          nuevoEstado: info.nuevoEstado,
        },
      ]);
      setResultados((prev) => {
        if (prev && prev.numero_guia === info.numeroGuia) {
          return {
            ...prev,
            estado: info.nuevoEstado,
          };
        }
        return prev;
      });
    });

    return () => {
      socket.off("envio_actualizado");
    };
  }, []);

  if (!isAuthenticated) return null;
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6 mt-32 text-gray-700">
        Seguimiento de Envíos
      </h1>

      <div className="flex items-center gap-2 mb-6 max-w-md">
        <input
          type="text"
          placeholder="Buscar por número de guía"
          className="flex-grow border px-3 py-2 rounded text-[#686868]"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
        <button
          type="button"
          disabled={loading}
          className={`min-w-[120px] flex justify-center items-center gap-2 bg-orange-700 text-white font-bold py-2 px-4 rounded-md transition ${
            loading ? "bg-orange-500 cursor-not-allowed" : "hover:bg-orange-800"
          }`}
          onClick={buscarPorGuia}
        >
          {loading ? (
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
            "Buscar"
          )}
        </button>
      </div>
      <table className="w-full table-auto border-collapse">
        <thead>
          <tr className="bg-gray-200 text-gray-700">
            <th className="p-2 border">Número de Guía</th>
            <th className="p-2 border">No. cedula Remitente</th>
            <th className="p-2 border">No. cedula Destinatario</th>
            <th className="p-2 border">Estado</th>
          </tr>
        </thead>
        <tbody className="text-[#686868]">
          {resultados ? (
            <tr className="text-center border-t">
              <td className="p-2 border">{resultados.numero_guia}</td>
              <td className="p-2 border">{resultados.cedula_remitente}</td>
              <td className="p-2 border">{resultados.cedula_destinatario} </td>
              <td className="p-2 border">
                <span
                  className={`text-white px-2 py-1 rounded ${getEstadoColor(
                    resultados.estado
                  )}`}
                >
                  {resultados.estado}
                </span>
              </td>
            </tr>
          ) : (
            <tr>
              <td colSpan={4} className="p-4 text-center text-gray-500">
                No se encontraron resultados.
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <div className="text-gray-500 text-center mt-24">
        <h2>📦 Estados de Envío</h2>
        {estados.length === 0 ? (
          <p>No hay actualizaciones aún.</p>
        ) : (
          <ul>
            {estados.map((estado, index) => (
              <li key={index}>
                <strong>
                  {" "}
                  {index + 1} : {estado.nuevoEstado}
                </strong>
                :
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
