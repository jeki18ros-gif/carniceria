import React from 'react';
import { motion } from 'framer-motion';
import '../styles/FeaturesGrid.css'; // 👈 Importa el nuevo CSS

const GOLD_COLOR = '#F0B100';

export default function FeaturesGrid() {
  return (
    <motion.section
      id="nosotros"
      className="features-section py-20 transition-colors duration-700"
      initial={{ y: 40, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut', type: 'tween' }}
      viewport={{ once: true, amount: 0.2 }}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center mt-15">
        <h3 className="text-3xl sm:text-6xl font-extrabold mb-12 uppercase tracking-wide">
          Nuestros Valores
        </h3>

        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          <Feature
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                className="h-12 w-12"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 6v12m6-6H6"
                />
              </svg>
            }
            title="CALIDAD GARANTIZADA"
            desc="Seleccionamos y supervisamos cada lote para garantizar frescura y trazabilidad desde origen."
          />

          <Feature
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                className="h-12 w-12"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 3l18 18M4.5 19.5h15M8.25 3h7.5"
                />
              </svg>
            }
            title="PROCESOS LIMPIOS"
            desc="Cumplimos protocolos sanitarios y de seguridad alimentaria en cada etapa de producción."
          />

          <Feature
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                className="h-12 w-12"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 3v18m9-9H3"
                />
              </svg>
            }
            title="LOGÍSTICA EFICIENTE"
            desc="Entregas puntuales y flexibles, con cadena de frío controlada para mantener el sabor."
          />
        </div>
      </div>

      {/* Cinta inferior dorada animada */}
<div className="relative mt-40">
  <div className="absolute inset-x-0 z-10 promo-banner py-8">
    <div className="scrolling-text-wrapper">
      {/* Primera tanda */}
      <div className="scrolling-text">
        {Array.from({ length: 12 }).map((_, i) => (
          <span key={`a-${i}`}>★ ENTREGA A DOMICILIO DISPONIBLE ★</span>
        ))}
      </div>
    </div>
  </div>
</div>

    </motion.section>
  );
}

function Feature({ icon, title, desc }) {
  return (
    <div className="feature-card rounded-xl p-10 text-center shadow-xl ring-3 ring-black/2 transition duration-500 ease-in-out hover:ring-yellow-400 transform hover:-translate-y-1">
      <div className="mb-4 flex justify-center">{icon}</div>
      <h4 className="mb-3 text-xl font-bold uppercase">{title}</h4>
      <p className="text-base">{desc}</p>
    </div>
  );
}
