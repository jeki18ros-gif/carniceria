import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { supabase } from '../supabase/supabase';

import {
  XMarkIcon,
  PencilSquareIcon,
  StarIcon as SolidStar,
} from '@heroicons/react/24/solid';
import { StarIcon as OutlineStar } from '@heroicons/react/24/outline';
import { Smile, Frown, Meh, Laugh, Angry, User as UserIcon } from 'lucide-react';
const DORADO = '#d4af37';
const LucideIconMap = { Angry, Frown, Meh, Smile, Laugh, Default: UserIcon };
function useThemeWatcher() {
  const [theme, setTheme] = useState(
    document.documentElement.classList.contains("dark") ? "dark" : "light"
  );

  useEffect(() => {
    const root = document.documentElement;
    const observer = new MutationObserver(() => {
      setTheme(root.classList.contains("dark") ? "dark" : "light");
    });

    observer.observe(root, { attributes: true, attributeFilter: ["class"] });

    return () => observer.disconnect();
  }, []);

  return theme;
}
function useRatingConfig(stars, t) {
  const labels = useMemo(
    () => t("formComent.rating.labels", { returnObjects: true }),
    [t]
  );

  return useMemo(() => {
    switch (stars) {
      case 1: return { color: "#dc2626", text: labels.very_bad, iconName: "Angry" };
      case 2: return { color: "#f97316", text: labels.bad, iconName: "Frown" };
      case 3: return { color: "#facc15", text: labels.ok, iconName: "Meh" };
      case 4: return { color: "#22c55e", text: labels.good, iconName: "Smile" };
      case 5: return { color: "#16a34a", text: labels.excellent, iconName: "Laugh" };
      default: return { color: "#9ca3af", text: labels.none, iconName: "Default" };
    }
  }, [stars, labels]);
}
function InputField({ label, helper, children }) {
  return (
    <label className="block space-y-2">
      <span className="block font-semibold">{label}</span>
      {children}
      {helper && (
        <small className="block text-right text-xs text-gray-500">
          {helper}
        </small>
      )}
    </label>
  );
}
const StarSelector = React.memo(({ value, onChange }) => {
  return (
    <div className="flex space-x-3 cursor-pointer">
      {Array.from({ length: 5 }).map((_, i) => {
        const filled = i < value;

        return (
          <motion.button
            key={i}
            type="button"
            whileHover={{ scale: 1.15, rotate: -3 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onChange(i + 1)}
            className="transition-transform"
          >
            {filled ? (
              <SolidStar
                className="w-4 h-8 drop-shadow"
                style={{ color: DORADO }}
              />
            ) : (
              <OutlineStar
                className="w-9 h-12"
                style={{ color: DORADO }}
              />
            )}
          </motion.button>
        );
      })}
    </div>
  );
});
function ProfileAvatar({ stars, t }) {
  const cfg = useRatingConfig(stars, t);
  const IconComponent = LucideIconMap[cfg.iconName] || LucideIconMap.Default;

  return (
    <div className="flex flex-col items-center space-y-2 mt-2">
      <div className="relative w-16 h-16">
        <svg
          className="w-full h-full"
          viewBox="0 0 100 100"
          role="img"
          aria-hidden
        >
          <circle cx="50" cy="50" r="45" fill={cfg.color + "22"} />
        </svg>
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{ color: cfg.color }}
        >
          <IconComponent className="w-8 h-8" />
        </div>
      </div>

      <span className="text-sm font-semibold" style={{ color: cfg.color }}>
        {cfg.text}
      </span>
    </div>
  );
}
export default function FormComent({ onSubmit, onClose, isOpen }) {
  const { t } = useTranslation();
  const theme = useThemeWatcher();

  const [formData, setFormData] = useState({
    title: "",
    body: "",
    stars: 5,
    name: "",
  });

  const [formError, setFormError] = useState(null);

  /* Evitar scroll en modal */
  useEffect(() => {
    if (isOpen) document.body.classList.add("overflow-hidden");
    else document.body.classList.remove("overflow-hidden");

    return () => document.body.classList.remove("overflow-hidden");
  }, [isOpen]);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormError(null);

    if (name === "title" && value.length > 40) return;
    if (name === "body") {
      const words = value.trim().split(/\s+/).filter(Boolean);
      if (words.length > 100) return;
    }

    setFormData((p) => ({ ...p, [name]: value }));
  };

  const bodyWordCount = formData.body.trim().split(/\s+/).filter(Boolean).length;

  /* Validación final */
  const isFormValid = useMemo(() => {
    return (
      formData.title.trim().length > 0 &&
      bodyWordCount >= 5 &&
      formData.stars > 0 &&
      /^[a-zA-ZÀ-ÿ\u00f1\u00d1 ]{2,40}$/.test(formData.name.trim())
    );
  }, [formData, bodyWordCount]);

