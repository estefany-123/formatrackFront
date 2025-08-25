import { useQuery, useMutation, useQueryClient} from "@tanstack/react-query";
import { getNotificacionesPorUsuario } from "@/axios/Notificaciones/getNotificacionesPorUsuario";
import { marcarComoLeida } from "@/axios/Notificaciones/marcarComoLeida";
import { cambiarEstadoNotificacion } from "@/axios/Notificaciones/cambiarEstado";
import { useSocketNotificaciones } from "@/hooks/Notificaciones/useSocketNotificaciones";
import { Notificacion } from "@/types/Notificacion";
import { useEffect, useState } from "react";

export function useNotificaciones(usuarioId: number) {
  const queryClient = useQueryClient();
  const [notificaciones, setNotificaciones] = useState<Notificacion[]>([]);

  const { data, isLoading, error, refetch } = useQuery<Notificacion[]>({
    queryKey: ["notificaciones", usuarioId],
    queryFn: () => getNotificacionesPorUsuario(usuarioId),
    enabled: !!usuarioId,
  });

  useEffect(() => {
    if (data) setNotificaciones(data);
  }, [data]);


  useSocketNotificaciones(usuarioId, (nueva: Notificacion) => {
    setNotificaciones((prev) => {
      const yaExiste = prev.some((n) => n.idNotificacion === nueva.idNotificacion);
      if (yaExiste) return prev;
      return [nueva, ...prev];
    });
  });

  const { mutate: marcarLeida } = useMutation({
    mutationFn: marcarComoLeida,
    onSuccess: (_, idNoti) => {
      setNotificaciones((prev) =>
        prev.map((n) =>
          n.idNotificacion === idNoti ? { ...n, leido: true } : n
        )
      );
    },
  });

const { mutate: cambiarEstado } = useMutation({
  mutationFn: ({ id, estado }: { id: number; estado: 'aceptado' | 'cancelado' }) =>
    cambiarEstadoNotificacion(id, estado),

  onSuccess: (_, { id, estado }) => {
    setNotificaciones((prev) =>
      prev.map((n) =>
        n.idNotificacion === id ? { ...n, estado, leido: true } : n
      )
    );

    queryClient.invalidateQueries({ queryKey: ["notificaciones"] });
    queryClient.invalidateQueries({ queryKey: ["movimientos"] });
  },
});

  return {
    notificaciones,
    isLoading,
    error,
    marcarLeida,
    cambiarEstado,
    setNotificaciones, 
    refetch
  };
}
