
import { z } from "zod";

export const userSchema = z.object({
  nombre: z.string().min(1, "El nombre es obligatorio"),
  apellido: z.string().min(1, "El apellido es obligatorio"),
  identificacion: z.string().min(1, "La identificación es obligatoria"),
  correo_electronico: z.string().email("Correo inválido"),
  contrasena: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
  tipo_usuario_id: z.enum(["1", "2", "3"]),
  activo: z.enum(["0", "1"]),
  telefono: z.string().min(7, "El teléfono es obligatorio"),
});

export type UserFormData = z.infer<typeof userSchema>;
