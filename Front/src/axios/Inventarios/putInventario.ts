import { axiosAPI } from "../axiosAPI";

export interface InventarioPutData {
    id_inventario: number;
    stock: number;
    estado: boolean;
    fk_sitio: number;
    fk_elemento: number;
}

export async function putInventario(id:number, data:InventarioPutData):Promise<any> {
    const res = await axiosAPI.post(`inventarios/${id}`, data);
    return res.data;
}