import Globaltable from "@/components/organismos/table.tsx"; // Importar la tabla reutilizable
import { TableColumn } from "@/components/organismos/table.tsx";
import Buton from "@/components/molecules/Button";
import Modall from "@/components/organismos/modal";
import FormRutas from "@/components/organismos/Rutas/FormRutas";
import { useState } from "react";
import FormUpRutas from "@/components/organismos/Rutas/FormUpRutas";
import { useRuta } from "@/hooks/Rutas/useRuta";
import { Card, CardBody } from "@heroui/react";
import { useNavigate } from "react-router-dom";
import { Ruta } from "@/types/Ruta";

const RutasTable = () => {
  const { rutas, isLoading, isError, error, addRuta, changeState } = useRuta();

  //Modal agregar
  const [isOpen, setIsOpen] = useState(false);
  const handleClose = () => setIsOpen(false);

  //Modal actualizar
  const [IsOpenUpdate, setIsOpenUpdate] = useState(false);
  const [selectedRuta, setSelectedRuta] = useState<Ruta | null>(null);

  const navigate = useNavigate();

  const handleGoToPermiso = () => {
    navigate("/admin/permisos");
  };
  const handleGoToModulo = () => {
    navigate("/admin/modulos");
  };

  const handleCloseUpdate = () => {
    setIsOpenUpdate(false);
    setSelectedRuta(null);
  };

  const handleState = async (rutas: Ruta) => {
    await changeState(rutas.idRuta);
    console.log(rutas.idRuta);
  };

  const handleAddCentro = async (rutas: Ruta) => {
    try {
      await addRuta(rutas);
      handleClose(); // Cerrar el modal después de darle agregar usuario
    } catch (error) {
      console.error("Error al agregar la ruta:", error);
    }
  };

  const handleEdit = (rutas: Ruta) => {
    setSelectedRuta(rutas);
    setIsOpenUpdate(true);
  };

  // Definir las columnas de la tabla
  const columns: TableColumn<Ruta>[] = [
    { key: "nombre", label: "Nombre" },
    { key: "descripcion", label: "Descripcion" },
    { key: "urlDestino", label: "Url" },
    {
      key: "createdAt",
      label: "Fecha Creacion",
      render: (ruta: Ruta) => (
        <span>
          {ruta.createdAt
            ? new Date(ruta.createdAt).toLocaleDateString("es-ES", {
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
      render: (ruta: Ruta) => (
        <span>
          {ruta.updatedAt
            ? new Date(ruta.updatedAt).toLocaleDateString("es-ES", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
              })
            : "N/A"}
        </span>
      ),
    },
    { key: "estado", label: "Estado" },
  ];

  if (isLoading) {
    return <span>Cargando datos...</span>;
  }

  if (isError) {
    return <span>Error: {error?.message}</span>;
  }

  const rutasWithKey = rutas
    ?.filter((rutas) => rutas?.idRuta !== undefined)
    .map((rutas) => ({
      ...rutas,
      key: rutas.idRuta ? rutas.idRuta.toString() : crypto.randomUUID(),
      estado: Boolean(rutas.estado),
    }));

  return (
    <div className="p-4">
      <div className="flex pb-4 pt-4">
        <Card className="w-full">
          <CardBody>
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold">Gestionar Rutas</h1>
              <div className="flex gap-2">
                <Buton text="Permisos" onPress={handleGoToPermiso} />
                <Buton text="Gestionar Modulos" onPress={handleGoToModulo} />
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
      <Modall
        ModalTitle="Agregar Ruta"
        isOpen={isOpen}
        onOpenChange={handleClose}
      >
        <FormRutas
          id="ruta-form"
          addData={handleAddCentro}
          onClose={handleClose}
        />
        <Buton
          text="Guardar"
          type="submit"
          form="ruta-form"
          className="w-full rounded-xl"
        />
      </Modall>

      <Modall
        ModalTitle="Editar Ruta"
        isOpen={IsOpenUpdate}
        onOpenChange={handleCloseUpdate}
      >
        {selectedRuta && (
          <FormUpRutas
            rutas={rutasWithKey ?? []}
            rutaId={selectedRuta.idRuta}
            id="FormUpdate"
            onclose={handleCloseUpdate}
          />
        )}
      </Modall>

      {rutasWithKey && (
        <Globaltable
          data={rutasWithKey}
          columns={columns}
          onEdit={handleEdit}
          onDelete={handleState}
          extraHeaderContent={
            <Buton text="Añadir Ruta" onPress={() => setIsOpen(true)} />
          }
        />
      )}
    </div>
  );
};

export default RutasTable;
