'use client'

import { useState } from 'react'

export default function ContactoPage() {
  const [form, setForm] = useState({ nombre: '', correo: '', mensaje: '' })
  const [enviado, setEnviado] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Aquí podrías enviar el formulario a una API (ej. via fetch)
    console.log('Formulario enviado:', form)
    setEnviado(true)
    setForm({ nombre: '', correo: '', mensaje: '' })
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-20 mt-20 ">
      <h1 className="text-3xl font-bold mb-6 text-center text-orange-700">Contáctanos</h1>

      {enviado && (
        <div className="mb-4 text-green-600 font-semibold text-center">
          ¡Tu mensaje ha sido enviado correctamente!
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 bg-white shadow-md rounded-xl p-6">
        <div>
          <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">
            Nombre
          </label>
          <input
            type="text"
            name="nombre"
            id="nombre"
            value={form.nombre}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 focus:border-orange-500 focus:ring-orange-500"
          />
        </div>

        <div>
          <label htmlFor="correo" className="block text-sm font-medium text-gray-700">
            Correo electrónico
          </label>
          <input
            type="email"
            name="correo"
            id="correo"
            value={form.correo}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 focus:border-orange-500 focus:ring-orange-500"
          />
        </div>

        <div>
          <label htmlFor="mensaje" className="block text-sm font-medium text-gray-700">
            Mensaje
          </label>
          <textarea
            name="mensaje"
            id="mensaje"
            rows={4}
            value={form.mensaje}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 focus:border-orange-500 focus:ring-orange-500"
          ></textarea>
        </div>

        <div className="text-center">
          <button
            type="submit"
            className="bg-orange-700 hover:bg-orange-800 text-white font-bold py-2 px-6 rounded-md shadow-md"
          >
            Enviar mensaje
          </button>
        </div>
      </form>
    </div>
  )
}
