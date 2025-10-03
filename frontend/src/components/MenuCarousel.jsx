import React, { useMemo, useState } from 'react'
import imgRes from '../assets/otros3.jpg'
import imgCerdo from '../assets/otros4.jpg'
import imgPollo from '../assets/otros5.jpg'
import imgCordero from '../assets/otros6.jpg'
import imgOtros from '../assets/relleno7.jpg'

const CATEGORIES = ['TODOS', 'RES', 'CERDO', 'POLLO', 'CORDERO', 'OTROS']

const PRODUCTS = [
  { id: 1, title: 'Carne de Res', category: 'RES', img: imgRes, desc: 'Cortes seleccionados, listos para parrilla o brasa.', chips: ['Fresco', 'Corte premium'] },
  { id: 2, title: 'Costillas de Cerdo', category: 'CERDO', img: imgCerdo, desc: 'Jugosas y tiernas, perfectas para barbecue.', chips: ['Jugoso', 'BBQ'] },
  { id: 3, title: 'Pechuga de Pollo', category: 'POLLO', img: imgPollo, desc: 'Magras y versátiles, ideal para recetas ligeras.', chips: ['Alto en proteína', 'Magro'] },
  { id: 4, title: 'Pierna de Cordero', category: 'CORDERO', img: imgCordero, desc: 'Sabor intenso con textura suave, para ocasiones especiales.', chips: ['Sabor intenso', 'Hornéalo lento'] },
  { id: 5, title: 'Embutidos Artesanales', category: 'OTROS', img: imgOtros, desc: 'Selección curada de embutidos y ahumados.', chips: ['Artesanal', 'Ahumado'] },
  { id: 6, title: 'Asado de Tira', category: 'RES', img: imgRes, desc: 'Clásico para compartir, vetas que se deshacen.', chips: ['Para asar', 'Compartir'] },
  { id: 7, title: 'Bondiola de Cerdo', category: 'CERDO', img: imgCerdo, desc: 'Corte tierno, ideal para braseados largos.', chips: ['Braseado', 'Tierna'] },
]

export default function MenuCarousel() {
  const [active, setActive] = useState('TODOS')
  const accent = '#E53935'

  const list = useMemo(() => {
    const base = active === 'TODOS' ? PRODUCTS : PRODUCTS.filter(p => p.category === active)
    // Duplicate to enable seamless infinite scroll
    return [...base, ...base]
  }, [active])

  return (
    <section className="relative bg-[#FDFDFD] py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Filter bar */}
        <div className="mb-8 flex flex-wrap items-center gap-3">
          {CATEGORIES.map(cat => {
            const isActive = cat === active
            return (
              <button
                key={cat}
                onClick={() => setActive(cat)}
                className={[
                  'px-4 py-2 text-xs sm:text-sm font-bold uppercase tracking-wide rounded-xl transition',
                  isActive ? 'text-white shadow-sm' : 'text-[#E53935] ring-1 ring-[#E53935] bg-white',
                ].join(' ')}
                style={isActive ? { backgroundColor: accent } : {}}
              >
                {cat}
              </button>
            )
          })}
        </div>

        {/* Infinite carousel: 3 visible on desktop, 2 on md, 1 on small */}
        <div className="group relative overflow-hidden">
          <div
            className="flex gap-6 will-change-transform animate-[scrollX_28s_linear_infinite] group-hover:[animation-play-state:paused]"
          >
            {list.map((p, idx) => (
              <ProductCard key={`${p.id}-${idx}`} p={p} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function ProductCard({ p }) {
  return (
    <article className="min-w-[75%] sm:min-w-[55%] md:min-w-[40%] lg:min-w-[32%] xl:min-w-[28%]">
      <div className="overflow-hidden rounded-3xl bg-white shadow-lg ring-1 ring-black/5">
        <div className="aspect-[4/3] w-full overflow-hidden">
          <img src={p.img} alt={p.title} className="h-full w-full object-cover" loading="lazy" />
        </div>
        <div className="space-y-2 p-4">
          <h3 className="text-lg font-extrabold uppercase tracking-wide text-[#222222]">{p.title}</h3>
          <p className="text-sm text-[#555555]">{p.desc}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {p.chips.map((c, i) => (
              <span
                key={i}
                className="inline-flex items-center rounded-full border border-black/10 px-3 py-1 text-xs font-medium text-[#222222]"
              >
                {c}
              </span>
            ))}
          </div>
        </div>
      </div>
    </article>
  )
}
