import { axiosAPI } from "../axiosAPI";
import { TipoSitio } from "@/types/TipoSitio";

export async function postTipoSitio(
    data: TipoSitio
  ): Promise<any> {
    const response = await axiosAPI.post(
      "tipoSitio/",
      data
    );
    return response.data; 
  }
