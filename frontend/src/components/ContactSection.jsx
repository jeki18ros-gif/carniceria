import React from 'react'

const ACCENT_DARK = '#7A2E2A' // borgoña / marrón rojizo oscuro
const ACCENT_RED = '#E53935'  // rojo brillante secundario

export default function ContactSection() {
  return (
    <section className="relative bg-[#FDFDFD] py-16">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <h3 className="mb-6 text-center text-3xl font-extrabold uppercase tracking-tight" style={{ color: ACCENT_DARK }}>
          Contáctanos
        </h3>
        <p className="mb-8 text-center text-sm text-[#555555]">
          Envíanos tu consulta y te responderemos a la brevedad.
        </p>

        <form onSubmit={(e) => e.preventDefault()} className="rounded-3xl bg-white p-6 shadow-xl ring-1 ring-black/5 sm:p-8">
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="sm:col-span-1">
              <label htmlFor="name" className="mb-2 block text-xs font-bold uppercase tracking-wide" style={{ color: ACCENT_DARK }}>
                Tu nombre
              </label>
              <input
                id="name"
                name="name"
                type="text"
                placeholder="Juan Pérez"
                className="w-full rounded-xl border border-black/10 bg-[#FAFAFA] px-4 py-3 text-sm text-[#222222] outline-none ring-0 focus:border-[#E53935]"
                required
              />
            </div>

            <div className="sm:col-span-1">
              <label htmlFor="email" className="mb-2 block text-xs font-bold uppercase tracking-wide" style={{ color: ACCENT_DARK }}>
                Tu correo
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="correo@ejemplo.com"
                className="w-full rounded-xl border border-black/10 bg-[#FAFAFA] px-4 py-3 text-sm text-[#222222] outline-none ring-0 focus:border-[#E53935]"
                required
              />
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="message" className="mb-2 block text-xs font-bold uppercase tracking-wide" style={{ color: ACCENT_DARK }}>
                Tu mensaje
              </label>
              <textarea
                id="message"
                name="message"
                rows={5}
                placeholder="Escribe tu consulta..."
                className="w-full rounded-xl border border-black/10 bg-[#FAFAFA] px-4 py-3 text-sm text-[#222222] outline-none ring-0 focus:border-[#E53935]"
                required
              />
            </div>
          </div>

          <div className="mt-6 flex justify-center">
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-2xl bg-[#E53935] px-6 py-3 text-sm font-bold uppercase tracking-wide text-white shadow-lg transition hover:bg-[#c62828] focus-visible:outline-2 focus-visible:outline-white/70 focus-visible:outline-offset-2"
            >
              Enviar mensaje
            </button>
          </div>
        </form>
      </div>
    </section>
  )
}
