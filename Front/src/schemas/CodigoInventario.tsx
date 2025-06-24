import { z } from "zod";

export const codigoInventarioUpSchema = z.object({
  idCodigoInventario: z
    .number({
      required_error: "El ID del código es obligatorio",
    })
    .int("Debe ser un número válido"),
  codigo: z
    .string({
      required_error: "El código es obligatorio",
    })
    .min(1, "El código no puede estar vacío"),
});

export type CodigoInventraioUp = z.infer<typeof codigoInventarioUpSchema>;

export const codigoInventarioSchema = z.object({
  codigo: z
    .string({
      required_error: "El código es obligatorio",
    })
    .min(1, "El código no puede estar vacío"),

  uso: z.boolean().optional(),
  baja: z.boolean().optional(),

  fkInventario: z
    .number({
      required_error: "El inventario es obligatorio",
    })
    .int("El id del inventario debe ser un número entero"),
});

export type CodigoInventraio = z.infer<typeof codigoInventarioSchema>;
