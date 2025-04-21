import Tap from "@/components/molecules/Tabs";
import AreaEstadisticas  from "@/pages/Estadisticas/Area";
import FcihasEstadisticas  from "@/pages/Estadisticas/Ficha";
import ProgramaEstadisticas  from "@/pages/Estadisticas/P_formacion";
import SedesEstadisticas  from "@/pages/Estadisticas/sedes";
import SitioEstadisticas  from "@/pages/Estadisticas/sitios";
import PermisosEstadisticas  from "@/pages/Estadisticas/permisos";
import RolModuloEstadisticas  from "@/pages/Estadisticas/Rol_Modulo";

export const Estadisticas =() => {

        const tabs = [
            {
                key : "1",
                title : "Areas",
                content : <AreaEstadisticas/>
            },
            {
                key : "2",
                title : "Fichas",
                content : <FcihasEstadisticas/>
            },
            {
                key : "3",
                title : "Programas",
                content : <ProgramaEstadisticas/>
            },
            {
                key : "4",
                title : "Sedes",
                content : <SedesEstadisticas/>
            },
            {
                key : "5",
                title : "Sitios",
                content : <SitioEstadisticas/>
            },
            {
                key : "6",
                title : "permisos",
                content : <PermisosEstadisticas/>
            },
            {
                key : "7",
                title : "Rol modulo",
                content : <RolModuloEstadisticas/>
            }
        ]
  return (
        
        <Tap tabs={tabs}></Tap>
  )
}

