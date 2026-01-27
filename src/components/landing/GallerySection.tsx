import { motion } from "framer-motion";
import { useState } from "react";
import heroDashboard from "@/assets/hero-principal.png";
import posStore from "@/assets/pos-store-usage.jpg";
import posTablet from "@/assets/pos-usos-facturacion.png";
import negocioNube from "@/assets/negocio-nube.png";
const galleryItems = [
  {
    image: heroDashboard,
    title: "Dashboard Principal",
    description: "Visualiza todas tus métricas importantes en un solo lugar",
  },
  {
    image: negocioNube,
    title: "Acceso Total desde cualquier Dispositivo",
    description: "Gestiona tu negocio desde cualquier lugar, en cualquier momento, con total accesibilidad",
  },
  {
    image: posStore,
    title: "Punto de Venta",
    description: "Interfaz intuitiva para atender clientes rápidamente",
  },
  {
    image: posTablet,
    title: "Sistema Completo",
    description: "Hardware y software trabajando en perfecta armonía",
  },
];

const GallerySection = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section id="gallery" className="py-24 bg-background overflow-hidden">
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
            Galería
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold mb-6 text-foreground">
            Conoce{" "}
            <span className="text-gradient">POS V3</span> por Dentro
          </h2>
          <p className="text-lg text-foreground/90">
            Una experiencia visual diseñada para facilitar cada aspecto de tu
            negocio.
          </p>
        </motion.div>

        {/* Main Gallery */}
        <div className="relative">
          {/* Featured Image */}
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="relative rounded-2xl overflow-hidden shadow-card mb-8"
          >
            <div className="aspect-video">
              <img
                src={galleryItems[activeIndex].image}
                alt={galleryItems[activeIndex].title}
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <h3 className="text-2xl md:text-3xl font-heading font-bold text-white mb-2">
                  {galleryItems[activeIndex].title}
                </h3>
                <p className="text-white/95 text-lg">
                  {galleryItems[activeIndex].description}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Thumbnails */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {galleryItems.map((item, index) => (
              <motion.button
                key={item.title}
                onClick={() => setActiveIndex(index)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`relative rounded-xl overflow-hidden aspect-video transition-all duration-300 ${
                  index === activeIndex
                    ? "ring-4 ring-primary shadow-card"
                    : "opacity-70 hover:opacity-100"
                }`}
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-foreground/20" />
                <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-foreground/80 to-transparent">
                  <p className="text-sm font-medium text-primary-foreground text-left">
                    {item.title}
                  </p>
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16"
        >
          {[
            { value: "0", label: "Negocios Activos" },
            { value: "0", label: "Facturas Emitidas" },
            { value: "99.9%", label: "Uptime Garantizado" },
            { value: "24/7", label: "Soporte Técnico" },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="text-center p-6 rounded-2xl bg-card border border-border"
            >
              <div className="text-3xl md:text-4xl font-heading font-bold text-gradient mb-2">
                {stat.value}
              </div>
              <div className="text-muted-foreground">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default GallerySection;
