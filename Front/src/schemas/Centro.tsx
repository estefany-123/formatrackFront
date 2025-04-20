import { z } from "zod";

export const CentroSchema = z.object({
    id_centro : z.number().optional(),
    nombre : z.string({required_error : "Es necesario un nombre"}).min(3,"Mínimo 3 caracteres"),
    estado : z.boolean().default(true),
    fk_municipio : z.number({required_error: "Municipio requerido"})
})

export type Centro = z.infer<typeof CentroSchema>;