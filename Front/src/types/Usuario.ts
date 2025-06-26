
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

export type Perfil={
    documento:number,
    edad:number,
    nombre : string,
    apellido:string,
    telefono : string,
    correo : string,
    perfil: string,
    fkRol: {
        nombre: string
    }

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
    documento : string,
    password : string
}

export type LoginRes = {
    access_token : string,
    documento : number,
    password : string,
    modules : any[]
}

export type resetPassword = {
    password:string
    confirmPassword:string
}

export type forgotPassword = {
    correo : string
}