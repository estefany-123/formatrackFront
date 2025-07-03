import { Form } from "@heroui/form";
import { addToast, Input, Select, SelectItem } from "@heroui/react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUsuario } from "@/hooks/Usuarios/useUsuario";
import { useTipoMovimiento } from "@/hooks/TiposMovimento/useTipoMovimiento";
import { useInventario } from "@/hooks/Inventarios/useInventario";
import { useSitios } from "@/hooks/sitios/useSitios";
import { useElemento } from "@/hooks/Elementos/useElemento";
import React, { useState } from "react";
import { MovimientoCreate, MovimientoCreateSchema } from "@/schemas/Movimento";
import { mapMovimiento } from "@/utils/MapMovimientos";
import { MovimientoPostData } from "@/axios/Movimentos/postMovimiento";

type FormularioProps = {
  addData: (movimiento: MovimientoPostData) => Promise<void>;
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
    defaultValues: {
      estado: true,
      aceptado: false,
      enProceso: true,
      cancelado: false,
      devolutivo: false,
      noDevolutivo: true,
      fechaDevolucion: null,
      codigos: [],
    },
  });

  const { users } = useUsuario();
  const { tipos } = useTipoMovimiento();
  const { sitios } = useSitios();
  const { inventarios } = useInventario();
  const { elementos } = useElemento();

  const [sitioSeleccionado, setSitioSeleccionado] = useState<number | null>(
    null
  );
  const [inventarioSeleccionado, setInventarioSeleccionado] = useState<
    number | null
  >(null);
  const [tipoMovimientoSeleccionado, setTipoMovimientoSeleccionado] = useState<
    string | null
  >(null);
  const [isDevolutivo, setIsDevolutivo] = useState(false);
  const [tieneCaracteristicas, setTieneCaracteristicas] = useState(false);
  const [codigosDisponibles, setCodigosDisponibles] = useState<string[]>([]);

  const onSubmit = async (data: MovimientoCreate) => {
    const pyload = mapMovimiento(data);
    console.log("Payload enviado al backend:", data);
    try {
      await addData(pyload);
      onClose();
      addToast({
        title: "Registro Exitoso",
        description: "Movimiento agregado correctamente",
        color: "success",
        timeout: 3000,
        shouldShowTimeoutProgress: true,
      });
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

      {/* Hora dinámica según tipo de movimiento */}
      {tipoMovimientoSeleccionado === "ingreso" ? (
        <Input
          label="Hora de Ingreso"
          type="time"
          {...register("horaIngreso")}
          isInvalid={!!errors.horaIngreso}
          errorMessage={errors.horaIngreso?.message}
        />
      ) : tipoMovimientoSeleccionado &&
        ["salida", "baja", "préstamo"].includes(tipoMovimientoSeleccionado) ? (
        <Input
          label="Hora de Salida"
          type="time"
          {...register("horaSalida")}
          isInvalid={!!errors.horaSalida}
          errorMessage={errors.horaSalida?.message}
        />
      ) : null}

      <Controller
        control={control}
        name="tipo_bien"
        render={({ field }) => (
          <Select
            label="Tipo de Bien"
            placeholder="Selecciona un tipo"
            {...field}
            onChange={(e) => {
              const value = e.target.value;
              field.onChange(value);
              setIsDevolutivo(value === "devolutivo");
            }}
            value={field.value}
            isInvalid={!!errors.tipo_bien}
            errorMessage={errors.tipo_bien?.message}
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

      {isDevolutivo && (
        <Controller
          control={control}
          name="fechaDevolucion"
          render={({ field }) => (
            <Input
              {...field}
              type="date"
              label="Fecha de Devolución"
              onChange={(e) => field.onChange(e.target.value || null)}
              isInvalid={!!errors.fechaDevolucion}
              errorMessage={errors.fechaDevolucion?.message}
              value={field.value ?? ""}
            />
          )}
        />
      )}

      <Controller
        control={control}
        name="fkUsuario"
        render={({ field }) => (
          <Select
            label="Usuario"
            placeholder="Selecciona un usuario"
            {...field}
            onChange={(e) => field.onChange(Number(e.target.value))}
            isInvalid={!!errors.fkUsuario}
            errorMessage={errors.fkUsuario?.message}
          >
            {(users ?? []).map((usuario) => (
              <SelectItem key={usuario.idUsuario} textValue={usuario.nombre}>
                {usuario.nombre}
              </SelectItem>
            ))}
          </Select>
        )}
      />

      <Input
        label="Destino"
        placeholder="Destino"
        type="text"
        {...register("lugarDestino")}
        isInvalid={!!errors.lugarDestino}
        errorMessage={errors.lugarDestino?.message}
      />

      <Controller
        control={control}
        name="fkTipoMovimiento"
        render={({ field }) => (
          <Select
            label="Tipo de Movimiento"
            placeholder="Selecciona un tipo"
            {...field}
            onChange={(e) => {
              const id = Number(e.target.value);
              field.onChange(id);
              const tipo = tipos?.find((t) => t.idTipo === id);
              setTipoMovimientoSeleccionado(tipo?.nombre.toLowerCase() ?? null);
            }}
            isInvalid={!!errors.fkTipoMovimiento}
            errorMessage={errors.fkTipoMovimiento?.message}
          >
            {(tipos ?? []).map((tipo) => (
              <SelectItem key={tipo.idTipo} textValue={tipo.nombre}>
                {tipo.nombre}
              </SelectItem>
            ))}
          </Select>
        )}
      />

      <Controller
        control={control}
        name="fkSitio"
        render={({ field }) => (
          <Select
            label="Sitio"
            placeholder="Selecciona un sitio"
            {...field}
            onChange={(e) => {
              const sitioId = Number(e.target.value);
              field.onChange(sitioId);
              setSitioSeleccionado(sitioId);
            }}
            isInvalid={!!errors.fkSitio}
            errorMessage={errors.fkSitio?.message}
          >
            {(sitios ?? []).map((sitio) => (
              <SelectItem key={sitio.idSitio} textValue={sitio.nombre}>
                {sitio.nombre}
              </SelectItem>
            ))}
          </Select>
        )}
      />

      {sitioSeleccionado && (
        <Controller
          control={control}
          name="fkInventario"
          render={({ field }) => (
            <Select
              label="Elemento del Inventario"
              placeholder="Selecciona un elemento"
              {...field}
              onChange={(e) => {
                const id = Number(e.target.value);
                field.onChange(id);
                setInventarioSeleccionado(id);
                const inventario = (inventarios ?? []).find(
                  (i) => i.idInventario === id
                );
                const codigos = inventario?.codigos ?? [];
                setTieneCaracteristicas(codigos.length > 0);
                setCodigosDisponibles(codigos);
              }}
              isInvalid={!!errors.fkInventario}
              errorMessage={errors.fkInventario?.message}
            >
              {(inventarios ?? [])

                .filter((i) => i.fkSitio.idSitio === sitioSeleccionado)

                .map((inventario) => {
                  const elemento = elementos?.find(
                    (e) => e.idElemento === inventario.fkElemento
                  );
                  console.log(
                    "Inventarios del sitio seleccionado:",
                    inventarios?.filter(
                      (i) => i.fkSitio.idSitio === sitioSeleccionado
                    )
                  );
                  return (
                    <SelectItem
                      key={inventario.idInventario}
                      textValue={
                        inventario.fkElemento?.nombre ||
                        "Elemento no disponible"
                      }
                    >
                      {inventario.fkElemento?.nombre ||
                        "Elemento no disponible"}
                    </SelectItem>
                  );
                })}
            </Select>
          )}
        />
      )}

      {inventarioSeleccionado &&
        tipoMovimientoSeleccionado &&
        ["salida", "baja", "préstamo"].includes(tipoMovimientoSeleccionado) &&
        (tieneCaracteristicas ? (
          <Controller
            control={control}
            name="codigos"
            render={({ field }) => (
              <div className="space-y-2">
                <label className="font-semibold">Selecciona Códigos</label>
                {codigosDisponibles.map((codigo, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      value={codigo}
                      checked={field.value?.includes(codigo)}
                      onChange={(e) => {
                        const updated = e.target.checked
                          ? [...(field.value ?? []), codigo]
                          : (field.value ?? []).filter((c) => c !== codigo);
                        field.onChange(updated);
                      }}
                    />
                    <span>{codigo}</span>
                  </div>
                ))}
              </div>
            )}
          />
        ) : (
          <Input
            label="Cantidad"
            type="number"
            {...register("cantidad", { valueAsNumber: true })}
            isInvalid={!!errors.cantidad}
            errorMessage={errors.cantidad?.message}
          />
        ))}

      {tipoMovimientoSeleccionado === "ingreso" && (
        <Controller
          control={control}
          name="codigos"
          render={({ field }) => (
            <div className="space-y-2">
              <label className="font-semibold">Ingresar Códigos Nuevos</label>
              {(field.value ?? [""])?.map((codigo, index) => (
                <div key={index} className="flex gap-2 items-center">
                  <Input
                    value={codigo}
                    onChange={(e) => {
                      const updated = [...(field.value ?? [])];
                      updated[index] = e.target.value;
                      field.onChange(updated);
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const updated = [...(field.value ?? [])];
                      updated.splice(index, 1);
                      field.onChange(updated);
                    }}
                    className="text-red-500"
                  >
                    Eliminar
                  </button>
                </div>
              ))}
              <button
                type="button"
                className="text-blue-500 underline"
                onClick={() => field.onChange([...(field.value ?? []), ""])}
              >
                Añadir código
              </button>
            </div>
          )}
        />
      )}
    </Form>
  );
}
