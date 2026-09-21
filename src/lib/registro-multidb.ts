import { graphqlRequest } from "@/lib/graphql";

// ------------------------------------------
// Registro multidb: alta de empresa + base de datos dedicada
// Conecta con las operaciones maestro_* del backend
// (catálogo maestro_server, públicas, sin JWT).
// ------------------------------------------

// ------------------------------------------
// Estados y ciudades (selects dependientes)
// Usa los resolvers estadosVenezuela / ciudadesPorEstado del backend
// (tablas configuracion_estado / configuracion_ciudad).
// Se muestra el NOMBRE y se guarda el CÓDIGO.
// ------------------------------------------

export type EstadoVE = {
  codigo_estado: string;
  nombre: string | null;
};

export type CiudadVE = {
  id_configuracion_ciudad: number;
  nombre_ciudad: string | null;
  codigo_estado: string;
  cod_ciudad: string | null;
};

const ESTADOS_VENEZUELA = `
  query EstadosVenezuela {
    estadosVenezuela {
      codigo_estado
      nombre
    }
  }
`;

const CIUDADES_POR_ESTADO = `
  query CiudadesPorEstado($codigo_estado: String!) {
    ciudadesPorEstado(codigo_estado: $codigo_estado) {
      id_configuracion_ciudad
      nombre_ciudad
      codigo_estado
      cod_ciudad
    }
  }
`;

/**
 * Lista los estados de Venezuela (para el select de Estado).
 * Devuelve [{ codigo_estado, nombre }] ordenado por nombre.
 */
export async function obtenerEstadosVenezuela(): Promise<EstadoVE[]> {
  const data = await graphqlRequest<{ estadosVenezuela: EstadoVE[] }>(
    ESTADOS_VENEZUELA,
  );
  return data?.estadosVenezuela ?? [];
}

/**
 * Lista las ciudades de un estado (para el select dependiente de Ciudad).
 * Devuelve [{ id, nombre_ciudad, codigo_estado, cod_ciudad }].
 */
export async function obtenerCiudadesPorEstado(
  codigoEstado: string,
): Promise<CiudadVE[]> {
  const data = await graphqlRequest<{ ciudadesPorEstado: CiudadVE[] }>(
    CIUDADES_POR_ESTADO,
    { codigo_estado: codigoEstado },
  );
  return data?.ciudadesPorEstado ?? [];
}

export type RegistroMultidbFormValues = {
  codigo: string;          // = RIF fiscal (se llena automáticamente)
  nombre_empresa: string;
  rif: string;
  correo_admin: string;
  contrasena: string;
  nombre_usuario: string;
  telefono: string;        // único teléfono: empresa + sucursal + admin
  direccion_empresa: string;
  estado: string;
  ciudad: string;
};

export type RegistroMultidbResult = {
  status: string;
  content: string;
  id_empresa: number | null;
  id_conexion: number | null;
  id_base_datos: number | null;
  id_empresa_base: number | null;
  id_empresa_conexion: number | null;
  id_cliente_icarosoft: number | null;
  id_servicio: number | null;
  login_admin: string | null;
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
  conflictos: string[];
  campos: string[]; // nombres de campo con conflicto para marcarlos en la UI
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
  mutation RegistrarMaestroCliente(
    $codigo: String!
    $nombre_empresa: String!
    $rif: String!
    $correo_admin: String!
    $contrasena: String!
    $nombre_usuario: String
    $telefono_usuario: String
    $telefono_empresa: String
    $celular_empresa: String
    $direccion_empresa: String
    $estado: String
    $ciudad: String
    $nombre_sucursal: String
    $direccion_sucursal: String
    $telefono_sucursal: String
  ) {
    registrarMaestroCliente(
      codigo: $codigo
      nombre_empresa: $nombre_empresa
      rif: $rif
      correo_admin: $correo_admin
      contrasena: $contrasena
      nombre_usuario: $nombre_usuario
      telefono_usuario: $telefono_usuario
      telefono_empresa: $telefono_empresa
      celular_empresa: $celular_empresa
      direccion_empresa: $direccion_empresa
      estado: $estado
      ciudad: $ciudad
      nombre_sucursal: $nombre_sucursal
      direccion_sucursal: $direccion_sucursal
      telefono_sucursal: $telefono_sucursal
    ) {
      status
      content
      id_empresa
      id_conexion
      id_base_datos
      id_empresa_base
      id_empresa_conexion
      id_cliente_icarosoft
      id_servicio
      login_admin
      host
      nombre_base
    }
  }
`;

const VERIFICAR_CLIENTE = `
  query VerificarCliente($codigo: String!, $rif: String, $correo_admin: String) {
    maestro_verificar_cliente(codigo: $codigo, rif: $rif, correo_admin: $correo_admin) {
      codigo
      rif
      existe_maestro
      existe_icarosoft
      id_cliente_icarosoft
      conflictos
      campos
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
  correoAdmin?: string,
): Promise<VerificacionClienteResult> {
  const data = await graphqlRequest<VerificarClienteResponse>(
    VERIFICAR_CLIENTE,
    {
      codigo: codigo.trim(),
      rif: rif?.trim() || null,
      correo_admin: correoAdmin?.trim() || null,
    },
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
      rif: values.rif.trim().toUpperCase(),
      correo_admin: values.correo_admin.trim().toLowerCase(),
      contrasena: values.contrasena,
      nombre_usuario: values.nombre_usuario?.trim() || null,
      // Un solo teléfono para todo: empresa, sucursal y administrador
      telefono_usuario: values.telefono?.trim() || null,
      telefono_empresa: values.telefono?.trim() || null,
      celular_empresa: values.telefono?.trim() || null,
      direccion_empresa: values.direccion_empresa?.trim() || null,
      estado: values.estado?.trim() || null,
      ciudad: values.ciudad?.trim() || null,
      // Sucursal 100% automática: nombre <RIF>-SUC01 (lo genera el backend
      // cuando nombre_sucursal es null), misma dirección y teléfono.
      nombre_sucursal: null,
      direccion_sucursal: values.direccion_empresa?.trim() || null,
      telefono_sucursal: values.telefono?.trim() || null,
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