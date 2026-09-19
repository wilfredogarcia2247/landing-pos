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

const registroMultidbSchema = z.object({
  // Código de la empresa: letras/números, 3-30 caracteres (límite de la tabla)
  codigo: z
    .string()
    .trim()
    .min(3, "El código debe tener al menos 3 caracteres")
    .max(30, "El código no puede superar 30 caracteres")
    .regex(/^[a-zA-Z0-9_-]+$/, "Solo letras, números, guion y guion bajo"),
  nombre_empresa: z
    .string()
    .trim()
    .min(3, "Ingresa el nombre de tu empresa")
    .max(150, "El nombre no puede superar 150 caracteres"),
  // RIF fiscal del cliente: letra inicial + 8-9 dígitos (ej. J123456789)
  rif: z
    .string()
    .trim()
    .toUpperCase()
    .min(9, "Ingresa un RIF válido (ej. J123456789)")
    .max(12, "El RIF no puede superar 12 caracteres")
    .regex(/^[JGVPE]-?\d{8,9}-?\d?$/, "Formato de RIF inválido (ej. J123456789)"),
});

const defaultValues: RegistroMultidbFormValues = {
  codigo: "",
  nombre_empresa: "",
  rif: "",
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

  // Verificación en vivo contra AMBAS conexiones al salir de los campos.
  // El backend valida: código en maestro + RIF en clientes_datos (icarosoft)
  // + disponibilidad de conexiones. Solo consulta con ambos datos completos.
  const codigoActual = form.watch("codigo");
  const rifActual = form.watch("rif");
  useEffect(() => {
    const codigo = (codigoActual || "").trim();
    const rif = (rifActual || "").trim().toUpperCase();
    // Solo verificar cuando ambos campos cumplen el formato mínimo
    const codigoOk = codigo.length >= 3 && /^[a-zA-Z0-9_-]+$/.test(codigo);
    const rifOk = /^[JGVPE]-?\d{8,9}-?\d?$/.test(rif);
    if (!codigoOk || !rifOk) {
      setVerificacion(null);
      return;
    }
    let cancelado = false;
    setVerificando(true);
    verificarClienteMultidb(codigo, rif)
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
  }, [codigoActual, rifActual]);

  const onSubmit = async (values: FormValues) => {
    // Re-verificar justo antes de enviar (evita carrera con otro registro)
    try {
      const verif = await verificarClienteMultidb(values.codigo.trim(), values.rif.trim());
      if (!verif.puede_registrar) {
        setVerificacion(verif);
        toast.error(verif.mensajes[0] || "No se puede registrar con esos datos");
        return;
      }
    } catch {
      // Si la verificación falla, dejamos que el backend valide al registrar
    }
    try {
      const result = await registrarMaestroCliente(values);
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
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-heading font-bold text-center">
            Registro multidb
          </DialogTitle>
          <DialogDescription className="text-center">
            Registra tu empresa y genera automáticamente tu base de datos
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
              <FormField
                control={form.control}
                name="codigo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Building2 className="h-4 w-4" />
                      Código de empresa <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="mi-empresa"
                        autoComplete="off"
                        {...field}
                        onChange={(e) => field.onChange(e.target.value.toLowerCase())}
                      />
                    </FormControl>
                    <FormDescription>
                      Identificador único (3-30 caracteres). Se verifica en
                      tiempo real contra el catálogo y los clientes existentes.
                    </FormDescription>
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
                    <FormDescription>
                      Se verifica contra los clientes existentes para evitar
                      registros duplicados.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Verificación en vivo (ambas conexiones) */}
              {verificando && (
                <div className="rounded-lg border bg-muted/30 p-3 text-sm text-muted-foreground flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin shrink-0" />
                  Verificando disponibilidad del código...
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
                      ? "Código disponible para registro"
                      : "No se puede registrar con este código"}
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

              <FormField
                control={form.control}
                name="nombre_empresa"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Building2 className="h-4 w-4" />
                      Nombre de la empresa <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Mi Empresa C.A."
                        autoComplete="organization"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="rounded-lg border border-dashed bg-muted/30 p-3 text-xs text-muted-foreground flex items-start gap-2">
                <Database className="h-4 w-4 shrink-0 mt-0.5" />
                <span>
                  Al confirmar se creará automáticamente una base de datos
                  dedicada para tu empresa en el servidor con espacio disponible.
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