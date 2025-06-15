import { axiosAPI } from "../axiosAPI"

export const StateMunicipio = async (id_municipio : number): Promise<any> => {
    const response = await axiosAPI.put(`/municipios/estado/${id_municipio}`)
    return response.data
}
