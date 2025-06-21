export type Inventario = {
  idInventario?: number;
  stock?: number;
  estado?: boolean;
  createdAt?:string;
  updatedAt?:string;
  fkSitio?: number;
  fkElemento?: number;
  imagenElemento?:string;
};
