
import { z } from "zod";

export const envioSchema = z.object({
  nombre_remitente: z.string().min(1, "Nombre remitente requerido"),
  apellido_remitente: z.string().min(1, "Apellido remitente requerido"),
  cedula_remitente: z.string().min(5, "Cédula remitente inválida"),
  telefono_remitente: z.string().min(7, "Teléfono remitente inválido"),

  nombre_destinatario: z.string().min(1, "Nombre destinatario requerido"),
  apellido_destinatario: z.string().min(1, "Apellido destinatario requerido"),
  cedula_destinatario: z.string().min(5, "Cédula destinatario inválida"),
  telefono_destinatario: z.string().min(7, "Teléfono destinatario inválido"),

  direccion_envio: z.string().min(10, "Dirección de envío muy corta"),
  direccion_destino: z.string().min(10, "Dirección de destino muy corta"),

  peso: z.number({ invalid_type_error: "Peso debe ser número" }).min(0.1, "Peso mínimo 0.1 kg"),
  ancho: z.number({ invalid_type_error: "Ancho debe ser número" }).min(1, "Ancho mínimo 1 cm"),
  alto: z.number({ invalid_type_error: "Alto debe ser número" }).min(1, "Alto mínimo 1 cm"),

  tipo_producto: z.string().min(1, "Tipo de producto requerido"),
});
export type EnvioFormData = z.infer<typeof envioSchema>;
