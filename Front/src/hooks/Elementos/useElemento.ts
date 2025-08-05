import { postElemento } from "@/axios/Elementos/postElemento";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Elemento, postElementos, putElementos } from "@/types/Elemento";
import { putElemento } from "@/axios/Elementos/putElemento";
import { deleteElemento } from "@/axios/Elementos/deleteElemento";
import { getElemento } from "@/axios/Elementos/getElemento";
import { addToast } from "@heroui/react";

export function useElemento() {
  const queryClient = useQueryClient();

  const { data, isLoading, isError, error } = useQuery<Elemento[]>({
    queryKey: ["elementos"],
    queryFn: getElemento,
    staleTime:0,
    gcTime: 1000 * 60 * 10,
    refetchOnWindowFocus: true,
    refetchOnMount:true
  });

  const addElementoMutation = useMutation({
    mutationFn: postElemento,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["elementos"],
      });
    },
    onError: (error) => {
      console.error("Error al cargar el elemento", error);
    },
  });

  const getElementoById = (
    id: number,
    elementos: Elemento[] | undefined = data
  ): Elemento | null => {
    return elementos?.find((elemento) => elemento.idElemento === id) || null;
  };

  const updateElementoMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: putElementos }) =>
      putElemento(id, data),
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
    mutationFn: deleteElemento,

    onSuccess: () => {
      addToast({
        title: "Estado cambiado con exito",
        color: "primary",
        timeout: 3000,
        shouldShowTimeoutProgress: true,
      });
      queryClient.invalidateQueries({
        queryKey: ["elementos"],
      });
    },

    onError: (error) => {
      console.error("Error al actualizar estado:", error);
    },
  });

  const addElemento = async (elemento: postElementos) => {
    return await addElementoMutation.mutateAsync(elemento);
  };

  const updateElemento = async (id: number, data: putElementos) => {
    return updateElementoMutation.mutateAsync({ id, data });
  };

  const changeState = async (idElemento: number) => {
    return changeStateMutation.mutateAsync(idElemento);
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
