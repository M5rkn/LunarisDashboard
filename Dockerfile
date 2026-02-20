# Stage 1: Build
FROM node:20-alpine as build

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source files (exclude node_modules, dist)
COPY . .

# Verify source files exist
RUN echo "=== SOURCE FILES ===" && ls -la src/ || true
RUN echo "=== MAIN.JS CHECK ===" && test -f src/main.js && echo "main.js EXISTS" || echo "main.js MISSING"

# Build the app
RUN npm run build

# Verify build output
RUN echo "=== DIST FILES AFTER BUILD ===" && ls -la dist/ || true

# Stage 2: Serve
FROM nginx:alpine

# Copy built files to nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Copy nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Verify deployment
RUN echo "=== DEPLOYED FILES ===" && ls -la /usr/share/nginx/html/ || true

# Expose port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
