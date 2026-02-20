# Stage 1: Build
FROM node:20-alpine as build

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source files
COPY . .

# Build the app with verbose output
RUN npm run build 2>&1 | tee build.log

# Show build output
RUN echo "=== BUILD LOG ===" && cat build.log || true
RUN echo "=== DIST FILES ===" && ls -la dist/ || true

# Stage 2: Serve
FROM nginx:alpine

# Copy built files to nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Copy nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Show deployed files
RUN echo "=== DEPLOYED FILES ===" && ls -la /usr/share/nginx/html/ || true

# Expose port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
