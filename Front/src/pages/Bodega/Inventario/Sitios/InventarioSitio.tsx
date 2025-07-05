import { Link, useParams } from "react-router-dom";
import { InventariosTable } from "@/pages/Bodega/Inventario/Tablas/Inventarios";
import { useSitios } from "@/hooks/sitios/useSitios";
import Buton from "@/components/molecules/Button";

export const InventarioSitio = () => {
  const { sitioId } = useParams();
  const idSitios = sitioId ? parseInt(sitioId) : 0;

  const { sitios, isLoading, isError } = useSitios();

  if (isLoading) return <p>Cargando sitio...</p>;
  if (isError) return <p>Error al cargar el sitio.</p>;

  const sitio = sitios?.find((s) => s.idSitio === idSitios);

  if (!sitio) return <p>Sitio no encontrado</p>;
  return (
    <div>
      <Link to={`/bodega/inventario/areas/${sitio.fkArea?.idArea}`}>
        <h2 className="text-lg m-4 font-semibold">
          <Buton text="Regresar " className=" hover hover:text-white dark:hover:text-white"/>
        </h2>
      </Link>
      <h1 className="text-2xl font-bold text-center mb-4">
        Inventario del sitio {sitio.nombre}
      </h1>
      <InventariosTable idSitio={idSitios} />
    </div>
  );
};
