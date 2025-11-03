import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import Hero from '../components/Hero';
import AfterHero from '../components/AfterHero';
import MenuCarousel from '../components/Menu';
import ExploreMore from '../components/ExploreMore';
import PromoHero from '../components/PromoHero';
import FeaturesGrid from '../components/FeaturesGrid';
import Testimonials from '../components/Testimonials';
import ContactSection from '../components/ContactSection';
import Footer from '../components/Footer';

export default function Home() {
  const [theme, setTheme] = useState('light');

  // Detectar modo actual solo al montar
  useEffect(() => {
    const root = document.documentElement;
    const storedTheme = localStorage.getItem('theme');
    const isDark = storedTheme === 'dark' || root.classList.contains('dark');
    setTheme(isDark ? 'dark' : 'light');
  }, []);

  return (
    <main
      className={`min-h-screen transition-colors duration-300 ${
        theme === 'dark'
          ? 'bg-[#0b132b] text-cream' // 🌙 Fondo oscuro, texto claro
          : 'bg-[#FDFDFD] text-[#0b132b]' // ☀️ Fondo claro, texto oscuro
      }`}
    >
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
  );
}
