// src/components/testimonials/ComentCard.jsx
import React from 'react'
import {
  FaceSmileIcon,
  FaceFrownIcon,
  UserCircleIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/solid'

const DORADO = '#d4af37'

export default function ComentCard({ data }) {
  return (
    <article className="min-w-[85%] sm:min-w-[55%] md:min-w-[42%] lg:min-w-[30%] xl:min-w-[25%]">
      <div className="flex h-full flex-col justify-between rounded-2xl bg-[#f9f9f9] p-6 shadow-lg ring-1 ring-black/10 transition-all duration-300 hover:shadow-xl dark:bg-[#1a1a1a] dark:ring-[#d4af37]/20 dark:hover:ring-[#d4af37]">
        <div>
          <h4 className="text-sm font-extrabold uppercase tracking-wide" style={{ color: DORADO }}>
            {data.title}
          </h4>
          <Stars count={data.stars} />
          <p className="mt-3 text-base leading-relaxed text-[#222222] dark:text-gray-300 line-clamp-4">
            {data.body}
          </p>
        </div>

        <div className="mt-6 flex items-center gap-3">
          <AvatarEmoji stars={data.stars} />
          <span className="text-sm font-semibold" style={{ color: DORADO }}>
            — {data.name}
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

function Stars({ count }) {
  return (
    <div className="mt-2 flex items-center gap-1">
      {Array.from({ length: count }).map((_, i) => (
        <svg
          key={i}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill={DORADO}
          className="h-4 w-4"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.802 2.036a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.802-2.036a1 1 0 00-1.176 0l-2.802 2.036c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.88 8.72c-.783-.57-.38-1.81.588-1.81H6.93a1 1 0 00.951-.69l1.168-3.293z" />
        </svg>
      ))}
    </div>
  )
}
