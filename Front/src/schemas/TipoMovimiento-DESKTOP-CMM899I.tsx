import { z } from "zod";

export const TipoMovimientoSchema = z.object({
  nombre: z
    .string()
    .min(1, { message: "El nombre es obligatorio" })
    .min(4, { message: "El nombre debe contener como minimo 4 caracteres" }),

    estado: z.boolean(),
});

export type TipoMovimiento = z.infer<typeof TipoMovimientoSchema>