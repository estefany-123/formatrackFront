import {User} from "@/types/Usuario"
import { axiosAPI } from "../axiosAPI"


export const getByIdUsuario = async (id_usuario : number): Promise<User> => {
    const response = await axiosAPI.get(`/usuarios/${id_usuario}`)
    return response.data
}