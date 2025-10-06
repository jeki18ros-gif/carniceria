import React from 'react'
import leftImg from '../assets/otros2.jpg'
import rightImg from '../assets/relleno8.jpg'

const GOLD_COLOR = '#D4AF37'; // Color de marca: Dorado

export default function AfterHero() {
  return (
    // 1. Fondo general: Usa la clase 'dark-block' para que se adapte
    // En modo claro será gris oscuro/negro (bg-gray-900), y en modo oscuro será blanco (bg-gray-100)
    // Esto invierte la intención original (siempre negro), pero sigue la convención de tu CSS.
    <section className="relative dark-block">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Central band: Usa la clase 'light-block' para que sea el contenedor opuesto al fondo. */}
        {/* En modo claro será blanco (bg-gray-100), y en modo oscuro será gris oscuro (bg-gray-800) */}
        <div className="relative isolate mx-auto flex items-center justify-center rounded-3xl light-block px-6 py-16 shadow-2xl ring-2 ring-black/10 dark:ring-white/10 sm:px-10">
          
          {/* Left decorative image (flower-like) */}
          <div className="relative hidden shrink-0 sm:block sm:mr-6 lg:mr-10">
            {/* El componente FlowerPortrait debe adaptarse internamente */}
            <FlowerPortrait src={leftImg} alt="Cliente satisfecho disfrutando de comida" accentColor={GOLD_COLOR} />
          </div>

          {/* Headline with seal */}
          <div className="relative text-center">
            {/* El color del texto se heredará de 'light-block' (negro en claro, blanco en oscuro) */}
            <h2 className={`mx-auto max-w-4xl text-pretty text-2xl font-extrabold leading-tight tracking-tight sm:text-3xl lg:text-4xl`}>
              THE PEOPLE SAID <span className="relative inline-block">
                {/* Palabra clave destacada con el color de marca dorado */}
                <span className={`relative z-10`} style={{ color: GOLD_COLOR }}>BISTORA</span>
                {/* Seal (Sello) en negro/dorado, ahora con clase 'dark-block' para invertir */}
                <span
                  className="absolute -right-8 -top-6 z-20 rotate-[-12deg] select-none rounded-full dark-block px-3 py-2 text-xs font-black uppercase tracking-wider shadow-xl ring-2"
                  style={{ clipPath: 'polygon(5% 15%, 15% 5%, 85% 5%, 95% 15%, 95% 85%, 85% 95%, 15% 95%, 5% 85%)', borderColor: GOLD_COLOR }} // Borde dorado de marca
                >
                  TEST US
                </span>
              </span> DESERVES DAMN GREAT <span className="relative inline-block" style={{ color: GOLD_COLOR }}>TASTE</span>, AND CLEANER PROCESSES.
            </h2>

            {/* Scroll down CTA arrow */}
            <div className="mt-8 flex justify-center">
              <a href="#more" aria-label="Scroll down"
                // Botón CTA: Usa la clase 'accent-block' para el botón principal
                // Si el color de acento es GOLD_COLOR, lo definimos con style
                className="inline-flex h-12 w-12 items-center justify-center rounded-full text-black shadow-xl transition hover:shadow-2xl hover:brightness-110 focus:ring-4 focus:ring-offset-2 focus:ring-yellow-500"
                style={{ backgroundColor: GOLD_COLOR }}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-6 w-6">
                  <path fillRule="evenodd" d="M10 3.25a.75.75 0 0 1 .75.75v9.19l2.72-2.72a.75.75 0 0 1 1.06 1.06l-4 4a.75.75 0 0 1-1.06 0l-4-4a.75.75 0 1 1 1.06-1.06l2.72 2.72V4a.75.75 0 0 1 .75-.75Z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </div>

          {/* Right decorative image (flower-like) */}
          <div className="relative hidden shrink-0 sm:block sm:ml-6 lg:ml-10">
            <FlowerPortrait src={rightImg} alt="Persona feliz en ambiente agradable" accentColor={GOLD_COLOR} />
          </div>

          {/* subtle gradient edges - Deben ser adaptativos al light-block */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-gray-100 to-transparent dark:from-gray-800" aria-hidden="true" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-gray-100 to-transparent dark:from-gray-800" aria-hidden="true" />
        </div>
      </div>

      {/* Bottom promo ribbon */}
      <div className="relative">
        <div className="absolute inset-x-0 -bottom-6 z-10">
          {/* Cinta de promoción: Usa 'dark-block' para el fondo, texto con color de marca */}
          <div className="mx-auto max-w-none rotate-[-2deg] dark-block py-3 shadow-xl ring-2" style={{ borderColor: GOLD_COLOR }}>
            <div className="mx-auto flex max-w-7xl items-center overflow-hidden">
              {/* El texto se hereda del dark-block (blanco en claro, negro en oscuro), y luego se sobrescribe con GOLD_COLOR */}
              <p className="animate-none whitespace-nowrap text-center text-sm font-extrabold uppercase tracking-[0.25em]" style={{ color: GOLD_COLOR }}>
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

// Recibe un prop para el color de acento
function FlowerPortrait({ src, alt, accentColor }) {
  return (
    <div className="relative h-28 w-28 sm:h-32 sm:w-32">
      {/* Core circle */}
      {/* Borde: Usa text-color adaptable. El 'core' es el texto, que se invierte con light-block */}
      <div className="relative z-10 h-full w-full overflow-hidden rounded-full border-2 border-gray-900 dark:border-white shadow-md">
        <img src={src} alt={alt} className="h-full w-full object-cover" loading="lazy" />
      </div>
      {/* Petals using small circles */}
      {/* "Pétalos" con fondo adaptable (light-block, que es bg-white en claro y bg-gray-800 en oscuro) con borde dorado de marca */}
      <span className="absolute -top-2 left-1/2 -translate-x-1/2 h-7 w-7 rounded-full border-2 light-block" style={{ borderColor: accentColor }} />
      <span className="absolute top-4 -left-2 h-7 w-7 rounded-full border-2 light-block" style={{ borderColor: accentColor }} />
      <span className="absolute top-4 -right-2 h-7 w-7 rounded-full border-2 light-block" style={{ borderColor: accentColor }} />
      <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 h-7 w-7 rounded-full border-2 light-block" style={{ borderColor: accentColor }} />
    </div>
  )
}