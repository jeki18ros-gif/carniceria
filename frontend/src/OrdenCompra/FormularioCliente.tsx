// src/components/FormularioCliente.tsx
import React, { FormEvent } from 'react';

interface FormularioClienteProps {
  onSubmit: (e: FormEvent) => void;
}

export function FormularioCliente({ onSubmit }: FormularioClienteProps) {
  return (
    // Usa 'light-block' para el contenedor principal: fondo adaptativo (cremita/oscuro) y sombra
    <div className="light-block shadow-xl rounded-2xl p-6 max-w-3xl mx-auto">
      {/* El color del texto se adapta automáticamente gracias a 'light-block' */}
      <h2 className="text-2xl font-semibold mb-4">Datos del Cliente</h2>
      <form onSubmit={onSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* === Campos de Formulario === */}
        <input 
          required 
          placeholder="Nombre y Apellido" 
          // Se usa 'medium-block' para el fondo del campo (gris claro/oscuro)
          className="medium-block border rounded-md px-3 py-2" 
        />
        <input 
          required 
          type="tel" 
          placeholder="Número de Teléfono" 
          className="medium-block border rounded-md px-3 py-2" 
        />
        <input 
          required 
          type="email" 
          placeholder="Correo Electrónico" 
          className="medium-block border rounded-md px-3 py-2" 
        />
        <input 
          required 
          placeholder="Dirección" 
          className="medium-block border rounded-md px-3 py-2" 
        />
        
        <select 
          required 
          className="medium-block border rounded-md px-3 py-2 col-span-1 sm:col-span-2"
        >
          <option value="">Método de entrega</option>
          <option value="tienda">Recojo en tienda</option>
          <option value="domicilio">Envío a domicilio</option>
        </select>
        
        <input 
          required 
          type="date" 
          className="medium-block border rounded-md px-3 py-2 col-span-2" 
        />
        <textarea 
          placeholder="Comentarios adicionales (opcional)" 
          className="medium-block border rounded-md px-3 py-2 col-span-2" 
        />
        
        {/* === Botón de Envío === */}
        <button
          type="submit"
          // Se usa la clase 'btn' para aplicar el estilo dorado adaptativo con transiciones
          className="col-span-2 py-2 font-medium mt-4 btn"
        >
          Enviar Orden de Compra
        </button>
      </form>
    </div>
  );
}