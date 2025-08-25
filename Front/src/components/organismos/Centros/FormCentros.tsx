import { Form } from "@heroui/form";
import { Centro, CentroSchema } from "@/schemas/Centro";
import { addToast, Input, Select, SelectItem } from "@heroui/react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMunicipio } from "@/hooks/Municipio/useMunicipio";
import { useEffect, useState } from "react";
import Buton from "@/components/molecules/Button";
import { PlusCircleIcon } from "@heroicons/react/24/outline";
import Modal from "../modal";
import FormMunicipios from "../Municipio/FormMunicipios";

type FormularioProps = {
  addData: (centros: Centro) => Promise<void>;
  onClose: () => void;
  id: string;
};

export default function FormCentros({ addData, onClose, id }: FormularioProps) {
  const {
    municipios,
    isLoading: loadingMuni,
    isError: errormuni,
    addMunicipio,
  } = useMunicipio();

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Centro>({
    resolver: zodResolver(CentroSchema),
    mode:"onChange",
    defaultValues: {
      estado: true,
    },
  });

  const [showModal, setShowModal] = useState(false);

  const handleClose = () => setShowModal(false);

  const onSubmit = async (data: Centro) => {
    try {
      await addData(data);
      onClose();
      addToast({
        title: "Registro Exitoso",
        description: "Centro agregado correctamente",
        color: "success",
        timeout: 3000,
        shouldShowTimeoutProgress: true,
      });
    } catch (error) {
      console.error("Error al guardar:", error);
    }
  };

  return (
    <>
      <Form
        id={id}
        onSubmit={handleSubmit(onSubmit)}
        className="w-full space-y-4"
      >
        <Input
          {...register("nombre")}
          label="Nombre"
          placeholder="Nombre"
          type="text"
          isInvalid={!!errors.nombre}
          errorMessage={errors.nombre?.message}
        />

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
              isDisabled
              defaultSelectedKeys={["true"]}
            >
              <SelectItem key="true">Activo</SelectItem>
              <SelectItem key="false">Inactivo</SelectItem>
            </Select>
          )}
        />

        {!loadingMuni && !errormuni && municipios && (
          <Controller
            control={control}
            name="fkMunicipio"
            render={({ field }) => {
              const [query, setQuery] = useState("");
              const [showOptions, setShowOptions] = useState(false);

              const filteredMunicipios =
                municipios?.filter(
                  (m) =>
                    m.estado &&
                    m.nombre.toLowerCase().includes(query.toLowerCase())
                ) || [];

              const selectedMunicipio = municipios?.find(
                (m) => m.idMunicipio === field.value
              );

              useEffect(() => {
                if (selectedMunicipio) {
                  setQuery(selectedMunicipio.nombre);
                }
              }, [selectedMunicipio?.idMunicipio]);

              return (
                <div className="relative w-full flex items-start gap-2">
                  <div className="w-full">
                    <Input
                      label="Municipio"
                      placeholder="Selecciona un municipio..."
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
                      isInvalid={!!errors.fkMunicipio}
                      errorMessage={errors.fkMunicipio?.message}
                    />

                    {showOptions && filteredMunicipios.length > 0 && (
                      <div
                        className="absolute z-20 mt-1 w-80 max-h-52 overflow-auto 
              rounded-lg border border-gray-200 bg-white/80 
              shadow-lg transition-all duration-200 backdrop-blur-sm"
                      >
                        {filteredMunicipios.map((municipio) => (
                          <div
                            key={municipio.idMunicipio}
                            className="px-4 py-2 text-sm text-black-700 hover:bg-gray-300 cursor-pointer"
                            onMouseDown={(e) => {
                              e.preventDefault();
                              field.onChange(municipio.idMunicipio);
                              setQuery(municipio.nombre);
                              setShowOptions(false);
                            }}
                          >
                            {municipio.nombre}
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
        )}
      </Form>
      <Modal
        ModalTitle="Agregar Municipio"
        isOpen={showModal}
        onOpenChange={handleClose}
      >
        <FormMunicipios
          id="municipio"
          onClose={() => setShowModal(false)}
          addData={async (data) => {
            await addMunicipio(data);
          }}
        />
        <Buton form="municipio" text="Guardar" type="submit" />
      </Modal>
    </>
  );
}
