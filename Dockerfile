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
# Runtime
###############################################################################
FROM base AS runtime

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=80

COPY --from=deps /app/node_modules ./node_modules
COPY ./ ./

CMD ["npm", "run", "server:start"]
EXPOSE 80
