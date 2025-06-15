import { axiosAPI } from "../axiosAPI"
import {UpTipoSitio} from "@/types/TipoSitio"


export async function updateTipoSitio(
  id_tipo: number,
  data: UpTipoSitio
): Promise<any> {
  const response = await axiosAPI.put(`tipoSitio/${id_tipo}/`, data);
  return response.data;
}
