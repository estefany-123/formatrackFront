import Tap from "@/components/molecules/Tabs";
import UsersTable from './usuarios';
import AreaTable from './areas';
import FcihasTable from './fichas';
import ProgramasTable from './programas';
import RolModuloTable from './rolModulo';
import SedeTable from './sedes';
import SitiosTable from './sitios';
import PermisoTable from './permisos';
import Home from '../Home/Home';
import TipoSitioTable from './tipoSitio'
import CentrosTable from './centros'
import ModulosTable from './modulo'
import RutasTable from "./rutas";
import MunicipiosTable from "./municipio";
import CategoriasTable from "./categorias";
const Admin =() => {

        const tabs = [
            {
                key : "1",
                title : "Usuarios",
                content : <UsersTable/>
            },
            {
                key : "2",
                title : "Centros",
                content : <CentrosTable/>
            },
            {
                key : "3",
<<<<<<< HEAD
                title : "Tipos de Sitios",
                content : <TipoSitioTable/>
            },
            {
                key : "4",
                title : "Modulos",
                content : <ModulosTable/>
            },
            {
                key : "5",
                title : "Rutas",
                content : <RutasTable/>
            },
            {
                key : "6",
                title : "Municipios",
                content : <MunicipiosTable/>
            },
            {
                key : "7",
                title : "Categorias",
                content : <CategoriasTable/>
            },
            
=======
                title : "Areas",
                content : <AreaTable/>
            },
            {
                key : "4",
                title : "#",
                content : <Home/>
            },
            {
                key : "5",
                title : "Fichas",
                content : <FcihasTable/>
            },
            {
                key : "6",
                title : "Programas de formación",
                content : <ProgramasTable/>
            },
            {
                key : "7",
                title : "permisos",
                content : <Home/>
            },
            {
                key : "8",
                title : "Rol Modulo",
                content : <RolModuloTable/>
            },
            {
                key : "9",
                title : "sedes",
                content : <SedeTable/>
            },
            {
                key : "10",
                title : "sitios",
                content : <SitiosTable/>
            },
            {
                key : "11",
                title : "permisos",
                content : <PermisoTable/>
            }
>>>>>>> origin/luis
        ]

  return (
        
        <Tap tabs={tabs}></Tap>
  )
}

export default Admin