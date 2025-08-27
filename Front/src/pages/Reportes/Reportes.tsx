import { useState } from "react";
import { reports } from "@/constants/reportes.config";
import { useReportData } from "@/hooks/Reportes/useReportData";
import Globaltable, { TableColumn } from "@/components/organismos/table.tsx";
import { Card, CardBody } from "@heroui/react";
import { Download } from "lucide-react";

const Reportes = () => {
  const [selectedReportId, setSelectedReportId] = useState(reports[0].id);

  const { data, descargarPDF } = useReportData(selectedReportId);

  // Generamos las columnas, eliminando cualquier "acciones" del backend
  const columns: TableColumn<any>[] = data?.[0]
    ? Object.keys(data[0])
        .filter((key) => key !== "acciones") // eliminamos columna duplicada
        .map((key) => ({ key, label: key }))
    : [];

  // Agregamos nuestra columna de acciones con botón de descarga
  columns.push({
    key: "acciones",
    label: "Acciones",
    render: () => (
      <button
        className="text-blue-500 hover:text-blue-700"
        onClick={() => descargarPDF?.()}
      >
        <Download size={20} />
      </button>
    ),
  });

  return (
    <main className="mx-auto p-4 full">
      <Card className="w-full mb-4">
        <CardBody>
          <h1 className="text-2xl font-bold">Reportes</h1>
        </CardBody>
      </Card>

      <Globaltable
        data={data?.map((row, i) => ({ ...row, key: i.toString() })) || []}
        columns={columns}
      />
    </main>
  );
};

export default Reportes;
