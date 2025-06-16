import { axiosAPI } from "../axiosAPI"
import {UpRuta} from "@/types/Ruta"


export async function putRuta(
  id_ruta: number,
  data: UpRuta
): Promise<any> {
  const response = await axiosAPI.put(`rutas/${id_ruta}/`, data);
  return response.data;
}
