import { getCodigoInventario } from "@/axios/CodigoInventario/getCodigoInventario";
import { putCodigoInventario } from "@/axios/CodigoInventario/putCodigoInventario";
import { CodigoInventario } from "@/types/codigoInventario";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useCodigoInventario() {
  const queryClient = useQueryClient();

  const { data, isLoading, isError, error } = useQuery<CodigoInventario[]>({
    queryKey: ["codigosInventario"],
    queryFn: getCodigoInventario,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
  });

  const getCodigosPorInventario = (
    idInventario: number
  ): CodigoInventario[] => {
    return (data ?? []).filter((c) => {
      if (typeof c.fkInventario === "object" && c.fkInventario !== null) {
        return c.fkInventario.idInventario === idInventario;
      }
      return c.fkInventario === idInventario;
    });
  };

  const getCodigoInventarioById = (
    id: number,
    codigos: CodigoInventario[] | undefined = data
  ): CodigoInventario | null => {
    return codigos?.find((codigo) => codigo.idCodigoInventario === id) || null;
  };

  const updateCodigoMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: CodigoInventario }) => {
      const {idCodigoInventario, ...resto} = data
      return putCodigoInventario(id, resto);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["codigosInventario"] });
    },
    onError: (error) => {
      console.error("Error al actualizar el código de inventario:", error);
    },
  });

  const updateCodigoInventario = async (
    id: number,
    data: Partial<CodigoInventario>
  ) => {
    return updateCodigoMutation.mutateAsync({ id, data });
  };

  return {
    codigos: data,
    isLoading,
    isError,
    error,
    updateCodigoInventario,
    getCodigoInventarioById,
    getCodigosPorInventario,
  };
}
