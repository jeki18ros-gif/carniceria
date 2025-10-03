import React from 'react'

export default function FeaturesGrid() {
  return (
    <section className="relative bg-[#F7F7F7] py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h3 className="mb-10 text-center text-3xl font-extrabold text-[#2b1a15] sm:text-4xl">Nosotros</h3>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <Feature
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#E53935" className="h-12 w-12">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" />
              </svg>
            }
            title="CALIDAD GARANTIZADA"
            desc="Seleccionamos y supervisamos cada lote para garantizar frescura y trazabilidad desde origen."
          />
          <Feature
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#E53935" className="h-12 w-12">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18M4.5 19.5h15M8.25 3h7.5" />
              </svg>
            }
            title="PROCESOS LIMPIOS"
            desc="Cumplimos protocolos sanitarios y de seguridad alimentaria en cada etapa de producción."
          />
          <Feature
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#E53935" className="h-12 w-12">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v18m9-9H3" />
              </svg>
            }
            title="LOGÍSTICA EFICIENTE"
            desc="Entregas puntuales y flexibles, con cadena de frío controlada para mantener el sabor."
          />
        </div>
      </div>

      {/* Bottom promo ribbon */}
      <div className="relative mt-10">
        <div className="absolute inset-x-0 -bottom-6 z-10">
          <div className="mx-auto max-w-none rotate-[-2deg] bg-[#E53935] py-3 shadow-xl ring-1 ring-black/10">
            <div className="mx-auto flex max-w-7xl items-center overflow-hidden">
              <p className="animate-none whitespace-nowrap text-center text-sm font-extrabold uppercase tracking-[0.25em] text-white">
                {Array.from({ length: 12 }).map((_, i) => (
                  <span key={i} className="mx-4 inline-block">
                    * AVAILABLE FOR HOME DELIVERY *
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
    <div className="rounded-3xl bg-white p-8 text-center shadow-lg ring-1 ring-black/5">
      <div className="mb-4 flex justify-center">{icon}</div>
      <h4 className="mb-2 text-lg font-extrabold text-[#3a221c]">{title}</h4>
      <p className="text-sm text-[#555555]">{desc}</p>
    </div>
  )
}
