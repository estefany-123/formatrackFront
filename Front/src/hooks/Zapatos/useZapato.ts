
import { getZapatos } from "@/axios/zapatos/getZapato";
import { postZapatos } from "@/axios/zapatos/postZapato";
import { putZapatos } from "@/axios/zapatos/putZapato";
import { Zapato } from "@/types/zapato";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useZapato() {
  const queryClient = useQueryClient();

  const { data, isLoading, isError, error } = useQuery<Zapato[]>({
    queryKey: ["zapatos"],
    queryFn: getZapatos,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
  });

  const addZapatoMutation = useMutation({
    mutationFn: postZapatos,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["zapatos"],
      });
    },
    onError: (error) => {
      console.log("Error al cargar el rol", error);
    },
  });

  const getZapatoById = (
    id: number,
    zapatos: Zapato[] | undefined = data
  ): Zapato | null => {
    return zapatos?.find((zapato) => zapato.idZapato === id) || null;
  };

  const updateZapatoMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Zapato }) =>{
      const {idZapato, ...resto} = data;
      return putZapatos(id, resto)},
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["zapatos"],
      });
    },

    onError: (error) => {
      console.error("Error al actualizar:", error);
    },
  });


  const addZapato = async (zapato: Zapato) => {
    return addZapatoMutation.mutateAsync(zapato);
  };

  const updateZapato = async (id: number, data: Zapato) => {
    return updateZapatoMutation.mutateAsync({ id, data });
  };


  return {
    zapatos: data,
    isLoading,
    isError,
    error,
    addZapato,
    getZapatoById,
    updateZapato,
  };
}
