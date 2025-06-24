import { z } from 'zod'

export const UserUpdateSchema = z.object({
    idUsuario: z
        .number(),
    nombre: z
        .string()
        .min(1, { message: "Nombre es requerido" })
        .min(3, { message: "Longitud minima de 3" }),

    apellido: z
        .string()
        .min(1, { message: "Apellido es requerido" })
        .min(3, { message: "Longitud minima de 3" }),
    edad: z
        .number({ message: "Edad es requerida y debe ser un numero" }),

    telefono: z
        .string({ required_error: "Telefono es requerido" })
        .min(1, { message: "Longitud minima de 1" }),

    correo: z
        .string()
        .email({ message: "Correo es requerido" }),
    cargo: z
        .string().min(1, { message: "Cargo es requerido" }),
})

export type UserUpdate = z.infer<typeof UserUpdateSchema>

export const UserSchema = z.object({
    idUsuario: z
        .number(),

    documento: z
        .number({ message: "Documento es requerido y debe ser un numero" })
        .min(10, { message: "Longitud minima de 10" }),

    nombre: z
        .string()
        .min(1, { message: "Nombre es requerido" })
        .min(3, { message: "Longitud minima de 3" }),

    apellido: z
        .string({ required_error: "Apellido es requerido" })
        .min(3, { message: "Longitud minima de 3" }),
    edad: z
        .number({ message: "Edad es requerido" })
        .min(1, { message: "Longitud minima de 1" }),

    telefono: z
        .string({ required_error: "Telefono es requerido" })
        .min(10, { message: "Longitud minima de 10" }),

    correo: z
        .string()
        .email({ message: "Correo es requerido" }),

    estado: z
        .boolean({ required_error: "Estado es requerido" }),
    cargo: z
        .string()
        .min(1, { message: "Cargo es requerido" }),
    password: z
        .string({ message: "Contraseña es obligatoria" })
        .min(1, { message: "Contraseña es requerida" }),
    fk_rol: z
        .number({ message: "Rol es requerido y debe ser un numero" })
})

export type User = z.infer<typeof UserSchema>


export const LoginSchema = z.object({
    documento: z
        .string({ required_error: "Documento es requerido"})
        .min(10, { message: "Debe tener exactamente 10 dígitos" })
        .regex(/^\d+$/, { message: "Debe contener solo números" }),
    password: z
        .string()
        .min(1, { message: "Contraseña es requerido" })
        .min(8, { message: "minimo 8 caracteres" }),
})


export type Credenciales = z.infer<typeof LoginSchema>


export const tokenSchema = z.object({
    token: z
        .string({ message: "Token es requerido" })
        .optional(),
    documento: z
        .string({ required_error: "Documento es requerido"})
        .min(10, { message: "Debe tener exactamente 10 dígitos" })
        .regex(/^\d+$/, { message: "Debe contener solo números" }),
    password: z 
        .string({ required_error: "Contraseña es requerido" }),
})


export type LoginRes = z.infer<typeof tokenSchema>



export const forgotPasswordSchema = z.object({
    correo: z
        .string()
        .email({ message: "Ingresa un correo válido" })
        .min(1, { message: "El correo es requerido" }),
})

export type forgotPass = z.infer<typeof forgotPasswordSchema>


export const resetPasswordSchema = z.object({
    password: z
        .string()
        .min(1, { message: "Contraseña es requerido" })
        .min(8, { message: "minimo 8 caracteres" }),
    confirmPassword :z
        .string()
        .min(1, { message: "Contraseña es requerido" })
        .min(8, { message: "minimo 8 caracteres" }),
})
.refine((data)=> data.password === data.confirmPassword,{
    message:"Las contraseñas no coinciden",
    path:["confirmPassword"]
});

export type resetPass = z.infer<typeof resetPasswordSchema>