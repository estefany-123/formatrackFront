import { axiosAPI } from "@/axios/axiosAPI";
import { User } from "@/types/Usuario";
import { useMutation, useQueryClient } from "@tanstack/react-query";


export default function UpdateData () {
    
    const queryClient = useQueryClient();
    
    const actualizar = useMutation({
            mutationFn: async({ id, update } : { id: number; update: Partial<User> }) => {
                await axiosAPI.put<User>(`usuarios/${id}`, update);
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
    
    const updateData = async (id: number, update: Partial<User>): Promise<void> => {
      await actualizar.mutateAsync({ id, update });
    };

    return { updateData }
}