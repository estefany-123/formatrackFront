// src/pages/Reportes/Elementos/ElementoReportSelector.tsx
import { useState } from "react";
import { useElemento } from "@/hooks/Elementos/useElemento";
import { VisualizadorPDF } from "@/components/organismos/PDFVisualizer";
import { ReportTemplate } from "@/components/templates/Report";
import { ReportCard } from "@/components/molecules/ReportCard";

export default function ElementoReportSelector() {
  const { elementos } = useElemento();
  const [selectedReport, setSelectedReport] = useState<string | null>(null);

  if (!elementos) return <p>Cargando...</p>;

  const reports = [
    {
      key: "todos",
      title: "Todos los Elementos",
      description: "Reporte completo de todos los elementos.",
      accessors: ["nombre", "tipo", "descripcion", "estado"],
    },
    {
      key: "activos",
      title: "Elementos Activos",
      description: "Solo los elementos con estado activo.",
      accessors: ["nombre", "tipo", "descripcion", "estado"],
    },
  ];

  const handleBack = () => setSelectedReport(null);

  const selected = reports.find((r) => r.key === selectedReport);

  if (selectedReport && selected) {
    const dataFiltrada =
      selected.key === "activos"
        ? elementos.filter((e) => e.estado)
        : elementos;

    return (
      <VisualizadorPDF
        onBack={handleBack}
        component={
          <ReportTemplate
            title={selected.title}
            description={selected.description}
            headers={["Nombre", "Tipo", "Descripción", "Estado"]}
            accessors={selected.accessors}
            data={dataFiltrada}
          />
        }
      />
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
      {reports.map((r) => (
        <ReportCard
          key={r.key}
          title={r.title}
          description={r.description}
          onClick={() => setSelectedReport(r.key)}
        />
      ))}
    </div>
  );
}
