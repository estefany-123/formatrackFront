import { getPerfil } from "@/axios/Usuarios/getPerfil";
import { Perfil } from "@/types/Usuario";
import { useEffect, useState } from "react";


export function usePefil(){

    const [perfil,setPefil] = useState<Perfil | undefined>(undefined);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        async function getProfile(){
            try{
                const perfil = await getPerfil();
                setPefil(perfil);
                console.log(perfil)
                console.log("desde el use",perfil.correo)
                setIsLoading(false)
            }catch(error){
                console.log(error);
                setError(error instanceof Error ? error : new Error("Error desconocido"));
            }

        }
        getProfile();
    },[]);

    return { perfil, isLoading, error}
}