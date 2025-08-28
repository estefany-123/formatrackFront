import { useMemo, useState } from "react";
import { pdf } from "@react-pdf/renderer";
import { saveAs } from "file-saver";

import ReportPDF from "@/pdf/ReportPDF";
import { reports } from "@/constants/reportes.config";

import {
  useSitiosConMayorStock,
  useUsuariosMasMovimientos,
  useElementosPorCaducar,
  useHistorialMovimientos,
} from "@/hooks/Reportes/useReportes";

export const useReportData = (reportId: string) => {
  const [filters,] = useState<Record<string, string>>({});

  const report = reports.find((r) => r.id === reportId);
  if (!report) return { data: [], aplicarFiltros: () => {}, descargarPDF: () => {} };

  const { data: sitiosStock = [] } = useSitiosConMayorStock();
  const { data: usuariosMovs = [] } = useUsuariosMasMovimientos();
  const { data: elementosCaducar = [] } = useElementosPorCaducar();
  const { data: historialMovs = [] } = useHistorialMovimientos(
    filters.desde || "",
    filters.hasta || ""
  );

  const data = useMemo(() => {
    switch (reportId) {
      case "sitios-con-mayor-stock":
        return sitiosStock;
      case "usuarios-con-mas-movimientos":
        return usuariosMovs;
      case "elementos-por-caducar":
        return elementosCaducar;
      case "historial-movimientos":
        return historialMovs;
      default:
        return [];
    }
  }, [reportId, sitiosStock, usuariosMovs, elementosCaducar, historialMovs]);

  const aplicarFiltros = (_valores: Record<string, string>) => {
    // Dejamos los filtros vacíos para que siempre muestre todo
  };

  const descargarPDF = async () => {
    const fechaGeneracion = new Date().toLocaleString("es-ES");

    const descripcion = `Este reporte contiene información detallada de ${report.title}. 
Permite un análisis profundo de los datos relevantes para la toma de decisiones estratégicas y operativas.`;

    const beneficio = `Beneficio: Este reporte facilita la planificación, control y supervisión de los procesos, 
proporcionando información clara y resumida para la toma de decisiones gerenciales.`;

    const infoExtra = `Información adicional: Los datos se han consolidado y verificado para asegurar su integridad. 
Se incluyen indicadores clave y métricas relevantes que permiten evaluar el desempeño de las áreas involucradas.`;

    const observacion = `Observación: Los registros se presentan tal cual fueron ingresados en el sistema. 
Se recomienda revisar periódicamente los datos y actualizar la información cuando sea necesario.`;

    const element = ReportPDF({
      title: report.title,
      headers: report.headers,
      accessors: report.accessors,
      data,
      descripcion,
      beneficio,
      infoExtra,
      observacion,
      usuario: "Usuario Generador: Admin",
      fechaGeneracion,
      logoIzq: "/sena-logo.png",
      logoDer: "/icono.png",
    });

    const blob = await pdf(element).toBlob();
    saveAs(blob, `${report.title}.pdf`);
  };

  return {
    data,
    aplicarFiltros,
    descargarPDF,
  };
};
