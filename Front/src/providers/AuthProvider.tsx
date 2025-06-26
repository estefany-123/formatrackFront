import React, { createContext, useContext, useEffect, useState } from "react";
import Cookies from "universal-cookie";
import { jwtDecode } from 'jwt-decode'

type Auth = {
    authenticated : boolean | undefined,
    setAuthenticated : React.Dispatch<React.SetStateAction<boolean | undefined>>,
    nombre : string | undefined,
    setNombre : React.Dispatch<React.SetStateAction<string | undefined>>
    perfil : string | undefined,
    setPerfil : React.Dispatch<React.SetStateAction<string | undefined>>
    idUsuario : number | undefined,
    setIdUser : React.Dispatch<React.SetStateAction<number | undefined>>
}

const AuthContext = createContext<Auth | null>(null);

export const useAuth = () => useContext(AuthContext) as Auth;

export default function AuthProvider({children}:{children : React.ReactNode}) {
    
    const [authenticated, setAuthenticated] = useState<boolean | undefined>(undefined)
    const [nombre,setNombre] = useState<string | undefined>(undefined);
    const [perfil,setPerfil] = useState<string | undefined>(undefined);
    const [idUsuario,setIdUser] = useState<number | undefined>(undefined);
    
    const cookies = new Cookies();
    
    useEffect(()=>{
        const token = cookies.get("token");
        if(token){
            const {nombre,apellido,perfil,idUsuario} : {nombre : string,apellido : string,perfil:string,idUsuario:number}= jwtDecode(token);
            setNombre(`${nombre} ${apellido}`);
            setPerfil(perfil);
            setIdUser(idUsuario);
            setAuthenticated(true);
            console.log("Esto es idusuario",idUsuario)
        }    
    },[])
    
    return(
        <AuthContext.Provider value={{authenticated,setAuthenticated,nombre,setNombre,perfil,setPerfil,setIdUser,idUsuario}}>
            {children}
        </AuthContext.Provider>
    )
}