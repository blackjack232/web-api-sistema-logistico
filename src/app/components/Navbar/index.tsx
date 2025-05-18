// 'use client'

// import { useAuth } from '@/auth/AuthContext'
// import { Disclosure } from '@headlessui/react'
// import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
// import Link from 'next/link'


// const navigation = [
//   { name: 'Login', href: '/login', public: true },
//   { name: 'Rastreo', href: '/rastreo', public: false },
//   { name: 'Crear guía', href: '/crear-guia', public: false },
//   { name: 'Contacto', href: '/contacto', public: true },
// ]

// function classNames(...classes: string[]) {
//   return classes.filter(Boolean).join(' ')
// }

// export default function Navbar() {
//   const { isAuthenticated , logout} = useAuth()

//   const filteredNavigation = navigation.filter(
//     (item) => item.public || isAuthenticated
//   )

//   return (
//     <Disclosure as="nav" className="fixed top-0 w-full z-50 bg-[#e1e8ed] text-[#686868] shadow-md mt-8">
//       {({ open }) => (
//         <>
//           <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
//             <div className="flex h-16 justify-between items-center">
//               <div className="flex items-center">
//                 <Link href="/" className="flex items-center space-x-2">
//                   <img
//                     className="h-64 w-64"
//                     src="https://coordinadora.com/wp-content/uploads/2023/03/logo-coordinadora.svg"
//                     alt="Logo"
//                   />
//                 </Link>
//               </div>
//               <div className="hidden sm:flex sm:space-x-4">
//                 {filteredNavigation.map((item) => (
//                   <Link
//                     key={item.name}
//                     href={item.href}
//                     className={classNames(
//                       'hover:bg-orange-500 hover:text-white',
//                       'px-3 py-2 rounded-md text-sm font-medium'
//                     )}
//                   >
//                     {item.name}
//                   </Link>
//                 ))}
//               </div>
//               <div className="sm:hidden flex items-center">
//                 <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 hover:bg-orange-500 focus:outline-none focus:ring-2 focus:ring-white">
//                   <span className="sr-only">Open main menu</span>
//                   {open ? (
//                     <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
//                   ) : (
//                     <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
//                   )}
//                 </Disclosure.Button>
//               </div>
//             </div>
//           </div>

//           <Disclosure.Panel className="sm:hidden">
//             <div className="space-y-1 px-2 pt-2 pb-3">
//               {filteredNavigation.map((item) => (
//                 <Disclosure.Button
//                   key={item.name}
//                   as={Link}
//                   href={item.href}
//                   className={classNames(
//                     'hover:bg-orange-500 hover:text-white',
//                     'block px-3 py-2 rounded-md text-base font-medium'
//                   )}
//                 >
//                   {item.name}
//                 </Disclosure.Button>
//               ))}
//             </div>
//           </Disclosure.Panel>
//         </>
//       )}
//     </Disclosure>
//   )
// }
'use client'

import { useAuth } from '@/auth/AuthContext'
import { Disclosure } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'

const navigation = [
  { name: 'Login', href: '/login', public: true, onlyWhenLoggedOut: true },
  { name: 'Gestion usuario', href: '/gestion-usuario', public: false },
  { name: 'Crear guía', href: '/crear-guia', public: false },
  { name: 'Contacto', href: '/contacto', public: true },
]

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

export default function Navbar() {
  const { isAuthenticated, logout } = useAuth()

  const filteredNavigation = navigation.filter((item) => {
    if (item.onlyWhenLoggedOut && isAuthenticated) return false
    return item.public || isAuthenticated
  })

  return (
    <Disclosure
      as="nav"
      className="fixed top-0 w-full z-50 bg-[#e1e8ed] text-[#686868] shadow-md mt-8"
    >
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 justify-between items-center">
              <div className="flex items-center">
                <Link href="/" className="flex items-center space-x-2">
                  <img
                    className="h-64 w-64"
                    src="https://coordinadora.com/wp-content/uploads/2023/03/logo-coordinadora.svg"
                    alt="Logo"
                  />
                </Link>
              </div>
              <div className="hidden sm:flex sm:space-x-4">
                {filteredNavigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={classNames(
                      'hover:bg-orange-500 hover:text-white',
                      'px-3 py-2 rounded-md text-sm font-medium'
                    )}
                  >
                    {item.name}
                  </Link>
                ))}
                {isAuthenticated && (
                  <button
                    onClick={logout}
                    className="hover:bg-orange-800 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Cerrar sesión
                  </button>
                )}
              </div>
              <div className="sm:hidden flex items-center">
                <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 hover:bg-orange-500 focus:outline-none focus:ring-2 focus:ring-white">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
            </div>
          </div>

          <Disclosure.Panel className="sm:hidden">
            <div className="space-y-1 px-2 pt-2 pb-3">
              {filteredNavigation.map((item) => (
                <Disclosure.Button
                  key={item.name}
                  as={Link}
                  href={item.href}
                  className={classNames(
                    'hover:bg-orange-500 hover:text-white',
                    'block px-3 py-2 rounded-md text-base font-medium'
                  )}
                >
                  {item.name}
                </Disclosure.Button>
              ))}
              {isAuthenticated && (
                <Disclosure.Button
                  as="button"
                  onClick={logout}
                  className="w-full text-left hover:bg-red-600 hover:text-white px-3 py-2 rounded-md text-base font-medium"
                >
                  Cerrar sesión
                </Disclosure.Button>
              )}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  )
}
