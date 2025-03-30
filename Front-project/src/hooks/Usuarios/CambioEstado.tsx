import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import {User} from "@/pages/usuarios"

export function useCambioEstado() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (id_usuario: number) => {
      return axios.put(`http://localhost:3000/usuarios/estado/${id_usuario}`);
    },

    onSuccess: (_, id_usuario) => {
      queryClient.setQueryData<User []>(["users"], (oldData) =>
        oldData
          ? oldData.map((user: User) =>
              user.id_usuario === id_usuario
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
    isLoadin: mutation.isPending,
  };
}
