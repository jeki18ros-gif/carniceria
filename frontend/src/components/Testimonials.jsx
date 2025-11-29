import React, { useMemo, useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import FormComent from "./FormComent";
import ReviewCard from "./ReviewCard";
import "../styles/Testimonials.css";
import { supabase } from "../supabase/supabaseClient";

export default function Testimonials() {
  const { t } = useTranslation();
  const [showForm, setShowForm] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
const fetchReviews = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Ordenar por fecha de forma descendente para mostrar los más recientes primero
      const { data, error } = await supabase
        .from("comentarios")
        .select("id, nombre, titulo, cuerpo, estrellas, fecha") // Selecciona solo las columnas necesarias
        .order("fecha", { ascending: false }) 
        .limit(100); // Limita la cantidad si tienes muchos

      if (error) throw error;
      
      // Mapear los nombres de columna de la DB a los que usa tu componente ReviewCard (data.nombre -> name, data.titulo -> title, etc.)
      const formattedReviews = data.map(r => ({
          id: r.id,
          title: r.titulo,
          body: r.cuerpo,
          name: r.nombre,
          stars: r.estrellas,
          date: r.fecha,
      }));
      
      setReviews(formattedReviews);
    } catch (err) {
      console.error("Error cargando comentarios:", err);
      setError("No se pudieron cargar los comentarios.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Cargar comentarios al montar el componente
  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

const handleAddReview = (newReview) => {
    fetchReviews(); 
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
        {isLoading && <p className="text-xl mt-8">Cargando comentarios...</p>}
      {error && <p className="text-xl mt-8 text-red-500">{error}</p>}
      {/* Asegúrate de que no haya error ni esté cargando antes de mostrar el carrusel */}
      {!isLoading && !error && (
        <div className="carousel-container">
          <div className="carousel-track">
            {/* LÍNEA CORREGIDA: Renderiza solo las reseñas una vez */}
            {(reviews || []).map((r, i) => (
              <ReviewCard key={r.id || `${r.title}-${i}`} data={r} />
            ))}
          </div>
        </div>
      )}

        {showForm && (
          <FormComent
            isOpen={showForm}
            onSubmit={handleAddReview}
            onClose={() => setShowForm(false)}
          />
        )}
      </div>
    </motion.section>
  );
}
