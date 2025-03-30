import { User } from "@/pages/usuarios"; // Asegúrate de importar correctamente el tipo User

const getUserById = (users: User[] | undefined, id: number): User | null => {
    return users?.find((user) => user.id_usuario === id) || null;
};

export default getUserById;
