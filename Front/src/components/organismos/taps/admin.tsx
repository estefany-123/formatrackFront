import Tap from "@/components/molecules/Tabs";
import UsersTable from "../../../pages/Admin/usuarios";
import AreaTable from "../../../pages/Admin/areas";
import FcihasTable from "../../../pages/Admin/fichas";
import ProgramasTable from "../../../pages/Admin/programas";
import RolModuloTable from "../../../pages/Admin/rolModulo";
import SedeTable from "../../../pages/Admin/sedes";
import SitiosTable from "../../../pages/Admin/sitios";
import PermisoTable from "../../../pages/Admin/permisos";
import { RolTable } from "../../../pages/Admin/Roles";

const Admin = () => {
        const tabs = [
            {
                key : "1",
                title : "Usuarios",
                content : <UsersTable/>
            },
            {
                key : "2",
                title : "Roles",
                content : <RolTable/>
            },
            {
                key : "3",
                title : "Usuarios Por Ficha",
                content : ""
            },
            {
                key : "4",
                title : "Fichas",
                content :<FcihasTable/>
            },
            {
                key : "5",
                title : "Programas Formacion",
                content :<ProgramasTable/>
            },
            {
                key : "6",
                title : "Areas",
                content :<AreaTable/>
            },
            {
                key : "7",
                title : "Sedes",
                content :<SedeTable/>
            },
            {
                key : "8",
                title : "Centros",
                content :""
            },
            {
                key : "9",
                title : "Municipios",
                content :""
            },
            {
                key : "10",
                title : "Sitios",
                content :<SitiosTable/>
            },
            {
                key : "11",
                title : "Tipos Sitio",
                content :""
            },
            {
                key : "12",
                title : "Permisos",
                content :<PermisoTable/>
            },
            {
                key : "13",
                title : "Rol Modulo",
                content :<RolModuloTable/>
            },
            {
                key : "14",
                title : "Rutas",
                content :""
            },
            {
                key : "15",
                title : "Modulos",
                content :""
            },
        ]
  return <Tap tabs={tabs}></Tap>;
};

export default Admin;
