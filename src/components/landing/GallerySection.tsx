import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import slide01 from "@/assets/gallery/slide-01.webp";
import slide02 from "@/assets/gallery/slide-02.webp";
import slide03 from "@/assets/gallery/slide-03.webp";
import slide04 from "@/assets/gallery/slide-04.webp";
import slide05 from "@/assets/gallery/slide-05.webp";
import slide06 from "@/assets/gallery/slide-06.webp";
import slide07 from "@/assets/gallery/slide-07.webp";
import slide08 from "@/assets/gallery/slide-08.webp";
import slide09 from "@/assets/gallery/slide-09.webp";
import slide10 from "@/assets/gallery/slide-10.webp";
import slide11 from "@/assets/gallery/slide-11.webp";
import slide12 from "@/assets/gallery/slide-12.webp";
import slide13 from "@/assets/gallery/slide-13.webp";
import slide14 from "@/assets/gallery/slide-14.webp";
import slide15 from "@/assets/gallery/slide-15.webp";
import slide16 from "@/assets/gallery/slide-16.webp";
import slide17 from "@/assets/gallery/slide-17.webp";

const AUTOPLAY_MS = 4500;

const galleryItems = [
  {
    image: slide01,
    title: "Todo lo que tu negocio necesita",
    description: "Vende, controla y crece desde cualquier dispositivo.",
  },
  {
    image: slide02,
    title: "Cajas y turnos en tiempo real",
    description: "Supervisa aperturas, cierres y cada punto de venta.",
  },
  {
    image: slide03,
    title: "Inventario inteligente",
    description: "Reponer a tiempo y evitar quiebres de stock.",
  },
  {
    image: slide04,
    title: "Compras y proveedores",
    description: "Centraliza compras y cuida tu rentabilidad.",
  },
  {
    image: slide05,
    title: "Más formas de cobro",
    description: "Bancos, pagos móviles y tasa referencial al día.",
  },
  {
    image: slide06,
    title: "Equipo seguro y bien gestionado",
    description: "Usuarios, permisos y sesiones bajo control.",
  },
  {
    image: slide07,
    title: "Notas de débito sin complicaciones",
    description: "Ajusta cargos con respaldo fiscal y trazabilidad.",
  },
  {
    image: slide08,
    title: "Cumplimiento y resultados claros",
    description: "Notas de crédito, libro de ventas y de compras.",
  },
  {
    image: slide09,
    title: "Cotizaciones que se convierten en ventas",
    description: "Crea, comparte y da seguimiento a cada presupuesto.",
  },
  {
    image: slide10,
    title: "Dashboard claro y accionable",
    description: "Ventas, facturas, clientes y tasa en una sola vista.",
  },
  {
    image: slide11,
    title: "Clientes con más orden y precisión",
    description: "Consulta RIF, contactos y direcciones al instante.",
  },
  {
    image: slide12,
    title: "Actualiza clientes sin fricción",
    description: "Formularios claros para editar datos en segundos.",
  },
  {
    image: slide13,
    title: "Facturas en un solo lugar",
    description: "Correlativos, montos, estados y notas aplicadas.",
  },
  {
    image: slide14,
    title: "Facturación fiscal profesional",
    description: "Documentos claros, con totales, pagos y detalle fiscal.",
  },
  {
    image: slide15,
    title: "POS ágil e intuitivo",
    description: "Vende más rápido con carrito, stock e impuestos a la vista.",
  },
  {
    image: slide16,
    title: "Busca y factura en segundos",
    description: "Localiza al cliente por documento y cierra la venta.",
  },
  {
    image: slide17,
    title: "Acceso simple y seguro",
    description: "Entra a ICARO POS con una experiencia profesional.",
  },
];

