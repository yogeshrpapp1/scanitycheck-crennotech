# --- Stage 1: Build dependencies (common for both) ---
FROM node:24-alpine AS deps
# Required for some native dependencies to work on Alpine
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# --- Stage 2: Development (active coding) ---
FROM node:24-alpine AS development
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Vite specific: ensure the cache directory is writable
RUN mkdir -p node_modules/.vite && chmod -R 777 node_modules/.vite
EXPOSE 5173
# Allow access from outside the container by passing --host to internal command (vite)
CMD ["npm", "run", "dev", "--", "--host"]

# --- Stage 3: Build (preparing for production) ---
FROM development AS build
RUN npm run build

# --- Stage 4: Production (The Nginx setup) ---
FROM nginx:stable-alpine AS production
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]