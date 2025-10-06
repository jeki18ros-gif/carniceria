import React from 'react'

// Paleta de Colores de Marca
const ACCENT_GOLD = '#D4AF37'; 
const ACCENT_DARK_TEXT = 'text-gray-900';
const ACCENT_LIGHT_TEXT = 'text-gray-100'; 

export default function ContactSection() {
  return (
    // 1. Fondo de la Sección: Usa 'light-block' para que sea el fondo más claro/blanco.
    // Esto será bg-gray-100 en modo claro y bg-gray-800 en modo oscuro.
    <section className="relative light-block py-16">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        {/* Título: El color se hereda de 'light-block' (negro en claro, blanco en oscuro) */}
        <h3 className={`mb-6 text-center text-3xl font-extrabold uppercase tracking-tight`}>
          Contáctanos
        </h3>
        {/* Subtítulo: Usa color de texto adaptable */}
        <p className="mb-8 text-center text-sm text-gray-600 dark:text-gray-300">
          Envíanos tu consulta y te responderemos a la brevedad.
        </p>

        {/* Formulario: Usa 'medium-block' o un blanco puro adaptable (siempre opuesto al fondo) */}
        {/* Usaremos 'light-block' con un tono de blanco más enfático para el formulario */}
        <form onSubmit={(e) => e.preventDefault()} className="rounded-3xl bg-white dark:bg-gray-700 p-6 shadow-xl ring-1 ring-black/5 dark:ring-white/10 sm:p-8">
          <div className="grid gap-5 sm:grid-cols-2">
            
            {/* Campo Nombre */}
            <div className="sm:col-span-1">
              {/* Etiqueta: Color heredado del formulario o explícitamente oscuro/claro */}
              <label htmlFor="name" className={`mb-2 block text-xs font-bold uppercase tracking-wide ${ACCENT_DARK_TEXT} dark:${ACCENT_LIGHT_TEXT}`}>
                Tu nombre
              </label>
              <input
                id="name"
                name="name"
                type="text"
                placeholder="Juan Pérez"
                // Inputs adaptables: fondo bg-gray-100 / dark:bg-gray-600, foco en dorado de tu CSS (yellow-500)
                className="w-full rounded-xl border border-black/10 bg-gray-100 dark:bg-gray-600 px-4 py-3 text-sm text-gray-900 dark:text-white outline-none ring-0 focus:border-2 focus:border-yellow-500 transition duration-300"
                required
              />
            </div>

            {/* Campo Correo */}
            <div className="sm:col-span-1">
              <label htmlFor="email" className={`mb-2 block text-xs font-bold uppercase tracking-wide ${ACCENT_DARK_TEXT} dark:${ACCENT_LIGHT_TEXT}`}>
                Tu correo
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="correo@ejemplo.com"
                className="w-full rounded-xl border border-black/10 bg-gray-100 dark:bg-gray-600 px-4 py-3 text-sm text-gray-900 dark:text-white outline-none ring-0 focus:border-2 focus:border-yellow-500 transition duration-300"
                required
              />
            </div>

            {/* Campo Mensaje */}
            <div className="sm:col-span-2">
              <label htmlFor="message" className={`mb-2 block text-xs font-bold uppercase tracking-wide ${ACCENT_DARK_TEXT} dark:${ACCENT_LIGHT_TEXT}`}>
                Tu mensaje
              </label>
              <textarea
                id="message"
                name="message"
                rows={5}
                placeholder="Escribe tu consulta..."
                className="w-full rounded-xl border border-black/10 bg-gray-100 dark:bg-gray-600 px-4 py-3 text-sm text-gray-900 dark:text-white outline-none ring-0 focus:border-2 focus:border-yellow-500 transition duration-300"
                required
              />
            </div>
          </div>

          <div className="mt-6 flex justify-center">
            {/* Botón: Usaremos 'accent-block' para el color de fondo y texto */}
            {/* Como ACCENT_GOLD es un color de marca, lo sobrescribimos con style para el fondo */}
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-2xl px-6 py-3 text-sm font-bold uppercase tracking-wide shadow-lg transition hover:bg-yellow-600 text-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
              // Usamos style para el color de marca, y hover:bg-yellow-600 para el efecto de hover
              style={{ 
                backgroundColor: ACCENT_GOLD, 
              }}
            >
              Enviar mensaje
            </button>
          </div>
        </form>
      </div>
    </section>
  )
}