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
  { id: 1, title: 'ABSOLUTELY DELIGHTED!', stars: 5, body: 'La calidad y el sabor...', name: 'Darrell Steward' },
  { id: 2, title: 'TOP-NOTCH SERVICE', stars: 5, body: 'Atención impecable...', name: 'Leslie Alexander' },
  { id: 3, title: 'CONSISTENTLY GREAT', stars: 4, body: 'Siempre frescura...', name: 'Marvin McKinney' },
]

export default function Testimonials() {
  const [reviews, setReviews] = useState(INITIAL_REVIEWS)
  const [showForm, setShowForm] = useState(false)

  const handleAddReview = (newReview) => {
    const review = { id: Date.now(), ...newReview }
    setReviews([review, ...reviews])
    setShowForm(false)
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

          {showForm && (
            <FormComent
              isOpen={showForm}
              onClose={() => setShowForm(false)}
              onSubmit={handleAddReview}
            />
          )}
          <div className="group relative overflow-hidden">
            <div className="flex gap-8 animate-[scrollX_30s_linear_infinite] group-hover:[animation-play-state:paused]">
              {[...reviews, ...reviews].map((r, i) => (
                <ComentCard key={`${r.id}-${i}`} data={r} />
              ))}
            </div>
          </div>
        </div>
      </section>
    </motion.section>
  )
}