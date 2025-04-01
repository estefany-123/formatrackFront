
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  getKeyValue,
} from "@heroui/table";


export interface TableColumn<T> {
  key: keyof T;
  label: string;
  render?: (item: T) => JSX.Element;
}

interface TableProps<T extends { key: string; estado: boolean }> {
  data: T[];
  columns: TableColumn<T>[];
  onEdit: (item: T) => void;
  onDelete: (item: T) => void;
}

const Globaltable = <T extends { key: string; estado: boolean }>({ data, columns, onEdit, onDelete }: TableProps<T>) => {
  return (
    <Table aria-label="Example table with dynamic content">
      <TableHeader columns={[...columns, { key: 'actions', label: 'Acciones' }]}>

        {(column) => (
          <TableColumn key={column.key.toString()}>{column.label}</TableColumn>
        )}

      </TableHeader>
      <TableBody items={data}>
  {(item) => (
    <TableRow key={item.key}>
      {(columnKey) => {
        // Encuentra la configuración de la columna
        const column = columns.find((col) => col.key === columnKey);

        return (
          <TableCell>
            {column?.render ? column.render(item) : getKeyValue(item, columnKey)}
            {columnKey === "actions" && (
              <div>
                <button onClick={() => onEdit(item)} color="primary">
                  <PencilIcon className="h-5 w-5 text-blue-500" />
                </button>

                <button onClick={() => onDelete(item)}>
                  <TrashIcon
                    className={`h-5 w-5 ${
                      item.estado ? "text-red-500" : "text-green-500"
                    }`}
                  />
                </button>
              </div>
            )}
          </TableCell>
        );
      }}
    </TableRow>
  )}
</TableBody>
    </Table>
  );
};

export default Globaltable;

