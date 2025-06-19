import { ElementoPostData } from "@/axios/Elementos/postElemento";

export interface Elemento extends ElementoPostData {
  idElemento?: number;
  createdAt?:string;
  updatedAt?:string;
  tipoElemento: "perecedero" | "noPerecedero";
}
