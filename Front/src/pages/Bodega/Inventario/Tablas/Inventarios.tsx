import Globaltable from "@/components/organismos/table.tsx"; // Importar la tabla reutilizable
import { TableColumn } from "@/components/organismos/table.tsx";
import Buton from "@/components/molecules/Button";
import Modall from "@/components/organismos/modal";
import { useState } from "react";
import Formulario from "@/components/organismos/Inventarios/FormRegister";
import { useInventario } from "@/hooks/Inventarios/useInventario";
import { Inventario } from "@/types/Inventario";
import { Elemento } from "@/types/Elemento";
import { useElemento } from "@/hooks/Elementos/useElemento";

interface InventariosTableProps {
  inventarios?: Inventario[];
  idSitio?: number;
}

export const InventariosTable = ({
  inventarios: inventariosProp,
  idSitio,
}: InventariosTableProps) => {
  const {
    inventarios: inventariosHook,
    isLoading,
    isError,
    error,
    addInventario,
    changeState,
  } = useInventario();
  const { elementos: elementos } = useElemento();
  //Modal agregar
  const [isOpen, setIsOpen] = useState(false);
  const handleClose = () => setIsOpen(false);

  //Modal actualizar
  const [IsOpenUpdate, setIsOpenUpdate] = useState(false);
  const [selectedInventario, setSelectedInventario] =
    useState<Inventario | null>(null);

  const handleCloseUpdate = () => {
    setIsOpenUpdate(false);
    setSelectedInventario(null);
  };

  const handleState = async (idInventario: number) => {
    await changeState(idInventario);
  };

  const handleAddInventario = async (inventario: Inventario) => {
    try {
      await addInventario(inventario);
      handleClose();
    } catch (error) {
      console.error("Error al agregar al inventario:", error);
    }
  };

  const handleEdit = (inventario: Inventario) => {
    setSelectedInventario(inventario);
    setIsOpenUpdate(true);
  };

  // Definir las columnas de la tabla
  const columns = (elementos: Elemento[]): TableColumn<Inventario>[] => [
    {
      key: "fkElemento",
      label: "Elemento",
      render: (inventario: Inventario) => {
        const elemento = elementos.find(
          (el) => el.idElemento === inventario.fkElemento
        );
        return <span>{elemento?.nombre ?? "No encontrado"}</span>;
      },
    },
    {
      key: "imagenElemento",
      label: "Imagen",
      render: (inventario: Inventario) => {
        const elemento = elementos.find(
          (el) => el.idElemento === inventario.fkElemento
        );

        const imagen = elemento?.imagenElemento;

        if (!imagen) return <span>No encontrado</span>;

        const src = `http://localhost:3000/img/${imagen}`;

        return (
          <img
            src={src}
            alt="Imagen del elemento"
            className="justify-center relative left-6 h-28 rounded shadow"
          />
        );
      },
    },
    { key: "stock", label: "Cantidad" },
    {
      key: "createdAt",
      label: "Fecha Creación",
      render: (inventario: Inventario) => (
        <span>
          {inventario.createdAt
            ? new Date(inventario.createdAt).toLocaleDateString("es-ES", {
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
      render: (inventario: Inventario) => (
        <span>
          {inventario.updatedAt
            ? new Date(inventario.updatedAt).toLocaleDateString("es-ES", {
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

  if (isLoading && !inventariosProp) {
    return <span>Cargando datos...</span>;
  }

  if (isError && !inventariosProp) {
    return <span>Error: {error?.message}</span>;
  }

  const filtered = inventariosProp ?? inventariosHook;

  const InventariosWithKey = filtered
    ?.filter(
      (inventario) =>
        inventario?.idInventario !== undefined &&
        (idSitio ? inventario.fkSitio === idSitio : true)
    )
    .map((inventario) => ({
      ...inventario,
      key: inventario.idInventario
        ? inventario.idInventario.toString()
        : crypto.randomUUID(),
      idInventario: inventario.idInventario || 0,
      estado: Boolean(inventario.estado),
    }));

  return (
    <div className="p-4">
      {!idSitio && (
        <h1 className="text-2xl font-bold mb-4 text-center">
          Inventarios Registrados
        </h1>
      )}
      <Modall
        ModalTitle="Registrar Nuevo Inventario"
        isOpen={isOpen}
        onOpenChange={handleClose}
      >
        <Formulario
          id="inventario-form"
          addData={handleAddInventario}
          onClose={handleClose}
          idSitio={idSitio!}
        />
        <div className="justify-center pt-2">
          <Buton
            text="Guardar"
            type="submit"
            form="inventario-form"
            className="w-full p-2 rounded-xl"
          />
        </div>
      </Modall>

      {InventariosWithKey && (
        <Globaltable
          data={InventariosWithKey}
          columns={columns(elementos ?? [])}
          onDelete={(inventario) => handleState(inventario.idInventario)}
          extraHeaderContent={
            <Buton text="Nuevo inventario" onPress={() => setIsOpen(true)} />
          }
        />
      )}
    </div>
  );
};
