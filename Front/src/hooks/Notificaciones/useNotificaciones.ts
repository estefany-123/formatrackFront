import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getNotificacionesPorUsuario } from "@/axios/Notificaciones/getNotificacionesPorUsuario";
import { marcarComoLeida } from "@/axios/Notificaciones/marcarComoLeida";
import { cambiarEstadoNotificacion } from "@/axios/Notificaciones/cambiarEstado";
import { useSocketNotificaciones } from "@/hooks/Notificaciones/useSocketNotificaciones";
import { Notificacion } from "@/types/Notificacion";

export function useNotificaciones(usuarioId: number) {
  const queryClient = useQueryClient();

  const { data: notificaciones, isLoading, error } = useQuery<Notificacion[]>({
    queryKey: ["notificaciones", usuarioId],
    queryFn: () => getNotificacionesPorUsuario(usuarioId),
    enabled: !!usuarioId,
  });

  useSocketNotificaciones(usuarioId, (nueva: Notificacion) => {
    queryClient.setQueryData<Notificacion[]>(["notificaciones", usuarioId], (prev = []) => [
      nueva,
      ...prev,
    ]);
  });

  const { mutate: marcarLeida } = useMutation({
    mutationFn: marcarComoLeida,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notificaciones", usuarioId] });
    },
  });

  const { mutate: cambiarEstado } = useMutation({
    mutationFn: ({ id, estado }: { id: number; estado: "aceptado" | "rechazado" }) =>
      cambiarEstadoNotificacion(id, estado),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notificaciones", usuarioId] });
    },
  });

  return {
    notificaciones,
    isLoading,
    error,
    marcarLeida,
    cambiarEstado,
  };
}
