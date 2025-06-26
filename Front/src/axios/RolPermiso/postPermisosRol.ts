import {  RolPermisoPost } from "@/types/RolPermiso";
import { axiosAPI } from "../axiosAPI";

export type RolPermisoPostData = {
    idRolPermiso?:number
    estado:boolean
    fkPermiso:number
    fkRol:number
}

export const postRolPermiso = async (data:RolPermisoPostData): Promise<RolPermisoPost> => {
    const {idRolPermiso, ...resto} = data
  const res = await axiosAPI.post("rol-permiso", resto);
  return res.data;
};