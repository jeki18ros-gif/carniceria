import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  CheckCircleIcon,
  EnvelopeIcon,
  MapPinIcon,
  PhoneIcon,
} from "@heroicons/react/24/solid";
import "../styles/ContactSection.css"; // asegúrate de importar tu CSS externo

export default function ContactSection() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setForm({ name: "", email: "", message: "" });
    }, 1500);
  };

  return (
    <motion.section
      id="contacto"
      className="contact-section"
      initial={{ y: 40, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut", type: "tween" }}
      viewport={{ once: true, amount: 0.2 }}
    >
      <div className="contact-container">
        {/* 🧭 Información de contacto */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h3>Contáctanos</h3>
          <p>
            Si tienes dudas, comentarios o necesitas soporte, escríbenos. Nuestro equipo estará encantado de ayudarte.
          </p>

          <div className="contact-info">
            <div>
              <EnvelopeIcon className="w-6 h-6" />
              <span>info@tusitio.com</span>
            </div>
            <div>
              <PhoneIcon className="w-6 h-6" />
              <span>+51 999 999 999</span>
            </div>
            <div>
              <MapPinIcon className="w-6 h-6" />
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
          className="contact-form"
        >
          {/* Campo Nombre */}
          <div>
            <label htmlFor="name">Tu nombre</label>
            <input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              placeholder="Juan Pérez"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>

          {/* Campo Correo */}
          <div>
            <label htmlFor="email">Tu correo</label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="correo@ejemplo.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>

          {/* Campo Mensaje */}
          <div>
            <label htmlFor="message">Tu mensaje</label>
            <textarea
              id="message"
              name="message"
              rows={5}
              placeholder="Escribe tu consulta..."
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              required
            />
          </div>

          {/* Botón */}
          <div style={{ textAlign: "center", paddingTop: "1rem" }}>
            <motion.button
              whileTap={{ scale: 0.95 }}
              type="submit"
              disabled={loading}
            >
              {loading ? "Enviando..." : "Enviar mensaje"}
            </motion.button>
          </div>

          {/* Mensaje de éxito */}
          {success && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="success-message"
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
