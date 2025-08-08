import { Input } from "@heroui/input";
import { Controller, useForm } from "react-hook-form";
import { Form } from "@heroui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { addToast, Select, SelectItem } from "@heroui/react";
import { ElementoUpdateSchema, ElementoUpdate } from "@/schemas/Elemento";
import { useElemento } from "@/hooks/Elementos/useElemento";
import Buton from "@/components/molecules/Button";
import { useUnidad } from "@/hooks/UnidadesMedida/useUnidad";
import { useCategoria } from "@/hooks/Categorias/useCategorias";
import { useCaracteristica } from "@/hooks/Caracteristicas/useCaracteristicas";
import { useEffect } from "react";

type Props = {
  elementos: ElementoUpdate[];
  elementoId: number;
  id: string;
  onclose: () => void;
};

export const FormUpdate = ({ elementos, elementoId, id, onclose }: Props) => {
  const { updateElemento, getElementoById } = useElemento();
  const { unidades = [] } = useUnidad();
  const { categorias = [] } = useCategoria();
  const { caracteristicas = [] } = useCaracteristica();

  const foundElemento = getElementoById(
    elementoId,
    elementos
  ) as ElementoUpdate;
  console.log("unidaeds hdhjdc,mdñ:", unidades);
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ElementoUpdate>({
    resolver: zodResolver(ElementoUpdateSchema),
    mode: "onChange",
    defaultValues: {
      nombre: foundElemento.nombre,
      descripcion: foundElemento.descripcion,
      imagen: foundElemento.imagen,
      fkUnidadMedida: foundElemento.fkUnidadMedida,
      fkCategoria: foundElemento.fkCategoria ?? [],
      fkCaracteristica: foundElemento.fkCaracteristica,
    },
  });

  console.log("yfhbdj fkuni:", foundElemento.fkUnidadMedida);

  const imagen = watch("imagen");

  const onSubmit = async (data: ElementoUpdate) => {
    if (!data.idElemento) return;
    try {
      await updateElemento(data.idElemento, data);
      onclose();
      addToast({
        title: "Elemento actualizado",
        description:
          "Los datos del elemento fueron actualizados correctamente.",
        color: "primary",
        timeout: 3000,
        shouldShowTimeoutProgress: true,
      });
    } catch (error) {
      console.error("Error al actualizar el Elemento", error);
    }
  };

  useEffect(() => {
    if (foundElemento) {
      reset({
        nombre: foundElemento.nombre,
        descripcion: foundElemento.descripcion,
        imagen: foundElemento.imagen,
        fkUnidadMedida: foundElemento.fkUnidadMedida,
        fkCategoria: foundElemento.fkCategoria ?? [],
        fkCaracteristica: foundElemento.fkCaracteristica,
      });
    }
  }, [foundElemento, reset]);

  console.log("Errores", errors);
  return (
    <Form
      id={id}
      className="w-full space-y-4"
      onSubmit={handleSubmit(onSubmit)}
    >
      <Input
        label="Nombre"
        placeholder="Nombre del elemento"
        {...register("nombre")}
        isInvalid={!!errors.nombre}
        errorMessage={errors.nombre?.message}
      />

      <Input
        label="Descripción"
        placeholder="Descripción del elemento"
        {...register("descripcion")}
        isInvalid={!!errors.descripcion}
        errorMessage={errors.descripcion?.message}
      />

      {imagen && typeof imagen === "string" && (
        <div className="flex justify-center">
          <img
            src={`http://localhost:3000/img/img/elementos/${imagen}`}
            alt="Imagen actual"
            className="w-40 h-40 object-cover rounded-lg mb-4"
          />
        </div>
      )}

      {imagen instanceof File && (
        <div className="flex justify-center">
          <img
            src={URL.createObjectURL(imagen)}
            alt="Nueva imagen"
            className="w-40 h-40 object-cover rounded-lg mb-4"
          />
        </div>
      )}

      <Input
        label="Imagen"
        type="file"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) setValue("imagen", file);
        }}
      />

      <Controller
        control={control}
        name="fkUnidadMedida"
        render={({ field }) => {
          const currentValue = Number(field.value);
          return (
            <Select
              label="Unidad de medida"
              placeholder="Selecciona una unidad..."
              selectedKeys={
                currentValue ? new Set([currentValue.toString()]) : new Set()
              }
              onSelectionChange={(key) => {
                field.onChange(key ? Number(key) : null);
              }}
              isInvalid={!!errors.fkUnidadMedida}
              errorMessage={errors.fkUnidadMedida?.message}
            >
              {unidades.map((unidad) => (
                <SelectItem
                  key={String(unidad.idUnidad)}
                  textValue={unidad.nombre}
                >
                  {unidad.nombre}
                </SelectItem>
              ))}
            </Select>
          );
        }}
      />

      <Controller
        control={control}
        name="fkCategoria"
        render={({ field }) => {
          const currentValue = field.value ? String(field.value) : "";
          return (
            <Select
              label="Categoría"
              placeholder="Selecciona una categoría..."
              selectedKeys={currentValue ? new Set([currentValue]) : new Set()}
              onSelectionChange={(keys) => {
                const selected = Array.from(keys)[0];
                field.onChange(selected ? Number(selected) : null);
              }}
              value={currentValue ? currentValue.toString() : ""}
              isInvalid={!!errors.fkCategoria}
              errorMessage={errors.fkCategoria?.message}
            >
              {categorias?.map((categoria) => (
                <SelectItem
                  key={categoria.idCategoria?.toString()}
                  textValue={categoria.nombre}
                >
                  {categoria.nombre}
                </SelectItem>
              ))}
            </Select>
          );
        }}
      />

      <Controller
        control={control}
        name="fkCaracteristica"
        render={({ field }) => {
          const currentValue = field.value ? String(field.value) : "";
          return (
            <Select
              label="Característica"
              placeholder="Selecciona una característica..."
              selectedKeys={currentValue ? new Set([currentValue]) : new Set()}
              onSelectionChange={(keys) => {
                const selected = Array.from(keys)[0];
                field.onChange(selected ? Number(selected) : null);
              }}
              value={currentValue ? currentValue.toString() : ""}
              isInvalid={!!errors.fkCaracteristica}
              errorMessage={errors.fkCaracteristica?.message}
            >
              {caracteristicas?.map((caracteristica) => (
                <SelectItem
                  key={caracteristica.idCaracteristica?.toString()}
                  textValue={caracteristica.nombre}
                >
                  {caracteristica.nombre}
                </SelectItem>
              ))}
            </Select>
          );
        }}
      />

      <Buton
        text="Guardar"
        type="submit"
        isLoading={isSubmitting}
        className="w-full rounded-xl"
      />
    </Form>
  );
};
