import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { Form } from "@heroui/form";
import { Input } from "@heroui/input";
import { addToast, Select, SelectItem } from "@heroui/react";
import { programaCreate, programaCreateSchema } from "@/schemas/programas";
import { useAreas } from "@/hooks/areas/useAreas";
import { useEffect, useState } from "react";
import Buton from "@/components/molecules/Button";
import { PlusCircleIcon } from "@heroicons/react/24/outline";
import Modal from "../modal";
import FormularioArea from "../areas/FormRegister";

type FormularioProps = {
  addData: (data: programaCreate) => Promise<void>;
  onClose: () => void;
  id: string;
};

export default function FormularioPrograma({
  addData,
  onClose,
  id,
}: FormularioProps) {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<programaCreate>({
    resolver: zodResolver(programaCreateSchema),
    mode: "onChange",
    defaultValues: {
      estado: true,
    },
  });

  const { areas, addArea } = useAreas();

  const [showModal, setShowModal] = useState(false);

  const handleClose = () => setShowModal(false);

  const onSubmit = async (data: programaCreate) => {
    try {
      await addData(data);
      onClose();
      addToast({
        title: "Registro Exitoso",
        description: "Programa agregado correctamente",
        color: "success",
        timeout: 3000,
        shouldShowTimeoutProgress: true,
      });
    } catch (error) {
      console.error("Error al guardar el programa:", error);
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
          label="Nombre del programa"
          type="text"
          placeholder="Nombre"
          {...register("nombre")}
          isInvalid={!!errors.nombre}
          errorMessage={errors.nombre?.message}
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
    </>
  );
}
