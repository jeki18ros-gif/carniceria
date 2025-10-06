import React from 'react'
import p1 from '../assets/relleno3.jpg'
import p2 from '../assets/relleno4.jpg'
import p3 from '../assets/relleno5.jpg'
import p4 from '../assets/relleno6.jpg'

// 🎨 Paleta de colores
const DORADO = '#d4af37'
const NEGRO = '#1a1a1a'
const BLANCO_SUAVE = '#fafafa'

// 🗣️ Reseñas simuladas
const REVIEWS = [
  {
    id: 1,
    title: 'ABSOLUTELY DELIGHTED!',
    stars: 5,
    body:
      'La calidad y el sabor son consistentes en cada pedido. Procesos limpios y entrega puntual. Recomendado.',
    name: '— Darrell Steward',
    avatar: p1,
  },
  {
    id: 2,
    title: 'TOP-NOTCH SERVICE',
    stars: 5,
    body:
      'Atención impecable y cortes precisos. Excelente relación precio-calidad para compras al por mayor.',
    name: '— Leslie Alexander',
    avatar: p2,
  },
  {
    id: 3,
    title: 'CONSISTENTLY GREAT',
    stars: 5,
    body:
      'Siempre frescura y buen empaque. La cadena de frío y la logística hacen la diferencia.',
    name: '— Marvin McKinney',
    avatar: p3,
  },
  {
    id: 4,
    title: 'RELIABLE QUALITY',
    stars: 5,
    body:
      'Sabores intensos y cortes bien logrados. El servicio al cliente es rápido y resolutivo.',
    name: '— Esther Howard',
    avatar: p4,
  },
]

export default function Testimonials() {
  return (
    <section className="relative bg-white dark:bg-[#111111] py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* 🌟 Título principal */}
        <h3 className="mb-12 text-center font-extrabold uppercase leading-tight tracking-tight">
          <span className="block text-xl sm:text-2xl" style={{ color: DORADO }}>
            Clientes que ya confían en
          </span>
          <span className="block text-3xl sm:text-4xl text-[#1a1a1a] dark:text-white">
            BISTORA
          </span>
        </h3>

        {/* 🎞️ Carrusel horizontal infinito */}
        <div className="group relative overflow-hidden">
          <div className="flex gap-8 animate-[scrollX_30s_linear_infinite] group-hover:[animation-play-state:paused]">
            {[...REVIEWS, ...REVIEWS].map((r, i) => (
              <ReviewCard key={`${r.id}-${i}`} data={r} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function ReviewCard({ data }) {
  return (
    <article className="min-w-[85%] sm:min-w-[55%] md:min-w-[42%] lg:min-w-[30%] xl:min-w-[25%]">
      <div
        className="flex h-full flex-col justify-between rounded-2xl bg-[#f9f9f9] p-6 shadow-lg 
                   ring-1 ring-black/10 transition-all duration-300 hover:shadow-xl 
                   dark:bg-[#1a1a1a] dark:ring-[#d4af37]/20 dark:hover:ring-[#d4af37]"
      >
        <div>
          {/* 🏅 Título */}
          <h4
            className="text-sm font-extrabold uppercase tracking-wide"
            style={{ color: DORADO }}
          >
            {data.title}
          </h4>

          {/* ⭐ Estrellas */}
          <Stars count={data.stars} color={DORADO} />

          {/* 📝 Cuerpo */}
          <p className="mt-3 text-base leading-relaxed text-[#222222] dark:text-gray-300 transition-colors">
            {data.body}
          </p>
        </div>

        {/* 👤 Autor */}
        <div className="mt-6 flex items-center gap-3">
          <div className="h-12 w-12 overflow-hidden rounded-full ring-2 ring-white shadow-md dark:ring-[#d4af37]/70">
            <img
              src={data.avatar}
              alt={data.name}
              className="h-full w-full object-cover"
              loading="lazy"
            />
          </div>
          <span className="text-sm font-semibold" style={{ color: DORADO }}>
            {data.name}
          </span>
        </div>
      </div>
    </article>
  )
}

function Stars({ count = 5, color = DORADO }) {
  return (
    <div className="mt-2 flex items-center gap-1">
      {Array.from({ length: count }).map((_, i) => (
        <svg
          key={i}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill={color}
          className="h-4 w-4"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.802 2.036a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.802-2.036a1 1 0 00-1.176 0l-2.802 2.036c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.88 8.72c-.783-.57-.38-1.81.588-1.81H6.93a1 1 0 00.951-.69l1.168-3.293z" />
        </svg>
      ))}
    </div>
  )
}
