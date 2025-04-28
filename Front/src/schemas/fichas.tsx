import { z } from "zod";

export const fichaUpdateSchema = z.object({
  id_ficha: z.number(),

  codigo_ficha: z.number({ message: "codigo ficha es requerida " }),

  estado: z.boolean({ required_error: "Estado es requerido" }),

  fk_programa: z.number({ message: "programa es requerido" }),
  
});

export type fichaUpdate = z.infer<typeof fichaUpdateSchema>;

export const fichaSchema = z.object({
  id_ficha: z.number(),

  nombre: z
    .string()
    .min(1, { message: "Nombre es requerido" })
    .min(3, { message: "Longitud minima de 3" }),

  codigo_ficha: z
    .number({ message: "codigo ficha es requerido" })
    .min(8, { message: "Longitud minima de 8" }),

  created_at: z.string().default(""),

  updated_at: z.string().default(""),

  estado: z.boolean({ required_error: "Estado es requerido" }),

  fk_programa: z.number({ message: "programa es requerido" }),
});

export type Ficha = z.infer<typeof fichaSchema>;

export const fichaCreateSchema = z.object({
  nombre: z
    .string()
    .min(1, { message: "Nombre es requerido" })
    .min(3, { message: "Longitud minima de 3" }),

  codigo_ficha: z
    .number({ message: "codigo ficha es requerido" })
    .min(8, { message: "Longitud minima de 8" }),

  estado: z.boolean({ required_error: "Estado es requerido" }),

  fk_programa: z.number({ message: "programa es requerido" }),
});

export type FichaCreate = z.infer<typeof fichaCreateSchema>;
