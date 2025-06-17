import { axiosAPI } from "../axiosAPI"
import { UpCategoria } from "@/types/Categorias"

export async function UpdCategoria(
  id_categoria: number,
  data: UpCategoria
): Promise<any> {
  const response = await axiosAPI.put(`categorias/${id_categoria}/`, data);
  return response.data;
}
