import { axiosAPI } from "../axiosAPI";

export interface ZapatoPostData {
    idZapato?: number;
    nombre: string;
    marca: string;
    talla: string;
}

export async function postZapatos(data:ZapatoPostData):Promise<any> {
    const res = await axiosAPI.post(`zapato`, data);
    return res.data
}