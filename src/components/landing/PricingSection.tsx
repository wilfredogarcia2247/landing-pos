import { motion } from "framer-motion";
import { CheckCircle2, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

const plans = [
  {
    name: "Starter",
    price: "10",
    description: "Perfecto para negocios con bajo volumen de facturación",
    features: [
      "Hasta 100 facturas al mes",
      "1 punto de venta",
      "Hasta 500 productos",
      "Reportes básicos",
      "Soporte por email",
      "1 usuario",
    ],
    popular: false,
    cta: "Comenzar",
  },
  {
    name: "Profesional",
    price: "25",
    description: "Ideal para negocios con volumen moderado de facturación",
    features: [
      "Hasta 500 facturas al mes",
      "3 puntos de venta",
      "Productos ilimitados",
      "Soporte prioritario",
      "5 usuarios",
      "Control de inventario",
    ],
    popular: true,
    cta: "Más Popular",
  },
  {
    name: "Empresarial",
    price: "50",
    description: "Para empresas con alto volumen de facturación",
    features: [
      "Facturas ilimitadas",
      "Puntos de venta ilimitados",
      "Productos ilimitados",
      "Reportes personalizados",
      "Soporte dedicado",
      "Usuarios ilimitados",
      "Capacitación incluida",
    ],
    popular: false,
    cta: "Contactar Ventas",
  },
];

const PricingSection = () => {
  return (
    <section id="pricing" className="py-24 bg-muted/30">
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
            Precios
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold mb-6">
            Precios por{" "}
            <span className="text-gradient">Volumen de Facturación</span>
          </h2>
          <p className="text-lg text-muted-foreground mb-4">
            Paga solo por lo que usas. Planes basados en cantidad de facturas emitidas.
            Desde $10 USD al mes.
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-sm font-medium">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            Pagos en bolívares a tasa BCV del día
          </div>
          <p className="text-sm text-muted-foreground mt-3">
            Los precios en USD son referenciales. El cobro se realiza en bolívares venezolanos
            utilizando la tasa de cambio oficial del Banco Central de Venezuela.
          </p>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              className={`relative p-8 rounded-2xl ${
                plan.popular
                  ? "bg-card border-2 border-primary shadow-card scale-105"
                  : "bg-card border border-border"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <div className="flex items-center gap-1 px-4 py-1.5 rounded-full gradient-primary text-primary-foreground text-sm font-medium">
                    <Zap className="w-4 h-4" />
                    Más Popular
                  </div>
                </div>
              )}

              <div className="text-center mb-8">
                <h3 className="text-xl font-heading font-bold mb-2">
                  {plan.name}
                </h3>
                <p className="text-muted-foreground text-sm mb-4">
                  {plan.description}
                </p>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-4xl md:text-5xl font-heading font-bold">
                    ${plan.price}
                  </span>
                  <span className="text-muted-foreground">/mes</span>
                </div>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-secondary flex-shrink-0" />
                    <span className="text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                variant={plan.popular ? "hero" : "outline"}
                className="w-full"
                size="lg"
                onClick={() => {
                  const message = encodeURIComponent(`Hola, estoy interesado en el plan "${plan.name}" de POS V3. ¿Podrían darme más información?`);
                  window.open(`https://wa.me/584246434313?text=${message}`, '_blank');
                }}
              >
                {plan.cta}
              </Button>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default PricingSection;
