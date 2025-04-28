import { axiosAPI } from "../axiosAPI";

export interface ElementoPostData {
    id_elemento?: number;
    nombre: string;
    descripcion: string;
    valor: number;
    perecedero: boolean;
    no_perecedero: boolean;
    estado: boolean;
    imagen_elemento: string | File;
    created_at?: string;
    updated_at?: string;
    fk_unidad_medida: number;
    fk_categoria: number;
    fk_caracteristica: number;
}

export async function postElemento(data:ElementoPostData):Promise<any> {
    const formData = new FormData();
    formData.append('nombre', data.nombre);
    formData.append('descripcion', data.descripcion);
    formData.append('valor', data.valor.toString());
    formData.append('perecedero', data.perecedero.toString());
    formData.append('no_perecedero', data.no_perecedero.toString());
    formData.append('estado', data.estado.toString());
    formData.append('fk_unidad_medida', data.fk_unidad_medida.toString());
    formData.append('fk_categoria', data.fk_categoria.toString());
    formData.append('fk_caracteristica', data.fk_caracteristica.toString());
    formData.append('imagen_elemento', data.imagen_elemento); // aquí si es File

    const res = await axiosAPI.post('elemento', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
    return res.data;
}