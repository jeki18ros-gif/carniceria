// src/components/DetalleProductoModal.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from "../Theme/ThemeContext";
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon } from '@heroicons/react/24/solid';
import '../styles/DetalleProductoModal.css';

export function DetalleProductoModal({ producto, productoEditar, onClose, onAddToCart }) {
  const [cantidadValor, setCantidadValor] = useState('');
  const [cantidadUnidad, setCantidadUnidad] = useState('kg');
  const [tipoCorte, setTipoCorte] = useState('');
  const [parte, setParte] = useState('');
  const [estado, setEstado] = useState('');
  const [hueso, setHueso] = useState('');
  const [grasa, setGrasa] = useState('');
  const [empaque, setEmpaque] = useState('');
  const [coccion, setCoccion] = useState('');
  const [fechaDeseada, setFechaDeseada] = useState('');
  const [observacion, setObservacion] = useState('');
  const [error, setError] = useState(false);
  const inputRef = useRef(null);
  const { theme } = useTheme();

  // useEffect para bloquear/desbloquear scroll del body
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'unset'; }
  }, []);

  useEffect(() => {
    if (!producto) return;

    if (productoEditar) {
      setCantidadValor(productoEditar.cantidadValor || '');
      setCantidadUnidad(productoEditar.cantidadUnidad || 'kg');
      const esp = productoEditar.especificaciones || {};
      setTipoCorte(esp.tipoCorte || '');
      setParte(esp.parte || '');
      setEstado(esp.estado || '');
      setHueso(esp.hueso || '');
      setGrasa(esp.grasa || '');
      setEmpaque(esp.empaque || '');
      setCoccion(esp.coccion || '');
      setFechaDeseada(esp.fechaDeseada || '');
      setObservacion(esp.observacion || '');
    } else {
      setCantidadValor('');
      setCantidadUnidad('kg');
      setTipoCorte('');
      setParte('');
      setEstado('');
      setHueso('');
      setGrasa('');
      setEmpaque('');
      setCoccion('');
      setFechaDeseada('');
      setObservacion('');
    }

    if (inputRef.current) inputRef.current.focus();
  }, [producto, productoEditar]);

  if (!producto) return null;

  const handleAdd = () => {
    if (!cantidadValor.trim()) {
      setError(true);
      return;
    }

    const cantidadCompleta = `${cantidadValor.trim()} ${cantidadUnidad}`;
    const especificaciones = { tipoCorte, parte, estado, hueso, grasa, empaque, coccion, fechaDeseada, observacion };

    onAddToCart(producto.id, cantidadCompleta, especificaciones);
    onClose();
  };
    return (
    <AnimatePresence>
      <motion.div
        role="dialog"
        aria-modal="true"
        className={`detalle-modal-overlay fixed inset-0 flex items-center justify-center z-50 p-4 ah-theme ${theme === 'dark' ? 'dark-mode' : 'light-mode'}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 50, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="detalle-modal relative max-w-5xl w-full overflow-hidden grid grid-cols-1 md:grid-cols-2 gap-6 p-6 md:p-8"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-dorado transition-colors z-10"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>

          <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-4">
            <img src={producto.imagen} alt={producto.nombre} className="w-full max-w-sm h-auto max-h-96 object-contain rounded-2xl shadow-md"/>
            <div>
              <h2 className="text-3xl font-bold text-dorado tracking-wide mb-2">{producto.nombre}</h2>
              <p className="text-base leading-relaxed">{producto.descripcion}</p>
              <p className="text-xs mt-3 italic">La imagen es referencial.</p>
            </div>
          </div>

          <div className="flex flex-col space-y-5">
            <div className="flex-grow max-h-[80vh] md:max-h-[60vh] overflow-y-auto pr-2"> 
              {/* 🔢 Cantidad */}
              <label className="block text-sm font-medium mb-1">Cantidad requerida</label>
              <div className="flex space-x-3 mb-4">
                <input
                  ref={inputRef}
                  type="number"
                  placeholder="Ej: 2 o 0.5"
                  value={cantidadValor}
                  onChange={(e) => { setCantidadValor(e.target.value); if (e.target.value.trim()) setError(false); }}
                  min="0.1"
                  step="any"
                  className={`flex-grow transition-all input-ah-theme ${error ? 'input-error' : 'input-normal'}`}
                />
                <select value={cantidadUnidad} onChange={(e) => setCantidadUnidad(e.target.value)} className="w-32 select-ah-theme">
                  <option value="kg">Kilos (kg)</option>
                  <option value="lb">Libras (lb)</option>
                  <option value="unidad">Unidades</option>
                  <option value="caja">Cajas</option>
                </select>
              </div>
              {error && <p className="text-sm text-red-500 mt-1 mb-4">⚠️ Por favor, indica una cantidad válida.</p>}

              {/* 🍖 Presentación */}
              <h4 className="text-md font-semibold mt-5 mb-2 text-dorado">Presentación</h4>
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div>
                  <label className="block text-sm mb-1">Tipo de corte</label>
                  <select
                    value={tipoCorte}
                    onChange={(e) => setTipoCorte(e.target.value)}
                    // ✨ Clase para adaptar el select al tema
                    className="w-full select-ah-theme"
                  >
                    <option value="">Seleccionar...</option>
                    <option value="fileteado">Fileteado</option>
                    <option value="en trozos">En trozos</option>
                    <option value="molido">Molido</option>
                    <option value="en tiras">En tiras</option>
                    <option value="entero">Entero</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm mb-1">Parte específica</label>
                  <select
                    value={parte}
                    onChange={(e) => setParte(e.target.value)}
                    // ✨ Clase para adaptar el select al tema
                    className="w-full select-ah-theme"
                  >
                    <option value="">Seleccionar...</option>
                    <option value="lomo fino">Lomo fino</option>
                    <option value="costilla">Costilla</option>
                    <option value="pierna">Pierna</option>
                    <option value="entero">Entero</option>
                    <option value="pecho">Pecho</option>
                  </select>
                </div>
              </div>

              {/* ❄️ Estado del producto */}
              <h4 className="text-md font-semibold mt-5 mb-2 text-dorado">Estado del producto</h4>
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div>
                  <label className="block text-sm mb-1">Estado</label>
                  <select
                    value={estado}
                    onChange={(e) => setEstado(e.target.value)}
                    // ✨ Clase para adaptar el select al tema
                    className="w-full select-ah-theme"
                  >
                    <option value="">Seleccionar...</option>
                    <option value="fresca">Fresca</option>
                    <option value="congelada">Congelada</option>
                    <option value="curada">Curada</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm mb-1">Con hueso o sin hueso</label>
                  <select
                    value={hueso}
                    onChange={(e) => setHueso(e.target.value)}
                    // ✨ Clase para adaptar el select al tema
                    className="w-full select-ah-theme"
                  >
                    <option value="">Seleccionar...</option>
                    <option value="con hueso">Con hueso</option>
                    <option value="sin hueso">Sin hueso</option>
                  </select>
                </div>
              </div>

              {/* 📦 Empaque y grasa */}
              <h4 className="text-md font-semibold mt-5 mb-2 text-dorado">Empaque y grasa</h4>
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div>
                  <label className="block text-sm mb-1">Empaque</label>
                  <select
                    value={empaque}
                    onChange={(e) => setEmpaque(e.target.value)}
                    // ✨ Clase para adaptar el select al tema
                    className="w-full select-ah-theme"
                  >
                    <option value="">Seleccionar...</option>
                    <option value="al vacio">Al vacío</option>
                    <option value="bandeja">Bandeja</option>
                    <option value="bolsa">Bolsa</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm mb-1">Grasa</label>
                  <select
                    value={grasa}
                    onChange={(e) => setGrasa(e.target.value)}
                    // ✨ Clase para adaptar el select al tema
                    className="w-full select-ah-theme"
                  >
                    <option value="">Seleccionar...</option>
                    <option value="con grasa">Con grasa</option>
                    <option value="sin grasa">Sin grasa</option>
                  </select>
                </div>
              </div>

              {/* 🔥 Tipo de cocción */}
              <h4 className="text-md font-semibold mt-5 mb-2 text-dorado">Tipo de cocción</h4>
              <select
                value={coccion}
                onChange={(e) => setCoccion(e.target.value)}
                // ✨ Clase para adaptar el select al tema
                className="w-full select-ah-theme mb-4"
              >
                <option value="">Seleccionar...</option>
                <option value="a la parrilla">A la parrilla</option>
                <option value="al horno">Al horno</option>
                <option value="guisado">Guisado</option>
                <option value="frito">Frito</option>
                <option value="otros">Otros</option>
              </select>

              {/* 📅 Entrega */}
              <h4 className="text-md font-semibold mt-5 mb-2 text-dorado">Entrega y observaciones</h4>
              <label className="block text-sm mb-1">Fecha deseada</label>
              <input
                type="date"
                value={fechaDeseada}
                onChange={(e) => setFechaDeseada(e.target.value)}
                // ✨ Clase para adaptar el input al tema
                className="w-full input-ah-theme mb-4"
              />

              <label className="block text-sm mt-4 mb-1">Comentarios adicionales</label>
              <textarea
                placeholder="Ej: filetes de 2 cm, empaquetado doble, recojo en tienda sábado 4 p.m."
                value={observacion}
                onChange={(e) => setObservacion(e.target.value)}
                // ✨ Clase para adaptar el textarea al tema
                className="w-full min-h-24 resize-none input-ah-theme"
              />
            </div>
            {/* Fin de contenedor con scroll */}

            {/* Botón de Añadir (fuera del scroll) */}
           <motion.button
              onClick={handleAdd}
              whileTap={{ scale: 0.95 }}
              className="w-full py-3 text-lg boton-dorado disabled:opacity-60 disabled:cursor-not-allowed mt-4"
              disabled={error || !cantidadValor.trim()}
            >
              {productoEditar ? 'Actualizar Orden' : 'Añadir a la Orden'}
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}