import  { createContext, useContext, useEffect, useState } from "react";
import Cookies from "universal-cookie";
import { jwtDecode } from "jwt-decode";
import { getRefetchPermisos } from "@/axios/Usuarios/getRefetchPermisos";

type Auth = {
    authenticated : boolean | undefined,
    setAuthenticated : React.Dispatch<React.SetStateAction<boolean | undefined>>,
    nombre : string | undefined,
    setNombre : React.Dispatch<React.SetStateAction<string | undefined>>
    perfil : string | undefined,
    setPerfil : React.Dispatch<React.SetStateAction<string | undefined>>
    idUsuario : number | undefined,
    setIdUser : React.Dispatch<React.SetStateAction<number | undefined>>,
    permissions : any[],

    setPermissions : React.Dispatch<React.SetStateAction<any[]>>
}

const AuthContext = createContext<Auth | null>(null);

export const useAuth = () => useContext(AuthContext) as Auth;

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [authenticated, setAuthenticated] = useState<boolean | undefined>(
    undefined
  );
  const [nombre, setNombre] = useState<string | undefined>(undefined);
  const [perfil, setPerfil] = useState<string | undefined>(undefined);
  const [idUsuario, setIdUser] = useState<number | undefined>(undefined);
  const [permissions, setPermissions] = useState<any[]>([]);

  const cookies = new Cookies();

  useEffect(() => {
    const token = cookies.get("token");
    const permissions = cookies.get("permissions");
    if (token) {
      const {
        nombre,
        apellido,
        perfil,
        idUsuario,
      }: {
        nombre: string;
        apellido: string;
        perfil: string;
        idUsuario: number;
      } = jwtDecode(token);
      setNombre(`${nombre} ${apellido}`);
      setPerfil(perfil);
      setIdUser(idUsuario);
      setAuthenticated(true);
    }
    if (permissions) {
      setPermissions(permissions);
    }
    const reloadPermisos = async () => {
      const token = cookies.get("token"); 

      if (!token) return; 

      try {
        const data = await getRefetchPermisos();
        setPermissions(data);
      } catch (error) {
      }
    };
    reloadPermisos();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        authenticated,
        setAuthenticated,
        nombre,
        setNombre,
        perfil,
        setPerfil,
        setIdUser,
        idUsuario,
        permissions,
        setPermissions,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
