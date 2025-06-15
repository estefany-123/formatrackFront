import { Municipio,UpdMunicipio } from '@/types/Municipio'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getMunicipio } from '@/axios/Municipio/getMunicipio';
import { postMunicipio } from '@/axios/Municipio/postMunicipio';
import { UpMunicipio } from '@/axios/Municipio/putMunicipio';
import { StateMunicipio } from '@/axios/Municipio/putStateMunicipio';

export function useMunicipio() {

    const queryClient = useQueryClient();

    const { data, isLoading, isError, error } = useQuery<Municipio[]>({
        queryKey: ["municipio"],
        queryFn: getMunicipio,
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 10
    });

    const addMunicipioMutation = useMutation({
        mutationFn: postMunicipio,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["municipio"],
            });
        },
        onError: (error) => {
            console.log("Error al cargar el municipio", error);
        }
    });

    const getMunicipioById = (id: number, municipios : Municipio[] | undefined = data ): Municipio | null => {
        return municipios?.find((municipio) => municipio.id_municipio === id) || null;
    }

    const updateMunicipioMutation = useMutation({
        mutationFn: ({id, data}:{id:number, data:UpdMunicipio}) =>UpMunicipio(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({
              queryKey: ["municipio"],
            });
          },

        onError: (error) => {
            console.error("Error al actualizar:", error);
        }
    });

    const changeStateMutation = useMutation({
        mutationFn: StateMunicipio,

        onSuccess: () => {
            queryClient.invalidateQueries({
              queryKey: ["municipio"],
            });
          },

        onError: (error) => {
            console.error("Error al actualizar estado:", error);
        },
    });

    const addMunicipio = async (municipio: Municipio) => {
        return addMunicipioMutation.mutateAsync(municipio);
    };

    const updateMunicipio = async (id: number, data: UpdMunicipio) => {
        return updateMunicipioMutation.mutateAsync({ id, data });
    };

    const changeState = async (id_municipio: number) => {
        return changeStateMutation.mutateAsync(id_municipio);
    };

    return {
        municipios: data,
        isLoading,
        isError,
        error,
        addMunicipio,
        changeState,
        getMunicipioById,
        updateMunicipio
    }
}