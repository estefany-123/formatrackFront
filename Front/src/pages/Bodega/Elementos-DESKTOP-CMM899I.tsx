import Globaltable from "@/components/organismos/table.tsx"; // Importar la tabla reutilizable
import { TableColumn } from "@/components/organismos/table.tsx";
import Buton from "@/components/molecules/Buton";
import Modall from "@/components/molecules/modal";
import { useState } from "react";
import { useElemento } from "@/hooks/Elementos/useElemento";
import { Elemento } from "@/types/Elemento";
import Formulario from "@/components/organismos/Elementos/FormRegister";
import { FormUpdate } from "@/components/organismos/Elementos/FormUpdate";

export const ElementosTable = () => {
  const { elementos, isLoading, isError, error, addElemento, changeState } =
    useElemento();

  //Modal agregar
  const [isOpen, setIsOpen] = useState(false);
  const handleClose = () => setIsOpen(false);

  //Modal actualizar
  const [IsOpenUpdate, setIsOpenUpdate] = useState(false);
  const [selectedElemento, setSelectedElemento] = useState<Elemento | null>(
    null
  );

  const handleCloseUpdate = () => {
    setIsOpenUpdate(false);
    setSelectedElemento(null);
  };

  const handleState = async (elemento: Elemento) => {
    await changeState(elemento.id_elemento);
  };

  const handleAddElemento = async (elemento: Elemento) => {
    try {
      await addElemento(elemento);
      handleClose(); // Cerrar el modal después de darle agregar usuario
    } catch (error) {
      console.error("Error al agregar el elemento:", error);
    }
  };

  const handleEdit = (elemento: Elemento) => {
    setSelectedElemento(elemento);
    setIsOpenUpdate(true);
  };

  // Definir las columnas de la tabla
  const columns: TableColumn<Elemento>[] = [
    { key: "nombre", label: "Nombre" },
    { key: "valor", label: "Valor" },
    { key: "imagen_elemento", label: "Elemento" },
    { key: "tipo_elemento", label: "Tipo Elemento" },
    {
      key: "created_at",
      label: "Fecha Creación",
      render: (elemento: Elemento) => (
        <span>{new Date(elemento.created_at).toLocaleDateString("es-ES")}</span>
      ),
    },
    {
      key: "updated_at",
      label: "Fecha Actualización",
      render: (elemento: Elemento) => (
        <span>{new Date(elemento.updated_at).toLocaleDateString("es-ES")}</span>
      ),
    },
    { key: "estado", label:"Estado"}
  ];

  if (isLoading) {
    return <span>Cargando datos...</span>;
  }

  if (isError) {
    return <span>Error: {error?.message}</span>;
  }

  const ElementosWithKey = elementos
    ?.filter((elemento) => elemento?.id_elemento !== undefined)
    .map((elemento) => ({
      ...elemento,
      key: elemento.id_elemento
        ? elemento.id_elemento.toString()
        : crypto.randomUUID(),
      estado: Boolean(elemento.estado),
    }));

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-2 mt-2 text-center">
        Elementos Registrados
      </h1>

      <Buton
        text="Nuevo elemento"
        onPress={() => setIsOpen(true)}
        type="button"
        variant="solid"
        className="relative top-12 text-white bg-blue-700"
      />

      <Modall
        ModalTitle="Registrar Nuevo Elemento"
        isOpen={isOpen}
        onOpenChange={handleClose}
      >
        <Formulario
          id="element-form"
          addData={handleAddElemento}
          onClose={handleClose}
        />
        <button
          type="submit"
          form="element-form"
          className="bg-blue-700 text-white p-2 rounded-md"
        >
          Guardar
        </button>
      </Modall>

      <Modall
        ModalTitle="Editar Elemento"
        isOpen={IsOpenUpdate}
        onOpenChange={handleCloseUpdate}
      >
        {selectedElemento && (
          <FormUpdate
            elementos={ElementosWithKey ?? []}
            elementoId={selectedElemento.id_elemento}
            id="FormUpdate"
            onclose={handleCloseUpdate}
          />
        )}
      </Modall>

      {ElementosWithKey && (
        <Globaltable
          data={ElementosWithKey}
          columns={columns}
          onEdit={handleEdit}
          onDelete={handleState}
        />
      )}
    </div>
  );
};
