import {z} from 'zod'

export const PermisoUpdateSchema = z.object({
    id_permiso:z.number(),

    nombre:z.string().min(1, {message:"Nombre es  requerido"}).min(3,{message:"Debe contener como mimimo 3 caracteres"}),

    estado:z.boolean({required_error:"Estado es requerido"})
})

export type PermisoUpdate = z.infer<typeof PermisoUpdateSchema> 

export const PermisoSchema = z.object({
    id_rol:z.number(),

    nombre:z.string().min(1, {message:"Nombre es  requerido"}).min(3,{message:"Debe contener como mimimo 3 caracteres"}),

    created_at: z.string(),

    updated_at: z.string(),

    estado:z.boolean({required_error:"Estado es requerido"})
})
export type Permiso = z.infer<typeof PermisoSchema>

export const PermisoCreateSchema = z.object({

    nombre:z.string().min(1, {message:"Nombre es  requerido"}).min(3,{message:"Debe contener como mimimo 3 caracteres"}),

    estado:z.boolean({required_error:"Estado es requerido"})
})
export type RolCreate = z.infer<typeof PermisoCreateSchema>