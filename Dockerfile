# Production image for the Lumen Realty website (Next.js standalone output).
FROM node:22-bookworm-slim AS deps
WORKDIR /app
RUN apt-get update && apt-get install -y --no-install-recommends python3 make g++ && rm -rf /var/lib/apt/lists/*
COPY package.json package-lock.json ./
RUN npm ci

FROM node:22-bookworm-slim AS build
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:22-bookworm-slim AS run
WORKDIR /app
ENV NODE_ENV=production NEXT_TELEMETRY_DISABLED=1 PORT=3000 HOSTNAME=0.0.0.0 LEADS_DB_PATH=/data/leads.db
RUN useradd --system --uid 1001 lumen && mkdir -p /data && chown lumen /data
COPY --from=build --chown=lumen /app/.next/standalone ./
COPY --from=build --chown=lumen /app/.next/static ./.next/static
COPY --from=build --chown=lumen /app/public ./public
USER lumen
VOLUME ["/data"]
EXPOSE 3000
CMD ["node", "server.js"]
