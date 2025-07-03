import { CodigoInventario } from "./Inventario";

export type Movimiento = {
  idMovimiento?: number;
  descripcion: string;
  cantidad?: number;
  horaIngreso?: string;
  horaSalida?: string;
  estado?: boolean;
  aceptado?: boolean;
  enProceso?: boolean;
  cancelado?: boolean;
  devolutivo?: boolean;
  noDevolutivo?: boolean;
  fechaDevolucion?: string | null |Date;
  createdAt?: string;
  updatedAt?: string;
  fkUsuario?: number;
  fkTipoMovimiento?: number;
  fkSitio?: number;
  fkInventario?: number;
  tipo_bien?: string;
  codigos?: CodigoInventario[];
};
