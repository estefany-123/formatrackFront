import { axiosAPI } from "../axiosAPI"

export const StateCategoria = async (id_categoria : number): Promise<any> => {
    const response = await axiosAPI.put(`/categorias/estado/${id_categoria}`)
    return response.data
}
