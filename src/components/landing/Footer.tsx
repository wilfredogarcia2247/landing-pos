import { Cloud } from "lucide-react";

const Footer = () => {
  const footerLinks = {
    Producto: [
      { label: "Características", href: "#features" },
      { label: "Precios", href: "#pricing" },
      { label: "Integraciones", href: "#integrations" },
      { label: "Demo", href: "#" },
    ],
  };

  return (
    <footer className="bg-foreground text-primary-foreground py-16">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-12 mb-12">
          {/* Brand */}
          <div className="flex-1">
            <a href="#" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
                <Cloud className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="text-xl font-heading font-bold">POS V3</span>
            </a>
            <p className="text-primary-foreground/70 mb-6 max-w-md">
              El sistema POS en la nube líder en Venezuela con integración
              fiscal completa.
            </p>
          </div>

          {/* Links */}
          <div className="flex-1">
            <h4 className="font-heading font-semibold mb-4">Producto</h4>
            <div className="flex flex-wrap gap-6">
              {footerLinks.Producto.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-primary-foreground/70 hover:text-primary-foreground transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-primary-foreground/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-primary-foreground/60 text-sm">
            © 2026 Icarosoft. Todos los derechos reservados.
          </p>
          <p className="text-primary-foreground/60 text-sm">
            Hecho con ❤️ en Venezuela 🇻🇪
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
