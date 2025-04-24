import { z } from "zod";

export const SolicitudUpdateSchema = z.object({
  id_unidad: z.number(),

  descripcion: z
    .string()
    .min(1, { message: "Descripcion es  requerida" })
    .min(2, { message: "Debe contener como mimimo 2 caracteres" }),

  cantidad: z.number({
    required_error: "Cantidad es requerida y debe ser entero",
  })

});

export type SolicitudUpdate = z.infer<typeof SolicitudUpdateSchema>;

export const SolicitudSchema = z.object({
  id_solicitud: z.number().optional(),

  descripcion: z
    .string()
    .min(1, { message: "Descripcion es  requerida" })
    .min(2, { message: "Debe contener como mimimo 2 caracteres" }),

  cantidad: z.number({
    required_error: "Cantidad es requerida y debe ser entero",
  }),

  estado: z.boolean({required_error:"Estado es requerido"}),

  aceptada: z.boolean(),

  pendiente: z.boolean(),

  rechazada: z.boolean(),

  created_at: z.string().default("").optional(),

  updated_at: z.string().default("").optional(),

  fk_sitio: z.number({ message: "Elemento es requerido" }),

  fk_usuario: z.number({ message: "Elemento es requerido" }),

  fk_inventario: z.number({ message: "Elemento es requerido" }),

});
export type Solicitud = z.infer<typeof SolicitudSchema>;
