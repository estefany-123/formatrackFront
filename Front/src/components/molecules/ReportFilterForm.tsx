import React, { useState } from "react";
import Buton from "@/components/molecules/Button";
import { useRol } from "@/hooks/Roles/useRol";
import { useSitios } from "@/hooks/sitios/useSitios";
import { useTipoMovimiento } from "@/hooks/TiposMovimento/useTipoMovimiento";

type Props = {
  filtros: Array<"fecha" | "tipoMovimiento" | "sitio" | "estado" | "rol">;
  onFilter: (filtros: Record<string, string>) => void;
};

export const ReportFilterForm = ({ filtros, onFilter }: Props) => {
  const [filtro, setFiltro] = useState<Record<string, string>>({});

  const { roles: roles = [] } = useRol();
  const { sitios: sitios = [] } = useSitios();
  const { tipos: tipos = [] } = useTipoMovimiento();

  console.log("roles", roles);
  console.log("sitios", sitios);
  console.log("tipos", tipos);
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

      {filtros.includes("rol") && (
        <div className="flex flex-col">
          <label>Rol:</label>
          <select
            value={filtro.rol || ""}
            onChange={(e) => handleChange("rol", e.target.value)}
            className="border rounded px-2 py-1"
          >
            <option value="">Todos</option>
            {roles.map((r: any) => (
              <option key={r.idRol} value={r.idRol}>
                {r.nombre}
              </option>
            ))}
          </select>
        </div>
      )}

      <Buton type="submit" text="Aplicar filtros" color="primary" />
    </form>
  );
};
