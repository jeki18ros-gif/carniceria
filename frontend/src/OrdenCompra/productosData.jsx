import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { supabase } from "../supabase/supabaseClient";

// Puedes usar estas imágenes como fallback si un producto no tiene imagen
import fallbackImg from "../assets/otros4.jpg";

// Categorías principales con imágenes
import resImg from "../assets/otros1.jpg";
import cerdoImg from "../assets/otros2.jpg";
import polloImg from "../assets/otros3.jpg";
import embutidosImg from "../assets/otros4.jpg";
import ahumadosImg from "../assets/otros5.jpg";
import especialesImg from "../assets/otros6.jpg";
import verTodoImg from "../assets/relleno1.jpg";

export const useProductosData = () => {
  const { t } = useTranslation();
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔥 Cargar productos desde Supabase
  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);

      const { data, error } = await supabase
        .from("productos")
        .select("*");

      if (error) {
        console.error("Error cargando productos:", error);
      } else {
        // Si no tienen imagen, colocamos un placeholder
        const formatted = data.map((p) => ({
          ...p,
          imagen: p.imagen || fallbackImg,
        }));

        setProductos(formatted);
      }

      setLoading(false);
    }

    fetchProducts();
  }, []);

  // 🔥 Categorías visibles arriba como filtro
  const categoriasPrincipales = [
    { id: "res", nombre: t("productosData.categories.res"), imagen: resImg, filtro: "Res" },
    { id: "cerdo", nombre: t("productosData.categories.cerdo"), imagen: cerdoImg, filtro: "Cerdo" },
    { id: "pollo", nombre: t("productosData.categories.pollo"), imagen: polloImg, filtro: "Pollo" },
    { id: "embutidos", nombre: t("productosData.categories.embutidos"), imagen: embutidosImg, filtro: "Embutido" },
    { id: "ahumados", nombre: t("productosData.categories.ahumados"), imagen: ahumadosImg, filtro: "Ahumado" },
    { id: "especiales", nombre: t("productosData.categories.especiales"), imagen: especialesImg, filtro: "Especial" },
    { id: "todos", nombre: t("menu.verTodo"), imagen: verTodoImg, filtro: "Todos" },
  ];

  return { categoriasPrincipales, productos, loading, verTodoImg };
};
