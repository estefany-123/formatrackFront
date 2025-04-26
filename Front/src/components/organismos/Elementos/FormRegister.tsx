import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUnidad } from "@/hooks/UnidadesMedida/useUnidad";
import { useCategoria } from "@/hooks/Categorias/useCategorias";
import { useCaracteristica } from "@/hooks/Caracteristicas/useCaracteristicas";
import { Form } from "@heroui/form";
import { Input } from "@heroui/react";
import { Elemento, ElementoSchema } from "@/schemas/Elemento";
import { Combobox } from "@headlessui/react";
import { useState } from "react";

type FormularioProps = {
  addData: (elemento: Elemento) => Promise<void>;
  onClose: () => void;
  id: string;
};

export default function Formulario({ addData, onClose, id }: FormularioProps) {
  const {
    control,
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<Elemento>({
    resolver: zodResolver(ElementoSchema),
    mode: "onChange",
  });

  const { unidades } = useUnidad();
  const { categorias } = useCategoria();
  const { caracteristicas } = useCaracteristica();

  const [queryUnidad, setQueryUnidad] = useState("");
  const [queryCategoria, setQueryCategoria] = useState("");
  const [queryCaracteristica, setQueryCaracteristica] = useState("");

  const filterByQuery = (list: any[] | undefined, key: string, query: string) => {
    if (!list) return [];
    return query === ""
      ? list
      : list.filter((item) =>
          item[key].toLowerCase().includes(query.toLowerCase())
        );
  };

  const onSubmit = async (data: Elemento) => {
    try {
      await addData(data);
      onClose();
    } catch (error) {
      console.error("Error al guardar el elemento:", error);
    }
  };

  return (
    <Form id={id} onSubmit={handleSubmit(onSubmit)} className="w-full space-y-4">
      <Input
        label="Nombre"
        placeholder="Nombre"
        {...register("nombre")}
        isInvalid={!!errors.nombre}
        errorMessage={errors.nombre?.message}
      />
      <Input
        label="Descripción"
        placeholder="Descripción"
        {...register("descripcion")}
        isInvalid={!!errors.descripcion}
        errorMessage={errors.descripcion?.message}
      />
      <Input
        label="Valor"
        type="number"
        placeholder="Valor"
        {...register("valor", { valueAsNumber: true })}
        isInvalid={!!errors.valor}
        errorMessage={errors.valor?.message}
      />

      {/* Tipo de elemento */}
      <Controller
        control={control}
        name="tipoElemento"
        render={({ field }) => (
          <select
            {...field}
            onChange={(e) => {
              const value = e.target.value;
              field.onChange(value);
              setValue("perecedero", value === "perecedero");
              setValue("no_perecedero", value === "no_perecedero");
            }}
            className="w-full p-2 border rounded-md"
          >
            <option value="">Selecciona un tipo</option>
            <option value="perecedero">Perecedero</option>
            <option value="no_perecedero">No Perecedero</option>
          </select>
        )}
      />

      {/* Estado */}
      <Controller
        control={control}
        name="estado"
        render={({ field }) => (
          <select
            {...field}
            value={field.value ? "true" : "false"}
            onChange={(e) => field.onChange(e.target.value === "true")}
            className="w-full p-2 border rounded-md"
          >
            <option value="true">Activo</option>
            <option value="false">Inactivo</option>
          </select>
        )}
      />

      {/* Imagen */}
      <Input
        label="Imagen"
        type="file"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0];
          setValue("imagen_elemento", file);
        }}
      />

      {/* Unidad de medida */}
      <Controller
        control={control}
        name="fk_unidad_medida"
        render={({ field }) => (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Unidad de medida</label>
            <Combobox value={field.value} onChange={field.onChange}>
              <Combobox.Input
                className="w-full border p-2 rounded"
                placeholder="Buscar unidad..."
                displayValue={(id: number) => unidades?.find(u => u.id_unidad === id)?.nombre || ""}
                onChange={(e) => setQueryUnidad(e.target.value)}
              />
              <Combobox.Options className="border bg-white max-h-60 overflow-auto mt-1 rounded-md shadow">
                {filterByQuery(unidades, "nombre", queryUnidad).map((unidad) => (
                  <Combobox.Option key={unidad.id_unidad} value={unidad.id_unidad} className="p-2 hover:bg-blue-100 cursor-pointer">
                    {unidad.nombre}
                  </Combobox.Option>
                ))}
              </Combobox.Options>
            </Combobox>
            {errors.fk_unidad_medida && <p className="text-sm text-red-500 mt-1">{errors.fk_unidad_medida.message}</p>}
          </div>
        )}
      />

      {/* Categoría */}
      <Controller
        control={control}
        name="fk_categoria"
        render={({ field }) => (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
            <Combobox value={field.value} onChange={field.onChange}>
              <Combobox.Input
                className="w-full border p-2 rounded"
                placeholder="Buscar categoría..."
                displayValue={(id: number) => categorias?.find(c => c.id_categoria === id)?.nombre || ""}
                onChange={(e) => setQueryCategoria(e.target.value)}
              />
              <Combobox.Options className="border bg-white max-h-60 overflow-auto mt-1 rounded-md shadow">
                {filterByQuery(categorias, "nombre", queryCategoria).map((cat) => (
                  <Combobox.Option key={cat.id_categoria} value={cat.id_categoria} className="p-2 hover:bg-blue-100 cursor-pointer">
                    {cat.nombre}
                  </Combobox.Option>
                ))}
              </Combobox.Options>
            </Combobox>
            {errors.fk_categoria && <p className="text-sm text-red-500 mt-1">{errors.fk_categoria.message}</p>}
          </div>
        )}
      />

      {/* Característica */}
      <Controller
        control={control}
        name="fk_caracteristica"
        render={({ field }) => (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Característica</label>
            <Combobox value={field.value} onChange={field.onChange}>
              <Combobox.Input
                className="w-full border p-2 rounded"
                placeholder="Buscar característica..."
                displayValue={(id: number) => caracteristicas?.find(c => c.id_caracteristica === id)?.nombre || ""}
                onChange={(e) => setQueryCaracteristica(e.target.value)}
              />
              <Combobox.Options className="border bg-white max-h-60 overflow-auto mt-1 rounded-md shadow">
                {filterByQuery(caracteristicas, "nombre", queryCaracteristica).map((car) => (
                  <Combobox.Option key={car.id_caracteristica} value={car.id_caracteristica} className="p-2 hover:bg-blue-100 cursor-pointer">
                    {car.nombre}
                  </Combobox.Option>
                ))}
              </Combobox.Options>
            </Combobox>
            {errors.fk_caracteristica && <p className="text-sm text-red-500 mt-1">{errors.fk_caracteristica.message}</p>}
          </div>
        )}
      />
    </Form>
  );
}
