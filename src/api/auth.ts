import { LoginRequest } from "@/domain/LoginRequest.interface";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const login = async (data: LoginRequest) => {
  const response = await fetch(`${API_BASE_URL}/usuario/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Error al iniciar sesión");
  }

  return await response.json();
};


