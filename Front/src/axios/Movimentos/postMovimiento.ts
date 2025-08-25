import { axiosAPI } from "../axiosAPI";

export interface MovimientoPostData {
  idMovimiento?: number;
  descripcion?: string;
  cantidad?: number;
  horaIngreso?: string | null;
  horaSalida?: string | null;
  aceptado?: boolean;
  enProceso?: boolean;
  cancelado?: boolean;
  devolutivo?: boolean;
  noDevolutivo?: boolean;
  createdAt?: string;
  lugarDestino?: string;
  updatedAt?: string;
  fkUsuario?: number | { nombre: string };
  fkTipoMovimiento?: number | { nombre: string };
  fkInventario?: number | { fkElemento?: { nombre: string } };
  fkSitio?: number;
  fechaDevolucion?: Date | string | null;
  codigos?: string[];
}

export async function postMovimiento(data: MovimientoPostData): Promise<any> {
  const { idMovimiento, ...resto } = data;
  const res = await axiosAPI.post(`movimientos`, resto);
  return res.data;
}
