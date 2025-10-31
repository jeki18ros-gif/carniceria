import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircleIcon, EnvelopeIcon, MapPinIcon, PhoneIcon } from '@heroicons/react/24/solid';

// 🎨 Paleta de colores de marca
const ACCENT_GOLD = '#D4AF37'; 

export default function ContactSection() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', message: '' });

  // Simula el envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    // Simula una llamada al servidor
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setForm({ name: '', email: '', message: '' });
    }, 1500);
  };

  return (
    <motion.section
      id="contacto"
      className="relative py-20 bg-gradient-to-b from-[#FFF5F0] to-[#FDFCFB] dark:from-gray-900 dark:to-gray-800"
      initial={{ y: 40, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut', type: 'tween' }}
      viewport={{ once: true, amount: 0.2 }}
    >
      <div className="mx-auto max-w-6xl px-6 lg:px-12 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        
        {/* 🧭 Información de contacto */}
        <motion.div 
          initial={{ opacity: 0, x: -40 }} 
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="space-y-6"
        >
          <h3 className="text-3xl font-extrabold uppercase tracking-tight text-gray-900 dark:text-white">
            Contáctanos
          </h3>
          <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
            Si tienes dudas, comentarios o necesitas soporte, escríbenos. Nuestro equipo estará encantado de ayudarte.
          </p>

          <div className="mt-8 space-y-4 text-gray-800 dark:text-gray-200">
            <div className="flex items-center gap-3">
              <EnvelopeIcon className="w-6 h-6 text-yellow-500" />
              <span>info@tusitio.com</span>
            </div>
            <div className="flex items-center gap-3">
              <PhoneIcon className="w-6 h-6 text-yellow-500" />
              <span>+51 999 999 999</span>
            </div>
            <div className="flex items-center gap-3">
              <MapPinIcon className="w-6 h-6 text-yellow-500" />
              <span>Lima, Perú</span>
            </div>
          </div>
        </motion.div>

        {/* 💌 Formulario */}
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="rounded-3xl backdrop-blur-xl bg-white/80 dark:bg-gray-800/70 p-8 shadow-2xl ring-1 ring-black/10 dark:ring-white/10 space-y-5"
        >
          {/* Campo Nombre */}
          <div>
            <label
              htmlFor="name"
              className="block text-xs font-bold uppercase tracking-wide text-gray-900 dark:text-gray-100 mb-2"
            >
              Tu nombre
            </label>
            <input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              placeholder="Juan Pérez"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full rounded-xl border border-black/10 bg-gray-100 dark:bg-gray-700 px-4 py-3 text-sm text-gray-900 dark:text-white outline-none focus:border-2 focus:border-yellow-500 transition duration-300"
              required
            />
          </div>

          {/* Campo Correo */}
          <div>
            <label
              htmlFor="email"
              className="block text-xs font-bold uppercase tracking-wide text-gray-900 dark:text-gray-100 mb-2"
            >
              Tu correo
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="correo@ejemplo.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full rounded-xl border border-black/10 bg-gray-100 dark:bg-gray-700 px-4 py-3 text-sm text-gray-900 dark:text-white outline-none focus:border-2 focus:border-yellow-500 transition duration-300"
              required
            />
          </div>

          {/* Campo Mensaje */}
          <div>
            <label
              htmlFor="message"
              className="block text-xs font-bold uppercase tracking-wide text-gray-900 dark:text-gray-100 mb-2"
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
              className="w-full rounded-xl border border-black/10 bg-gray-100 dark:bg-gray-700 px-4 py-3 text-sm text-gray-900 dark:text-white outline-none focus:border-2 focus:border-yellow-500 transition duration-300 resize-none"
              required
            />
          </div>

          {/* Botón */}
          <div className="pt-4 flex justify-center">
            <motion.button
              whileTap={{ scale: 0.95 }}
              type="submit"
              disabled={loading}
              className={`inline-flex items-center justify-center gap-2 rounded-2xl px-6 py-3 text-sm font-bold uppercase tracking-wide text-black shadow-lg transition hover:bg-yellow-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black ${
                loading ? 'opacity-70 cursor-not-allowed' : ''
              }`}
              style={{ backgroundColor: ACCENT_GOLD }}
            >
              {loading ? 'Enviando...' : 'Enviar mensaje'}
            </motion.button>
          </div>

          {/* Mensaje de éxito */}
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
    </motion.section>
  );
}
