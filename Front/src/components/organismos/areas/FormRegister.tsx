import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { Form } from "@heroui/form";
import { Input } from "@heroui/input";
import { AreaSchema, Area } from "@/schemas/Area";
import { Select, SelectItem } from "@heroui/react";
import { useSede } from "@/hooks/sedes/useSedes";
import { Combobox } from "@headlessui/react";
import {  useState } from "react";

type FormularioProps = {
  addData: (area: Area) => Promise<void>;
  onClose: () => void;
  id: string;
};

export default function Formulario({ addData, onClose, id }: FormularioProps) {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Area>({
    resolver: zodResolver(AreaSchema),
    mode: "onChange",
  });

  const { sede } = useSede();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);

  const filteredSedes =
    query === ""
      ? sede
      : sede?.filter((s) =>
          s.nombre.toLowerCase().includes(query.toLowerCase())
        );

  const onSubmit = async (data: Area) => {
    try {
      await addData(data);
      onClose();
    } catch (error) {
      console.error("Error al guardar:", error);
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
        label="Persona encargada"
        type="text"
        placeholder="Persona encargada"
        {...register("persona_encargada")}
        isInvalid={!!errors.persona_encargada}
        errorMessage={errors.persona_encargada?.message}
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
        name="fk_sede"
        render={({ field }) => (
          <div className="w-full">
            <label className="text-sm text-gray-700 font-medium mb-1 block">
              Sede
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
                    sede?.find((s) => s.id_sede === id)?.nombre || ""
                  }
                  onClick={() => setOpen(true)} 
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setOpen(true);
                  }}
                  placeholder="Selecciona una sede..."
                />
                {open && (
                  <Combobox.Options className="absolute z-10 mt-1 w-full max-h-60 overflow-auto rounded-md bg-white border shadow">
                    {filteredSedes?.length === 0 && (
                      <div className="p-2 text-sm text-gray-500">
                        No se encontraron sedes.
                      </div>
                    )}
                    {filteredSedes?.map((s) => (
                      <Combobox.Option
                        key={s.id_sede}
                        value={s.id_sede}
                        className="cursor-pointer p-2 hover:bg-blue-100"
                      >
                        {s.nombre}
                      </Combobox.Option>
                    ))}
                  </Combobox.Options>
                )}
              </div>
            </Combobox>
            {errors.fk_sede && (
              <p className="text-sm text-red-500 mt-1">
                {errors.fk_sede.message}
              </p>
            )}
          </div>
        )}
      />
    </Form>
  );
}
