import { getUsuarios } from '@/axios/Usuarios/getUsuarios';
import { getByIdUsuario } from '@/axios/Usuarios/getByIdUsuario'; //ver como es
import { postUsuarios } from '@/axios/Usuarios/postUsuario';
import {StateUsuario} from '@/axios/Usuarios/putStateUsuario';
import { updateUsuario } from '@/axios/Usuarios/putUsuario';
import { User,putUser } from '@/types/Usuario'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { LoginCrede, LoginRes } from '@/types/Usuario';
import Cookies from "js-cookie";
import { axiosAPI } from '@/axios/axiosAPI';

export function useUsuario() {

    const queryClient = useQueryClient();


    const { data, isLoading, isError, error } = useQuery<User[]>({
        queryKey: ["users"],
        queryFn:getUsuarios,
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 10,
        refetchOnWindowFocus: false,
      });


    const addUserMutation = useMutation({
        mutationFn: postUsuarios,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["users"],
            });
        },
  
        onError: (error) => {
          console.log("Error al cargar el usuario", error);
        },
      });

    const loginMutation = useMutation({
        mutationFn : async (credenciales : LoginCrede ) : Promise<LoginRes> => {
            const response = await axiosAPI.post<LoginRes>(`usuarios/login`,credenciales)
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
       mutationFn:({id, data}:{id:number, data:putUser}) =>updateUsuario(id, data),
       onSuccess: () => {
         queryClient.invalidateQueries({
           queryKey: ["users"],
         });
       },
   
       onError: (error) => {
         console.error("Error al actualizar:", error);
       },
     });

    const changeStateMutation = useMutation({
        mutationFn:StateUsuario,
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: ["users"],
          });
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

    const updateUser = async (id: number, data: putUser) => {
        return updateUserMutation.mutateAsync({ id, data });
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