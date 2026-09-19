import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  AlertTriangle,
  Building2,
  CheckCircle,
  Database,
  IdCard,
  Loader2,
  Mail,
  MapPin,
  Phone,
  Store,
  XCircle,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  registrarMaestroCliente,
  verificarClienteMultidb,
  type RegistroMultidbFormValues,
  type RegistroMultidbResult,
  type VerificacionClienteResult,
} from "@/lib/registro-multidb";

interface RegistroMultidbFormProps {
  isOpen: boolean;
  onClose: () => void;
}

// ------------------------------------------
// Validaciones (réplica de los mensajes del preregistro PHP)
// SIMPLIFICADO: el código de empresa ES el RIF fiscal (se llena
// automáticamente) y hay UN solo teléfono para todo.
// ------------------------------------------
const registroMultidbSchema = z
  .object({
    // Empresa
    codigo: z.string(), // se llena automáticamente con el RIF (oculto)
    nombre_empresa: z.string().trim().min(1, "Falta el nombre de la empresa").max(150),
    rif: z
      .string()
      .trim()
      .toUpperCase()
      .min(1, "El rif es necesario")
      .regex(/^[JGVPE]-?\d{8,9}-?\d?$/, "Formato de RIF inválido (ej. J123456789)"),
    telefono: z.string().trim().min(1, "El telefono principal de la empresa es necesario"),
    direccion_empresa: z.string().trim().optional().default(""),
    estado: z.string().trim().optional().default(""),
    ciudad: z.string().trim().optional().default(""),
    // Sucursal principal
    nombre_sucursal: z.string().trim().min(1, "El nombre de la sucursal es necesario"),
    direccion_sucursal: z.string().trim().optional().default(""),
    // Usuario administrador
    nombre_usuario: z.string().trim().min(1, "El nombre del administrador es necesario"),
    correo_admin: z.string().trim().toLowerCase().email("El correo del administrador es necesario"),
    contrasena: z.string().min(1, "Necesita una contraseña para el registro"),
    repetir_contrasena: z.string().min(1, "Repita la contraseña"),
  })
  .refine((data) => data.contrasena === data.repetir_contrasena, {
    message: "Las contraseñas no coinciden. Por favor, verifíquelas.",
    path: ["repetir_contrasena"],
  });

type FormValues = RegistroMultidbFormValues & { repetir_contrasena: string };

const defaultValues: FormValues = {
  codigo: "",
  nombre_empresa: "",
  rif: "",
  correo_admin: "",
  contrasena: "",
  nombre_usuario: "",
  telefono: "",
  direccion_empresa: "",
  estado: "",
  ciudad: "",
  nombre_sucursal: "",
  direccion_sucursal: "",
  repetir_contrasena: "",
};

