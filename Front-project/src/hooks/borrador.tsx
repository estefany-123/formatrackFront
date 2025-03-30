 // const deleteMutation = useMutation({
    //     mutationFn: (id: number) => axios.delete(`${url}/${id}`),
    //     onSuccess: (_, id) => {
    //         queryClient.setQueryData<T[]>([key], (oldData) =>
    //             oldData ? oldData.filter((item) => item.id !== id) : []
    //         );
    //     },
    //     onError: (error) => {
    //         console.error("Error al eliminar el elemento", error);
    //     }
    // });


    // const deleteData = async (id: number): Promise<void> => {
    //     await deleteMutation.mutateAsync(id);
    // };

    