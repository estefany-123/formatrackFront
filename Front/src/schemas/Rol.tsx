import { z } from "zod";

export const RolSchema = z.object({
  nombre: z.string({
    invalid_type_error: "Debe ser de tipo String",
  }).min(1,{message:'El nombre es obligatorio'}),

  estado: z.boolean({ required_error: "El estado es requerido" }),
});

export type Rol = z.infer<typeof RolSchema>