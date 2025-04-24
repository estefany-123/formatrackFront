import {z} from 'zod'

export const RolUpdateSchema = z.object({
    id_rol:z.number(),

    nombre:z.string().min(1, {message:"Nombre es  requerido"}).min(3,{message:"Debe contener como mimimo 3 caracteres"}),

    estado:z.boolean({required_error:"Estado es requerido"})
})

export type RolUpdate = z.infer<typeof RolUpdateSchema> 

export const RolSchema = z.object({
    id_rol:z.number().optional(),

    nombre:z.string().min(1, {message:"Nombre es  requerido"}).min(3,{message:"Debe contener como mimimo 3 caracteres"}),

    created_at: z.string().default("").optional(),

    updated_at: z.string().default("").optional(),

    estado:z.boolean({required_error:"Estado es requerido"})
})
export type Rol = z.infer<typeof RolSchema>
