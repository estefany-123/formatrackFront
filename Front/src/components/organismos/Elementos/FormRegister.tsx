import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUnidad } from "@/hooks/UnidadesMedida/useUnidad";
import { useCategoria } from "@/hooks/Categorias/useCategorias";
import { useCaracteristica } from "@/hooks/Caracteristicas/useCaracteristicas";
import { Form } from "@heroui/form";
import { Input, Select, SelectItem } from "@heroui/react";
import { ElementoCreate, ElementoCreateSchema } from "@/schemas/Elemento";

type FormularioProps = {
  addData: (elemento: ElementoCreate) => Promise<void>;
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
  } = useForm<ElementoCreate>({
    resolver: zodResolver(ElementoCreateSchema),
    mode: "onChange",
  });

  const { unidades } = useUnidad();
  const { categorias } = useCategoria();
  const { caracteristicas } = useCaracteristica();

  const onSubmit = async (data: ElementoCreate) => {
    try {
      await addData(data);
      onClose();
    } catch (error) {
      console.error("Error al guardar el elemento:", error);
    }
  };

  return (
    <Form
      id={id}
      onSubmit={handleSubmit(onSubmit)}
      className="w-full space-y-4"
    >
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

      <Controller
        control={control}
        name="tipoElemento"
        render={({ field }) => (
          <Select
            label="Tipo de Elemento"
            placeholder="Selecciona tipo"
            {...field}
            value={field.value ?? ""}
            onChange={(e) => {
              const value = e.target.value;
              field.onChange(value);
              setValue("perecedero", value === "perecedero");
              setValue("no_perecedero", value === "no_perecedero");
            }}
          >
            <SelectItem key="perecedero">Perecedero</SelectItem>
            <SelectItem key="no_perecedero">No Perecedero</SelectItem>
          </Select>
        )}
      />
      {errors.tipoElemento && (
        <p className="text-red-500">{errors.tipoElemento?.message}</p>
      )}

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

      <Input
        label="Imagen"
        type="file"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0] ?? null;
          setValue("imagen_elemento", file);
        }}
      />

      <Controller
        control={control}
        name="fk_unidad_medida"
        render={({ field }) => (
          <div className="w-full">
            <Select
              label="Unidad"
              {...field}
              className="w-full"
              placeholder="Selecciona una unidad de medida..."
              aria-label="Seleccionar Unidad de Medida"
              onChange={(e) => field.onChange(Number(e.target.value))} 
            >
              {unidades?.length ? (
                unidades.map((unidad) => (
                  <SelectItem
                    key={unidad.id_unidad}
                    textValue={unidad.nombre} 
                  >
                    {unidad.nombre}
                  </SelectItem>
                ))
              ) : (
                <SelectItem isDisabled>No hay unidades disponibles</SelectItem>
              )}
            </Select>
            {errors.fk_unidad_medida && (
              <p className="text-sm text-red-500 mt-1">
                {errors.fk_unidad_medida.message}
              </p>
            )}
          </div>
        )}
      />

      <Controller
        control={control}
        name="fk_categoria"
        render={({ field }) => (
          <div className="w-full">
            <Select
              label="Categoria"
              {...field}
              className="w-full"
              placeholder="Selecciona una categoría..."
              aria-label="Seleccionar Categoría"
              onChange={(e) => field.onChange(Number(e.target.value))} // Convierte el valor a number
            >
              {categorias?.length ? (
                categorias.map((cat) => (
                  <SelectItem
                    key={cat.id_categoria}
                    textValue={cat.nombre} // Usa textValue en lugar de value
                  >
                    {cat.nombre}
                  </SelectItem>
                ))
              ) : (
                <SelectItem isDisabled>
                  No hay categorías disponibles
                </SelectItem>
              )}
            </Select>
            {errors.fk_categoria && (
              <p className="text-sm text-red-500 mt-1">
                {errors.fk_categoria.message}
              </p>
            )}
          </div>
        )}
      />

      <Controller
        control={control}
        name="fk_caracteristica"
        render={({ field }) => (
          <div className="w-full">
            <Select
              label="Caracteristica"
              {...field}
              className="w-full"
              placeholder="Selecciona una característica..."
              aria-label="Seleccionar Característica"
              onChange={(e) => field.onChange(Number(e.target.value))} // Convierte el valor a number
            >
              {caracteristicas?.length ? (
                caracteristicas.map((car) => (
                  <SelectItem
                    key={car.id_caracteristica}
                    textValue={car.nombre} // Usa textValue en lugar de value
                  >
                    {car.nombre}
                  </SelectItem>
                ))
              ) : (
                <SelectItem isDisabled>
                  No hay características disponibles
                </SelectItem>
              )}
            </Select>
            {errors.fk_caracteristica && (
              <p className="text-sm text-red-500 mt-1">
                {errors.fk_caracteristica.message}
              </p>
            )}
          </div>
        )}
      />
    </Form>
  );
}
