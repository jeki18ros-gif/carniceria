import React, { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import {
  XMarkIcon,
  ExclamationTriangleIcon,
  UserIcon,
  PencilSquareIcon,
  StarIcon,
} from "@heroicons/react/24/solid";
import { StarIcon as StarIconOutline } from "@heroicons/react/24/outline";
import { Smile, Frown, Meh, Laugh, Angry } from "lucide-react";

const LucideIconMap = { Angry, Frown, Meh, Smile, Laugh, Default: UserIcon };
const DORADO = "#d4af37";

/* ===================== CONFIGURACIÓN DE CALIFICACIÓN ===================== */
function useRatingConfig(stars, t) {
  return useMemo(() => {
    const labels = t("formComent.rating.labels", { returnObjects: true });
    switch (stars) {
      case 1:
        return { color: "#dc2626", text: labels.very_bad, iconName: "Angry" };
      case 2:
        return { color: "#f97316", text: labels.bad, iconName: "Frown" };
      case 3:
        return { color: "#facc15", text: labels.ok, iconName: "Meh" };
      case 4:
        return { color: "#22c55e", text: labels.good, iconName: "Smile" };
      case 5:
        return { color: "#16a34a", text: labels.excellent, iconName: "Laugh" };
      default:
        return { color: "#9ca3af", text: labels.none, iconName: "Default" };
    }
  }, [stars, t]);
}

/* ===================== AVATAR ===================== */
function ProfileAvatar({ stars, t }) {
  const config = useRatingConfig(stars, t);
  const IconComponent = LucideIconMap[config.iconName] || LucideIconMap.Default;

  return (
    <div className="flex flex-col items-center justify-center space-y-2 mt-4">
      <div className="relative w-16 h-16">
        <svg className="w-full h-full" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="45" fill={config.color + "20"} />
        </svg>
        <div
          className="absolute inset-0 flex items-center justify-center text-white"
          style={{ color: config.color }}
        >
          <IconComponent className="w-8 h-8" />
        </div>
      </div>
      <span
        className="text-sm font-semibold flex items-center space-x-1 mt-2"
        style={{ color: config.color }}
      >
        {config.text}
      </span>
    </div>
  );
}

/* ===================== LOGIN SIMULADO ===================== */
function LoginSimulator({ onLoginSuccess, t }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState(null);

  const inputClasses =
    "w-full rounded-xl p-3 outline-none border transition-colors bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:border-yellow-600 dark:focus:border-yellow-500 shadow-sm";
  const errorClasses =
    "flex items-center text-sm p-3 bg-red-100 dark:bg-red-800 text-red-700 dark:text-red-200 rounded-xl";
  const loginContainerClasses =
    "space-y-4 p-5 bg-gray-100 dark:bg-gray-800 rounded-2xl shadow-inner border border-gray-200 dark:border-gray-700";

  const handleLogin = () => {
    if (!email.includes("@") || password.length < 6 || !displayName.trim()) {
      return setError(t("formComent.login.errors.fill_all"));
    }
    onLoginSuccess(displayName);
  };

  return (
    <div className={loginContainerClasses}>
      <h3 className="text-xl font-bold text-gray-800 dark:text-white border-b border-yellow-600/50 pb-2">
        {t("formComent.login.title")}
      </h3>
      <p className="text-sm text-gray-600 dark:text-gray-400">
        <b className="font-semibold">{t("formComent.login.simulation")}</b>{" "}
        {t("formComent.login.intro")}
      </p>

      <input
        type="email"
        placeholder={t("formComent.login.labels.email")}
        value={email}
        className={inputClasses}
        onChange={(e) => {
          setEmail(e.target.value);
          setError(null);
        }}
      />
      <input
        type="password"
        placeholder={t("formComent.login.labels.password")}
        value={password}
        className={inputClasses}
        onChange={(e) => {
          setPassword(e.target.value);
          setError(null);
        }}
      />
      <input
        type="text"
        placeholder={t("formComent.login.labels.displayName")}
        value={displayName}
        className={inputClasses}
        onChange={(e) => {
          setDisplayName(e.target.value);
          setError(null);
        }}
      />
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={errorClasses}
        >
          <ExclamationTriangleIcon className="h-5 w-5 mr-2" /> {error}
        </motion.div>
      )}
      <button
        onClick={handleLogin}
        type="button"
        className="w-full py-3 rounded-xl font-bold text-gray-900 bg-yellow-400 hover:bg-yellow-500 transition-all shadow-md mt-4"
      >
        {t("formComent.login.actions.simulate_login")}
      </button>
    </div>
  );
}

/* ===================== SELECTOR DE ESTRELLAS ===================== */
function StarSelector({ value, onChange, disabled }) {
  const baseClasses = "text-4xl transition-transform duration-150";

  return (
    <div
      className={`flex space-x-2 cursor-pointer ${
        disabled ? "opacity-50 pointer-events-none" : ""
      }`}
    >
      {Array.from({ length: 5 }).map((_, i) => {
        const filled = i < value;
        return (
          <motion.div
            key={i}
            whileHover={!disabled ? { scale: 1.15 } : {}}
            whileTap={!disabled ? { scale: 0.9 } : {}}
            onClick={() => !disabled && onChange(i + 1)}
            className={baseClasses}
          >
            {filled ? (
              <StarIcon className="w-8 h-8" style={{ color: DORADO }} />
            ) : (
              <StarIconOutline className="w-8 h-8 text-gray-400 dark:text-gray-500" />
            )}
          </motion.div>
        );
      })}
    </div>
  );
}

