import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { CheckCircle, Loader2, Mail, MessageSquare, Phone, User } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  registrarClientePotencialCampana,
  type CampaignLeadFormValues,
} from "@/lib/campaign-lead";

interface RegistrationFormProps {
  isOpen: boolean;
  onClose: () => void;
}

const registrationSchema = z.object({
  nombre_apellido: z.string().trim().min(3, "Ingresa tu nombre y apellido"),
  telefono: z
    .string()
    .trim()
    .min(1, "Ingresa tu teléfono")
    .refine(
      (value) => value.replace(/\D/g, "").length >= 10,
      "Ingresa un teléfono válido",
    ),
  correo: z.string().trim().email("Ingresa un correo válido"),
  quiero_recibir_correos_promociones: z.enum(["SI", "NO"], {
    required_error: "Selecciona si quieres recibir correos",
  }),
  comentario_vendedores: z.string().trim().optional().default(""),
});

const defaultValues: CampaignLeadFormValues = {
  nombre_apellido: "",
  telefono: "",
  correo: "",
  quiero_recibir_correos_promociones: "SI",
  comentario_vendedores: "",
};

const RegistrationForm = ({ isOpen, onClose }: RegistrationFormProps) => {
  const [showSuccess, setShowSuccess] = useState(false);
  const form = useForm<CampaignLeadFormValues>({
    resolver: zodResolver(registrationSchema),
    defaultValues,
  });

  useEffect(() => {
    if (isOpen) return;
    form.reset(defaultValues);
    setShowSuccess(false);
  }, [form, isOpen]);

  const onSubmit = async (values: CampaignLeadFormValues) => {
    try {
      await registrarClientePotencialCampana(values);
      setShowSuccess(true);
      toast.success("Registro enviado correctamente");
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
            Regístrate en ICARO POS
          </DialogTitle>
          <DialogDescription className="text-center">
            Completa tus datos y un asesor te contactará para continuar.
          </DialogDescription>
        </DialogHeader>

        {showSuccess ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="py-8 text-center space-y-4"
          >
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-500 text-white">
              <CheckCircle className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-heading font-bold">¡Registro exitoso!</h3>
            <p className="text-muted-foreground">
              Recibimos tu información. Pronto un asesor se pondrá en contacto contigo.
            </p>
            <Button className="w-full" onClick={onClose}>
              Cerrar
            </Button>
          </motion.div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="nombre_apellido"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Nombre y apellido <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="María Pérez" autoComplete="name" {...field} />
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
                      <Input
                        type="tel"
                        placeholder="+58 424 123 4567"
                        autoComplete="tel"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="correo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Correo electrónico <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="correo@ejemplo.com"
                        autoComplete="email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="quiero_recibir_correos_promociones"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      ¿Quieres recibir correos promocionales?{" "}
                      <span className="text-destructive">*</span>
                    </FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona una opción" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="SI">SI</SelectItem>
                        <SelectItem value="NO">NO</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="comentario_vendedores"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-start gap-2">
                      <MessageSquare className="mt-0.5 h-4 w-4 shrink-0" />
                      <span>
                        ¿Por qué buscas un sistema de punto de venta?{" "}
                        <span className="font-normal text-muted-foreground">(opcional)</span>
                      </span>
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Cuéntanos la razón, por ejemplo: controlar inventario, facturar más rápido o unificar varias cajas..."
                        rows={3}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                variant="hero"
                className="w-full"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  "Enviar registro"
                )}
              </Button>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default RegistrationForm;
