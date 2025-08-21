import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { Form } from "@heroui/form";
import { Input } from "@heroui/input";
import { addToast, Select, SelectItem } from "@heroui/react";
import { usePrograma } from "@/hooks/programas/usePrograma";
import { FichaCreate, fichaCreateSchema } from "@/schemas/fichas";
import { useEffect, useState } from "react";
import Buton from "@/components/molecules/Button";
import { PlusCircleIcon } from "@heroicons/react/24/outline";
import Modal from "../modal";
import FormularioPrograma from "../Programas/FormRegister";

type FormularioProps = {
  addData: (ficha: FichaCreate) => Promise<void>;
  onClose: () => void;
  id: string;
};

export default function FormularioFichas({
  addData,
  onClose,
  id,
}: FormularioProps) {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FichaCreate>({
    resolver: zodResolver(fichaCreateSchema),
    mode: "onChange",
    defaultValues: {
      estado: true,
    },
  });

  const { programas, addPrograma } = usePrograma();

  const [showModal, setShowModal] = useState(false);

  const handleClose = () => setShowModal(false);

  const onSubmit = async (data: FichaCreate) => {
    try {
      await addData(data);
      onClose();
      addToast({
        title: "Registro Exitoso",
        description: "Ficha agregada correctamente",
        color: "success",
        timeout: 3000,
        shouldShowTimeoutProgress: true,
      });
    } catch (error) {
      console.error("Error al guardar la ficha:", error);
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
          label="Código de Ficha"
          type="text"
          placeholder="Código de Ficha"
          {...register("codigoFicha", { valueAsNumber: true })}
          isInvalid={!!errors.codigoFicha}
          errorMessage={errors.codigoFicha?.message}
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
          name="fkPrograma"
          render={({ field }) => {
            const [query, setQuery] = useState("");
            const [showOptions, setShowOptions] = useState(false);

            const filteredProgramas =
              programas?.filter(
                (p) =>
                  p.estado &&
                  p.nombre.toLowerCase().includes(query.toLowerCase())
              ) || [];

            const selectedPrograma = programas?.find(
              (p) => p.idPrograma === field.value
            );

            useEffect(() => {
              if (selectedPrograma) {
                setQuery(selectedPrograma.nombre);
              }
            }, [selectedPrograma?.idPrograma]);

            return (
              <div className="relative w-full flex items-start gap-2">
                <div className="w-full">
                  <Input
                    label="Programa"
                    placeholder="Selecciona un programa..."
                    value={query}
                    onChange={(e) => {
                      setQuery(e.target.value);
                      setShowOptions(true);
                      field.onChange(null);
                    }}
                    onFocus={() => setShowOptions(true)}
                    onBlur={() => setTimeout(() => setShowOptions(false), 150)}
                    isInvalid={!!errors.fkPrograma}
                    errorMessage={errors.fkPrograma?.message}
                  />

                  {showOptions && filteredProgramas.length > 0 && (
                    <div
                      className="absolute z-20 mt-1 w-80 max-h-52 overflow-auto 
              rounded-lg border border-gray-200 bg-white/80 
              shadow-lg transition-all duration-200 backdrop-blur-sm"
                    >
                      {filteredProgramas.map((programa) => (
                        <div
                          key={programa.idPrograma}
                          className="px-4 py-2 text-sm text-black-700 hover:bg-gray-300 cursor-pointer"
                          onMouseDown={(e) => {
                            e.preventDefault();
                            field.onChange(programa.idPrograma);
                            setQuery(programa.nombre);
                            setShowOptions(false);
                          }}
                        >
                          {programa.nombre}
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
        ModalTitle="Agregar Programa"
        isOpen={showModal}
        onOpenChange={handleClose}
      >
        <FormularioPrograma
          id="programa"
          onClose={() => setShowModal(false)}
          addData={async (data) => {
            await addPrograma(data);
          }}
        />
        <Buton form="programa" text="Guardar" type="submit" />
      </Modal>
    </>
  );
}
