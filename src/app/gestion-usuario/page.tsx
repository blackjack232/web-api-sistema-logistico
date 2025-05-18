"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { obtenerUsuarios, registrarUsuario } from "@/api/usuario";
import { Usuario } from "@/domain/Usuario.interface";
import toast from "react-hot-toast";
import ModalRegistroUsuario from "../components/ModalRegistroUsuario";
import { UserFormData, userSchema } from "../schemas/usuarioSchema";
import { useAuth } from "@/auth/AuthContext";
import { useRouter } from "next/navigation";




export default function CrudUsuarios() {
  const [usuarios, setUsuarios] = useState<UserFormData[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [token, setToken] = useState("");
  const {
    reset,
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
  });

    const { isAuthenticated } = useAuth();
  const router = useRouter();
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
    try {
      const obtenerUsuarioCreacion = transformarAUsuario(data, "admin");
      const resultado = await registrarUsuario(obtenerUsuarioCreacion);
      console.log("res", resultado);
      if (resultado.esExitoso) {
        toast.success("Usuario insertado correctamente");
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
        toast.error("Error al guardar usuario");
      }
    } catch (error) {
      toast.error("El correo o identificación ya están en uso");
      console.error("Error al enviar el formulario:", error);
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

      fetchUsuarios();

  }, [token]);

  const fetchUsuarios = async () => {
    try {
      const response = await obtenerUsuarios(token);
      if (!response.esExitoso) throw new Error("Error al obtener usuarios");

      const rawData = await response.data;
      setUsuarios(rawData);
      toast.success("Usuarios cargados correctamente");
    } catch (error) {
      console.error("Error cargando usuarios:", error);
      toast.error("Error al obtener usuarios");
    }
  };
   useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/login");
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null;
  }

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

        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] text-left border">
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
      </div>

      {isOpen && (
        <ModalRegistroUsuario
          isOpen={isOpen}
          onClose={() => {
            reset();
            setEditIndex(null);
            setIsOpen(false);
          }}
          onSubmit={onSubmit}
          initialData={editIndex !== null ? usuarios[editIndex] : undefined}
        />
      )}
    </div>
  );
}
