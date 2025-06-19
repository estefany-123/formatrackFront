export type Sitios = {
    idSitio?: number;
    nombre: string;
    personaEncargada?: string;
    ubicacion?: string;
    estado?: boolean;
    createdAt?:string;
    updatedAt?:string;
    fkTipoSitio?: number;
    fkArea?: number;
}