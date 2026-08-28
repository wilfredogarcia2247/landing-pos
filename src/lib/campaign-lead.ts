import { graphqlRequest } from "@/lib/graphql";

export type PromocionesOption = "SI" | "NO";

export type CampaignLeadFormValues = {
  nombre_apellido: string;
  telefono: string;
  correo: string;
  quiero_recibir_correos_promociones: PromocionesOption;
  comentario_vendedores: string;
};

type ClientePotencialCampanaInput = Omit<CampaignLeadFormValues, "comentario_vendedores"> & {
  codigo_estado: string;
  codigo_ciudad: string;
  observacion: string;
  promocion: string;
  coordenada: string;
  status: string;
  comentario_vendedores: string;
  usuario_vendedor: string;
  codigo_turno_vendedor: string;
  ip_estacion: string;
  fecha: string;
  empresa: string;
  sucursal: string;
  usr_nivel: string;
  origen: string;
};

type RegistrarClientePotencialCampanaResult = {
  registrarClientePotencialCampana: {
    nombre_apellido: string;
    telefono: string;
    correo: string;
    codigo_estado: string;
    codigo_ciudad: string;
    status: string;
    usuario_vendedor: string;
    codigo_turno_vendedor: string;
    ip_estacion: string;
    empresa: string;
    sucursal: string;
    quiero_recibir_correos_promociones: string;
    origen: string;
    fecha: string;
  };
};

const REGISTRAR_CLIENTE_POTENCIAL_CAMPANA = `
  mutation RegistrarClientePotencialCampana($input: ClientePotencialCampanaInput!) {
    registrarClientePotencialCampana(input: $input) {
      nombre_apellido
      telefono
      correo
      codigo_estado
      codigo_ciudad
      status
      usuario_vendedor
      codigo_turno_vendedor
      ip_estacion
      empresa
      sucursal
      quiero_recibir_correos_promociones
      origen
      fecha
    }
  }
`;

const FIXED_LEAD_INPUT = {
  codigo_estado: "VE-V",
  codigo_ciudad: "MAR",
  observacion: "Estoy Interesado En IcaroPos",
  promocion: "",
  coordenada: "",
  status: "PEND",
  usuario_vendedor: "POS_WEB",
  codigo_turno_vendedor: "S/N",
  ip_estacion: "S/N",
  empresa: "icarosoft",
  sucursal: "icarosofmcbo",
  usr_nivel: "9",
  origen: "Pos Landing Page",
} as const;

function nowInCaracas() {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "America/Caracas",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).formatToParts(new Date());

  const get = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((part) => part.type === type)?.value ?? "";

  return `${get("year")}-${get("month")}-${get("day")} ${get("hour")}:${get("minute")}:${get("second")}`;
}

export async function registrarClientePotencialCampana(values: CampaignLeadFormValues) {
  const input: ClientePotencialCampanaInput = {
    ...FIXED_LEAD_INPUT,
    ...values,
    comentario_vendedores: values.comentario_vendedores.trim() || "S/N",
    fecha: nowInCaracas(),
  };

  return graphqlRequest<RegistrarClientePotencialCampanaResult>(
    REGISTRAR_CLIENTE_POTENCIAL_CAMPANA,
    { input },
  );
}
