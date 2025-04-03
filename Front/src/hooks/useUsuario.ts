import { axiosAPI } from '@/axios/axiosAPI';
import { User } from '@/types/Usuario'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export function useUsuario() {

    const queryClient = useQueryClient();

    const url = 'usuarios';

    const { data, isLoading, isError, error } = useQuery<User[]>({
        queryKey: ["users"],
        queryFn: async () => {
            const res = await axiosAPI.get(url);
            return res.data;
        }
    });

    const addUser = async (usuario: User) => useMutation({
        mutationFn: (newUser: User) => axiosAPI.post<User>(url, newUser),
        onSuccess: (res) => {
            queryClient.setQueryData<User[]>(["users"], (oldData) =>
                oldData ? [...oldData, res.data] : [res.data]
            );
        },
        onError: (error) => {
            console.log("Error al cargar el usuario", error);
        }
    }).mutateAsync(usuario);

    const updateUser = async (id : number, update : Partial<User>) => useMutation({
        mutationFn: async({ id, update } : { id: number; update: Partial<User> }) => {
            await axiosAPI.put<User>(`${url}/${id}`, update);
            return {id, update}
        },
        onSuccess: ({ id, update }) => {
            console.log("dato 1: ",id," dato 2: ",update);
            queryClient.setQueryData<User[]>(["users"], (oldData) =>
                oldData
                    ? oldData.map((user) =>
                        user.id_usuario === id ? { ...user, ...update } : user
                    )
                    : []
            );
        },

        onError: (error) => {
            console.error("Error al actualizar:", error);
        }
    }).mutateAsync({ id, update });

    const changeState = async (id_usuario: number) => useMutation({
        mutationFn: async (id_usuario: number) => {
            await axiosAPI.put<User>(`usuarios/estado/${id_usuario}`);
            return id_usuario
        },

        onSuccess: (id_usuario: number) => {
            queryClient.setQueryData<User[]>(["users"], (oldData) =>
                oldData
                    ? oldData.map((user: User) =>
                        user.id_usuario == id_usuario
                            ? { ...user, estado: !user.estado }
                            : user
                    )
                    : []
            );
        },

        onError: (error) => {
            console.error("Error al actualizar estado:", error);
        },
    }).mutateAsync(id_usuario);

    return {
        users: data,
        isLoading,
        isError,
        error,
        addUser,
        changeState,
        updateUser
    }
}