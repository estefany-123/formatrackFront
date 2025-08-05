import { z } from "zod";

export const CentroSchema = z.object({
    idCentro : z.number().optional(),
    nombre : z
    .string()
    .min(5,{message:"Minimo 5 caracteres"})
    .min(5,{message:"Minimo 5 caracteres"}),
    estado: z
        .boolean({ required_error: "Estado es requerido" }),
    fkMunicipio : z.number({required_error: "Municipio requerido"})
})

export type Centro = z.infer<typeof CentroSchema>;

export const CentroUpdateSchema = z.object({
    idCentro : z.number(),
    nombre : z.string().min(3,{message : "Es necesario un nombre"}).min(3,"Mínimo 3 caracteres"),
})

export type CentroUpdate = z.infer<typeof CentroUpdateSchema>