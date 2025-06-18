import { Sitios } from "@/types/sitios";
import { axiosAPI } from "../axiosAPI";

export const getSitio = async ():Promise<Sitios[]> => {
    const res = await axiosAPI.get(`sitios`);
    return res.data
}