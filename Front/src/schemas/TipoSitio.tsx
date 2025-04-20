import { z } from "zod";

export const TipoSitioSchema = z.object({
    id_tipo : z.number().optional(),
    nombre : z.string(),
    estado : z.boolean().default(true)
})

export type TipoSitio = z.infer<typeof TipoSitioSchema>

export const TipoSitioUpdateSchema = z.object({
    id_tipo : z.number(),
    nombre : z.string()
})

export type TipoSitioUpdate = z.infer<typeof TipoSitioUpdateSchema>