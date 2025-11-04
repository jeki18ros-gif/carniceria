import React, { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  XMarkIcon, 
  ExclamationTriangleIcon, 
  UserIcon, 
  PencilSquareIcon, 
  StarIcon 
} from "@heroicons/react/24/solid";
import { StarIcon as StarIconOutline } from "@heroicons/react/24/outline";
import { Smile, Frown, Meh, Laugh, Angry } from "lucide-react";

// Mapeo de iconos de Lucide
const LucideIconMap = { Angry, Frown, Meh, Smile, Laugh, Default: UserIcon };
// Color dorado para estrellas y acentos
const DORADO = "#d4af37";

/* ===================== CONFIGURACIÓN DE CALIFICACIÓN ===================== */
function useRatingConfig(stars) {
  return useMemo(() => {
    switch (stars) {
      case 1: return { color: "#dc2626", text: "Mala experiencia", iconName: "Angry" };
      case 2: return { color: "#f97316", text: "Regular", iconName: "Frown" };
      case 3: return { color: "#facc15", text: "Aceptable", iconName: "Meh" };
      case 4: return { color: "#22c55e", text: "Buena experiencia", iconName: "Smile" };
      case 5: return { color: "#16a34a", text: "Excelente", iconName: "Laugh" };
      default: return { color: "#9ca3af", text: "Sin calificación", iconName: "Default" };
    }
  }, [stars]);
}

/* ===================== AVATAR ===================== */
function ProfileAvatar({ stars }) {
  const config = useRatingConfig(stars);
  const IconComponent = LucideIconMap[config.iconName] || LucideIconMap.Default;

  return (
    <div className="flex flex-col items-center justify-center space-y-2 mt-4">
      <div className="relative w-16 h-16">
        <svg className="w-full h-full" viewBox="0 0 100 100">
          {/* Fondo del avatar basado en la calificación */}
          <circle cx="50" cy="50" r="45" fill={config.color + "20"} /> 
          {/* Ojos */}
          <circle cx="35" cy="40" r="7" fill="#1f2937" />
          <circle cx="65" cy="40" r="7" fill="#1f2937" />
          {/* Boca (la forma de la boca no cambia para simplificar) */}
          <path d="M30 65 Q50 80 70 65" stroke="#1f2937" strokeWidth="5" fill="none" />
        </svg>
        {/* Icono de Lucide en la parte superior para indicar el sentimiento */}
        <div 
          className="absolute inset-0 flex items-center justify-center text-white"
          style={{ color: config.color }}
        >
          <IconComponent className="w-8 h-8" />
        </div>
      </div>
      <span className="text-sm font-semibold flex items-center space-x-1 mt-2 transition-colors" style={{ color: config.color }}>
        {config.text}
      </span>
    </div>
  );
}

/* ===================== LOGIN SIMULADO ===================== */
function LoginSimulator({ onLoginSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState(null);

  const inputClasses = "w-full rounded-xl p-3 outline-none border transition-colors bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:border-yellow-600 dark:focus:border-yellow-500 shadow-sm";
  const errorClasses = "flex items-center text-sm p-3 bg-red-100 dark:bg-red-800 text-red-700 dark:text-red-200 rounded-xl";
  const loginContainerClasses = "space-y-4 p-5 bg-gray-100 dark:bg-gray-800 rounded-2xl shadow-inner transition-colors border border-gray-200 dark:border-gray-700";

  const handleLogin = () => {
    if (!email.includes("@") || password.length < 6 || !displayName.trim()) {
      return setError("Completa todos los campos correctamente.");
    }
    onLoginSuccess(displayName);
  };

  return (
    <div className={loginContainerClasses}>
      <h3 className="text-xl font-bold text-gray-800 dark:text-white border-b border-yellow-600/50 pb-2">
        Inicia Sesión para Comentar
      </h3>
      <p className="text-sm text-gray-600 dark:text-gray-400">
        <b className="font-semibold">Simulación:</b> Introduce tu nombre real para usarlo como firmante de la reseña.
      </p>
      
      <input
        type="email"
        placeholder="Email (simulado)"
        value={email}
        className={inputClasses}
        onChange={(e) => { setEmail(e.target.value); setError(null); }}
      />
      <input
        type="password"
        placeholder="Contraseña (mín. 6 caracteres)"
        value={password}
        className={inputClasses}
        onChange={(e) => { setPassword(e.target.value); setError(null); }}
      />
      <input
        type="text"
        placeholder="Tu nombre (Ej: Pedro Martínez)"
        value={displayName}
        className={inputClasses}
        onChange={(e) => { setDisplayName(e.target.value); setError(null); }}
      />
      {error && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }} 
          animate={{ opacity: 1, y: 0 }} 
          className={errorClasses}
        >
          <ExclamationTriangleIcon className="h-5 w-5 mr-2 flex-shrink-0" /> {error}
        </motion.div>
      )}
      <button 
        onClick={handleLogin}
        type="button"
        className="w-full py-3 rounded-xl font-bold text-gray-900 bg-yellow-400 hover:bg-yellow-500 transition-all shadow-md mt-4"
      >
        Simular Inicio de Sesión
      </button>
    </div>
  );
}

