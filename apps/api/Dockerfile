FROM node:20-alpine AS base
WORKDIR /app
RUN apk add --no-cache libc6-compat openssl

# ─── Dependencies ────────────────────────────────────────────────────────────
FROM base AS deps
COPY package*.json ./
COPY apps/api/package*.json ./apps/api/
COPY packages/db/package*.json ./packages/db/
COPY packages/config/package*.json ./packages/config/
RUN npm ci --workspace=apps/api --workspace=packages/db --workspace=packages/config

# ─── Builder ─────────────────────────────────────────────────────────────────
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN cd packages/db && npx prisma generate
RUN npm run build --workspace=apps/api

# ─── Runner ──────────────────────────────────────────────────────────────────
FROM base AS runner
ENV NODE_ENV=production
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nestjs

COPY --from=builder --chown=nestjs:nodejs /app/apps/api/dist ./dist
COPY --from=builder --chown=nestjs:nodejs /app/packages/db/generated ./packages/db/generated
COPY --from=deps --chown=nestjs:nodejs /app/node_modules ./node_modules

USER nestjs
EXPOSE 4000
CMD ["node", "dist/main"]
