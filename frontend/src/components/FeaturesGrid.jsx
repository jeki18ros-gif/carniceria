import React from 'react'

export default function FeaturesGrid() {
  const doradoVar = "var(--color-dorado)";

  return (
    <section id="nosotros" className="light-block py-20">
    <section className="relative light-block py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h3 className="mb-14 text-center text-4xl font-extrabold sm:text-5xl">
          Nuestros Valores
        </h3>      
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          <Feature
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke={doradoVar} className="h-12 w-12">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" />
              </svg>
            }
            title="CALIDAD GARANTIZADA"
            desc="Seleccionamos y supervisamos cada lote para garantizar frescura y trazabilidad desde origen."
          />
          <Feature
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke={doradoVar} className="h-12 w-12">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18M4.5 19.5h15M8.25 3h7.5" />
              </svg>
            }
            title="PROCESOS LIMPIOS"
            desc="Cumplimos protocolos sanitarios y de seguridad alimentaria en cada etapa de producción."
          />
          <Feature
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke={doradoVar} className="h-12 w-12">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v18m9-9H3" />
              </svg>
            }
            title="LOGÍSTICA EFICIENTE"
            desc="Entregas puntuales y flexibles, con cadena de frío controlada para mantener el sabor."
          />
        </div>
      </div>
      <div className="relative mt-16">
        <div className="absolute inset-x-0 -bottom-8 z-10">
          <div className={`mx-auto max-w-none rotate-[-2deg] dark-block py-4 shadow-xl ring-2 ring-[${doradoVar}]/50`}>
            <div className="mx-auto flex max-w-7xl items-center overflow-hidden">
              <p className="animate-none whitespace-nowrap text-center text-lg font-extrabold uppercase tracking-[0.3em] text-dorado">
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
    </section>
  )
}

function Feature({ icon, title, desc }) {
  const doradoVar = "var(--color-dorado)";

  return (
    <div className={`rounded-xl medium-block p-10 text-center shadow-xl ring-2 ring-black/10 dark:ring-white/10 transition duration-300 ease-in-out hover:ring-2 hover:ring-[${doradoVar}] transform hover:-translate-y-1`}>
      <div className="mb-4 flex justify-center">{icon}</div>
      <h4 className="mb-3 text-xl font-bold uppercase">{title}</h4>
      <p className="text-base text-gray-600 dark:text-gray-300">{desc}</p>
    </div>
  )
}