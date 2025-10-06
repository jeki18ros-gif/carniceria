import React from 'react'

// Definición de colores de marca:
const GOLD_COLOR = '#d4af37' 
// El texto principal ahora será manejado por la clase dark-block

export default function Footer() {
  return (
    // 1. Fondo del footer: Usa 'dark-block'. 
    // Esto lo hará gris oscuro/negro en modo claro (manteniendo tu intención) 
    // y lo invertirá a blanco/gris claro en modo oscuro, si así lo requiere la accesibilidad global.
    <footer className="dark-block">
      {/* Top content */}
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-4">
          {/* Brand */}
          <div>
            {/* Logo y título en Dorado (Color de marca fijo) */}
            <h4 className="text-5xl font-extrabold tracking-tight" style={{ color: GOLD_COLOR }}>BISTORA</h4>
            {/* Texto adaptable */}
            <p className="mt-4 max-w-sm text-white/80 dark:text-gray-300">Calidad al por mayor con procesos limpios y servicio profesional.</p>
            <div className="mt-6">
              {/* Botón CTA: Usa style para el fondo dorado de marca, y hover adaptable */}
              <a 
                href="#comprar" 
                className="inline-flex items-center justify-center rounded-lg px-6 py-3 text-sm font-bold uppercase tracking-widest text-black shadow-xl transition duration-300 hover:bg-white hover:text-[${GOLD_COLOR}] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
                style={{ backgroundColor: GOLD_COLOR }}
              >
                COMPRAR PLANTILLA
              </a>
            </div>
          </div>

          {/* Opening hours */}
          <div>
            {/* Título en Dorado (Color de marca fijo) */}
            <h5 className="text-sm font-extrabold uppercase tracking-widest" style={{ color: GOLD_COLOR }}>Horarios</h5>
            {/* Texto adaptable, heredado de dark-block */}
            <ul className="mt-5 space-y-2 text-sm text-white/90 dark:text-gray-300">
              <li>Lunes - Viernes: 09:00 - 20:00</li>
              <li>Sábado: 10:00 - 18:00</li>
              <li>Domingo: Cerrado</li>
            </ul>
          </div>

          {/* Shop address and Socials */}
          <div>
            {/* Título en Dorado (Color de marca fijo) */}
            <h5 className="text-sm font-extrabold uppercase tracking-widest" style={{ color: GOLD_COLOR }}>Ubicación y Contacto</h5>
            {/* Texto adaptable, heredado de dark-block */}
            <p className="mt-5 max-w-xs text-sm text-white/90 dark:text-gray-300">1234 Market Street, Montreal, QC, Canadá</p>
            <div className="mt-5 flex items-center gap-4">
              {/* Íconos sociales: Color heredado (texto de dark-block) con hover en dorado */}
              <a href="#" aria-label="X" className="transition text-white dark:text-gray-200 hover:text-[${GOLD_COLOR}]">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6">
                  <path d="M4 4l16 16M20 4L4 20" />
                </svg>
              </a>
              <a href="#" aria-label="Instagram" className="transition text-white dark:text-gray-200 hover:text-[${GOLD_COLOR}]">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  <path d="M18.5 5.5h.01" />
                </svg>
              </a>
              <a href="#" aria-label="YouTube" className="transition text-white dark:text-gray-200 hover:text-[${GOLD_COLOR}]">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
                  <path d="M19.615 3.161C18.683 2.502 16.715 2 12 2S5.317 2.502 4.385 3.161A4.852 4.852 0 002 6.5v11C2 20.311 3.689 22 5.5 22h13c1.811 0 3.5-1.689 3.5-3.5v-11a4.852 4.852 0 00-2.385-3.339zM10 15V9l5 3-5 3z" />
                </svg>
              </a>
              <a href="#" aria-label="Facebook" className="transition text-white dark:text-gray-200 hover:text-[${GOLD_COLOR}]">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
                  <path d="M13 14H9v-3h4V8h-4V5H9v3H5v3h4v8h4v-8h3l1-3h-4V6a2 2 0 012-2z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Illustration doodle */}
          <div className="flex items-center justify-center lg:justify-end">
            {/* El doodle usa el color de texto de su contenedor, que se establece en el componente */}
            <Doodle />
          </div>
        </div>
      </div>

      {/* Separator */}
      {/* Separador delgado en dorado (fijo) */}
      <div className="h-0.5 w-full bg-[${GOLD_COLOR}]/50" />

      {/* Bottom links */}
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <LinkColumn title="PÁGINAS PRINCIPALES" links={["INICIO", "NOSOTROS", "CONTACTO"]} />
          <LinkColumn title="LEGAL" links={["PREGUNTAS", "POLÍTICA DE PRIVACIDAD", "TÉRMINOS Y CONDICIONES"]} />
          <LinkColumn title="CONTENIDO" links={["MENÚ", "DETALLES", "BLOGS"]} />
          <LinkColumn title="RECURSOS" links={["LICENCIA", "GUÍA DE ESTILOS", "CHANGELOG"]} />
        </div>
        {/* Texto de copyright en color de texto adaptable */}
        <p className="mt-8 text-center text-xs text-white/60 dark:text-gray-400">© {new Date().getFullYear()} BISTORA. Todos los derechos reservados. Desarrollado con 💛 y ☕.</p>
      </div>
    </footer>
  )
}

function LinkColumn({ title, links }) {
  return (
    <div>
      {/* Título de columna en Dorado (Color de marca fijo) */}
      <h6 className="mb-3 text-sm font-extrabold uppercase tracking-widest" style={{ color: GOLD_COLOR }}>{title}</h6>
      <ul className="space-y-2 text-sm">
        {links.map((l) => (
          <li key={l}>
            {/* Enlaces: color adaptable con hover en dorado */}
            <a href="#" className="transition text-white/90 dark:text-gray-300 hover:text-[${GOLD_COLOR}]">{l}</a>
          </li>
        ))}
      </ul>
    </div>
  )
}

function Doodle() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 240 140"
      // Doodle: El color es manejado por el texto de su contenedor, que es adaptable
      className={`h-32 w-auto text-[${GOLD_COLOR}] dark:text-yellow-400`}
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* table */}
      <path d="M20 110h200" />
      <path d="M60 110V90m120 20V90" />
      {/* person */}
      <circle cx="120" cy="50" r="12" />
      <path d="M90 80c10-15 50-15 60 0" />
      <path d="M110 62c-12 8-25 18-30 28" />
      <path d="M130 62c12 8 25 18 30 28" />
      {/* plate and meal */}
      <ellipse cx="120" cy="95" rx="24" ry="8" />
      <path d="M110 92c6 3 14 3 20 0" />
      {/* speech bubble */}
      <path d="M160 30h40v24h-30l-10 8z" />
      {/* El texto dentro del SVG se adapta si su fill/color es 'currentColor' */}
      <text x="165" y="44" fontSize="10" fill="currentColor">Disfrutando</text>
    </svg>
  )
}