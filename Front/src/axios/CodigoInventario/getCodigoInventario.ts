import { axiosAPI } from "../axiosAPI";
import { CodigoInevntario } from "@/types/codigoInventario";

export const getCodigoInventario = async ():Promise<CodigoInevntario[]> => {
    const res = await axiosAPI.get('codigo-inventario');
    return res.data;
}