import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  DropdownItem,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  Avatar,
  Button,
} from "@heroui/react";
import { FormatrackLogo } from "../atoms/Icons";
import { ArrowRightStartOnRectangleIcon, BellIcon } from "@heroicons/react/24/outline";
import { ReactNode, useState } from "react";
import { useNavigate } from "react-router-dom"; // Asegúrate de importar useNavigate
import Modall from "../organismos/modal";
// import { useNotificaciones } from "@/hooks/Notificaciones/useNotificacion";
import Cookies from "universal-cookie";
import { useAuth } from "@/providers/AuthProvider";
import useLogin from "@/hooks/Usuarios/useLogin";

type NavProps = {
  en_proceso: string;
  children?: ReactNode;
  onOpenNotificationes?: () => void;
  id_notificacion: number;
  titulo: string;
  mensaje: string;
};

export function Nav({ children }: NavProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [notificationes, setNotificationes] = useState<NavProps[]>([]);
  const navigate = useNavigate();
  const cookies = new Cookies();
  const { nombre } = useAuth();
  const { logout } = useLogin();

  // const {
  //   notificaciones,
  //   isLoading,
  //   aceptarMovimiento,
  //   cancelarMovimiento,
  //   aceptarSolicitud,
  //   cancelarSolicitud,
  // } = useNotificaciones();

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  function handleClickNotificacion(id_notificacion: number): void {
    throw new Error("Function not implemented.");
  }

  const handleGoToPerfil = () => {
    navigate("/perfil");
  };

  return (
    <>
      <Navbar isBordered>
        <NavbarContent justify="start">
          <NavbarBrand className="mr-4">
            <FormatrackLogo />
            <p className="hidden sm:block font-bold text-inherit">Formatrack</p>
          </NavbarBrand>



        </NavbarContent>

        <NavbarContent as="div" className="items-center gap-4" justify="center">
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
          <div>{children}</div>



        </NavbarContent>

        <NavbarContent justify="end" className="gap-3 pr-2">
            {nombre && <p className="text-center my-4 flex items-center justify-center gap-2">{nombre}  </p>}
            <Avatar
              isBordered
              as="button"
              className="transition-transform"
              color="secondary"
              name="Usuario"
              size="sm"
            />
            <ArrowRightStartOnRectangleIcon onClick={logout} height={24} className="hover:text-red-500 cursor-pointer transition" />

          </NavbarContent>

      </Navbar>

      {/*<Modall
        ModalTitle="Notificaciones"
        isOpen={isModalOpen}
        onOpenChange={handleCloseModal}
      >
         <div className="space-y-4">
          {isLoading ? (
            <p>Cargando notificaciones...</p>
          ) : !notificaciones || notificaciones.length === 0 ? (
            <p>No tienes notificaciones nuevas.</p>
          ) : (
            notificaciones.map((n) => (
              <div
                key={`notificacion-${n.id_notificacion}`}
                className="flex flex-col p-3 border rounded-md shadow-sm"
              >
                <strong className="text-base">{n.titulo}</strong>
                <p className="text-sm text-gray-600">{n.mensaje}</p>

                {n.en_proceso && (
                  <div className="flex gap-2 mt-2">
                    {n.fk_movimiento && (
                      <>
                        <Button
                          size="sm"
                          onPress={() => aceptarMovimiento(n.fk_movimiento!)}
                        >
                          Aceptar
                        </Button>
                        <Button
                          size="sm"
                          variant="flat"
                          onPress={() => cancelarMovimiento(n.fk_movimiento!)}
                        >
                          Rechazar
                        </Button>
                      </>
                    )}

                    {n.fk_solicitud && (
                      <>
                        <Button
                          size="sm"
                          onPress={() => aceptarSolicitud(n.fk_solicitud!)}
                        >
                          Aceptar
                        </Button>
                        <Button
                          size="sm"
                          variant="flat"
                          onPress={() => cancelarSolicitud(n.fk_solicitud!)}
                        >
                          Rechazar
                        </Button>
                      </>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </Modall> */}
    </>
  );
}
