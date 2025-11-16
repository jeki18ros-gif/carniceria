import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import FormComent from "./FormComent";
import ReviewCard from "./ReviewCard";
import "../styles/Testimonials.css";

export default function Testimonials() {
  const { t } = useTranslation();
  const [showForm, setShowForm] = useState(false);

  // Cargamos las reviews iniciales de i18n de forma segura.
  // Si la clave existe pero está vacía, devolvemos [].
  const INITIAL_REVIEWS = useMemo(() => {
    const raw = t("testimonials.initial_reviews", { returnObjects: true });

    // Si viene null/undefined/""/string -> fallback a []
    if (!raw || (typeof raw !== "object" && !Array.isArray(raw))) return [];

    // Si viene como array, lo usamos tal cual (mapeando campos esperados).
    if (Array.isArray(raw)) {
      return raw.map((value, i) => ({
        id: value?.id ?? i + 1,
        title: value?.title ?? "",
        body: value?.body ?? "",
        name: value?.name ?? "",
        stars: value?.stars ?? 5,
      }));
    }

    // Si viene como objeto (ej. { review1: {...}, review2: {...} })
    return Object.entries(raw).map(([key, value], i) => ({
      id: value?.id ?? i + 1,
      title: value?.title ?? "",
      body: value?.body ?? "",
      name: value?.name ?? "",
      stars: value?.stars ?? 5,
    }));
  }, [t]);

  // Estado iniciado con seguridad: si INITIAL_REVIEWS es falsy, []
  const [reviews, setReviews] = useState(() => INITIAL_REVIEWS || []);

  const handleAddReview = (newReview) => {
    if (!newReview) return;
    // Aseguramos id único simple — podrías mejorar con uuid si quieres.
    const next = {
      id: newReview.id ?? Date.now(),
      title: newReview.title ?? "",
      body: newReview.body ?? "",
      name: newReview.name ?? t("testimonials.anonymous", "Anónimo"),
      stars: newReview.stars ?? 5,
    };
    setReviews((prev) => [next, ...(prev || [])]);
    setShowForm(false);
  };

  return (
    <motion.section
      id="resenas"
      className="testimonials transition-colors duration-700 isolated-theme"
      initial={{ y: 40, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut", type: "tween" }}
      viewport={{ once: true, amount: 0.2 }}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-15 text-center">
        <h3 className="testimonials-title">
          <span className="title-small">{t("testimonials.title_small")}</span>
          <span className="title-big">{t("testimonials.title_big")}</span>
        </h3>

        <div className="text-center mb-8">
          <button
            onClick={() => setShowForm(true)}
            className="testimonials-button"
          >
            {t("testimonials.button_leave_review")}
          </button>
        </div>

        {showForm && (
          <FormComent
            isOpen={showForm}
            onSubmit={handleAddReview}
            onClose={() => setShowForm(false)}
          />
        )}

        <div className="carousel-container">
          <div className="carousel-track">
            {/* Protegemos reviews: si es undefined usamos [] */}
            {[...(reviews || []), ...(reviews || [])].map((r, i) => (
              <ReviewCard key={`${r?.id ?? "r"}-${i}`} data={r} />
            ))}
          </div>
        </div>
      </div>
    </motion.section>
  );
}
