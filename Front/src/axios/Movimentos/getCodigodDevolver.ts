import { axiosAPI } from "@/axios/axiosAPI";
import { CodigoInventario } from "@/types/Inventario";

export const getCodigosDisponiblesParaDevolucion = async (idInventario: number): Promise<CodigoInventario[]> => {
  try {
    const res = await axiosAPI.get(`/movimientos/inventario/${idInventario}/codigos-devolucion`);
    return res.data;
  } catch (error: any) {
    console.error("Error al obtener códigos para devolución:", error);
    return [];
  }
};
