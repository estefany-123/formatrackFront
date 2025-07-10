import React, { useState } from "react";
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
  const [filters, setFilters] = useState<Record<string, string>>({});

  const report = reports.find((r) => r.id === reportId);
  if (!report) return { data: [], aplicarFiltros: () => {}, descargarPDF: () => {} };

  const { data: sitiosStock = [] } = useSitiosConMayorStock();
  const { data: usuariosMovs = [] } = useUsuariosMasMovimientos();
  const { data: elementosCaducar = [] } = useElementosPorCaducar();
  const { data: historialMovs = [] } = useHistorialMovimientos(
    filters.fechaInicio || "",
    filters.fechaFin || ""
  );

  let data: Record<string, any>[] = [];

  switch (reportId) {
    case "inventario-sitio":
      data = sitiosStock;
      break;
    case "usuarios-con-mas-movimientos":
      data = usuariosMovs;
      break;
    case "elementos-por-caducar":
      data = elementosCaducar;
      break;
    case "movimientos":
      data = historialMovs;
      break;
    default:
      data = [];
  }

  const aplicarFiltros = (valores: Record<string, string>) => {
    setFilters(valores);
  };

  const descargarPDF = async () => {
    const element = React.createElement(ReportPDF, {
      title: report.title,
      headers: report.headers,
      accessors: report.accessors,
      data,
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
