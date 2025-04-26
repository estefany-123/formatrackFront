import { axiosAPI } from '@/axios/axiosAPI';
import { programa } from '@/schemas/programas'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export function usePrograma() {

    const queryClient = useQueryClient();

    const url = 'P.formacion';

    const { data, isLoading, isError, error } = useQuery<programa[]>({
        queryKey: ["programa"], 
        queryFn: async () => {
            const res = await axiosAPI.get(url);
            return res.data;
        }
    });

    const addProgramaMutation = useMutation({
        mutationFn: async(newPrograma: programa) => {
            await axiosAPI.post<programa>(url, newPrograma)
            return newPrograma
        },
        onSuccess: (Programa) => {
            console.log(Programa);
            queryClient.setQueryData<programa[]>(["programa"], (oldData) => 
                oldData ? [...oldData,Programa] : [Programa]
            );
        },
        onError: (error) => {
            console.log("Error al cargar la Ficha", error);
        }
    });

    const getProgramaById = (id: number, Programa : programa[] | undefined = data ): programa | null => {
        return Programa?.find((Programa) => Programa.id_programa === id) || null;
    }

    const updateProgramaMutation = useMutation({
        mutationFn: async({ id, update } : { id: number; update: Partial<programa> }) => {
            await axiosAPI.put<programa>(`${url}/${id}`, update);
            return {id, update}
        },
        onSuccess: ({ id, update }) => {
            console.log("dato 1: ",id," dato 2: ",update);
            queryClient.setQueryData<programa[]>(["programa"], (oldData) => 
                oldData
                    ? oldData.map((Programa) =>
                        Programa.id_programa === id ? { ...Programa, ...update } : Programa
                    )
                    : []
            );
        },

        onError: (error) => {
            console.error("Error al actualizar:", error);
        }
    });

    const changeStateMutation = useMutation({
        mutationFn: async (id_programa: number) => {
            await axiosAPI.put<programa>(`P.formacion/estado/${id_programa}`);
            return id_programa
        },

        onSuccess: (id_programa: number) => {
            queryClient.setQueryData<programa[]>(["programa"], (oldData) => 
                oldData
                    ? oldData.map((programa: programa) =>
                        programa.id_programa == id_programa
                            ? { ...programa, estado: !programa.estado }
                            : programa
                    )
                    : []
            );
        },

        onError: (error) => {
            console.error("Error al actualizar estado:", error);
        },
    });

    const addPrograma = async (ficha: programa) => {
        return addProgramaMutation.mutateAsync(ficha);
    };

    const updatePrograma = async (id: number, update: Partial<programa>) => {
        return updateProgramaMutation.mutateAsync({ id, update });
    };

    const changeState = async (id_ficha: number) => {
        return changeStateMutation.mutateAsync(id_ficha);
    };

    return {
        programas: data,
        isLoading,
        isError,
        error,
        addPrograma,
        changeState,
        getProgramaById,
        updatePrograma
    }
}
