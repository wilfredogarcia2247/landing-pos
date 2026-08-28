# ---- Build stage ----
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files (mejor cache)
COPY package.json package-lock.json ./

# Instala TODAS las dependencias (incluye devDependencies necesarias para vite)
RUN npm ci

# Copy source code
COPY . .

# CapRover inyecta las env vars de la app como build-args.
# No pongas valores aquí: configúralos en el panel (App Configs > Environmental Variables).
ARG CAPROVER_GIT_COMMIT_SHA
ARG VITE_GRAPHQL_ENDPOINT
ENV VITE_GRAPHQL_ENDPOINT=$VITE_GRAPHQL_ENDPOINT

RUN if [ -z "$VITE_GRAPHQL_ENDPOINT" ]; then \
      echo "Falta VITE_GRAPHQL_ENDPOINT. Defínela en las variables de entorno de CapRover." >&2; \
      exit 1; \
    fi

# Build the application (genera /dist)
RUN npm run build


# ---- Production stage ----
FROM nginx:alpine

# Copy built files from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
