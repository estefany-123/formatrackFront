import { axiosAPI } from "../axiosAPI";

export interface MovimientoPutData {
  idMovimiento?: number;
  descripcion?: string;
  horaIngreso?: string | null;
  horaSalida?: string | null;
}

export async function putMovimiento(idMovimiento:number, data:MovimientoPutData):Promise<any> {
    const res = await axiosAPI.patch(`movimientos/${idMovimiento}`,data);
    return res.data
}