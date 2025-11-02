import React, { useRef, useState, useMemo, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { XMarkIcon, ExclamationTriangleIcon, UserIcon, PencilSquareIcon, StarIcon } from "@heroicons/react/24/solid"
import { StarIcon as StarIconOutline } from "@heroicons/react/24/outline"
import { Smile, Frown, Meh, Laugh, Angry } from "lucide-react"
import "../styles/FormComent.css"

const LucideIconMap = { Angry, Frown, Meh, Smile, Laugh, Default: UserIcon }
const DORADO = "#d4af37"

// ⭐ Hook de configuración de calificación
function useRatingConfig(stars) {
  return useMemo(() => {
    switch (stars) {
      case 1: return { color: "#dc2626", text: "Mala Experiencia", iconName: "Angry" }
      case 2: return { color: "#f97316", text: "Regular", iconName: "Frown" }
      case 3: return { color: "#facc15", text: "Aceptable", iconName: "Meh" }
      case 4: return { color: "#22c55e", text: "Buena Experiencia", iconName: "Smile" }
      case 5: return { color: "#16a34a", text: "Excelente!", iconName: "Laugh" }
      default: return { color: "#9ca3af", text: "Sin Calificación", iconName: "Default" }
    }
  }, [stars])
}

// 🧍 Avatar según calificación
function ProfileAvatar({ stars }) {
  const config = useRatingConfig(stars)
  const IconComponent = LucideIconMap[config.iconName] || LucideIconMap.Default

  return (
    <div className="avatar-container">
      <svg
        className="avatar-svg"
        width={64}
        height={64}
        viewBox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          backgroundColor: config.color,
          boxShadow: `0 0 0 4px ${config.color}33`
        }}
      >
        <circle cx="50" cy="50" r="45" fill="#fefefe" />
        <circle cx="35" cy="40" r="7" fill="#1f2937" />
        <circle cx="65" cy="40" r="7" fill="#1f2937" />
        {stars === 1 && <path d="M 30 70 C 40 60, 60 60, 70 70" stroke="#1f2937" strokeWidth="5" fill="none" />}
        {stars === 2 && <path d="M 30 65 L 70 65" stroke="#1f2937" strokeWidth="5" fill="none" />}
        {stars === 3 && <path d="M 30 65 C 40 68, 60 68, 70 65" stroke="#1f2937" strokeWidth="5" fill="none" />}
        {stars === 4 && <path d="M 30 65 C 40 80, 60 80, 70 65" stroke="#1f2937" strokeWidth="5" fill="none" />}
        {stars === 5 && <path d="M 30 65 C 40 85, 60 85, 70 65" stroke="#1f2937" strokeWidth="5" fill="#1f2937" />}
      </svg>
      <span className="avatar-text" style={{ color: config.color }}>
        <IconComponent className="h-4 w-4" /> {config.text}
      </span>
    </div>
  )
}

// 🔐 Simulador de inicio de sesión
function LoginSimulator({ onLoginSuccess }) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [displayName, setDisplayName] = useState("")
  const [error, setError] = useState(null)

  const handleSimulatedLogin = () => {
    if (!email.includes("@") || password.length < 6 || !displayName.trim()) {
      return setError("Completa todos los campos correctamente.")
    }
    onLoginSuccess(displayName)
  }

  return (
    <div className="login-container">
      <h3>Inicia Sesión para Comentar</h3>
      <p className="login-note"><b>SIMULACIÓN:</b> Introduce un nombre para tu reseña.</p>

      <input type="email" placeholder="Email (simulado)" value={email}
        onChange={(e) => { setEmail(e.target.value); setError(null); }} />
      <input type="password" placeholder="Contraseña (min 6 caracteres)" value={password}
        onChange={(e) => { setPassword(e.target.value); setError(null); }} />
      <input type="text" placeholder="Tu Nombre (Ej: Pedro Martínez)" value={displayName}
        onChange={(e) => { setDisplayName(e.target.value); setError(null); }} />

      {error && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="error-message">
          <ExclamationTriangleIcon className="h-5 w-5 mr-2" />
          {error}
        </motion.div>
      )}

      <button onClick={handleSimulatedLogin} className="google-button">
        <svg viewBox="0 0 48 48" className="h-5 w-5">
        </svg>
        <span>Simular Inicio de Sesión con Google</span>
      </button>
    </div>
  )
}

