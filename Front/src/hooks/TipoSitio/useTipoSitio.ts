import { TipoSitio, UpTipoSitio } from '@/types/TipoSitio'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getTipoSitio } from '@/axios/TipoSitio/getTipoSitio';
import { postTipoSitio } from '@/axios/TipoSitio/postTipoSitio';
import { updateTipoSitio } from '@/axios/TipoSitio/putTipoSitio';
import { StateTipoSitio } from '@/axios/TipoSitio/putStateTipoSitio';

export function useTipoSitio() {

    const queryClient = useQueryClient();


    const { data, isLoading, isError, error } = useQuery<TipoSitio[]>({
        queryKey: ["tipoSitio"],
        queryFn: getTipoSitio,
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 10
    });



    const addTipoMutation = useMutation({
        mutationFn: postTipoSitio,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["tipoSitio"],
            });
        },
        onError: (error) => {
            console.log("Error al cargar el tipo de sitio", error);
        },
    });



    const getTipoById = (id: number, tipo: TipoSitio[] | undefined = data): TipoSitio | null => {
        return tipo?.find((tipos) => tipos.id_tipo === id) || null;
    }

    const updateTipoMutation = useMutation({
        mutationFn: ({ id, data }: { id: number, data: UpTipoSitio }) => updateTipoSitio(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["tipoSitio"],
            });
        },

        onError: (error) => {
            console.error("Error al actualizar:", error);
        },
    });

    const changeStateMutation = useMutation({
        mutationFn: StateTipoSitio,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["tipoSitio"],
            });
        },

        onError: (error) => {
            console.error("Error al actualizar estado:", error);
        },
    });


    const addTipo = async (tipos: TipoSitio) => {
        return addTipoMutation.mutateAsync(tipos);
    };

    const updateTipo = async (id: number, data:UpTipoSitio) => {
        return updateTipoMutation.mutateAsync({ id, data });
    };

    const changeState = async (id_tipo: number) => {
        return changeStateMutation.mutateAsync(id_tipo);
    };

    return {
        tipos: data,
        isLoading,
        isError,
        error,
        addTipo,
        changeState,
        getTipoById,
        updateTipo
    }
}