import {z} from 'zod'

export const TipoUpdateSchema = z.object({
    id_tipo:z.number(),

    nombre:z.string().min(1, {message:"Nombre es  requerido"}).min(2,{message:"Debe contener como mimimo 2 caracteres"}),

    estado:z.boolean({required_error:"Estado es requerido"})
})

export type TipoUpdate = z.infer<typeof TipoUpdateSchema> 

export const TipoSchema = z.object({
    id_tipo:z.number().optional(),

    nombre:z.string().min(1, {message:"Nombre es  requerido"}).min(2,{message:"Debe contener como mimimo 2 caracteres"}),

    estado:z.boolean({required_error:"Estado es requerido"}),
    
    created_at: z.string().default("").optional(),

    updated_at: z.string().default("").optional()
})
export type Tipo = z.infer<typeof TipoSchema>