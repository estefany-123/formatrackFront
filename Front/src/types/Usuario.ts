
export type User = {
    idUsuario?: number;
    documento?: number;
    nombre: string;
    apellido: string;
    edad: number;
    telefono: string;
    correo: string;
    estado?: boolean;
    cargo?: string;
    password?: string;
    fkRol?: number;
}

export type postUser = {
    documento?: number;
    nombre: string;
    apellido: string;
    edad: number;
    telefono: string;
    correo: string;
    estado?: boolean;
    cargo?: string;
    password?: string;
    fkRol?: number;
}

export type putUser = {
    idUsuario?: number;
    nombre: string;
    apellido: string | null;
    edad: number | null;
    telefono: string | null;
    correo: string | null;
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