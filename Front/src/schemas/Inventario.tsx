import { z } from "zod";

export const InventarioUpdateSchema = z.object({
  id_inventario: z.number(),

  stock: z.number({ required_error: "Valor es requerido y debe ser entero" }),
});

export type InventarioUpdate = z.infer<typeof InventarioUpdateSchema>;

export const InventarioSchema = z.object({
  id_inventario: z.number().optional(),

  stock: z.number({ required_error: "Valor es requerido y debe ser entero" }),

  estado: z.boolean({ required_error: "Estado es requerido" }),

  created_at: z.string().default("").optional(),

  updated_at: z.string().default("").optional(),

  fk_sitio:z.number({message:"Sitio es requerido"}),

  fk_elemento:z.number({message:"Elemento es requerido"})
});

export type Inventario = z.infer<typeof InventarioSchema>;
