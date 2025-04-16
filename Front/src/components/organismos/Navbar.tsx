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


  type NavProps = {
    children?: ReactNode;
    onOpenNotifications:() => void;
  };
  
  export function Nav({children}:NavProps) {
    const [, setIsModalOpen] = useState(false);


    const notifications = [
      { id: 1, type: "Solicitud", message: "Nueva solicitud de préstamo" },
      { id: 2, type: "Movimiento", message: "Movimiento registrado en bodega" },
      { id: 3, type: "Verificación", message: "Verificación pendiente" },
    ];
    return (
      <>
        <Navbar isBordered >
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
                {notifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-600 text-white rounded-full px-1.5 text-xs">
                    {notifications.length}
                  </span>
                )}
              </button>
            </DropdownTrigger>
            <DropdownMenu
              aria-label="Notificaciones recientes"
              className="max-w-sm w-72"
            >
              <DropdownItem textValue="notificaciones" className="font-semibold text-center" isReadOnly key={""}>
                Notificaciones
              </DropdownItem>
              <DropdownItem
                key="ver-todo"
                onClick={() => setIsModalOpen(true)}
                className="text-center text-blue-500 hover:underline"
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
                  name="Jason Hughes"
                  size="sm"
                  src=""
                />
              </DropdownTrigger>
              <DropdownMenu aria-label="" variant="flat">
                <DropdownItem key="Profile">
                    Perfil
                </DropdownItem>
                <DropdownItem key="logout" color="danger">
                  Cerrar Sesion
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </NavbarContent>
          <div>{children}</div>
        </Navbar>
        </>
    );
}