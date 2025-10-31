import React, { useState } from 'react'
import FormComent from './FormComent'
import ComentCard from './ComentCard'

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
    <section className="light-block py-20"> 
      <section className="relative light-block py-20"> 
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h3 className="mb-12 text-center font-extrabold uppercase leading-tight">
            <span className="block text-xl sm:text-2xl text-dorado">
              Clientes que ya confían en
            </span>
            {/* Reemplaza text-[#1a1a1a] dark:text-white con la clase de texto adaptable de la sección: text-black / text-white */}
            <span className="block text-3xl sm:text-4xl text-black dark:text-white">BISTORA</span>
          </h3>

          <div className="text-center mb-8">
            <button
              onClick={() => setShowForm(!showForm)}
              className="px-5 py-2 rounded-xl btn-alt transition"
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
    </section>
  )
}