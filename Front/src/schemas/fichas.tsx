import { z } from 'zod'

export const fichaUpdateSchema = z.object({
    id_area: z
        .number(),
    codigo_ficha:z
        .number({ message: "codigo ficha es requerida " })
        .min(3, { message: "Longitud minima de 3" }),


})

export type fichaUpdate = z.infer<typeof fichaUpdateSchema>

export const fichaSchema = z.object({
    id_ficha: z
        .number()
        .optional(),

    nombre: z
        .string()
        .min(1, { message: "Nombre es requerido" })
        .min(3, { message: "Longitud minima de 3" }),
    codigo_ficha:z
    .number({ message: "codigo ficha es requerido" })
    .min(8, { message: "Longitud minima de 8" }),

    created_at : z
        .string().default(""),

    estado: z
        .boolean({ required_error: "Estado es requerido" }),

 
    fk_programa: z
        .number({ message: "programa es requerido" })
        
})

export type Ficha = z.infer<typeof fichaSchema>


