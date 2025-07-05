import { ReportesPDF } from "@/components/ReportesPDF"; // Asegúrate que este es tu componente de PDF
import { PDFDownloadLink, PDFViewer } from "@react-pdf/renderer";
import { useState } from "react";

export function ReportViewer({ tipo, data }: { tipo: string; data: any[] }) {
  const [infoExtra, setInfoExtra] = useState("");

  return (
    <div className="space-y-4">
      <textarea
        placeholder="Añadir información adicional (observaciones, responsable, etc.)"
        className="w-full border p-2 rounded"
        value={infoExtra}
        onChange={(e) => setInfoExtra(e.target.value)}
      />

      <PDFViewer width="100%" height={600}>
        <ReportesPDF tipo={tipo} data={data}  />
      </PDFViewer>

      <PDFDownloadLink
        document={<ReportesPDF tipo={tipo} data={data}  />}
        fileName={`reporte-${tipo}.pdf`}
        className="inline-block bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        Descargar PDF
      </PDFDownloadLink>
    </div>
  );
}
