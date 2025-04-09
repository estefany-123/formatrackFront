import Tap from "@/components/molecules/Tabs";
import ElementoReportPage from "@/pages/Reportes/Elementos/Elements";
import ElementoReportArea from "@/pages/Reportes/areas/Areas";

export const Reportes =() => {

        const tabs = [
            {
                key : "1",
                title : "Usuarios",
                content : ""
            },
            {
                key : "2",
                title : "Roles",
                content : ""
            },
            {
                key : "3",
                title : "Usuarios Por Ficha",
                content : ""
            },
            {
                key : "4",
                title : "Fichas",
                content :""
            },
            {
                key : "5",
                title : "Programas Formacion",
                content :""
            },
            {
                key : "6",
                title : "Areas",
                content :<ElementoReportArea/>
            },
            {
                key : "7",
                title : "Sedes",
                content :""
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
                content :""
            },
            {
                key : "11",
                title : "Tipos Sitio",
                content :""
            },
            {
                key : "12",
                title : "Inventario",
                content :""
            },
            {
                key : "13",
                title : "Verificaciones",
                content :""
            },
            {
                key : "14",
                title : "Categorias",
                content :""
            },
            {
                key : "15",
                title : "Unidades Medida",
                content :""
            },
            {
                key : "16",
                title : "Caracteristicas",
                content :""
            },
            {
                key : "17",
                title : "Elementos",
                content :<ElementoReportPage/>
            },
            {
                key : "18",
                title : "Solicitudes",
                content :""
            },
            {
                key : "19",
                title : "Movimientos",
                content :""
            },
            {
                key : "20",
                title : "Permisos",
                content :""
            },
            {
                key : "21",
                title : "Rol Modulo",
                content :""
            },
            {
                key : "22",
                title : "Rutas",
                content :""
            },
            {
                key : "23",
                title : "Modulos",
                content :""
            },
            {
                key : "24",
                title : "Tipo de Movimientos",
                content :""
            },
        ]

  return (
        
        <Tap tabs={tabs}></Tap>
  )
}

