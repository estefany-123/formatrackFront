import {z} from 'zod'

export const MovimientoUpdateSchema = z.object({
    id_movimiento:z.number(),

    descripcion:z.string().min(1, {message:"Descripcion es  requerida"}).min(2,{message:"Debe contener como mimimo 2 caracteres"}),

    cantidad: z.number({
        required_error: "Cantidad es requerida y debe ser entero",
      }),
    hora_ingreso:z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, {
        message: "La hora debe tener el formato HH:mm (24h)",
      }),
    hora_salida:z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, {
        message: "La hora debe tener el formato HH:mm (24h)",
      })
})

export type MovimientoUpdate = z.infer<typeof MovimientoUpdateSchema> 

export const MovimientoSchema = z.object({
    id_movimiento:z.number().optional(),

    descripcion:z.string().min(1, {message:"Descripcion es  requerida"}).min(2,{message:"Debe contener como mimimo 2 caracteres"}),
    cantidad: z.number({
        required_error: "Cantidad es requerida y debe ser entero",
      }),

      hora_ingreso:z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, {
        message: "La hora debe tener el formato HH:mm (24h)",
      }),

    hora_salida:z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, {
        message: "La hora debe tener el formato HH:mm (24h)",
      }),

      estado: z.boolean({ required_error: "Estado es requerido" }),

    aceptado: z.boolean(),

    en_proceso: z.boolean(),

    cancelado: z.boolean(),

    devolutivo: z.boolean(),

    no_devolutivo: z.boolean(),

    created_at: z.string().default("").optional(),

    updated_at: z.string().default("").optional(),

    fk_usuario: z.number({ message: "Usuario es requerido" }),

    fk_tipo_movimiento:z.number({ message: "Tipo Novimiento es requerido" }),

    fk_sitio: z.number({ message: "Sitio es requerido" }),

    fk_inventario: z.number({ message: "Inventario es requerido" }),

    tipo_bien: z.enum(["devolutivo", "no_devolutivo"], {
        required_error: "Debe seleccionar un tipo de elemento",
      }),
})
export type Movimiento = z.infer<typeof MovimientoSchema>