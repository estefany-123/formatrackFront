import { axiosAPI } from "../axiosAPI"
import {UpModulo} from "@/types/Modulo"


export async function putModulo(
  id_modulo: number,
  data: UpModulo
): Promise<any> {
  const response = await axiosAPI.put(`modulos/${id_modulo}/`, data);
  return response.data;
}