const handleSubmit = async (e) => {
  e.preventDefault();

  if (!isFormValid) {
    return setFormError("Formulario inválido");
  }
  const ip = await fetch("https://api64.ipify.org?format=json")
              .then(r => r.json())
              .then(d => d.ip);

  const { data, error } = await supabase.from("comentarios").insert([
    {
      nombre: formData.name,
      titulo: formData.title,
      cuerpo: formData.body,
      estrellas: formData.stars,
      ip:ip
    }
  ]).select();

  if (error) {
    setFormError(error.message);
    return;
  }
const newReviewData = data?.[0];
  setFormError("Gracias por tu comentario 😊");
  onSubmit(newReviewData);
  setTimeout(onClose, 1500);
};

  /* -------------------------------------
        INPUT STYLES
  ------------------------------------- */
  const inputClasses =
    "w-full rounded-xl p-3 outline-none border transition-colors text-base shadow-sm";
  const baseInputStyles =
    theme === "dark"
      ? "bg-gray-800 border-gray-600 text-white focus:border-yellow-500"
      : "bg-white border-gray-300 text-gray-900 focus:border-yellow-600";

  const submitButtonClasses = `w-full py-3 rounded-xl font-bold text-gray-900 text-lg mt-6 ${
    isFormValid
      ? "bg-yellow-400 hover:bg-yellow-500"
      : "bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed"
  }`;

  const formErrorClasses = `p-3 rounded-xl text-sm text-center font-medium ${
    formError?.includes("Gracias")
      ? "bg-green-100 dark:bg-green-800 text-green-700"
      : "bg-red-100 dark:bg-red-800 text-red-700"
  }`;

  /* -------------------------------------
        RENDER
  ------------------------------------- */
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="formcoment fixed inset-0 z-[100] font-sans">
          {/* Fondo */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 backdrop-blur-sm bg-black/50"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 120, damping: 20 }}
            className={`fixed top-0 right-0 h-full w-full max-w-lg shadow-2xl border-l ${
              theme === "dark"
                ? "bg-gray-900 text-white border-gray-700"
                : "bg-white text-gray-900 border-gray-200"
            } flex flex-col overflow-y-auto rounded-l-3xl`}
          >
            {/* Header */}
            <div className="sticky top-0 p-6 flex justify-between items-center border-b bg-inherit">
              <h2 className="text-2xl font-extrabold flex items-center space-x-2">
                <PencilSquareIcon className="h-6 w-6 text-yellow-500" />
                <span>{t("formComent.form.title")}</span>
              </h2>

              <button
                onClick={onClose}
                className="hover:scale-110 transition p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <XMarkIcon className="h-7 w-7" />
              </button>
            </div>

            {/* Body */}
            <form
              onSubmit={handleSubmit}
              className="p-6 space-y-6 flex-grow overflow-y-auto"
            >
              {/* Título */}
              <InputField
                label={t("formComent.form.fields.title.label")}
                helper={`${formData.title.length}/40`}
              >
                <input
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder={t(
                    "formComent.form.fields.title.placeholder"
                  )}
                  className={`${inputClasses} ${baseInputStyles}`}
                />
              </InputField>

              {/* Cuerpo */}
              <InputField label={t("formComent.form.fields.body.label")}>
                <textarea
                  name="body"
                  rows="5"
                  value={formData.body}
                  onChange={handleChange}
                  placeholder={t("formComent.form.fields.body.placeholder")}
                  className={`${inputClasses} ${baseInputStyles} resize-y`}
                />
                <small
                  className={`block text-right text-xs font-medium ${
                    bodyWordCount < 5 ? "text-red-500" : "text-gray-500"
                  }`}
                >
                  {bodyWordCount} / 100{" "}
                  {t("formComent.form.fields.body.counter_suffix")}
                </small>
              </InputField>

              {/* Rating */}
              <div className="space-y-4 pt-4">
                <span className="block font-semibold">
                  {t("formComent.form.fields.rating.label")}
                </span>
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <StarSelector
                    value={formData.stars}
                    onChange={(v) =>
                      setFormData((p) => ({ ...p, stars: v }))
                    }
                  />
                  <ProfileAvatar stars={formData.stars} t={t} />
                </div>
              </div>

              {/* Nombre (al final – opción 3) */}
              <InputField label={t("formComent.login.labels.displayName")}>
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder={t("formComent.login.labels.displayName")}
                  className={`${inputClasses} ${baseInputStyles}`}
                />
              </InputField>

              {/* Mensaje error o éxito */}
              {formError && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={formErrorClasses}
                >
                  {formError}
                </motion.div>
              )}

              {/* Botón enviar */}
              <button
                type="submit"
                className={submitButtonClasses}
                disabled={!isFormValid}
              >
                {t("formComent.form.actions.submit")}
              </button>
            </form>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}
