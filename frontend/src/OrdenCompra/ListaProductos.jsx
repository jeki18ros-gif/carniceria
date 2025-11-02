// src/components/ListaProductos.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';

// --- 1. Importación de las Imágenes (Sin cambios) ---
import productoPlaceholder from '../assets/otros4.jpg'; 
import resImg from '../assets/otros1.jpg';
import cerdoImg from '../assets/otros2.jpg';
import polloImg from '../assets/otros3.jpg';
import embutidosImg from '../assets/otros4.jpg';
import ahumadosImg from '../assets/otros5.jpg';
import especialesImg from '../assets/otros6.jpg';
import verTodoImg from '../assets/relleno1.jpg'; 

// --- 2. Definiciones de Datos de Categorías y Productos (Sin cambios) ---
export const categoriasPrincipales = [
  { id: 1, nombre: 'Res', imagen: resImg, filtro: 'Res' },
  { id: 2, nombre: 'Cerdo', imagen: cerdoImg, filtro: 'Cerdo' },
  { id: 3, nombre: 'Pollo', imagen: polloImg, filtro: 'Pollo' },
  { id: 4, nombre: 'Embutidos', imagen: embutidosImg, filtro: 'Embutido' },
  { id: 5, nombre: 'Ahumados', imagen: ahumadosImg, filtro: 'Ahumado' },
  { id: 6, nombre: 'Especiales', imagen: especialesImg, filtro: 'Especial' },
];

