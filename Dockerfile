FROM node:23-slim

RUN npm install -g pnpm

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN pnpm install

RUN pnpm exec next telemetry disable

COPY . .

CMD ["pnpm", "dev"]