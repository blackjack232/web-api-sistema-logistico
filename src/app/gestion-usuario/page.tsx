"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { obtenerUsuarios, registrarUsuario } from "@/api/auth";
import { Usuario } from "@/domain/Usuario.interface";

const userSchema = z.object({
  nombre: z.string().min(1, "El nombre es obligatorio"),
  apellido: z.string().min(1, "El apellido es obligatorio"),
  identificacion: z.string().min(1, "La identificación es obligatoria"),
  correo_electronico: z.string().email("Correo inválido"),
  contrasena: z
    .string()
    .min(6, "La contraseña debe tener al menos 6 caracteres"),
  tipo_usuario_id: z.enum(["1", "2", "3"]),
  activo: z.enum(["0", "1"]),
  telefono: z.string().min(7, "El teléfono es obligatorio"),
});

type UserFormData = z.infer<typeof userSchema>;

export default function CrudUsuarios() {
  const [usuarios, setUsuarios] = useState<UserFormData[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [token, setToken] = useState("");
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
  });
  const transformarAUsuario = (
    data: UserFormData,
    usuarioCreacion: string
  ): Usuario => {
    const fechaActual = new Date();

    return {
      nombre: data.nombre,
      apellido: data.apellido,
      identificacion: data.identificacion,
      correo_electronico: data.correo_electronico,
      contrasena: data.contrasena,
      tipo_usuario_id: Number(data.tipo_usuario_id),
      activo: Number(data.activo),
      telefono: data.telefono,
      fecha_creacion: fechaActual,
      usuario_creacion: usuarioCreacion,
      fecha_modificacion: fechaActual,
      usuario_modificacion: usuarioCreacion,
    };
  };

  const onSubmit = async (data: UserFormData) => {
    const obtenerUsuarioCreacion = transformarAUsuario(data, "admin");
    const resultado = await registrarUsuario(obtenerUsuarioCreacion, token);
    if (resultado.esExitoso) {
      alert("Usuario insertado correctamente");

      if (editIndex !== null) {
        const updatedUsuarios = [...usuarios];
        updatedUsuarios[editIndex] = data;
        setUsuarios(updatedUsuarios);
      } else {
        setUsuarios([...usuarios, data]);
      }

      reset();
      setIsOpen(false);
      setEditIndex(null);
    } else {
      alert("Error al guardar usuario");
    }
  };

  const handleEdit = (index: number) => {
    const user = usuarios[index];
    reset(user);
    setEditIndex(index);
    setIsOpen(true);
  };

  const handleDelete = (index: number) => {
    const updated = usuarios.filter((_, i) => i !== index);
    setUsuarios(updated);
  };

  useEffect(() => {
    const storedToken = localStorage.getItem("authToken");
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);
  useEffect(() => {
    if (token) {
      fetchUsuarios();
    }
  }, [token]);

  const fetchUsuarios = async () => {
    try {
      const response = await obtenerUsuarios(token);
      console.log("Usuarios:", response);

      if (!response.esExitoso) throw new Error("Error al obtener usuarios");

      const rawData = await response.data;
      setUsuarios(rawData);
    } catch (error) {
      console.error("Error cargando usuarios:", error);
    }
  };

  return (
    <div className="mt-24 min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-2xl shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-orange-700">
            Gestión de Usuarios
          </h2>
          <button
            onClick={() => {
              reset();
              setEditIndex(null);
              setIsOpen(true);
            }}
            className="bg-orange-700 text-white px-4 py-2 rounded-md hover:bg-orange-800"
          >
            Agregar Usuario
          </button>
        </div>

        <table className="w-full text-left border ">
          <thead className="bg-gray-200 text-gray-700">
            <tr>
              <th className="p-2">Nombre</th>
              <th className="p-2">Apellido</th>
              <th className="p-2">Correo</th>
              <th className="p-2">Teléfono</th>
              <th className="p-2">Tipo</th>
              <th className="p-2">Activo</th>
              <th className="p-2">Acciones</th>
            </tr>
          </thead>
          <tbody className="text-[#686868]">
            {usuarios.map((usuario, index) => (
              <tr key={index} className="border-t">
                <td className="p-2">{usuario.nombre}</td>
                <td className="p-2">{usuario.apellido}</td>
                <td className="p-2">{usuario.correo_electronico}</td>
                <td className="p-2">{usuario.telefono}</td>
                <td className="p-2">{usuario.tipo_usuario_id}</td>
                <td className="p-2">{usuario.activo}</td>
                <td className="p-2 flex gap-2">
                  <button
                    onClick={() => handleEdit(index)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <Pencil size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4 text-orange-700">
              {editIndex !== null ? "Editar Usuario" : "Agregar Usuario"}
            </h3>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
              <label htmlFor="nombre" className="block mb-1 text-gray-700">
                Nombre
              </label>
              <input
                {...register("nombre")}
                placeholder="Nombre"
                className="w-full border p-2 rounded-md text-[#686868]"
              />
              {errors.nombre && (
                <p className="text-red-500 text-sm">{errors.nombre.message}</p>
              )}
              <label htmlFor="apellido" className="block mb-1 text-gray-700">
                Apellido
              </label>
              <input
                {...register("apellido")}
                placeholder="Apellido"
                className="w-full border p-2 rounded-md text-[#686868]"
              />
              {errors.apellido && (
                <p className="text-red-500 text-sm">
                  {errors.apellido.message}
                </p>
              )}
              <label
                htmlFor="identificacion"
                className="block mb-1 text-gray-700"
              >
                Identificacion
              </label>
              <input
                {...register("identificacion")}
                placeholder="Identificación"
                className="w-full border p-2 rounded-md text-[#686868]"
              />
              {errors.identificacion && (
                <p className="text-red-500 text-sm">
                  {errors.identificacion.message}
                </p>
              )}
              <label htmlFor="email" className="block mb-1 text-gray-700">
                Email
              </label>
              <input
                type="email"
                {...register("correo_electronico")}
                placeholder="Correo Electrónico"
                className="w-full border p-2 rounded-md text-[#686868]"
              />
              {errors.correo_electronico && (
                <p className="text-red-500 text-sm">
                  {errors.correo_electronico.message}
                </p>
              )}
              <label htmlFor="password" className="block mb-1 text-gray-700">
                Contraseña
              </label>
              <input
                type="password"
                {...register("contrasena")}
                placeholder="Contraseña"
                className="w-full border p-2 rounded-md text-[#686868]"
              />
              {errors.contrasena && (
                <p className="text-red-500 text-sm">
                  {errors.contrasena.message}
                </p>
              )}
              <label htmlFor="telefono" className="block mb-1 text-gray-700">
                Telefono
              </label>
              <input
                {...register("telefono")}
                placeholder="Teléfono"
                className="w-full border p-2 rounded-md text-[#686868]"
              />
              {errors.telefono && (
                <p className="text-red-500 text-sm">
                  {errors.telefono.message}
                </p>
              )}
              <label
                htmlFor="Tipo tipo_usuario_id"
                className="block mb-1 text-gray-700"
              >
                Tipo usuario
              </label>
              <select
                {...register("tipo_usuario_id")}
                className="w-full border p-2 rounded-md text-[#686868]"
              >
                <option value="">Seleccione tipo de usuario</option>
                <option value="1">Administrador</option>
                <option value="2">Cliente</option>
                <option value="3">Conductor</option>
              </select>
              {errors.tipo_usuario_id && (
                <p className="text-red-500 text-sm">
                  {errors.tipo_usuario_id.message}
                </p>
              )}
              <label htmlFor="estado" className="block mb-1 text-gray-700">
                Estado
              </label>
              <select
                {...register("activo")}
                className="w-full border p-2 rounded-md text-[#686868]"
              >
                <option value="">¿Activo?</option>
                <option value="1">Sí</option>
                <option value="0">No</option>
              </select>
              {errors.activo && (
                <p className="text-red-500 text-sm">{errors.activo.message}</p>
              )}

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    reset();
                    setIsOpen(false);
                    setEditIndex(null);
                  }}
                  className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-orange-700 text-white rounded-md hover:bg-orange-800"
                >
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
