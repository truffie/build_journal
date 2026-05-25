FROM node:24-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PNPM_HOME/bin:$PATH"
RUN apk add --no-cache libc6-compat && \
    corepack enable && \
    mkdir -p "$PNPM_HOME/bin" && \
    pnpm install turbo --global

FROM base AS builder
WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY . .
RUN turbo prune api --docker

FROM base AS installer
WORKDIR /app
ENV CI=true

COPY .gitignore .gitignore
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=builder /app/out/pnpm-workspace.yaml ./pnpm-workspace.yaml
COPY --from=builder /app/out/full/ .
COPY turbo.json turbo.json

RUN pnpm install --frozen-lockfile
RUN turbo run build --filter=api...

FROM installer AS deployer
RUN pnpm --filter api deploy --prod --legacy /prod/api

FROM node:24-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nestjs

COPY --from=deployer --chown=nestjs:nodejs /prod/api/node_modules ./node_modules
COPY --from=deployer --chown=nestjs:nodejs /prod/api/package.json ./package.json
COPY --from=installer --chown=nestjs:nodejs /app/apps/api/dist ./dist
COPY --from=installer --chown=nestjs:nodejs /app/apps/api/prisma ./prisma

USER nestjs
EXPOSE 4000
CMD ["node", "dist/src/main"]
