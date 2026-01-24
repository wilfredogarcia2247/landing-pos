import { motion } from "framer-motion";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import fiscalPrinter from "@/assets/fiscal-printer.jpg";
import posTablet from "@/assets/pos-tablet-printer.jpg";
import ecoimg from "@/assets/eco-facturacion.png";
import posimg from "@/assets/pos-usos-facturacion.png";

const integrations = [
  {
    name: "100% Digital",
    description: "Sin hardware obsoleto. Todo en la nube con acceso desde cualquier dispositivo.",
    features: [
      "Cero emisiones de papel",
      "Sin mantenimiento de equipos",
      "Acceso desde cualquier lugar",
      "Actualizaciones automáticas",
    ],
  },
  {
    name: "Eco-Friendly",
    description: "Contribuye al cuidado del planeta eliminando el desperdicio de papel y energía.",
    features: [
      "Facturas digitales certificadas",
      "Reportes en tiempo real",
      "Sin costos de impresión",
      "Huella de carbono cero",
    ],
  },
];

const IntegrationsSection = () => {
  return (
    <section id="integrations" className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="inline-block px-4 py-2 rounded-full bg-secondary/10 text-secondary text-sm font-medium mb-4">
            Integraciones
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold mb-6">
            Tecnología{" "}
            <span className="text-gradient">100% Digital</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Olvídate de hardware costoso y obsoleto. Nuestra solución en la nube
            es ecológica, económica y más eficiente.
          </p>
        </motion.div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-card">
              <img
                src={posimg}
                alt="POS V3 funcionando en tablet"
                className="w-full"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/30 to-transparent" />
            </div>
            
            {/* Floating badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="absolute -bottom-4 -right-4 glass-card rounded-xl p-4 shadow-card"
            >
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-secondary animate-pulse" />
                <span className="font-medium">100% Ecológico</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Integration Cards */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            {integrations.map((integration, index) => (
              <motion.div
                key={integration.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="p-6 rounded-2xl bg-card border border-border hover-lift"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-2xl font-heading font-bold text-gradient">
                      {integration.name}
                    </h3>
                    <p className="text-muted-foreground mt-1">
                      {integration.description}
                    </p>
                  </div>
                </div>
                <ul className="space-y-3">
                  {integration.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-secondary flex-shrink-0" />
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Printer Image */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative max-w-4xl mx-auto"
        >
          <div className="text-center mb-8">
            <h3 className="text-2xl font-heading font-bold mb-2">
              Facturación Digital Sostenible
            </h3>
            <p className="text-muted-foreground">
              Cada venta genera su factura digital certificada, sin papel ni impresoras
            </p>
          </div>
          <div className="relative rounded-2xl overflow-hidden shadow-card">
            <img
              src={ecoimg}
              alt="Dashboard digital de POS V3"
              className="w-full"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default IntegrationsSection;
