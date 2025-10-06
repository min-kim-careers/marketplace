# --- Base ---
FROM node:23-slim AS base
RUN npm install -g pnpm
WORKDIR /app

# --- Dependencies ---
FROM base AS deps
ENV NODE_ENV=development
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
RUN pnpm exec next telemetry disable

# --- Build ---
FROM deps AS build
ENV NODE_ENV=production

ARG API_URL
ARG GATEWAY_URL
ARG NEXT_PUBLIC_CHAT_URL
ARG NEXT_PUBLIC_APP_URL
ARG NEXT_PUBLIC_CONTACT
ARG NEXT_PUBLIC_SITE_KEY

ENV API_URL=${API_URL}
ENV GATEWAY_URL=${GATEWAY_URL}
ENV NEXT_PUBLIC_CHAT_URL=${NEXT_PUBLIC_CHAT_URL}
ENV NEXT_PUBLIC_APP_URL=${NEXT_PUBLIC_APP_URL}
ENV NEXT_PUBLIC_CONTACT=${NEXT_PUBLIC_CONTACT}
ENV NEXT_PUBLIC_SITE_KEY=${NEXT_PUBLIC_SITE_KEY}

COPY . .
RUN pnpm build

# --- Prod ---
FROM node:23-slim AS prod
RUN npm install -g pnpm
WORKDIR /app
ENV NODE_ENV=production

COPY --from=build /app ./

CMD ["pnpm", "start"]

# --- Dev ---
FROM deps AS dev
COPY . .
CMD ["pnpm", "dev"]
