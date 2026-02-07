# ICARO POS - Sistema de Punto de Venta

Sistema POS profesional desarrollado por Icarosoft para gestionar ventas, inventario y facturación.

## Características Principales

- 🚀 **Interfaz moderna** con React y Tailwind CSS
- 📱 **Diseño responsive** para todos los dispositivos
- 💳 **Gestión de pagos** integrada
- 📊 **Reportes y análisis** en tiempo real
- 🔧 **Fácil integración** con sistemas existentes

## Tecnologías Utilizadas

- **Frontend**: React 18 con TypeScript
- **Estilos**: Tailwind CSS + shadcn/ui
- **Animaciones**: Framer Motion
- **Build Tool**: Vite
- **Enrutamiento**: React Router DOM

## Instalación y Desarrollo

### Requisitos Previos

- Node.js (versión 18 o superior)
- npm o yarn

### Pasos de Instalación

```bash
# 1. Clonar el repositorio
git clone <URL_DEL_REPOSITORIO>
cd landing-pos

# 2. Instalar dependencias
npm install

# 3. Iniciar servidor de desarrollo
npm run dev

# 4. Abrir en el navegador
# La aplicación estará disponible en http://localhost:8080
```

## Scripts Disponibles

- `npm run dev` - Iniciar servidor de desarrollo
- `npm run build` - Construir para producción
- `npm run build:dev` - Construir para desarrollo
- `npm run preview` - Previsualizar build de producción
- `npm run lint` - Ejecutar linting del código
- `npm run test` - Ejecutar tests

## Estructura del Proyecto

```
src/
├── components/          # Componentes React
│   ├── landing/        # Componentes de la landing page
│   └── ui/             # Componentes UI base
├── assets/             # Imágenes y recursos estáticos
├── lib/                # Utilidades y configuraciones
└── styles/             # Estilos globales
```

## Despliegue

Para desplegar en producción:

```bash
npm run build
```

Los archivos generados estarán en la carpeta `dist/`.

## Soporte

Para soporte técnico o consultas:

- 📧 **Email**: info@icarosoft.com
- 🌐 **Web**: https://icarosoft.com

## Licencia

© 2024 Icarosoft. Todos los derechos reservados.
