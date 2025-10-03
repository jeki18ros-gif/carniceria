import React from 'react'
import leftImg from '../assets/otros2.jpg'
import rightImg from '../assets/relleno8.jpg'

export default function AfterHero() {
  return (
    <section className="relative bg-[#F7F7F7]">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Central band */}
        <div className="relative isolate mx-auto flex items-center justify-center rounded-3xl bg-[#FDFDFD] px-6 py-16 shadow-xl ring-1 ring-black/5 sm:px-10">
          {/* Left decorative image (flower-like) */}
          <div className="relative hidden shrink-0 sm:block sm:mr-6 lg:mr-10">
            <FlowerPortrait src={leftImg} alt="Cliente satisfecho disfrutando de comida" />
          </div>

          {/* Headline with seal */}
          <div className="relative text-center">
            <h2 className="mx-auto max-w-4xl text-pretty text-2xl font-extrabold leading-tight tracking-tight text-[#2b1a15] sm:text-3xl lg:text-4xl">
              THE PEOPLE SAID <span className="relative inline-block">
                <span className="relative z-10">BISTORA</span>
                {/* Seal overlapping the keyword */}
                <span
                  className="absolute -right-8 -top-6 z-20 rotate-[-12deg] select-none rounded-full bg-[#E53935] px-3 py-2 text-xs font-black uppercase tracking-wider text-white shadow-md ring-2 ring-[#8b1f1d]"
                  style={{ clipPath: 'polygon(5% 15%, 15% 5%, 85% 5%, 95% 15%, 95% 85%, 85% 95%, 15% 95%, 5% 85%)' }}
                >
                  TEST US
                </span>
              </span> DESERVES DAMN GREAT <span className="relative inline-block">TASTE</span>, AND CLEANER PROCESSES.
            </h2>

            {/* Scroll down CTA arrow */}
            <div className="mt-8 flex justify-center">
              <a href="#more" aria-label="Scroll down"
                 className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#E53935] text-white shadow-lg transition hover:bg-[#c62828]">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-6 w-6">
                  <path fillRule="evenodd" d="M10 3.25a.75.75 0 0 1 .75.75v9.19l2.72-2.72a.75.75 0 0 1 1.06 1.06l-4 4a.75.75 0 0 1-1.06 0l-4-4a.75.75 0 1 1 1.06-1.06l2.72 2.72V4a.75.75 0 0 1 .75-.75Z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </div>

          {/* Right decorative image (flower-like) */}
          <div className="relative hidden shrink-0 sm:block sm:ml-6 lg:ml-10">
            <FlowerPortrait src={rightImg} alt="Persona feliz en ambiente agradable" />
          </div>

          {/* subtle gradient edges */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[#FDFDFD] to-transparent" aria-hidden="true" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[#FDFDFD] to-transparent" aria-hidden="true" />
        </div>
      </div>

      {/* Bottom promo ribbon */}
      <div className="relative">
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

function FlowerPortrait({ src, alt }) {
  return (
    <div className="relative h-28 w-28 sm:h-32 sm:w-32">
      {/* Core circle */}
      <div className="relative z-10 h-full w-full overflow-hidden rounded-full border border-black/30 shadow-md">
        <img src={src} alt={alt} className="h-full w-full object-cover" loading="lazy" />
      </div>
      {/* Petals using small circles */}
      <span className="absolute -top-2 left-1/2 -translate-x-1/2 h-7 w-7 rounded-full border border-black/30 bg-[#FDFDFD]" />
      <span className="absolute top-4 -left-2 h-7 w-7 rounded-full border border-black/30 bg-[#FDFDFD]" />
      <span className="absolute top-4 -right-2 h-7 w-7 rounded-full border border-black/30 bg-[#FDFDFD]" />
      <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 h-7 w-7 rounded-full border border-black/30 bg-[#FDFDFD]" />
    </div>
  )
}
