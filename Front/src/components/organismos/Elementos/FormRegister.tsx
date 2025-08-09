import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUnidad } from "@/hooks/UnidadesMedida/useUnidad";
import { useCategoria } from "@/hooks/Categorias/useCategorias";
import { useCaracteristica } from "@/hooks/Caracteristicas/useCaracteristicas";
import { Form } from "@heroui/form";
import { addToast, Checkbox, Input, Select, SelectItem } from "@heroui/react";
import { ElementoCreate, ElementoCreateSchema } from "@/schemas/Elemento";
import { useEffect, useState } from "react";
import Buton from "@/components/molecules/Button";
import { PlusCircleIcon } from "@heroicons/react/24/outline";
import Modal from "../modal";
import FormularioUnidades from "../UnidadesMedida/FormRegister";
import FormCategorias from "../Categorias/FormCategorias";
import FormularioCaracteristicas from "../Caracteristicas/FormRegister";

type FormularioProps = {
  addData: (elemento: ElementoCreate) => Promise<{ idElemento: number }>;
  onClose: () => void;
  id: string;
};

export default function FormularioElementos({
  addData,
  onClose,
  id,
}: FormularioProps) {
  const {
    control,
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ElementoCreate>({
    resolver: zodResolver(ElementoCreateSchema),
    mode: "onChange",
    defaultValues: {
      estado: true,
    },
  });

  const { unidades, addUnidad } = useUnidad();
  const { categorias, addCategoria } = useCategoria();
  const { caracteristicas, addCaracteristica } = useCaracteristica();

  const tipoElemento = watch("tipoElemento");
  const [tieneCaracteristica, setTieneCaracteristica] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [showModalCategoria, setShowModalCategoria] = useState(false);
  const [showModalCaracteristica, setShowModalCaracteristica] = useState(false);

  const handleClose = () => setShowModal(false);
  const handleCloseCategoria = () => setShowModalCategoria(false);
  const handleCloseCaracteristica = () => setShowModalCaracteristica(false);

  const onSubmit = async (data: ElementoCreate) => {
    console.log("Datos enviados:", data);
    try {
      await addData({
        ...data,
        estado: data.estado,
        tipoElemento: data.tipoElemento as "perecedero" | "noPerecedero",
        fkCaracteristica: tieneCaracteristica
          ? data.fkCaracteristica
          : undefined,
      });
      console.log("Esto es lo que manda imagen",data.imagen)
      onClose();
      addToast({
        title: "Registro Exitoso",
        description: "Elemento agregado correctamente",
        color: "success",
        timeout: 3000,
        shouldShowTimeoutProgress: true,
      });
    } catch (error) {
      console.error("Error al guardar el elemento:", error);
    }
  };
  console.log("Errores", errors);
  return (
    <>
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
                setValue("noPerecedero", value === "noPerecedero");

                console.log("💡 Valores actuales del formulario:", value);
              }}
              isInvalid={!!errors.tipoElemento}
              errorMessage={errors.tipoElemento?.message}
            >
              <SelectItem key="perecedero">Perecedero</SelectItem>
              <SelectItem key="noPerecedero">No Perecedero</SelectItem>
            </Select>
          )}
        />

        {tipoElemento === "perecedero" && (
          <Controller
            control={control}
            name="fechaVencimiento"
            render={({ field }) => (
              <Input
                type="date"
                label="Fecha de Vencimiento"
                {...field}
                isInvalid={!!errors.fechaVencimiento}
                errorMessage={errors.fechaVencimiento?.message}
              />
            )}
          />
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
              isInvalid={!!errors.estado}
              errorMessage={errors.estado?.message}
              isDisabled
              defaultSelectedKeys={["true"]}
            >
              <SelectItem key="true">Activo</SelectItem>
              <SelectItem key="false">Inactivo</SelectItem>
            </Select>
          )}
        />

        <Input
          label="Imagen"
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0] ?? undefined;
            setValue("imagen", file);
          }}
        />

        <Controller
          control={control}
          name="fkUnidadMedida"
          render={({ field }) => {
            const [query, setQuery] = useState("");
            const [showOptions, setShowOptions] = useState(false);

            const filteredUnidades =
              unidades?.filter(
                (u) =>
                  u.estado &&
                  u.nombre.toLowerCase().includes(query.toLowerCase())
              ) || [];

            const selectedUnidad = unidades?.find(
              (u) => u.idUnidad === field.value
            );

            useEffect(() => {
              if (selectedUnidad) {
                setQuery(selectedUnidad.nombre);
              }
            }, [selectedUnidad?.idUnidad]);

            return (
              <div className="relative w-full flex items-start gap-2">
                <div className="w-full">
                  <Input
                    label="Unidad"
                    placeholder="Selecciona una unidad de medida..."
                    value={query}
                    onChange={(e) => {
                      setQuery(e.target.value);
                      setShowOptions(true);
                      field.onChange(null); // borra selección anterior si empieza a escribir
                    }}
                    onFocus={() => setShowOptions(true)}
                    onBlur={() => setTimeout(() => setShowOptions(false), 150)}
                    isInvalid={!!errors.fkUnidadMedida}
                    errorMessage={errors.fkUnidadMedida?.message}
                  />

                  {showOptions && filteredUnidades.length > 0 && (
                    <div
                      className="absolute z-20 mt-1 w-80 max-h-52 overflow-auto 
              rounded-lg border border-gray-200 bg-white/80 
              shadow-lg transition-all duration-200 backdrop-blur-sm"
                    >
                      {filteredUnidades.map((unidad) => (
                        <div
                          key={unidad.idUnidad}
                          className="px-4 py-2 text-sm text-black-700 hover:bg-gray-300 cursor-pointer"
                          onMouseDown={(e) => {
                            // evita que blur se dispare antes del onClick
                            e.preventDefault();
                            field.onChange(unidad.idUnidad);
                            setQuery(unidad.nombre);
                            setShowOptions(false);
                          }}
                        >
                          {unidad.nombre}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <Buton
                  type="button"
                  className="m-2 w-10 h-10 !px-0 !min-w-0 rounded-xl "
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
          name="fkCategoria"
          render={({ field }) => {
            const [query, setQuery] = useState("");
            const [showOptions, setShowOptions] = useState(false);

            const filteredCategorias =
              categorias?.filter(
                (c) =>
                  c.estado &&
                  c.nombre.toLowerCase().includes(query.toLowerCase())
              ) || [];

            const selectedCategoria = categorias?.find(
              (c) => c.idCategoria === field.value
            );

            useEffect(() => {
              if (selectedCategoria) {
                setQuery(selectedCategoria.nombre);
              }
            }, [selectedCategoria?.idCategoria]);

            return (
              <div className="relative w-full flex items-start gap-2">
                <div className="w-full">
                  <Input
                    label="Categoría"
                    placeholder="Selecciona una categoría..."
                    value={query}
                    onChange={(e) => {
                      setQuery(e.target.value);
                      setShowOptions(true);
                      field.onChange(null);
                    }}
                    onFocus={() => setShowOptions(true)}
                    onBlur={() => setTimeout(() => setShowOptions(false), 150)}
                    isInvalid={!!errors.fkCategoria}
                    errorMessage={errors.fkCategoria?.message}
                  />
                  {showOptions && filteredCategorias.length > 0 && (
                    <div className="absolute z-20 mt-1 w-80 max-h-52 overflow-auto rounded-lg border border-gray-200 bg-white/80 shadow-lg transition-all duration-200 backdrop-blur-sm">
                      {filteredCategorias.map((cat) => (
                        <div
                          key={cat.idCategoria}
                          className="px-4 py-2 text-sm text-black-700 hover:bg-gray-300 cursor-pointer"
                          onMouseDown={(e) => {
                            e.preventDefault();
                            field.onChange(cat.idCategoria);
                            setQuery(cat.nombre);
                            setShowOptions(false);
                          }}
                        >
                          {cat.nombre}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <Buton
                  type="button"
                  className="m-2 w-10 h-10 !px-0 !min-w-0 rounded-xl"
                  onPress={() => setShowModalCategoria(true)}
                >
                  <PlusCircleIcon />
                </Buton>
              </div>
            );
          }}
        />

        <Checkbox
          isSelected={tieneCaracteristica}
          onChange={(e) => setTieneCaracteristica(e.target.checked)}
          className="mb-2"
        >
          ¿Posee características?
        </Checkbox>

        {tieneCaracteristica && (
          <div className="flex items-end gap-2 w-full ">
            <div className="flex w-full">
              <Controller
                control={control}
                name="fkCaracteristica"
                render={({ field }) => {
                  const [query, setQuery] = useState("");
                  const [showOptions, setShowOptions] = useState(false);

                  const filteredCaracteristicas =
                    caracteristicas?.filter((c) =>
                      c.nombre?.toLowerCase().includes(query.toLowerCase())
                    ) || [];

                  const selectedCaracteristica = caracteristicas?.find(
                    (c) => c.idCaracteristica === field.value
                  );

                  useEffect(() => {
                    if (selectedCaracteristica) {
                      setQuery(selectedCaracteristica.nombre as string);
                    }
                  }, [selectedCaracteristica?.idCaracteristica]);

                  return (
                    <div className="relative w-full flex items-start gap-2">
                      <div className="w-full">
                        <Input
                          label="Característica"
                          placeholder="Selecciona una característica..."
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
                          isInvalid={!!errors.fkCaracteristica}
                          errorMessage={errors.fkCaracteristica?.message}
                        />

                        {showOptions && filteredCaracteristicas.length > 0 && (
                          <div
                            className="absolute z-20 mt-1 w-80 max-h-52 overflow-auto 
              rounded-lg border border-gray-200 bg-white/80 
              shadow-lg transition-all duration-200 backdrop-blur-sm"
                          >
                            {filteredCaracteristicas.map((car) => (
                              <div
                                key={car.idCaracteristica}
                                className="px-4 py-2 text-sm text-black-700 hover:bg-gray-300 cursor-pointer"
                                onMouseDown={(e) => {
                                  e.preventDefault();
                                  field.onChange(car.idCaracteristica);
                                  setQuery(car.nombre as string);
                                  setShowOptions(false);
                                }}
                              >
                                {car.nombre}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                }}
              />
            </div>

            <Buton
              type="button"
              className="mb-3 w-10 h-10 !px-0 !min-w-0 rounded-xl"
              onPress={() => setShowModalCaracteristica(true)}
            >
              <PlusCircleIcon />
            </Buton>
          </div>
        )}
      </Form>
      <Modal
        ModalTitle="Agregar Unidad"
        isOpen={showModal}
        onOpenChange={handleClose}
      >
        <FormularioUnidades
          id="unidad"
          onClose={() => setShowModal(false)}
          addData={async (data) => {
            await addUnidad(data);
          }}
        />
        <Buton form="unidad" text="Guardar" type="submit" />
      </Modal>
      <Modal
        ModalTitle="Agregar Categoria"
        isOpen={showModalCategoria}
        onOpenChange={handleCloseCategoria}
      >
        <FormCategorias
          id="categoria"
          onClose={() => setShowModalCategoria(false)}
          addData={async (data) => {
            await addCategoria(data);
          }}
        />
        <Buton form="categoria" text="Guardar" type="submit" />
      </Modal>
      <Modal
        ModalTitle="Agregar Caracteristica"
        isOpen={showModalCaracteristica}
        onOpenChange={handleCloseCaracteristica}
      >
        <FormularioCaracteristicas
          id="caracteristica"
          onClose={() => setShowModal(false)}
          addData={async (data) => {
            await addCaracteristica(data);
          }}
        />
        <Buton form="caracteristica" text="Guardar" type="submit" />
      </Modal>
    </>
  );
}
