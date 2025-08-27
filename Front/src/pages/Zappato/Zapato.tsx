import Globaltable from "@/components/organismos/table.tsx"; // Importar la tabla reutilizable
import { TableColumn } from "@/components/organismos/table.tsx";
import Buton from "@/components/molecules/Button";
import Modall from "@/components/organismos/modal";
import { useState } from "react";
import { Card, CardBody } from "@heroui/react";
import { useZapato } from "@/hooks/Zapatos/useZapato";
import { Zapato } from "@/types/zapato";
import FormularioZapato from "@/components/organismos/Zapatos/FormRegister";
import { FormUpdate } from "@/components/organismos/Zapatos/FormUpdate";

export const ZapatoTable = () => {
  const { zapatos, isLoading, isError, error, addZapato} =
    useZapato();

  //Modal agregar
  const [isOpen, setIsOpen] = useState(false);
  const handleClose = () => setIsOpen(false);

  //Modal actualizar
  const [IsOpenUpdate, setIsOpenUpdate] = useState(false);
  const [selectedZapato, setSelectedZapato] = useState<Zapato | null>(null);



  const handleCloseUpdate = () => {
    setIsOpenUpdate(false);
    setSelectedZapato(null);
  };


  const handleAddZapato= async (zapato: Zapato) => {
    try {
      await addZapato(zapato);
      handleClose(); // Cerrar el modal después de darle agregar usuario
    } catch (error) {
      console.error("Error al agregar el zapato:", error);
    }
  };

  const handleEdit = (zapato: Zapato) => {
    if (!zapato || !zapato.idZapato) {
      return;
    }
    setSelectedZapato(zapato);
    setIsOpenUpdate(true);
  };

  // Definir las columnas de la tabla
  const columns: TableColumn<Zapato>[] = [
    { key: "nombre", label: "Nombre" },
    { key: "marca", label: "Marca" },
    { key: "talla", label: "Talla" },

  ];

  if (isLoading) {
    return <span>Cargando datos...</span>;
  }

  if (isError) {
    return <span>Error: {error?.message}</span>;
  }

  const ZapatoWithKey = zapatos
    ?.filter((unidad) => unidad?.idZapato !== undefined)
    .map((unidad) => ({
      ...unidad,
      key: unidad.idZapato ? unidad.idZapato.toString() : crypto.randomUUID(),
      idZapato: unidad.idZapato || 0,
    }));

  return (
    <div className="p-4">
      <div className="flex pb-4 pt-4">
        <Card className="w-full">
          <CardBody>
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold">Gestionar Zapatos</h1>
            </div>
          </CardBody>
        </Card>
      </div>

      <Modall
        ModalTitle="Registrar Nuevo Zapato"
        isOpen={isOpen}
        onOpenChange={handleClose}
      >
        <FormularioZapato
          id="zapato-form"
          addData={handleAddZapato}
          onClose={handleClose}
        />
        <div>
          <Buton
            text="Guardar"
            type="submit"
            form="zapato-form"
            className="w-full p-2 rounded-xl"
          />
        </div>
      </Modall>

      <Modall
        ModalTitle="Editar Zapato"
        isOpen={IsOpenUpdate}
        onOpenChange={handleCloseUpdate}
      >
        {selectedZapato && (
          <FormUpdate
            zapatos={ZapatoWithKey ?? []}
            zapatoId={selectedZapato.idZapato as number}
            id="FormUpdate"
            onclose={handleCloseUpdate}
          />
        )}
      </Modall>

      {ZapatoWithKey && (
        <Globaltable
          data={ZapatoWithKey}
          columns={columns}
          onEdit={handleEdit}
          extraHeaderContent={
            <Buton text="Nuevo zapato" onPress={() => setIsOpen(true)} />
          }
        />
      )}
    </div>
  );
};
