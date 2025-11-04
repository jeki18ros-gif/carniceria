// src/data/productosData.js

// --- 1. Importación de las Imágenes ---
// Asegúrate de que la ruta de '../assets/' sea correcta desde la ubicación de este nuevo archivo.
import productoPlaceholder from '../assets/otros4.jpg'; 
import resImg from '../assets/otros1.jpg';
import cerdoImg from '../assets/otros2.jpg';
import polloImg from '../assets/otros3.jpg';
import embutidosImg from '../assets/otros4.jpg';
import ahumadosImg from '../assets/otros5.jpg';
import especialesImg from '../assets/otros6.jpg';
import verTodoImg from '../assets/relleno1.jpg'; 

// --- 2. Definiciones de Datos de Categorías ---
export const categoriasPrincipales = [
    { id: 1, nombre: 'Res', imagen: resImg, filtro: 'Res' },
    { id: 2, nombre: 'Cerdo', imagen: cerdoImg, filtro: 'Cerdo' },
    { id: 3, nombre: 'Pollo', imagen: polloImg, filtro: 'Pollo' },
    { id: 4, nombre: 'Embutidos', imagen: embutidosImg, filtro: 'Embutido' },
    { id: 5, nombre: 'Ahumados', imagen: ahumadosImg, filtro: 'Ahumado' },
    { id: 6, nombre: 'Especiales', imagen: especialesImg, filtro: 'Especial' },
    { id: 0, nombre: 'Ver todo', imagen: verTodoImg, filtro: 'Todos' }, 
];