/* ===================== SELECTOR DE ESTRELLAS ===================== */
function StarSelector({ value, onChange, disabled }) {
  const baseClasses = "text-4xl transition-transform duration-150";
  
  return (
    <div className={`flex space-x-2 cursor-pointer ${disabled ? "opacity-50 pointer-events-none" : ""}`}>
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
            {filled
              ? <StarIcon className="w-8 h-8 drop-shadow-sm" style={{ color: DORADO }} />
              : <StarIconOutline className="w-8 h-8 text-gray-400 dark:text-gray-500" />}
          </motion.div>
        );
      })}
    </div>
  );
}

/* ===================== PANEL DE RESEÑA (Principal) ===================== */
export default function FormComent({ onSubmit, onClose, isOpen }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState("");
  const [formData, setFormData] = useState({ title: "", body: "", stars: 5 });
  const [formError, setFormError] = useState(null);
  const [theme, setTheme] = useState("light");

  // Detectar el tema del documento para aplicar estilos
  useEffect(() => {
    const root = document.documentElement;
    const observer = new MutationObserver(() => {
      setTheme(root.classList.contains("dark") ? "dark" : "light");
    });
    // Inicializar tema y luego observar
    setTheme(root.classList.contains("dark") ? "dark" : "light");
    observer.observe(root, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  // Bloquear scroll del body cuando el panel está abierto
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
    
    // Límite de 40 caracteres para el título
    if (name === "title" && value.length > 40) return;
    
    // Límite de 100 palabras para el cuerpo
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
      wordCount >= 5 && // Requerir mínimo 5 palabras
      formData.stars > 0
    );
  }, [isAuthenticated, formData]);
  
  const bodyWordCount = formData.body.trim().split(/\s+/).filter(Boolean).length;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isFormValid) return setFormError("Asegúrate de iniciar sesión, escribir un título, y que tu reseña tenga al menos 5 palabras.");
    
    // Llama a la función externa con los datos del comentario
    onSubmit({ ...formData, name: userName, id: Date.now(), timestamp: new Date().toISOString() });
    
    setFormError(`¡Gracias por tu reseña, ${userName}! Se enviará en breve.`);
    
    // Cierra el panel después de un breve retraso
    setTimeout(onClose, 1500);
  };
  
  const inputClasses = "w-full rounded-xl p-3 outline-none border transition-colors text-base disabled:opacity-70 disabled:cursor-not-allowed";
  const baseInputStyles = theme === "dark" 
    ? "bg-gray-800 border-gray-600 text-white focus:border-yellow-500"
    : "bg-white border-gray-300 text-gray-900 focus:border-yellow-600";
  
  const submitButtonClasses = `w-full py-3 rounded-xl font-bold text-gray-900 transition-all shadow-md text-lg mt-6 ${
    isFormValid 
      ? "bg-yellow-400 hover:bg-yellow-500" 
      : "bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
  }`;
  
  const formErrorClasses = `p-3 rounded-xl text-sm transition-all text-center font-medium ${
    formError?.includes("Gracias") 
      ? "bg-green-100 dark:bg-green-800 text-green-700 dark:text-green-200"
      : "bg-red-100 dark:bg-red-800 text-red-700 dark:text-red-200"
  }`;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="formcoment fixed inset-0 z-[100] font-sans">
          
          {/* 🌫 Overlay difuminado */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            exit={{ opacity: 0 }}
            className={`fixed inset-0 backdrop-blur-sm transition-all duration-300 bg-black/50`}
            onClick={onClose}
          />

          {/* 🧱 Panel lateral */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 120, damping: 20 }}
            className={`fixed top-0 right-0 h-full w-full max-w-lg sm:w-[400px] md:w-[460px] 
              shadow-2xl border-l border-gray-200 dark:border-gray-700 
              ${theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-gray-900"} 
              flex flex-col overflow-y-auto`}
          >
            
            {/* Cabecera y botón de cierre */}
            <div className="sticky top-0 p-6 sm:p-8 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center z-10 
                bg-white dark:bg-gray-900 shadow-sm">
              <h2 className="text-2xl font-extrabold flex items-center space-x-2">
                <PencilSquareIcon className="h-6 w-6 text-yellow-500" />
                <span>Nueva Reseña</span>
              </h2>
              <button
                onClick={onClose}
                className="text-gray-600 dark:text-gray-300 hover:scale-110 transition-transform p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <XMarkIcon className="h-7 w-7" />
              </button>
            </div>

            {/* 📋 Contenido del formulario */}
            <form onSubmit={handleSubmit} className="form-content p-6 sm:p-8 space-y-6 flex-grow">
              {!isAuthenticated ? (
                <LoginSimulator onLoginSuccess={handleLoginSuccess} />
              ) : (
                <div className="p-4 bg-green-50 dark:bg-green-900/40 text-green-700 dark:text-green-300 rounded-xl flex items-center space-x-3 font-medium border border-green-200 dark:border-green-800">
                  <UserIcon className="h-5 w-5 flex-shrink-0" />
                  <span>Sesión iniciada como <b>{userName}</b></span>
                </div>
              )}

              <label className="block space-y-2">
                <span className="block font-semibold text-gray-700 dark:text-gray-300">Título * (Máx. 40 caracteres)</span>
                <input
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Ej: Muy buena atención"
                  className={`${inputClasses} ${baseInputStyles}`}
                  disabled={!isAuthenticated}
                />
                <small className="block text-right text-xs text-gray-500 dark:text-gray-400">
                  {formData.title.length}/40
                </small>
              </label>

              <label className="block space-y-2">
                <span className="block font-semibold text-gray-700 dark:text-gray-300">Reseña * (Máx. 100 palabras)</span>
                <textarea
                  name="body"
                  rows="5"
                  value={formData.body}
                  onChange={handleChange}
                  placeholder="Describe tu experiencia..."
                  className={`${inputClasses} ${baseInputStyles} resize-y`}
                  disabled={!isAuthenticated}
                />
                <small className={`block text-right text-xs font-medium ${bodyWordCount < 5 ? 'text-red-500' : 'text-gray-500 dark:text-gray-400'}`}>
                  {bodyWordCount} / 100 palabras (Mínimo 5 requeridas)
                </small>
              </label>

              <div className="space-y-4 pt-4">
                <span className="block font-semibold text-gray-700 dark:text-gray-300">¿Cómo calificarías?</span>
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <StarSelector
                    value={formData.stars}
                    onChange={(v) => setFormData({ ...formData, stars: v })}
                    disabled={!isAuthenticated}
                  />
                  <ProfileAvatar stars={formData.stars} />
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
                Enviar Reseña
              </button>
              
              <div className="pt-4 text-center text-xs text-gray-500 dark:text-gray-500">
                <PencilSquareIcon className="h-4 w-4 inline-block mr-1" />
                Tu reseña ayuda a otros usuarios.
              </div>
            </form>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
