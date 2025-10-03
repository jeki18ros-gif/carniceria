import React from 'react'
import bg from '../assets/relleno10.jpg'

export default function PromoHero() {
  return (
    <section className="relative bg-[#B71C1C] py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl shadow-2xl ring-1 ring-black/10">
          <img
            src={bg}
            alt="Presentación de comida profesional con enfoque al centro"
            className="h-[60vh] w-full object-cover sm:h-[65vh] lg:h-[70vh]"
            loading="lazy"
          />
          {/* dark overlay centered */}
          <div className="absolute inset-0 bg-black/50" aria-hidden="true" />
          <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center sm:px-12">
            <h2 className="text-3xl font-extrabold uppercase tracking-wide text-[#FFF7ED] sm:text-4xl lg:text-5xl">
              PERFECT FOOD, PROFESSIONAL SERVICE
            </h2>
            <p className="mt-4 max-w-2xl text-sm text-white/90 sm:text-base">
              Experiencia inmersiva en alimentos al por mayor con estándares altos de calidad y procesos limpios.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
