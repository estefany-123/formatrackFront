import { Form } from "@heroui/form";
import { Input, Select, SelectItem } from "@heroui/react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { MovimientoCreate, MovimientoCreateSchema } from "@/schemas/Movimento";
import { useUsuario } from "@/hooks/Usuarios/useUsuario";
import { useTipoMovimiento } from "@/hooks/TiposMovimento/useTipoMovimiento";
import { useInventario } from "@/hooks/Inventarios/useInventario";
import { useSitios } from "@/hooks/sitios/useSitios";
import { useElemento } from "@/hooks/Elementos/useElemento";
import React from "react";

type FormularioProps = {
  addData: (movimiento: MovimientoCreate) => Promise<void>;
  onClose: () => void;
  id: string;
};

export default function Formulario({ addData, onClose, id }: FormularioProps) {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<MovimientoCreate>({
    resolver: zodResolver(MovimientoCreateSchema),
    mode: "onChange",
  });

  const { users, isLoading:loadingUsers, error:errorUsers } = useUsuario();
  const { tipos, isLoading:loadingTipos, error:errorTipos} = useTipoMovimiento();
  const { sitios,} = useSitios();
  const { inventarios, isLoading:loadingInventarios, error:errorInventarios} = useInventario();
  const { elementos, isLoading:loadingElementos, error:errorElementos} = useElemento();
  const [sitioSeleccionado, setSitioSeleccionado] = React.useState<number | null>(null);


  const onSubmit = async (data: MovimientoCreate) => {
    try {
      await addData(data);
      onClose();
    } catch (error) {
      console.error("Error al guardar movimiento:", error);
    }
  };

  return (
    <Form
      id={id}
      onSubmit={handleSubmit(onSubmit)}
      className="w-full space-y-4"
    >
      <Input
        label="Descripción"
        placeholder="Descripción"
        type="text"
        {...register("descripcion")}
        isInvalid={!!errors.descripcion}
        errorMessage={errors.descripcion?.message}
      />

      <Input
        label="Cantidad"
        placeholder="Cantidad"
        type="text"
        {...register("cantidad", { valueAsNumber: true })}
        isInvalid={!!errors.cantidad}
        errorMessage={errors.cantidad?.message}
      />

      <Input
        label="Hora de Ingreso"
        placeholder="Hora Ingreso"
        type="time"
        {...register("hora_ingreso")}
        isInvalid={!!errors.hora_ingreso}
        errorMessage={errors.hora_ingreso?.message}
      />

      <Input
        label="Hora de Salida"
        placeholder="Hora Salida"
        type="time"
        {...register("hora_salida")}
        isInvalid={!!errors.hora_salida}
        errorMessage={errors.hora_salida?.message}
      />

<Controller
        control={control}
        name="tipo_bien"
        render={({ field }) => (
          <Select
            label="Tipo de Bien"
            placeholder="Selecciona un tipo"
            {...field}
            isInvalid={!!errors.tipo_bien}
            errorMessage={errors.tipo_bien?.message}
            onChange={(e) => {
              const value = e.target.value;
              field.onChange(value === "devolutivo" ? "devolutivo" : "no_devolutivo");
            }}
          >
            <SelectItem key="devolutivo" textValue="Devolutivo">
              Devolutivo
            </SelectItem>
            <SelectItem key="no_devolutivo" textValue="No Devolutivo">
              No Devolutivo
            </SelectItem>
          </Select>
        )}
      />

{/* Usuario */}
{!loadingUsers && !errorUsers && users && (
  <Controller
    control={control}
    name="fk_usuario"
    render={({ field }) => (
      <div className="w-full">
        <Select
          {...field}
          label="Usuario"
          placeholder="Selecciona un usuario"
          aria-label="Seleccionar usuario"
          className="w-full"
          onChange={(e) => field.onChange(Number(e.target.value))}
        >
          {users.length ? (
            users.map((usuario) => (
              <SelectItem key={usuario.id_usuario} textValue={usuario.nombre}>
                {usuario.nombre}
              </SelectItem>
            ))
          ) : (
            <SelectItem isDisabled>No hay usuarios disponibles</SelectItem>
          )}
        </Select>
        {errors.fk_usuario && (
          <p className="text-sm text-red-500 mt-1">
            {errors.fk_usuario.message}
          </p>
        )}
      </div>
    )}
  />
)}

{/* Tipo de Movimiento */}
{!loadingTipos && !errorTipos && tipos && (
  <Controller
    control={control}
    name="fk_tipo_movimiento"
    render={({ field }) => (
      <div className="w-full">
        <Select
          {...field}
          label="Tipo de Movimiento"
          placeholder="Selecciona un tipo de movimiento"
          aria-label="Seleccionar tipo de movimiento"
          className="w-full"
          onChange={(e) => field.onChange(Number(e.target.value))}
        >
          {tipos.length ? (
            tipos.map((tipo) => (
              <SelectItem key={tipo.id_tipo} textValue={tipo.nombre}>
                {tipo.nombre}
              </SelectItem>
            ))
          ) : (
            <SelectItem isDisabled>No hay tipos de movimiento disponibles</SelectItem>
          )}
        </Select>
        {errors.fk_tipo_movimiento && (
          <p className="text-sm text-red-500 mt-1">
            {errors.fk_tipo_movimiento.message}
          </p>
        )}
      </div>
    )}
  />
)}

{/* Sitio */}
<Controller
  control={control}
  name="fk_sitio"
  render={({ field }) => (
    <div className="w-full">
      <Select
        {...field}
        label="Sitio"
        placeholder="Selecciona un sitio"
        aria-label="Seleccionar sitio"
        className="w-full"
        onChange={(e) => {
          const sitioId = Number(e.target.value);
          field.onChange(sitioId);
          setSitioSeleccionado(sitioId);
        }}
      >
        {sitios?.length ? (
          sitios.map((sitio) => (
            <SelectItem key={sitio.id_sitio} textValue={sitio.nombre}>
              {sitio.nombre}
            </SelectItem>
          ))
        ) : (
          <SelectItem isDisabled>No hay sitios disponibles</SelectItem>
        )}
      </Select>
      {errors.fk_sitio && (
        <p className="text-sm text-red-500 mt-1">
          {errors.fk_sitio.message}
        </p>
      )}
    </div>
  )}
/>

{/* Elemento del Inventario */}
{!loadingInventarios &&
  !errorInventarios &&
  inventarios &&
  !loadingElementos &&
  !errorElementos &&
  elementos &&
  sitioSeleccionado && (
    <Controller
      control={control}
      name="fk_inventario"
      render={({ field }) => (
        <div className="w-full">
          <Select
            {...field}
            label="Elemento del Inventario"
            placeholder="Selecciona un elemento del inventario"
            aria-label="Seleccionar elemento del inventario"
            className="w-full"
            onChange={(e) => field.onChange(Number(e.target.value))}
          >
            {inventarios.filter((inv) => inv.fk_sitio === sitioSeleccionado).length ? (
              inventarios
                .filter((inv) => inv.fk_sitio === sitioSeleccionado)
                .map((inventario) => {
                  const elemento = elementos.find((e) => e.id_elemento === inventario.fk_elemento);
                  return (
                    <SelectItem
                      key={inventario.id_inventario}
                      textValue={elemento?.nombre || "Elemento no disponible"}
                    >
                      {elemento ? elemento.nombre : "Elemento no disponible"}
                    </SelectItem>
                  );
                })
            ) : (
              <SelectItem isDisabled>No hay elementos disponibles</SelectItem>
            )}
          </Select>
          {errors.fk_inventario && (
            <p className="text-sm text-red-500 mt-1">
              {errors.fk_inventario.message}
            </p>
          )}
        </div>
      )}
    />
)}


    </Form>
  );
}
