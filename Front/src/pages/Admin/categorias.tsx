import Globaltable from "@/components/organismos/table.tsx"; // Importar la tabla reutilizable
import { TableColumn } from "@/components/organismos/table.tsx";
import Buton from "@/components/molecules/Button";
import Modall from "@/components/organismos/modal";
import FormCategorias from "@/components/organismos/Categorias/FormCategorias";
import { useState } from "react";
import FormUpCategoria from "@/components/organismos/Categorias/FormUpCategoria";
import { Categoria } from "@/types/Categorias";
import { useCategoria } from "@/hooks/Categorias/useCategorias";
import { useNavigate } from "react-router-dom";
import { Card, CardBody } from "@heroui/react";

const CategoriasTable = () => {
  const { categorias, isLoading, isError, error, addCategoria, changeState } =
    useCategoria();

  //Modal agregar
  const [isOpen, setIsOpen] = useState(false);
  const handleClose = () => setIsOpen(false);

  //Modal actualizar
  const [IsOpenUpdate, setIsOpenUpdate] = useState(false);
  const [selectedCategoria, setSelectedCategoria] = useState<Categoria | null>(
    null
  );

  const navigate = useNavigate();

  const handleGoToElemento = () => {
    navigate("/bodega/elementos");
  };

  const handleCloseUpdate = () => {
    setIsOpenUpdate(false);
    setSelectedCategoria(null);
  };

  const handleState = async (categorias: Categoria) => {
    await changeState(categorias.idCategoria as number);
    console.log(categorias.idCategoria);
  };

  const handleAddCategoria = async (categoria: Categoria) => {
    try {
      await addCategoria(categoria);
      handleClose(); 
    } catch (error) {
      console.error("Error al agregar la categoria:", error);
    }
  };

  const handleEdit = (categoria: Categoria) => {
    setSelectedCategoria(categoria);
    setIsOpenUpdate(true);
  };

  // Definir las columnas de la tabla
  const columns: TableColumn<Categoria>[] = [
    { key: "nombre", label: "Nombre" },
    { key: "codigoUNPSC", label: "Codigo" },
    {
      key: "createdAt",
      label: "Fecha Creacion",
      render: (categoria: Categoria) => (
        <span>
          {categoria.createdAt
            ? new Date(categoria.createdAt).toLocaleDateString("es-ES", {
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
      render: (categoria: Categoria) => (
        <span>
          {categoria.updatedAt
            ? new Date(categoria.updatedAt).toLocaleDateString("es-ES", {
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

  const categoriasWithKey = categorias
    ?.filter((categorias) => categorias?.idCategoria !== undefined)
    .map((categorias) => ({
      ...categorias,
      key: categorias.idCategoria
        ? categorias.idCategoria.toString()
        : crypto.randomUUID(),
      estado: Boolean(categorias.estado),
      idCategoria:categorias.idCategoria
    }));

  return (
    <div className="p-4">
      <div className="flex pb-4 pt-4">
        <Card className="w-full">
          <CardBody>
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold">Gestionar Categoras</h1>
              <div className="flex gap-2">
                <Buton text="Elementos" onPress={handleGoToElemento} />
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
      <Modall
        ModalTitle="Agregar Categoria"
        isOpen={isOpen}
        onOpenChange={handleClose}
      >
        <FormCategorias
          id="categoria-form"
          addData={handleAddCategoria}
          onClose={handleClose}
        />
        <Buton
          text="Guardar"
          type="submit"
          form="categoria-form"
          className="rounded-xl"
        />
      </Modall>

      <Modall
        ModalTitle="Editar Categoria"
        isOpen={IsOpenUpdate}
        onOpenChange={handleCloseUpdate}
      >
        {selectedCategoria && (
          <FormUpCategoria
            categorias={categoriasWithKey ?? []}
            categoriaId={selectedCategoria.idCategoria as number}
            id="FormUpdate"
            onclose={handleCloseUpdate}
          />
        )}
      </Modall>

      {categoriasWithKey && (
        <Globaltable
          data={categoriasWithKey}
          columns={columns}
          onEdit={handleEdit}
          onDelete={handleState}
          extraHeaderContent={
            <Buton text="Añadir Categoria" onPress={() => setIsOpen(true)} />
          }
        />
      )}
    </div>
  );
};

export default CategoriasTable;
