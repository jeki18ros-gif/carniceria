
<<<<<<< HEAD
export default function ExploreMore() {
  return (
    <section className="light-block py-12 transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center">
          <a
            href="/explorar"
            className="accent-block inline-flex items-center gap-2 px-8 py-4 text-base font-bold uppercase tracking-widest shadow-2xl transform hover:scale-105 transition-all duration-300 ease-in-out"
=======
import { motion } from "framer-motion";

export default function ExploreMore() {
  return (
    // 1. Fondo de la Sección: Usa 'light-block' para el fondo adaptable (gris claro/oscuro)
    <motion.section
      className="modo-oscuro bg-[#FFF5F0] py-20 transition-colors duration-700"
      initial={{ y: 40, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut", type: "tween" }}
      viewport={{ once: true, amount: 0.2 }}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center">
          <a
            href="https://lesalimentsbenito.onrender.com/"
            target="_blank"
            className={`accent-block inline-flex items-center gap-2 rounded-2xl  
                           px-6 py-3 text-base font-bold uppercase tracking-widest no-underline
                           shadow-2xl hover:scale-110 hover:shadow-xl active:scale-95 
                           transition-transform duration-300 ease-out`}
>>>>>>> 01237090e53e7608a34e2923bb70ee44b90235e4
          >
            Explorar más
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="h-5 w-5"
            >
              <path
                fillRule="evenodd"
                d="M3 10a.75.75 0 0 1 .75-.75h9.638L10.22 6.28a.75.75 0 1 1 1.06-1.06l4.5 4.5a.75.75 0 0 1 0 1.06l-4.5 4.5a.75.75 0 1 1-1.06-1.06l3.168-3.168H3.75A.75.75 0 0 1 3 10Z"
                clipRule="evenodd"
              />
            </svg>
          </a>
        </div>
      </div>
    </motion.section>
  )
}
