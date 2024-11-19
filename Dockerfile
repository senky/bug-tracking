FROM node:22.11.0-alpine AS base

###############################################################################
# Deps
###############################################################################
FROM base AS deps

WORKDIR /app

COPY package.json package-lock.json ./

ENV NODE_ENV=production
RUN npm ci

###############################################################################
# Frontend
###############################################################################
FROM base AS frontend

WORKDIR /app

COPY package.json package-lock.json ./
COPY --from=deps /app/node_modules ./node_modules
# We have to install deps again because `vite` executable is not available in the node_modules
RUN npm install

COPY /client ./client

ENV NODE_ENV=production
RUN npm run client:build

###############################################################################
# Runtime
###############################################################################
FROM nginx AS runtime
RUN apt-get update && apt-get install -y curl && apt-get clean

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# A hack taken from https://stackoverflow.com/a/57546198
RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.0/install.sh | bash
ENV NVM_DIR=/root/.nvm
RUN . "$NVM_DIR/nvm.sh" && nvm install 22.11.0
ENV PATH="/root/.nvm/versions/node/v22.11.0/bin/:${PATH}"

COPY package.json ./
COPY --from=deps /app/node_modules ./node_modules
COPY --from=frontend /app/client/dist /usr/share/nginx/html
COPY ./server ./server

COPY ./docker/nginx.conf /etc/nginx/nginx.conf
COPY ./docker/entrypoint.sh /docker/entrypoint.sh
ENTRYPOINT ["/docker/entrypoint.sh"]
