import React from 'react'
import logo from '../assets/Logo-BENITO.jpg'

// Floating, rounded header with centered logo anchor and symmetric nav
export default function Header() {
  return (
    <header className="relative z-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Container with large radius to look like a floating section */}
        <div className="relative mt-6 rounded-3xl bg-white/70 shadow-xl ring-1 ring-black/5 backdrop-blur supports-[backdrop-filter]:backdrop-blur-md">
          {/* Centered logo overlapping header (anchor technique) */}
          <div className="absolute inset-x-0 -top-8 flex justify-center">
            <div className="h-20 w-20 overflow-hidden rounded-full ring-4 ring-white shadow-md">
              <img
                src={logo}
                alt="Benito Logo"
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </div>
          </div>

          {/* Nav bar */}
          <nav className="flex items-center justify-between px-6 py-5 sm:px-8">
            {/* Left nav */}
            <ul className="hidden gap-8 text-sm font-medium text-[#222222] sm:flex">
              <li>
                <a href="#productos" className="transition-colors hover:text-[#555555]">PRODUCTOS</a>
              </li>
              <li>
                <a href="#nosotros" className="transition-colors hover:text-[#555555]">NOSOTROS</a>
              </li>
            </ul>

            {/* Center spacer to keep symmetry with absolute logo */}
            <div className="h-0 w-20 sm:w-24" aria-hidden="true" />

            {/* Right nav */}
            <ul className="hidden gap-8 text-sm font-medium text-[#222222] sm:flex">
              <li>
                <a href="#resenas" className="transition-colors hover:text-[#555555]">RESEÑAS</a>
              </li>
              <li>
                <a href="#contacto" className="transition-colors hover:text-[#555555]">CONTACTO</a>
              </li>
            </ul>

            {/* Mobile simple menu placeholder (optional) */}
            <button
              className="sm:hidden inline-flex items-center rounded-xl border border-black/10 bg-white/70 px-3 py-2 text-sm font-medium text-[#222222] shadow-sm hover:bg-white/90"
              aria-label="Abrir menú"
            >
              Menú
            </button>
          </nav>
        </div>
      </div>
    </header>
  )
}

