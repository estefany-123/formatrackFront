export type SitioStock = {
  sitio: string;
  total_stock: number;
}

export type UsuarioMovimientos = {
  usuario: string;
  area: string;
  sitio: string;
  total_movimientos: number;
}

export type ElementoCaducar = {
  nombre: string;
  vencimiento: string; 
  sitio: string;
}

export type MovimientoDetalle = {
  tipo: string;
  entregado_por: string;
  entregado_a: string;
  hora: string; 
  lugar_destino: string;
}