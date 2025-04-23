import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { Form } from "@heroui/form";
import { Input } from "@heroui/input";
import { Select, SelectItem } from "@heroui/react";
import { Combobox } from "@headlessui/react";
import { useState } from "react";

import { sitio, sitioSchema } from "@/schemas/sitios";
import { useAreas } from "@/hooks/areas/useAreas";
import { useTipoSitio } from "@/hooks/TipoSitio/useTipoSitio";

type FormularioProps = {
  addData: (data: sitio) => Promise<void>;
  onClose: () => void;
  id: string;
};

export default function FormularioSitio({ addData, onClose, id }: FormularioProps) {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<sitio>({
    resolver: zodResolver(sitioSchema),
    mode: "onChange",
  });

  const { areas } = useAreas();
  const { tipos } = useTipoSitio();
  const [queryArea, setQueryArea] = useState("");
  const [queryTipo, setQueryTipo] = useState("");
  const [openArea, setOpenArea] = useState(false);
  const [openTipo, setOpenTipo] = useState(false);

  const filteredAreas =
    queryArea === ""
      ? areas
      : areas?.filter((a) => a.nombre.toLowerCase().includes(queryArea.toLowerCase()));

  const filteredTipos =
    queryTipo === ""
      ? tipos
      : tipos?.filter((t) => t.nombre.toLowerCase().includes(queryTipo.toLowerCase()));

  const onSubmit = async (data: sitio) => {
    try {
      await addData(data);
      onClose();
    } catch (error) {
      console.error("Error al guardar sitio:", error);
    }
  };

  return (
    <Form id={id} onSubmit={handleSubmit(onSubmit)} className="w-full space-y-4">
      <Input
        label="Nombre del sitio"
        type="text"
        placeholder="Nombre"
        {...register("nombre")}
        isInvalid={!!errors.nombre}
        errorMessage={errors.nombre?.message}
      />

      <Input
        label="Persona encargada"
        type="text"
        placeholder="Encargado"
        {...register("persona_encargada")}
        isInvalid={!!errors.persona_encargada}
        errorMessage={errors.persona_encargada?.message}
      />

      <Input
        label="Ubicación"
        type="text"
        placeholder="Ubicación"
        {...register("ubicacion")}
        isInvalid={!!errors.ubicacion}
        errorMessage={errors.ubicacion?.message}
      />

      <Controller
        control={control}
        name="estado"
        render={({ field }) => (
          <Select
            label="Estado"
            placeholder="Seleccione un estado"
            {...field}
            value={field.value ? "true" : "false"}
            onChange={(e) => field.onChange(e.target.value === "true")}
          >
            <SelectItem key="true">Activo</SelectItem>
            <SelectItem key="false">Inactivo</SelectItem>
          </Select>
        )}
      />
      {errors.estado && <p className="text-red-500">{errors.estado.message}</p>}

      <Controller
        control={control}
        name="fk_area"
        render={({ field }) => (
          <div className="w-full">
            <label className="text-sm font-medium text-gray-700 mb-1 block">Área</label>
            <Combobox
              value={field.value}
              onChange={(val) => {
                field.onChange(val);
                setOpenArea(false);
              }}
            >
              <div className="relative">
                <Combobox.Input
                  className="w-full border rounded-md p-2"
                  displayValue={(id: number) =>
                    areas?.find((a) => a.id_area === id)?.nombre || ""
                  }
                  onClick={() => setOpenArea(true)}
                  onChange={(e) => {
                    setQueryArea(e.target.value);
                    setOpenArea(true);
                  }}
                  placeholder="Selecciona un área..."
                />
                {openArea && (
                  <Combobox.Options className="absolute z-10 mt-1 w-full max-h-60 overflow-auto rounded-md bg-white border shadow">
                    {filteredAreas?.length === 0 && (
                      <div className="p-2 text-sm text-gray-500">No se encontraron áreas.</div>
                    )}
                    {filteredAreas?.map((area) => (
                      <Combobox.Option
                        key={area.id_area}
                        value={area.id_area}
                        className="cursor-pointer p-2 hover:bg-blue-100"
                      >
                        {area.nombre}
                      </Combobox.Option>
                    ))}
                  </Combobox.Options>
                )}
              </div>
              {errors.fk_area && (
                <p className="text-sm text-red-500 mt-1">{errors.fk_area.message}</p>
              )}
            </Combobox>
          </div>
        )}
      />

      <Controller
        control={control}
        name="fk_tipo_sitio"
        render={({ field }) => (
          <div className="w-full">
            <label className="text-sm font-medium text-gray-700 mb-1 block">Tipo de sitio</label>
            <Combobox
              value={field.value}
              onChange={(val) => {
                field.onChange(val);
                setOpenTipo(false);
              }}
            >
              <div className="relative">
                <Combobox.Input
                  className="w-full border rounded-md p-2"
                  displayValue={(id: number) =>
                    tipos?.find((t) => t.id_tipo_sitio === id)?.nombre || ""
                  }
                  onClick={() => setOpenTipo(true)}
                  onChange={(e) => {
                    setQueryTipo(e.target.value);
                    setOpenTipo(true);
                  }}
                  placeholder="Selecciona un tipo..."
                />
                {openTipo && (
                  <Combobox.Options className="absolute z-10 mt-1 w-full max-h-60 overflow-auto rounded-md bg-white border shadow">
                    {filteredTipos?.length === 0 && (
                      <div className="p-2 text-sm text-gray-500">No se encontraron tipos.</div>
                    )}
                    {filteredTipos?.map((tipo) => (
                      <Combobox.Option
                        key={tipo.id_tipo_sitio}
                        value={tipo.id_tipo_sitio}
                        className="cursor-pointer p-2 hover:bg-blue-100"
                      >
                        {tipo.nombre}
                      </Combobox.Option>
                    ))}
                  </Combobox.Options>
                )}
              </div>
              {errors.fk_tipo_sitio && (
                <p className="text-sm text-red-500 mt-1">{errors.fk_tipo_sitio.message}</p>
              )}
            </Combobox>
          </div>
        )}
      />
    </Form>
  );
}
