import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  AlertTriangle,
  CheckCircle,
  IdCard,
  Loader2,
  Mail,
  Phone,
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
    // Sucursal principal: se genera automáticamente (<RIF>-SUC01)
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
  repetir_contrasena: "",
};

const RegistroMultidbForm = ({ isOpen, onClose }: RegistroMultidbFormProps) => {
  const [resultado, setResultado] = useState<RegistroMultidbResult | null>(null);
  const [verificacion, setVerificacion] = useState<VerificacionClienteResult | null>(null);
  const [verificando, setVerificando] = useState(false);
  // Wizard: 1 = Empresa (RIF + datos), 2 = Administrador
  const [paso, setPaso] = useState(1);
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
    setPaso(1);
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

  // Avanzar al paso 2 solo si los campos del paso 1 son válidos
  const irAPaso2 = async () => {
    const valido = await form.trigger(["rif", "nombre_empresa", "telefono"]);
    if (!valido) return;
    // Si hay verificación y falló, no avanzar
    if (verificacion && !verificacion.puede_registrar) {
      toast.error(verificacion.mensajes[0] || "No se puede registrar con este RIF");
      return;
    }
    setPaso(2);
  };

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
        setPaso(1); // volver al paso del RIF para que vea el problema
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

  // Campos con conflicto (del backend): se marcan en rojo y se hace focus
  // en el primero para que el usuario sepa exactamente qué corregir.
  const camposConflicto: string[] = verificacion?.campos ?? [];
  const campoConError = (nombre: string) => camposConflicto.includes(nombre);
  const estiloCampoConflicto =
    "border-destructive ring-1 ring-destructive/40 focus-visible:ring-destructive";

  // Al llegar una verificación con conflictos, enfocar el primer campo afectado
  useEffect(() => {
    if (!verificacion || verificacion.puede_registrar) return;
    const orden = ["rif", "nombre_empresa", "correo_admin"];
    const primero = orden.find((c) => verificacion.campos.includes(c));
    if (primero) {
      // Pequeño delay para que el panel de verificación ya esté pintado
      const t = setTimeout(() => {
        const el = document.querySelector<HTMLInputElement>(
          `[name="${primero}"]:not([type="hidden"])`,
        );
        el?.focus();
        el?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 150);
      return () => clearTimeout(t);
    }
  }, [verificacion]);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-1">
          <DialogTitle className="text-xl font-heading font-bold text-center">
            Crea tu empresa en ICARO POS
          </DialogTitle>
          <DialogDescription className="text-center text-sm">
            Completa los datos y tu base de datos dedicada se crea automáticamente.
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

              {/* ============ INDICADOR DE PASOS ============ */}
              <div className="flex items-center justify-center gap-2 pb-1">
                <button
                  type="button"
                  onClick={() => setPaso(1)}
                  className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                    paso === 1
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:bg-accent"
                  }`}
                >
                  <span className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold ${paso === 1 ? "bg-primary-foreground/20" : "bg-background"}`}>1</span>
                  Empresa
                </button>
                <div className={`h-px w-8 ${paso === 2 ? "bg-primary" : "bg-border"}`} />
                <button
                  type="button"
                  onClick={() => {
                    // Permitir ir al paso 2 solo si el paso 1 es válido
                    form.trigger(["rif", "nombre_empresa", "telefono"]).then((ok) => ok && setPaso(2));
                  }}
                  className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                    paso === 2
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:bg-muted/70"
                  }`}
                >
                  <span className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold ${paso === 2 ? "bg-primary-foreground/20" : "bg-background"}`}>2</span>
                  Administrador
                </button>
              </div>

              {/* ============ PASO 1: EMPRESA (RIF + datos) ============ */}
              {paso === 1 && (
                <motion.div
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-4"
                >
                  {/* RIF destacado dentro de la sección de empresa */}
                  <div className="rounded-xl border-2 border-primary/30 bg-primary/5 p-4 space-y-3">
                    <div className="flex items-center gap-2">
                      <IdCard className="h-4 w-4 text-primary" />
                      <h4 className="text-sm font-semibold">RIF fiscal de tu empresa</h4>
                    </div>

                    <FormField
                      control={form.control}
                      name="rif"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              placeholder="J123456789"
                              autoComplete="off"
                              className={`uppercase h-11 text-base font-semibold tracking-wide ${
                                campoConError("rif") ? estiloCampoConflicto : ""
                              }`}
                              {...field}
                              onChange={(e) => {
                                const valor = e.target.value.toUpperCase();
                                field.onChange(valor);
                                // El código de empresa ES el RIF (sincronizado)
                                form.setValue("codigo", valor);
                              }}
                            />
                          </FormControl>
                          <FormDescription className="text-xs">
                            Identifica tu empresa y tu base de datos. Verificación en tiempo real.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Verificación en vivo (ambas conexiones) */}
                    {verificando && (
                      <div className="rounded-lg border bg-background/60 p-2.5 text-sm text-muted-foreground flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin shrink-0" />
                        Verificando disponibilidad del RIF...
                      </div>
                    )}

                    {!verificando && verificacion && (
                      <div
                        className={`rounded-lg border p-2.5 text-sm space-y-1.5 ${
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
                          <ul className="space-y-1 text-xs">
                            {verificacion.mensajes.map((m) => (
                              <li key={m} className="flex items-start gap-1.5 text-destructive font-medium">
                                <XCircle className="h-3 w-3 mt-0.5 shrink-0" />
                                <span>{m}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Datos de la empresa */}
                  <div className="rounded-xl border p-4 space-y-4">
                    <h4 className="text-sm font-semibold">Datos de la empresa</h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-4">
                      <FormField
                        control={form.control}
                        name="nombre_empresa"
                        render={({ field }) => (
                          <FormItem className="md:col-span-2">
                            <FormLabel>
                              Nombre de la empresa <span className="text-destructive">*</span>
                              {campoConError("nombre_empresa") && (
                                <span className="ml-1 text-xs font-normal text-destructive">— ya existe, cambia el nombre</span>
                              )}
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Mi Empresa C.A."
                                autoComplete="organization"
                                className={campoConError("nombre_empresa") ? estiloCampoConflicto : ""}
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="telefono"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2">
                              <Phone className="h-4 w-4" />
                              Teléfono <span className="text-destructive">*</span>
                            </FormLabel>
                            <FormControl>
                              <Input type="tel" placeholder="+58 424 1234567" autoComplete="tel" {...field} />
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
                            <FormLabel>Estado</FormLabel>
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
                            <FormLabel>Ciudad</FormLabel>
                            <FormControl>
                              <Input placeholder="Maracaibo" {...field} />
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
                            <FormLabel>Dirección</FormLabel>
                            <FormControl>
                              <Input placeholder="Av. Principal, Edif. X" autoComplete="street-address" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <Button
                    type="button"
                    variant="hero"
                    className="w-full h-11"
                    onClick={irAPaso2}
                  >
                    Continuar
                  </Button>
                </motion.div>
              )}

              {/* ============ PASO 2: ADMINISTRADOR ============ */}
              {paso === 2 && (
                <motion.div
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-4"
                >
                  <div className="rounded-xl border p-4 space-y-4">
                    <h4 className="text-sm font-semibold">Usuario administrador</h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-4">
                      <FormField
                        control={form.control}
                        name="nombre_usuario"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nombre <span className="text-destructive">*</span></FormLabel>
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
                              {campoConError("correo_admin") && (
                                <span className="text-xs font-normal text-destructive">— no disponible</span>
                              )}
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="email"
                                placeholder="admin@empresa.com"
                                autoComplete="email"
                                className={campoConError("correo_admin") ? estiloCampoConflicto : ""}
                                {...field}
                              />
                            </FormControl>
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
                    </div>
                    <p className="text-xs text-muted-foreground">
                      El correo será su usuario de acceso al sistema.
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      className="flex-1 h-11"
                      onClick={() => setPaso(1)}
                      disabled={form.formState.isSubmitting}
                    >
                      Atrás
                    </Button>
                    <Button
                      type="submit"
                      variant="hero"
                      className="flex-[2] h-11"
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
                  </div>
                </motion.div>
              )}
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default RegistroMultidbForm;