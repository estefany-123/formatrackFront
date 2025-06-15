import { axiosAPI } from "../axiosAPI"

export const StateModulo = async (id_modulo : number): Promise<any> => {
    const response = await axiosAPI.put(`modulos/estado/${id_modulo}`)
    return response.data
}
