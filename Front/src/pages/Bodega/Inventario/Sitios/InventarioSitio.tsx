import { useParams } from "react-router-dom";
import { InventariosTable } from "@/pages/Bodega/Inventario/Tablas/Inventarios";
import { useSitios } from "@/hooks/sitios/useSitios";


export const InventarioSitio = () => {
    const { sitioId } = useParams();
    const idSitio = sitioId ? parseInt(sitioId) : 0;
  
    const { sitios, isLoading, isError } = useSitios();
  
    if (isLoading) return <p>Cargando sitio...</p>;
    if (isError) return <p>Error al cargar el sitio.</p>;
  
    const sitio = sitios?.find((s) => s.id_sitio === idSitio);
  
    if (!sitio) return <p>Sitio no encontrado</p>;
  return (
    <div>
      <h1 className="text-2xl font-bold text-center mb-4">
        Inventario del sitio {sitio.nombre}
      </h1>
      <InventariosTable idSitio={idSitio} />
    </div>
  );
};
