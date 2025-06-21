import { axiosAPI } from "../axiosAPI";

export interface InventarioPostData {
    idInventario?: number;
    stock?: number;
    estado?: boolean;
    fk_sitio?: number;
    fk_elemento?: number;
}

export async function postInventario(data:InventarioPostData):Promise<any> {
    const {idInventario, ...resto} = data
    const res = await axiosAPI.post(`inventarios`, resto);
    return res.data;
}