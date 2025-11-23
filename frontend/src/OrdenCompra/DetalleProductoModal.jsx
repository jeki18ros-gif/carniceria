// src/components/DetalleProductoModal.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from "../Theme/ThemeContext";
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon } from '@heroicons/react/24/solid';
import '../styles/DetalleProductoModal.css';

export function DetalleProductoModal({ producto, productoEditar, onClose, onAddToCart }) {
  const { t } = useTranslation();
  const { theme } = useTheme();

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

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'unset'; };
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
  className={`detalle-modal-overlay fixed inset-0 flex items-start justify-center z-50 p-4 ah-theme overflow-y-auto ${theme === 'dark' ? 'dark-mode' : 'light-mode'}`}
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  exit={{ opacity: 0 }}
>
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 50, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
         className="detalle-modal relative max-w-5xl w-full max-h-[95vh] overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-6 p-6 md:p-8"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-dorado transition-colors z-10"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>

          {/* 🖼️ Imagen y descripción */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-4">
            <img src={producto.imagen} alt={producto.nombre} className="w-full max-w-sm h-auto max-h-96 object-contain rounded-2xl shadow-md"/>
            <div>
              <h2 className="text-3xl font-bold text-dorado tracking-wide mb-2">{producto.nombre}</h2>
              <p className="text-base leading-relaxed">{producto.descripcion}</p>
              <p className="text-xs mt-3 italic">{t('detalleProductoModal.image_note')}</p>
            </div>
          </div>

          {/* 🧾 Formulario */}
          <div className="flex flex-col space-y-5">
            <div className="flex-grow max-h-[80vh] md:max-h-[60vh] overflow-y-auto pr-2"> 
              
              {/* 🔢 Cantidad */}
              <label className="block text-sm font-medium mb-1">{t('detalleProductoModal.quantity.label')}</label>
              <div className="flex space-x-3 mb-4">
                <input
                  ref={inputRef}
                  type="number"
                  placeholder={t('detalleProductoModal.quantity.placeholder')}
                  value={cantidadValor}
                  onChange={(e) => { setCantidadValor(e.target.value); if (e.target.value.trim()) setError(false); }}
                  min="0.1"
                  step="any"
                  className={`flex-grow transition-all input-ah-theme ${error ? 'input-error' : 'input-normal'}`}
                />
                <select value={cantidadUnidad} onChange={(e) => setCantidadUnidad(e.target.value)} className="w-32 select-ah-theme">
                  <option value="kg">{t('detalleProductoModal.quantity.units.kg')}</option>
                  <option value="lb">{t('detalleProductoModal.quantity.units.lb')}</option>
                  <option value="unidad">{t('detalleProductoModal.quantity.units.units')}</option>
                  <option value="caja">{t('detalleProductoModal.quantity.units.boxes')}</option>
                </select>
              </div>
              {error && <p className="text-sm text-red-500 mt-1 mb-4">{t('detalleProductoModal.quantity.invalid')}</p>}

              {/* 🍖 Presentación */}
              <h4 className="text-md font-semibold mt-5 mb-2 text-dorado">{t('detalleProductoModal.sections.presentacion.title')}</h4>
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div>
                  <label className="block text-sm mb-1">{t('detalleProductoModal.sections.presentacion.tipo_corte.label')}</label>
                  <select value={tipoCorte} onChange={(e) => setTipoCorte(e.target.value)} className="w-full select-ah-theme">
                    <option value="">{t('detalleProductoModal.sections.presentacion.tipo_corte.options.select')}</option>
                    <option value="fileteado">{t('detalleProductoModal.sections.presentacion.tipo_corte.options.fileteado')}</option>
                    <option value="en trozos">{t('detalleProductoModal.sections.presentacion.tipo_corte.options.trozos')}</option>
                    <option value="molido">{t('detalleProductoModal.sections.presentacion.tipo_corte.options.molido')}</option>
                    <option value="en tiras">{t('detalleProductoModal.sections.presentacion.tipo_corte.options.tiras')}</option>
                    <option value="entero">{t('detalleProductoModal.sections.presentacion.tipo_corte.options.entero')}</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm mb-1">{t('detalleProductoModal.sections.presentacion.parte_especifica.label')}</label>
                  <select value={parte} onChange={(e) => setParte(e.target.value)} className="w-full select-ah-theme">
                    <option value="">{t('detalleProductoModal.sections.presentacion.tipo_corte.options.select')}</option>
                    <option value="lomo fino">{t('detalleProductoModal.sections.presentacion.parte_especifica.options.lomo_fino')}</option>
                    <option value="costilla">{t('detalleProductoModal.sections.presentacion.parte_especifica.options.costilla')}</option>
                    <option value="pierna">{t('detalleProductoModal.sections.presentacion.parte_especifica.options.pierna')}</option>
                    <option value="pecho">{t('detalleProductoModal.sections.presentacion.parte_especifica.options.pecho')}</option>
                  </select>
                </div>
              </div>

              {/* ❄️ Estado del producto */}
              <h4 className="text-md font-semibold mt-5 mb-2 text-dorado">{t('detalleProductoModal.sections.estado_producto.title')}</h4>
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div>
                  <label className="block text-sm mb-1">{t('detalleProductoModal.sections.estado_producto.estado.label')}</label>
                  <select value={estado} onChange={(e) => setEstado(e.target.value)} className="w-full select-ah-theme">
                    <option value="">{t('detalleProductoModal.sections.presentacion.tipo_corte.options.select')}</option>
                    <option value="fresca">{t('detalleProductoModal.sections.estado_producto.estado.options.fresca')}</option>
                    <option value="congelada">{t('detalleProductoModal.sections.estado_producto.estado.options.congelada')}</option>
                    <option value="curada">{t('detalleProductoModal.sections.estado_producto.estado.options.curada')}</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm mb-1">{t('detalleProductoModal.sections.estado_producto.hueso.label')}</label>
                  <select value={hueso} onChange={(e) => setHueso(e.target.value)} className="w-full select-ah-theme">
                    <option value="">{t('detalleProductoModal.sections.presentacion.tipo_corte.options.select')}</option>
                    <option value="con hueso">{t('detalleProductoModal.sections.estado_producto.hueso.options.con_hueso')}</option>
                    <option value="sin hueso">{t('detalleProductoModal.sections.estado_producto.hueso.options.sin_hueso')}</option>
                  </select>
                </div>
              </div>

              {/* 📦 Empaque y grasa */}
              <h4 className="text-md font-semibold mt-5 mb-2 text-dorado">{t('detalleProductoModal.sections.empaque_grasa.title')}</h4>
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div>
                  <label className="block text-sm mb-1">{t('detalleProductoModal.sections.empaque_grasa.empaque.label')}</label>
                  <select value={empaque} onChange={(e) => setEmpaque(e.target.value)} className="w-full select-ah-theme">
                    <option value="">{t('detalleProductoModal.sections.presentacion.tipo_corte.options.select')}</option>
                    <option value="al vacio">{t('detalleProductoModal.sections.empaque_grasa.empaque.options.vacuum')}</option>
                    <option value="bandeja">{t('detalleProductoModal.sections.empaque_grasa.empaque.options.tray')}</option>
                    <option value="bolsa">{t('detalleProductoModal.sections.empaque_grasa.empaque.options.bag')}</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm mb-1">{t('detalleProductoModal.sections.empaque_grasa.grasa.label')}</label>
                  <select value={grasa} onChange={(e) => setGrasa(e.target.value)} className="w-full select-ah-theme">
                    <option value="">{t('detalleProductoModal.sections.presentacion.tipo_corte.options.select')}</option>
                    <option value="con grasa">{t('detalleProductoModal.sections.empaque_grasa.grasa.options.con_grasa')}</option>
                    <option value="sin grasa">{t('detalleProductoModal.sections.empaque_grasa.grasa.options.sin_grasa')}</option>
                  </select>
                </div>
              </div>

              {/* 🔥 Tipo de cocción */}
              <h4 className="text-md font-semibold mt-5 mb-2 text-dorado">{t('detalleProductoModal.sections.tipo_coccion.title')}</h4>
              <select value={coccion} onChange={(e) => setCoccion(e.target.value)} className="w-full select-ah-theme mb-4">
                <option value="">{t('detalleProductoModal.sections.presentacion.tipo_corte.options.select')}</option>
                <option value="a la parrilla">{t('detalleProductoModal.sections.tipo_coccion.options.parrilla')}</option>
                <option value="al horno">{t('detalleProductoModal.sections.tipo_coccion.options.horno')}</option>
                <option value="guisado">{t('detalleProductoModal.sections.tipo_coccion.options.guisado')}</option>
                <option value="frito">{t('detalleProductoModal.sections.tipo_coccion.options.frito')}</option>
                <option value="otros">{t('detalleProductoModal.sections.tipo_coccion.options.otros')}</option>
              </select>

              {/* 📅 Entrega */}
              <h4 className="text-md font-semibold mt-5 mb-2 text-dorado">{t('PreferenciasCliente.fields.delivery.title', 'Entrega y observaciones')}</h4>
              <label className="block text-sm mb-1">{t('PreferenciasCliente.fields.delivery.date', 'Fecha deseada')}</label>
              <input
                type="date"
                value={fechaDeseada}
                onChange={(e) => setFechaDeseada(e.target.value)}
                className="w-full input-ah-theme mb-4"
              />

              <label className="block text-sm mt-4 mb-1">{t('PreferenciasCliente.fields.comments.label', 'Comentarios adicionales')}</label>
              <textarea
                placeholder={t('PreferenciasCliente.fields.comments.placeholder')}
                value={observacion}
                onChange={(e) => setObservacion(e.target.value)}
                className="w-full min-h-24 resize-none input-ah-theme"
              />
            </div>

            {/* Botón */}
            <motion.button
              onClick={handleAdd}
              whileTap={{ scale: 0.95 }}
              className="w-full py-3 text-lg boton-dorado disabled:opacity-60 disabled:cursor-not-allowed mt-4"
              disabled={error || !cantidadValor.trim()}
            >
              {productoEditar
                ? t('detalleProductoModal.update_button', 'Actualizar Orden')
                : t('detalleProductoModal.add_button', 'Añadir a la Orden')}
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