// --- 3. Definiciones de Datos de Productos ---
export const productos = [
    // ----------------------------------------------------
    // CATEGORÍA: CARNE DE RES (10 Productos)
    // ----------------------------------------------------
    { id: 1, nombre: 'Lomo Fino', imagen: resImg, descripcion: 'Corte suave ideal para parrillas o sartén.', categoria: 'Res' },
    { id: 2, nombre: 'Costillar de Res', imagen: resImg, descripcion: 'Perfecto para asados y guisos.', categoria: 'Res' },
    { id: 4, nombre: 'Hamburguesa de Res', imagen: resImg, descripcion: 'Ideal para parrillas y sandwiches gourmet.', categoria: 'Res' },
    { id: 8, nombre: 'Carne Molida de Res', imagen: resImg, descripcion: 'Versátil para salsas, tacos y albóndigas.', categoria: 'Res' },
    { id: 10, nombre: 'Picanha de Res', imagen: resImg, descripcion: 'Corte brasileño jugoso y sabroso para parrilla.', categoria: 'Res' },
    { id: 14, nombre: 'Filete de Res', imagen: resImg, descripcion: 'Corte fino y suave, ideal para saltear o asar.', categoria: 'Res' },
    { id: 17, nombre: 'Ribeye', imagen: resImg, descripcion: 'Corte premium con vetas de grasa que aportan sabor.', categoria: 'Res' },
    { id: 18, nombre: 'Chuletón', imagen: resImg, descripcion: 'Corte grande y jugoso, perfecto para asados familiares.', categoria: 'Res' },
    { id: 21, nombre: 'T-Bone', imagen: resImg, descripcion: 'Corte que combina solomillo y lomo, para la parrilla.', categoria: 'Res' },
    { id: 22, nombre: 'Entraña Fina', imagen: resImg, descripcion: 'Sabor intenso, ideal para cocción rápida a la brasa.', categoria: 'Res' },

    // ----------------------------------------------------
    // CATEGORÍA: CARNE DE CERDO (8 Productos)
    // ----------------------------------------------------
    { id: 7, nombre: 'Costillas de Cerdo BBQ', imagen: cerdoImg, descripcion: 'Tiernas y con sabor ahumado, para barbacoa.', categoria: 'Cerdo' },
    { id: 12, nombre: 'Chuletas de Cerdo', imagen: cerdoImg, descripcion: 'Perfectas para sartén o parrilla, con mucho sabor.', categoria: 'Cerdo' },
    { id: 23, nombre: 'Lomo de Cerdo', imagen: cerdoImg, descripcion: 'Carne magra y versátil para hornear o rellenar.', categoria: 'Cerdo' },
    { id: 24, nombre: 'Panceta Curada', imagen: cerdoImg, descripcion: 'Ideal para dar sabor y textura crujiente a tus platos.', categoria: 'Cerdo' },
    { id: 25, nombre: 'Secreto Ibérico', imagen: cerdoImg, descripcion: 'Corte premium de cerdo, muy jugoso y sabroso.', categoria: 'Cerdo' },
    { id: 26, nombre: 'Paleta de Cerdo', imagen: cerdoImg, descripcion: 'Perfecta para estofados o para preparar pulled pork.', categoria: 'Cerdo' },
    { id: 27, nombre: 'Solomillo de Cerdo', imagen: cerdoImg, descripcion: 'El corte más tierno y magro del cerdo.', categoria: 'Cerdo' },
    { id: 28, nombre: 'Carrillera de Cerdo', imagen: cerdoImg, descripcion: 'Ideal para cocción lenta, muy melosa.', categoria: 'Cerdo' },

    // ----------------------------------------------------
    // CATEGORÍA: CARNE DE POLLO (8 Productos)
    // ----------------------------------------------------
    { id: 3, nombre: 'Pechuga de Pollo', imagen: polloImg, descripcion: 'Carne blanca y magra, muy versátil.', categoria: 'Pollo' },
    { id: 6, nombre: 'Alitas de Pollo', imagen: polloImg, descripcion: 'Crujientes y jugosas, perfectas para aperitivos.', categoria: 'Pollo' },
    { id: 9, nombre: 'Milanesa de Pollo', imagen: polloImg, descripcion: 'Clásico rebozado crujiente para todo tipo de platos.', categoria: 'Pollo' },
    { id: 15, nombre: 'Muslo de Pollo', imagen: polloImg, descripcion: 'Jugoso y con sabor intenso, para guisos y asados.', categoria: 'Pollo' },
    { id: 20, nombre: 'Brochetas de Pollo', imagen: polloImg, descripcion: 'Listas para parrilla, con especias y vegetales.', categoria: 'Pollo' },
    { id: 29, nombre: 'Pollo Entero Deshuesado', imagen: polloImg, descripcion: 'Listo para rellenar y hornear.', categoria: 'Pollo' },
    { id: 30, nombre: 'Contramuslos de Pollo', imagen: polloImg, descripcion: 'Más jugosos que la pechuga, ideales para guisar.', categoria: 'Pollo' },
    { id: 31, nombre: 'Pechuga de Pollo Rellena', imagen: polloImg, descripcion: 'Con queso y jamón, lista para cocinar.', categoria: 'Pollo' },

    // ----------------------------------------------------
    // CATEGORÍA: EMBUTIDOS (8 Productos)
    // ----------------------------------------------------
    { id: 5, nombre: 'Chorizo Artesanal', imagen: embutidosImg, descripcion: 'Hecho con especias naturales y carne seleccionada.', categoria: 'Embutido' },
    { id: 11, nombre: 'Salchicha Artesanal', imagen: embutidosImg, descripcion: 'Elaborada con ingredientes frescos y sin conservantes.', categoria: 'Embutido' },
    { id: 19, nombre: 'Salchicha Alemana', imagen: embutidosImg, descripcion: 'Con especias tradicionales para parrillas y guisos.', categoria: 'Embutido' },
    { id: 32, nombre: 'Morcilla Asturiana', imagen: embutidosImg, descripcion: 'Ideal para cocidos y platos tradicionales.', categoria: 'Embutido' },
    { id: 33, nombre: 'Salchicha Ranchera', imagen: embutidosImg, descripcion: 'Sabor ligeramente picante, perfecta para asar.', categoria: 'Embutido' },
    { id: 34, nombre: 'Longaniza Fresca', imagen: embutidosImg, descripcion: 'Para freír o añadir a pastas y arroces.', categoria: 'Embutido' },
    { id: 35, nombre: 'Salami Cular', imagen: embutidosImg, descripcion: 'Curado y especiado, ideal para aperitivos.', categoria: 'Embutido' },
    { id: 36, nombre: 'Fuet Extra', imagen: embutidosImg, descripcion: 'Embutido catalán, delgado y de sabor suave.', categoria: 'Embutido' },

    // ----------------------------------------------------
    // CATEGORÍA: AHUMADOS (6 Productos)
    // ----------------------------------------------------
    { id: 16, nombre: 'Jamón Cocido Artesanal', imagen: ahumadosImg, descripcion: 'Sabor tradicional ahumado, ideal para sándwiches.', categoria: 'Ahumado' },
    { id: 37, nombre: 'Bacon Ahumado', imagen: ahumadosImg, descripcion: 'Tiras de panceta curada y ahumada, crujiente.', categoria: 'Ahumado' },
    { id: 38, nombre: 'Pechuga de Pavo Ahumada', imagen: ahumadosImg, descripcion: 'Carne magra, ahumada lentamente.', categoria: 'Ahumado' },
    { id: 39, nombre: 'Costilla Ahumada', imagen: ahumadosImg, descripcion: 'Curada y ahumada, lista para calentar.', categoria: 'Ahumado' },
    { id: 40, nombre: 'Salmón Ahumado (Tiras)', imagen: ahumadosImg, descripcion: 'Para desayunos o ensaladas (aunque no es carne roja).', categoria: 'Ahumado' },
    { id: 41, nombre: 'Chorizo Ahumado Español', imagen: ahumadosImg, descripcion: 'Curado con pimentón y ahumado.', categoria: 'Ahumado' },

    // ----------------------------------------------------
    // CATEGORÍA: ESPECIALES (4 Productos)
    // ----------------------------------------------------
    { id: 13, nombre: 'Pechuga de Pavo Magra', imagen: especialesImg, descripcion: 'Carne magra, ideal para dietas saludables.', categoria: 'Especial' },
    { id: 42, nombre: 'Conejo Troceado', imagen: especialesImg, descripcion: 'Corte especial para arroces o guisos.', categoria: 'Especial' },
    { id: 43, nombre: 'Cordero Lechal', imagen: especialesImg, descripcion: 'Cuarto trasero, ideal para hornear lentamente.', categoria: 'Especial' },
    { id: 44, nombre: 'Carne de Venado', imagen: especialesImg, descripcion: 'Corte de caza para estofados o platos gourmet.', categoria: 'Especial' },
];
export { verTodoImg };