export const productos = [
    // ----------------------------------------------------
    // CATEGORÍA: CARNE DE RES (10 Productos)
    // ----------------------------------------------------
    { id: 1, nombre: 'Lomo Fino', imagen: productoPlaceholder, descripcion: 'Corte suave ideal para parrillas o sartén.', categoria: 'Res' },
    { id: 2, nombre: 'Costillar de Res', imagen: productoPlaceholder, descripcion: 'Perfecto para asados y guisos.', categoria: 'Res' },
    { id: 4, nombre: 'Hamburguesa de Res', imagen: productoPlaceholder, descripcion: 'Ideal para parrillas y sandwiches gourmet.', categoria: 'Res' },
    { id: 8, nombre: 'Carne Molida de Res', imagen: productoPlaceholder, descripcion: 'Versátil para salsas, tacos y albóndigas.', categoria: 'Res' },
    { id: 10, nombre: 'Picanha de Res', imagen: productoPlaceholder, descripcion: 'Corte brasileño jugoso y sabroso para parrilla.', categoria: 'Res' },
    { id: 14, nombre: 'Filete de Res', imagen: productoPlaceholder, descripcion: 'Corte fino y suave, ideal para saltear o asar.', categoria: 'Res' },
    { id: 17, nombre: 'Ribeye', imagen: productoPlaceholder, descripcion: 'Corte premium con vetas de grasa que aportan sabor.', categoria: 'Res' },
    { id: 18, nombre: 'Chuletón', imagen: productoPlaceholder, descripcion: 'Corte grande y jugoso, perfecto para asados familiares.', categoria: 'Res' },
    { id: 21, nombre: 'T-Bone', imagen: productoPlaceholder, descripcion: 'Corte que combina solomillo y lomo, para la parrilla.', categoria: 'Res' },
    { id: 22, nombre: 'Entraña Fina', imagen: productoPlaceholder, descripcion: 'Sabor intenso, ideal para cocción rápida a la brasa.', categoria: 'Res' },

    // ----------------------------------------------------
    // CATEGORÍA: CARNE DE CERDO (8 Productos)
    // ----------------------------------------------------
    { id: 7, nombre: 'Costillas de Cerdo BBQ', imagen: productoPlaceholder, descripcion: 'Tiernas y con sabor ahumado, para barbacoa.', categoria: 'Cerdo' },
    { id: 12, nombre: 'Chuletas de Cerdo', imagen: productoPlaceholder, descripcion: 'Perfectas para sartén o parrilla, con mucho sabor.', categoria: 'Cerdo' },
    { id: 23, nombre: 'Lomo de Cerdo', imagen: productoPlaceholder, descripcion: 'Carne magra y versátil para hornear o rellenar.', categoria: 'Cerdo' },
    { id: 24, nombre: 'Panceta Curada', imagen: productoPlaceholder, descripcion: 'Ideal para dar sabor y textura crujiente a tus platos.', categoria: 'Cerdo' },
    { id: 25, nombre: 'Secreto Ibérico', imagen: productoPlaceholder, descripcion: 'Corte premium de cerdo, muy jugoso y sabroso.', categoria: 'Cerdo' },
    { id: 26, nombre: 'Paleta de Cerdo', imagen: productoPlaceholder, descripcion: 'Perfecta para estofados o para preparar pulled pork.', categoria: 'Cerdo' },
    { id: 27, nombre: 'Solomillo de Cerdo', imagen: productoPlaceholder, descripcion: 'El corte más tierno y magro del cerdo.', categoria: 'Cerdo' },
    { id: 28, nombre: 'Carrillera de Cerdo', imagen: productoPlaceholder, descripcion: 'Ideal para cocción lenta, muy melosa.', categoria: 'Cerdo' },

    // ----------------------------------------------------
    // CATEGORÍA: CARNE DE POLLO (8 Productos)
    // ----------------------------------------------------
    { id: 3, nombre: 'Pechuga de Pollo', imagen: productoPlaceholder, descripcion: 'Carne blanca y magra, muy versátil.', categoria: 'Pollo' },
    { id: 6, nombre: 'Alitas de Pollo', imagen: productoPlaceholder, descripcion: 'Crujientes y jugosas, perfectas para aperitivos.', categoria: 'Pollo' },
    { id: 9, nombre: 'Milanesa de Pollo', imagen: productoPlaceholder, descripcion: 'Clásico rebozado crujiente para todo tipo de platos.', categoria: 'Pollo' },
    { id: 15, nombre: 'Muslo de Pollo', imagen: productoPlaceholder, descripcion: 'Jugoso y con sabor intenso, para guisos y asados.', categoria: 'Pollo' },
    { id: 20, nombre: 'Brochetas de Pollo', imagen: productoPlaceholder, descripcion: 'Listas para parrilla, con especias y vegetales.', categoria: 'Pollo' },
    { id: 29, nombre: 'Pollo Entero Deshuesado', imagen: productoPlaceholder, descripcion: 'Listo para rellenar y hornear.', categoria: 'Pollo' },
    { id: 30, nombre: 'Contramuslos de Pollo', imagen: productoPlaceholder, descripcion: 'Más jugosos que la pechuga, ideales para guisar.', categoria: 'Pollo' },
    { id: 31, nombre: 'Pechuga de Pollo Rellena', imagen: productoPlaceholder, descripcion: 'Con queso y jamón, lista para cocinar.', categoria: 'Pollo' },

    // ----------------------------------------------------
    // CATEGORÍA: EMBUTIDOS (8 Productos)
    // ----------------------------------------------------
    { id: 5, nombre: 'Chorizo Artesanal', imagen: productoPlaceholder, descripcion: 'Hecho con especias naturales y carne seleccionada.', categoria: 'Embutido' },
    { id: 11, nombre: 'Salchicha Artesanal', imagen: productoPlaceholder, descripcion: 'Elaborada con ingredientes frescos y sin conservantes.', categoria: 'Embutido' },
    { id: 19, nombre: 'Salchicha Alemana', imagen: productoPlaceholder, descripcion: 'Con especias tradicionales para parrillas y guisos.', categoria: 'Embutido' },
    { id: 32, nombre: 'Morcilla Asturiana', imagen: productoPlaceholder, descripcion: 'Ideal para cocidos y platos tradicionales.', categoria: 'Embutido' },
    { id: 33, nombre: 'Salchicha Ranchera', imagen: productoPlaceholder, descripcion: 'Sabor ligeramente picante, perfecta para asar.', categoria: 'Embutido' },
    { id: 34, nombre: 'Longaniza Fresca', imagen: productoPlaceholder, descripcion: 'Para freír o añadir a pastas y arroces.', categoria: 'Embutido' },
    { id: 35, nombre: 'Salami Cular', imagen: productoPlaceholder, descripcion: 'Curado y especiado, ideal para aperitivos.', categoria: 'Embutido' },
    { id: 36, nombre: 'Fuet Extra', imagen: productoPlaceholder, descripcion: 'Embutido catalán, delgado y de sabor suave.', categoria: 'Embutido' },

    // ----------------------------------------------------
    // CATEGORÍA: AHUMADOS (6 Productos)
    // ----------------------------------------------------
    { id: 16, nombre: 'Jamón Cocido Artesanal', imagen: productoPlaceholder, descripcion: 'Sabor tradicional ahumado, ideal para sándwiches.', categoria: 'Ahumado' },
    { id: 37, nombre: 'Bacon Ahumado', imagen: productoPlaceholder, descripcion: 'Tiras de panceta curada y ahumada, crujiente.', categoria: 'Ahumado' },
    { id: 38, nombre: 'Pechuga de Pavo Ahumada', imagen: productoPlaceholder, descripcion: 'Carne magra, ahumada lentamente.', categoria: 'Ahumado' },
    { id: 39, nombre: 'Costilla Ahumada', imagen: productoPlaceholder, descripcion: 'Curada y ahumada, lista para calentar.', categoria: 'Ahumado' },
    { id: 40, nombre: 'Salmón Ahumado (Tiras)', imagen: productoPlaceholder, descripcion: 'Para desayunos o ensaladas (aunque no es carne roja).', categoria: 'Ahumado' },
    { id: 41, nombre: 'Chorizo Ahumado Español', imagen: productoPlaceholder, descripcion: 'Curado con pimentón y ahumado.', categoria: 'Ahumado' },

    // ----------------------------------------------------
    // CATEGORÍA: ESPECIALES (4 Productos)
    // ----------------------------------------------------
    { id: 13, nombre: 'Pechuga de Pavo Magra', imagen: productoPlaceholder, descripcion: 'Carne magra, ideal para dietas saludables.', categoria: 'Especial' },
    { id: 42, nombre: 'Conejo Troceado', imagen: productoPlaceholder, descripcion: 'Corte especial para arroces o guisos.', categoria: 'Especial' },
    { id: 43, nombre: 'Cordero Lechal', imagen: productoPlaceholder, descripcion: 'Cuarto trasero, ideal para hornear lentamente.', categoria: 'Especial' },
    { id: 44, nombre: 'Carne de Venado', imagen: productoPlaceholder, descripcion: 'Corte de caza para estofados o platos gourmet.', categoria: 'Especial' },
];

