import { axiosAPI } from "../axiosAPI";

export async function deleteInventario(id_inventario:number):Promise<any> {
    await axiosAPI.put(`inventarios/state/${id_inventario}`);
    return id_inventario;
}