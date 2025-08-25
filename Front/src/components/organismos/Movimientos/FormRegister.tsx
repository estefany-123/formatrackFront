import { Form } from "@heroui/form";
import { addToast, Input, Select, SelectItem } from "@heroui/react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUsuario } from "@/hooks/Usuarios/useUsuario";
import { useTipoMovimiento } from "@/hooks/TiposMovimento/useTipoMovimiento";
import { useInventario } from "@/hooks/Inventarios/useInventario";
import { useSitios } from "@/hooks/sitios/useSitios";
import { useEffect, useState } from "react";
import { MovimientoCreate, MovimientoCreateSchema } from "@/schemas/Movimento";
import { mapMovimiento } from "@/utils/MapMovimientos";
import { MovimientoPostData } from "@/axios/Movimentos/postMovimiento";
import Buton from "@/components/molecules/Button";
import { PlusCircleIcon } from "@heroicons/react/24/outline";
import Modal from "../modal";
import FormularioTiposMovimiento from "../TiposMovimiento/FormRegister";
import FormularioU from "../Usuarios/FormRegister";
import FormularioInventario from "../Inventarios/FormRegister";
import FormularioSitio from "../Sitios/FormRegister";
import { useMovimiento } from "@/hooks/Movimientos/useMovimiento";
import { getCodigosDisponiblesParaDevolucion } from "@/axios/Movimentos/getCodigodDevolver";

type FormularioProps = {
  addData: (movimiento: MovimientoPostData) => Promise<void>;
  onClose: () => void;
  id: string;
};

type CodigoDisponible = {
  idCodigoInventario: number;
  codigo: string;
  uso: boolean;
  fkMovimiento:number
};

