import React, { useState } from 'react'
import { motion } from 'framer-motion'
import FormComent from './FormComent'
import ReviewCard from './ReviewCard' 
import '../styles/Testimonials.css'

// 🌟 Reseñas iniciales
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

  const handleAddReview = (newReview) => {
    setReviews([newReview, ...reviews])
    setShowForm(false) 
  }

  return (
    <motion.section
      id="resenas"
      className="testimonials transition-colors duration-700 isolated-theme" 
      initial={{ y: 40, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut', type: 'tween' }}
      viewport={{ once: true, amount: 0.2 }}
    >

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-15">

        {/* 🏷️ Título (Se mantiene bien usando las clases globales/Tailwind) */}
        <h3 className="testimonials-title">
  <span className="title-small">Clientes que ya confían en</span>
  <span className="title-big">NUESTRO SERVICIO</span>
</h3>

<div className="text-center mb-8">
  <button
    onClick={() => setShowForm(true)}
    className="testimonials-button"
  >
    Dejar una reseña
  </button>
</div>
        {/* 💬 Modal */}
        {showForm && (
          <FormComent
            isOpen={showForm}
            onSubmit={handleAddReview}
            onClose={() => setShowForm(false)}
          />
        )}

        {/* 🎞️ Carrusel */}
       <div className="carousel-container">
  <div className="carousel-track">
    {[...reviews, ...reviews].map((r, i) => (
      <ReviewCard key={`${r.id}-${i}`} data={r} />
    ))}
  </div>
</div>
      </div>
    </motion.section>
  )
}