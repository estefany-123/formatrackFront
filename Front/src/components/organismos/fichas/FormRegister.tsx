import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { Form } from "@heroui/form";
import { Input } from "@heroui/input";
import { Select, SelectItem } from "@heroui/react";
import { usePrograma } from "@/hooks/programas/usePrograma";
import { Combobox } from "@headlessui/react";
import { useState } from "react";
import { fichaSchema, Ficha } from "@/schemas/fichas"; // Asegúrate de que el esquema esté correctamente importado

type FormularioProps = {
  addData: (ficha: Ficha) => Promise<void>;
  onClose: () => void;
  id: string;
};

export default function Formulario({ addData, onClose, id }: FormularioProps) {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Ficha>({
    resolver: zodResolver(fichaSchema), // Usamos el resolver con el esquema de Ficha
    mode: "onChange",
  });

  const { programas, isLoading: loadingProgramas, isError: errorPrograma } = usePrograma();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);

  const filteredProgramas =
    query === ""
      ? programas
      : programas?.filter((programa) =>
          programa.nombre.toLowerCase().includes(query.toLowerCase())
        );

  const onSubmit = async (data: Ficha) => {
    try {
      await addData(data);
      onClose();
    } catch (error) {
      console.error("Error al guardar la ficha:", error);
    }
  };

  return (
    <Form id={id} onSubmit={handleSubmit(onSubmit)} className="w-full space-y-4">
      <Input
        label="Nombre"
        type="text"
        placeholder="Nombre"
        {...register("nombre")}
        isInvalid={!!errors.nombre}
        errorMessage={errors.nombre?.message}
      />

      <Input
        label="Código de Ficha"
        type="text"
        placeholder="Código de Ficha"
        {...register("codigo_ficha",{ valueAsNumber: true })}
        isInvalid={!!errors.codigo_ficha}
        errorMessage={errors.codigo_ficha?.message}
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

      {/* Selección del programa */}
      <Controller
        control={control}
        name="fk_programa"
        render={({ field }) => (
          <div className="w-full">
            <label className="text-sm text-gray-700 font-medium mb-1 block">
              Programa
            </label>
            <Combobox
              value={field.value}
              onChange={(val) => field.onChange(val)}
            >
              <div className="relative">
                <Combobox.Input
                  className="w-full border rounded-md p-2"
                  displayValue={(id: number) =>
                    programas?.find((p) => p.id_programa === id)?.nombre || ""
                  }
                  onClick={() => setOpen(true)}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setOpen(true);
                  }}
                  placeholder="Selecciona un programa..."
                />
                {open && (
                  <Combobox.Options className="absolute z-10 mt-1 w-full max-h-60 overflow-auto rounded-md bg-white border shadow">
                    {filteredProgramas?.length === 0 && (
                      <div className="p-2 text-sm text-gray-500">
                        No se encontraron programas.
                      </div>
                    )}
                    {filteredProgramas?.map((programa) => (
                      <Combobox.Option
                        key={programa.id_programa}
                        value={programa.id_programa}
                        className="cursor-pointer p-2 hover:bg-blue-100"
                      >
                        {programa.nombre}
                      </Combobox.Option>
                    ))}
                  </Combobox.Options>
                )}
              </div>
            </Combobox>
            {errors.fk_programa && (
              <p className="text-sm text-red-500 mt-1">
                {errors.fk_programa.message}
              </p>
            )}
          </div>
        )}
      />


    </Form>
  );
}
