import { Usuario } from "@/domain/Usuario.interface";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const obtenerUsuarios = async (token: string) => {
  const response = await fetch(`${API_BASE_URL}/usuario`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) throw new Error("Error al obtener usuarios");
  return await response.json();
};

export const registrarUsuario = async (data: Usuario, token: string) => {
  const response = await fetch(`${API_BASE_URL}/usuario/registro`, {
    method: "POST",
    headers: {
      // Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    const errorMsg = errorData?.mensaje ?? "Error al registrar usuario";
    throw new Error(errorMsg);
  }

  return await response.json();
};