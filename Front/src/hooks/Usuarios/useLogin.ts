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
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const {setAuthenticated, setNombre, setPerfil,setIdUser,setPermissions} = useAuth();

    const navigate = useNavigate();

    async function login(data : Credenciales){
        setIsError(false);
        setIsLoading(true);
        try{
            const response  = await postLogin(data);
            console.log("datos que se envian al back",typeof data.documento);
             console.log(response)
             
            const token = response.access_token;
            const permissions = response.modules;
            cookies.set("token",token);
            cookies.set("permissions",permissions);
            //Auth
            const {nombre,apellido,perfil,iduser} : {nombre : string, apellido : string, perfil: string,iduser:number}= jwtDecode(token);
            setNombre(`${nombre} ${apellido}`);
            setAuthenticated(true);
            setPerfil(perfil);
            setIdUser(iduser)
            console.log("iduser desde uselogin",iduser)
            //Error handling
            setIsError(false);
            setError(undefined);
            setPermissions(permissions);
            //Redirection
            navigate("/");
        }
        catch(error:any){
            const errorMessage = error.response.data.response.message;
            setIsError(true);
            setError(errorMessage);
        }
        finally{
            setIsLoading(false);
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

    return{login,isError,error,logout,isLoading};
}

