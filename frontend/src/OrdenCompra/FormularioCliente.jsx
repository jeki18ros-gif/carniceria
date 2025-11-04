// src/components/FormularioCliente.jsx
import React, { useState } from 'react';
import { productos } from './productosData';
import { useTheme } from "../Theme/ThemeContext";

export function FormularioCliente({
  onSubmit,
  seleccionados = {},
  onRemoveItem
}) {
  const [comentarios, setComentarios] = useState('');
  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [correo, setCorreo] = useState('');
  const [direccion, setDireccion] = useState('');
  const [entrega, setEntrega] = useState('');
  const [fechaEntrega, setFechaEntrega] = useState('');
  const [horario, setHorario] = useState('');

  const { theme } = useTheme(); // Detecta modo actual: "light" o "dark"
  const isDark = theme === 'dark';

  return (
    <div
      className={`shadow-xl rounded-2xl p-6 max-w-3xl mx-auto transition-colors duration-300
        ${isDark ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'}
      `}
    >
      <h2 className="text-2xl font-semibold mb-4">Datos del Cliente</h2>

      <form onSubmit={onSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">

        {/* Campos del cliente */}
        <input
          required
          placeholder="Nombre y Apellido"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          className={`border rounded-md px-3 py-2 transition-colors duration-300
            ${isDark ? 'bg-gray-800 border-gray-700 text-gray-100' : 'bg-white border-gray-300 text-gray-900'}
          `}
        />

        <input
          required
          type="tel"
          placeholder="Número de Teléfono"
          value={telefono}
          onChange={(e) => setTelefono(e.target.value)}
          className={`border rounded-md px-3 py-2 transition-colors duration-300
            ${isDark ? 'bg-gray-800 border-gray-700 text-gray-100' : 'bg-white border-gray-300 text-gray-900'}
          `}
        />

        <input
          required
          type="email"
          placeholder="Correo Electrónico"
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
          className={`border rounded-md px-3 py-2 transition-colors duration-300
            ${isDark ? 'bg-gray-800 border-gray-700 text-gray-100' : 'bg-white border-gray-300 text-gray-900'}
          `}
        />

        <input
          required
          placeholder="Dirección"
          value={direccion}
          onChange={(e) => setDireccion(e.target.value)}
          className={`border rounded-md px-3 py-2 transition-colors duration-300
            ${isDark ? 'bg-gray-800 border-gray-700 text-gray-100' : 'bg-white border-gray-300 text-gray-900'}
          `}
        />

        <select
          required
          value={entrega}
          onChange={(e) => setEntrega(e.target.value)}
          className={`border rounded-md px-3 py-2 col-span-1 sm:col-span-2 transition-colors duration-300
            ${isDark ? 'bg-gray-800 border-gray-700 text-gray-100' : 'bg-white border-gray-300 text-gray-900'}
          `}
        >
          <option value="">Método de entrega</option>
          <option value="tienda">Recojo en tienda</option>
          <option value="domicilio">Envío a domicilio</option>
        </select>

        <input
          required
          type="date"
          value={fechaEntrega}
          onChange={(e) => setFechaEntrega(e.target.value)}
          className={`border rounded-md px-3 py-2 col-span-2 transition-colors duration-300
            ${isDark ? 'bg-gray-800 border-gray-700 text-gray-100' : 'bg-white border-gray-300 text-gray-900'}
          `}
        />

        <input
          type="time"
          value={horario}
          onChange={(e) => setHorario(e.target.value)}
          className={`border rounded-md px-3 py-2 col-span-2 transition-colors duration-300
            ${isDark ? 'bg-gray-800 border-gray-700 text-gray-100' : 'bg-white border-gray-300 text-gray-900'}
          `}
          placeholder="Horario preferido de entrega"
        />

        {/* Mensaje explicativo */}
        <div
          className={`col-span-2 rounded-lg p-4 text-sm transition-colors duration-300
            ${isDark
              ? 'bg-yellow-900 text-yellow-200'
              : 'bg-yellow-50 text-yellow-800'}
          `}
        >
          ⚠️ Los precios de los productos no están publicados porque pueden variar según la cantidad, corte, estado y otras especificaciones.  
          Después de enviar tu pedido, te enviaremos una cotización personalizada.
        </div>

        {/* Resumen del pedido */}
        <div
          className={`col-span-2 rounded-lg p-4 text-sm transition-colors duration-300
            ${isDark ? 'bg-gray-800' : 'bg-gray-50'}
          `}
        >
          <h3 className="font-semibold text-lg mb-2">Resumen de tu pedido:</h3>
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
                    alt={productoInfo?.nombre || item.nombre || 'Producto'}
                    className="w-12 h-12 object-cover rounded-md flex-shrink-0"
                    onError={(e) => { e.target.src = 'https://placehold.co/80x80/AAAAAA/FFFFFF?text=Item'; }}
                  />

                  <div className="flex-grow min-w-0">
                    <p className="font-semibold text-sm truncate">
                      {productoInfo?.nombre || item.nombre || 'Producto Desconocido'}
                    </p>
                  </div>

                  <button
                    onClick={() => onRemoveItem(id)}
                    className="text-red-500 hover:text-red-400 transition-colors font-bold text-lg p-1 leading-none"
                    title="Eliminar producto"
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
          placeholder="Comentarios adicionales (opcional)"
          value={comentarios}
          onChange={(e) => setComentarios(e.target.value)}
          className={`border rounded-md px-3 py-2 col-span-2 transition-colors duration-300
            ${isDark ? 'bg-gray-800 border-gray-700 text-gray-100' : 'bg-white border-gray-300 text-gray-900'}
          `}
        />

        {/* Botón */}
        <button
          type="submit"
          className="col-span-2 py-2 font-medium mt-4 bg-yellow-500 hover:bg-yellow-600 text-black rounded-lg transition-colors duration-300"
        >
          Enviar Pedido y Esperar Cotización
        </button>
      </form>
    </div>
  );
}
