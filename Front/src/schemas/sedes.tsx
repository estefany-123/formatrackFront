import { z } from "zod";

export const sedeUpdateSchema = z.object({
  id_sede: z.number(),
  nombre: z
    .string()
    .min(1, { message: "Nombre es requerido" })
    .min(3, { message: "Longitud minima de 3" }),

  estado: z.boolean({ required_error: "Estado es requerido" }),
  fk_centro: z.number({ message: "centro es requerido" }),
});

export type sedeUpdate = z.infer<typeof sedeUpdateSchema>;

export const sedeSchema = z.object({
  id_sede: z.number().optional(),

  nombre: z
    .string()
    .min(1, { message: "Nombre es requerido" })
    .min(3, { message: "Longitud minima de 3" }),

  created_at: z.string().default("").optional(),

  updated_at: z.string().default("").optional(),

  estado: z.boolean({ required_error: "Estado es requerido" }),

  fk_centro: z.number({ message: "centro es requerido" }),
});

export type Sede = z.infer<typeof sedeSchema>;
