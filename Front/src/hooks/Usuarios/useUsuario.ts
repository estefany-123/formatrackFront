import { axiosAPI } from '@/axios/axiosAPI';
import { User } from '@/schemas/User'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { LoginCrede, LoginRes } from '@/types/Usuario';
import Cookies from "js-cookie";

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


    const addUserMutation = useMutation({
        mutationFn: async(newUser: User) => {
            await axiosAPI.post<User>(url, newUser)
            return newUser
        },
        onSuccess: (user) => {
            console.log("Esta es la mutación:",user);
            const oldData = queryClient.getQueryData(["users"]);
            console.log("Datos anteriores:",oldData);
            queryClient.setQueryData<User[]>(["users"], (oldData) =>
                oldData ? [...oldData,user] : [user]
            );
            const newData = queryClient.getQueryData(["users"]);
            console.log("Datos nuevos:",newData);
        },
        onError: (error) => {
            console.log("Error al cargar el usuario", error);
        }
    });

    const loginMutation = useMutation({
        mutationFn : async (credenciales : LoginCrede ) : Promise<LoginRes> => {
            const response = await axiosAPI.post<LoginRes>(`${url}/login`,credenciales)
            console.log("Esto es data :",response.data)
            return response.data
        },
        onSuccess : (data) => {
            Cookies.set("jwt",data.token,{expires :1})
        },
        onError : (error) => {
            console.log("Error iniciando sesion:",error)
        }
    });



    const getUserById = (id: number, usersList: User[]): User | null => {
        return usersList.find((user) => user.id_usuario === id) || null;
    };

    const updateUserMutation = useMutation({
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
    });

    const changeStateMutation = useMutation({
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
    });

    const addUser = async (usuario: User) => {
        return addUserMutation.mutateAsync(usuario);
    };

    const login = async (documento : number, password : string) => {
        return loginMutation.mutateAsync({documento,password})
    }

    const updateUser = async (id: number, update: Partial<User>) => {
        return updateUserMutation.mutateAsync({ id, update });
    };

    const changeState = async (id_usuario: number) => {
        return changeStateMutation.mutateAsync(id_usuario);
    };

    return {
        users: data,
        isLoading,
        isError,
        error,
        addUser,
        login,
        changeState,
        getUserById,
        updateUser
    }
}