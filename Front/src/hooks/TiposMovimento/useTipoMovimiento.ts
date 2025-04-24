import { axiosAPI } from "@/axios/axiosAPI";
import { Tipo } from "@/schemas/TipoMovimiento";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useTipoMovimiento() {
  const queryClient = useQueryClient();

  const url = "tipoMovimiento";

  const { data, isLoading, isError, error } = useQuery<Tipo[]>({
    queryKey: ["tipos"],
    queryFn: async () => {
      const res = await axiosAPI.get(url);
      return res.data;
    },
  });

  const addTipoMutation = useMutation({
    mutationFn: async (newTipo: Tipo) => {
      await axiosAPI.post<Tipo>(url, newTipo);
      return newTipo;
    },
    onSuccess: (tipo) => {
      console.log(tipo);
      queryClient.setQueryData<Tipo[]>(["tipos"], (oldData) =>
        oldData ? [...oldData, tipo] : [tipo]
      );
    },
    onError: (error) => {
      console.log("Error al cargar el tipo de movimiento", error);
    },
  });

  const getTipoMovimientoById = (
    id: number,
    tipos: Tipo[] | undefined = data
  ): Tipo | null => {
    return tipos?.find((tipo) => tipo.id_tipo === id) || null;
  };

  const updateTipoMutation = useMutation({
    mutationFn: async ({
      id,
      update,
    }: {
      id: number;
      update: Partial<Tipo>;
    }) => {
      await axiosAPI.put<Tipo>(`${url}/${id}`, update);
      return { id, update };
    },
    onSuccess: ({ id, update }) => {
      console.log("dato 1: ", id, " dato 2: ", update);
      queryClient.setQueryData<Tipo[]>(["tipos"], (oldData) =>
        oldData
          ? oldData.map((tipo) =>
              tipo.id_tipo === id
                ? { ...tipo, ...update }
                : tipo
            )
          : []
      );
    },

    onError: (error) => {
      console.error("Error al actualizar:", error);
    },
  });

  const changeStateMutation = useMutation({
    mutationFn: async (id_tipo: number) => {
      await axiosAPI.put<Tipo>(`tipoMovimiento/cambiarEstado/${id_tipo}`);
      return id_tipo;
    },

    onSuccess: (id_tipo: number) => {
      queryClient.setQueryData<Tipo[]>(["tipos"], (oldData) =>
        oldData
          ? oldData.map((tipo: Tipo) =>
              tipo.id_tipo == id_tipo
                ? { ...tipo, estado: !tipo.estado }
                : tipo
            )
          : []
      );
    },

    onError: (error) => {
      console.error("Error al actualizar estado:", error);
    },
  });

  const addTipoMovimiento = async (tipoMovimiento: Tipo) => {
    return addTipoMutation.mutateAsync(tipoMovimiento);
  };

  const updateTipoMovimiento = async (id: number, update: Partial<Tipo>) => {
    return updateTipoMutation.mutateAsync({ id, update });
  };

  const changeState = async (id_tipo: number) => {
    return changeStateMutation.mutateAsync(id_tipo);
  };

  return {
    tipos: data,
    isLoading,
    isError,
    error,
    addTipoMovimiento,
    changeState,
    getTipoMovimientoById,
    updateTipoMovimiento,
  };
}
