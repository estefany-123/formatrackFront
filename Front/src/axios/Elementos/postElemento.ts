import { axiosAPI } from "../axiosAPI";

export interface ElementoPostData {
  nombre: string;
  descripcion: string;
  perecedero: boolean;
  noPerecedero: boolean;
  estado: boolean;
  fechaVencimiento?: string;
  fechaUso: string;
  baja:boolean
  imagenElemento?: string | File;
  fkUnidadMedida: number;
  fkCategoria: number;
  fkCaracteristica: number | null;
}

export async function postElemento(
  data: ElementoPostData
): Promise<{ idElemento: number }> {
  const formData = new FormData();
  formData.append("nombre", data.nombre);
  formData.append("descripcion", data.descripcion);
  formData.append("perecedero", data.perecedero.toString());
  formData.append("noPerecedero", data.noPerecedero.toString());
  formData.append("estado", data.estado.toString());
  formData.append("baja", data.baja.toString());
  if (data.fechaVencimiento) {
    formData.append("fechaVencimiento", data.fechaVencimiento.toString());
  }
  formData.append("fechaUso", data.fechaUso.toString());
  formData.append("fkUnidadMedida", data.fkUnidadMedida.toString());
  formData.append("fkCategoria", data.fkCategoria.toString());
  if (data.fkCaracteristica) {
  formData.append("fkCaracteristica", data.fkCaracteristica.toString());
  }
  if (data.imagenElemento) {
    formData.append("imagenElemento", data.imagenElemento);
  }

  const res = await axiosAPI.post("elementos", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  const id = res.data?.idElemento;

  if (typeof id !== "number") {
    throw new Error("La respuesta del backend no contiene un id válido");
  }

  return { idElemento: id };
}
