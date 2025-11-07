import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import FormComent from "./FormComent";
import ReviewCard from "./ReviewCard";
import "../styles/Testimonials.css";

export default function Testimonials() {
  const { t } = useTranslation();
  const [showForm, setShowForm] = useState(false);

  // 🗂️ Cargar reseñas iniciales desde el JSON de i18n
  const INITIAL_REVIEWS = useMemo(() => {
    const reviews = t("testimonials.initial_reviews", { returnObjects: true });
    return Object.entries(reviews).map(([key, value], i) => ({
      id: i + 1,
      title: value.title,
      body: value.body,
      name: value.name,
      stars: 5, // ⭐ Por defecto todas con 5 estrellas (puedes hacerlo dinámico si luego lo agregas)
    }));
  }, [t]);

  const [reviews, setReviews] = useState(INITIAL_REVIEWS);

  const handleAddReview = (newReview) => {
    setReviews([newReview, ...reviews]);
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
        {/* 🏷️ Títulos */}
        <h3 className="testimonials-title">
          <span className="title-small">{t("testimonials.title_small")}</span>
          <span className="title-big">{t("testimonials.title_big")}</span>
        </h3>

        {/* 🧾 Botón */}
        <div className="text-center mb-8">
          <button
            onClick={() => setShowForm(true)}
            className="testimonials-button"
          >
            {t("testimonials.button_leave_review")}
          </button>
        </div>

        {/* 💬 Modal */}
        {showForm && (
          <FormComent
            isOpen={showForm}
            onSubmit={handleAddReview}
            onClose={() => setShowForm(false)}
          />
        )}

        {/* 🎞️ Carrusel */}
        <div className="carousel-container">
          <div className="carousel-track">
            {[...reviews, ...reviews].map((r, i) => (
              <ReviewCard key={`${r.id}-${i}`} data={r} />
            ))}
          </div>
        </div>
      </div>
    </motion.section>
  );
}
