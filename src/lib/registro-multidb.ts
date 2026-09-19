import { graphqlRequest } from "@/lib/graphql";

// ------------------------------------------
// Registro multidb: alta de empresa + base de datos dedicada
// Conecta con las operaciones maestro_* del backend
// (catálogo maestro_server, públicas, sin JWT).
// ------------------------------------------

export type RegistroMultidbFormValues = {
  codigo: string;
  nombre_empresa: string;
  rif: string;
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

// Resultado de la verificación previa (toca ambas conexiones)
export type VerificacionClienteResult = {
  codigo: string;
  rif: string | null;
  existe_maestro: boolean;
  existe_icarosoft: boolean;
  id_cliente_icarosoft: number | null;
  conexion_disponible: {
    id_conexion: number;
    host: string;
    max_bases_datos: number;
    bases_activas: number;
  } | null;
  puede_registrar: boolean;
  mensajes: string[];
};

type RegistrarMaestroClienteResponse = {
  registrarMaestroCliente: RegistroMultidbResult;
};

type VerificarClienteResponse = {
  maestro_verificar_cliente: VerificacionClienteResult;
};

const REGISTRAR_MAESTRO_CLIENTE = `
  mutation RegistrarMaestroCliente($codigo: String!, $nombre_empresa: String!, $rif: String!) {
    registrarMaestroCliente(codigo: $codigo, nombre_empresa: $nombre_empresa, rif: $rif) {
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

const VERIFICAR_CLIENTE = `
  query VerificarCliente($codigo: String!, $rif: String) {
    maestro_verificar_cliente(codigo: $codigo, rif: $rif) {
      codigo
      rif
      existe_maestro
      existe_icarosoft
      id_cliente_icarosoft
      conexion_disponible {
        id_conexion
        host
        max_bases_datos
        bases_activas
      }
      puede_registrar
      mensajes
    }
  }
`;

/**
 * Verificación previa: toca AMBAS conexiones del backend.
 * 1) maestro_server.empresas — ¿código ya registrado?
 * 2) base admin Icarosoft (clientes_datos) — ¿RIF ya existe como cliente?
 * 3) ¿hay conexión con espacio disponible?
 */
export async function verificarClienteMultidb(
  codigo: string,
  rif?: string,
): Promise<VerificacionClienteResult> {
  const data = await graphqlRequest<VerificarClienteResponse>(
    VERIFICAR_CLIENTE,
    { codigo: codigo.trim(), rif: rif?.trim() || null },
  );
  return data?.maestro_verificar_cliente;
}

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
      rif: values.rif.trim(),
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