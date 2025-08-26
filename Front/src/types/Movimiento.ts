

export type Movimiento = {
  idMovimiento?: number;
  descripcion?: string;
  cantidad?: number;
  horaIngreso?: string | null;
  horaSalida?: string | null;
  estado?: boolean;
  aceptado?: boolean;
  enProceso?: boolean;
  cancelado?: boolean;
  lugarDestino?: string;
  devolutivo?: boolean;
  noDevolutivo?: boolean;
  fechaDevolucion?: Date | string | null;
  createdAt?: string;
  updatedAt?: string;
  fkUsuario?: number | { nombre: string };
  fkTipoMovimiento?: number | { nombre: string };
  fkInventario?: number | { fkElemento?: { nombre: string } };
  fkSitio?: number;
  tipo_bien?: string;
  codigos?: string[];
};

export type MovimientoExtendido = Movimiento & {
  fkTipoMovimiento?: { nombre: string };
  fkUsuario?: { nombre: string };
  fkInventario?: {
    fkElemento?: { nombre: string };
  };
};