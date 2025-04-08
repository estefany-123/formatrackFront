import { useState } from "react";
import { useElemento } from "@/hooks/Elementos/useElemento";
import { VisualizadorPDF } from "@/components/organismos/PDFVisualizer";
import { ReportTemplate } from "@/components/templates/Report";
import { ReportCard } from "@/components/molecules/ReportCard";
import { Elemento } from "@/types/Elemento";

export default function ElementoReportSelector() {
  const { elementos } = useElemento();
  const [selectedReport, setSelectedReport] = useState<string | null>(null);

  if (!elementos) return <p>Cargando...</p>;

  const reports = [
    {
      id: "todos",
      title: "Todos los Elementos",
      description: (data: Elemento[]) => {
        const total = data.length;
        const activos = data.filter((e) => e.estado).length;
        return `
Se han registrado un total de ${total} elementos.
De ellos, ${activos} están activos actualmente.

Este reporte brinda una visión general del total de elementos registrados en el sistema.`;
      },
      accessors: ["nombre", "valor", "created_at", "estado"],
      headers: ["Nombre", "Valor", "Fecha de creación", "Estado"],
      withTable: true,
      filterFn: (data: Elemento[]) => data,
    },
    {
      id: "activos",
      title: "Elementos Activos",
      description: (data: Elemento[]) => {
        const activos = data.filter((e) => e.estado);
        const total = activos.length;
        return `
Actualmente hay ${total} elementos con estado activo.

Estos elementos representan los recursos disponibles y operativos dentro del sistema.`;
      },
      accessors: ["nombre", "valor", "created_at", "estado"],
      headers: ["Nombre", "Valor", "Fecha de creación", "Estado"],
      withTable: true,
      filterFn: (data: Elemento[]) => data.filter((e) => e.estado),
    },
    {
      id: "sin_estado",
      title: "Elementos Inactivos",
      description: (data: Elemento[]) => {
        const inactivos = data.filter((e) => !e.estado).length;
        return `
Se han encontrado ${inactivos} elementos con estado inactivo.

Es importante revisar estos registros para determinar si deben ser reactivados o dados de baja definitivamente.`;
      },
      withTable: false,
      filterFn: (data: Elemento[]) => data.filter((e) => !e.estado),
    },
    {
      id: "nuevos",
      title: "Elementos Nuevos del Mes",
      description: (data: Elemento[]) => {
        const now = new Date();
        const delMes = data.filter((e) => {
          const created = new Date(e.created_at);
          return (
            created.getMonth() === now.getMonth() &&
            created.getFullYear() === now.getFullYear()
          );
        }).length;

        return `
Este mes se han registrado ${delMes} nuevos elementos.

El seguimiento de los elementos recientemente añadidos permite evaluar el crecimiento del inventario y la actualización de recursos.`;
      },
      withTable: false,
      filterFn: (data: Elemento[]) => data, // no es necesaria una tabla
    },
  ];

  const selected = reports.find((r) => r.id === selectedReport);
  const handleBack = () => setSelectedReport(null);

  if (selectedReport && selected) {
    const dataFiltrada = selected.filterFn(elementos);

    return (
      <VisualizadorPDF
        onBack={handleBack}
        component={
          <ReportTemplate
            title={selected.title}
            description={selected.description(dataFiltrada)}
            headers={
              selected.withTable && selected.headers ? selected.headers : []
            }
            accessors={
              selected.withTable && selected.accessors ? selected.accessors : []
            }
            data={selected.withTable ? dataFiltrada : []}
          />
        }
      />
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
      {reports.map((r) => (
        <ReportCard
          key={r.id}
          title={r.title}
          description={
            typeof r.description === "function" ? r.description(elementos) : ""
          }
          onClick={() => setSelectedReport(r.id)}
        />
      ))}
    </div>
  );
}
