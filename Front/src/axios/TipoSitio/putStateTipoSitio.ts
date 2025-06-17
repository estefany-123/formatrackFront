import { axiosAPI } from "../axiosAPI"

export const StateTipoSitio = async (id_tipo : number): Promise<any> => {
    const response = await axiosAPI.put(`/tipoSitio/estado/${id_tipo}`)
    return response.data
}
