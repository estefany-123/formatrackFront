import { ElementoPostData, postElemento } from "@/axios/Elementos/postElemento";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Elemento } from "@/types/Elemento";
import { putElemento } from "@/axios/Elementos/putElemento";
import { deleteElemento } from "@/axios/Elementos/deleteElemento";
import { getElemento } from "@/axios/Elementos/getElemento";

export function useElemento() {
  const queryClient = useQueryClient();

  const { data, isLoading, isError, error } = useQuery<Elemento[]>({
    queryKey: ["elementos"],
    queryFn: getElemento,
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

  const addElemento = async (elemento: Elemento): Promise<{ idElemento: number }> => {
    const response = await addElementoMutation.mutateAsync(elemento);
    if (response && response.idElemento) {
      return { idElemento: response.idElemento };
    }
    throw new Error("Respuesta inesperada de la API");
  };

  const updateElemento = async (id: number, data:Elemento) => {
    return updateElementoMutation.mutateAsync({ id, data});
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
