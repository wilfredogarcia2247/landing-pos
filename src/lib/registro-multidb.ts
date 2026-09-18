import { graphqlRequest } from "@/lib/graphql";

// ------------------------------------------
// Registro multidb: alta de empresa + base de datos dedicada
// Conecta con la mutación registrarMaestroCliente del backend
// (catálogo maestro_server, pública, sin JWT).
// ------------------------------------------

export type RegistroMultidbFormValues = {
  codigo: string;
  nombre_empresa: string;
};

export type RegistroMultidbResult = {
  status: string;
  content: string;
  id_empresa: number | null;
  id_conexion: number | null;
  id_base_datos: number | null;
  id_empresa_base: number | null;
  id_empresa_conexion: number | null;
  host: string | null;
  nombre_base: string | null;
};

type RegistrarMaestroClienteResponse = {
  registrarMaestroCliente: RegistroMultidbResult;
};

const REGISTRAR_MAESTRO_CLIENTE = `
  mutation RegistrarMaestroCliente($codigo: String!, $nombre_empresa: String!) {
    registrarMaestroCliente(codigo: $codigo, nombre_empresa: $nombre_empresa) {
      status
      content
      id_empresa
      id_conexion
      id_base_datos
      id_empresa_base
      id_empresa_conexion
      host
      nombre_base
    }
  }
`;

/**
 * Registra la empresa y genera su base de datos en el servidor con espacio
 * disponible (todo transaccional en el backend).
 * Devuelve el resultado completo; lanza Error si el backend reporta status=error.
 */
export async function registrarMaestroCliente(
  values: RegistroMultidbFormValues,
): Promise<RegistroMultidbResult> {
  const data = await graphqlRequest<RegistrarMaestroClienteResponse>(
    REGISTRAR_MAESTRO_CLIENTE,
    {
      codigo: values.codigo.trim(),
      nombre_empresa: values.nombre_empresa.trim(),
    },
  );

  const result = data?.registrarMaestroCliente;
  if (!result) {
    throw new Error("El servidor no devolvió respuesta del registro.");
  }
  if (result.status !== "success") {
    throw new Error(result.content || "No se pudo completar el registro.");
  }
  return result;
}