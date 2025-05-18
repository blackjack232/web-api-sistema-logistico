import { Envio } from "@/domain/Envio.interface";

export const registrarEnvio = async (envio: Envio, token: string) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/envio`, {
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
