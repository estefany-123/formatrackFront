import React, { useState } from "react";
import Buton from "@/components/molecules/Button";
import { useSitios } from "@/hooks/sitios/useSitios";
import { useTipoMovimiento } from "@/hooks/TiposMovimento/useTipoMovimiento";
import { useUsuario } from "@/hooks/Usuarios/useUsuario"; // Asumiendo que tienes este hook
import { useAreas } from "@/hooks/areas/useAreas"; // Asumiendo que tienes este hook

type Props = {
  filtros: Array<"fecha" | "tipoMovimiento" | "sitio" | "estado" | "nombre" | "usuario" | "area">;
  onFilter: (filtros: Record<string, string>) => void;
};

export const ReportFilterForm = ({ filtros, onFilter }: Props) => {
  const [filtro, setFiltro] = useState<Record<string, string>>({});

  const { sitios = [] } = useSitios();
  const { tipos = [] } = useTipoMovimiento();
  const { users = [] } = useUsuario();
  const { areas = [] } = useAreas();

  const handleChange = (key: string, value: string) => {
    setFiltro((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFilter(filtro);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-wrap gap-4 items-end mb-4"
    >
      {filtros.includes("fecha") && (
        <>
          <div className="flex flex-col">
            <label>Desde:</label>
            <input
              type="date"
              value={filtro.desde || ""}
              onChange={(e) => handleChange("desde", e.target.value)}
              className="border rounded px-2 py-1"
            />
          </div>
          <div className="flex flex-col">
            <label>Hasta:</label>
            <input
              type="date"
              value={filtro.hasta || ""}
              onChange={(e) => handleChange("hasta", e.target.value)}
              className="border rounded px-2 py-1"
            />
          </div>
        </>
      )}

      {filtros.includes("tipoMovimiento") && (
        <div className="flex flex-col">
          <label>Tipo de movimiento:</label>
          <select
            value={filtro.tipoMovimiento || ""}
            onChange={(e) => handleChange("tipoMovimiento", e.target.value)}
            className="border rounded px-2 py-1"
          >
            <option value="">Todos</option>
            {tipos.map((tm: any) => (
              <option key={tm.idTipo} value={tm.nombre}>
                {tm.nombre}
              </option>
            ))}
          </select>
        </div>
      )}

      {filtros.includes("estado") && (
        <div className="flex flex-col">
          <label>Estado:</label>
          <select
            value={filtro.estado || ""}
            onChange={(e) => handleChange("estado", e.target.value)}
            className="border rounded px-2 py-1"
          >
            <option value="">Todos</option>
            <option value="pendiente">Pendiente</option>
            <option value="aceptado">Aceptado</option>
            <option value="cancelado">Cancelado</option>
          </select>
        </div>
      )}

      {filtros.includes("sitio") && (
        <div className="flex flex-col">
          <label>Sitio:</label>
          <select
            value={filtro.sitio || ""}
            onChange={(e) => handleChange("sitio", e.target.value)}
            className="border rounded px-2 py-1"
          >
            <option value="">Todos</option>
            {sitios.map((s: any) => (
              <option key={s.idSitio} value={s.idSitio}>
                {s.nombre}
              </option>
            ))}
          </select>
        </div>
      )}

      {filtros.includes("usuario") && (
        <div className="flex flex-col">
          <label>Usuario:</label>
          <select
            value={filtro.usuario || ""}
            onChange={(e) => handleChange("usuario", e.target.value)}
            className="border rounded px-2 py-1"
          >
            <option value="">Todos</option>
            {users.map((u: any) => (
              <option key={u.idUsuario} value={u.idUsuario}>
                {u.nombre}
              </option>
            ))}
          </select>
        </div>
      )}

      {filtros.includes("area") && (
        <div className="flex flex-col">
          <label>Área:</label>
          <select
            value={filtro.area || ""}
            onChange={(e) => handleChange("area", e.target.value)}
            className="border rounded px-2 py-1"
          >
            <option value="">Todas</option>
            {areas.map((a: any) => (
              <option key={a.idArea} value={a.idArea}>
                {a.nombre}
              </option>
            ))}
          </select>
        </div>
      )}

      {filtros.includes("nombre") && (
        <div className="flex flex-col">
          <label>Nombre del elemento:</label>
          <input
            type="text"
            value={filtro.nombre || ""}
            onChange={(e) => handleChange("nombre", e.target.value)}
            className="border rounded px-2 py-1"
            placeholder="Buscar por nombre"
          />
        </div>
      )}

      <Buton type="submit" text="Aplicar filtros" color="primary" />
    </form>
  );
};
