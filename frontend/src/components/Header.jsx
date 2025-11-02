import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import logo from '../assets/Logo-BENITO.jpg'
import { SunIcon, MoonIcon, Bars3Icon, MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline'

export default function Header() {
  const [theme, setTheme] = useState('light')
  const [fontSize, setFontSize] = useState('normal')
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [fontMenuOpen, setFontMenuOpen] = useState(false)

  // --- Preferencias guardadas ---
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme')
    const savedFont = localStorage.getItem('fontSize')
    if (savedTheme) setTheme(savedTheme)
    if (savedFont) setFontSize(savedFont)
  }, [])

  // --- Aplicar tema ---
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    localStorage.setItem('theme', theme)
  }, [theme])

  // --- Aplicar tamaño de fuente ---
  useEffect(() => {
    document.documentElement.classList.remove('text-sm', 'text-lg')
    if (fontSize === 'small') document.documentElement.classList.add('text-sm')
    if (fontSize === 'large') document.documentElement.classList.add('text-lg')
    localStorage.setItem('fontSize', fontSize)
  }, [fontSize])

  // --- Detectar scroll ---
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const toggleTheme = () => setTheme(prev => (prev === 'light' ? 'dark' : 'light'))

  const linkBase = `
    transition-all duration-200 ease-out 
    hover:scale-110 hover:text-[var(--color-accent-light)] 
    dark:hover:text-[var(--color-accent-dark)] font-semibold
  `

  const floatingContainerClasses = `
    mt-3 mb-2 rounded-2xl border backdrop-blur-md transition-colors duration-300
    ${
      scrolled
        ? 'bg-white/95 dark:bg-[#222222]/90 border-black/10 dark:border-white/10 shadow-lg'
        : 'bg-black/25 dark:bg-white/10 border-white/20'
    }
  `

  return (
    <motion.header
      className="fixed inset-x-0 top-0 z-50 w-full transition-colors duration-700"
      initial={{ y: '-100%', opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <div className="mx-auto w-full max-w-7xl px-3 sm:px-6 lg:px-8 relative">
        <div className={floatingContainerClasses}>
          <nav className="relative flex items-center justify-between min-h-[4rem] sm:h-20 px-3 sm:px-6">
            
            {/* --- LOGO --- */}
            <div className="flex items-center overflow-hidden">
              <div className="h-14 w-14 sm:h-20 sm:w-20 overflow-hidden rounded-full ring-2 ring-gray-900/90 shadow-lg dark:ring-[var(--color-accent-dark)]/60 hover:scale-105 transition-transform">
                <img src={logo} alt="Benito Logo" className="h-full w-full object-cover" loading="lazy" />
              </div>
            </div>

            {/* --- LINKS GRANDES --- */}
            <ul className="hidden sm:flex justify-center gap-8 text-base text-white dark:text-white flex-wrap">
              <li><a href="#productos" className={linkBase}>PRODUCTOS</a></li>
              <li><a href="#nosotros" className={linkBase}>NOSOTROS</a></li>
              <li><a href="#resenas" className={linkBase}>RESEÑAS</a></li>
              <li><a href="#contacto" className={linkBase}>CONTACTO</a></li>
            </ul>

            {/* --- CONTROLES DERECHA (ESCRITORIO) --- */}
            <div className="hidden sm:flex items-center gap-4 flex-shrink-0">
              <DarkModeToggle theme={theme} toggleTheme={toggleTheme} />
              <div className="border-l border-white/30 dark:border-white/20 h-6"></div>
              <FontSizeSelector fontSize={fontSize} setFontSize={setFontSize} />
            </div>

            {/* --- CONTROLES MÓVIL --- */}
            <div className="flex sm:hidden items-center gap-3 text-white overflow-hidden">
              {/* Fuente */}
              <button
                onClick={() => {
                  setFontMenuOpen(prev => !prev)
                  setMenuOpen(false)
                }}
                className="p-2 rounded-lg bg-transparent hover:scale-110 transition-transform overflow-hidden"
                aria-label="Tamaño de letra"
              >
                <MagnifyingGlassIcon className="h-6 w-6" />
              </button>

              {/* Tema */}
              <DarkModeToggle theme={theme} toggleTheme={toggleTheme} />

              {/* Menú */}
              <button
                onClick={() => {
                  setMenuOpen(prev => !prev)
                  setFontMenuOpen(false)
                }}
                className="p-2 rounded-lg bg-transparent hover:scale-110 transition-transform overflow-hidden"
                aria-label="Abrir menú"
              >
                {menuOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
              </button>
            </div>
          </nav>
        </div>

        {/* --- MENÚ DE FUENTE MÓVIL --- */}
        <AnimatePresence>
          {fontMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-full right-4 bg-black/80 text-white rounded-xl p-3 backdrop-blur-md border border-white/20 flex gap-3 z-50"
            >
              <FontSizeSelector fontSize={fontSize} setFontSize={setFontSize} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* --- MENÚ PRINCIPAL MÓVIL --- */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute top-full left-0 w-full bg-black/80 text-white backdrop-blur-md border-t border-white/20 shadow-xl z-50"
            >
              <ul className="flex flex-col items-center gap-4 py-4 text-lg">
                <li><a href="#productos" onClick={() => setMenuOpen(false)}>PRODUCTOS</a></li>
                <li><a href="#nosotros" onClick={() => setMenuOpen(false)}>NOSOTROS</a></li>
                <li><a href="#resenas" onClick={() => setMenuOpen(false)}>RESEÑAS</a></li>
                <li><a href="#contacto" onClick={() => setMenuOpen(false)}>CONTACTO</a></li>
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  )
}

/* --- BOTÓN MODO OSCURO --- */
function DarkModeToggle({ theme, toggleTheme }) {
  const Icon = theme === 'dark' ? SunIcon : MoonIcon
  return (
    <button
      onClick={toggleTheme}
      className="theme-toggle bg-transparent overflow-hidden"
      aria-label="Cambiar tema"
    >
      <Icon className="h-6 w-6" />
    </button>
  )
}

/* --- SELECTOR DE TAMAÑO DE FUENTE --- */
function FontSizeSelector({ fontSize, setFontSize }) {
  const sizes = [
    { label: 'A-', value: 'small' },
    { label: 'A', value: 'normal' },
    { label: 'A+', value: 'large' },
  ]

  return (
    <div className="font-size-container">
      {sizes.map(({ label, value }) => (
        <button
          key={value}
          onClick={() => setFontSize(value)}
          className={`font-size-btn ${fontSize === value ? 'active' : ''}`}
        >
          {label}
        </button>
      ))}
    </div>
  )
}
