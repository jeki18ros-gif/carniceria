import React from 'react'

export default function ExploreMore() {
  return (
    <section className="bg-[#FDFDFD] py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center">
          <a
            href="/explorar"
            className="inline-flex items-center gap-2 rounded-2xl bg-[#E53935] px-6 py-3 text-sm font-bold uppercase tracking-wide text-white shadow-lg transition hover:bg-[#c62828] focus-visible:outline-2 focus-visible:outline-white/70 focus-visible:outline-offset-2"
          >
            Explorar más
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
              <path fillRule="evenodd" d="M3 10a.75.75 0 0 1 .75-.75h9.638L10.22 6.28a.75.75 0 1 1 1.06-1.06l4.5 4.5a.75.75 0 0 1 0 1.06l-4.5 4.5a.75.75 0 1 1-1.06-1.06l3.168-3.168H3.75A.75.75 0 0 1 3 10Z" clipRule="evenodd" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  )
}
