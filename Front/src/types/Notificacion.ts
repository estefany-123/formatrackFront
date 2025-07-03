export type NotificacionEstado = "aceptado" | "rechazado" | "pendiente" | null;

export type Notificacion = {
  idNotificacion: number;
  titulo: string;
  mensaje: string | null;
  leido: boolean;
  requiereAccion: boolean;
  estado: NotificacionEstado;
  data: {
    idMovimiento?: number;
    idElemento?: number;
    [key: string]: any;
  } | null;
  createdAt: string;
  fkUsuario: {
    idUsuario: number;
    nombre: string;

};
}
