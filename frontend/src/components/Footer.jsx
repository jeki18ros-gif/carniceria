import React from "react";
import { motion } from "framer-motion";

// Color dorado de marca
const GOLD_COLOR = "#d4af37";

export default function FooterCarniceria() {
  return (
    // CONTENEDOR AÑADIDO:
    // Este div con 'overflow-hidden' evitará que la animación 'y: 40'
    // cree un desbordamiento de página y genere el segundo scrollbar.
    <div className="overflow-hidden w-full">
      <motion.footer
        className="bg-neutral-900 text-white"
        initial={{ y: 40, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut", type: "tween" }}
        viewport={{ once: true, amount: 0.2 }}
      >
        {/* Sección superior */}
        <div className="mx-auto max-w-7xl px-6 py-16 grid gap-12 lg:grid-cols-4">
          {/* Marca */}
          <div>
            <h4
              className="text-5xl font-extrabold tracking-tight"
              style={{ color: GOLD_COLOR }}
            >
              CARNES BISTORA
            </h4>
            <p className="mt-4 max-w-sm text-gray-300">
              Carnes seleccionadas de primera calidad, con el sabor y frescura que
              tu mesa merece.
            </p>
            <div className="mt-6">
              <a
                href="#comprar"
                className="inline-flex items-center justify-center rounded-lg px-6 py-3 text-sm font-bold uppercase tracking-widest text-black shadow-xl transition duration-300 hover:bg-white hover:text-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
                style={{ backgroundColor: GOLD_COLOR }}
              >
                Comprar ahora
              </a>
            </div>
          </div>

          {/* Horarios */}
          <div>
            <h5
              className="text-sm font-extrabold uppercase tracking-widest"
              style={{ color: GOLD_COLOR }}
            >
              Horarios
            </h5>
            <ul className="mt-5 space-y-2 text-sm text-gray-300">
              <li>Lunes a Viernes: 8:00 - 20:00</li>
              <li>Sábado: 8:00 - 18:00</li>
              <li>Domingo: Cerrado</li>
            </ul>
          </div>

          {/* Contacto */}
          <div>
            <h5
              className="text-sm font-extrabold uppercase tracking-widest"
              style={{ color: GOLD_COLOR }}
            >
              Contacto
            </h5>
            <p className="mt-5 text-sm text-gray-300">
              Av. Las Carnes 1234, Lima, Perú
            </p>
            <p className="text-sm text-gray-300 mt-2">📞 +51 987 654 321</p>
            <p className="text-sm text-gray-300 mt-1">✉️ contacto@bistora.pe</p>
            <div className="mt-5 flex items-center gap-4">
              <SocialIcon name="Instagram" />
              <SocialIcon name="Facebook" />
              <SocialIcon name="YouTube" />
            </div>
          </div>

          {/* Ilustración temática */}
          <div className="flex items-center justify-center lg:justify-end">
            <MeatDoodle color={GOLD_COLOR} />
          </div>
        </div>

        {/* Separador */}
        <div className="h-0.5 w-full" style={{ backgroundColor: `${GOLD_COLOR}80` }} />

        {/* Enlaces inferiores */}
        <div className="mx-auto max-w-7xl px-6 py-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <LinkColumn title="Nosotros" links={["Inicio", "Historia", "Galería"]} />
          <LinkColumn title="Clientes" links={["Pedidos", "Ofertas", "Afiliados"]} />
          <LinkColumn title="Legal" links={["Política de Privacidad", "Términos"]} />
          <LinkColumn title="Recursos" links={["Contacto", "Preguntas Frecuentes"]} />
        </div>

        <p className="mt-8 text-center text-xs text-gray-400 pb-6">
          © {new Date().getFullYear()} Carnes Bistora. Tradición, sabor y calidad.
        </p>
      </motion.footer>
    </div>
  );
}

function LinkColumn({ title, links }) {
  return (
    <div>
      <h6
        className="mb-3 text-sm font-extrabold uppercase tracking-widest"
        style={{ color: GOLD_COLOR }}
      >
        {title}
      </h6>
      <ul className="space-y-2 text-sm">
        {links.map((l) => (
          <li key={l}>
            <a
              href="#"
              className="transition text-gray-300 hover:text-[#d4af37]"
            >
              {l}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

function SocialIcon({ name }) {
  const icons = {
    Instagram: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        className="h-6 w-6 transition hover:text-[#d4af37]"
        viewBox="0 0 24 24"
      >
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <path d="M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        <path d="M18.5 5.5h.01" />
      </svg>
    ),
    Facebook: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor"
        className="h-6 w-6 transition hover:text-[#d4af37]"
        viewBox="0 0 24 24"
      >
        <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3V2z" />
      </svg>
    ),
    YouTube: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor"
        className="h-6 w-6 transition hover:text-[#d4af37]"
        viewBox="0 0 24 24"
      >
        <path d="M19.615 3.161C18.683 2.502 16.715 2 12 2S5.317 2.502 4.385 3.161A4.852 4.852 0 002 6.5v11C2 20.311 3.689 22 5.5 22h13c1.811 0 3.5-1.689 3.5-3.5v-11a4.852 4.852 0 00-2.385-3.339zM10 15V9l5 3-5 3z" />
      </svg>
    ),
  };

  return <a href="#">{icons[name]}</a>;
}

function MeatDoodle({ color }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 180 120"
      fill="none"
      stroke={color}
      strokeWidth="3"
      className="h-28 w-auto"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* Tabla */}
      <path d="M10 90h160" />
      {/* Filete */}
      <ellipse cx="90" cy="70" rx="45" ry="20" fill="none" />
      <path d="M45 70c5-15 85-15 90 0" />
      {/* Cuchillo */}
      <path d="M30 45l30-10 15 15-30 10z" fill="none" />
      <path d="M60 35l10-10" />
      {/* Humo o aroma */}
      <path d="M115 45c5-5 0-10 5-15s5-10 0-15" />
      <path d="M125 45c5-5 0-10 5-15s5-10 0-15" />
    </svg>
  );
}
