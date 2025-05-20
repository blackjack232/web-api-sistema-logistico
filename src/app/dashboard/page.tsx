"use client";

import { useEffect, useState } from "react";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useAuth } from "@/auth/AuthContext";
import { useRouter } from "next/navigation";


ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
);

interface FiltroEnvio {
  fechaInicio: Date | null;
  fechaFin: Date | null;
  estado: string;
  transportista: string;
}

interface EnvioReporte {
  id: number;
  numero_guia: string;
  estado: string;
  transportista: string;
  tiempoEntregaHoras: number;
  fechaEntrega: string;
}

export default function Dashboard() {
  const [filtros, setFiltros] = useState<FiltroEnvio>({
    fechaInicio: null,
    fechaFin: null,
    estado: "",
    transportista: "",
  });
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [envios, setEnvios] = useState<EnvioReporte[]>([]);
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState("");

  const obtenerDatos = async () => {
    setLoading(true);

    setTimeout(() => {
      const mockEnvios: EnvioReporte[] = [
        {
          id: 1,
          numero_guia: "G123456",
          estado: "Entregado",
          transportista: "Transportadora A",
          tiempoEntregaHoras: 48,
          fechaEntrega: "2024-05-10",
        },
        {
          id: 2,
          numero_guia: "G654321",
          estado: "En tránsito",
          transportista: "Transportadora B",
          tiempoEntregaHoras: 0,
          fechaEntrega: "",
        },
      ];
      setEnvios(mockEnvios);
      setLoading(false);
    }, 1000);
  };

  useEffect(() => {
    obtenerDatos();
  }, []);

  const estadosUnicos = [...new Set(envios.map((e) => e.estado))];
  const transportistasUnicos = [...new Set(envios.map((e) => e.transportista))];

  const chartData = {
    labels: transportistasUnicos,
    datasets: [
      {
        label: "Tiempo promedio de entrega (h)",
        data: transportistasUnicos.map((t) =>
          Math.round(
            envios
              .filter((e) => e.transportista === t && e.estado === "Entregado")
              .reduce((acc, cur) => acc + cur.tiempoEntregaHoras, 0) /
              envios.filter(
                (e) => e.transportista === t && e.estado === "Entregado"
              ).length || 0
          )
        ),
        backgroundColor: "rgba(59, 130, 246, 0.7)",
      },
    ],
  };

  const pieData = {
    labels: estadosUnicos,
    datasets: [
      {
        label: "# de Envíos",
        data: estadosUnicos.map(
          (est) => envios.filter((e) => e.estado === est).length
        ),
        backgroundColor: ["#22c55e", "#facc15", "#ef4444", "#3b82f6"],
      },
    ],
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

  return (
    <div className="p-6 min-h-screen bg-gray-100 mt-24">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">
        Dashboard de Envíos
      </h1>

      {/* Filtros */}
      <div className="grid grid-cols-4 gap-4 bg-white p-4 rounded-xl shadow mb-6">
        <div className="flex flex-col">
          <label className="text-gray-600">Desde:</label>
          <DatePicker
            selected={filtros.fechaInicio}
            onChange={(date) =>
              setFiltros((prev) => ({ ...prev, fechaInicio: date }))
            }
            className="w-full p-2 border rounded text-[#686868]"
          />
        </div>
        <div className="flex flex-col">
          <label className="text-gray-600">Hasta:</label>
          <DatePicker
            selected={filtros.fechaFin}
            onChange={(date) =>
              setFiltros((prev) => ({ ...prev, fechaFin: date }))
            }
            className="w-full p-2 border rounded text-[#686868]"
          />
        </div>
        <div>
          <label className="text-gray-600">Estado:</label>
          <select
            className="w-full p-2 border rounded text-[#686868]"
            value={filtros.estado}
            onChange={(e) => setFiltros({ ...filtros, estado: e.target.value })}
          >
            <option value="">Todos</option>
            {estadosUnicos.map((estado) => (
              <option key={estado} value={estado}>
                {estado}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-gray-600">Transportista:</label>
          <select
            className="w-full p-2 border rounded text-[#686868]"
            value={filtros.transportista}
            onChange={(e) =>
              setFiltros({ ...filtros, transportista: e.target.value })
            }
          >
            <option value="">Todos</option>
            {transportistasUnicos.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Tabla de envíos */}
      <div className="overflow-x-auto bg-white p-4 rounded-xl shadow mb-6">
        <table className="min-w-full text-sm text-left text-gray-700">
          <thead className="bg-gray-200 text-gray-600 uppercase">
            <tr>
              <th className="p-2">Guía</th>
              <th className="p-2">Estado</th>
              <th className="p-2">Transportista</th>
              <th className="p-2">Tiempo entrega (h)</th>
              <th className="p-2">Fecha Entrega</th>
            </tr>
          </thead>
          <tbody>
            {envios
              .filter(
                (e) =>
                  (!filtros.estado || e.estado === filtros.estado) &&
                  (!filtros.transportista ||
                    e.transportista === filtros.transportista)
              )
              .map((envio) => (
                <tr key={envio.id} className="border-b">
                  <td className="p-2">{envio.numero_guia}</td>
                  <td className="p-2">{envio.estado}</td>
                  <td className="p-2">{envio.transportista}</td>
                  <td className="p-2">{envio.tiempoEntregaHoras}</td>
                  <td className="p-2">{envio.fechaEntrega || "-"}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-xl shadow">
          <h2 className="text-lg font-semibold mb-2">
            Tiempo promedio por transportista
          </h2>
          <Bar data={chartData} />
        </div>
        <div className="bg-white p-4 rounded-xl shadow">
          <h2 className="text-lg font-semibold mb-2">
            Distribución por estado
          </h2>
          <Pie data={pieData} />
        </div>
      </div>
    </div>
  );
}
