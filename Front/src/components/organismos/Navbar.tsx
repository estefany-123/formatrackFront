import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  DropdownItem,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  Avatar,
} from "@heroui/react";
import { FormatrackLogo } from "../atoms/Icons";
import { BellIcon } from "@heroicons/react/24/outline";
import { ReactNode, useState } from "react";
import Modall from "@/components/molecules/modal"; // Importar el componente del modal

type NavProps = {
  children?: ReactNode;
  onOpenNotificationes?: () => void;
  id_notificacion:number
  titulo:string
  mensaje:string
};

export function Nav({ children }: NavProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [notificationes, setNotificationes] = useState<NavProps[]>([]);


  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  function handleClickNotificacion(id_notificacion: number): void {
    throw new Error("Function not implemented.");
  }

  return (
    <>
      <Navbar isBordered>
        <NavbarContent justify="start">
          <NavbarBrand className="mr-4">
            <FormatrackLogo />
            <p className="hidden sm:block font-bold text-inherit">Formatrack</p>
          </NavbarBrand>
        </NavbarContent>

        <NavbarContent as="div" className="items-center gap-4" justify="end">
          <Dropdown placement="bottom-end">
            <DropdownTrigger>
              <button className="relative text-gray-700 dark:text-white">
                <BellIcon className="w-6 h-6" />
                {notificationes.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-600 text-white rounded-full px-1.5 text-xs">
                    {notificationes.length}
                  </span>
                )}
              </button>
            </DropdownTrigger>
            <DropdownMenu
              aria-label="Notificaciones recientes"
              className="max-w-sm w-72"
            >
              <DropdownItem
                textValue="notificaciones"
                className="font-semibold text-center"
                isReadOnly
                key={`notificaciones-header`}
              >
                Notificaciones
              </DropdownItem>

              <DropdownItem
                textValue="ver-todo"
                onPress={() => setIsModalOpen(true)}
                className="text-center text-blue-500 hover:underline"
                key={`ver-todo`}
              >
                Ver todo
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>

          <Dropdown placement="bottom-end">
            <DropdownTrigger>
              <Avatar
                isBordered
                as="button"
                className="transition-transform"
                color="secondary"
                name="Usuario"
                size="sm"
              />
            </DropdownTrigger>
            <DropdownMenu aria-label="" variant="flat">
              <DropdownItem key="Profile">Perfil</DropdownItem>
              <DropdownItem key="logout" color="danger">
                Cerrar Sesión
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </NavbarContent>
        <div>{children}</div>
      </Navbar>


      <Modall ModalTitle="Notificaciones" isOpen={isModalOpen} onOpenChange={handleCloseModal}>
        <div className="space-y-2">
          {notificationes.map((n) => (
            <div key={`notificacion-${n.id_notificacion}`} className="flex flex-col p-2 border-b">
              <strong>{n.titulo}</strong>
              <p className="text-xs text-gray-500">{n.mensaje}</p>
              <button
                onClick={() => handleClickNotificacion(n.id_notificacion)}
                className="text-blue-500 text-sm mt-1"
              >
                Marcar como leída
              </button>
            </div>
          ))}
        </div>
      </Modall>
    </>
  );
}
