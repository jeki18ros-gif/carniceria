import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
// Importamos el cliente Supabase
import { supabase } from '../supabaseClient'; 

// --- Importación de las Imágenes (Localmente) ---
// Las imágenes en producción deberían estar en un CDN o Supabase Storage
import productoPlaceholder from '../assets/otros4.jpg';
import resImg from '../assets/otros1.jpg';
import cerdoImg from '../assets/otros2.jpg';
import polloImg from '../assets/otros3.jpg';
import embutidosImg from '../assets/otros4.jpg';
import ahumadosImg from '../assets/otros5.jpg';
import especialesImg from '../assets/otros6.jpg';
import verTodoImg from '../assets/relleno1.jpg';

// --- Hook que provee los datos ---
export const useProductosData = () => {
  const { t } = useTranslation();
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);

  // EFECTO PARA CARGAR LOS PRODUCTOS DE SUPABASE
  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      
      // NOTA: Usamos el ID como clave principal, por lo que es crucial que
      // los IDs en Supabase coincidan con los IDs que solías tener localmente.
      const { data, error } = await supabase
        .from('productos')
        .select('*'); 

      if (error) {
        console.error('Error al cargar productos desde Supabase:', error);
        // Podrías poner aquí un fallback a datos locales si es crítico que cargue algo
      } else {
        setProductos(data);
      }
      setLoading(false);
    }

    fetchProducts();
  }, []);
  // --- Categorías principales ---
  const categoriasPrincipales = [
    { id: 1, nombre: t('productosData.categories.res'), imagen: resImg, filtro: 'Res' },
    { id: 2, nombre: t('productosData.categories.cerdo'), imagen: cerdoImg, filtro: 'Cerdo' },
    { id: 3, nombre: t('productosData.categories.pollo'), imagen: polloImg, filtro: 'Pollo' },
    { id: 4, nombre: t('productosData.categories.embutidos'), imagen: embutidosImg, filtro: 'Embutido' },
    { id: 5, nombre: t('productosData.categories.ahumados'), imagen: ahumadosImg, filtro: 'Ahumado' },
    { id: 6, nombre: t('productosData.categories.especiales'), imagen: especialesImg, filtro: 'Especial' },
    { id: 0, nombre: t('menu.verTodo'), imagen: verTodoImg, filtro: 'Todos' },
  ];

  // --- Productos principales ---
  const productos = [
    // 🥩 RES
    { id: 1, nombre: t('productosData.items.lomo_fino.name'), descripcion: t('productosData.items.lomo_fino.description'), imagen: resImg, categoria: 'Res' },
    { id: 2, nombre: t('productosData.items.costillar_res.name'), descripcion: t('productosData.items.costillar_res.description'), imagen: resImg, categoria: 'Res' },
    { id: 4, nombre: t('productosData.items.hamburguesa_res.name'), descripcion: t('productosData.items.hamburguesa_res.description'), imagen: resImg, categoria: 'Res' },
    { id: 8, nombre: t('productosData.items.carne_molida_res.name'), descripcion: t('productosData.items.carne_molida_res.description'), imagen: resImg, categoria: 'Res' },
    { id: 10, nombre: t('productosData.items.picanha_res.name'), descripcion: t('productosData.items.picanha_res.description'), imagen: resImg, categoria: 'Res' },
    { id: 14, nombre: t('productosData.items.filete_res.name'), descripcion: t('productosData.items.filete_res.description'), imagen: resImg, categoria: 'Res' },
    { id: 17, nombre: t('productosData.items.ribeye.name'), descripcion: t('productosData.items.ribeye.description'), imagen: resImg, categoria: 'Res' },
    { id: 18, nombre: t('productosData.items.chuleton.name'), descripcion: t('productosData.items.chuleton.description'), imagen: resImg, categoria: 'Res' },
    { id: 21, nombre: t('productosData.items.tbone.name'), descripcion: t('productosData.items.tbone.description'), imagen: resImg, categoria: 'Res' },
    { id: 22, nombre: t('productosData.items.entrana_fina.name'), descripcion: t('productosData.items.entrana_fina.description'), imagen: resImg, categoria: 'Res' },

    // 🐖 CERDO
    { id: 7, nombre: t('productosData.items.costillas_cerdo_bbq.name'), descripcion: t('productosData.items.costillas_cerdo_bbq.description'), imagen: cerdoImg, categoria: 'Cerdo' },
    { id: 12, nombre: t('productosData.items.chuletas_cerdo.name'), descripcion: t('productosData.items.chuletas_cerdo.description'), imagen: cerdoImg, categoria: 'Cerdo' },
    { id: 23, nombre: t('productosData.items.lomo_cerdo.name'), descripcion: t('productosData.items.lomo_cerdo.description'), imagen: cerdoImg, categoria: 'Cerdo' },
    { id: 24, nombre: t('productosData.items.panceta_curada.name'), descripcion: t('productosData.items.panceta_curada.description'), imagen: cerdoImg, categoria: 'Cerdo' },
    { id: 25, nombre: t('productosData.items.secreto_iberico.name'), descripcion: t('productosData.items.secreto_iberico.description'), imagen: cerdoImg, categoria: 'Cerdo' },
    { id: 26, nombre: t('productosData.items.paleta_cerdo.name'), descripcion: t('productosData.items.paleta_cerdo.description'), imagen: cerdoImg, categoria: 'Cerdo' },
    { id: 27, nombre: t('productosData.items.solomillo_cerdo.name'), descripcion: t('productosData.items.solomillo_cerdo.description'), imagen: cerdoImg, categoria: 'Cerdo' },
    { id: 28, nombre: t('productosData.items.carrillera_cerdo.name'), descripcion: t('productosData.items.carrillera_cerdo.description'), imagen: cerdoImg, categoria: 'Cerdo' },

    // 🐔 POLLO
    { id: 3, nombre: t('productosData.items.pechuga_pollo.name'), descripcion: t('productosData.items.pechuga_pollo.description'), imagen: polloImg, categoria: 'Pollo' },
    { id: 6, nombre: t('productosData.items.alitas_pollo.name'), descripcion: t('productosData.items.alitas_pollo.description'), imagen: polloImg, categoria: 'Pollo' },
    { id: 9, nombre: t('productosData.items.milanesa_pollo.name'), descripcion: t('productosData.items.milanesa_pollo.description'), imagen: polloImg, categoria: 'Pollo' },
    { id: 15, nombre: t('productosData.items.muslo_pollo.name'), descripcion: t('productosData.items.muslo_pollo.description'), imagen: polloImg, categoria: 'Pollo' },
    { id: 20, nombre: t('productosData.items.brochetas_pollo.name'), descripcion: t('productosData.items.brochetas_pollo.description'), imagen: polloImg, categoria: 'Pollo' },
    { id: 29, nombre: t('productosData.items.pollo_entero_deshuesado.name'), descripcion: t('productosData.items.pollo_entero_deshuesado.description'), imagen: polloImg, categoria: 'Pollo' },
    { id: 30, nombre: t('productosData.items.contramuslos_pollo.name'), descripcion: t('productosData.items.contramuslos_pollo.description'), imagen: polloImg, categoria: 'Pollo' },
    { id: 31, nombre: t('productosData.items.pechuga_pollo_rellena.name'), descripcion: t('productosData.items.pechuga_pollo_rellena.description'), imagen: polloImg, categoria: 'Pollo' },

    // 🌭 EMBUTIDOS
    { id: 5, nombre: t('productosData.items.chorizo_artesanal.name'), descripcion: t('productosData.items.chorizo_artesanal.description'), imagen: embutidosImg, categoria: 'Embutido' },
    { id: 11, nombre: t('productosData.items.salchicha_artesanal.name'), descripcion: t('productosData.items.salchicha_artesanal.description'), imagen: embutidosImg, categoria: 'Embutido' },
    { id: 19, nombre: t('productosData.items.salchicha_alemana.name'), descripcion: t('productosData.items.salchicha_alemana.description'), imagen: embutidosImg, categoria: 'Embutido' },
    { id: 32, nombre: t('productosData.items.morcilla_asturiana.name'), descripcion: t('productosData.items.morcilla_asturiana.description'), imagen: embutidosImg, categoria: 'Embutido' },
    { id: 33, nombre: t('productosData.items.salchicha_ranchera.name'), descripcion: t('productosData.items.salchicha_ranchera.description'), imagen: embutidosImg, categoria: 'Embutido' },
    { id: 34, nombre: t('productosData.items.longaniza_fresca.name'), descripcion: t('productosData.items.longaniza_fresca.description'), imagen: embutidosImg, categoria: 'Embutido' },
    { id: 35, nombre: t('productosData.items.salami_cular.name'), descripcion: t('productosData.items.salami_cular.description'), imagen: embutidosImg, categoria: 'Embutido' },
    { id: 36, nombre: t('productosData.items.fuet_extra.name'), descripcion: t('productosData.items.fuet_extra.description'), imagen: embutidosImg, categoria: 'Embutido' },

    // 🔥 AHUMADOS
    { id: 16, nombre: t('productosData.items.jamon_cocido_artesanal.name'), descripcion: t('productosData.items.jamon_cocido_artesanal.description'), imagen: ahumadosImg, categoria: 'Ahumado' },
    { id: 37, nombre: t('productosData.items.bacon_ahumado.name'), descripcion: t('productosData.items.bacon_ahumado.description'), imagen: ahumadosImg, categoria: 'Ahumado' },
    { id: 38, nombre: t('productosData.items.pechuga_pavo_ahumada.name'), descripcion: t('productosData.items.pechuga_pavo_ahumada.description'), imagen: ahumadosImg, categoria: 'Ahumado' },
    { id: 39, nombre: t('productosData.items.costilla_ahumada.name'), descripcion: t('productosData.items.costilla_ahumada.description'), imagen: ahumadosImg, categoria: 'Ahumado' },
    { id: 40, nombre: t('productosData.items.salmon_ahumado_tiras.name'), descripcion: t('productosData.items.salmon_ahumado_tiras.description'), imagen: ahumadosImg, categoria: 'Ahumado' },
    { id: 41, nombre: t('productosData.items.chorizo_ahumado_espanol.name'), descripcion: t('productosData.items.chorizo_ahumado_espanol.description'), imagen: ahumadosImg, categoria: 'Ahumado' },

    // ⭐ ESPECIALES
    { id: 13, nombre: t('productosData.items.pechuga_pavo_magra.name'), descripcion: t('productosData.items.pechuga_pavo_magra.description'), imagen: especialesImg, categoria: 'Especial' },
    { id: 42, nombre: t('productosData.items.conejo_troceado.name'), descripcion: t('productosData.items.conejo_troceado.description'), imagen: especialesImg, categoria: 'Especial' },
    { id: 43, nombre: t('productosData.items.cordero_lechal.name'), descripcion: t('productosData.items.cordero_lechal.description'), imagen: especialesImg, categoria: 'Especial' },
    { id: 44, nombre: t('productosData.items.carne_venado.name'), descripcion: t('productosData.items.carne_venado.description'), imagen: especialesImg, categoria: 'Especial' },
  ];

 return { categoriasPrincipales, productos, loading, verTodoImg };
};
