import { z } from "zod";

export const RolSchema = z.object({
  nombre: z
    .string()
    .min(1, { message: "El nombre es obligatorio" })
    .min(4, { message: "El nombre debe contener como minimo 4 caracteres" }),

  estado: z.boolean(),
});

export type Rol = z.infer<typeof RolSchema>;
