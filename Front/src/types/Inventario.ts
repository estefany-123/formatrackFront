export type Inventario = {
  id_inventario: number;
  stock: number;
  estado: boolean;
  created_at:string;
  updated_at:string;
  fk_sitio: number;
  fk_elemento: number;
};
