import { postLogin } from "@/axios/Usuarios/postLogin";
import { useAuth } from "@/providers/AuthProvider";
import { Credenciales } from "@/schemas/User";
import { jwtDecode } from "jwt-decode";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";

const cookies = new Cookies();

export default function useLogin(){

    const [isError,setIsError] = useState<boolean>(false);
    const [error,setError] = useState<string | undefined>(undefined);
    const {setAuthenticated, setNombre} = useAuth();

    const navigate = useNavigate();

    async function login(data : Credenciales){
        try{
           
            const response  = await postLogin(data);
             console.log(response)
            const token = response.access_token;
            cookies.set("token",token);
            //Auth
            const {nombre,apellido} : {nombre : string, apellido : string}= jwtDecode(token);
            setNombre(`${nombre} ${apellido}`);
            setAuthenticated(true);
            //Error handling
            setIsError(false);
            setError(undefined);
            //Redirection
            navigate("/");
        }
        catch(error){
            console.error("No se pudo iniciar sesión",error);
            setIsError(true);
            setError("Error iniciando sesión");
        }
    }

    async function logout(){
        try{
            cookies.remove("token");
            navigate('/login');
        }
        catch(error){
            console.log(error);
        }
    }

    return{login,isError,error,logout};
}

