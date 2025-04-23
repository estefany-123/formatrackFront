import { z } from 'zod'

export const sedeUpdateSchema = z.object({
    id_sede: z
        .number(),
        nombre: z
        .string()
        .min(1, { message: "Nombre es requerido" })
        .min(3, { message: "Longitud minima de 3" }),
   

})

export type sedeUpdate = z.infer<typeof sedeUpdateSchema>

export const sedeSchema = z.object({
    id_sede: z
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

 
    fk_centro: z
        .number({ message: "centro es requerido" })
        
})

export type sede = z.infer<typeof sedeSchema>


