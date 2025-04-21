export type User = {
    imagen_url: string | null;
    id_usuario: number;
    documento: number;
    nombre: string;
    apellido: string;
    edad: number;
    telefono: string;
    correo: string;
    estado: boolean;
    cargo: string;
    password: string;
    fk_rol: number;
}