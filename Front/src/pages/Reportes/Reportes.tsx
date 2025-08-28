import { useState } from "react";
import { reports } from "@/constants/reportes.config";
import { useReportData } from "@/hooks/Reportes/useReportData";
import Globaltable, { TableColumn } from "@/components/organismos/table.tsx";
import { Card, CardBody, Select, SelectItem } from "@heroui/react";
import { Download } from "lucide-react";

const Reportes = () => {
  const [selectedReportId, setSelectedReportId] = useState<string>(
    reports[0].id
  );

  const { data, descargarPDF } = useReportData(selectedReportId);

  // Eliminamos la desestructuración 'acciones' porque no existe en tus tipos
  const cleanedData = data || [];

  const columns: TableColumn<any>[] = cleanedData?.[0]
    ? Object.keys(cleanedData[0]).map((key) => ({ key, label: key }))
    : [];

  // ✅ Columna personalizada para descargar PDF
  columns.push({
    key: "descargar",
    label: "Descargar PDF",
    render: () => (
      <button
        className="text-blue-500 hover:text-blue-700"
        onClick={() => descargarPDF?.()} // Si tu hook no necesita datos por fila, deja descargarPDF?.()
      >
        <Download size={20} />
      </button>
    ),
  });

  return (
    <main className="mx-auto p-4 full">
      <Card className="w-full mb-4">
        <CardBody>
          <h1 className="text-2xl font-bold text-center">Reportes</h1>
        </CardBody>
      </Card>

      <Globaltable
        data={cleanedData.map((row, i) => ({ ...row, key: i.toString() }))}
        columns={columns}
        showActions={false}
        extraHeaderContent={
          <div className="flex items-center gap-2">
            <Select
              size="md"
              variant="flat"
              color="primary"
              radius="md"
              classNames={{
                trigger:
                  "dark:bg-zinc-900 text-black dark:text-white w-max min-w-[350px] whitespace-normal",
                listboxWrapper: "w-max min-w-[350px] overflow-visible",
                listbox: "whitespace-normal break-words w-max",
              }}
              selectedKeys={[selectedReportId]}
              onSelectionChange={(keys) => {
                const key = Array.from(keys)[0]?.toString() || "";
                setSelectedReportId(key);
              }}
            >
              {reports.map((report) => (
                <SelectItem
                  key={report.id}
                  textValue={report.title}
                  className="whitespace-normal break-words w-max"
                >
                  {report.title}
                </SelectItem>
              ))}
            </Select>
          </div>
        }
      />
    </main>
  );
};

export default Reportes;
