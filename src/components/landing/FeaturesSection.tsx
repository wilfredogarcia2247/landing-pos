import { motion } from "framer-motion";
import { 
  Cloud, 
  Receipt, 
  BarChart3, 
  Smartphone, 
  Shield, 
  Zap,
  Users,
  Package
} from "lucide-react";

const features = [
  {
    icon: Cloud,
    title: "100% en la Nube",
    description: "Accede a tu sistema desde cualquier dispositivo con conexión a internet. Sin instalaciones ni actualizaciones manuales.",
  },
  {
    icon: Receipt,
    title: "Facturación Fiscal",
    description: "Cumple con todas las regulaciones del SENIAT. Emisión automática de facturas fiscales con validez legal.",
  },
  {
    icon: BarChart3,
    title: "Reportes en Tiempo Real",
    description: "Visualiza tus ventas, inventario y estadísticas al instante. Toma decisiones basadas en datos reales.",
  },
  {
    icon: Smartphone,
    title: "Multi-dispositivo",
    description: "Usa tu POS desde computadoras, tablets o teléfonos. La misma experiencia en cualquier pantalla.",
  },
  {
    icon: Shield,
    title: "Seguridad Garantizada",
    description: "Tus datos están protegidos con encriptación de nivel bancario. Respaldos automáticos diarios.",
  },
  {
    icon: Zap,
    title: "Ultra Rápido",
    description: "Procesa ventas en milisegundos. Sin esperas ni demoras que afecten tu negocio.",
  },
  {
    icon: Users,
    title: "Multi-usuario",
    description: "Crea usuarios con diferentes permisos. Controla quién puede acceder a cada función.",
  },
  {
    icon: Package,
    title: "Control de Inventario",
    description: "Gestiona tu stock automáticamente. Alertas de productos bajos y reportes de movimientos.",
  },
];

const FeaturesSection = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <section id="features" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            Características
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold mb-6">
            Todo lo que Necesitas para{" "}
            <span className="text-gradient">Crecer</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Un sistema completo diseñado para negocios venezolanos que quieren
            modernizarse sin complicaciones.
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              variants={itemVariants}
              className="group p-6 rounded-2xl bg-card border border-border hover-lift cursor-default"
            >
              <div className="w-14 h-14 rounded-xl gradient-primary flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                <feature.icon className="w-7 h-7 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-heading font-semibold mb-3">
                {feature.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturesSection;
