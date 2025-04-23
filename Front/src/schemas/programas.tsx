import { z } from 'zod'

export const programaUpdateSchema = z.object({
    id_area: z
        .number(),
    nombre: z
        .string()
        .min(1, { message: "Nombre es requerido" })
        .min(3, { message: "Longitud minima de 3" }),


})

export type programaUpdate = z.infer<typeof programaUpdateSchema>

export const programaSchema = z.object({
    id_programa: z
        .number()
        .optional(),

    nombre: z
        .string()
        .min(1, { message: "Nombre es requerido" })
        .min(3, { message: "Longitud minima de 3" }),
 
    created_at : z
        .string().default(""),

    estado: z
        .boolean({ required_error: "Estado es requerido" }),

 
    fk_area: z
        .number({ message: "area  es requerido" })
        
})

export type programa = z.infer<typeof programaSchema>


