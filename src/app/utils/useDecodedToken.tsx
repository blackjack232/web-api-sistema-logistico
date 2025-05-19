'use client'

import { useEffect, useState } from 'react'

interface DecodedToken {
  id?: number
  id_rol?: number
  nombre_rol?: string
  nombre_usuario?: string
  apellido_usuario?: string
  correo?: string
  usuario_modificacion_id?: string
  exp?: number
  iat?: number
  [key: string]: any
}

export const useDecodedToken = (): DecodedToken | null => {
  const [decodedToken, setDecodedToken] = useState<DecodedToken | null>(null)

  useEffect(() => {
    const token = localStorage.getItem('authToken')
    if (!token) return

    try {
      const payloadBase64 = token.split('.')[1]
      const decodedPayload = JSON.parse(atob(payloadBase64))
      setDecodedToken(decodedPayload)
    } catch (error) {
      console.error('Error al decodificar el token:', error)
      setDecodedToken(null)
    }
  }, [])

  return decodedToken
}
