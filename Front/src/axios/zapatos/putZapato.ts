import { axiosAPI } from "../axiosAPI";

export interface ZapatoPutData {
    nombre: string;
    marca: string;
    talla: string;
}

export async function putZapatos(idZapato:number, data:ZapatoPutData):Promise<any> {
    const res = await axiosAPI.patch(`zapato/${idZapato}`, data);
    return res.data
}