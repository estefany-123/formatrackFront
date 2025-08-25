import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { Form } from "@heroui/form";
import { Input } from "@heroui/input";
import { addToast, Select, SelectItem } from "@heroui/react";
import { useAreas } from "@/hooks/areas/useAreas";
import { useTipoSitio } from "@/hooks/TipoSitio/useTipoSitio";
import { sitioCreate, sitioCreateSchema } from "@/schemas/sitios";
import { useEffect, useState } from "react";
import { PlusCircleIcon } from "@heroicons/react/24/outline";
import Buton from "@/components/molecules/Button";
import Modal from "../modal";
import FormularioArea from "../areas/FormRegister";
import FormTipos from "../TiposSitio/FormTipos";

type FormularioProps = {
  addData: (data: sitioCreate) => Promise<void>;
  onClose: () => void;
  id: string;
};

export default function FormularioSitio({
  addData,
  onClose,
  id,
}: FormularioProps) {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<sitioCreate>({
    resolver: zodResolver(sitioCreateSchema),
    mode: "onChange",
    defaultValues: {
      estado: true,
    },
  });

  const { areas, addArea } = useAreas();
  const { tipos, addTipo } = useTipoSitio();

  const [showModal, setShowModal] = useState(false);
  const [showModalTipoSitio, setShowModalTipoSitio] = useState(false);

  const handleClose = () => setShowModal(false);
  const handleCloseTipoSitio = () => setShowModalTipoSitio(false);

  const onSubmit = async (data: sitioCreate) => {
    try {
      await addData(data);
      onClose();
      addToast({
        title: "Registro Exitoso",
        description: "Sitio agregado correctamente",
        color: "success",
        timeout: 3000,
        shouldShowTimeoutProgress: true,
      });
    } catch (error) {
      console.error("Error al guardar sitio:", error);
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
          label="Nombre del sitio"
          type="text"
          placeholder="Nombre"
          {...register("nombre")}
          isInvalid={!!errors.nombre}
          errorMessage={errors.nombre?.message}
        />

        <Input
          label="Persona encargada"
          type="text"
          placeholder="Encargado"
          {...register("personaEncargada")}
          isInvalid={!!errors.personaEncargada}
          errorMessage={errors.personaEncargada?.message}
        />

        <Input
          label="Ubicación"
          type="text"
          placeholder="Ubicación"
          {...register("ubicacion")}
          isInvalid={!!errors.ubicacion}
          errorMessage={errors.ubicacion?.message}
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

        <Controller
          control={control}
          name="fkArea"
          render={({ field }) => {
            const [query, setQuery] = useState("");
            const [showOptions, setShowOptions] = useState(false);

            const filteredAreas =
              areas?.filter(
                (a) =>
                  a.estado &&
                  a.nombre.toLowerCase().includes(query.toLowerCase())
              ) || [];

            const selectedArea = areas?.find((a) => a.idArea === field.value);

            useEffect(() => {
              if (selectedArea) {
                setQuery(selectedArea.nombre);
              }
            }, [selectedArea?.idArea]);

            return (
              <div className="relative w-full flex items-start gap-2">
                <div className="w-full">
                  <Input
                    label="Área"
                    placeholder="Selecciona un área..."
                    value={query}
                    onChange={(e) => {
                      setQuery(e.target.value);
                      setShowOptions(true);
                      field.onChange(null);
                    }}
                    onFocus={() => setShowOptions(true)}
                    onBlur={() => setTimeout(() => setShowOptions(false), 150)}
                    isInvalid={!!errors.fkArea}
                    errorMessage={errors.fkArea?.message}
                  />

                  {showOptions && filteredAreas.length > 0 && (
                    <div
                      className="absolute z-20 mt-1 w-80 max-h-52 overflow-auto 
              rounded-lg border border-gray-200 bg-white/80 
              shadow-lg transition-all duration-200 backdrop-blur-sm"
                    >
                      {filteredAreas.map((area) => (
                        <div
                          key={area.idArea}
                          className="px-4 py-2 text-sm text-black-700 hover:bg-gray-300 cursor-pointer"
                          onMouseDown={(e) => {
                            e.preventDefault();
                            field.onChange(area.idArea);
                            setQuery(area.nombre);
                            setShowOptions(false);
                          }}
                        >
                          {area.nombre}
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
          name="fkTipoSitio"
          render={({ field }) => {
            const [query, setQuery] = useState("");
            const [showOptions, setShowOptions] = useState(false);

            const filteredTiposSitio =
              tipos?.filter(
                (tipo) =>
                  tipo.estado &&
                  tipo.nombre.toLowerCase().includes(query.toLowerCase())
              ) || [];

            const selectedTipoSitio = tipos?.find(
              (tipo) => tipo.idTipo === field.value
            );

            useEffect(() => {
              if (selectedTipoSitio) {
                setQuery(selectedTipoSitio.nombre);
              }
            }, [selectedTipoSitio?.idTipo]);

            return (
              <div className="relative w-full flex items-start gap-2">
                <div className="w-full">
                  <Input
                    label="Tipo de Sitio"
                    placeholder="Selecciona un tipo de sitio..."
                    value={query}
                    onChange={(e) => {
                      setQuery(e.target.value);
                      setShowOptions(true);
                      field.onChange(null);
                    }}
                    onFocus={() => setShowOptions(true)}
                    onBlur={() => setTimeout(() => setShowOptions(false), 150)}
                    isInvalid={!!errors.fkTipoSitio}
                    errorMessage={errors.fkTipoSitio?.message}
                  />

                  {showOptions && filteredTiposSitio.length > 0 && (
                    <div
                      className="absolute z-20 mt-1 w-80 max-h-52 overflow-auto 
              rounded-lg border border-gray-200 bg-white/80 
              shadow-lg transition-all duration-200 backdrop-blur-sm"
                    >
                      {filteredTiposSitio.map((tipo) => (
                        <div
                          key={tipo.idTipo}
                          className="px-4 py-2 text-sm text-black-700 hover:bg-gray-300 cursor-pointer"
                          onMouseDown={(e) => {
                            e.preventDefault();
                            field.onChange(tipo.idTipo);
                            setQuery(tipo.nombre);
                            setShowOptions(false);
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
                  onPress={() => setShowModalTipoSitio(true)}
                >
                  <PlusCircleIcon />
                </Buton>
              </div>
            );
          }}
        />
      </Form>
      <Modal
        ModalTitle="Agregar Area"
        isOpen={showModal}
        onOpenChange={handleClose}
      >
        <FormularioArea
          id="area"
          onClose={() => setShowModal(false)}
          addData={async (data) => {
            await addArea(data);
          }}
        />
        <Buton form="area" text="Guardar" type="submit" />
      </Modal>
      <Modal
        ModalTitle="Agregar Tipo Sitio"
        isOpen={showModalTipoSitio}
        onOpenChange={handleCloseTipoSitio}
      >
        <FormTipos
          id="tipo"
          onClose={() => setShowModalTipoSitio(false)}
          addData={async (data) => {
            await addTipo(data);
          }}
        />
        <Buton form="tipo" text="Guardar" type="submit" />
      </Modal>
    </>
  );
}
