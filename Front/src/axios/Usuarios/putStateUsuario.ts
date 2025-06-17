import { axiosAPI } from "../axiosAPI"

export const StateUsuario = async (id_usuario : number): Promise<any> => {
    const response = await axiosAPI.put(`/usuarios/estado/${id_usuario}`)
    return response.data
}
