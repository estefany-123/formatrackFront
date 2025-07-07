import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  User,
  DropdownItem,
} from "@heroui/react";
import { FormatrackLogo } from "../atoms/Icons";
import { BellIcon } from "@heroicons/react/24/outline";
import { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/providers/AuthProvider";
import { Notificacion } from "@/types/Notificacion";

type NavProps = {
  children?: ReactNode;
  onOpenNotifications?: () => void;
  notificaciones?: Notificacion[];
};

export function Nav({ children, onOpenNotifications, notificaciones = [] }: NavProps) {
  const navigate = useNavigate();
  const { nombre, perfil } = useAuth();

  return (
    <Navbar>
      <NavbarContent justify="start">
        <NavbarBrand className="mr-4">
          <FormatrackLogo />
          <p className="hidden sm:block font-bold text-inherit">Formatrack</p>
        </NavbarBrand>
      </NavbarContent>

      <div className="flex items-center gap-4 ms-auto">
        <Dropdown placement="bottom-end">
          <DropdownTrigger>
            <button
              className="relative text-gray-700 dark:text-white"
              onClick={onOpenNotifications}
            >
              <BellIcon className="w-6 h-6" />

              {notificaciones.some((n) => !n.leido) && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white rounded-full px-1.5 text-xs">
                  {notificaciones.filter((n) => !n.leido).length}
                </span>
              )}
            </button>
          </DropdownTrigger>

          <DropdownMenu aria-label="Notificaciones" className="max-w-sm w-72">
            <DropdownItem
              textValue="notificaciones"
              className="font-semibold text-center"
              isReadOnly
              key="notificaciones-header"
            >
              Notificaciones
            </DropdownItem>

            <DropdownItem
              textValue="ver-todo"
              onPress={onOpenNotifications}
              className="text-center text-blue-500 hover:underline"
              key="ver-todo"
            >
              Ver todo
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>

        <div>{children}</div>

        <User
          name={nombre}
          avatarProps={{
            src: `http://localhost:3000/img/perfiles/${perfil ?? "defaultPerfil.png"}`,
            onClick: () => navigate("/perfil"),
            isBordered: true,
          }}
        />
      </div>
    </Navbar>
  );
}
