# Admin panel build (PRD §9, §11). Build context is the repo root, so the root package-lock.json and the
# npm workspaces resolve: `docker build -f admin/Dockerfile .` (docker-compose.yml does this).
# The result is an artifact image holding only the built files at /dist; the backend image copies them
# and serves them at /admin, so this image is never run.

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

FROM scratch
COPY --from=build /app/admin/dist /dist
