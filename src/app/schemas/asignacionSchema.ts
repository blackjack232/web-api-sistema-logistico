import { z } from "zod";

export const asignacionSchema = z.object({
  envio_id: z.number({ required_error: "El envío es obligatorio" }),
  ruta_id: z.number({ required_error: "La ruta es obligatoria" }),
  transportista_id: z.number({ required_error: "El transportista es obligatorio" }),
});

export type AsignacionFormData = z.infer<typeof asignacionSchema>;