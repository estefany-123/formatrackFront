import { AgregateStockData, agregateStock } from "@/axios/Inventarios/agregateStockInventario";
import { deleteInventario } from "@/axios/Inventarios/deleteInventario";
import { getInventario } from "@/axios/Inventarios/getInventario";
import { postInventario } from "@/axios/Inventarios/postInventario";
import { putInventario } from "@/axios/Inventarios/putInventario";
import { Inventario, InventarioConSitio } from "@/types/Inventario";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useInventario() {
  const queryClient = useQueryClient();

  const { data, isLoading, isError, error } = useQuery<InventarioConSitio[]>({
    queryKey: ["inventarios"],
    queryFn: getInventario,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
  });

  const addInventarioMutation = useMutation({
    mutationFn: postInventario,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["inventarios"],
      });
    },
  });

  const getInventarioById = (
    id: number,
    inventarios: Inventario[] | undefined = data
  ): Inventario | null => {
    return (
      inventarios?.find((inventario) => inventario.idInventario === id) || null
    );
  };

  const updateInventarioMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Inventario }) => {
      const { idInventario, ...resto } = data;
      return putInventario(id, resto);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["inventarios"],
      });
    },

    onError: (error) => {
      console.error("Error al actualizar:", error);
    },
  });

  const changeStateMutation = useMutation({
    mutationFn: deleteInventario,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["inventarios"],
      });
    },

    onError: (error) => {
      console.error("Error al actualizar estado:", error);
    },
  });

  const agregarStockMutation = useMutation({
    mutationFn: agregateStock,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventarios"] });
    },
    onError: (error) => {
      console.error("Error al agregar stock:", error);
    },
  });

  const addInventario = async (inventario: Inventario) => {
    return addInventarioMutation.mutateAsync(inventario);
  };

  const updateInventario = async (id: number, data: Inventario) => {
    return updateInventarioMutation.mutateAsync({ id, data });
  };

  const changeState = async (idInventario: number) => {
    return changeStateMutation.mutateAsync(idInventario);
  };

  const agregarStockInventario = async (data: AgregateStockData) => {
  return agregarStockMutation.mutateAsync(data);
};

  return {
    inventarios: data,
    isLoading,
    isError,
    error,
    addInventario,
    changeState,
    getInventarioById,
    updateInventario,
    agregarStockInventario
  };
}
