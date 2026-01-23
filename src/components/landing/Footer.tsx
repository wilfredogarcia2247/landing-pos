import { Cloud, Facebook, Instagram, Twitter, Linkedin } from "lucide-react";

const Footer = () => {
  const footerLinks = {
    Producto: [
      { label: "Características", href: "#features" },
      { label: "Precios", href: "#pricing" },
      { label: "Integraciones", href: "#integrations" },
      { label: "Demo", href: "#" },
    ],
    Soporte: [
      { label: "Centro de Ayuda", href: "#" },
      { label: "Documentación", href: "#" },
      { label: "Estado del Sistema", href: "#" },
      { label: "Contacto", href: "#" },
    ],
    Empresa: [
      { label: "Sobre Nosotros", href: "#" },
      { label: "Blog", href: "#" },
      { label: "Carreras", href: "#" },
      { label: "Prensa", href: "#" },
    ],
    Legal: [
      { label: "Privacidad", href: "#" },
      { label: "Términos", href: "#" },
      { label: "Cookies", href: "#" },
    ],
  };

  const socialLinks = [
    { icon: Facebook, href: "#" },
    { icon: Instagram, href: "#" },
    { icon: Twitter, href: "#" },
    { icon: Linkedin, href: "#" },
  ];

  return (
    <footer className="bg-foreground text-primary-foreground py-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 lg:grid-cols-6 gap-8 mb-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <a href="#" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
                <Cloud className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="text-xl font-heading font-bold">CloudPOS</span>
            </a>
            <p className="text-primary-foreground/70 mb-6 max-w-xs">
              El sistema POS en la nube líder en Venezuela con integración
              fiscal completa.
            </p>
            <div className="flex gap-4">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className="w-10 h-10 rounded-lg bg-primary-foreground/10 flex items-center justify-center hover:bg-primary-foreground/20 transition-colors"
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="font-heading font-semibold mb-4">{title}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-primary-foreground/70 hover:text-primary-foreground transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-primary-foreground/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-primary-foreground/60 text-sm">
            © 2024 CloudPOS. Todos los derechos reservados.
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
