import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Building2, CheckCircle, Database, Loader2 } from "lucide-react";
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
  type RegistroMultidbFormValues,
  type RegistroMultidbResult,
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
});

type FormValues = z.infer<typeof registroMultidbSchema>;

const defaultValues: RegistroMultidbFormValues = {
  codigo: "",
  nombre_empresa: "",
};

const RegistroMultidbForm = ({ isOpen, onClose }: RegistroMultidbFormProps) => {
  const [resultado, setResultado] = useState<RegistroMultidbResult | null>(null);
  const form = useForm<FormValues>({
    resolver: zodResolver(registroMultidbSchema),
    defaultValues,
  });

  useEffect(() => {
    if (isOpen) return;
    form.reset(defaultValues);
    setResultado(null);
  }, [form, isOpen]);

  const onSubmit = async (values: FormValues) => {
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
                      Identificador único (3-30 caracteres). Se usará para nombrar
                      tu base de datos.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

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
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Creando tu base de datos...
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