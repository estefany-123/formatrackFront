import { axiosAPI } from "../axiosAPI"

export const StateRuta = async (id_ruta : number): Promise<any> => {
    const response = await axiosAPI.put(`/rutas/estado/${id_ruta}`)
    return response.data
}
