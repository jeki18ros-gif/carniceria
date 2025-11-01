import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {
  CheckCircleIcon,
  EnvelopeIcon,
  MapPinIcon,
  PhoneIcon,
} from '@heroicons/react/24/solid'
const ACCENT_GOLD = '#D4AF37'

export default function ContactSection() {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', message: '' })

  const handleSubmit = (e) => {
    e.preventDefault()
    setLoading(true)
    setSuccess(false)

    setTimeout(() => {
      setLoading(false)
      setSuccess(true)
      setForm({ name: '', email: '', message: '' })
    }, 1500)
  }

  return (
<<<<<<< HEAD
    <section id="contacto" className="light-block py-20 transition-colors duration-300">
=======
    <motion.section
      id="contacto"
      className="relative py-20 bg-gradient-to-b from-[#FFF5F0] to-[#FDFCFB] dark:from-gray-900 dark:to-gray-800"
      initial={{ y: 40, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut', type: 'tween' }}
      viewport={{ once: true, amount: 0.2 }}
    >
>>>>>>> 01237090e53e7608a34e2923bb70ee44b90235e4
      <div className="mx-auto max-w-6xl px-6 lg:px-12 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="space-y-6"
        >
          <h3 className="text-3xl font-extrabold uppercase tracking-tight">
            <span className="text-[var(--color-dorado)]">Contáctanos</span>
          </h3>

          <p className="text-base opacity-90 leading-relaxed">
            Si tienes dudas, comentarios o necesitas soporte, escríbenos. Nuestro equipo estará encantado de ayudarte.
          </p>

          <div className="mt-8 space-y-4">
            <div className="flex items-center gap-3">
              <EnvelopeIcon className="w-6 h-6 text-[var(--color-dorado)]" />
              <span>info@tusitio.com</span>
            </div>
            <div className="flex items-center gap-3">
              <PhoneIcon className="w-6 h-6 text-[var(--color-dorado)]" />
              <span>+51 999 999 999</span>
            </div>
            <div className="flex items-center gap-3">
              <MapPinIcon className="w-6 h-6 text-[var(--color-dorado)]" />
              <span>Lima, Perú</span>
            </div>
          </div>
        </motion.div>
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="medium-block rounded-3xl backdrop-blur-xl p-8 shadow-2xl ring-1 ring-black/10 dark:ring-white/10 space-y-5"
        >
          <div>
            <label
              htmlFor="name"
              className="block text-xs font-bold uppercase tracking-wide mb-2"
            >
              Tu nombre
            </label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="Juan Pérez"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full rounded-xl border border-black/10 bg-gray-100 dark:bg-gray-700 px-4 py-3 text-sm outline-none focus:border-2 focus:border-yellow-500 transition duration-300"
              required
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-xs font-bold uppercase tracking-wide mb-2"
            >
              Tu correo
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="correo@ejemplo.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full rounded-xl border border-black/10 bg-gray-100 dark:bg-gray-700 px-4 py-3 text-sm outline-none focus:border-2 focus:border-yellow-500 transition duration-300"
              required
            />
          </div>
          <div>
            <label
              htmlFor="message"
              className="block text-xs font-bold uppercase tracking-wide mb-2"
            >
              Tu mensaje
            </label>
            <textarea
              id="message"
              name="message"
              rows={5}
              placeholder="Escribe tu consulta..."
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              className="w-full rounded-xl border border-black/10 bg-gray-100 dark:bg-gray-700 px-4 py-3 text-sm outline-none focus:border-2 focus:border-yellow-500 transition duration-300 resize-none"
              required
            />
          </div>
          <div className="pt-4 flex justify-center">
            <motion.button
              whileTap={{ scale: 0.95 }}
              type="submit"
              disabled={loading}
              className={`accent-block inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-bold uppercase tracking-wide ${
                loading ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {loading ? 'Enviando...' : 'Enviar mensaje'}
            </motion.button>
          </div>
          {success && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-center gap-2 mt-4 text-green-600 dark:text-green-400 text-sm font-semibold"
            >
              <CheckCircleIcon className="w-5 h-5" />
              <span>Mensaje enviado correctamente. ¡Gracias por contactarnos!</span>
            </motion.div>
          )}
        </motion.form>
      </div>
<<<<<<< HEAD
    </section>
  )
=======
    </motion.section>
  );
>>>>>>> 01237090e53e7608a34e2923bb70ee44b90235e4
}