// COMPONENTE: CATEGORÍAS PRINCIPALES
const CategoriasPrincipales = ({ onSelectCategory, activeCategory }) => {
  return (
    // Usa 'medium-block' para el contenedor de categorías: fondo adaptable (gris claro/oscuro)
    <div className="medium-block mb-10 p-4 rounded-lg">
      <div className="flex justify-start sm:justify-center overflow-x-auto pb-4 space-x-4 sm:space-x-8">
        
        {/* Opción para ver "Todo" */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          onClick={() => onSelectCategory('Todos')}
          className={`flex-shrink-0 text-center cursor-pointer transition-transform duration-200 ${activeCategory === 'Todos' ? 'opacity-100 scale-105' : 'opacity-70'}`}
        >
          <div 
            // Borde en color dorado cuando está activo
            className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden mx-auto border-4 ${activeCategory === 'Todos' ? 'border-[var(--color-dorado)]' : 'border-transparent'} shadow-md`}
          >
            <img 
              src={verTodoImg} 
              alt='Ver todo' 
              className="w-full h-full object-cover" 
            />
          </div>
          {/* El color del texto se adapta gracias a 'medium-block' en el padre */}
          <p className="mt-2 text-sm font-medium">Ver todo</p>
        </motion.div>

        {/* Mapeo de las categorías definidas */}
        {categoriasPrincipales.map((categoria) => (
          <motion.div
            key={categoria.id}
            whileHover={{ scale: 1.05 }}
            onClick={() => onSelectCategory(categoria.filtro)}
            className={`flex-shrink-0 text-center cursor-pointer transition-transform duration-200 ${activeCategory === categoria.filtro ? 'opacity-100 scale-105' : 'opacity-70'}`}
          >
            <div 
              // Borde en color dorado cuando está activo
              className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden mx-auto border-4 ${activeCategory === categoria.filtro ? 'border-[var(--color-dorado)]' : 'border-transparent'} shadow-md`}
            >
              <img 
                src={categoria.imagen} 
                alt={categoria.nombre} 
                className="w-full h-full object-cover" 
              />
            </div>
            {/* El color del texto se adapta gracias a 'medium-block' en el padre */}
            <p className="mt-2 text-sm font-medium">{categoria.nombre}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// COMPONENTE: LISTA DE PRODUCTOS
export function ListaProductos({ onSelectProduct }) {
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('Todos');

  const productosFiltrados = productos.filter(producto => 
    categoriaSeleccionada === 'Todos' || producto.categoria === categoriaSeleccionada
  );

  const getDisplayCategory = (categoria) => {
    switch (categoria) {
      case 'Res': return 'CARNE DE RES';
      case 'Cerdo': return 'CARNE DE CERDO';
      case 'Pollo': return 'CARNE DE POLLO';
      case 'Embutido': return 'EMBUTIDOS';
      case 'Ahumado': return 'AHUMADOS';
      case 'Especial': return 'CARNES ESPECIALES';
      default: return 'PRODUCTO';
    }
  }; // Lógica de la función sin cambios

  return (
    <div>
      <CategoriasPrincipales 
        onSelectCategory={setCategoriaSeleccionada}
        activeCategory={categoriaSeleccionada}
      />

      {/* Título de la sección. El color del texto se adapta al body (claro/oscuro) */}
      <h2 className="text-2xl font-bold text-center mb-6">
        {categoriaSeleccionada === 'Todos' ? 'Todos los Productos' : getDisplayCategory(categoriaSeleccionada)}
      </h2>

      {productosFiltrados.length === 0 ? (
        <p className="text-center text-gray-500">No hay productos disponibles en esta categoría.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 mb-10">
          {productosFiltrados.map((producto) => (
            <motion.div
              key={producto.id}
              whileHover={{ scale: 1.05 }}
              onClick={() => onSelectProduct(producto)}
              // Usa 'light-block' para la tarjeta del producto (fondo: cremita/oscuro)
              // Añade 'hover:border-[var(--color-dorado)]' para el efecto visual al hacer hover
              className="light-block rounded-2xl shadow-lg overflow-hidden border-2 border-transparent cursor-pointer transition-all duration-300 hover:shadow-xl hover:border-[var(--color-dorado)]"
            >
              <img 
                src={producto.imagen} 
                alt={producto.nombre} 
                className="w-full h-40 object-cover" 
              />
              <div className="p-4 text-center">
                <p className="text-xs text-gray-500 uppercase">
                  {getDisplayCategory(producto.categoria)}
                </p>
                {/* El color del texto principal se adapta automáticamente gracias a 'light-block' */}
                <h3 className="text-lg font-semibold mt-1">
                  {producto.nombre}
                </h3>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}