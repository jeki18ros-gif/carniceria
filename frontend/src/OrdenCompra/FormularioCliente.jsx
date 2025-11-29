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
  const { t } = useTranslation();

  const handleSubmit = (e) => {
    e.preventDefault();
    const datosCliente = {
      nombre,
      telefono,
      correo,
      direccion,
      entrega,
      fechaEntrega,
      horario,
      comentarios
    };
    // CAMBIO AQUÍ: Enviamos datosCliente y seleccionados al padre.
    onSubmit(e, datosCliente, seleccionados);
  };

  const isDark = theme === 'dark';

  const inputStyle = `
    border rounded-xl px-4 py-3 text-lg min-w-full
    ${isDark ? 'bg-gray-800 border-gray-700 text-gray-100' 
             : 'bg-white border-gray-300 text-gray-900'}
  `;

  return (
    <div
      className={`
        shadow-xl rounded-2xl p-6 sm:p-8 max-w-3xl mx-auto transition-colors duration-300
        ${isDark ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'}
      `}
    >

      {/* Botón volver */}
      <motion.button
        onClick={onGoBack}
        className={`
          flex items-center gap-2 text-lg mb-6 font-medium transition-colors
          p-2 sm:p-3 rounded-full
          ${isDark 
            ? 'text-yellow-400 hover:text-yellow-300' 
            : 'text-yellow-600 hover:text-yellow-700'}
        `}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <ArrowLeft className="w-6 h-6" />
        {t('formularioCliente.actions.go_back')}
      </motion.button>

      <h2 className="text-3xl font-bold mb-6">
        {t('formularioCliente.title')}
      </h2>

      {/* FORMULARIO */}
      <form 
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >

        {/* Inputs */}
        <input
          required
          placeholder={t('formularioCliente.fields.name.placeholder')}
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          className={inputStyle}
        />

        <input
          required
          type="tel"
          placeholder={t('formularioCliente.fields.phone.placeholder')}
          value={telefono}
          onChange={(e) => setTelefono(e.target.value)}
          className={inputStyle}
        />

        <input
          required
          type="email"
          placeholder={t('formularioCliente.fields.email.placeholder')}
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
          className={inputStyle}
        />

        <input
          required
          placeholder={t('formularioCliente.fields.address.placeholder')}
          value={direccion}
          onChange={(e) => setDireccion(e.target.value)}
          className={inputStyle}
        />

        <select
          required
          value={entrega}
          onChange={(e) => setEntrega(e.target.value)}
          className={`${inputStyle} md:col-span-2`}
        >
          <option value="">
            {t('formularioCliente.fields.delivery_method.label')}
          </option>
          <option value="tienda">
            {t('formularioCliente.fields.delivery_method.options.pickup')}
          </option>
          <option value="domicilio">
            {t('formularioCliente.fields.delivery_method.options.delivery')}
          </option>
        </select>

        <input
          required
          type="date"
          value={fechaEntrega}
          onChange={(e) => setFechaEntrega(e.target.value)}
          className={`${inputStyle} md:col-span-2`}
        />

        <input
          type="time"
          value={horario}
          onChange={(e) => setHorario(e.target.value)}
          className={`${inputStyle} md:col-span-2`}
        />

        {/* Advertencia */}
        <div
          className={`
            md:col-span-2 rounded-xl p-4 text-base transition-colors
            ${isDark 
              ? 'bg-yellow-900 text-yellow-200' 
              : 'bg-yellow-50 text-yellow-800'}
          `}
        >
          {t('formularioCliente.warnings.pricing')}
        </div>

        {/* Resumen */}
        <div
          className={`
            md:col-span-2 rounded-xl p-4
            ${isDark ? 'bg-gray-800' : 'bg-gray-50'}
          `}
        >
          <h3 className="font-semibold text-xl mb-4">
            {t('formularioCliente.summary_title')}
          </h3>

          <div className="flex flex-col gap-4 max-h-64 overflow-y-auto pr-1">
            {Object.entries(seleccionados).map(([idStr, item]) => {
              const id = parseInt(idStr);
              const productoInfo = productos.find(p => p.id === id);

              return (
                <div
                  key={id}
                  className={`
                    flex items-center gap-4 border-b border-dashed pb-3
                    ${isDark ? 'border-gray-700' : 'border-gray-300'}
                  `}
                >
                  <img
                    src={productoInfo?.imagen || 'https://placehold.co/80x80/AAAAAA/FFFFFF?text=Item'}
                    alt={productoInfo?.nombre || item.nombre}
                    className="w-14 h-14 object-cover rounded-lg flex-shrink-0"
                    onError={(e) => { e.target.src = 'https://placehold.co/80x80/AAAAAA/FFFFFF?text=Item'; }}
                  />

                  <div className="flex-grow min-w-0">
                    <p className="font-semibold text-lg truncate">
                      {productoInfo?.nombre || item.nombre}
                    </p>
                  </div>

                  <button
                    onClick={() => onRemoveItem(id)}
                    className="text-red-500 hover:text-red-400 transition-colors font-bold text-xl p-1 leading-none"
                    title={t('formularioCliente.actions.delete_item')}
                  >
                    ×
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
          className={`
            ${inputStyle} md:col-span-2 h-28 resize-none
          `}
        />

        {/* Enviar */}
        <button
          type="submit"
          className="md:col-span-2 py-4 mt-2 text-xl font-semibold bg-yellow-500 hover:bg-yellow-600 text-black rounded-xl transition-colors"
        >
          {t('formularioCliente.actions.submit')}
        </button>

      </form>
    </div>
  );
  }