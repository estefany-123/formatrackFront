import { useMutation, useQueryClient } from "@tanstack/react-query";
import { User } from "@/types/Usuario"
import { axiosAPI } from "@/axios/axiosAPI";

export function useCambioEstado() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (id_usuario: number) => {
      await axiosAPI.put<User>(`usuarios/estado/${id_usuario}`);
      return id_usuario 
    },

    onSuccess: ( id_usuario : number ) => {

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

  return {
    cambiarEstado: mutation.mutateAsync,
    isLoading: mutation.isPending,
  };
}
