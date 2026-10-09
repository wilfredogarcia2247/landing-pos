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
  const handleRedirect = () => {
    onOpenChange(false);
    window.location.href = DEMO_LOGIN_URL;
  };

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
          <div className="flex items-center justify-between gap-4">
            <span className="text-sm text-muted-foreground">Usuario</span>
            <span className="font-semibold">{DEMO_CREDENTIALS.username}</span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="text-sm text-muted-foreground">Clave</span>
            <span className="font-semibold">{DEMO_CREDENTIALS.password}</span>
          </div>
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
