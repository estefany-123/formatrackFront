import { z } from 'zod'

export const AreaUpdateSchema = z.object({
    id_area: z
        .number(),
    nombre: z
        .string()
        .min(1, { message: "Nombre es requerido" })
        .min(3, { message: "Longitud minima de 3" }),

    persona_encargada: z
        .string()
        .min(1, { message: "persona encargada es requerido" })
        .min(3, { message: "Longitud minima de 3" }),


})

export type AreaUpdate = z.infer<typeof AreaUpdateSchema>

export const AreaSchema = z.object({
    id_area: z
        .number()
        .optional(),

    nombre: z
        .string()
        .min(1, { message: "Nombre es requerido" })
        .min(3, { message: "Longitud minima de 3" }),
    persona_encargada: z
        .string()
        .min(1, { message: "persona encargada es requerido" })
        .min(3, { message: "Longitud minima de 3" }),
    
    created_at : z
        .string().default(""),

    estado: z
        .boolean({ required_error: "Estado es requerido" }),

 
    fk_sede: z
        .number({ message: "Sede es requerido" })
        
})

export type Area = z.infer<typeof AreaSchema>


