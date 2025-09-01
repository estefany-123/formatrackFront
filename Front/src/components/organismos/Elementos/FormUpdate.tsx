import { Input } from "@heroui/input";
import { useForm } from "react-hook-form";
import { Form } from "@heroui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { addToast, Select, SelectItem } from "@heroui/react";
import { ElementoUpdateSchema, ElementoUpdate } from "@/schemas/Elemento";
import { useElemento } from "@/hooks/Elementos/useElemento";
import Buton from "@/components/molecules/Button";
import { useUnidad } from "@/hooks/UnidadesMedida/useUnidad";
import { useCategoria } from "@/hooks/Categorias/useCategorias";
import { useCaracteristica } from "@/hooks/Caracteristicas/useCaracteristicas";
import { PlusCircleIcon } from "@heroicons/react/24/outline";
import Modal from "../modal";
import FormularioUnidades from "../UnidadesMedida/FormRegister";
import FormCategorias from "../Categorias/FormCategorias";
import FormularioCaracteristicas from "../Caracteristicas/FormRegister";
import { useState } from "react";

type Props = {
  elementos: ElementoUpdate[];
  elementoId: number;
  id: string;
  onclose: () => void;
};

export const FormUpdate = ({ elementos, elementoId, id, onclose }: Props) => {
  const { updateElemento, getElementoById } = useElemento();
  const {
    unidades,
    isLoading: loadingUnidad,
    isError: errorUnidad,
    addUnidad,
  } = useUnidad();
  const {
    categorias,
    isLoading: loadingCategoria,
    isError: errorCategoria,
    addCategoria,
  } = useCategoria();
  const {
    caracteristicas,
    isLoading: loadingCaracteristica,
    isError: errorCaracteristica,
    addCaracteristica,
  } = useCaracteristica();

  const [showModal, setShowModal] = useState(false);
  const [showModalCategoria, setShowModalCategoria] = useState(false);
  const [showModalCaracteristica, setShowModalCaracteristica] = useState(false);

  const handleClose = () => setShowModal(false);
  const handleCloseCategoria = () => setShowModalCategoria(false);
  const handleCloseCaracteristica = () => setShowModalCaracteristica(false);

  const foundElemento = getElementoById(
    elementoId,
    elementos
  ) as ElementoUpdate;

  const normalizedElemento = {
    ...foundElemento,
    fkUnidadMedida:
      typeof foundElemento.fkUnidadMedida === "object" &&
      foundElemento.fkUnidadMedida !== null
        ? (foundElemento.fkUnidadMedida as { idUnidad: number }).idUnidad
        : foundElemento.fkUnidadMedida,

    fkCategoria:
      typeof foundElemento.fkCategoria === "object" &&
      foundElemento.fkCategoria !== null
        ? (foundElemento.fkCategoria as { idCategoria: number }).idCategoria
        : foundElemento.fkCategoria,

    fkCaracteristica:
      typeof foundElemento.fkCaracteristica === "object" &&
      foundElemento.fkCaracteristica !== null
        ? (foundElemento.fkCaracteristica as { idCaracteristica: number })
            .idCaracteristica
        : foundElemento.fkCaracteristica,
  };

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ElementoUpdate>({
    resolver: zodResolver(ElementoUpdateSchema),
    mode: "onChange",
    defaultValues: {
      idElemento: normalizedElemento.idElemento,
      nombre: normalizedElemento.nombre,
      descripcion: normalizedElemento.descripcion,
      imagen: normalizedElemento.imagen,
      fkUnidadMedida: normalizedElemento.fkUnidadMedida,
      fkCategoria: normalizedElemento.fkCategoria,
      fkCaracteristica: normalizedElemento.fkCaracteristica,
    },
  });

  const fkUnidadMedida = watch("fkUnidadMedida");
  const fkCategoria = watch("fkCategoria");
  const fkCaracteristica = watch("fkCaracteristica");

  console.log("yfhbdj fkuni:", foundElemento.fkUnidadMedida);

  const imagen = watch("imagen");

  const onSubmit = async (data: ElementoUpdate) => {
    if (!data.idElemento) return;
    try {
      await updateElemento(data.idElemento, data);
      onclose();
      addToast({
        title: "Elemento actualizado",
        description:
          "Los datos del elemento fueron actualizados correctamente.",
        color: "primary",
        timeout: 3000,
        shouldShowTimeoutProgress: true,
      });
    } catch (error) {
      console.error("Error al actualizar el Elemento", error);
    }
  };
  console.log("Errores", errors);
  return (
    <>
      <Form
        id={id}
        className="w-full space-y-4"
        onSubmit={handleSubmit(onSubmit)}
      >
        <Input
          label="Nombre"
          placeholder="Nombre del elemento"
          {...register("nombre")}
          isInvalid={!!errors.nombre}
          errorMessage={errors.nombre?.message}
        />

        <Input
          label="Descripción"
          placeholder="Descripción del elemento"
          {...register("descripcion")}
          isInvalid={!!errors.descripcion}
          errorMessage={errors.descripcion?.message}
        />

        {imagen && typeof imagen === "string" && (
          <div className="flex justify-center">
            <img
              src={`${import.meta.env.VITE_API_CLIENT}/img/img/elementos/${imagen}`}
              alt="Imagen actual"
              className="w-40 h-40 object-cover rounded-lg mb-4"
            />
          </div>
        )}

        {imagen instanceof File && (
          <div className="flex justify-center">
            <img
              src={URL.createObjectURL(imagen)}
              alt="Nueva imagen"
              className="w-40 h-40 object-cover rounded-lg mb-4"
            />
          </div>
        )}

        <Input
          label="Imagen"
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) setValue("imagen", file);
          }}
        />

        {/* Unidad de medida */}
        {!loadingUnidad && !errorUnidad && unidades && (
          <div className="w-full flex">
            <Select
              label="Unidad de medida"
              selectedKeys={fkUnidadMedida ? [fkUnidadMedida.toString()] : []}
              onSelectionChange={(keys) => {
                const key = [...keys][0];
                const id = key ? parseInt(key as string) : undefined;
                setValue("fkUnidadMedida", id);
              }}
            >
              {unidades.map((unidad) => (
                <SelectItem
                  key={unidad.idUnidad?.toString()}
                  textValue={unidad.nombre}
                >
                  {unidad.nombre}
                </SelectItem>
              ))}
            </Select>
            <Buton
              type="button"
              className="m-2 w-10 h-10 !px-0 !min-w-0 rounded-xl flex"
              onPress={() => setShowModal(true)}
            >
              <PlusCircleIcon />
            </Buton>
          </div>
        )}

        {!loadingCategoria && !errorCategoria && categorias && (
          <div className="w-full flex">
            <Select
              label="Categoría"
              selectedKeys={fkCategoria ? [fkCategoria.toString()] : []}
              onSelectionChange={(keys) => {
                const key = [...keys][0];
                const id = key ? parseInt(key as string) : undefined;
                setValue("fkCategoria", id);
              }}
            >
              {categorias.map((cat) => (
                <SelectItem
                  key={cat.idCategoria?.toString()}
                  textValue={cat.nombre}
                >
                  {cat.nombre}
                </SelectItem>
              ))}
            </Select>
            <Buton
              type="button"
              className="m-2 w-10 h-10 !px-0 !min-w-0 rounded-xl flex"
              onPress={() => setShowModalCategoria(true)}
            >
              <PlusCircleIcon />
            </Buton>
          </div>
        )}

        {!loadingCaracteristica && !errorCaracteristica && caracteristicas && (
          <div className="w-full flex">
            <Select
              label="Característica"
              selectedKeys={  
                fkCaracteristica ? [fkCaracteristica.toString()] : []
              }
              onSelectionChange={(keys) => {
                const key = [...keys][0];
                const id = key ? parseInt(key as string) : undefined;
                setValue("fkCaracteristica", id);
              }}
            >
              {caracteristicas.map((carac) => (
                <SelectItem
                  key={carac.idCaracteristica?.toString()}
                  textValue={carac.nombre}
                >
                  {carac.nombre}
                </SelectItem>
              ))}
              
            </Select>

            <Buton
              type="button"
              className="m-2 w-10 h-10 !px-0 !min-w-0 rounded-xl flex"
              onPress={() => setShowModalCaracteristica(true)}
            >
              <PlusCircleIcon />
            </Buton>
          </div>
        )}

        <Buton
          text="Guardar"
          type="submit"
          isLoading={isSubmitting}
          className="w-full rounded-xl"
        />
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
};
