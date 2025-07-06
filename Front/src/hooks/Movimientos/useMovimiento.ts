import { getMovimiento } from "@/axios/Movimentos/getMovimento";
import { MovimientoPostData, postMovimiento } from "@/axios/Movimentos/postMovimiento";
import { putMovimiento } from "@/axios/Movimentos/putMovimiento";
import { Movimiento } from "@/types/Movimiento";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useMovimiento() {
  const queryClient = useQueryClient();

  const { data, isLoading, isError, error } = useQuery<Movimiento[]>({
    queryKey: ["movimientos"],
    queryFn: getMovimiento,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
  });

  const addMovimientoMutation = useMutation({
    mutationFn: postMovimiento,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["movimientos"],
      });
    },
    onError: (error) => {
      console.log("Error al cargar el movimiento", error);
    },
  });

  const getMovimientoById = (
    id: number,
    movimientos: Movimiento[] | undefined = data
  ): Movimiento | null => {
    return (
      movimientos?.find((movimiento) => movimiento.idMovimiento === id) || null
    );
  };

  const updateMovimientoMutation = useMutation({
    mutationFn: ({id, data}:{id:number, data:MovimientoPostData}) => {
      const {idMovimiento, ...resto} = data
      return putMovimiento(id, resto)},
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["movimientos"],
      });
    },

    onError: (error) => {
      console.error("Error al actualizar:", error);
    },
  });

  const addMovimiento = async (movimiento: Movimiento) => {
    return addMovimientoMutation.mutateAsync(movimiento);
  };

  const updateMovimiento = async (id: number, data: Movimiento) => {
    return updateMovimientoMutation.mutateAsync({ id, data });
  };


  return {
    movimientos: data,
    isLoading,
    isError,
    error,
    addMovimiento,
    // changeState,
    getMovimientoById,
    updateMovimiento,
  };
}