export default function Formulario({ onClose, id }: FormularioProps) {
  const {
    control,
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<MovimientoCreate>({
    resolver: zodResolver(MovimientoCreateSchema),
    mode: "onChange",
    defaultValues: {
      cantidad: 0,
      estado: true,
      aceptado: false,
      enProceso: true,
      cancelado: false,
      devolutivo: false,
      noDevolutivo: true,
      horaIngreso: "20:00",
      horaSalida: "20:00",
      fechaDevolucion: undefined,
      lugarDestino: undefined,
      codigos: [],
    },
  });

  const { users, addUser } = useUsuario();
  const { addMovimiento } = useMovimiento();


  const { tipos, addTipoMovimiento } = useTipoMovimiento();
  const { sitios, addSitio } = useSitios();
  const { inventarios, addInventario } = useInventario();
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
  const [codigosDisponibles, setCodigosDisponibles] = useState<
    CodigoDisponible[]
  >([]);
  // console.log("Códigos disponibles que llegan del inventario:", inventarios?.codigos);
  //modales
  const [showModal, setShowModal] = useState(false);
  const [showModalTipo, setShowModalTipo] = useState(false);
  const [showModalSitio, setShowModalSitio] = useState(false);
  const [showModalInventario, setShowModalInventario] = useState(false);

  const onSubmit = async (data: MovimientoCreate) => {
    const payload = {
      ...mapMovimiento(data),
      codigos: data.codigos?.map((c) => c.trim()),
      horaIngreso: data.horaIngreso || undefined,
      horaSalida: data.horaSalida || undefined,
      fechaDevolucion: data.fechaDevolucion
        ? new Date(data.fechaDevolucion)
        : undefined,
    };

    // Validación de códigos obligatorios en algunos tipos de movimiento
    if (
      tipoMovimientoSeleccionado &&
      ["salida", "baja", "préstamo"].includes(tipoMovimientoSeleccionado) &&
      tieneCaracteristicas &&
      (!payload.codigos || payload.codigos.length === 0)
    ) {
      addToast({
        title: "Error",
        description: "Debes seleccionar al menos un código",
        color: "danger",
        timeout: 3000,
      });
      return;
    }

    console.log("🚀 Enviando payload al backend:", payload);

    try {
      const res = await addMovimiento(payload);
      console.log("✅ Respuesta del servidor:", res);

      onClose();
      addToast({
        title: "Registro Exitoso",
        description: "Movimiento agregado correctamente",
        color: "success",
        timeout: 3000,
        shouldShowTimeoutProgress: true,
      });
    } catch (error: any) {
      const campo = error?.response?.data?.campo;
      const mensaje = error?.response?.data?.message;

      console.log("🔍 Error completo:", error);
      console.log("🔍 Error response:", error?.response?.data);

      let descripcion;

      if (Array.isArray(mensaje)) {
        descripcion = mensaje.join(", ");
      } else if (typeof mensaje === "string") {
        descripcion = mensaje;
      } else {
        descripcion =
          "Uno de los códigos ya se encuentra registrado en el inventario";
      }

      // Si es un error de códigos, marcamos el input con setError
      if (campo === "codigos") {
        setError("codigos", {
          type: "manual",
          message: descripcion,
        });
      }

      const esErrorCodigos =
        campo === "codigos" ||
        (typeof descripcion === "string" &&
          (descripcion.toLowerCase().includes("códigos ya existen") ||
            descripcion.toLowerCase().includes("no están disponibles")));

      addToast({
        title: esErrorCodigos
          ? "Códigos duplicados o no disponibles"
          : "Error al guardar movimiento",
        description: descripcion,
        color: esErrorCodigos ? "warning" : "danger",
        timeout: 4000,
        shouldShowTimeoutProgress: true,
      });
    }
  };

  console.log("Errores", errors);

useEffect(() => {
  if (!inventarioSeleccionado) return;

  // Si es una devolución, usamos el endpoint para obtener solo los códigos prestados
  if (tipoMovimientoSeleccionado?.toLowerCase() === 'devolucion') {
    getCodigosDisponiblesParaDevolucion(inventarioSeleccionado)
      .then(codigos => {
        setCodigosDisponibles(codigos);
        setTieneCaracteristicas(codigos.length > 0);
      })
      .catch(err => {
        console.error("Error obteniendo códigos para devolución:", err);
        setCodigosDisponibles([]);
        setTieneCaracteristicas(false);
      });
  } else {
    // Para otros tipos de movimiento, filtramos localmente los códigos que no están en uso
    const inv = inventarios?.find(i => i.idInventario === inventarioSeleccionado);
    if (!inv) return;

    const codigosFiltrados = (inv.codigos || []).filter(c => !c.uso && !c.fkMovimiento);
    setCodigosDisponibles(codigosFiltrados);
    setTieneCaracteristicas(codigosFiltrados.length > 0);
  }
}, [inventarioSeleccionado, tipoMovimientoSeleccionado, inventarios]);

  console.log("Inventario:", inventarioSeleccionado);
  console.log("Tiene características?", tieneCaracteristicas);
  console.log("Códigos disponibles:", codigosDisponibles);
  return (
    <>
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
          label="Destino"
          type="text"
          {...register("lugarDestino")}
          isInvalid={!!errors.lugarDestino}
          errorMessage={errors.lugarDestino?.message}
        />

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
          render={({ field }) => {
            const [queryUsuario, setQueryUsuario] = useState("");
            const [showOptionsUsuario, setShowOptionsUsuario] = useState(false);

            const filteredUsuarios = (users ?? []).filter((u) =>
              u.nombre.toLowerCase().includes(queryUsuario.toLowerCase())
            );

            const selectedUsuario = users?.find(
              (u) => u.idUsuario === field.value
            );

            useEffect(() => {
              if (selectedUsuario) {
                setQueryUsuario(selectedUsuario.nombre);
              }
            }, [selectedUsuario?.idUsuario]);

            return (
              <div className="relative w-full flex items-start gap-2">
                <div className="w-full">
                  <Input
                    label="Usuario"
                    placeholder="Selecciona un usuario..."
                    value={queryUsuario}
                    onChange={(e) => {
                      setQueryUsuario(e.target.value);
                      setShowOptionsUsuario(true);
                      field.onChange(null);
                    }}
                    onFocus={() => setShowOptionsUsuario(true)}
                    onBlur={() =>
                      setTimeout(() => setShowOptionsUsuario(false), 150)
                    }
                    isInvalid={!!errors.fkUsuario}
                    errorMessage={errors.fkUsuario?.message}
                  />
                  {showOptionsUsuario && filteredUsuarios.length > 0 && (
                    <div className="absolute z-20 mt-1 w-80 max-h-52 overflow-auto rounded-lg border border-gray-200 bg-white/80 shadow-lg transition-all duration-200 backdrop-blur-sm">
                      {filteredUsuarios.map((usuario) => (
                        <div
                          key={usuario.idUsuario}
                          className="px-4 py-2 text-sm text-black-700 hover:bg-gray-300 cursor-pointer"
                          onMouseDown={(e) => {
                            e.preventDefault();
                            field.onChange(usuario.idUsuario);
                            setQueryUsuario(usuario.nombre);
                            setShowOptionsUsuario(false);
                          }}
                        >
                          {usuario.nombre}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <Buton
                  type="button"
                  className="m-2 w-10 h-10 !px-0 !min-w-0 rounded-xl"
                  onPress={() => setShowModal(true)}
                >
                  <PlusCircleIcon />
                </Buton>
              </div>
            );
          }}
        />

        <Controller
          control={control}
          name="fkTipoMovimiento"
          render={({ field }) => {
            const [queryTipo, setQueryTipo] = useState("");
            const [showOptionsTipo, setShowOptionsTipo] = useState(false);

            const filteredTipos = (tipos ?? []).filter((t) =>
              t.nombre.toLowerCase().includes(queryTipo.toLowerCase())
            );

            const selectedTipo = tipos?.find((t) => t.idTipo === field.value);

            useEffect(() => {
              if (selectedTipo) {
                setQueryTipo(selectedTipo.nombre);
              }
            }, [selectedTipo?.idTipo]);

            return (
              <div className="relative w-full flex items-start gap-2">
                <div className="w-full">
                  <Input
                    label="Tipo de Movimiento"
                    placeholder="Selecciona un tipo..."
                    value={queryTipo}
                    onChange={(e) => {
                      setQueryTipo(e.target.value);
                      setShowOptionsTipo(true);
                      field.onChange(null);
                    }}
                    onFocus={() => setShowOptionsTipo(true)}
                    onBlur={() =>
                      setTimeout(() => setShowOptionsTipo(false), 150)
                    }
                    isInvalid={!!errors.fkTipoMovimiento}
                    errorMessage={errors.fkTipoMovimiento?.message}
                  />
                  {showOptionsTipo && filteredTipos.length > 0 && (
                    <div className="absolute z-20 mt-1 w-80 max-h-52 overflow-auto rounded-lg border border-gray-200 bg-white/80 shadow-lg transition-all duration-200 backdrop-blur-sm">
                      {filteredTipos.map((tipo) => (
                        <div
                          key={tipo.idTipo}
                          className="px-4 py-2 text-sm text-black-700 hover:bg-gray-300 cursor-pointer"
                          onMouseDown={(e) => {
                            e.preventDefault();
                            field.onChange(tipo.idTipo);
                            setQueryTipo(tipo.nombre);
                            setShowOptionsTipo(false);
                            setTipoMovimientoSeleccionado(
                              tipo?.nombre.toLowerCase() ?? null
                            );
                          }}
                        >
                          {tipo.nombre}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <Buton
                  type="button"
                  className="m-2 w-10 h-10 !px-0 !min-w-0 rounded-xl"
                  onPress={() => setShowModalTipo(true)}
                >
                  <PlusCircleIcon />
                </Buton>
              </div>
            );
          }}
        />

        {tipoMovimientoSeleccionado === "ingreso" ? (
          <Input
            label="Hora de Ingreso"
            type="time"
            {...register("horaIngreso")}
            isInvalid={!!errors.horaIngreso}
            errorMessage={errors.horaIngreso?.message}
          />
        ) : tipoMovimientoSeleccionado &&
          ["salida", "baja", "préstamo"].includes(
            tipoMovimientoSeleccionado
          ) ? (
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
          name="fkSitio"
          render={({ field }) => {
            const [querySitio, setQuerySitio] = useState("");
            const [showOptionsSitio, setShowOptionsSitio] = useState(false);

            const filteredSitios = (sitios ?? []).filter((s) =>
              s.nombre.toLowerCase().includes(querySitio.toLowerCase())
            );

            const selectedSitio = sitios?.find(
              (s) => s.idSitio === field.value
            );

            useEffect(() => {
              if (selectedSitio) {
                setQuerySitio(selectedSitio.nombre);
              }
            }, [selectedSitio?.idSitio]);

            return (
              <div className="relative w-full flex items-start gap-2">
                <div className="w-full">
                  <Input
                    label="Sitio"
                    placeholder="Selecciona un sitio..."
                    value={querySitio}
                    onChange={(e) => {
                      setQuerySitio(e.target.value);
                      setShowOptionsSitio(true);
                      field.onChange(null);
                    }}
                    onFocus={() => setShowOptionsSitio(true)}
                    onBlur={() =>
                      setTimeout(() => setShowOptionsSitio(false), 150)
                    }
                    isInvalid={!!errors.fkSitio}
                    errorMessage={errors.fkSitio?.message}
                  />
                  {showOptionsSitio && filteredSitios.length > 0 && (
                    <div className="absolute z-20 mt-1 w-80 max-h-52 overflow-auto rounded-lg border border-gray-200 bg-white/80 shadow-lg transition-all duration-200 backdrop-blur-sm">
                      {filteredSitios.map((sitio) => (
                        <div
                          key={sitio.idSitio}
                          className="px-4 py-2 text-sm text-black-700 hover:bg-gray-300 cursor-pointer"
                          onMouseDown={(e) => {
                            e.preventDefault();
                            const sitioId = sitio.idSitio;
                            field.onChange(sitioId);
                            setQuerySitio(sitio.nombre);
                            setShowOptionsSitio(false);
                            setSitioSeleccionado(sitioId ?? null);
                          }}
                        >
                          {sitio.nombre}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <Buton
                  type="button"
                  className=" m-2 w-10 h-10 !px-0 !min-w-0 rounded-xl"
                  onPress={() => setShowModalSitio(true)}
                >
                  <PlusCircleIcon />
                </Buton>
              </div>
            );
          }}
        />

        {sitioSeleccionado && (
          <Controller
            control={control}
            name="fkInventario"
            render={({ field }) => {
              const [query, setQuery] = useState("");
              const [showOptions, setShowOptions] = useState(false);

              const inventariosFiltrados =
                (inventarios ?? [])
                  .filter((i) => i.fkSitio.idSitio === sitioSeleccionado)
                  .filter((i) => i.estado === true)
                  .filter((i) =>
                    i.fkElemento?.nombre
                      ?.toLowerCase()
                      .includes(query.toLowerCase())
                  ) || [];

              const inventarioSeleccionado = (inventarios ?? []).find(
                (i) => i.idInventario === field.value
              );

              useEffect(() => {
                if (inventarioSeleccionado) {
                  setQuery(inventarioSeleccionado.fkElemento?.nombre ?? "");
                }
              }, [inventarioSeleccionado?.idInventario]);

              return (
                <div className="relative w-full flex items-start gap-2">
                  <div className="w-full">
                    <Input
                      label="Elemento del Inventario"
                      placeholder="Escribe para buscar..."
                      value={query}
                      onChange={(e) => {
                        setQuery(e.target.value);
                        setShowOptions(true);
                        field.onChange(null);
                      }}
                      onFocus={() => setShowOptions(true)}
                      onBlur={() =>
                        setTimeout(() => setShowOptions(false), 150)
                      }
                      isInvalid={!!errors.fkInventario}
                      errorMessage={errors.fkInventario?.message}
                    />

                    {showOptions && inventariosFiltrados.length > 0 && (
                      <div
                        className="absolute z-20 mt-1 w-full max-h-52 overflow-auto 
                  rounded-lg border border-gray-200 bg-white/80 
                  shadow-lg transition-all duration-200 backdrop-blur-sm"
                      >
                        {inventariosFiltrados.map((inv) => (
                          <div
                            key={inv.idInventario}
                            className="px-4 py-2 text-sm text-black hover:bg-gray-300 cursor-pointer"
                            onMouseDown={(e) => {
                              e.preventDefault();
                              field.onChange(inv.idInventario);
                              setQuery(inv.fkElemento?.nombre ?? "");
                              setShowOptions(false);
                              setInventarioSeleccionado(
                                inv.idInventario ?? null
                              );

                              const disponibles =
                                inv.codigos?.filter((c) => !c.uso) || [];
                              setCodigosDisponibles(
                                disponibles.map((c) => ({
                                  idCodigoInventario: c.idCodigoInventario,
                                  codigo: c.codigo,
                                  uso: c.uso,
                                  fkMovimiento:c.fkMovimiento
                                }))
                              );
                              setTieneCaracteristicas(disponibles.length > 0);
                            }}
                          >
                            {inv.fkElemento?.nombre ?? "Elemento sin nombre"}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <Buton
                    type="button"
                    className="m-2 w-10 h-10 !px-0 !min-w-0 rounded-xl"
                    onPress={() => setShowModalInventario(true)}
                  >
                    <PlusCircleIcon />
                  </Buton>
                </div>
              );
            }}
          />
        )}

        {inventarioSeleccionado &&
          tipoMovimientoSeleccionado &&
          [
            "salida",
            "baja",
            "préstamo",
            "prestamo",
            "devolución",
            "devolucion",
          ].includes(tipoMovimientoSeleccionado) && (
            <>
              {tieneCaracteristicas ? (
                <Controller
                  control={control}
                  name="codigos"
                  render={({ field }) => {
                    const codigosFiltrados = codigosDisponibles.filter(
                      (codigo) => {
                        if (
                          tipoMovimientoSeleccionado?.toLowerCase() ===
                          "devolucion"
                        )
                          return codigo.uso === true;
                        return codigo.uso === false;
                      }
                    );

                    console.log("filtrado:", codigosFiltrados);
                    return (
                      <div className="space-y-2">
                        <label className="font-semibold">
                          Selecciona Códigos
                        </label>
                        {codigosFiltrados.map((codigoObj) => (
                          <div
                            key={codigoObj.idCodigoInventario}
                            className="flex items-center gap-2"
                          >
                            <input
                              type="checkbox"
                              value={codigoObj.codigo}
                              checked={field.value?.includes(codigoObj.codigo)}
                              onChange={(e) => {
                                const updated = e.target.checked
                                  ? [...(field.value ?? []), codigoObj.codigo]
                                  : (field.value ?? []).filter(
                                      (c) => c !== codigoObj.codigo
                                    );
                                field.onChange(updated);
                              }}
                            />
                            <span>{codigoObj.codigo}</span>
                          </div>
                        ))}
                      </div>
                    );
                  }}
                />
              ) : (
                <Input
                  label="Cantidad"
                  type="number"
                  {...register("cantidad", { valueAsNumber: true })}
                  isInvalid={!!errors.cantidad}
                  errorMessage={errors.cantidad?.message}
                />
              )}
            </>
          )}

        {tipoMovimientoSeleccionado === "ingreso" && (
          <>
            {tieneCaracteristicas ? (
              <Controller
                control={control}
                name="codigos"
                render={({ field }) => (
                  <div className="space-y-3">
                    <h3 className="text-base font-semibold text-gray-800">
                      Ingresar Códigos Nuevos
                    </h3>

                    <div className="space-y-2">
                      {(field.value ?? [""]).map((codigo, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 bg-gray-50 p-2 rounded-lg border border-gray-200"
                        >
                          <Input
                            className="flex-1"
                            placeholder={`Código ${index + 1}`}
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
                            className="px-3 py-1 text-sm rounded-md bg-red-100 text-red-600 hover:bg-red-200 transition"
                          >
                            Eliminar
                          </button>
                        </div>
                      ))}
                    </div>

                    <div>
                      <button
                        type="button"
                        onClick={() =>
                          field.onChange([...(field.value ?? []), ""])
                        }
                        className="px-4 py-2 mt-2 text-sm rounded-md bg-blue-100 text-blue-600 hover:bg-blue-200 transition"
                      >
                        + Añadir otro código
                      </button>
                    </div>
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
            )}
          </>
        )}
      </Form>

      <Modal
        ModalTitle="Agregar Tipo de Movimiento"
        isOpen={showModalTipo}
        onOpenChange={() => setShowModalTipo(false)}
      >
        <FormularioTiposMovimiento
          id="tipoMovimiento"
          onClose={() => setShowModalTipo(false)}
          addData={async (data) => {
            await addTipoMovimiento(data);
          }}
        />
        <Buton form="tipoMovimiento" text="Guardar" type="submit" />
      </Modal>

      <Modal
        ModalTitle="Agregar Usuario"
        isOpen={showModal}
        onOpenChange={() => setShowModal(false)}
      >
        <FormularioU
          id="usuario"
          onClose={() => setShowModal(false)}
          addData={async (data) => {
            await addUser(data);
          }}
        />
        <Buton form="usuario" text="Guardar" type="submit" />
      </Modal>

      {/* Modal: Inventario */}
      <Modal
        ModalTitle="Agregar Inventario"
        isOpen={showModalInventario}
        onOpenChange={() => setShowModalInventario(false)}
      >
        <FormularioInventario
          id="inventario"
          onClose={() => setShowModalInventario(false)}
          addData={async (data) => {
            await addInventario(data);
          }}
          idSitio={0}
        />
        <Buton form="inventario" text="Guardar" type="submit" />
      </Modal>

      <Modal
        ModalTitle="Agregar Sitio"
        isOpen={showModalSitio}
        onOpenChange={() => setShowModalSitio(false)}
      >
        <FormularioSitio
          id="sitio"
          onClose={() => setShowModalSitio(false)}
          addData={async (data) => {
            await addSitio(data);
          }}
        />
        <Buton form="sitio" text="Guardar" type="submit" />
      </Modal>
    </>
  );
}
