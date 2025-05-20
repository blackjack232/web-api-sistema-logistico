
import { AsignacionRuta } from "@/domain/AsignacionRuta.interface";
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
export async function registrarAsignacion(asignacion: AsignacionRuta, token: string) {
  try {
      const res = await fetch(`${API_BASE_URL}/envio/asignar-ruta`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(asignacion),
    });

    const data = await res.json();
    return { esExitoso: res.ok, data };
  } catch (error) {
    console.error(error);
    return { esExitoso: false, data: null };
  }
}