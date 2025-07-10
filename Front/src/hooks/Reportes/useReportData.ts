import React, { useMemo, useState } from "react";
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
    filters.desde || "",
    filters.hasta || ""
  );

  const data = useMemo(() => {
    let baseData: Record<string, any>[] = [];

    switch (reportId) {
      case "sitios-con-mayor-stock":
        baseData = sitiosStock;
        if (filters.sitio) baseData = baseData.filter((d) => d.sitio?.includes(filters.sitio));
        if (filters.area) baseData = baseData.filter((d) => d.area?.includes(filters.area));
        break;

      case "usuarios-con-mas-movimientos":
        baseData = usuariosMovs;
        if (filters.usuario) baseData = baseData.filter((d) => d.usuario?.includes(filters.usuario));
        if (filters.sitio) baseData = baseData.filter((d) => d.sitio?.includes(filters.sitio));
        if (filters.nombre) baseData = baseData.filter((d) => d.elemento?.toLowerCase().includes(filters.nombre.toLowerCase()));
        break;

      case "elementos-por-caducar":
        baseData = elementosCaducar;
        if (filters.nombre) baseData = baseData.filter((d) => d.nombre?.toLowerCase().includes(filters.nombre.toLowerCase()));
        if (filters.sitio) baseData = baseData.filter((d) => d.sitio?.includes(filters.sitio));
        if (filters.area) baseData = baseData.filter((d) => d.area?.includes(filters.area));
        if (filters.desde && filters.hasta) {
          const desde = new Date(filters.desde);
          const hasta = new Date(filters.hasta);
          baseData = baseData.filter((d) => {
            const fecha = new Date(d.vencimiento);
            return fecha >= desde && fecha <= hasta;
          });
        }
        break;

      case "historial-movimientos":
        baseData = historialMovs;
        if (filters.tipoMovimiento) baseData = baseData.filter((d) => d.tipo?.includes(filters.tipoMovimiento));
        if (filters.sitio) baseData = baseData.filter((d) => d.sitio?.includes(filters.sitio));
        if (filters.usuario) baseData = baseData.filter((d) => d.usuario?.includes(filters.usuario));
        if (filters.nombre) baseData = baseData.filter((d) => d.elemento?.toLowerCase().includes(filters.nombre.toLowerCase()));
        break;

      default:
        baseData = [];
    }

    return baseData;
  }, [reportId, filters, sitiosStock, usuariosMovs, elementosCaducar, historialMovs]);

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

  console.log("Filtros aplicados:", filters);
  console.log("DATA RECIBIDA PARA EL REPORTE:", reportId, data);

  return {
    data,
    aplicarFiltros,
    descargarPDF,
  };
};