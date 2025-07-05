import { RolPermiso } from "@/types/RolPermiso";
import { axiosAPI } from "../axiosAPI";

export const getRolPermisos = async (): Promise<RolPermiso[]> => {
  const { data } = await axiosAPI.get("rol-permiso");
  return data;
};