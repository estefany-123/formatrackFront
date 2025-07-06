import { ReportesPDF } from "@/components/ReportesPDF"; // Asegúrate que este es tu componente de PDF
import { PDFDownloadLink, PDFViewer } from "@react-pdf/renderer";

export function ReportViewer({ tipo, data }: { tipo: string; data: any[] }) {

  return (
    <div className="space-y-4">
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
