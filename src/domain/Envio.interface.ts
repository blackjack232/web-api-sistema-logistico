export interface Envio {
  id?: number;
  nombre_remitente: string;
  nombre_destinatario: string;
  apellido_remitente: string;
  apellido_destinatario: string;
  cedula_remitente: string;
  cedula_destinatario: string;
  telefono_remitente :string;
  telefono_destinatario: string;
  direccion_envio: string;
  direccion_destino: string;
  peso: number;
  ancho?: number;
  alto?: number;
  tipo_producto?: string;
  estado?: string; 
  fecha_creacion?: Date;
  fecha_modificacion?: Date;
  usuario_creacion_id: number;
  usuario_modificacion_id?: number;
}