
export type User = {
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

export type LoginCrede = {
    documento : number,
    password : string
}

export type LoginRes = {
    token : string,
    documento : number,
    password : string
}