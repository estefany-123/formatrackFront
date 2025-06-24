import { axiosAPI } from "../axiosAPI";

export interface CodigoInventarioPostData {
    idCodigoInventario?: number;
    codigo?: string;
    fkInventario?: number
}

export async function postCodigoInventario(data:CodigoInventarioPostData):Promise<any> {
    const {idCodigoInventario, ...resto} = data
    const res = await axiosAPI.post(`codigo-inventario`, resto);
    return res.data;
}