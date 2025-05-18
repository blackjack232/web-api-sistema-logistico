
"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserFormData, userSchema } from "../../schemas/usuarioSchema";


interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: UserFormData) => void;
  initialData?: UserFormData;
}

export default function ModalRegistroUsuario({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}: Props) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: initialData || {},
  });

  return isOpen ? (
    <div
      className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-50"
      onClick={() => {
        reset();
        onClose();
      }}
    >
      <div
        className="bg-white p-6 rounded-xl w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-semibold mb-4 text-orange-700">
          {initialData ? "Editar Usuario" : "Agregar Usuario"}
        </h3>
        <form
          onSubmit={handleSubmit((data) => {
            onSubmit(data);
            reset();
          })}
          className="space-y-3"
        >
          <div className="grid grid-cols-2 gap-4">
            {/* Nombre */}
            <div>
              <label className="block mb-1 text-gray-700">Nombre</label>
              <input
                {...register("nombre")}
                placeholder="Nombre"
                className="w-full border p-2 rounded-md text-[#686868]"
              />
              {errors.nombre && (
                <p className="text-red-500 text-sm">
                  {errors.nombre.message}
                </p>
              )}
            </div>

            {/* Teléfono */}
            <div>
              <label className="block mb-1 text-gray-700">Teléfono</label>
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
            </div>

            {/* Apellido */}
            <div>
              <label className="block mb-1 text-gray-700">Apellido</label>
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
            </div>

            {/* Identificación */}
            <div>
              <label className="block mb-1 text-gray-700">Identificación</label>
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
            </div>

            {/* Correo electrónico */}
            <div>
              <label className="block mb-1 text-gray-700">Email</label>
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
            </div>

            {/* Contraseña */}
            <div>
              <label className="block mb-1 text-gray-700">Contraseña</label>
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
            </div>

            {/* Tipo de usuario */}
            <div>
              <label className="block mb-1 text-gray-700">Tipo usuario</label>
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
            </div>

            {/* Estado */}
            <div>
              <label className="block mb-1 text-gray-700">Estado</label>
              <select
                {...register("activo")}
                className="w-full border p-2 rounded-md text-[#686868]"
              >
                <option value="">¿Activo?</option>
                <option value="1">Sí</option>
                <option value="0">No</option>
              </select>
              {errors.activo && (
                <p className="text-red-500 text-sm">
                  {errors.activo.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              onClick={() => {
                reset();
                onClose();
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
  ) : null;
}
