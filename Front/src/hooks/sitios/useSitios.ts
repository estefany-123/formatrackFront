import { axiosAPI } from '@/axios/axiosAPI';
import { sitio } from '@/schemas/sitios'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export function useSitios() {

    const queryClient = useQueryClient();

    const url = 'Sitio';

    const { data, isLoading, isError, error } = useQuery<sitio[]>({
        queryKey: ["sitios"],
        queryFn: async () => {
            const res = await axiosAPI.get(url);
            return res.data;
        }
    });

    const addSitioMutation = useMutation({
        mutationFn: async(newSitio: sitio) => {
            await axiosAPI.post<sitio>(url, newSitio)
            return newSitio
        },
        onSuccess: (sitio) => {
            console.log(sitio);
            queryClient.setQueryData<sitio[]>(["sitios"], (oldData) =>
                oldData ? [...oldData,sitio] : [sitio]
            );
        },
        onError: (error) => {
            console.log("Error al cargar el sitio", error);
        }
    });

    const getSitioById = (id: number, sitios : sitio[] | undefined = data ): sitio | null => {
        return sitios?.find((sitio) => sitio.id_sitio === id) || null;
    }

    const updateSitioMutation = useMutation({
        mutationFn: async({ id, update } : { id: number; update: Partial<sitio> }) => {
            await axiosAPI.put<sitio>(`${url}/${id}`, update);
            return {id, update}
        },
        onSuccess: ({ id, update }) => {
            console.log("dato 1: ",id," dato 2: ",update);
            queryClient.setQueryData<sitio[]>(["sitios"], (oldData) =>
                oldData
                    ? oldData.map((sitio) =>
                        sitio.id_sitio === id ? { ...sitio, ...update } : sitio
                    )
                    : []
            );
        },

        onError: (error) => {
            console.error("Error al actualizar:", error);
        }
    });

    const changeStateMutation = useMutation({
        mutationFn: async (id_sitio: number) => {
            await axiosAPI.put<sitio>(`sitio/estado/${id_sitio}`);
            return id_sitio
        },

        onSuccess: (id_sitio: number) => {
            queryClient.setQueryData<sitio[]>(["sitios"], (oldData) =>
                oldData
                    ? oldData.map((sitio: sitio) =>
                        sitio.id_sitio == id_sitio
                            ? { ...sitio, estado: !sitio.estado }
                            : sitio
                    )
                    : []
            );
        },

        onError: (error) => {
            console.error("Error al actualizar estado:", error);
        },
    });

    const addSitio = async (sitio: sitio) => {
        return addSitioMutation.mutateAsync(sitio);
    };

    const updateSitio = async (id: number, update: Partial<sitio>) => {
        return updateSitioMutation.mutateAsync({ id, update });
    };

    const changeState = async (id_sitio: number) => {
        return changeStateMutation.mutateAsync(id_sitio);
    };

    return {
        sitios: data,
        isLoading,
        isError,
        error,
        addSitio,
        changeState,
        getSitioById,
        updateSitio
    }
}