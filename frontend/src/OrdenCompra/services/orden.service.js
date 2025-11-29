import { supabase } from "../../../supabase/supabaseClient";

export const crearOrden = async (pedido, productos) => {
  try {
    const { data, error } = await supabase.from("ordenes").insert([
      {
        pedido: pedido,
        productos: productos,
        fecha: new Date(),
      },
    ]);

    if (error) throw error;

    return data;
  } catch (err) {
    console.error("Error al crear la orden:", err.message);
    throw err;
  }
};
