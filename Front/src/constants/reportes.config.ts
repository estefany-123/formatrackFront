export const reports = [
  {
    id: "usuarios-elementos",
    title: "Usuarios con elementos asignados",
    description: "Muestra los usuarios que tienen elementos asignados en el sistema.",
    headers: ["Nombre", "Cantidad de elementos", "Última asignación"],
    accessors: ["nombre", "cantidad", "fecha"],
  },
  {
    id: "movimientos",
    title: "Movimientos de inventario",
    description: "Lista de movimientos realizados, filtrados por tipo y fecha.",
    headers: ["Elemento", "Tipo", "Cantidad", "Fecha", "Sitio"],
    accessors: ["elemento", "tipo", "cantidad", "fecha", "sitio"],
  },
  {
    id: "usuarios-con-rol",
    title: "Usuarios por rol",
    description: "Listado de usuarios agrupados por su rol.",
    headers: ["Nombre", "Rol", "Email"],
    accessors: ["nombre", "rol", "email"],
  },
  {
    id: "inventario-sitio",
    title: "Inventario por sitio",
    description: "Elementos disponibles por sitio.",
    headers: ["Sitio", "Elemento", "Stock"],
    accessors: ["sitio", "elemento", "stock"],
  },
];



export const filtrosPorReporte: Record<
  string,
  Array<"fecha" | "tipoMovimiento" | "sitio" | "estado" | "rol">
> = {
  "usuarios-elementos": ["fecha"],
  "movimientos": ["fecha", "tipoMovimiento", "sitio", "estado"],
  "usuarios-con-rol": ["rol", "fecha"],
  "inventario-sitio": ["sitio"],
};