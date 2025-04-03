import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import axios from "axios";

type Propshttp = {
    key: string;
    url: string;
}

function useHttp<T>({ key, url }: Propshttp) {

    const queryClient = useQueryClient();

    const { data, isLoading, isError, error } = useQuery<T[]>({
        queryKey: [key],

        queryFn: async () => {
            const res = await axios.get(url);
            return res.data;
        }
    });

    

    const agregar = useMutation({
        mutationFn: (newElement: T) => axios.post<T>(url, newElement),
        onSuccess: (res) => {
            queryClient.setQueryData<T[]>([key], (oldData) =>
                oldData ? [...oldData, res.data] : [res.data]
            );
        },
        onError: (error) => {
            console.log("Error al cargar el usuario", error);
        }
    });



    const addData = async (element: T): Promise<void> => {
        await agregar.mutateAsync(element);
    };


    return {
        data, isLoading, isError, error, addData 
    };
}

export default useHttp;



































// import { useQuery } from "@tanstack/react-query"
// import axios from "axios"
// import { useState } from "react";

// interface Propshttp {
//     key: string;
//     url: string;
// }

// function http<T>({ key, url }: Propshttp) {

//     const [datos, setDatos] = useState<T[]>([]);


//     const { data, isLoading, isError, error } = useQuery<T>({

//         queryKey: [key],
//         queryFn: async () => {
//             const res = await axios.get(url);
//             return res.data;
//         }
//     });

//     const addData = async (element: T) => {
//         const inicialDatos = [...datos];
//         setDatos([{ id: 0, ...element }, ...datos]);

//         try {
//             const res = await axios.post(url, element);

//             // Actualizar el estado local con los datos reales del backend
//             setDatos([res.data, ...inicialDatos]);
//             return res.data;
//         } catch (error) {
//             // Si hay un error, revertir el estado local
//             setDatos(inicialDatos);
//             throw error;
//         }
//     };


// return {
//     data, isLoading, isError, error, addData, datos
// };

// }

// export default http


