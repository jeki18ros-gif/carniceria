import React from 'react'
import p1 from '../assets/relleno3.jpg'
import p2 from '../assets/relleno4.jpg'
import p3 from '../assets/relleno5.jpg'
import p4 from '../assets/relleno6.jpg'

const ACCENT_DARK = '#7A2E2A' // borgoña/marrón rojizo oscuro
const ACCENT_RED = '#E53935' // rojo brillante para títulos/estrellas

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
      'Atención impecable y cortes impecables. Excelente relación precio-calidad para compras al por mayor.',
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
    <section className="relative bg-[#FDFDFD] py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h3 className="mb-6 text-center text-2xl font-extrabold uppercase leading-tight tracking-tight text-[#3a221c] sm:text-3xl">
          <span className="block" style={{ color: ACCENT_DARK }}>GOOD FOLKS THAT</span>
          <span className="block" style={{ color: ACCENT_DARK }}>ALREADY LOVE BISTORA</span>
        </h3>

        {/* Horizontal grid / simulated carousel */}
        <div className="group relative overflow-hidden">
          <div className="flex gap-6 will-change-transform animate-[scrollX_32s_linear_infinite] group-hover:[animation-play-state:paused]">
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
    <article className="min-w-[80%] sm:min-w-[55%] md:min-w-[42%] lg:min-w-[32%] xl:min-w-[28%]">
      <div className="flex h-full flex-col justify-between rounded-2xl bg-[#FAFAFA] p-5 shadow-md ring-1 ring-black/5">
        <div>
          <h4 className="text-sm font-extrabold uppercase tracking-wide" style={{ color: ACCENT_RED }}>
            {data.title}
          </h4>
          <Stars count={data.stars} color={ACCENT_RED} />
          <p className="mt-2 text-sm leading-relaxed text-[#222222]">
            {data.body}
          </p>
        </div>

        <div className="mt-5 flex flex-col items-center">
          <div className="h-14 w-14 overflow-hidden rounded-full border border-black/20">
            <img src={data.avatar} alt={data.name} className="h-full w-full object-cover" loading="lazy" />
          </div>
          <span className="mt-2 text-xs font-semibold" style={{ color: ACCENT_RED }}>{data.name}</span>
        </div>
      </div>
    </article>
  )
}

function Stars({ count = 5, color = ACCENT_RED }) {
  return (
    <div className="mt-2 flex items-center gap-1">
      {Array.from({ length: count }).map((_, i) => (
        <svg key={i} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill={color} className="h-4 w-4">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.802 2.036a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.802-2.036a1 1 0 00-1.176 0l-2.802 2.036c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.88 8.72c-.783-.57-.38-1.81.588-1.81H6.93a1 1 0 00.951-.69l1.168-3.293z" />
        </svg>
      ))}
    </div>
  )
}
