export type SitioStock = {
  Sitio: string;
  Encargado: string;
  Area: string;
  Elemento: string;
  Cantidad: number;
  Caracteristicas: {
    codigo: string;
    fecha_creacion: string;
  }[];
};

export type UsuarioMovimientos = {
  usuario: string;
  rol: string;
  sitio: string;
  encargado: string;
  elemento: string;
  total_movimientos: number;
  cantidad?: number;
  codigos: string[];
};

export type ElementoCaducar = {
  nombre: string;
  vencimiento: string;
  creado: string;
  registrado_por: string;
  sitio: string;
  area: string;
  dias_restantes: number;
};

export type MovimientoDetalle = {
  tipo: string;
  elemento: string;
  usuario: string;
  rol: string;
  sitio: string;
  area: string;
  lugar_destino: string;
  fecha: string;
  cantidad: number;
  codigos: string[];
};