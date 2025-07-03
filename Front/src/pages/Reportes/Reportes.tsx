import { useState } from "react";
import { useSitiosConMayorStock, useUsuariosMasMovimientos, useElementosPorCaducar, useHistorialMovimientos } from "@/hooks/Reportes/useReportes";
import { ReportSelector } from "@/components/ReportSelector";
import { ReportViewer } from "@/components/ReportViewer";
import dayjs from "dayjs";

export default function ReportesPage() {
  const [reporteSeleccionado, setReporteSeleccionado] = useState<string | null>(null);
  const [fechaInicio] = useState(() => dayjs().startOf('month').format("YYYY-MM-DD"));
  const [fechaFin] = useState(() => dayjs().endOf('month').format("YYYY-MM-DD"));

  const { data: sitiosData } = useSitiosConMayorStock();
  const { data: usuariosData } = useUsuariosMasMovimientos();
  const { data: caducarData } = useElementosPorCaducar();
  const { data: historialData } = useHistorialMovimientos(fechaInicio, fechaFin);

  const obtenerDatos = () => {
    switch (reporteSeleccionado) {
      case "sitios":
        return sitiosData ?? [];
      case "usuarios":
        return usuariosData ?? [];
      case "caducar":
        return caducarData ?? [];
      case "historial":
        return historialData ?? [];
      default:
        return [];
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
      <div>
        <h2 className="text-xl font-bold mb-4">Selecciona un reporte</h2>
        <ReportSelector onSelect={setReporteSeleccionado} />
      </div>
      <div>
        {reporteSeleccionado ? (
          <ReportViewer
            tipo={reporteSeleccionado}
            data={obtenerDatos()}
          />
        ) : (
          <p className="text-gray-500">Selecciona un reporte para visualizarlo.</p>
        )}
      </div>
    </div>
  );
}
