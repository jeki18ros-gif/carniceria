import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import logo from '../assets/Logo-BENITO.jpg'
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline'


// --- Paleta de Marca ---
const DORADO_HEX = '#d4af37'

// --- Componente Principal ---
export default function Header() {
  const [theme, setTheme] = useState('light')
  const [fontSize, setFontSize] = useState('normal')
  const [scrolled, setScrolled] = useState(false)

  // Inicializar desde localStorage (opcional)
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme')
    const savedFont = localStorage.getItem('fontSize')
    if (savedTheme === 'dark' || savedTheme === 'light') setTheme(savedTheme)
    if (savedFont === 'small' || savedFont === 'normal' || savedFont === 'large') setFontSize(savedFont)
  }, [])

  // Modo oscuro: Aplica 'dark' a <html>
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    localStorage.setItem('theme', theme)
  }, [theme])

  // Tamaño de fuente en <html>
  useEffect(() => {
    document.documentElement.classList.remove('text-sm', 'text-lg')
    if (fontSize === 'small') document.documentElement.classList.add('text-sm')
    if (fontSize === 'large') document.documentElement.classList.add('text-lg')
    localStorage.setItem('fontSize', fontSize)
  }, [fontSize])

  const toggleTheme = () => setTheme(prev => (prev === 'light' ? 'dark' : 'light'))

  // Detectar scroll para cambiar estilo del header
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const linkBase = `transition-colors transition-transform duration-200 ease-out hover:scale-110 hover:text-yellow-400 ${scrolled ? 'text-gray-900 dark:text-gray-100' : 'text-white'}`
  return (
    <motion.header
      className="fixed inset-x-0 top-0 z-50 transition-colors duration-700"
      initial={{ y: '-100%', opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Sección flotante con margen, borde y fondo adaptativo */}
        <div
          className={`mt-3 mb-2 rounded-2xl border backdrop-blur-md transition-colors duration-300 ${
            scrolled
              ? 'bg-white/95 dark:bg-[#222222]/90 border-black/10 dark:border-white/10 shadow-lg'
              : 'bg-black/25 dark:bg-white/10 border-white/20'
          }`}
        >
        {/* NAVBAR en rejilla: logo izquierda, links centro, controles derecha */}
        <nav className="relative grid grid-cols-3 items-center h-16 sm:h-20 px-4 sm:px-6">
          {/* Logo izquierda */}
          <div className="flex items-center">
            <div className="h-16 w-16 sm:h-20 sm:w-20 overflow-hidden rounded-full ring-2 ring-white/90 shadow-lg dark:ring-yellow-500/60 transition-transform duration-200 ease-out hover:scale-105">
              <img src={logo} alt="Benito Logo" className="h-full w-full object-cover" loading="lazy" />
            </div>
          </div>

          {/* Enlaces en el centro */}
          <ul className="hidden sm:flex justify-center gap-8 text-base font-semibold">
            <li><a href="#productos" className={linkBase}>PRODUCTOS</a></li>
            <li><a href="#nosotros" className={linkBase}>NOSOTROS</a></li>
            <li><a href="#resenas" className={linkBase}>RESEÑAS</a></li>
            <li><a href="#contacto" className={linkBase}>CONTACTO</a></li>
          </ul>

          {/* Controles a la derecha */}
          <div className="flex items-center justify-end gap-4">
            <div className="flex items-center gap-2 border-l border-white/30 dark:border-white/20 pl-4">
              <DarkModeToggle theme={theme} toggleTheme={toggleTheme} />
              <FontSizeSelector fontSize={fontSize} setFontSize={setFontSize} />
            </div>
            {/* Botón Móvil */}
            <button className="sm:hidden inline-flex items-center rounded-xl px-3 py-2 text-sm shadow-sm accent-block" aria-label="Abrir menú">Menú</button>
          </div>
        </nav>
      </div>
    </div>
    </motion.header>
  )
}

// --- 2. Botón Modo Oscuro ---
function DarkModeToggle({ theme, toggleTheme }) {
  const Icon = theme === 'dark' ? SunIcon : MoonIcon
  return (
    <button
      onClick={toggleTheme}
      className="p-2.5 md:p-3 text-white transition-transform duration-200 ease-out hover:scale-110 outline-none"
      aria-label="Cambiar tema"
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
    // Contenedor transparente, sin fondo
    <div className="flex rounded-xl p-1.5">
      {sizes.map(({ label, value }) => (
        <button
          key={value}
          onClick={() => setFontSize(value)}
          aria-label={`Tamaño de fuente ${value}`}
          className={`px-3 py-2 text-base font-bold transition-all duration-200 ease-out uppercase rounded-lg outline-none hover:scale-105
            ${fontSize === value
              ? 'text-yellow-400'
              : 'text-white/90 hover:text-yellow-400'
            }`}
        >
          {label}
        </button>
      ))}
    </div>
  )
}