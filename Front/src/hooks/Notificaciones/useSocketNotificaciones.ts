import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { Notificacion } from "@/types/Notificacion";

const SOCKET_URL = "http://localhost:3000";

export function useSocketNotificaciones(
  usuarioId: number,
  onNotificacion: (noti: Notificacion) => void
) {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!usuarioId) return;

    const socket = io(SOCKET_URL, {
      transports: ["websocket"],
    });

    socketRef.current = socket;

    // Unirse a la sala del usuario
    socket.emit("join", `usuario_${usuarioId}`);

    // Escuchar notificaciones
    socket.on("nuevaNotificacion", (noti: Notificacion) => {
      console.log("📥 Notificación recibida:", noti);
      onNotificacion(noti);
    });

    return () => {
      socket.disconnect();
    };
  }, [usuarioId, onNotificacion]);
}
