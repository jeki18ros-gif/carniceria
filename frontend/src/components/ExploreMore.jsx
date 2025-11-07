import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import "../styles/ExploreMore.css"; // 👈 Importa los estilos
import { useTranslation } from "react-i18next";

export default function ExploreMore() {
  const orderPath = "/orden-de-compra";
  const { t } = useTranslation();

  return (
    <motion.section
      className="explore-section py-20 transition-colors duration-700"
      initial={{ y: 40, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut", type: "tween" }}
      viewport={{ once: true, amount: 0.2 }}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center">
          <Link
            to={orderPath}
            className="accent-block inline-flex items-center gap-2 rounded-2xl 
                       px-6 py-3 text-base font-bold tracking-widest no-underline
                       shadow-2xl hover:scale-110 hover:shadow-xl active:scale-95 
                       transition-transform duration-300 ease-out"
          >
            {t("exploreMore.cta")}
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
          </Link>
        </div>
      </div>
    </motion.section>
  );
}
