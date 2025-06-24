import Globaltable from "@/components/organismos/table.tsx"; // Importar la tabla reutilizable
import { TableColumn } from "@/components/organismos/table.tsx";
import Buton from "@/components/molecules/Button";
import Modall from "@/components/organismos/modal";
import FormModulos from "@/components/organismos/Modulos/FormModulos";
import { useState } from "react";
import FormUpModulo from "@/components/organismos/Modulos/FormUpModulo";
import { useModulo } from "@/hooks/Modulos/useModulo";
import { Card, CardBody } from "@heroui/react";
import { useNavigate } from "react-router-dom";
import { Modulo } from "@/types/Modulo";

const ModulosTable = () => {
  const { modulos, isLoading, isError, error, addModulo, changeState } =
    useModulo();

  //Modal agregar
  const [isOpen, setIsOpen] = useState(false);
  const handleClose = () => setIsOpen(false);

  //Modal actualizar
  const [IsOpenUpdate, setIsOpenUpdate] = useState(false);
  const [selectedModulo, setSelectedModulo] = useState<Modulo | null>(null);

  const navigate = useNavigate();

  const handleGoToRuta = () => {
    navigate("/admin/rutas");
  };

  const handleCloseUpdate = () => {
    setIsOpenUpdate(false);
    setSelectedModulo(null);
  };

  const handleState = async (modulos: Modulo) => {
    await changeState(modulos.idModulo);
    console.log(modulos.idModulo);
  };

  const handleAddModulo = async (modulos: Modulo) => {
    try {
      await addModulo(modulos);
      handleClose(); // Cerrar el modal después de darle agregar usuario
    } catch (error) {
      console.error("Error al agregar el modulo:", error);
    }
  };

  const handleEdit = (modulos: Modulo) => {
    setSelectedModulo(modulos);
    setIsOpenUpdate(true);
  };

  // Definir las columnas de la tabla
  const columns: TableColumn<Modulo>[] = [
    { key: "nombre", label: "Nombre" },
    { key: "descripcion", label: "descripcion" },
    {
      key: "createdAt",
      label: "Fecha Creacion",
      render: (modulo: Modulo) => (
        <span>
          {modulo.createdAt
            ? new Date(modulo.createdAt).toLocaleDateString("es-ES", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
              })
            : "N/A"}
        </span>
      ),
    },
    {
      key: "updatedAt",
      label: "Fecha Actualización",
      render: (modulo: Modulo) => (
        <span>
          {modulo.updatedAt
            ? new Date(modulo.updatedAt).toLocaleDateString("es-ES", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
              })
            : "N/A"}
        </span>
      ),
    },
    { key: "estado", label: "estado" },
  ];

  if (isLoading) {
    return <span>Cargando datos...</span>;
  }

  if (isError) {
    return <span>Error: {error?.message}</span>;
  }

  const ModulosWithKey = modulos
    ?.filter((modulos) => modulos?.idModulo !== undefined)
    .map((modulos) => ({
      ...modulos,
      key: modulos.idModulo ? modulos.idModulo.toString() : crypto.randomUUID(),
      estado: Boolean(modulos.estado),
    }));

  return (
    <div className="p-4">
      <div className="flex pb-4 pt-4">
        <Card className="w-full">
          <CardBody>
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold">Gestionar Modulos</h1>
              <div className="flex gap-2">
                <Buton text="Rutas" onPress={handleGoToRuta} />
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      <Modall
        ModalTitle="Agregar modulo"
        isOpen={isOpen}
        onOpenChange={handleClose}
      >
        <FormModulos
          id="modulo-form"
          addData={handleAddModulo}
          onClose={handleClose}
        />
        <Buton
          text="Guardar"
          type="submit"
          form="modulo-form"
          className="w-full rounded-xl"
        />
      </Modall>

      <Modall
        ModalTitle="Editar Modulo"
        isOpen={IsOpenUpdate}
        onOpenChange={handleCloseUpdate}
      >
        {selectedModulo && (
          <FormUpModulo
            modulos={ModulosWithKey ?? []}
            moduloId={selectedModulo.idModulo}
            id="FormUpdate"
            onclose={handleCloseUpdate}
          />
        )}
      </Modall>

      {ModulosWithKey && (
        <Globaltable
          data={ModulosWithKey}
          columns={columns}
          onEdit={handleEdit}
          onDelete={handleState}
          extraHeaderContent={
            <Buton text="Añadir Modulo" onPress={() => setIsOpen(true)} />
          }
        />
      )}
    </div>
  );
};

export default ModulosTable;
