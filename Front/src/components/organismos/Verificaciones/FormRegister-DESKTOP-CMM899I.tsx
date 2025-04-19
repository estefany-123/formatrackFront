import React from "react";
import { Form } from "@heroui/form";
import Inpu from "@/components/molecules/input";
import { Verificacion } from "@/types/Verificacion";
import { Select, SelectItem } from "@heroui/react";
import { useInventario } from "@/hooks/Inventarios/useInventario";
import { useSitios } from "@/hooks/sitios/useSitios";

type FormularioProps = {
  addData: (verificacion: Verificacion) => Promise<void>;
  onClose: () => void;
  id: string;
};

export default function Formulario({ addData, onClose, id }: FormularioProps) {
  const [formData, setFormData] = React.useState<Verificacion>({
    id_verificacion: 0,
    persona_encargada: "",
    persona_asignada: "",
    hora_ingreso: "",
    hora_salida: "",
    observaciones: "",
    created_at: "",
    updated_at: "",
    fk_inventario: 0,
    fk_sitio: 0,
  });

  const {
    inventarios,
    isLoading: loadingInventarios,
    isError: errorInventarios,
  } = useInventario();
  const { sitios, isLoading: loadingSitios } = useSitios();

  const onSubmit = async (e: React.FormEvent) => {
    //preguntar si esta bien no usar el e: React.FormEvent
    //y aqui el preventdefault
    e.preventDefault();
    try {
      console.log("Enviando formulario con datos:", formData);
      await addData(formData);
      console.log("Verificacion guardada correctamente");
      setFormData({
        id_verificacion: 0,
        persona_encargada: "",
        persona_asignada: "",
        hora_ingreso: "",
        hora_salida: "",
        observaciones: "",
        created_at: "",
        updated_at: "",
        fk_inventario: 0,
        fk_sitio: 0,
      });
      onClose();
    } catch (error) {
      console.error("Error al cargar la verifiacion", error);
    }
  };

  const inventariosFiltrados = React.useMemo(() => {
    return (
      inventarios?.filter((inv) => inv.fk_sitio === formData.fk_sitio) || []
    );
  }, [inventarios, formData.fk_sitio]);

  console.log("Sitio seleccionado:", formData.fk_sitio);

  console.log("Inventarios filtrados:", inventariosFiltrados);



  return (
    <Form id={id} onSubmit={onSubmit} className="w-full space-y-4">
      <Inpu
        label="Persona Encargada"
        placeholder="Persona Encargada"
        type="text"
        name="persona_encargada"
        onChange={(e) =>
          setFormData({ ...formData, persona_encargada: e.target.value })
        }
      />
      <Inpu
        label="Persona Asignada"
        placeholder="Persona Asignada"
        type="text"
        name="persona_asignada"
        value={formData.persona_asignada}
        onChange={(e) =>
          setFormData({ ...formData, persona_asignada: e.target.value })
        }
      />
      <Inpu
        label="Hora Ingreso"
        placeholder="Hora Ingreso"
        type="time"
        name="hora_ingreso"
        value={formData.hora_ingreso}
        onChange={(e) =>
          setFormData({ ...formData, hora_ingreso: e.target.value })
        }
      />
      <Inpu
        label="Hora Salida"
        placeholder="Hora Salida"
        type="time"
        name="hora_salida"
        value={formData.hora_salida}
        onChange={(e) =>
          setFormData({ ...formData, hora_salida: e.target.value })
        }
      />
      <Inpu
        label="Observaciones"
        placeholder="Observaciones"
        type="text"
        name="observaciones"
        value={formData.observaciones}
        onChange={(e) =>
          setFormData({ ...formData, observaciones: e.target.value })
        }
      />

      {!loadingSitios && sitios && (
<Select
  label="Sitio"
  name="fk_sitio"
  placeholder="Selecciona un sitio"
  selectedKeys={formData.fk_sitio ? formData.fk_sitio.toString() : undefined}
  onSelectionChange={(key) =>
    setFormData({
      ...formData,
      fk_sitio: Number(key),
      fk_inventario: 0,
    })
  }
>
  {sitios.map((sitio) => (
    <SelectItem key={sitio.id_sitio.toString()}>{sitio.nombre}</SelectItem>
  ))}
</Select>

      )}

{formData.fk_sitio > 0 && !loadingInventarios && !errorInventarios && (
  inventariosFiltrados.length > 0 ? (
    <Select
      label="Inventario"
      name="fk_inventario"
      placeholder="Selecciona un inventario"
      selectedKeys={
        formData.fk_inventario ? formData.fk_inventario.toString() : undefined
      }
      onSelectionChange={(key) =>
        setFormData({ ...formData, fk_inventario: Number(key) })
      }
    >
      {inventariosFiltrados.map((inventario) => (
        <SelectItem key={inventario.id_inventario.toString()}>
          Inventario #{inventario.id_inventario} - Elemento #{inventario.fk_elemento}
        </SelectItem>
      ))}
    </Select>
  ) : (
    <p className="text-sm text-gray-500 italic">
      No hay inventarios disponibles para este sitio.
    </p>
  )
)}

    </Form>
  );
}
