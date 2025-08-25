import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { Form } from "@heroui/form";
import { Input } from "@heroui/input";
import { addToast, Select, SelectItem } from "@heroui/react";
import { useCentro } from "@/hooks/Centros/useCentros";
import { sedeCreate, sedeCreateSchema } from "@/schemas/sedes";
import { useEffect, useState } from "react";
import Buton from "@/components/molecules/Button";
import { PlusCircleIcon } from "@heroicons/react/24/outline";
import Modal from "../modal";
import FormCentros from "../Centros/FormCentros";

type FormularioSedeProps = {
  addData: (data: sedeCreate) => Promise<void>;
  onClose: () => void;
  id: string;
};

export default function FormularioSede({
  addData,
  onClose,
  id,
}: FormularioSedeProps) {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<sedeCreate>({
    resolver: zodResolver(sedeCreateSchema),
    mode: "onChange",
    defaultValues: {
      estado: true,
    },
  });

  const { centros, addCentro } = useCentro();

  const [showModal, setShowModal] = useState(false);

  const handleClose = () => setShowModal(false);

  const onSubmit = async (data: sedeCreate) => {
    try {
      await addData(data);
      onClose();
      addToast({
        title: "Registro Exitoso",
        description: "Sede agregada correctamente",
        color: "success",
        timeout: 3000,
        shouldShowTimeoutProgress: true,
      });
    } catch (error) {
      console.error("Error al guardar sede:", error);
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
          label="Nombre de la sede"
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
          name="fkCentro"
          render={({ field }) => {
            const [query, setQuery] = useState("");
            const [showOptions, setShowOptions] = useState(false);

            const filteredCentros =
              centros?.filter(
                (c) =>
                  c.estado &&
                  c.nombre.toLowerCase().includes(query.toLowerCase())
              ) || [];

            const selectedCentro = centros?.find(
              (c) => c.idCentro === field.value
            );

            useEffect(() => {
              if (selectedCentro) {
                setQuery(selectedCentro.nombre);
              }
            }, [selectedCentro?.idCentro]);

            return (
              <div className="relative w-full flex items-start gap-2">
                <div className="w-full">
                  <Input
                    label="Centro"
                    placeholder="Selecciona un centro..."
                    value={query}
                    onChange={(e) => {
                      setQuery(e.target.value);
                      setShowOptions(true);
                      field.onChange(null);
                    }}
                    onFocus={() => setShowOptions(true)}
                    onBlur={() => setTimeout(() => setShowOptions(false), 150)}
                    isInvalid={!!errors.fkCentro}
                    errorMessage={errors.fkCentro?.message}
                  />

                  {showOptions && filteredCentros.length > 0 && (
                    <div
                      className="absolute z-20 mt-1 w-80 max-h-52 overflow-auto 
              rounded-lg border border-gray-200 bg-white/80 
              shadow-lg transition-all duration-200 backdrop-blur-sm"
                    >
                      {filteredCentros.map((centro) => (
                        <div
                          key={centro.idCentro}
                          className="px-4 py-2 text-sm text-black-700 hover:bg-gray-300 cursor-pointer"
                          onMouseDown={(e) => {
                            e.preventDefault();
                            field.onChange(centro.idCentro);
                            setQuery(centro.nombre);
                            setShowOptions(false);
                          }}
                        >
                          {centro.nombre}
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
        ModalTitle="Agregar Centro"
        isOpen={showModal}
        onOpenChange={handleClose}
      >
        <FormCentros
          id="centro"
          onClose={() => setShowModal(false)}
          addData={async (data) => {
            await addCentro(data);
          }}
        />
        <Buton form="centro" text="Guardar" type="submit" />
      </Modal>
    </>
  );
}
