import { axiosAPI } from "@/axios/axiosAPI";
import { postElemento } from "@/axios/Elementos/postElemento";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Elemento } from "@/types/Elemento";
import { putElemento } from "@/axios/Elementos/putElemento";
import { deleteElemento } from "@/axios/Elementos/deleteElemento";

export function useElemento() {
  const queryClient = useQueryClient();

  const url = "elemento";

  const { data, isLoading, isError, error } = useQuery<Elemento[]>({
    queryKey: ["elementos"],
    queryFn: async () => {
      const res = await axiosAPI.get(url);
      return res.data;
    },
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
  });

  const addElementoMutation = useMutation({
    mutationFn: postElemento,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["elementos"],
      });
    },
    onError: (error) => {
      console.log("Error al cargar el elemento", error);
    },
  });

  const getElementoById = (
    id: number,
    elementos: Elemento[] | undefined = data
  ): Elemento | null => {
    return elementos?.find((elemento) => elemento.id_elemento === id) || null;
  };

  const updateElementoMutation = useMutation({
    mutationFn: ({id, data}:{id:number, data:Elemento}) => putElemento(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["elementos"],
      });
    },

    onError: (error) => {
      console.error("Error al actualizar:", error);
    },
  });

  const changeStateMutation = useMutation({
    mutationFn:deleteElemento,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["elementos"],
      });
    },

    onError: (error) => {
      console.error("Error al actualizar estado:", error);
    },
  });

  const addElemento = async (elemento: Elemento) => {
    return addElementoMutation.mutateAsync(elemento);
  };

  const updateElemento = async (id: number, data:Elemento) => {
    return updateElementoMutation.mutateAsync({ id, data});
  };

  const changeState = async (id_elemento: number) => {
    return changeStateMutation.mutateAsync(id_elemento);
  };

  return {
    elementos: data,
    isLoading,
    isError,
    error,
    addElemento,
    changeState,
    getElementoById,
    updateElemento,
  };
}
