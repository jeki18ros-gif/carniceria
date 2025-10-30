import React, { useState } from 'react'
import {
  FaceSmileIcon,
  FaceFrownIcon,
  UserCircleIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/solid'

//  Paleta de colores
const DORADO = '#d4af37'
const NEGRO = '#1a1a1a'
const BLANCO_SUAVE = '#fafafa'

// Reseñas simuladas iniciales
const INITIAL_REVIEWS = [
  {
    id: 1,
    title: 'ABSOLUTELY DELIGHTED!',
    stars: 5,
    body: 'La calidad y el sabor son consistentes en cada pedido. Procesos limpios y entrega puntual. Recomendado.',
    name: '— Darrell Steward',
  },
  {
    id: 2,
    title: 'TOP-NOTCH SERVICE',
    stars: 5,
    body: 'Atención impecable y cortes precisos. Excelente relación precio-calidad para compras al por mayor.',
    name: '— Leslie Alexander',
  },
  {
    id: 3,
    title: 'CONSISTENTLY GREAT',
    stars: 4,
    body: 'Siempre frescura y buen empaque. La cadena de frío y la logística hacen la diferencia.',
    name: '— Marvin McKinney',
  },
  {
    id: 4,
    title: 'RELIABLE QUALITY',
    stars: 5,
    body: 'Sabores intensos y cortes bien logrados. El servicio al cliente es rápido y resolutivo.',
    name: '— Esther Howard',
  },
]

export default function Testimonials() {
  const [reviews, setReviews] = useState(INITIAL_REVIEWS)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    body: '',
    stars: 5,
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    if (name === 'title' && value.length > 40) return
    if (name === 'body' && value.split(' ').length > 200) return
    setFormData({ ...formData, [name]: value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.title || !formData.body) return alert('Completa todos los campos.')

    const newReview = {
      id: Date.now(),
      title: formData.title,
      stars: parseInt(formData.stars),
      body: formData.body,
      name: '— Nuevo Cliente',
    }

    setReviews([newReview, ...reviews])
    setShowForm(false)
    setFormData({ title: '', body: '', stars: 5 })
  }

  return (
    <section id="resenas" className="py-20 bg-white dark:bg-gray-800">
      <section className="relative bg-[#FFF5F0] py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Título principal */}
          <h3 className="mb-12 text-center font-extrabold uppercase leading-tight tracking-tight">
            <span className="block text-xl sm:text-2xl" style={{ color: DORADO }}>
              Clientes que ya confían en
            </span>
            <span className="block text-3xl sm:text-4xl text-[#1a1a1a] dark:text-white">
              BISTORA
            </span>
          </h3>

          {/* Botón para añadir reseña */}
          <div className="text-center mb-8">
            <button
              onClick={() => setShowForm(!showForm)}
              className="px-5 py-2 rounded-xl bg-[#1a1a1a] text-white hover:bg-[#d4af37] hover:text-black transition"
            >
              {showForm ? 'Cancelar' : 'Dejar una reseña'}
            </button>
          </div>

          {/* Formulario */}
          {showForm && (
            <form
              onSubmit={handleSubmit}
              className="max-w-lg mx-auto bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-md mb-10"
            >
              <label className="block mb-2 font-semibold text-gray-700 dark:text-gray-300">
                Título (máx. 40 palabras)
              </label>
              <input
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full mb-4 p-2 rounded-md border border-gray-300 dark:border-gray-700 dark:bg-gray-800"
                placeholder="Ejemplo: Excelente servicio"
              />

              <label className="block mb-2 font-semibold text-gray-700 dark:text-gray-300">
                Contenido (máx. 200 palabras)
              </label>
              <textarea
                name="body"
                value={formData.body}
                onChange={handleChange}
                className="w-full mb-4 p-2 rounded-md border border-gray-300 dark:border-gray-700 dark:bg-gray-800"
                rows="4"
                placeholder="Describe tu experiencia..."
              />

              <label className="block mb-2 font-semibold text-gray-700 dark:text-gray-300">
                Calificación
              </label>
              <StarSelector
                value={formData.stars}
                onChange={(value) => setFormData({ ...formData, stars: value })}
              />

              <button
                type="submit"
                className="mt-4 w-full bg-[#d4af37] text-black font-bold py-2 rounded-xl hover:bg-[#b9962d] transition"
              >
                Enviar Reseña
              </button>
            </form>
          )}

          {/* Carrusel horizontal */}
          <div className="group relative overflow-hidden">
            <div className="flex gap-8 animate-[scrollX_30s_linear_infinite] group-hover:[animation-play-state:paused]">
              {[...reviews, ...reviews].map((r, i) => (
                <ReviewCard key={`${r.id}-${i}`} data={r} />
              ))}
            </div>
          </div>
        </div>
      </section>
    </section>
  )
}

// Tarjeta de reseña
function ReviewCard({ data }) {
  return (
    <article className="min-w-[85%] sm:min-w-[55%] md:min-w-[42%] lg:min-w-[30%] xl:min-w-[25%]">
      <div
        className="flex h-full flex-col justify-between rounded-2xl bg-[#f9f9f9] p-6 shadow-lg 
                   ring-1 ring-black/10 transition-all duration-300 hover:shadow-xl 
                   dark:bg-[#1a1a1a] dark:ring-[#d4af37]/20 dark:hover:ring-[#d4af37]"
      >
        <div>
          <h4 className="text-sm font-extrabold uppercase tracking-wide" style={{ color: DORADO }}>
            {data.title}
          </h4>

          <Stars count={data.stars} color={DORADO} />

          <p className="mt-3 text-base leading-relaxed text-[#222222] dark:text-gray-300 transition-colors">
            {data.body}
          </p>
        </div>

        <div className="mt-6 flex items-center gap-3">
          <AvatarEmoji stars={data.stars} />
          <span className="text-sm font-semibold" style={{ color: DORADO }}>
            {data.name}
          </span>
        </div>
      </div>
    </article>
  )
}
function AvatarEmoji({ stars }) {
  const base = 'w-10 h-10 transition-transform duration-300 hover:scale-110'
  if (stars >= 5) return <FaceSmileIcon className={`${base} text-yellow-400`} />
  if (stars >= 4) return <FaceSmileIcon className={`${base} text-amber-300`} />
  if (stars >= 3) return <UserCircleIcon className={`${base} text-gray-400`} />
  if (stars >= 2) return <FaceFrownIcon className={`${base} text-orange-400`} />
  return <ExclamationTriangleIcon className={`${base} text-red-500`} />
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
          className="h-4 w-4 transition-transform hover:scale-125"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.802 2.036a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.802-2.036a1 1 0 00-1.176 0l-2.802 2.036c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.88 8.72c-.783-.57-.38-1.81.588-1.81H6.93a1 1 0 00.951-.69l1.168-3.293z" />
        </svg>
      ))}
    </div>
  )
}

// Selector de estrellas
function StarSelector({ value, onChange }) {
  return (
    <div className="flex gap-2 mb-3">
      {Array.from({ length: 5 }).map((_, i) => {
        const filled = i < value
        return (
          <svg
            key={i}
            onClick={() => onChange(i + 1)}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill={filled ? DORADO : '#ccc'}
            className="h-6 w-6 cursor-pointer transition-transform hover:scale-110"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.802 2.036a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.802-2.036a1 1 0 00-1.176 0l-2.802 2.036c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.88 8.72c-.783-.57-.38-1.81.588-1.81H6.93a1 1 0 00.951-.69l1.168-3.293z" />
          </svg>
        )
      })}
    </div>
  )
}
