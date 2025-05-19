import { Envio } from "@/domain/Envio.interface";
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
export const registrarEnvio = async (envio: Envio, token: string) => {
  const res = await fetch(`${API_BASE_URL}/envio`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(envio),
  });

  const data = await res.json();
  return { esExitoso: res.ok, data };
};
export const buscarEnvioPorGuia = async (guia: string, token: string) => {
  const res = await fetch(`${API_BASE_URL}/envio/rastrear-envio?numero_guia=${encodeURIComponent(guia)}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();
  return { esExitoso: res.ok, data };
};