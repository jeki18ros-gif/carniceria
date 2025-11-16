import React from 'react'
import { ExclamationTriangleIcon } from '@heroicons/react/24/solid'
import { Smile, Frown, Meh, Laugh, Angry, User as UserIcon } from "lucide-react"
import '../styles/ReviewCard.css' 
const LucideIconMap = { Angry, Frown, Meh, Smile, Laugh, Default: UserIcon }
function Stars({ count = 5 }) {
  return (
    <div className="mt-2 flex items-center gap-1">
      {Array.from({ length: count }).map((_, i) => (
        <svg
          key={i}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          // La clase 'fill' ahora se aplicará desde el CSS, pero mantenemos clases de Tailwind para efectos.
          className="h-4 w-4 transition-transform hover:scale-125 fill-[#d4af37] dark:fill-yellow-400"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.802 2.036a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.802-2.036a1 1 0 00-1.176 0l-2.802 2.036c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.88 8.72c-.783-.57-.38-1.81.588-1.81H6.93a1 1 0 00.951-.69l1.168-3.293z" />
        </svg>
      ))}
    </div>
  )
}
function AvatarEmoji({ stars }) {
  const base = 'w-10 h-10 transition-transform duration-300 hover:scale-110'
  let IconComponent
  let colorClass

  switch (stars) {
    case 5:
      IconComponent = LucideIconMap.Laugh
      colorClass = 'text-green-500'
      break
    case 4:
      IconComponent = LucideIconMap.Smile
      colorClass = 'text-green-400'
      break
    case 3:
      IconComponent = LucideIconMap.Meh
      colorClass = 'text-yellow-500'
      break
    case 2:
      IconComponent = LucideIconMap.Frown
      colorClass = 'text-orange-500'
      break
    case 1:
      IconComponent = LucideIconMap.Angry
      colorClass = 'text-red-500'
      break
    default:
      IconComponent = LucideIconMap.Default
      colorClass = 'text-gray-400'
  }

  return IconComponent
    ? <IconComponent className={`${base} ${colorClass}`} />
    : <ExclamationTriangleIcon className={`${base} text-gray-400`} />
}
export default function ReviewCard({ data }) {
  return (
    <article className="review-card">
      <div>
        <h4>{data.title}</h4> 
        <div className="stars">
          <Stars count={data.stars} />
        </div>
        {/* Aquí la clave es permitir que el párrafo use todo el espacio disponible */}
        <p className="review-body-text">{data.body}</p> 
      </div>

      <div className="review-footer">
        <AvatarEmoji stars={data.stars} />
        <span className="review-name">{data.name}</span>
      </div>
    </article>
  )
}