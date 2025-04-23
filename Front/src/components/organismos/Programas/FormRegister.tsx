import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { Form } from "@heroui/form";
import { Input } from "@heroui/input";
import { Select, SelectItem } from "@heroui/react";
import { Combobox } from "@headlessui/react";
import { useState } from "react";

import { useCentro } from "@/hooks/Centros/useCentros";
import { sede, sedeSchema } from "@/schemas/sedes";

type FormularioSedeProps = {
  addData: (data: sede) => Promise<void>;
  onClose: () => void;
  id: string;
};

export default function FormularioSede({
  addData,
  onClose,
  id,
}: FormularioSedeProps) {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<sede>({
    resolver: zodResolver(sedeSchema),
    mode: "onChange",
  });

  const { centros } = useCentro();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);

  const filteredCentros =
    query === ""
      ? centros
      : centros?.filter((centro) =>
          centro.nombre.toLowerCase().includes(query.toLowerCase())
        );

  const onSubmit = async (data: sede) => {
    try {
      await addData(data);
      onClose();
    } catch (error) {
      console.error("Error al guardar sede:", error);
    }
  };

  return (
    <Form
      id={id}
      onSubmit={handleSubmit(onSubmit)}
      className="w-full space-y-4"
    >
      <Input
        label="Nombre de la sede"
        type="text"
        placeholder="Nombre"
        {...register("nombre")}
        isInvalid={!!errors.nombre}
        errorMessage={errors.nombre?.message}
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
      {errors.estado && (
        <p className="text-red-500">{errors.estado.message}</p>
      )}

      <Controller
        control={control}
        name="fk_centro"
        render={({ field }) => (
          <div className="w-full">
            <label className="text-sm text-gray-700 font-medium mb-1 block">
              Centro
            </label>
            <Combobox
              value={field.value}
              onChange={(val) => {
                field.onChange(val);
                setOpen(false);
              }}
            >
              <div className="relative">
                <Combobox.Input
                  className="w-full border rounded-md p-2"
                  displayValue={(id: number) =>
                    centros?.find((c) => c.id_centro === id)?.nombre || ""
                  }
                  onClick={() => setOpen(true)}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setOpen(true);
                  }}
                  placeholder="Selecciona un centro..."
                />
                {open && (
                  <Combobox.Options className="absolute z-10 mt-1 w-full max-h-60 overflow-auto rounded-md bg-white border shadow">
                    {filteredCentros?.length === 0 && (
                      <div className="p-2 text-sm text-gray-500">
                        No se encontraron centros.
                      </div>
                    )}
                    {filteredCentros?.map((centro) => (
                      <Combobox.Option
                        key={centro.id_centro}
                        value={centro.id_centro}
                        className="cursor-pointer p-2 hover:bg-blue-100"
                      >
                        {centro.nombre}
                      </Combobox.Option>
                    ))}
                  </Combobox.Options>
                )}
              </div>
            </Combobox>
            {errors.fk_centro && (
              <p className="text-sm text-red-500 mt-1">
                {errors.fk_centro.message}
              </p>
            )}
          </div>
        )}
      />
    </Form>
  );
}
