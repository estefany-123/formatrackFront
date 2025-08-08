import { deleteUnidad } from "@/axios/UnidadesMedida/deleteUnidad";
import { getUnidad } from "@/axios/UnidadesMedida/getUnidad";
import { postUnidad } from "@/axios/UnidadesMedida/postUnidad";
import { putUnidad } from "@/axios/UnidadesMedida/putUnidad";
import { Unidad } from "@/types/Unidad";
import { addToast } from "@heroui/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useUnidad() {
  const queryClient = useQueryClient();

  const { data, isLoading, isError, error } = useQuery<Unidad[]>({
    queryKey: ["unidades"],
    queryFn: getUnidad,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,

    select: (data) => data.map(u => ({
      ...u,
      idUnidad: Number(u.idUnidad) || 0
    }))
  });

  const addUnidadMutation = useMutation({
    mutationFn: postUnidad,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["unidades"],
      });
    },
    onError: (error) => {
      console.log("Error al cargar el unidad", error);
    },
  });

  const getUnidadById = (
    id: number,
    unidades: Unidad[] | undefined = data
  ): Unidad | null => {
    return unidades?.find((unidad) => unidad.idUnidad === id) || null;
  };

  const updateUnidadMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Unidad }) => {
      const { idUnidad, ...resto } = data;
      return putUnidad(id, resto);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["unidades"],
      });
    },

    onError: (error) => {
      console.error("Error al actualizar:", error);
    },
  });

  const changeStateMutation = useMutation({
    mutationFn: deleteUnidad,
    onSuccess: () => {
      addToast({
        title: "Estado cambiado con exito",
        color: "primary",
        timeout: 3000,
        shouldShowTimeoutProgress: true,
      });
      queryClient.invalidateQueries({
        queryKey: ["unidades"],
      });
    },

    onError: (error) => {
      console.error("Error al actualizar estado:", error);
    },
  });

  const addUnidad = async (unidad: Unidad) => {
    return addUnidadMutation.mutateAsync(unidad);
  };

  const updateUnidad = async (id: number, data: Unidad) => {
    return updateUnidadMutation.mutateAsync({ id, data });
  };

  const changeState = async (idUnidad: number) => {
    return changeStateMutation.mutateAsync(idUnidad);
  };

  return {
    unidades: data,
    isLoading,
    isError,
    error,
    addUnidad,
    changeState,
    getUnidadById,
    updateUnidad,
  };
}
