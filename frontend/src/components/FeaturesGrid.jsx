import React from 'react'
import { motion } from 'framer-motion'

// Definición de colores de marca:
const GOLD_COLOR = '#F0B100'

export default function FeaturesGrid() {
  return (
    <motion.section
      id="nosotros"
      className="py-20 bg-[#FFF5F0] modo-oscuro transition-colors duration-700"
      initial={{ y: 40, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut', type: 'tween' }}
      viewport={{ once: true, amount: 0.2 }}
    >
    <section className="relative bg-[#FFF5F0] py-20 modo-oscuro transition-colors duration-700">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
        <h3 className="ext-3xl sm:text-6xl font-extrabold mb-12 uppercase tracking-wide">
          Nuestros Valores
        </h3>
        
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3 ">
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

      {/* Cinta inferior de promoción: ancho completo con carrusel infinito */}
      <div className="relative">
        <div className="absolute inset-x-0 mt-20 z-10">
          <div className="w-full rotate-[-2deg] py-7 shadow-xl" style={{ backgroundColor: GOLD_COLOR }}>
            <div className="flex w-full overflow-hidden text-black">
              <div className="flex min-w-full shrink-0 items-center gap-12 whitespace-nowrap animate-[scrollX_60s_linear_infinite] text-2xl sm:text-3xl font-extrabold uppercase tracking-[0.25em]">
                {Array.from({ length: 16 }).map((_, i) => (
                  <span key={`a-${i}`}>* ENTREGA A DOMICILIO DISPONIBLE *</span>
                ))}
              </div>
              <div className="flex min-w-full shrink-0 items-center gap-12 whitespace-nowrap animate-[scrollX_60s_linear_infinite] text-2xl sm:text-3xl font-extrabold uppercase tracking-[0.25em]" aria-hidden="true">
                {Array.from({ length: 16 }).map((_, i) => (
                  <span key={`b-${i}`}>* ENTREGA A DOMICILIO DISPONIBLE *</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      </section>
    </motion.section>
  )
}

function Feature({ icon, title, desc }) {
  return (
    <div className="rounded-xl p-10 text-center shadow-xl ring-3 ring-black/2 transition duration-500 ease-in-out hover:ring-yellow-400 transform hover:-translate-y-1">
      {/* Contenedor del ícono */}
      <div className="mb-4 flex justify-center">{icon}</div>
      <h4 className="mb-3 text-xl font-bold uppercase">{title}</h4>
      <p className="text-base text-dark">{desc}</p>
    </div>
  )
}