import React from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import "../styles/Footer.css";
import {
  EnvelopeIcon,
  MapPinIcon,
  PhoneIcon,
} from "@heroicons/react/24/solid";

const GOLD_COLOR = "#d4af37";

export default function FooterCarniceria() {
  const { t } = useTranslation();

  return (
    <div className="overflow-hidden w-full">
      <motion.footer
        className="bg-gray-100 text-gray-900 dark:bg-neutral-900 dark:text-white transition-colors duration-700"
        initial={{ y: 40, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut", type: "tween" }}
        viewport={{ once: true, amount: 0.2 }}
      >
        {/* Sección superior */}
        <div className="mx-auto max-w-7xl px-6 py-16 grid gap-12 lg:grid-cols-3">
          {/* Marca */}
          <div>
            <h4
              className="text-5xl font-extrabold tracking-tight"
              style={{ color: GOLD_COLOR }}
            >
              {t("footer.brand")}
            </h4>
            <p className="mt-4 max-w-sm text-gray-700 dark:text-gray-300 transition-colors duration-300">
              {t("footer.blurb")}
            </p>
          </div>

          {/* Horarios */}
          <div>
            <h5
              className="text-sm font-extrabold uppercase tracking-widest"
              style={{ color: GOLD_COLOR }}
            >
              {t("footer.schedule.title")}
            </h5>
            <p className="mt-5 text-sm text-gray-700 dark:text-gray-300">
              {t("footer.schedule.week")}
            </p>
            <p className="mt-5 text-sm text-gray-700 dark:text-gray-300">
              {t("footer.schedule.saturday")}
            </p>
            <p className="mt-5 text-sm text-gray-700 dark:text-gray-300">
              {t("footer.schedule.sunday")}
            </p>
          </div>

          {/* Contacto */}
          <div>
            <h5
              className="text-sm font-extrabold uppercase tracking-widest"
              style={{ color: GOLD_COLOR }}
            >
              {t("footer.contact.title")}
            </h5>
            <div className="contact-info">
              <div>
                <EnvelopeIcon className="w-6 h-6" />
                <span>orders@alimentsbenito.com</span>
              </div>
              <div>
                <PhoneIcon className="w-6 h-6" />
                <span>+1 514-723-2378</span>
              </div>
              <div>
                <MapPinIcon className="w-6 h-6" />
                <span>11515 4e Avenue , Montreal, QC, Canada, Quebec</span>
              </div>
            </div>
            <div className="mt-5 flex items-center gap-4 text-gray-600 dark:text-gray-400">
              <SocialIcon name="Instagram" />
              <SocialIcon name="Facebook" />
              <SocialIcon name="Tiktok" />
            </div>
          </div>
        </div>

        {/* Separador */}
        <div
          className="h-0.5 w-full"
          style={{ backgroundColor: `${GOLD_COLOR}80` }}
        />

        <p className="mt-8 text-center text-xs text-gray-600 dark:text-gray-400 pb-6">
          {t("footer.copyright", { year: new Date().getFullYear() })}
        </p>
      </motion.footer>
    </div>
  );
}

/* -------- Subcomponentes -------- */

function SocialIcon({ name }) {
  const base =
    "h-6 w-6 transition text-gray-600 hover:text-[#d4af37] dark:text-gray-400 dark:hover:text-[#d4af37]";

  const icons = {
    Instagram: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        className={base}
        href="https://www.instagram.com/alimentsbenito/?hl=es-la"
        target="_blank"
        viewBox="0 0 24 24"
      >
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <path d="M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        <path d="M18.5 5.5h.01" />
      </svg>
    ),
    Facebook: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor"
        className={base}
        href="https://www.facebook.com/p/Aliments-Benito-100090022035289/"
        target="_blank"
        viewBox="0 0 24 24"
      >
        <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3V2z" />
      </svg>
    ),
    Tiktok: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor"
        className={base}
        href="https://www.tiktok.com/@alimentsbenito"
        target="_blank"
        viewBox="0 0 24 24"
      >
        <path d="M12.75 2c1.378 1.165 3.056 1.863 4.912 1.96v2.76a7.671 7.671 0 01-3.515-.937v6.087a5.585 5.585 0 11-5.585-5.585c.22 0 .436.015.649.043v2.869a2.813 2.813 0 00-.649-.074 2.789 2.789 0 102.789 2.789V2h1.399z" />
      </svg>
    ),
  };

  return (
    <a href={icons[name].props.href} target={icons[name].props.target}>
      {icons[name]}
    </a>
  );
}
