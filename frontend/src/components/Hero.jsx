import React from 'react'
import bg from '../assets/primera.jpg'

export default function Hero() {
  return (
    <section className="relative isolate">
      {/* Background gradient behind the photography to match the elegant palette */}
      <div className="absolute inset-0 -z-20 bg-gradient-to-b from-[#111111] to-[#1C1C1C]" aria-hidden="true" />

      {/* Background image */}
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative mt-8 overflow-hidden rounded-3xl shadow-2xl ring-1 ring-black/10">
          <img
            src={bg}
            alt="Cena social con cortes de carne de alta calidad"
            className="h-[70vh] w-full object-cover sm:h-[75vh] lg:h-[80vh]"
            loading="eager"
          />

          {/* Dark technical overlay to ensure contrast */}
          <div className="absolute inset-0 bg-black/45 mix-blend-multiply" aria-hidden="true" />

          {/* Content layer */}
          <div className="absolute inset-0 flex flex-col">
            {/* Headline centered vertically with breathing room */}
            <div className="flex flex-1 items-center justify-center px-6 sm:px-12">
              <h1
                className="text-center font-extrabold tracking-tight text-white drop-shadow-md [text-wrap:balance] text-4xl sm:text-5xl lg:text-6xl"
                style={{ fontFamily: 'ui-sans-serif, system-ui' }}
              >
                CARNE DE CALIDAD AL POR MAYOR
              </h1>
            </div>

            {/* CTA anchored bottom-left */}
            <div className="relative">
              <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-t from-black/30 to-transparent" aria-hidden="true" />
              <div className="flex items-end justify-start px-6 pb-6 sm:px-12 sm:pb-8">
                <a
                  href="#orden"
                  className="inline-flex items-center gap-2 rounded-2xl bg-[#FFC107] px-5 py-3 text-sm font-semibold text-[#222222] shadow-lg transition hover:bg-[#FFB300] focus-visible:outline-2 focus-visible:outline-[#D39E00] focus-visible:outline-offset-2"
                >
                  ORDEN DE COMPRA
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
                    <path fillRule="evenodd" d="M3 10a.75.75 0 0 1 .75-.75h9.638L10.22 6.28a.75.75 0 1 1 1.06-1.06l4.5 4.5a.75.75 0 0 1 0 1.06l-4.5 4.5a.75.75 0 1 1-1.06-1.06l3.168-3.168H3.75A.75.75 0 0 1 3 10Z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

