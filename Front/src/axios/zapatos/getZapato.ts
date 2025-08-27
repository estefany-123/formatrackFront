import { Zapato } from "@/types/zapato";
import { axiosAPI } from "../axiosAPI";

export const getZapatos = async (): Promise<Zapato[]> => {
  const res = await axiosAPI.get(`zapato`);
  return res.data;
};
