import { axiosAPI } from "../axiosAPI";

export async function cambiarEstadoNotificacion(
  idNotificacion: number,
  estado: "aceptado" | "rechazado"
) {
  const res = await axiosAPI.patch(`/notificaciones/${idNotificacion}/estado`, {
    estado,
  });
  return res.data;
}
