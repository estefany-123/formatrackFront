import { getCodigoInventario } from "@/axios/CodigoInventario/getCodigoInventario";
import { postCodigoInventario } from "@/axios/CodigoInventario/postCodigoInventario";
import { putCodigoInventario } from "@/axios/CodigoInventario/putCodigoInventario";
import { CodigoInevntario } from "@/types/codigoInventario";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useCodigoInventario() {
  const queryClient = useQueryClient();

  const { data, isLoading, isError, error } = useQuery<CodigoInevntario[]>({
    queryKey: ["codigosInventario"],
    queryFn: getCodigoInventario,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
  });

  const addCodigoMutation = useMutation({
    mutationFn: postCodigoInventario,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["codigosInventario"],
      });
    },
    onError: (error) => {
      console.error("Error al registrar el código de inventario:", error);
    },
  });

  const getCodigoInventarioById = (
    id: number,
    codigos: CodigoInevntario[] | undefined = data
  ): CodigoInevntario | null => {
    return codigos?.find((codigo) => codigo.idCodigoInventario === id) || null;
  };

  const updateCodigoMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<CodigoInevntario> }) => {
      return putCodigoInventario(id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["codigosInventario"],
      });
    },
    onError: (error) => {
      console.error("Error al actualizar el código de inventario:", error);
    },
  });

  const addCodigoInventario = async (codigo: {
    codigo: string;
    fkInventario: number;
  }) => {
    return addCodigoMutation.mutateAsync(codigo);
  };

  const updateCodigoInventario = async (
    id: number,
    data: Partial<CodigoInevntario>
  ) => {
    return updateCodigoMutation.mutateAsync({ id, data });
  };

  return {
    codigos: data,
    isLoading,
    isError,
    error,
    addCodigoInventario,
    updateCodigoInventario,
    getCodigoInventarioById,
  };
}
