# Build the static site, then serve dist/ with nginx.
# Coolify: Build Pack "Dockerfile", port 80. TLS and the domain are handled by Coolify's proxy.
FROM node:26-alpine AS build
WORKDIR /app
# Node 25+ no longer bundles Corepack; install it so the pinned pnpm (packageManager) is used.
RUN npm install -g corepack@latest && corepack enable
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm build

FROM nginx:stable-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
