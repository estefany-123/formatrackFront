import { axiosAPI } from "../axiosAPI";

export async function acceptMovimiento(id_movimiento:number):Promise<any> {
    await axiosAPI.put(`movimientos/accept/${id_movimiento}`);
    return id_movimiento;
}