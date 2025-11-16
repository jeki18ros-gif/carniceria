import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import "../styles/FeaturesGrid.css";

export default function FeaturesGrid() {
  const { t } = useTranslation();
  const data = t("featuresGrid", { returnObjects: true }) || {}; 

  // Convertimos el objeto de features a un array para mapear fácilmente
  const FEATURES = useMemo(() => {
    // ✅ CORRECCIÓN 2: Aseguramos que 'data.features' sea un objeto, si es undefined.
    // Usamos el encadenamiento opcional (?) y luego un fallback || {}
    const featuresObject = data.features || {}; 

    // Object.entries() ahora recibe un objeto seguro (vacío o lleno)
    return Object.entries(featuresObject).map(([key, value]) => ({
      id: key,
      // Usamos el encadenamiento opcional para proteger las propiedades anidadas
      title: value?.title, 
      description: value?.description,
      icon: getIcon(key),
    }));
  }, [data]);
return (
    <motion.section
      id="nosotros"
      className="features-section py-20 transition-colors duration-700"
      initial={{ y: 40, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut", type: "tween" }}
      viewport={{ once: true, amount: 0.2 }}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center mt-15">
        {/* Título principal: Usamos encadenamiento opcional para proteger 'data' aquí también */}
        <h3 className="text-3xl sm:text-6xl font-extrabold mb-12 uppercase tracking-wide">
          {data.title}
        </h3>

        {/* Cuadrícula de valores */}
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {/* ✅ Aseguramos que FEATURES sea un array (aunque useMemo ya lo hace, es extra seguro) */}
          {(FEATURES || []).map((f) => ( 
            <Feature key={f.id} icon={f.icon} title={f.title} desc={f.description} />
          ))}
        </div>
      </div>

      {/* Cinta inferior animada */}
      <div className="relative mt-40">
        <div className="absolute inset-x-0 z-10 promo-banner py-8">
          <div className="scrolling-text-wrapper">
            <div className="scrolling-text">
              {Array.from({ length: 12 }).map((_, i) => (
                // Usamos encadenamiento opcional para proteger 'data' aquí también
                <span key={i}>{data.banner_delivery}</span> 
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}

/* 🟡 Componente individual */
function Feature({ icon, title, desc }) {
  return (
    <div className="feature-card rounded-xl p-10 text-center shadow-xl ring-3 ring-black/2 transition duration-500 ease-in-out hover:ring-yellow-400 transform hover:-translate-y-1">
      <div className="mb-4 flex justify-center">{icon}</div>
      <h4 className="mb-3 text-xl font-bold uppercase">{title}</h4>
      <p className="text-base">{desc}</p>
    </div>
  );
}

/* 🧠 Iconos según la clave del JSON */
function getIcon(key) {
  switch (key) {
    case "calidad":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="h-12 w-12 text-[#003770]"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9.75 12l1.5 1.5 3.75-3.75"
          />
        </svg>
      );
    case "procesos":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="h-12 w-12 text-[#003770]"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 2.25c-3.5 4.5-6.75 8.25-6.75 12A6.75 6.75 0 0012 21a6.75 6.75 0 006.75-6.75c0-3.75-3.25-7.5-6.75-12z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9.75 13.5a2.25 2.25 0 104.5 0"
          />
        </svg>
      );
    case "logistica":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="h-12 w-12 text-[#003770]"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 7.5v9a1.5 1.5 0 001.5 1.5h1.125a2.625 2.625 0 005.25 0h3.75a2.625 2.625 0 005.25 0H21a1.5 1.5 0 001.5-1.5V12a1.5 1.5 0 00-.375-1L19.5 7.5H3z"
          />
          <circle cx="7.5" cy="18" r="1.5" />
          <circle cx="17.25" cy="18" r="1.5" />
        </svg>
      );
    default:
      return null;
  }
}
