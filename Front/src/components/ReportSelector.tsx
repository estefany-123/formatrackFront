const reportes = [
  { id: "sitios", label: "Sitios con mayor stock" },
  { id: "usuarios", label: "Usuarios con más movimientos" },
  { id: "caducar", label: "Elementos por caducar" },
  { id: "historial", label: "Historial de movimientos" },
];

export function ReportSelector({ onSelect }: { onSelect: (id: string) => void }) {
  return (
    <div className="space-y-2">
      {reportes.map((r) => (
        <button
          key={r.id}
          onClick={() => onSelect(r.id)}
          className="bg-blue-600 text-white px-4 py-2 rounded w-full"
        >
          {r.label}
        </button>
      ))}
    </div>
  );
}
