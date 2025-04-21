import Tap from "@/components/molecules/Tabs";
import { ElementosTable } from "@/pages/Bodega/Elementos";
import { Inventario } from "@/pages/Bodega/Inventarios";
import { MovimientoTable } from "@/pages/Bodega/Movimientos";
import { TipoMovimientoTable } from "@/pages/Bodega/TiposMovimiento";
import CategoriasTable from "@/pages/Admin/categorias";
import { UnidadTable } from "@/pages/Bodega/UnidadesMedida";

export const Bodega =() => {

        const tabs = [
            {
                key : "1",
                title : "Elementos",
                content : <ElementosTable/>
            },
            {
                key : "2",
                title : "Tipos Movimiento",
                content : <TipoMovimientoTable/>
            },
            {
                key : "3",
                title : "Inventarios",
                content : <Inventario/>
            },
            {
                key : "4",
                title : "Movimientos",
                content :<MovimientoTable/>
            },
            {
                key : "5",
                title : "Unidades Medida",
                content :<UnidadTable/>
            },
            {
                key : "6",
                title : "Categorias",
                content :<CategoriasTable/>
            },
            {
                key : "7",
                title : "Caracteristicas",
                content :""
            }
        ]

  return (
        
        <Tap tabs={tabs}></Tap>
  )
}

