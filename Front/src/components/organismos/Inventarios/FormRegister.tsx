import { Form } from "@heroui/form";
import { addToast, Input, Select, SelectItem } from "@heroui/react";
import { useSitios } from "@/hooks/sitios/useSitios";
import { useElemento } from "@/hooks/Elementos/useElemento";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { InventarioCreate, InventarioCreateSchema } from "@/schemas/Inventario";

type FormularioProps = {
  addData: (inventario: InventarioCreate) => Promise<void>;
  onClose: () => void;
  id: string;
  idSitio: number;
};

export default function Formulario({
  addData,
  onClose,
  id,
  idSitio,
}: FormularioProps) {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<InventarioCreate>({
    resolver: zodResolver(InventarioCreateSchema),
    mode: "onChange",
    defaultValues:{
      stock:0
    }
  });
  const {
    sitios,
    isLoading: loadingSitios,
    isError: errorSitios,
  } = useSitios();
  const {
    elementos,
    isLoading: loadingElementos,
    isError: errorElementos,
  } = useElemento();

  const onSubmit = async (data: InventarioCreate) => {
    try {
      await addData(data);
      onClose();
      addToast({
        title: "Registro Exitoso",
        description: "Elemento agregado al inventario correctamente",
        color: "success",
        timeout: 3000,
        shouldShowTimeoutProgress: true,
      });
    } catch (error) {
      console.error("Error al guardar el elemento:", error);
    }
  };
console.log("Errores", errors)
  return (
    <Form
      id={id}
      onSubmit={handleSubmit(onSubmit)}
      className="w-full space-y-4"
    >
      <Controller
        control={control}
        name="estado"
        render={({ field }) => (
          <Select
            label="Estado"
            placeholder="Selecciona estado"
            {...field}
            value={field.value ? "true" : "false"}
            onChange={(e) => field.onChange(e.target.value === "true")}
            isInvalid={!!errors.estado}
            errorMessage={errors.estado?.message}
          >
            <SelectItem key="true">Activo</SelectItem>
            <SelectItem key="false">Inactivo</SelectItem>
          </Select>
        )}
      />

      {!loadingSitios && !errorSitios && Array.isArray(sitios) && (
        <Controller
          control={control}
          name="fkSitio"
          defaultValue={typeof idSitio === "number" ? idSitio : undefined}
          render={({ field }) => {
            const sitioActual = sitios.find((s) => s.idSitio === idSitio);

            return (
              <div className="w-full">
                {idSitio && sitioActual ? (
                  <Input
                    label="Sitio"
                    value={sitioActual.nombre}
                    isReadOnly
                    isDisabled
                    className="w-full"
                  />
                ) : (
                  <Select
                    label="Sitio"
                    placeholder="Selecciona un sitio"
                    className="w-full"
                    selectedKeys={field.value ? [String(field.value)] : []}
                    onChange={(e) => {
                      const sitioId = Number(e.target.value);
                      field.onChange(sitioId);
                    }}
                    isInvalid={!!errors.fkSitio}
                    errorMessage={errors.fkSitio?.message}
                  >
                    {sitios.map((sitio) => (
                      <SelectItem key={sitio.idSitio} textValue={sitio.nombre}>
                        {sitio.nombre}
                      </SelectItem>
                    ))}
                  </Select>
                )}
              </div>
            );
          }}
        />
      )}

      {!loadingElementos && !errorElementos && elementos && (
        <Controller
          control={control}
          name="fkElemento"
          render={({ field }) => (
            <div className="w-full">
              <Select
                {...field}
                label="Elemento"
                placeholder="Selecciona un elemento"
                aria-label="Seleccionar elemento"
                className="w-full"
                selectedKeys={field.value ? [field.value.toString()] : []}
                onChange={(e) => {
                  const elementoId = Number(e.target.value);
                  field.onChange(elementoId);
                }}
                isInvalid={!!errors.fkElemento}
                errorMessage={errors.fkElemento?.message}
              >
                {elementos.length ? (
                  elementos.map((elemento) => (
                    <SelectItem
                      key={elemento.idElemento}
                      textValue={elemento.nombre}
                    >
                      {elemento.nombre}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem isDisabled>
                    No hay elementos disponibles
                  </SelectItem>
                )}
              </Select>
            </div>
          )}
        />
      )}
    </Form>
  );
}
