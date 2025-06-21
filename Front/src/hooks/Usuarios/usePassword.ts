import { postForgotPassword } from "@/axios/Usuarios/postForgotPasswrod";
import { forgotPass } from "@/schemas/User";
import { useState } from "react";

export default function usePassword(){

    const [isError,setIsError] = useState<boolean>(false);
    const [error,setError] = useState<string | undefined>(undefined);

    async function forgotPassword(data : forgotPass){
        try{
            const response = await postForgotPassword(data);
            console.log(response)
            
        }
        catch(error){
            console.error("No se pudo enviar el email",error)
            setIsError(true);
            setError("Error iniciando sesión");
        }
    }

    return {forgotPassword,isError,error}

}