const GallerySection = () => {
  const autoplay = useRef(
    Autoplay({
      delay: AUTOPLAY_MS,
      stopOnInteraction: false,
      stopOnMouseEnter: true,
      stopOnFocusIn: true,
    }),
  );
  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      align: "center",
      skipSnaps: false,
      duration: 32,
    },
    [autoplay.current],
  );
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
    setIsPlaying(Boolean(autoplay.current.isPlaying()));
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    emblaApi.on("autoplay:play", onSelect);
    emblaApi.on("autoplay:stop", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
      emblaApi.off("autoplay:play", onSelect);
      emblaApi.off("autoplay:stop", onSelect);
    };
  }, [emblaApi, onSelect]);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const applyPreference = () => {
      if (media.matches) {
        autoplay.current.stop();
        setIsPlaying(false);
      }
    };
    applyPreference();
    media.addEventListener("change", applyPreference);
    return () => media.removeEventListener("change", applyPreference);
  }, []);

  const scrollTo = (index: number) => emblaApi?.scrollTo(index);
  const scrollPrev = () => emblaApi?.scrollPrev();
  const scrollNext = () => emblaApi?.scrollNext();

  const togglePlayback = () => {
    if (autoplay.current.isPlaying()) {
      autoplay.current.stop();
      setIsPlaying(false);
      return;
    }
    autoplay.current.play();
    setIsPlaying(true);
  };

  const active = galleryItems[selectedIndex];

  return (
    <section id="gallery" className="py-24 bg-background overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-14"
        >
          <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            Galería
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold mb-6 text-foreground">
            Conoce{" "}
            <span className="text-gradient">ICARO POS</span> por Dentro
          </h2>
          <p className="text-lg text-foreground/90">
            Recorre cada módulo del sistema. El carrusel avanza solo, con una
            transición suave entre pantallas.
          </p>
        </motion.div>
      </div>

      <div className="relative">
        <div className="pointer-events-none absolute inset-y-8 left-0 z-10 w-10 bg-gradient-to-r from-background to-transparent md:w-28" />
        <div className="pointer-events-none absolute inset-y-8 right-0 z-10 w-10 bg-gradient-to-l from-background to-transparent md:w-28" />

        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex touch-pan-y">
            {galleryItems.map((item, index) => {
              const isActive = index === selectedIndex;
              return (
                <div
                  key={item.title}
                  className="min-w-0 shrink-0 grow-0 basis-[82%] px-2 sm:basis-[58%] md:basis-[42%] lg:basis-[34%] xl:basis-[28%]"
                >
                  <button
                    type="button"
                    onClick={() => scrollTo(index)}
                    aria-label={`Ver ${item.title}`}
                    aria-current={isActive ? "true" : undefined}
                    className={cn(
                      "block w-full overflow-hidden rounded-3xl bg-card text-left shadow-card transition-all duration-700 ease-out",
                      isActive
                        ? "scale-100 opacity-100 ring-2 ring-primary/70 shadow-glow"
                        : "scale-[0.88] opacity-45 hover:opacity-80",
                    )}
                  >
                    <div className="aspect-[4/5]">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="h-full w-full object-cover"
                        loading={index < 3 ? "eager" : "lazy"}
                        decoding="async"
                        fetchPriority={index === 0 ? "high" : "auto"}
                      />
                    </div>
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        <div className="container mx-auto px-4">
          <div className="relative mx-auto mt-8 max-w-3xl text-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={active.title}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              >
                <h3 className="mb-2 font-heading text-2xl font-bold text-foreground md:text-3xl">
                  {active.title}
                </h3>
                <p className="text-muted-foreground md:text-lg">
                  {active.description}
                </p>
              </motion.div>
            </AnimatePresence>

            <div
              className="mx-auto mt-6 h-1 max-w-xs overflow-hidden rounded-full bg-border"
              data-paused={isPlaying ? "false" : "true"}
            >
              <div
                key={`${selectedIndex}-${isPlaying}`}
                className={cn(
                  "h-full origin-left rounded-full bg-primary",
                  isPlaying && "gallery-progress-bar",
                )}
                style={isPlaying ? { animationDuration: `${AUTOPLAY_MS}ms` } : { transform: "scaleX(0.15)" }}
              />
            </div>

            <div className="mt-6 flex items-center justify-center gap-3">
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="h-11 w-11 rounded-full"
                onClick={scrollPrev}
                aria-label="Imagen anterior"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="h-11 w-11 rounded-full"
                onClick={togglePlayback}
                aria-label={isPlaying ? "Pausar carrusel" : "Reproducir carrusel"}
              >
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </Button>
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="h-11 w-11 rounded-full"
                onClick={scrollNext}
                aria-label="Imagen siguiente"
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GallerySection;
