export const reports = [
  {
    id: "usuarios-con-mas-movimientos",
    title: "Movimientos Realizados por los Usuarios",
    description:
      "Muestra los usuarios que han realizado movimientos y a qué elementos.",
    headers: [
      "Usuario",
      "Rol",
      "Sitio",
      "Encargado",
      "Elemento",
      "Tipo Movimiento",
      "Última Fecha",
      "Total Movimientos",
      "Cantidad",
      "Códigos",
    ],
    accessors: [
      "usuario",
      "rol",
      "sitio",
      "encargado",
      "elemento",
      "tipo_movimiento",
      "ultima_fecha",
      "total_movimientos",
      "cantidad",
      "codigos",
    ],
  },
  {
    id: "sitios-con-mayor-stock",
    title: "Stock del inventario por Sitios",
    description: "Elementos disponibles por sitio.",
    headers: ["Sitio", "Área", "Encargado", "Elemento", "Cantidad", "Códigos"],
    accessors: [
      "Sitio",
      "Area",
      "Encargado",
      "Elemento",
      "Cantidad",
      "Caracteristicas",
    ],
  },
  {
    id: "elementos-por-caducar",
    title: "Elementos por caducar",
    description: "Lista de elementos que vencen próximamente.",
    headers: [
      "Nombre",
      "Vencimiento",
      "Creado",
      "Registrado por",
      "Sitio",
      "Área",
      "Días restantes",
    ],
    accessors: [
      "nombre",
      "vencimiento",
      "creado",
      "registrado_por",
      "sitio",
      "area",
      "dias_restantes",
    ],
  },
];

export const filtrosPorReporte: Record<
  string,
  Array<"fecha" | "tipoMovimiento" | "sitio" | "estado" | "nombre" | "usuario" | "area">
> = {
  "usuarios-con-mas-movimientos": ["fecha", "sitio", "usuario", "tipoMovimiento"],
  "sitios-con-mayor-stock": ["sitio", "area", "nombre"],
  "elementos-por-caducar": ["fecha", "sitio", "nombre", "area"],
};

