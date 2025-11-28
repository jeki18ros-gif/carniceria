import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  CheckCircleIcon,
  EnvelopeIcon,
  MapPinIcon,
  PhoneIcon,
} from "@heroicons/react/24/solid";
import { useTranslation } from "react-i18next";
import "../styles/ContactSection.css";

export default function ContactSection() {
  const { t } = useTranslation();

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", message: "" });

const handleSubmit = async (e) => { // ¡Asegúrate de que sea asíncrona!
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    // Endpoint de la Edge Function. Usa tu URL real si lo necesitas, 
    // o un path relativo si estás en un entorno de desarrollo con proxy.
    // Usaremos la URL pública de Supabase:
    // El formato es: [SUPABASE_URL]/functions/v1/[function-name]
    const FUNCTION_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-contact-email`; 
    // (Ajusta la forma de obtener tu URL base de Supabase si no usas Vite)

    try {
        const response = await fetch(FUNCTION_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // No necesitas la clave de servicio, la Edge Function ya la tiene
            },
            body: JSON.stringify(form), // 'form' contiene name, email, message
        });

        // La función de Supabase devuelve un 200 si todo sale bien
        if (response.ok) {
            setSuccess(true);
            // Limpia el formulario
            setForm({ name: "", email: "", message: "" });
        } else {
            // Manejar errores devueltos por la Edge Function (ej: 400, 500)
            const errorData = await response.json();
            // Aquí puedes manejar y mostrar 'errorData.message' al usuario
            throw new Error(errorData.message || 'Ocurrió un error al enviar el mensaje.');
        }

    } catch (error) {
        // Manejar errores de red o errores lanzados
        console.error("Error de envío:", error);
        // Aquí podrías añadir un estado de error: setError(t('contactSection.form.error'));
    } finally {
        setLoading(false);
        // Si quieres que el mensaje de éxito desaparezca después de un tiempo:
        if (success) { setTimeout(() => setSuccess(false), 5000); } 
    }
};

  // 🎯 Datos desde i18n
  const labels = t("contactSection.form.labels", { returnObjects: true });
  const placeholders = t("contactSection.form.placeholders", { returnObjects: true });
  const buttons = t("contactSection.form.buttons", { returnObjects: true });
  const successMsg = t("contactSection.form.success");

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
          <h3>{t("contactSection.title")}</h3>
          <p>{t("contactSection.description")}</p>

          <div className="contact-info">
            <div>
              <EnvelopeIcon className="w-6 h-6" />
              <span>orders@alimentsbenito.com</span>
            </div>
            <div>
              <PhoneIcon className="w-6 h-6" />
              <span>+1 514-723-2378</span>
            </div>
            <div>
              <MapPinIcon className="w-6 h-6" />
              <span>11515 4e Avenue, Montreal, QC, Canada</span>
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
          {/* Nombre */}
          <div>
            <label htmlFor="name">{labels.name}</label>
            <input
              id="name"
              name="name"
              type="text"
              className="w-full mb-5"
              autoComplete="name"
              placeholder={placeholders.name}
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>

          {/* Correo */}
          <div>
            <label htmlFor="email">{labels.email}</label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              className="w-full mb-5"
              placeholder={placeholders.email}
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>

          {/* Mensaje */}
          <div>
            <label htmlFor="message">{labels.message}</label>
            <textarea
              id="message"
              name="message"
              rows={5}
              className="w-full mb-5"
              placeholder={placeholders.message}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              required
            />
          </div>

          {/* Botón */}
          <div className="text-center pt-4">
            <motion.button
              whileTap={{ scale: 0.95 }}
              type="submit"
              disabled={loading}
            >
              {loading ? buttons.sending : buttons.submit}
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
              <span>{successMsg}</span>
            </motion.div>
          )}
        </motion.form>
      </div>
    </motion.section>
  );
}
