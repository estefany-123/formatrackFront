import { postForgotPassword } from "@/axios/Usuarios/postForgotPasswrod";
import { postResetPassword } from "@/axios/Usuarios/postResetPassword";
import { forgotPass, resetPass } from "@/schemas/User";
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
            throw error;
        }
    }


    async function resetPassword(token: string, data :resetPass){
        try{
            const response = await postResetPassword(token, data)
            console.log(response)
            
        }
        catch(error){
            console.error("No se pudo restablecer la contraseña",error)
            setIsError(true);
            setError("Error restableciendo la contraseña");
        }
        
    }

    return {forgotPassword,resetPassword,isError,error}

}