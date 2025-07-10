import { ReportSelectorPanel } from "@/components/organismos/ReportSelectorPanel";
import { ReportFilterForm } from "@/components/molecules/ReportFilterForm";
import { ReportTableSection } from "@/components/organismos/ReportTableSection";
import { ReportPreviewPanel } from "@/components/organismos/ReportPreviewPanel";
import { GraficoConCaptura } from "../organismos/GraficaConCaptura";
import { useState } from "react";

type ReportItem = {
  id: string;
  title: string;
  description: string;
  headers: string[];
  accessors: string[];
};

type Props = {
  reports: ReportItem[];
  selectedId: string;
  data: any[];
  onSelectReport: (id: string) => void;
  filtros: Array<
    | "fecha"
    | "tipoMovimiento"
    | "sitio"
    | "estado"
    | "nombre"
    | "usuario"
    | "area"
  >;
  onApplyFilters: (filters: Record<string, string>) => void;
  onDownloadPDF: () => void;
};

export const ReportGenerator = ({
  reports,
  selectedId,
  data,
  onSelectReport,
  filtros,
  onApplyFilters,
  onDownloadPDF,
}: Props) => {
  const report = reports.find((r) => r.id === selectedId);
  const [imagenBase64, setImagenBase64] = useState<string | null>(null);

  if (!report) return <p>Reporte no encontrado.</p>;

  return (
    <div className="p-6 space-y-6">
      <ReportSelectorPanel
        reports={reports}
        selectedId={selectedId}
        onChange={onSelectReport}
      />

      <ReportFilterForm filtros={filtros} onFilter={onApplyFilters} />

      <ReportTableSection
        headers={report.headers}
        accessors={report.accessors}
        data={data}
        onDownload={onDownloadPDF}
      />

      <ReportPreviewPanel
        title={report.title}
        headers={report.headers}
        accessors={report.accessors}
        data={data}
      />

      <GraficoConCaptura
        data={data}
        labels={data.map(
          (d) => d.usuario || d.elemento || d.sitio || d.nombre || "Desconocido"
        )}
        accessor={
          report.id === "usuarios-con-mas-movimientos"
            ? "total_movimientos"
            : report.id === "movimientos"
              ? "cantidad"
              : report.id === "sitios-con-mayor-stock"
                ? "cantidad"
                : report.id === "elementos-por-caducar"
                  ? "dias_restantes"
                  : "cantidad"
        }
        title={report.title}
        onBase64Ready={setImagenBase64}
      />
    </div>
  );
};
