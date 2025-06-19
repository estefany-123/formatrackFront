import { axiosAPI } from "../axiosAPI";

export interface ElementoPutData {
    nombre: string;
    descripcion: string;
    imagenElemento?: string | File | undefined;
}

export async function putElemento(id:number, data:ElementoPutData):Promise<any> {
    const formData = new FormData();
    formData.append('nombre', data.nombre);
    formData.append('descripcion', data.descripcion);
    if (data.imagenElemento) {
        formData.append('imagenElemento', data.imagenElemento);
    }
    const res = await axiosAPI.post(`elementos/${id}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
    return res.data;
}