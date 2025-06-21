import { axiosAPI } from "../axiosAPI"
import {UpModulo} from "@/types/Modulo"


export async function putModulo(
  idModulo: number,
  data: UpModulo
): Promise<any> {
  const response = await axiosAPI.patch(`modulos/${idModulo}/`, data);
  return response.data;
}
