import React from 'react'

export default function Footer() {
  return (
    <footer className="bg-[#E53935] text-white">
      {/* Top content */}
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <h4 className="text-4xl font-extrabold tracking-tight">BISTORA</h4>
            <p className="mt-3 max-w-sm text-sm text-white/90">Calidad al por mayor con procesos limpios y servicio profesional.</p>
            <div className="mt-5">
              <a href="#comprar" className="inline-flex items-center justify-center rounded-xl bg-white px-5 py-3 text-sm font-bold uppercase tracking-wide text-[#E53935] shadow hover:bg-white/90">
                BUY TEMPLATE
              </a>
            </div>
          </div>

          {/* Opening hours */}
          <div>
            <h5 className="text-sm font-extrabold uppercase tracking-wide">Opening Hours</h5>
            <ul className="mt-4 space-y-1 text-sm">
              <li>Mon - Fri: 09:00 - 20:00</li>
              <li>Saturday: 10:00 - 18:00</li>
              <li>Sunday: Closed</li>
            </ul>
          </div>

          {/* Shop address */}
          <div>
            <h5 className="text-sm font-extrabold uppercase tracking-wide">Shop Address</h5>
            <p className="mt-4 max-w-xs text-sm">1234 Market Street, Montreal, QC, Canada</p>
            <div className="mt-4 flex items-center gap-3">
              {/* Social icons minimal */}
              <a href="#" aria-label="X" className="transition hover:opacity-80">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-5 w-5">
                  <path strokeWidth="2" d="M4 4l16 16M20 4L4 20" />
                </svg>
              </a>
              <a href="#" aria-label="Instagram" className="transition hover:opacity-80">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-5 w-5">
                  <rect x="4" y="4" width="16" height="16" rx="4" />
                  <circle cx="12" cy="12" r="3.5" />
                  <circle cx="16.5" cy="7.5" r="1" />
                </svg>
              </a>
              <a href="#" aria-label="YouTube" className="transition hover:opacity-80">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                  <path d="M10 15l5.19-3L10 9v6z" />
                  <path fillRule="evenodd" d="M23 12c0 2.761-2.239 5-5 5H6c-2.761 0-5-2.239-5-5s2.239-5 5-5h12c2.761 0 5 2.239 5 5z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="#" aria-label="Facebook" className="transition hover:opacity-80">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                  <path d="M13 4h3V1h-3a5 5 0 00-5 5v3H5v3h3v9h3v-9h3l1-3h-4V6a2 2 0 012-2z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Illustration doodle */}
          <div className="flex items-center justify-center lg:justify-end">
            <Doodle />
          </div>
        </div>
      </div>

      {/* Separator */}
      <div className="h-px w-full bg-white/40" />

      {/* Bottom links */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <LinkColumn title="MAIN PAGE" links={["HOME", "ABOUT", "CONTACT"]} />
          <LinkColumn title="OTHER PAGE" links={["FAQ", "PRIVACY POLICY", "404"]} />
          <LinkColumn title="CMS" links={["MENU", "MENU DETAILS", "BLOGS"]} />
          <LinkColumn title="TEMPLATE" links={["LICENSE", "STYLE GUIDE", "CHANGELOG"]} />
        </div>
        <p className="mt-8 text-center text-xs text-white/80">© {new Date().getFullYear()} BISTORA. All rights reserved.</p>
      </div>
    </footer>
  )
}

function LinkColumn({ title, links }) {
  return (
    <div>
      <h6 className="mb-3 text-sm font-extrabold uppercase tracking-wide">{title}</h6>
      <ul className="space-y-2 text-sm">
        {links.map((l) => (
          <li key={l}>
            <a href="#" className="transition hover:text-white">{l}</a>
          </li>
        ))}
      </ul>
    </div>
  )
}

function Doodle() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 240 140"
      className="h-28 w-auto text-white"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* table */}
      <path d="M20 110h200" />
      <path d="M60 110V90m120 20V90" />
      {/* person */}
      <circle cx="120" cy="50" r="12" />
      <path d="M90 80c10-15 50-15 60 0" />
      <path d="M110 62c-12 8-25 18-30 28" />
      <path d="M130 62c12 8 25 18 30 28" />
      {/* plate and meal */}
      <ellipse cx="120" cy="95" rx="24" ry="8" />
      <path d="M110 92c6 3 14 3 20 0" />
      {/* speech bubble */}
      <path d="M160 30h40v24h-30l-10 8z" />
      <text x="165" y="44" fontSize="10" fill="currentColor">having my meal</text>
    </svg>
  )
}

