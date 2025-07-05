import { getRolPermisos } from "@/axios/RolPermiso/getPermisosRol";
import { postRolPermiso } from "@/axios/RolPermiso/postPermisosRol";
import { RolPermiso, RolPermisoPost } from "@/types/RolPermiso";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useRolPermiso() {
  const queryClient = useQueryClient();

  const { data, isLoading, isError, error } = useQuery<RolPermiso[]>({
    queryKey: ["rolPermiso"],
    queryFn: getRolPermisos,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
  });

  const addRolMutation = useMutation({
    mutationFn: postRolPermiso,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["rolPermiso"],
      });
    },
    onError: (error) => {
      console.log("Error al cargar el rol", error);
    },
  });

  const getRolPermisoById = (
    id: number,
    rolPermiso: RolPermiso[] | undefined = data
  ): RolPermiso | null => {
    return rolPermiso?.find((rolPermiso) => rolPermiso.idRolPermiso === id) || null;
  };

  const addRolPermiso = async (rolPermiso: RolPermisoPost) => {
    return addRolMutation.mutateAsync(rolPermiso);
  };


  return {
    rolPermiso: data,
    isLoading,
    isError,
    error,
    addRolPermiso,
    getRolPermisoById,
  };
}
