import { motion } from "framer-motion";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import fiscalPrinter from "@/assets/fiscal-printer.jpg";
import posTablet from "@/assets/pos-tablet-printer.jpg";

const integrations = [
  {
    name: "UNIDIGITAL",
    description: "Impresoras fiscales certificadas por el SENIAT para comercios de todos los tamaños.",
    features: [
      "Conexión automática USB/Serial",
      "Impresión de facturas en segundos",
      "Reportes Z y X automáticos",
      "Soporte técnico incluido",
    ],
  },
  {
    name: "THK FACTORY",
    description: "La marca líder en equipos fiscales de Venezuela con máxima confiabilidad.",
    features: [
      "Compatibilidad total garantizada",
      "Sincronización en tiempo real",
      "Configuración guiada paso a paso",
      "Actualizaciones automáticas",
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
            Compatible con tus{" "}
            <span className="text-gradient">Impresoras Fiscales</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Conecta tu impresora fiscal en minutos y comienza a emitir facturas
            legales de inmediato.
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
                src={posTablet}
                alt="POS con impresora fiscal"
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
                <span className="font-medium">Conectado al SENIAT</span>
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
              Impresión Fiscal Instantánea
            </h3>
            <p className="text-muted-foreground">
              Cada venta genera automáticamente su factura fiscal impresa
            </p>
          </div>
          <div className="relative rounded-2xl overflow-hidden shadow-card">
            <img
              src={fiscalPrinter}
              alt="Impresora fiscal"
              className="w-full"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default IntegrationsSection;
