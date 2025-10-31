import React, { useRef, useState, useMemo, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { XMarkIcon, ExclamationTriangleIcon, UserIcon, PencilSquareIcon, StarIcon } from "@heroicons/react/24/solid"
import { StarIcon as StarIconOutline } from "@heroicons/react/24/outline"
const DORADO = "#d4af37"
function useRatingConfig(stars) {
    return useMemo(() => {
        switch (stars) {
            case 1:
                return { color: "#dc2626", emoji: "Mala Experiencia 😔" }; // Rojo (Pésimo)
            case 2:
                return { color: "#f97316", emoji: "Regular 😐" }; // Naranja (Pobre)
            case 3:
                return { color: "#facc15", emoji: "Aceptable 🙂" }; // Amarillo (Promedio)
            case 4:
                return { color: "#22c55e", emoji: "Buena Experiencia 😊" }; // Verde Claro (Muy Bueno)
            case 5:
                return { color: "#16a34a", emoji: "Excelente! 😄" }; // Verde Oscuro (Excelente)
            default:
                return { color: "#9ca3af", emoji: "Sin Calificación" }; // Gris (Por defecto)
        }
    }, [stars]);
}
function ProfileAvatar({ stars }) {
    const config = useRatingConfig(stars);
    const size = 64;

    return (
        <div className="flex flex-col items-center gap-2">
            <svg 
                className="rounded-full shadow-xl ring-2 ring-offset-2 dark:ring-offset-gray-900" 
                width={size} 
                height={size} 
                viewBox="0 0 100 100" 
                xmlns="http://www.w3.org/2000/svg"
                style={{ 
                    backgroundColor: config.color, 
                    transition: 'background-color 0.3s ease',
                    boxShadow: `0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1), 0 0 0 4px ${config.color}33` // Sombra sutil de color
                }}
            >
                {/* Cabeza (Fondo) */}
                <circle cx="50" cy="50" r="45" fill="#fefefe" />
                {/* Ojos */}
                <circle cx="35" cy="40" r="7" fill="#1f2937" />
                <circle cx="65" cy="40" r="7" fill="#1f2937" />
                
                {/* Boca (Cambia según las estrellas) */}
                {stars === 1 && <path d="M 30 65 C 40 75, 60 75, 70 65" stroke="#1f2937" strokeWidth="5" fill="none" />} {/* Triste */}
                {stars === 2 && <path d="M 30 65 L 70 65" stroke="#1f2937" strokeWidth="5" fill="none" />} {/* Recta */}
                {stars === 3 && <path d="M 30 65 C 40 70, 60 70, 70 65" stroke="#1f2937" strokeWidth="5" fill="none" />} {/* Ligero */}
                {stars === 4 && <path d="M 30 65 C 40 80, 60 80, 70 65" stroke="#1f2937" strokeWidth="5" fill="none" />} {/* Sonrisa */}
                {stars === 5 && <path d="M 30 65 C 40 85, 60 85, 70 65" stroke="#1f2937" strokeWidth="5" fill="#1f2937" />} {/* Boca abierta/Muy feliz */}
            </svg>
            <span 
                className={`text-xs font-bold transition-colors duration-300 dark:text-gray-300`} 
                style={{color: config.color}}
            >
                {config.emoji}
            </span>
        </div>
    );
}

function LoginSimulator({ onLoginSuccess }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [displayName, setDisplayName] = useState("");
    const [error, setError] = useState(null);

    const handleSimulatedLogin = () => {
        if (!email.includes("@") || password.length < 6 || !displayName.trim()) {
            return setError("Por favor, completa todos los campos para simular el inicio de sesión.");
        }

        onLoginSuccess(displayName); 
    };

    return (
        <div className="p-4 border border-blue-300 dark:border-blue-800 rounded-xl bg-blue-50 dark:bg-blue-950 space-y-4 shadow-inner">
            <h3 className="font-extrabold text-center text-xl text-blue-900 dark:text-blue-200">
                Inicia Sesión para Comentar
            </h3>
            
            <p className="text-sm text-center text-blue-700 dark:text-blue-400">
                <span className="font-bold">SIMULACIÓN</span>: Por favor, introduce un nombre para tu reseña.
            </p>

            <div className="space-y-3">
                {/* Campo Simulado: Email */}
                <input 
                    type="email" 
                    placeholder="Email (simulado: user@example.com)"
                    value={email} 
                    onChange={(e) => { setEmail(e.target.value); setError(null); }}
                    className="w-full p-3 rounded-lg border-2 border-blue-200 dark:border-blue-700 dark:bg-gray-800 text-sm focus:ring-blue-500 focus:border-blue-500 transition"
                />
                {/* Campo Simulado: Contraseña */}
                <input 
                    type="password" 
                    placeholder="Contraseña (simulada: min 6 chars)"
                    value={password} 
                    onChange={(e) => { setPassword(e.target.value); setError(null); }}
                    className="w-full p-3 rounded-lg border-2 border-blue-200 dark:border-blue-700 dark:bg-gray-800 text-sm focus:ring-blue-500 focus:border-blue-500 transition"
                />
                {/* Campo de Nombre Real (lo que "jala" la cuenta de Google) */}
                <input 
                    type="text" 
                    placeholder="Tu Nombre (Ej: Pedro Martínez)"
                    value={displayName} 
                    onChange={(e) => { setDisplayName(e.target.value); setError(null); }}
                    className="w-full p-3 rounded-lg border-2 border-blue-200 dark:border-blue-700 dark:bg-gray-800 text-sm font-semibold focus:ring-blue-500 focus:border-blue-500 transition"
                />
            </div>

            {error && (
                <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center text-red-600 bg-red-100 p-3 rounded-lg dark:bg-red-900/50 dark:text-red-300 text-sm font-medium border border-red-300"
                >
                    <ExclamationTriangleIcon className="h-5 w-5 mr-3 flex-shrink-0" />
                    {error}
                </motion.div>
            )}
            
            <button
                type="button"
                onClick={handleSimulatedLogin}
                className="w-full bg-[#3c82f6] text-white font-bold py-3 rounded-xl hover:bg-[#346fc6] transition flex items-center justify-center space-x-2 shadow-lg shadow-blue-500/50 hover:shadow-xl hover:shadow-blue-500/70 active:scale-[.99]"
            >
                {/* Ícono simulado de Google (mejorado) */}
                <svg viewBox="0 0 48 48" className="h-5 w-5 fill-current"><path fill="#4285F4" d="M43.611 20.083H42V20H24v8h11.341c-1.637 5.088-6.191 8.8-11.341 8.8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20c11.045 0 19.955-8.955 19.955-20 0-1.341-.138-2.65-.389-3.917z"/><path fill="#34A853" d="M6.306 14.691L14.05 21.434C16.173 19.467 18.995 18.2 22 18.2c3.551 0 6.643 1.543 8.86 3.993l7.009-7.009C35.807 8.351 30.295 6 24 6 15.093 6 7.857 11.239 6.306 14.691z"/><path fill="#FBBC05" d="M24 44c5.166 0 9.86-1.977 13.409-5.188l-7.009-7.009C28.2 33.744 26.215 34.2 24 34.2c-4.467 0-8.4-2.584-10.4-6.326l-7.251 5.252C7.883 38.35 15.034 44 24 44z"/><path fill="#EA4335" d="M43.611 20.083H24v8h11.341c-1.637 5.088-6.191 8.8-11.341 8.8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4c-4.14 0-7.877 1.258-11.028 3.411L2.73 14.691C4.249 11.239 11.407 6 24 6c3.218 0 6.208.775 8.86 2.193L37.866 2.19C33.644.757 28.91 0 24 0 10.745 0 0 10.745 0 24s10.745 24 24 24c4.14 0 7.877-1.258 11.028-3.411L37.866 43.81C42.089 42.378 48 38.5 48 24c0-1.341-.138-2.65-.389-3.917z"/></svg>
                <span>Simular Inicio de Sesión con Google</span>
            </button>
        </div>
    );
}

// --- Componente de Selector de Estrellas ---
function StarSelector({ value, onChange, disabled }) {
    return (
        <div className={`flex gap-1 ${disabled ? 'opacity-50' : ''}`}>
            {Array.from({ length: 5 }).map((_, i) => {
                const starValue = i + 1;
                const filled = i < value;
                return (
                    <motion.div
                        key={i}
                        whileHover={!disabled ? { scale: 1.2, rotate: 10 } : {}}
                        whileTap={!disabled ? { scale: 0.9 } : {}}
                        onClick={() => (disabled ? null : onChange(starValue))}
                        className={`transition-colors duration-150 ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                    >
                        {filled ? (
                            <StarIcon 
                                className="h-8 w-8 transition-colors"
                                style={{ color: DORADO }}
                            />
                        ) : (
                            <StarIconOutline 
                                className="h-8 w-8 text-gray-400 dark:text-gray-600 transition-colors hover:text-gray-500"
                            />
                        )}
                    </motion.div>
                )
            })}
        </div>
    )
}

// --- Componente de Formulario de Comentario (Modal) ---
function FormComent({ onSubmit, onClose, isOpen }) {
    // Estado para la simulación de autenticación
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userName, setUserName] = useState("");

    const [formData, setFormData] = useState({
        title: "",
        body: "",
        stars: 5, // Valor inicial de 5 estrellas
        name: "", 
    })
    const [formError, setFormError] = useState(null)
    const inputRef = useRef(null)

    // Enfocar el título cuando se abre el formulario
    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    // Función de éxito de login simulado
    const handleLoginSuccess = (name) => {
        setIsAuthenticated(true);
        setUserName(name);
        // Al iniciar sesión, el nombre se jala y se establece
        setFormData(prev => ({ ...prev, name: name })); 
        setFormError(null);
    };

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormError(null)

        // Previene la edición del nombre si ya está autenticado
        if (name === "name" && isAuthenticated) return; 
        
        if (name === "title" && value.length > 40) return
        if (name === "name" && value.length > 30) return

        const words = value.trim().split(/\s+/).filter(Boolean).length
        if (name === "body" && words > 200 && value.length > formData.body.length)
            return
        
        setFormData({ ...formData, [name]: value })
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        
        if (!isAuthenticated) {
            return setFormError("Debes iniciar sesión para enviar un comentario.");
        }
        
        if (!formData.title.trim())
            return setFormError("El título es obligatorio.")
        if (!formData.body.trim())
            return setFormError("La reseña no puede estar vacía.")
        
        // Ejecutar la función de envío de la App principal
        onSubmit({...formData, id: Date.now()})
        
        // Reiniciar formulario (excepto el nombre de usuario)
        setFormData({ title: "", body: "", stars: 5, name: userName }) 
        
        // Mostrar mensaje de éxito simulado temporalmente
        setFormError(`¡Gracias por tu reseña, ${userName}! (Reseña enviada)`);
        
        // Cerrar el modal después de un breve éxito
        setTimeout(() => {
            setFormError(null);
            onClose();
        }, 1500);
    }

    const bodyWordCount = formData.body.trim().split(/\s+/).filter(Boolean).length
    const isFormDisabled = !isAuthenticated; // El formulario está deshabilitado hasta el login

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Overlay */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.75 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-gray-900/80 backdrop-blur-sm z-40"
                    />

                    {/* Panel lateral */}
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", stiffness: 100, damping: 18 }}
                        className="fixed right-0 top-0 h-full w-full sm:w-[480px] bg-white dark:bg-gray-900 shadow-2xl z-50 overflow-y-auto"
                    >
                        <div className="flex items-center justify-between p-5 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 sticky top-0 z-10">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                                <PencilSquareIcon className="h-6 w-6 text-yellow-600" />
                                Escribir Nueva Reseña
                            </h2>
                            <button
                                onClick={onClose}
                                className="p-2 rounded-full text-gray-500 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-700 transition"
                            >
                                <XMarkIcon className="h-6 w-6" />
                            </button>
                        </div>

                        <form
                            onSubmit={handleSubmit}
                            className="p-6 flex flex-col gap-5 text-gray-800 dark:text-gray-200"
                        >
                            {!isAuthenticated ? (
                                <LoginSimulator onLoginSuccess={handleLoginSuccess} />
                            ) : (
                                <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center space-x-3 text-green-700 dark:text-green-300 font-medium border border-green-300 dark:border-green-700 shadow-md">
                                    <UserIcon className="h-5 w-5 flex-shrink-0" />
                                    <span className="truncate">Sesión iniciada como: **{userName}**</span>
                                </div>
                            )}
                         
                            <div className="space-y-4">
                                <div>
                                    <label className="block font-semibold mb-1 text-sm">Tu Nombre</label>
                                    <input
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        readOnly={isAuthenticated} 
                                        className={`w-full p-3 rounded-lg border-2 text-sm transition ${
                                            isAuthenticated 
                                                ? "border-green-500 bg-green-50 dark:bg-green-900/10 text-green-700 font-bold cursor-default" 
                                                : "border-gray-300 dark:border-gray-700 dark:bg-gray-800 focus:border-blue-500 focus:ring-blue-500"
                                        }`}
                                        placeholder={isAuthenticated ? "Nombre jalado automáticamente" : "Ejemplo: Juan Pérez"}
                                    />
                                    {isAuthenticated && <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Este campo no es editable al estar autenticado.</p>}
                                </div>

                                <div>
                                    <label className="block font-semibold mb-1 text-sm">Título (Max 40 chars)</label>
                                    <input
                                        ref={inputRef}
                                        name="title"
                                        value={formData.title}
                                        onChange={handleChange}
                                        className="w-full p-3 rounded-lg border-2 border-gray-300 dark:border-gray-700 dark:bg-gray-800 disabled:bg-gray-100 dark:disabled:bg-gray-700/50 focus:border-blue-500 focus:ring-blue-500 transition"
                                        placeholder="Máximo 40 caracteres para el título de tu reseña..."
                                        disabled={isFormDisabled}
                                    />
                                </div>

                                <div>
                                    <label className="block font-semibold mb-1 text-sm">Contenido de la Reseña</label>
                                    <textarea
                                        name="body"
                                        value={formData.body}
                                        onChange={handleChange}
                                        rows="5"
                                        className="w-full p-3 rounded-lg border-2 border-gray-300 dark:border-gray-700 dark:bg-gray-800 disabled:bg-gray-100 dark:disabled:bg-gray-700/50 resize-none focus:border-blue-500 focus:ring-blue-500 transition"
                                        placeholder={isFormDisabled ? "Inicia sesión para escribir tu reseña..." : "Describe tu experiencia (máximo 200 palabras)..."}
                                        disabled={isFormDisabled}
                                    />
                                    <p className="text-right text-xs text-gray-500 dark:text-gray-400 mt-1">
                                        {bodyWordCount} / 200 palabras
                                    </p>
                                </div>
                            </div>
                            <div className="flex justify-between items-center bg-gray-50 dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-inner">
                                <div>
                                    <label className="block font-extrabold mb-2 text-md text-gray-800 dark:text-gray-100">
                                        ¿Cómo Calificarías?
                                    </label>
                                    <StarSelector
                                        value={formData.stars}
                                        onChange={(value) =>
                                            isFormDisabled ? null : setFormData({ ...formData, stars: value })
                                        }
                                        disabled={isFormDisabled} 
                                    />
                                </div>
                                <ProfileAvatar stars={formData.stars} />
                            </div>
                            {formError && (
                                <motion.div 
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className={`flex items-center p-3 rounded-xl text-sm font-medium shadow-md ${
                                        formError.includes("Gracias") 
                                            ? "text-green-700 bg-green-100 dark:bg-green-900/30 dark:text-green-300 border border-green-300"
                                            : "text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-300 border border-red-300"
                                        }`}
                                >
                                    <ExclamationTriangleIcon className="h-5 w-5 mr-3 flex-shrink-0" />
                                    <span>{formError}</span>
                                </motion.div>
                            )}
                            <button
                                type="submit"
                                disabled={isFormDisabled} 
                                className={`w-full mt-3 font-bold py-3 rounded-xl transition shadow-xl ${
                                    isFormDisabled
                                        ? "bg-gray-400 text-gray-700 cursor-not-allowed shadow-gray-500/50"
                                        : "bg-yellow-500 text-gray-900 hover:bg-yellow-600 shadow-yellow-500/50 hover:shadow-yellow-600/70 active:scale-[.99]"
                                }`}
                            >
                                Enviar Reseña
                            </button>
                        </form>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}

// --- Componente de Tarjeta de Reseña Individual ---
function ReviewCard({ review }) {
    const config = useRatingConfig(review.stars);

    const starsDisplay = Array.from({ length: 5 }).map((_, i) => (
        <StarIcon
            key={i}
            className={`h-4 w-4 ${i < review.stars ? 'text-yellow-500' : 'text-gray-300 dark:text-gray-600'}`}
        />
    ));

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 100, damping: 12 }}
            className="p-5 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 flex flex-col gap-3"
        >
            <div className="flex justify-between items-start">
                <div>
                    <div className="flex items-center gap-1 mb-1">
                        {starsDisplay}
                        <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 ml-1">
                            {review.stars}/5
                        </span>
                    </div>
                    <h3 className="text-xl font-extrabold text-gray-900 dark:text-gray-100 leading-tight">
                        {review.title}
                    </h3>
                </div>
                <div className="text-right">
                    <ProfileAvatar stars={review.stars} />
                </div>
            </div>
            
            <p className="text-gray-700 dark:text-gray-300 text-sm italic">
                "{review.body}"
            </p>

            <div className="pt-2 border-t border-gray-100 dark:border-gray-700/50">
                <p className="text-xs font-bold" style={{color: config.color}}>
                    — {review.name}
                </p>
                <p className="text-xs text-gray-400">
                    {new Date(review.id).toLocaleDateString()}
                </p>
            </div>
        </motion.div>
    );
}

// --- Componente Principal de la Aplicación (App) ---
export default function App() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [comments, setComments] = useState([
        { id: 1, title: "El Mejor Servicio de mi Vida", body: "La atención al cliente fue insuperable y el producto superó mis expectativas. Lo recomiendo totalmente a todos mis amigos y familia.", stars: 5, name: "María González" },
        { id: 2, title: "Un poco lento, pero aceptable", body: "Tuve que esperar un poco para que me atendieran, pero una vez que lo hicieron, la persona fue muy amable. Mejorar tiempos de respuesta.", stars: 3, name: "Carlos Fuentes" },
        { id: 3, title: "Necesita mejorar urgentemente", body: "El producto llegó dañado y la comunicación para el reembolso ha sido caótica. Siento que perdí mi tiempo y dinero.", stars: 1, name: "Ana Soto" },
    ]);

    const handleAddComment = (newComment) => {
        // Añade el nuevo comentario al principio de la lista
        setComments(prevComments => [newComment, ...prevComments]);
    };

    const averageRating = useMemo(() => {
        if (comments.length === 0) return 0;
        const totalStars = comments.reduce((sum, comment) => sum + comment.stars, 0);
        return (totalStars / comments.length).toFixed(1);
    }, [comments]);

    const ratingConfig = useRatingConfig(Math.round(averageRating));

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 font-sans p-4 sm:p-8 transition-colors duration-300">
            <div className="max-w-4xl mx-auto">
                {/* Encabezado y Resumen */}
                <header className="text-center mb-10 p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border-t-4 border-yellow-500">
                    <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-2">
                        Sistema de Reseñas Dinámico
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                        Simulación de un formulario de reseña con autenticación y UI adaptativa.
                    </p>

                    <div className="flex items-center justify-center space-x-4">
                        <ProfileAvatar stars={Math.round(averageRating)} />
                        <div className="text-left">
                            <p className="text-5xl font-black" style={{color: ratingConfig.color}}>
                                {averageRating} / 5
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                                Basado en {comments.length} reseñas
                            </p>
                        </div>
                    </div>
                </header>

                {/* Botón para Abrir el Formulario */}
                <div className="mb-8 text-center">
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center justify-center mx-auto space-x-2 bg-yellow-500 text-gray-900 font-bold py-3 px-8 rounded-full shadow-lg shadow-yellow-500/50 hover:bg-yellow-600 transition-all text-lg"
                    >
                        <PencilSquareIcon className="h-6 w-6" />
                        <span>Escribir Reseña</span>
                    </motion.button>
                </div>

                {/* Lista de Reseñas */}
                <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 border-b border-gray-300 dark:border-gray-700 pb-3">
                        Reseñas Recientes ({comments.length})
                    </h2>
                    {comments.map(comment => (
                        <ReviewCard key={comment.id} review={comment} />
                    ))}
                    {comments.length === 0 && (
                        <p className="text-center text-gray-500 dark:text-gray-400 p-10 border rounded-xl border-dashed">
                            Aún no hay reseñas. ¡Sé el primero en escribir una!
                        </p>
                    )}
                </div>
            </div>

            {/* Modal del Formulario */}
            <FormComent
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleAddComment}
            />
        </div>
    )
}
