import React from 'react'
import Header from '../components/Header'
import Hero from '../components/Hero'
import AfterHero from '../components/AfterHero'
import MenuCarousel from '../components/MenuCarousel'
import ExploreMore from '../components/ExploreMore'
import PromoHero from '../components/PromoHero'
import FeaturesGrid from '../components/FeaturesGrid'
import Testimonials from '../components/Testimonials'
import ContactSection from '../components/ContactSection'
import Footer from '../components/Footer'

export default function Home() {
  return (
    <main className="min-h-screen bg-[#FDFDFD]">
      {/* Floating Header */}
      <Header />
      {/* Hero Section */}
      <Hero />
      {/* After Hero Section */}
      <AfterHero />
      {/* Menu Carousel Section */}
      <MenuCarousel />
      {/* Explore More CTA */}
      <ExploreMore />
      {/* Promo Hero (Perfect Food) */}
      <PromoHero />
      {/* Features Grid (Nosotros) */}
      <FeaturesGrid />
      {/* Testimonials */}
      <Testimonials />
      {/* Contact Section */}
      <ContactSection />
      {/* Footer */}
      <Footer />
    </main>
  )
}