import React from 'react'

// Definición de colores de marca:
const GOLD_COLOR = '#d4af37'

export default function FeaturesGrid() {
  return (
    // 1. Fondo de la sección: Usa 'dark-block'. En modo claro es negro/gris oscuro (invirtiendo tu intención original de blanco).
    // Si quieres que el fondo sea siempre el más claro (blanco/gris claro), usa 'light-block'. Ajustamos a 'light-block' para mantener el alto contraste inicial.
    <section className="relative light-block py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Título principal: El color se hereda de 'light-block' (negro en claro, blanco/gris en oscuro) */}
        <h3 className="mb-14 text-center text-4xl font-extrabold sm:text-5xl">
          Nuestros Valores
        </h3>
        
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {/* Componente Feature 1 */}
          <Feature
            icon={
              // Ícono: Color de trazo fijo de marca
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke={GOLD_COLOR} className="h-12 w-12">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" />
              </svg>
            }
            title="CALIDAD GARANTIZADA"
            desc="Seleccionamos y supervisamos cada lote para garantizar frescura y trazabilidad desde origen."
          />
          
          {/* Componente Feature 2 */}
          <Feature
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke={GOLD_COLOR} className="h-12 w-12">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18M4.5 19.5h15M8.25 3h7.5" />
              </svg>
            }
            title="PROCESOS LIMPIOS"
            desc="Cumplimos protocolos sanitarios y de seguridad alimentaria en cada etapa de producción."
          />
          
          {/* Componente Feature 3 */}
          <Feature
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke={GOLD_COLOR} className="h-12 w-12">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v18m9-9H3" />
              </svg>
            }
            title="LOGÍSTICA EFICIENTE"
            desc="Entregas puntuales y flexibles, con cadena de frío controlada para mantener el sabor."
          />
        </div>
      </div>

      {/* Franja de Promoción (Promo ribbon) */}
      <div className="relative mt-16">
        <div className="absolute inset-x-0 -bottom-8 z-10">
          {/* Fondo de la franja: Usa 'dark-block'. Esto invierte la paleta de colores. */}
          {/* Será oscuro con texto claro/dorado en modo claro, y claro con texto oscuro/dorado en modo oscuro. */}
          <div className="mx-auto max-w-none rotate-[-2deg] dark-block py-4 shadow-xl ring-2 ring-[${GOLD_COLOR}]/50">
            <div className="mx-auto flex max-w-7xl items-center overflow-hidden">
              {/* Texto: Color fijo de marca dorado */}
              <p className="animate-none whitespace-nowrap text-center text-lg font-extrabold uppercase tracking-[0.3em]" style={{ color: GOLD_COLOR }}>
                {Array.from({ length: 10 }).map((_, i) => (
                  <span key={i} className="mx-6 inline-block">
                    * ENVÍO A DOMICILIO DISPONIBLE *
                  </span>
                ))}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function Feature({ icon, title, desc }) {
  return (
    // 2. Diseño de la tarjeta: Usa 'medium-block'. Esto crea un contraste con el fondo 'light-block'.
    <div className="rounded-xl medium-block p-10 text-center shadow-xl ring-2 ring-black/10 dark:ring-white/10 transition duration-300 ease-in-out hover:ring-2 hover:ring-[${GOLD_COLOR}] transform hover:-translate-y-1">
      {/* Contenedor del ícono */}
      <div className="mb-4 flex justify-center">{icon}</div>
      {/* Título: El color se hereda de 'medium-block' (negro en claro, gris claro en oscuro) */}
      <h4 className="mb-3 text-xl font-bold uppercase">{title}</h4>
      {/* Descripción: Color de texto adaptable con una tonalidad más clara */}
      <p className="text-base text-gray-600 dark:text-gray-300">{desc}</p>
    </div>
  )
}