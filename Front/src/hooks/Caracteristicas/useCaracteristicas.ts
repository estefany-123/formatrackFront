import { getCaracteristicas } from '@/axios/Caracteristicas/getCaracteris';
import { postCaracteristica } from '@/axios/Caracteristicas/postCaracteris';
import { updateCategoria } from '@/axios/Caracteristicas/putCaracteris';
import { Caracteristica } from '@/types/Caracteristica'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export function useCaracteristica() {

    const queryClient = useQueryClient();

    const { data, isLoading, isError, error } = useQuery<Caracteristica[]>({
        queryKey: ["caracteristicas"],
        queryFn: getCaracteristicas,
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 10
    });

    const addCaracteristicaMutation = useMutation({
        mutationFn: postCaracteristica,
         onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["municipio"],
            });
        },
        onError: (error) => {
            console.log("Error al cargar la caracteristica", error);
        }
    });

    const getCaracteristicaById = (id: number, caracteristicas : Caracteristica[] | undefined = data ): Caracteristica | null => {
        return caracteristicas?.find((caracteristica) => caracteristica.idCaracteristica === id) || null;
    }

    const updateCaracteristicaMutation = useMutation({
        mutationFn: ({id, data}:{id:number, data:Caracteristica}) =>updateCategoria(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({
              queryKey: ["caracteristicas"],
            });
          },

        onError: (error) => {
            console.error("Error al actualizar:", error);
        }
    });

    const addCaracteristica = async (caracteristica: Caracteristica) => {
        return addCaracteristicaMutation.mutateAsync(caracteristica);
    };

    const updateCaracteristica = async (id: number, data: Caracteristica) => {
        return updateCaracteristicaMutation.mutateAsync({ id, data });
    };

   
    return {
        caracteristicas: data,
        isLoading,
        isError,
        error,
        addCaracteristica,
        getCaracteristicaById,
        updateCaracteristica
    }
}