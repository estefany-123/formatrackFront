export type Centro = {
    id_centro : number,
    nombre : string,
    estado : boolean,
    fk_municipio : number
}

export type PutCentro = {
    id_centro : number,
    nombre : string
}