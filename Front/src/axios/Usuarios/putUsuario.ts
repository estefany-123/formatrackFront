import { axiosAPI } from "../axiosAPI"
import {putUser} from "@/types/Usuario"


export async function updateUsuario(
  id_usuario: number,
  data: putUser
): Promise<any> {
  const response = await axiosAPI.put(`usuarios/${id_usuario}/`, data);
  return response.data;
}
