// define y exporta un componente llamado DashboardEstadisticas, que simplemente muestra un título y un componente de estadísticas (EstadisticasGlobal).

import { EstadisticasGlobal } from "../../components/stats/EstadisticasGlobal"

const DashboardEstadisticas = () => {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Estadísticas Generales</h2>
      <EstadisticasGlobal />
    </div>
  )
}

export default DashboardEstadisticas
