// src/components/FormularioCliente.jsx
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useProductosData } from './productosData';
import { useTheme } from "../Theme/ThemeContext";
import { ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

export function FormularioCliente({
  onSubmit,
  seleccionados = {},
  onRemoveItem,
  onGoBack
}) {
  const [comentarios, setComentarios] = useState('');
  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [correo, setCorreo] = useState('');
  const [direccion, setDireccion] = useState('');
  const [entrega, setEntrega] = useState('');
  const [fechaEntrega, setFechaEntrega] = useState('');
  const [horario, setHorario] = useState('');
  
  const { productos } = useProductosData();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  const { t } = useTranslation();

  return (
    <div
      className={`shadow-xl rounded-2xl p-4 sm:p-6 max-w-3xl mx-auto transition-colors duration-300
        ${isDark ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'}
      `}
    >

      {/* Botón volver */}
      <motion.button
        onClick={onGoBack}
        className={`
          flex items-center gap-2 text-base mb-5 font-medium transition-colors
          p-2 sm:p-3 rounded-full
          ${isDark 
            ? 'text-yellow-400 hover:text-yellow-300' 
            : 'text-yellow-600 hover:text-yellow-700'}
        `}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label={t('formularioCliente.actions.go_back')}
      >
        <ArrowLeft className="w-5 h-5" />
        {t('formularioCliente.actions.go_back')}
      </motion.button>

      <h2 className="text-2xl font-semibold mb-4">
        {t('formularioCliente.title')}
      </h2>

      {/* FORMULARIO */}
      <form 
        onSubmit={onSubmit} 
        className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6"
      >

        {/* Inputs generales (más cómodos) */}
        <input
          required
          placeholder={t('formularioCliente.fields.name.placeholder')}
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          className={`border rounded-md px-3 py-3 text-base w-full 
            ${isDark ? 'bg-gray-800 border-gray-700 text-gray-100' 
                     : 'bg-white border-gray-300 text-gray-900'}
          `}
        />

        <input
          required
          type="tel"
          placeholder={t('formularioCliente.fields.phone.placeholder')}
          value={telefono}
          onChange={(e) => setTelefono(e.target.value)}
          className={`border rounded-md px-3 py-3 text-base w-full
            ${isDark ? 'bg-gray-800 border-gray-700 text-gray-100' 
                     : 'bg-white border-gray-300 text-gray-900'}
          `}
        />

        <input
          required
          type="email"
          placeholder={t('formularioCliente.fields.email.placeholder')}
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
          className={`border rounded-md px-3 py-3 text-base w-full
            ${isDark ? 'bg-gray-800 border-gray-700 text-gray-100' 
                     : 'bg-white border-gray-300 text-gray-900'}
          `}
        />

        <input
          required
          placeholder={t('formularioCliente.fields.address.placeholder')}
          value={direccion}
          onChange={(e) => setDireccion(e.target.value)}
          className={`border rounded-md px-3 py-3 text-base w-full
            ${isDark ? 'bg-gray-800 border-gray-700 text-gray-100' 
                     : 'bg-white border-gray-300 text-gray-900'}
          `}
        />

        <select
          required
          value={entrega}
          onChange={(e) => setEntrega(e.target.value)}
          className={`border rounded-md px-3 py-3 text-base col-span-1 sm:col-span-2
            ${isDark ? 'bg-gray-800 border-gray-700 text-gray-100' 
                     : 'bg-white border-gray-300 text-gray-900'}
          `}
        >
          <option value="">{t('formularioCliente.fields.delivery_method.label')}</option>
          <option value="tienda">{t('formularioCliente.fields.delivery_method.options.pickup')}</option>
          <option value="domicilio">{t('formularioCliente.fields.delivery_method.options.delivery')}</option>
        </select>

        <input
          required
          type="date"
          value={fechaEntrega}
          onChange={(e) => setFechaEntrega(e.target.value)}
          className={`border rounded-md px-3 py-3 text-base col-span-2
            ${isDark ? 'bg-gray-800 border-gray-700 text-gray-100' 
                     : 'bg-white border-gray-300 text-gray-900'}
          `}
        />

        <input
          type="time"
          value={horario}
          onChange={(e) => setHorario(e.target.value)}
          className={`border rounded-md px-3 py-3 text-base col-span-2
            ${isDark ? 'bg-gray-800 border-gray-700 text-gray-100' 
                     : 'bg-white border-gray-300 text-gray-900'}
          `}
        />

        {/* Advertencia */}
        <div
          className={`col-span-2 rounded-lg p-4 text-sm transition-colors
            ${isDark 
              ? 'bg-yellow-900 text-yellow-200' 
              : 'bg-yellow-50 text-yellow-800'}
          `}
        >
          {t('formularioCliente.warnings.pricing')}
        </div>

        {/* Resumen del pedido */}
        <div
          className={`col-span-2 rounded-lg p-4 text-sm
            ${isDark ? 'bg-gray-800' : 'bg-gray-50'}
          `}
        >
          <h3 className="font-semibold text-lg mb-2">
            {t('formularioCliente.summary_title')}
          </h3>

          <div className="flex flex-col gap-3 max-h-64 overflow-y-auto pr-1">
            {Object.entries(seleccionados).map(([idStr, item]) => {
              const id = parseInt(idStr);
              const productoInfo = productos.find(p => p.id === id);

              return (
                <div
                  key={id}
                  className={`flex items-center gap-3 border-b border-dashed pb-2
                    ${isDark ? 'border-gray-700' : 'border-gray-300'}
                  `}
                >
                  <img
                    src={productoInfo?.imagen || 'https://placehold.co/80x80/AAAAAA/FFFFFF?text=Item'}
                    alt={productoInfo?.nombre || item.nombre}
                    className="w-12 h-12 object-cover rounded-md flex-shrink-0"
                    onError={(e) => { e.target.src = 'https://placehold.co/80x80/AAAAAA/FFFFFF?text=Item'; }}
                  />

                  <div className="flex-grow min-w-0">
                    <p className="font-semibold text-sm truncate">
                      {productoInfo?.nombre || item.nombre}
                    </p>
                  </div>

                  <button
                    onClick={() => onRemoveItem(id)}
                    className="text-red-500 hover:text-red-400 transition-colors font-bold text-lg p-1 leading-none"
                    title={t('formularioCliente.actions.delete_item')}
                  >
                    X
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Comentarios */}
        <textarea
          placeholder={t('formularioCliente.fields.comments.placeholder')}
          value={comentarios}
          onChange={(e) => setComentarios(e.target.value)}
          className={`border rounded-md px-3 py-3 col-span-2 text-base
            ${isDark ? 'bg-gray-800 border-gray-700 text-gray-100' 
                     : 'bg-white border-gray-300 text-gray-900'}
          `}
        />

        {/* Botón enviar */}
        <button
          type="submit"
          className="col-span-2 py-3 font-semibold mt-4 bg-yellow-500 hover:bg-yellow-600 text-black rounded-lg transition-colors"
        >
          {t('formularioCliente.actions.submit')}
        </button>

      </form>
    </div>
  );
}
