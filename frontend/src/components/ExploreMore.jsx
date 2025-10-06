import React from 'react'

const GOLD_COLOR = '#fceebeff' // Color de marca dorado

export default function ExploreMore() {
  return (
    // 1. Fondo de la Sección: Usa 'light-block' para el fondo adaptable (gris claro/oscuro)
    <section className="light-block py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center">
          <a
            href="/explorar"
            // 2. Estilo del Botón: Usamos el color de marca fijo (GOLD_COLOR) para el estado inicial
            // Esto sobrescribe el color de fondo de 'accent-block' para mantener el dorado específico.
            // Las propiedades de texto y sombra sí usan clases Tailwind/CSS.
            className={`inline-flex items-center gap-2 rounded-2xl px-8 py-4 text-base font-bold uppercase tracking-widest text-black shadow-2xl transition duration-300 ease-in-out
                        hover:bg-black hover:text-[${GOLD_COLOR}] focus-visible:outline-2 focus-visible:outline-[${GOLD_COLOR}]/70 focus-visible:outline-offset-2 border-2 border-transparent hover:border-[${GOLD_COLOR}]
                        transform hover:scale-105`}
            style={{ backgroundColor: GOLD_COLOR }}
          >
            Explorar más
            {/* El ícono */}
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
              <path fillRule="evenodd" d="M3 10a.75.75 0 0 1 .75-.75h9.638L10.22 6.28a.75.75 0 1 1 1.06-1.06l4.5 4.5a.75.75 0 0 1 0 1.06l-4.5 4.5a.75.75 0 1 1-1.06-1.06l3.168-3.168H3.75A.75.75 0 0 1 3 10Z" clipRule="evenodd" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  )
}