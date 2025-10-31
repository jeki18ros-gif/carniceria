import React from "react";
export default function FooterCarniceria() {
  const doradoVar = "var(--color-dorado)";

  return (
    <footer className="bg-[var(--color-oscuro)] text-white">
      <div className="mx-auto max-w-7xl px-6 py-16 grid gap-12 lg:grid-cols-4">
        <div>
          <h4
            className="text-5xl font-extrabold tracking-tight text-dorado"
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
              className="accent-block inline-flex items-center justify-center rounded-lg px-6 py-3 text-sm font-bold uppercase tracking-widest shadow-xl transition duration-300 hover:text-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
            >
              Comprar ahora
            </a>
          </div>
        </div>
        <div>
          <h5
            className="text-sm font-extrabold uppercase tracking-widest text-dorado" // Usa text-dorado
          >
            Horarios
          </h5>
          <ul className="mt-5 space-y-2 text-sm text-gray-300">
            <li>Lunes a Viernes: 8:00 - 20:00</li>
            <li>Sábado: 8:00 - 18:00</li>
            <li>Domingo: Cerrado</li>
          </ul>
        </div>
        <div>
          <h5
            className="text-sm font-extrabold uppercase tracking-widest text-dorado" // Usa text-dorado
          >
            Contacto
          </h5>
          <p className="mt-5 text-sm text-gray-300">
            Av. Las Carnes 1234, Lima, Perú
          </p>
          <p className="text-sm text-gray-300 mt-2">📞 +51 987 654 321</p>
          <p className="text-sm text-gray-300 mt-1">✉️ contacto@bistora.pe</p>
          <div className="mt-5 flex items-center gap-4">
            <SocialIcon name="Instagram" hoverColor={doradoVar} />
            <SocialIcon name="Facebook" hoverColor={doradoVar} />
            <SocialIcon name="YouTube" hoverColor={doradoVar} />
          </div>
        </div>
        <div className="flex items-center justify-center lg:justify-end">
          <MeatDoodle color={doradoVar} />
        </div>
      </div>
      <div className="h-0.5 w-full bg-[var(--color-dorado)] opacity-50" />
      <div className="mx-auto max-w-7xl px-6 py-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        <LinkColumn title="Nosotros" links={["Inicio", "Historia", "Galería"]} hoverColor={doradoVar} />
        <LinkColumn title="Clientes" links={["Pedidos", "Ofertas", "Afiliados"]} hoverColor={doradoVar} />
        <LinkColumn title="Legal" links={["Política de Privacidad", "Términos"]} hoverColor={doradoVar} />
        <LinkColumn title="Recursos" links={["Contacto", "Preguntas Frecuentes"]} hoverColor={doradoVar} />
      </div>

      <p className="mt-8 text-center text-xs text-gray-400 pb-6">
        © {new Date().getFullYear()} Carnes Bistora. Tradición, sabor y calidad.
      </p>
    </footer>
  );
}

function LinkColumn({ title, links, hoverColor }) {
  return (
    <div>
      <h6
        className="mb-3 text-sm font-extrabold uppercase tracking-widest text-dorado" 
      >
        {title}
      </h6>
      <ul className="space-y-2 text-sm">
        {links.map((l) => (
          <li key={l}>
            <a
              href="#"
              className="transition text-gray-300"
              style={{ '--tw-text-opacity': 1, '--tw-text-hover-color': hoverColor, color: 'rgb(209 213 219 / var(--tw-text-opacity))' }}
              onMouseOver={(e) => e.currentTarget.style.color = hoverColor}
              onMouseOut={(e) => e.currentTarget.style.color = 'rgb(209 213 219 / var(--tw-text-opacity))'}
            >
              {l}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

function SocialIcon({ name, hoverColor }) {
  const hoverClass = `transition hover:text-[${hoverColor}]`;

  const icons = {
    Instagram: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        className={hoverClass}
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
        className={hoverClass}
      >
        <path d="M13 14H9v-3h4V8h-4V5H9v3H5v3h4v8h4v-8h3l1-3h-4V6a2 2 0 012-2z" />
      </svg>
    ),
    YouTube: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor"
        className={hoverClass}
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
