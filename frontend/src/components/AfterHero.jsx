import React from 'react'
import leftImg from '../assets/otros2.jpg'
import rightImg from '../assets/relleno8.jpg'

export default function AfterHero() {
  const doradoVar = "var(--color-dorado)";

  return (
    <section className="after-hero relative min-h-[70vh] light-block">
      <div className="mx-auto flex min-h-[60vh] max-w-7xl items-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="relative isolate mx-auto flex w-full items-center justify-between gap-6 px-0 sm:gap-10">
          <div className="relative block shrink-0 mr-2 sm:mr-6 lg:mr-10">
            <FlowerPortrait src={leftImg} alt="Cliente satisfecho disfrutando de comida" accentColor={doradoVar} />
          </div>
          <div className="relative mx-auto text-center">
            <h2 className="mx-auto max-w-5xl text-pretty text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              OFRECEMOS PRODUCTOS DE CALIDAD, EN <span className="relative inline-block">
                <span className="relative z-10 text-dorado">BENITO</span>
              </span> CONOCERÁS 
              <span className="relative inline-block text-dorado">EL SABOR</span> DE NUESTRA CARNE.
            </h2>
          </div>
          <div className="relative block shrink-0 ml-2 sm:ml-6 lg:ml-10">
            <FlowerPortrait src={rightImg} alt="Persona feliz en ambiente agradable" accentColor={doradoVar} />
          </div>
        </div>
      </div>
      <div className="relative">
        <div className="absolute inset-x-0 -bottom-10 z-10">
          <div className="w-full rotate-[-2deg] py-7 shadow-xl accent-block"> 
            <div className="flex w-full overflow-hidden">
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
  )
}
function FlowerPortrait({ src, alt, accentColor }) {
  return (
    <div className="relative h-28 w-28 sm:h-40 sm:w-40 animate-[floatY_6s_ease-in-out_infinite] will-change-transform">
      <div className="relative z-10 h-full w-full overflow-hidden rounded-full border-2 border-transparent shadow-md">
        <img src={src} alt={alt} className="h-full w-full object-cover" loading="lazy" />
      </div>
      <span className="absolute -top-2 left-1/2 -translate-x-1/2 h-7 w-7 rounded-full border-2 bg-white" style={{ borderColor: accentColor }} />
      <span className="absolute top-4 -left-2 h-7 w-7 rounded-full border-2 bg-white" style={{ borderColor: accentColor }} />
      <span className="absolute top-4 -right-2 h-7 w-7 rounded-full border-2 bg-white" style={{ borderColor: accentColor }} />
      <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 h-7 w-7 rounded-full border-2 bg-white" style={{ borderColor: accentColor }} />
    </div>
  )
}