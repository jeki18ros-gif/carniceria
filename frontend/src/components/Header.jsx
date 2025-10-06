import React, { useState, useEffect } from 'react'
import logo from '../assets/Logo-BENITO.jpg'
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline'

// --- Paleta de Marca ---
const DORADO_HEX = '#d4af37'

// --- Componente Principal ---
export default function Header() {
  const [theme, setTheme] = useState('light')
  const [fontSize, setFontSize] = useState('normal')

  // Modo oscuro: Aplica 'dark' a <html>
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    // Opcional: Guardar la preferencia del usuario en localStorage
    localStorage.setItem('theme', theme)
  }, [theme])

  // Tamaño de fuente: Aplica 'text-sm' o 'text-lg' a <html>
  useEffect(() => {
    document.documentElement.classList.remove('text-sm', 'text-lg')
    if (fontSize === 'small') {
      document.documentElement.classList.add('text-sm')
    } else if (fontSize === 'large') {
      document.documentElement.classList.add('text-lg')
    }
    // Opcional: Guardar la preferencia del usuario en localStorage
    localStorage.setItem('fontSize', fontSize)
  }, [fontSize])

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'))
  }

  // NOTE: El cuerpo (body) ya será adaptativo gracias a la clase .dark en <html> y tu index.css

  return (
    <header className="relative z-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* CONTENEDOR PRINCIPAL: Usa 'medium-block' para un fondo intermedio */}
        <div className="relative mt-6 rounded-3xl medium-block shadow-xl ring-1 ring-black/20 dark:ring-white/50 overflow-visible">
          {/* LOGO CENTRAL */}
          <div className="absolute inset-x-0 -top-8 flex justify-center pointer-events-none z-10">
            {/* El anillo debe mantener el color dorado de la marca, ya que no es un color de paleta genérica */}
            <div className="h-[90px] w-[90px] overflow-hidden rounded-full ring-4 ring-white shadow-lg dark:ring-[${DORADO_HEX}] pointer-events-auto">
              <img
                src={logo}
                alt="Benito Logo"
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </div>
          </div>

          {/* NAVBAR */}
          <nav className="relative flex items-center justify-between px-6 py-4 sm:px-8 z-20">

            {/* Enlaces Izquierda - Usan la clase base text-gray-900/text-white de body, y hover adaptativo por index.css */}
            <ul className="hidden gap-8 text-base font-semibold sm:flex">
              <li>
                <a href="#productos" className="transition-colors hover:text-yellow-400">PRODUCTOS</a>
              </li>
              <li>
                <a href="#nosotros" className="transition-colors hover:text-yellow-400">NOSOTROS</a>
              </li>
            </ul>

            {/* Espaciador */}
            <div className="h-0 w-24 sm:w-32" aria-hidden="true" />

            {/* Enlaces Derecha + Controles */}
            <div className="flex items-center gap-4">
              <ul className="hidden gap-8 text-base font-semibold sm:flex">
                <li>
                  <a href="#resenas" className="transition-colors hover:text-yellow-400">RESEÑAS</a>
                </li>
                <li>
                  <a href="#contacto" className="transition-colors hover:text-yellow-400">CONTACTO</a>
                </li>
              </ul>

              {/* Controles - Borde adaptativo */}
              <div className="flex items-center gap-2 border-l border-gray-400/50 dark:border-white/20 pl-4">
                <DarkModeToggle theme={theme} toggleTheme={toggleTheme} />
                <FontSizeSelector fontSize={fontSize} setFontSize={setFontSize} />
              </div>

              {/* Botón Móvil - Usa la clase accent-block para botón principal */}
              <button
                className="sm:hidden inline-flex items-center rounded-xl px-3 py-2 text-sm shadow-sm accent-block"
                aria-label="Abrir menú"
              >
                Menú
              </button>
            </div>
          </nav>
        </div>
      </div>
    </header>
  )
}

// --- 2. Botón Modo Oscuro ---
function DarkModeToggle({ theme, toggleTheme }) {
  const Icon = theme === 'dark' ? SunIcon : MoonIcon

  return (
    // Usa la clase 'theme-toggle' de tu index.css para los estilos de fondo y hover
    <button
      onClick={toggleTheme}
      className={`theme-toggle p-3 md:p-3.5 shadow-md outline-none focus:ring-4 focus:ring-yellow-400/50 dark:focus:ring-white/50`}
    >
      <Icon className="h-6 w-6" />
    </button>
  )
}

// --- 3. Selector de Tamaño de Fuente ---
function FontSizeSelector({ fontSize, setFontSize }) {
  const sizes = [
    { label: 'A-', value: 'small' },
    { label: 'A', value: 'normal' },
    { label: 'A+', value: 'large' },
  ]

  return (
    // Usa 'light-block' para el contenedor del selector para que se adapte
    <div className="flex rounded-xl light-block p-1.5 ring-1 ring-black/20 dark:ring-white/10">
      {sizes.map(({ label, value }) => (
        <button
          key={value}
          onClick={() => setFontSize(value)}
          aria-label={`Tamaño de fuente ${value}`}
          className={`px-3 py-2 text-base font-bold transition-all duration-200 uppercase rounded-lg outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500
            ${fontSize === value
              // Usa la clase 'accent-block' para el botón seleccionado
              ? 'accent-block shadow-md'
              // Para el no seleccionado, usamos los colores adaptativos de tu CSS.
              : 'text-gray-600 dark:text-white/70 hover:text-yellow-500'
            }`}
        >
          {label}
        </button>
      ))}
    </div>
  )
}