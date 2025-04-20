import { axiosAPI } from "@/axios/axiosAPI";
import { Credenciales } from "@/schemas/User";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";

const cookies = new Cookies();

export default function useLogin(){

    const [isError,setIsError] = useState<boolean>(false);
    const [error,setError] = useState<string | undefined>(undefined);

    const navigate = useNavigate();

    async function login(data : Credenciales){
        try{
            const response : {data : {token : string}} = await axiosAPI.post('/usuarios/login',data);
            cookies.set("token",response.data.token);
            setIsError(false);
            setError(undefined);
            navigate("/");
        }
        catch(error){
            console.error("No se pudo iniciar sesión",error);
            setIsError(true);
            setError("Error iniciando sesión");
        }
    }

    return{login,isError,error};
}

