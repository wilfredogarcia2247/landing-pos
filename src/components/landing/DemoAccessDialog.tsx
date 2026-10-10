import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type DemoAccessDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const DEMO_LOGIN_URL = "https://pos-prod.apps.icarosoft.com/login";
export const DEMO_CREDENTIALS = {
  username: "posdemo@icaro.com",
  password: "c123456",
};

const DemoAccessDialog = ({ open, onOpenChange }: DemoAccessDialogProps) => {
  const [copied, setCopied] = useState<string | null>(null);

  const handleRedirect = () => {
    onOpenChange(false);
    window.location.href = DEMO_LOGIN_URL;
  };

  const handleCopy = async (label: string, value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(label);
      toast.success(`${label} copiado`);
      setTimeout(() => setCopied(null), 2000);
    } catch {
      toast.error("No se pudo copiar");
    }
  };

  const credentials = [
    { label: "Usuario", value: DEMO_CREDENTIALS.username },
    { label: "Clave", value: DEMO_CREDENTIALS.password },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Acceso demo</DialogTitle>
          <DialogDescription>
            Usa estas credenciales para ingresar al demo de ICARO POS.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 rounded-lg border border-border bg-muted/30 p-4">
          {credentials.map(({ label, value }) => (
            <div key={label} className="flex items-center justify-between gap-4">
              <span className="text-sm text-muted-foreground">{label}</span>
              <div className="flex items-center gap-2">
                <span className="font-semibold">{value}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  aria-label={`Copiar ${label}`}
                  onClick={() => handleCopy(label, value)}
                >
                  {copied === label ? (
                    <Check className="h-4 w-4 text-green-600" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          ))}
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cerrar
          </Button>
          <Button variant="hero" onClick={handleRedirect}>
            Iniciar sesión
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DemoAccessDialog;