const RegistroMultidbForm = ({ isOpen, onClose }: RegistroMultidbFormProps) => {
  const [resultado, setResultado] = useState<RegistroMultidbResult | null>(null);
  const [verificacion, setVerificacion] = useState<VerificacionClienteResult | null>(null);
  const [verificando, setVerificando] = useState(false);
  const form = useForm<FormValues>({
    resolver: zodResolver(registroMultidbSchema),
    defaultValues,
    mode: "onBlur",
  });

  useEffect(() => {
    if (isOpen) return;
    form.reset(defaultValues);
    setResultado(null);
    setVerificacion(null);
  }, [form, isOpen]);

  // Verificación en vivo contra AMBAS conexiones: se dispara cuando
  // RIF + correo cumplen formato (el código ES el RIF, se llena solo).
  const rifActual = form.watch("rif");
  const correoActual = form.watch("correo_admin");
  useEffect(() => {
    const rif = (rifActual || "").trim().toUpperCase();
    const correo = (correoActual || "").trim();
    const rifOk = /^[JGVPE]-?\d{8,9}-?\d?$/.test(rif);
    const correoOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo);
    if (!rifOk || !correoOk) {
      setVerificacion(null);
      return;
    }
    let cancelado = false;
    setVerificando(true);
    verificarClienteMultidb(rif, rif, correo)
      .then((res) => {
        if (!cancelado) setVerificacion(res);
      })
      .catch(() => {
        if (!cancelado) setVerificacion(null);
      })
      .finally(() => {
        if (!cancelado) setVerificando(false);
      });
    return () => {
      cancelado = true;
    };
  }, [rifActual, correoActual]);

  const onSubmit = async (values: FormValues) => {
    // Re-verificar justo antes de enviar (evita carrera con otro registro)
    try {
      const verif = await verificarClienteMultidb(
        values.rif.trim(),
        values.rif.trim(),
        values.correo_admin.trim(),
      );
      if (!verif.puede_registrar) {
        setVerificacion(verif);
        toast.error(verif.mensajes[0] || "No se puede registrar con esos datos");
        return;
      }
    } catch {
      // Si la verificación falla, dejamos que el backend valide al registrar
    }
    try {
      const { repetir_contrasena: _omit, ...payload } = values;
      const result = await registrarMaestroCliente(payload);
      setResultado(result);
      toast.success("¡Empresa registrada y base de datos creada!");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "No se pudo completar el registro. Inténtalo de nuevo.",
      );
    }
  };

  const bloqueadoPorVerificacion = Boolean(
    verificacion && !verificacion.puede_registrar,
  );

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-heading font-bold text-center">
            Registro multidb
          </DialogTitle>
          <DialogDescription className="text-center">
            Registra tu empresa, tu sucursal principal y tu administrador.
            La base de datos dedicada se crea automáticamente.
            dedicada en la nube.
          </DialogDescription>
        </DialogHeader>

        {resultado ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="py-6 text-center space-y-4"
          >
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-500 text-white">
              <CheckCircle className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-heading font-bold">¡Todo listo!</h3>
            <p className="text-muted-foreground">
              Tu empresa quedó registrada y tu base de datos ya fue creada.
            </p>
            <div className="rounded-lg border bg-muted/40 p-4 text-left space-y-2 text-sm">
              <div className="flex justify-between gap-4">
                <span className="text-muted-foreground">Empresa</span>
                <span className="font-medium">
                  {form.getValues("nombre_empresa")}
                </span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-muted-foreground">Servidor</span>
                <span className="font-medium font-mono">{resultado.host}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-muted-foreground">Base de datos</span>
                <span className="font-medium font-mono break-all">
                  {resultado.nombre_base}
                </span>
              </div>
            </div>
            <Button className="w-full" onClick={onClose}>
              Cerrar
            </Button>
          </motion.div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              {/* Código de empresa: OCULTO — se llena automáticamente con el RIF */}
              <input type="hidden" {...form.register("codigo")} />

              <FormField
                control={form.control}
                name="rif"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <IdCard className="h-4 w-4" />
                      RIF fiscal <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="J123456789"
                        autoComplete="off"
                        className="uppercase"
                        {...field}
                        onChange={(e) => {
                          const valor = e.target.value.toUpperCase();
                          field.onChange(valor);
                          // El código de empresa ES el RIF (sincronizado)
                          form.setValue("codigo", valor);
                        }}
                      />
                    </FormControl>
                    <FormDescription>
                      Identifica tu empresa y tu base de datos. Se verifica en
                      tiempo real contra el catálogo y los clientes existentes.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Verificación en vivo (ambas conexiones) */}
              {verificando && (
                <div className="rounded-lg border bg-muted/30 p-3 text-sm text-muted-foreground flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin shrink-0" />
                  Verificando disponibilidad del RIF...
                </div>
              )}

              {!verificando && verificacion && (
                <div
                  className={`rounded-lg border p-3 text-sm space-y-2 ${
                    verificacion.puede_registrar
                      ? "border-green-500/40 bg-green-500/10"
                      : "border-destructive/40 bg-destructive/10"
                  }`}
                >
                  <div className="flex items-center gap-2 font-medium">
                    {verificacion.puede_registrar ? (
                      <CheckCircle className="h-4 w-4 text-green-600 shrink-0" />
                    ) : (
                      <XCircle className="h-4 w-4 text-destructive shrink-0" />
                    )}
                    {verificacion.puede_registrar
                      ? "RIF disponible para registro"
                      : "No se puede registrar con este RIF"}
                  </div>
                  <ul className="space-y-1 text-xs text-muted-foreground">
                    <li className="flex items-center gap-1.5">
                      {verificacion.existe_maestro ? (
                        <XCircle className="h-3 w-3 text-destructive shrink-0" />
                      ) : (
                        <CheckCircle className="h-3 w-3 text-green-600 shrink-0" />
                      )}
                      Catálogo de empresas:{" "}
                      {verificacion.existe_maestro ? "ya registrado" : "disponible"}
                    </li>
                    <li className="flex items-center gap-1.5">
                      {verificacion.existe_icarosoft ? (
                        <XCircle className="h-3 w-3 text-destructive shrink-0" />
                      ) : (
                        <CheckCircle className="h-3 w-3 text-green-600 shrink-0" />
                      )}
                      Clientes Icarosoft:{" "}
                      {verificacion.existe_icarosoft ? "ya existe" : "disponible"}
                    </li>
                    <li className="flex items-center gap-1.5">
                      {verificacion.conexion_disponible ? (
                        <CheckCircle className="h-3 w-3 text-green-600 shrink-0" />
                      ) : (
                        <AlertTriangle className="h-3 w-3 text-amber-500 shrink-0" />
                      )}
                      Servidor:{" "}
                      {verificacion.conexion_disponible
                        ? `${verificacion.conexion_disponible.host} (${verificacion.conexion_disponible.bases_activas}/${verificacion.conexion_disponible.max_bases_datos} bases)`
                        : "sin espacio disponible"}
                    </li>
                  </ul>
                  {verificacion.mensajes.length > 0 && (
                    <ul className="space-y-1 text-xs text-destructive">
                      {verificacion.mensajes.map((m) => (
                        <li key={m}>• {m}</li>
                      ))}
                    </ul>
                  )}
                </div>
              )}

              {/* ============ EMPRESA ============ */}
              <div className="space-y-4">
                <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-2">
                  <Building2 className="h-4 w-4" /> Empresa
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="nombre_empresa"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nombre de la empresa <span className="text-destructive">*</span></FormLabel>
                        <FormControl>
                          <Input placeholder="Mi Empresa C.A." autoComplete="organization" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="rif"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <IdCard className="h-4 w-4" />
                          RIF fiscal <span className="text-destructive">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="J123456789"
                            autoComplete="off"
                            className="uppercase"
                            {...field}
                            onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="codigo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Código de empresa <span className="text-destructive">*</span></FormLabel>
                        <FormControl>
                          <Input
                            placeholder="mi-empresa"
                            autoComplete="off"
                            {...field}
                            onChange={(e) => field.onChange(e.target.value.toLowerCase())}
                          />
                        </FormControl>
                        <FormDescription>Identificador único (3-30 caracteres).</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="telefono_empresa"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Phone className="h-4 w-4" />
                          Teléfono de la empresa <span className="text-destructive">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input type="tel" placeholder="+58 261 1234567" autoComplete="tel" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="celular_empresa"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Phone className="h-4 w-4" />
                          Teléfono opcional
                        </FormLabel>
                        <FormControl>
                          <Input type="tel" placeholder="+58 424 1234567" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="direccion_empresa"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          Dirección de la empresa
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="Av. Principal, Edif. X" autoComplete="street-address" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="estado"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          Estado
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="Zulia" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="ciudad"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          Ciudad
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="Maracaibo" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* ============ SUCURSAL PRINCIPAL ============ */}
              <div className="space-y-4 border-t pt-4">
                <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-2">
                  <Store className="h-4 w-4" /> Sucursal principal
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="nombre_sucursal"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nombre de sucursal <span className="text-destructive">*</span></FormLabel>
                        <FormControl>
                          <Input placeholder="Sucursal Principal" {...field} />
                        </FormControl>
                        <FormDescription>
                          Si lo dejas vacío se genera automáticamente con el RIF.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="telefono_sucursal"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Phone className="h-4 w-4" />
                          Teléfono sucursal <span className="text-destructive">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input type="tel" placeholder="+58 261 7654321" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="direccion_sucursal"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          Dirección de la sucursal
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="Av. Principal, Sector Centro" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* ============ USUARIO ADMINISTRADOR ============ */}
              <div className="space-y-4 border-t pt-4">
                <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-2">
                  <Mail className="h-4 w-4" /> Administrador
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="nombre_usuario"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Building2 className="h-4 w-4" />
                          Nombre del administrador <span className="text-destructive">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="Juan Pérez" autoComplete="name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="correo_admin"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Mail className="h-4 w-4" />
                          Correo (login) <span className="text-destructive">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="admin@empresa.com" autoComplete="email" {...field} />
                        </FormControl>
                        <FormDescription>Será su usuario de acceso al sistema.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="contrasena"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contraseña <span className="text-destructive">*</span></FormLabel>
                        <FormControl>
                          <Input type="password" autoComplete="new-password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="repetir_contrasena"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Repetir contraseña <span className="text-destructive">*</span></FormLabel>
                        <FormControl>
                          <Input type="password" autoComplete="new-password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="telefono_usuario"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Phone className="h-4 w-4" />
                          Teléfono del administrador <span className="text-destructive">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input type="tel" placeholder="+58 424 7654321" autoComplete="tel" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="rounded-lg border border-dashed bg-muted/30 p-3 text-xs text-muted-foreground flex items-start gap-2">
                <Database className="h-4 w-4 shrink-0 mt-0.5" />
                <span>
                  Al confirmar se creará tu empresa, tu sucursal principal, tu
                  usuario administrador y una base de datos dedicada en el
                  servidor con espacio disponible.
                </span>
              </div>

              <Button
                type="submit"
                variant="hero"
                className="w-full"
                disabled={form.formState.isSubmitting || verificando || bloqueadoPorVerificacion}
              >
                {form.formState.isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Creando tu base de datos...
                  </>
                ) : verificando ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Verificando...
                  </>
                ) : (
                  "Crear mi empresa y base de datos"
                )}
              </Button>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default RegistroMultidbForm;