/* ===================== PANEL DE RESEÑA ===================== */
export default function FormComent({ onSubmit, onClose, isOpen }) {
  const { t } = useTranslation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState("");
  const [formData, setFormData] = useState({ title: "", body: "", stars: 5 });
  const [formError, setFormError] = useState(null);
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const root = document.documentElement;
    const observer = new MutationObserver(() =>
      setTheme(root.classList.contains("dark") ? "dark" : "light")
    );
    setTheme(root.classList.contains("dark") ? "dark" : "light");
    observer.observe(root, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    document.body.classList.toggle("overflow-hidden", isOpen);
  }, [isOpen]);

  const handleLoginSuccess = (name) => {
    setIsAuthenticated(true);
    setUserName(name);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormError(null);

    if (name === "title" && value.length > 40) return;
    if (name === "body") {
      const words = value.trim().split(/\s+/).filter(Boolean);
      if (words.length > 100) return;
    }

    setFormData({ ...formData, [name]: value });
  };

  const isFormValid = useMemo(() => {
    const wordCount = formData.body.trim().split(/\s+/).filter(Boolean).length;
    return (
      isAuthenticated &&
      formData.title.trim().length > 0 &&
      formData.body.trim().length > 0 &&
      wordCount >= 5 &&
      formData.stars > 0
    );
  }, [isAuthenticated, formData]);

  const bodyWordCount = formData.body.trim().split(/\s+/).filter(Boolean).length;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isFormValid)
      return setFormError(t("formComent.form.messages.invalid_form"));

    onSubmit({
      ...formData,
      name: userName,
      id: Date.now(),
      timestamp: new Date().toISOString(),
    });

    setFormError(
      t("formComent.form.messages.success", { userName: userName })
    );
    setTimeout(onClose, 1500);
  };

  const inputClasses =
    "w-full rounded-xl p-3 outline-none border transition-colors text-base";
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

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="formcoment fixed inset-0 z-[100] font-sans">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 backdrop-blur-sm bg-black/50"
            onClick={onClose}
          />

          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 120, damping: 20 }}
            className={`fixed top-0 right-0 h-full w-full max-w-lg shadow-2xl border-l ${
              theme === "dark"
                ? "bg-gray-900 text-white border-gray-700"
                : "bg-white text-gray-900 border-gray-200"
            } flex flex-col overflow-y-auto`}
          >
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

            <form
              onSubmit={handleSubmit}
              className="p-6 space-y-6 flex-grow overflow-y-auto"
            >
              {!isAuthenticated ? (
                <LoginSimulator onLoginSuccess={handleLoginSuccess} t={t} />
              ) : (
                <div className="p-4 bg-green-50 dark:bg-green-900/40 text-green-700 dark:text-green-300 rounded-xl flex items-center space-x-3 font-medium">
                  <UserIcon className="h-5 w-5" />
                  <span>
                    {t("formComent.form.session_as")} <b>{userName}</b>
                  </span>
                </div>
              )}

              <label className="block space-y-2">
                <span className="block font-semibold">
                  {t("formComent.form.fields.title.label")}
                </span>
                <input
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder={t(
                    "formComent.form.fields.title.placeholder"
                  )}
                  className={`${inputClasses} ${baseInputStyles}`}
                  disabled={!isAuthenticated}
                />
                <small className="block text-right text-xs text-gray-500">
                  {formData.title.length}/40
                </small>
              </label>

              <label className="block space-y-2">
                <span className="block font-semibold">
                  {t("formComent.form.fields.body.label")}
                </span>
                <textarea
                  name="body"
                  rows="5"
                  value={formData.body}
                  onChange={handleChange}
                  placeholder={t(
                    "formComent.form.fields.body.placeholder"
                  )}
                  className={`${inputClasses} ${baseInputStyles} resize-y`}
                  disabled={!isAuthenticated}
                />
                <small
                  className={`block text-right text-xs font-medium ${
                    bodyWordCount < 5 ? "text-red-500" : "text-gray-500"
                  }`}
                >
                  {bodyWordCount} / 100{" "}
                  {t("formComent.form.fields.body.counter_suffix")}
                </small>
              </label>

              <div className="space-y-4 pt-4">
                <span className="block font-semibold">
                  {t("formComent.form.fields.rating.label")}
                </span>
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <StarSelector
                    value={formData.stars}
                    onChange={(v) => setFormData({ ...formData, stars: v })}
                    disabled={!isAuthenticated}
                  />
                  <ProfileAvatar stars={formData.stars} t={t} />
                </div>
              </div>

              {formError && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={formErrorClasses}
                >
                  {formError}
                </motion.div>
              )}

              <button
                type="submit"
                className={submitButtonClasses}
                disabled={!isFormValid}
              >
                {t("formComent.form.actions.submit")}
              </button>

              <div className="pt-4 text-center text-xs text-gray-500">
                <PencilSquareIcon className="h-4 w-4 inline-block mr-1" />
                {t("formComent.form.helper.note")}
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
