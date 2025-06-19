import { z } from "zod";

export const MovimientoUpdateSchema = z.object({
  idMovimiento: z.number(),

  descripcion: z
    .string()
    .min(1, { message: "Descripcion es  requerida" })
    .min(2, { message: "Debe contener como mimimo 2 caracteres" }),

  cantidad: z.number({
    required_error: "Cantidad es requerida y debe ser entero",
  }),
  horaIngreso: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: "La hora debe tener el formato HH:mm (24h)",
  }),
  horaSalida: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: "La hora debe tener el formato HH:mm (24h)",
  }),
  

  fechaDevolucion: z.string().nullable().optional(),

});

export type MovimientoUpdate = z.infer<typeof MovimientoUpdateSchema>;

export const MovimientoCreateSchema = z.object({
  descripcion: z
    .string()
    .min(1, { message: "Descripcion es  requerida" })
    .min(2, { message: "Debe contener como mimimo 2 caracteres" }),
  cantidad: z.number({
    required_error: "Cantidad es requerida y debe ser entero",
  }),

  horaIngreso: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: "La hora debe tener el formato HH:mm (24h)",
  }),

  horaSalida: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: "La hora debe tener el formato HH:mm (24h)",
  }),

  estado: z.boolean({ required_error: "Estado es requerido" }).optional(),

  aceptado: z.boolean().default(false).optional(),

  enProceso: z.boolean().default(true).optional(),

  cancelado: z.boolean().default(false).optional(),

  devolutivo: z.boolean().optional(),

  noDevolutivo: z.boolean().optional(),

  fechaDevolucion: z.string().nullable().optional(),

  fkUsuario: z.number({ message: "Usuario es requerido" }),

  fkTipoMovimiento: z.number({ message: "Tipo Novimiento es requerido" }),

  fkSitio: z.number({ message: "Sitio es requerido" }),

  fkInventario: z.number({ message: "Inventario es requerido" }),

  tipo_bien: z.enum(["devolutivo", "no_devolutivo"], {
    required_error: "Debe seleccionar un tipo de elemento",
  }),
});
export type MovimientoCreate = z.infer<typeof MovimientoCreateSchema>;
