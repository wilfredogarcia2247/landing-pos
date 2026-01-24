# ---- Build stage ----
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files (mejor cache)
COPY package.json package-lock.json ./

# Instala TODAS las dependencias (incluye devDependencies necesarias para vite)
RUN npm ci

# Copy source code
COPY . .

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
