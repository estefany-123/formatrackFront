import Tap from "@/components/molecules/Tabs";
import AreaEstadisticas  from "@/pages/Estadisticas/Area";
import FcihasEstadisticas  from "@/pages/Estadisticas/Ficha";
import ProgramaEstadisticas  from "@/pages/Estadisticas/P_formacion";

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
            }
        ]
  return (
        
        <Tap tabs={tabs}></Tap>
  )
}

