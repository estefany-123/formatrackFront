import { TipoSitio } from "@/types/TipoSitio"
import { axiosAPI } from "../axiosAPI"


export const getTipoSitio = async (): Promise<TipoSitio[]> => {
    const response = await axiosAPI.get('/tipoSitio/')
    return response.data
}