// ⭐ Selector de estrellas
function StarSelector({ value, onChange, disabled }) {
  return (
    <div className={`star-selector ${disabled ? 'disabled' : ''}`}>
      {Array.from({ length: 5 }).map((_, i) => {
        const filled = i < value
        return (
          <motion.div
            key={i}
            whileHover={!disabled ? { scale: 1.2 } : {}}
            onClick={() => (disabled ? null : onChange(i + 1))}
          >
            {filled
              ? <StarIcon className="star-filled" style={{ color: DORADO }} />
              : <StarIconOutline className="star-outline" />}
          </motion.div>
        )
      })}
    </div>
  )
}

// 🧾 Formulario principal
export default function FormComent({ onSubmit, onClose, isOpen }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userName, setUserName] = useState("")
  const [formData, setFormData] = useState({ title: "", body: "", stars: 5, name: "" })
  const [formError, setFormError] = useState(null)

  useEffect(() => {
    document.body.classList.toggle("overflow-hidden", isOpen)
  }, [isOpen])

  const handleLoginSuccess = (name) => {
    setIsAuthenticated(true)
    setUserName(name)
    setFormData(prev => ({ ...prev, name }))
  }

  const handleChange = (e) => {
  const { name, value } = e.target
  setFormError(null)

  if (name === "title" && value.length > 40) return

  // 🔢 Control de máximo 200 palabras
  if (name === "body") {
    const wordCount = value.trim().split(/\s+/).length
    if (wordCount > 100) return // no permite más palabras
  }

  setFormData({ ...formData, [name]: value })
}


  const isFormValid = useMemo(() => {
    return (
      isAuthenticated &&
      formData.title.trim().length > 0 &&
      formData.body.trim().length > 0 &&
      formData.stars > 0
    )
  }, [isAuthenticated, formData])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!isFormValid) return setFormError("Completa todos los campos antes de enviar.")
    onSubmit({ ...formData, id: Date.now() })
    setFormError(`¡Gracias por tu reseña, ${userName}!`)
    setFormData({ title: "", body: "", stars: 5, name: userName })
    setTimeout(onClose, 1500)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.75 }} exit={{ opacity: 0 }} onClick={onClose} className="overlay" />
          <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", stiffness: 100 }} className="form-panel">
            <div className="form-header">
              <h2><PencilSquareIcon className="h-6 w-6" /> Escribir Nueva Reseña</h2>
              <button onClick={onClose}><XMarkIcon className="h-6 w-6" /></button>
            </div>

            <form onSubmit={handleSubmit} className="form-content">
              {!isAuthenticated ? (
                <LoginSimulator onLoginSuccess={handleLoginSuccess} />
              ) : (
                <div className="login-success">
                  <UserIcon className="h-5 w-5" />
                  <span>Sesión iniciada como <b>{userName}</b></span>
                </div>
              )}

              <label>
                Título <span className="required">*</span>
                <input
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Título (máx. 40 caracteres)"
                  disabled={!isAuthenticated}
                  maxLength={40}
                />
                <small className="char-count">{formData.title.length}/40</small>
              </label>

              <label>
                Reseña <span className="required">*</span>
                <textarea
                  name="body"
                  value={formData.body}
                  onChange={handleChange}
                  rows="5"
                  placeholder="Describe tu experiencia..."
                  disabled={!isAuthenticated}
                />
              </label>
<small className="char-count">
  {formData.body.trim() === "" 
    ? 0 
    : formData.body.trim().split(/\s+/).length} / 100 palabras
</small>

              <div className="rating-container">
                <label>¿Cómo calificarías?</label>
                <StarSelector value={formData.stars} onChange={(v) => setFormData({ ...formData, stars: v })} disabled={!isAuthenticated} />
                <ProfileAvatar stars={formData.stars} />
              </div>

              {formError && <div className={`form-error ${formError.includes("Gracias") ? "success" : ""}`}>{formError}</div>}

              <button type="submit" disabled={!isFormValid} className={`submit-button ${!isFormValid ? "disabled" : ""}`}>
                Enviar Reseña
              </button>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
