# Admin panel image (PRD §9, §11): nginx serves the built app at /admin and proxies /admin/api and
# /admin/queues to the backend at BACKEND_URL. Build context is the repo root, so the root
# package-lock.json and the npm workspaces resolve: `docker build -f admin/Dockerfile .`

FROM node:22-alpine AS build
WORKDIR /app
ENV MONGOMS_DISABLE_POSTINSTALL=1
COPY package.json package-lock.json ./
COPY admin/package.json admin/
COPY web/package.json web/
COPY backend/package.json backend/
RUN npm ci -w admin --include-workspace-root=false
COPY admin/ admin/
RUN npm run build -w admin

FROM nginx:1.27-alpine
ENV BACKEND_URL=http://backend:3000
COPY admin/nginx.conf.template /etc/nginx/templates/default.conf.template
COPY --from=build /app/admin/dist /usr/share/nginx/html/admin
EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=5s CMD wget -qO- http://127.0.0.1:8080/healthz >/dev/null || exit 1
