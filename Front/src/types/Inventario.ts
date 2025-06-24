export type Inventario = {
  idInventario?: number;
  stock?: number;
  estado?: boolean;
  createdAt?:string;
  updatedAt?:string;
  fkSitio?: number;
  fkElemento?: number;
  imagenElemento?:string;
  acciones?:string
};

export type InventarioConSitio = Inventario & {
  fkSitio: {
    idSitio: number;
    nombre: string;
  }
  fkElemento: {
    idElemento: number;
    nombre: string;
    imagenElemento?: string;
  }
}