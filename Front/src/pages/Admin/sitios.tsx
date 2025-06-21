import Globaltable from "@/components/organismos/table.tsx"; // Importar la tabla reutilizable
import { TableColumn } from "@/components/organismos/table.tsx";
import Buton from "@/components/molecules/Button";
import Modall from "@/components/organismos/modal";
import Formulario from "@/components/organismos/Sitios/FormRegister";
import { useState } from "react";
import { FormUpdate } from "@/components/organismos/Sitios/Formupdate";
import { useSitios } from "@/hooks/sitios/useSitios";
import { Sitios } from "@/types/sitios";
import { Card, CardBody } from "@heroui/react";
import { useNavigate } from "react-router-dom";

const SitiosTable = () => {
  const { sitios, isLoading, isError, error, addSitio, changeState } =
    useSitios();

  //Modal agregar
  const [isOpen, setIsOpen] = useState(false);
  const handleClose = () => setIsOpen(false);

  //Modal actualizar
  const [IsOpenUpdate, setIsOpenUpdate] = useState(false);
  const [selectedSitio, setSelectedSitio] = useState<Sitios | null>(null);

  const navigate = useNavigate();

  const handleGoToTipo = () => {
    navigate("/admin/tiposSitio");
  };

  const handleCloseUpdate = () => {
    setIsOpenUpdate(false);
    setSelectedSitio(null);
  };

  const handleState = async (idSitio: number) => {
    await changeState(idSitio);
  };

  const handleAddSitio = async (sitio: Sitios) => {
    try {
      await addSitio(sitio);
      handleClose(); // Cerrar el modal después de darle agregar usuario
    } catch (error) {
      console.error("Error al agregar el sitio:", error);
    }
  };

  const handleEdit = (sitio: Sitios) => {
    setSelectedSitio(sitio);
    setIsOpenUpdate(true);
  };

  // Definir las columnas de la tabla
  const columns: TableColumn<Sitios>[] = [
    { key: "nombre", label: "Nombre" },
    { key: "personaEncargada", label: "personaEncargada" },
    { key: "ubicacion", label: "ubicacion" },
    {
      key: "createdAt",
      label: "Fecha CReacion",
      render: (sitio: Sitios) => (
        <span>
          {sitio.createdAt
            ? new Date(sitio.createdAt).toLocaleDateString("es-ES", {
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
      render: (sitio: Sitios) => (
        <span>
          {sitio.updatedAt
            ? new Date(sitio.updatedAt).toLocaleDateString("es-ES", {
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

  const sitiosWithKey = sitios
    ?.filter((sitio) => sitio?.idSitio !== undefined)
    .map((sitio) => ({
      ...sitio,
      key: sitio.idSitio ? sitio.idSitio.toString() : crypto.randomUUID(),
      idSitio: sitio.idSitio || 0,
      estado: Boolean(sitio.estado),
    }));

  return (
    <div className="p-4">
      <div className="flex pb-4 pt-4">
        <Card className="w-full">
          <CardBody>
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold">Gestionar Sitios</h1>
              <div className="flex gap-2">
                <Buton
                  text="Gestionar Tipos"
                  onPress={handleGoToTipo}
                />
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
      <Modall
        ModalTitle="Agregar Sitio"
        isOpen={isOpen}
        onOpenChange={handleClose}
      >
        <Formulario
          id="sitio-form"
          addData={handleAddSitio}
          onClose={handleClose}
        />
        <Buton
          text="Guardar"
          type="submit"
          form="sitio-form"
          className="w-full rounded-xl"
        />
      </Modall>

      <Modall
        ModalTitle="Editar Sitio"
        isOpen={IsOpenUpdate}
        onOpenChange={handleCloseUpdate}
      >
        {selectedSitio && (
          <FormUpdate
            sitios={sitiosWithKey ?? []}
            sitioId={selectedSitio.idSitio as number}
            id="FormUpdate"
            onclose={handleCloseUpdate}
          />
        )}
      </Modall>

      {sitiosWithKey && (
        <Globaltable
          data={sitiosWithKey}
          columns={columns}
          onEdit={handleEdit}
          onDelete={(sitio) => handleState(sitio.idSitio)}
          extraHeaderContent={
            <Buton text="Añadir sitio" onPress={() => setIsOpen(true)} />
          }
        />
      )}
    </div>
  );
};

export default SitiosTable;
