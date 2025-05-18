export default function HomePage() {
  return (
    <main className="mt-20 flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4 text-center">
      <img
        src="https://media.istockphoto.com/id/1340887718/es/foto/fuera-de-log%C3%ADstica-distribuciones-almac%C3%A9n-con-gerente-de-inventario-usando-tablet-computer.jpg?s=2048x2048&w=is&k=20&c=F5FPZttmM7Ufnv0do2Q7xWMjxh8okYLDKAvluGVuZJY=" 
        alt="Coordinadora"
        className="w-full max-w-4xl rounded-2xl shadow-xl mb-8"/>
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Bienvenido al sistema logístico</h1>
      <p className="text-gray-600 text-lg max-w-xl">
        Gestiona envíos, asigna rutas y haz seguimiento en tiempo real de tus entregas.
      </p>
    </main>
  )
}
