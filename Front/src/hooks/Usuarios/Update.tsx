import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

type UpdateProps<T> = {
  url: string;
  idKey: keyof T; // Define la clave primaria de la tabla
};

function UpdateData<T>({ url, idKey }: UpdateProps<T>) {
  const queryClient = useQueryClient();

  const actualizar = useMutation({
    mutationFn: ({ id, update }: { id: T[typeof idKey]; update: Partial<T> }) =>
      axios.put<T>(`${url}/${id}`, update),

    onSuccess: (res, { id }) => {
      queryClient.setQueryData<T[]>([url], (oldData) =>
        oldData
          ? oldData.map((item) =>
              item[idKey] === id ? { ...item, ...res.data } : item
            )
          : []
      );
    },

    onError: (error) => {
      console.error("Error al actualizar:", error);
    }
  });

  const updateData = async (id: T[typeof idKey], update: Partial<T>): Promise<void> => {
    await actualizar.mutateAsync({ id, update });
  };

  return { updateData };
}

export default UpdateData;
