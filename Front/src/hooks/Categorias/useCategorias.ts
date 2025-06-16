import { Categoria,UpCategoria } from '@/types/Categorias'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getCategorias } from '@/axios/Categorias/getCategorias';
import { postCategorias } from '@/axios/Categorias/postCategorias';
import { UpdCategoria } from '@/axios/Categorias/putCategorias';
import { StateCategoria } from '@/axios/Categorias/putStateCategorias';

export function useCategoria() {

    const queryClient = useQueryClient();

    const { data, isLoading, isError, error } = useQuery<Categoria[]>({
        queryKey: ["categorias"],
        queryFn: getCategorias
    });

    const addCategoriaMutation = useMutation({
        mutationFn: postCategorias,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["categorias"],
            });
        },
        onError: (error) => {
            console.log("Error al cargar la categoria", error);
        }
    });

    const getCategoriaById = (id: number, categorias : Categoria[] | undefined = data ): Categoria | null => {
        return categorias?.find((categoria) => categoria.id_categoria === id) || null;
    }

    const updateCategoriaMutation = useMutation({
        mutationFn: ({id, data}:{id:number, data:UpCategoria}) =>UpdCategoria(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({
              queryKey: ["categorias"],
            });
          },

        onError: (error) => {
            console.error("Error al actualizar:", error);
        }
    });

    const changeStateMutation = useMutation({
        mutationFn: StateCategoria,

        onSuccess: () => {
            queryClient.invalidateQueries({
              queryKey: ["categorias"],
            });
          },

        onError: (error) => {
            console.error("Error al actualizar estado:", error);
        },
    });

    const addCategoria = async (categoria: Categoria) => {
        return addCategoriaMutation.mutateAsync(categoria);
    };

    const updateCategoria = async (id: number, data: UpCategoria) => {
        return updateCategoriaMutation.mutateAsync({ id, data });
    };

    const changeState = async (id_categoria: number) => {
        return changeStateMutation.mutateAsync(id_categoria);
    };

    return {
        categorias: data,
        isLoading,
        isError,
        error,
        addCategoria,
        changeState,
        getCategoriaById,
        updateCategoria
    }
}